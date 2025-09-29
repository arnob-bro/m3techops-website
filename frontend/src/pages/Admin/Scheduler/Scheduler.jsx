import { useState, useEffect } from 'react';
import { 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiPlus, 
  FiEdit, 
  FiTrash, 
  FiSave,
  FiX,
  FiFilter,
  FiCheckSquare,
  FiSquare,
  FiRefreshCw,
  FiArchive 
} from 'react-icons/fi';
import './Scheduler.css';
import useUserStore from "../../../stores/userStore";
import SchedulerApi from "../../../apis/schedulerApi";
import EmployeeApi from "../../../apis/employeeApi";

const Scheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [availabilityDateFilter, setAvailabilityDateFilter] = useState('');
  
  const { user } = useUserStore();
  const schedulerApi = new SchedulerApi();
  const employeeApi = new EmployeeApi();

  // State for employees and schedules
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [mySchedules, setMySchedules] = useState([]);
  const [scheduleHistory, setScheduleHistory] = useState([]);
  const [commonSlots, setCommonSlots] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [employeesLoading, setEmployeesLoading] = useState(true);

  // Form data
  const [formData, setFormData] = useState({
    start_date: '',
    start_time: '',
    end_date: '',
    end_time: '',
    title: '',
    description: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchEmployees();
    fetchMySchedule();
    fetchScheduleHistory();
  }, []);

  // Fetch all schedules when week changes or employees load
  useEffect(() => {
    if (employees.length > 0) {
      fetchAllSchedules();
    }
  }, [currentDate, employees]);

  // Use the same API for common slots as the calendar
  useEffect(() => {
    if (selectedEmployees.length > 0) {
      fetchCommonSlotsUsingSameAPI();
    } else {
      setCommonSlots([]);
    }
  }, [selectedEmployees, currentDate, allSchedules, availabilityDateFilter]);

  const fetchEmployees = async () => {
    try {
      setEmployeesLoading(true);
      const response = await employeeApi.getEmployees();
      if (response.success) {
        const colors = ['#1CB0A2', '#067ECC', '#FB9227', '#9333ea', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
        const employeesWithColors = response.employees.map((emp, index) => ({
          ...emp,
          color: colors[index % colors.length]
        }));
        setEmployees(employeesWithColors);
        console.log('Employees loaded:', employeesWithColors.length);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError('Failed to load employees');
    } finally {
      setEmployeesLoading(false);
    }
  };

  const fetchMySchedule = async () => {
    try {
      const response = await schedulerApi.getMySchedule();
      if (response.success) {
        const now = new Date();
        // Filter out past schedules - only keep future and current schedules
        const activeSchedules = (response.data || []).filter(schedule => {
          const endTime = new Date(schedule.end_time);
          return endTime >= now;
        });
        setMySchedules(activeSchedules);
        console.log('My active schedules loaded:', activeSchedules.length);
      }
    } catch (error) {
      console.error('Error fetching my schedule:', error);
    }
  };

  const fetchScheduleHistory = async () => {
    try {
      const response = await schedulerApi.getMySchedule();
      if (response.success) {
        const now = new Date();
        // Filter for past schedules only
        const pastSchedules = (response.data || []).filter(schedule => {
          const endTime = new Date(schedule.end_time);
          return endTime < now;
        });
        setScheduleHistory(pastSchedules);
        console.log('Schedule history loaded:', pastSchedules.length);
      }
    } catch (error) {
      console.error('Error fetching schedule history:', error);
    }
  };

  const fetchAllSchedules = async () => {
    try {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);

      // Get ALL employee IDs including current user
      const allEmployeeIds = employees.map(emp => emp.employee_id);
      
      // Ensure current user is included
      if (user?.employee_id && !allEmployeeIds.includes(user.employee_id)) {
        allEmployeeIds.push(user.employee_id);
      }

      const response = await schedulerApi.getEmployeeSchedules(
        allEmployeeIds,
        startOfWeek.toISOString(),
        endOfWeek.toISOString()
      );
      
      if (response.success) {
        setAllSchedules(response.data || []);
        console.log('All schedules loaded for calendar:', response.data);
      }
    } catch (error) {
      console.error('Error fetching all schedules:', error);
    }
  };

  // FIXED: Using hour-based approach for better multi-employee detection
  const fetchCommonSlotsUsingSameAPI = () => {
    console.log('=== FETCHING COMMON SLOTS ===');
    console.log('Selected employees:', selectedEmployees);
    
    if (!selectedEmployees || selectedEmployees.length === 0) {
      console.log('No employees selected, clearing common slots');
      setCommonSlots([]);
      return;
    }

    try {
      // Use the same data that's already loaded for the calendar
      let selectedEmployeeSchedules = allSchedules.filter(schedule => 
        selectedEmployees.includes(schedule.employee_id)
      );

      // Filter by date if date filter is applied
      if (availabilityDateFilter) {
        const filterDate = new Date(availabilityDateFilter);
        filterDate.setHours(0, 0, 0, 0);
        
        const nextDay = new Date(filterDate);
        nextDay.setDate(filterDate.getDate() + 1);
        
        selectedEmployeeSchedules = selectedEmployeeSchedules.filter(schedule => {
          const scheduleDate = new Date(schedule.start_time);
          scheduleDate.setHours(0, 0, 0, 0);
          return scheduleDate.getTime() === filterDate.getTime();
        });
      } else {
        // Filter out past schedules when no date filter is applied
        const now = new Date();
        selectedEmployeeSchedules = selectedEmployeeSchedules.filter(schedule => {
          const endTime = new Date(schedule.end_time);
          return endTime >= now;
        });
      }

      console.log('Filtered employee schedules count:', selectedEmployeeSchedules.length);

      if (selectedEmployeeSchedules.length === 0) {
        setCommonSlots([]);
        return;
      }

      let commonSlotsResult = [];

      if (selectedEmployees.length === 1) {
        // Single employee - show all their slots
        commonSlotsResult = selectedEmployeeSchedules.map(schedule => ({
          start_time: schedule.start_time,
          end_time: schedule.end_time,
          employee_count: 1,
          employees: [schedule.employee_id]
        }));
      } else {
        // Multiple employees - use hour-based approach
        commonSlotsResult = findCommonSlotsByHour(selectedEmployeeSchedules, selectedEmployees);
      }

      console.log('Common slots found:', commonSlotsResult.length);
      setCommonSlots(commonSlotsResult);

      // Log each common slot for debugging
      commonSlotsResult.forEach((slot, index) => {
        console.log(`✅ Common Slot ${index + 1}:`, {
          start: slot.start_time,
          end: slot.end_time,
          employees: slot.employees.length,
          formatted: `${formatScheduleTime(slot.start_time)} - ${formatScheduleTime(slot.end_time)}`
        });
      });

    } catch (error) {
      console.error('❌ Error in fetchCommonSlotsUsingSameAPI:', error);
      setCommonSlots([]);
      setError('Failed to calculate common available times.');
    }
  };

  // ALTERNATIVE: Simpler approach using hour-based intervals
  const findCommonSlotsByHour = (schedules, employeeIds) => {
    const commonSlots = [];
    
    // Create hourly intervals for the current week or filtered date
    let startDate, endDate;
    
    if (availabilityDateFilter) {
      startDate = new Date(availabilityDateFilter);
      startDate.setHours(0, 0, 0, 0);
      endDate = new Date(availabilityDateFilter);
      endDate.setHours(23, 59, 59, 999);
    } else {
      startDate = new Date(currentDate);
      startDate.setDate(currentDate.getDate() - currentDate.getDay());
      startDate.setHours(0, 0, 0, 0);
      
      endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);
      endDate.setHours(23, 59, 59, 999);
    }

    // Check each hour of the date range
    const currentDay = new Date(startDate);
    while (currentDay <= endDate) {
      for (let hour = 0; hour < 24; hour++) {
        const slotStart = new Date(currentDay);
        slotStart.setHours(hour, 0, 0, 0);
        
        const slotEnd = new Date(currentDay);
        slotEnd.setHours(hour + 1, 0, 0, 0);

        // Skip if slot is in the past when no date filter is applied
        if (!availabilityDateFilter && slotStart < new Date()) {
          continue;
        }

        // Check if all selected employees are available during this hour
        const allAvailable = employeeIds.every(empId => {
          return schedules.some(schedule => {
            const scheduleStart = new Date(schedule.start_time);
            const scheduleEnd = new Date(schedule.end_time);
            return schedule.employee_id === empId && 
                   scheduleStart <= slotStart && 
                   scheduleEnd >= slotEnd;
          });
        });

        if (allAvailable) {
          commonSlots.push({
            start_time: slotStart.toISOString(),
            end_time: slotEnd.toISOString(),
            employee_count: employeeIds.length,
            employees: employeeIds
          });
        }
      }
      currentDay.setDate(currentDay.getDate() + 1);
    }

    // Merge consecutive hourly slots
    const mergedSlots = [];
    commonSlots.sort((a, b) => new Date(a.start_time) - new Date(b.start_time));

    for (let i = 0; i < commonSlots.length; i++) {
      const currentSlot = commonSlots[i];
      
      if (mergedSlots.length === 0) {
        mergedSlots.push(currentSlot);
        continue;
      }

      const lastSlot = mergedSlots[mergedSlots.length - 1];
      const currentStart = new Date(currentSlot.start_time);
      const lastEnd = new Date(lastSlot.end_time);

      // If current slot starts when last slot ends, merge them
      if (currentStart.getTime() === lastEnd.getTime()) {
        lastSlot.end_time = currentSlot.end_time;
      } else {
        mergedSlots.push(currentSlot);
      }
    }

    return mergedSlots;
  };

  // Helper function to get employee names for display
  const getEmployeeNames = (employeeIds) => {
    return employeeIds.map(empId => {
      const employee = employees.find(emp => emp.employee_id === empId);
      return employee ? `${employee.first_name} ${employee.last_name}` : 'Unknown';
    }).join(', ');
  };

  // Calendar helper functions
  const getWeekDates = (date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startOfWeek);
      currentDate.setDate(startOfWeek.getDate() + i);
      week.push(currentDate);
    }
    return week;
  };

  const weekDates = getWeekDates(currentDate);
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, '0')}:00`;
  });

  // FIXED: Enhanced time formatting with better error handling
  const formatScheduleTime = (dateString) => {
    try {
      if (!dateString) return 'Invalid time';
      const date = new Date(dateString);
      if (date.toString() === 'Invalid Date') return 'Invalid time';
      
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } catch (error) {
      console.error('Error formatting time:', error, dateString);
      return 'Invalid time';
    }
  };

  // FIXED: Enhanced date formatting with better error handling
  const formatScheduleDate = (dateString) => {
    try {
      if (!dateString) return 'Invalid date';
      const date = new Date(dateString);
      if (date.toString() === 'Invalid Date') return 'Invalid date';
      
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, dateString);
      return 'Invalid date';
    }
  };

  const getSlotsForTimeCell = (date, time) => {
    const hour = parseInt(time.split(':')[0]);
    
    const cellStart = new Date(date);
    cellStart.setHours(hour, 0, 0, 0);
    
    const cellEnd = new Date(date);
    cellEnd.setHours(hour + 1, 0, 0, 0);
    
    // Filter out past schedules for calendar display
    const now = new Date();
    const filteredSlots = allSchedules.filter(slot => {
      const slotStart = new Date(slot.start_time);
      const slotEnd = new Date(slot.end_time);
      
      // Check if slot overlaps with this hour cell and is not in the past
      const overlaps = slotStart < cellEnd && slotEnd > cellStart;
      const isFutureOrPresent = slotEnd >= now;
      
      return overlaps && isFutureOrPresent;
    });
    
    // Group by employee and return employee names
    const employeeNames = [];
    const processedEmployees = new Set();
    
    filteredSlots.forEach(slot => {
      if (!processedEmployees.has(slot.employee_id)) {
        const employee = employees.find(emp => emp.employee_id === slot.employee_id) || {};
        if (employee.first_name) {
          employeeNames.push(employee.first_name);
        }
        processedEmployees.add(slot.employee_id);
      }
    });
    
    return {
      slots: filteredSlots,
      employeeNames: employeeNames
    };
  };

  const handleStartDateChange = (date) => {
    setFormData(prev => ({
      ...prev,
      start_date: date,
      end_date: date
    }));
  };

  const refreshAllData = async () => {
    try {
      await fetchMySchedule();
      await fetchScheduleHistory();
      await fetchAllSchedules();
      
      if (selectedEmployees.length > 0) {
        fetchCommonSlotsUsingSameAPI();
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
      const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);
      const now = new Date();

      // Validation: Cannot schedule in the past
      if (startDateTime < now) {
        setError('Cannot schedule in the past. Please select a future date and time.');
        setLoading(false);
        return;
      }

      // Adjust for timezone offset
      const timezoneOffset = startDateTime.getTimezoneOffset() * 60000;
      const startISODate = new Date(startDateTime.getTime() - timezoneOffset).toISOString();
      const endISODate = new Date(endDateTime.getTime() - timezoneOffset).toISOString();

      if (startDateTime >= endDateTime) {
        setError('End time must be after start time');
        return;
      }

      const scheduleData = {
        start_time: startISODate,
        end_time: endISODate,
        title: formData.title,
        description: formData.description
      };

      if (editingSlot) {
        await schedulerApi.updateSchedule(editingSlot.id, scheduleData);
      } else {
        await schedulerApi.createSchedule(scheduleData);
      }

      setShowAddModal(false);
      setFormData({
        start_date: '',
        start_time: '',
        end_date: '',
        end_time: '',
        title: '',
        description: ''
      });
      setEditingSlot(null);
      
      await refreshAllData();
    } catch (err) {
      setError(err.response?.data?.error || err.error || 'Failed to save schedule');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (slot) => {
    const now = new Date();
    const slotEndTime = new Date(slot.end_time);
    
    // Check if the schedule has expired (end time is in the past)
    if (slotEndTime < now) {
      setError('Cannot edit expired schedules. This schedule has been moved to history.');
      return;
    }

    const startDate = new Date(slot.start_time).toISOString().split('T')[0];
    const startTime = new Date(slot.start_time).toTimeString().slice(0, 5);
    const endDate = new Date(slot.end_time).toISOString().split('T')[0];
    const endTime = new Date(slot.end_time).toTimeString().slice(0, 5);

    setEditingSlot(slot);
    setFormData({
      start_date: startDate,
      start_time: startTime,
      end_date: endDate,
      end_time: endTime,
      title: slot.title || '',
      description: slot.description || ''
    });
    setShowAddModal(true);
    setError('');
  };

  const handleDelete = async (slotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      try {
        await schedulerApi.deleteSchedule(slotId);
        await refreshAllData();
      } catch (error) {
        setError('Failed to delete schedule');
      }
    }
  };

  const toggleEmployeeSelection = (employeeId) => {
    setSelectedEmployees(prev => 
      prev.includes(employeeId) 
        ? prev.filter(id => id !== employeeId)
        : [...prev, employeeId]
    );
  };

  const selectAllEmployees = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(employees.map(emp => emp.employee_id));
    }
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  return (
    <div className="scheduler">
      <div className="scheduler-header">
        <div className="header-left">
          <h2>Free Time Scheduler</h2>
          <p>Manage your availability and find common meeting times</p>
        </div>
        
        <div className="header-actions">
          {/* <button 
            onClick={() => setShowHistoryModal(true)}
            className="history-btn"
          >
            <FiArchive /> Schedule History
          </button> */}
          <button 
            onClick={() => {
              setShowAddModal(true);
              setEditingSlot(null);
              const today = new Date().toISOString().split('T')[0];
              setFormData({
                start_date: today,
                start_time: '09:00',
                end_date: today,
                end_time: '17:00',
                title: '',
                description: ''
              });
              setError('');
            }}
            className="add-slot-btn"
          >
            <FiPlus /> Add Availability
          </button>
        </div>
      </div>

      {/* My Schedule Card */}
      <div className="my-schedule-card">
        <div className="schedule-card-header">
          <h3>
            <FiCalendar /> My Schedule
            <span className="schedule-count">({mySchedules.length} slots)</span>
          </h3>
          <button 
            onClick={() => setShowHistoryModal(true)}
            className="view-history-btn"
          >
            <FiArchive /> View History ({scheduleHistory.length})
          </button>
        </div>
        
        {mySchedules.length > 0 ? (
          <div className="schedule-list">
            {mySchedules.map(slot => (
              <div key={slot.id} className="schedule-item">
                <div className="schedule-period">
                  <div className="time-section from-section">
                    <div className="section-label">From:</div>
                    <div className="date">date: {new Date(slot.start_time).toLocaleDateString('en-GB')}</div>
                    <div className="day">day: {new Date(slot.start_time).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                    <div className="time">time: {new Date(slot.start_time).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    }).toLowerCase()}</div>
                  </div>
                  
                  <div className="arrow-separator">→</div>
                  
                  <div className="time-section to-section">
                    <div className="section-label">To:</div>
                    <div className="date">date: {new Date(slot.end_time).toLocaleDateString('en-GB')}</div>
                    <div className="day">day: {new Date(slot.end_time).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                    <div className="time">time: {new Date(slot.end_time).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    }).toLowerCase()}</div>
                  </div>
                </div>
                
                <div className="schedule-actions">
                  <button onClick={() => handleEdit(slot)} className="edit-btn">
                    <FiEdit />
                  </button>
                  <button onClick={() => handleDelete(slot.id)} className="delete-btn">
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-schedules">
            <p>No active schedule slots. Add new availability or check history for past schedules.</p>
            <button onClick={() => setShowAddModal(true)} className="add-first-btn">
              <FiPlus /> Add Time Slot
            </button>
          </div>
        )}
      </div>

      {/* Employee Filter Section with Integrated Date Filter */}
      <div className="employee-filter-card">
        <div className="filter-header">
          <h3>
            <FiFilter /> Select Employees to Check Common Availability
          </h3>
          <div className="filter-controls">
            <button 
              onClick={selectAllEmployees}
              className="select-all-btn"
            >
              {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
            </button>
            
            {/* Date Filter Button and Input - Only show when employees are selected */}
            {selectedEmployees.length > 0 && (
              <div className="date-filter-container">
                <button 
                  onClick={() => document.getElementById('date-filter-input').focus()}
                  className="date-filter-btn"
                  title="Filter by date"
                >
                  <FiCalendar /> Date Filter
                </button>
                <input
                  id="date-filter-input"
                  type="date"
                  value={availabilityDateFilter}
                  onChange={(e) => setAvailabilityDateFilter(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="date-filter-input"
                />
                {availabilityDateFilter && (
                  <button 
                    onClick={() => setAvailabilityDateFilter('')}
                    className="clear-filter-btn"
                    title="Clear date filter"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {employeesLoading ? (
          <div className="employees-loading">Loading employees...</div>
        ) : (
          <div className="employee-checkboxes">
            {employees.map(employee => (
              <label key={employee.employee_id} className="employee-checkbox">
                <input
                  type="checkbox"
                  checked={selectedEmployees.includes(employee.employee_id)}
                  onChange={() => toggleEmployeeSelection(employee.employee_id)}
                />
                <span 
                  className="checkmark"
                  style={{ color: employee.color }}
                >
                  {selectedEmployees.includes(employee.employee_id) ? <FiCheckSquare /> : <FiSquare />}
                </span>
                <span 
                  className="employee-color-indicator"
                  style={{ backgroundColor: employee.color }}
                ></span>
                <span className="employee-name">
                  {employee.first_name} {employee.last_name}
                </span>
                {employee.position && (
                  <span className="employee-position">({employee.position})</span>
                )}
              </label>
            ))}
          </div>
        )}
        
        {/* Filter Status */}
        {selectedEmployees.length > 0 && availabilityDateFilter && (
          <div className="filter-status">
            <p>
              Showing available times for <strong>{new Date(availabilityDateFilter).toLocaleDateString()}</strong>
            </p>
          </div>
        )}
      </div>

      {/* FIXED: Common Available Slots Card - Now with better multi-employee support */}
      {selectedEmployees.length > 0 && (
        <div className="quick-view-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '12px' }}>
              <FiUsers color="#1CB0A2" /> 
              {selectedEmployees.length === 1 ? 'Available Times' : 'Common Available Times'}
              <span className="slot-count">({commonSlots.length} slots)</span>
            </h3>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <button 
                onClick={fetchCommonSlotsUsingSameAPI}
                className="today-btn"
                style={{ fontSize: '12px', padding: '8px 12px' }}
                title="Refresh common slots"
              >
                <FiRefreshCw /> Refresh
              </button>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {selectedEmployees.length} employee{selectedEmployees.length > 1 ? 's' : ''} selected
              </div>
            </div>
          </div>

          {commonSlots.length > 0 ? (
            <div className="common-slots-grid">
              {commonSlots.map((slot, index) => (
                <div key={`common-slot-${index}`} className="common-slot-item highlight">
                  <div className="slot-date">
                    {formatScheduleDate(slot.start_time)}
                  </div>
                  <div className="slot-time">
                    {formatScheduleTime(slot.start_time)} - {formatScheduleTime(slot.end_time)}
                  </div>
                  <div className="slot-admins">
                    {selectedEmployees.length === 1 
                      ? `${getEmployeeNames(slot.employees)} available`
                      : `All ${selectedEmployees.length} employees available`
                    }
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-common-slots">
              <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '16px' }}>
                {availabilityDateFilter
                  ? `No available times found for ${selectedEmployees.length === 1 ? 'this employee' : 'the selected employees'} on ${new Date(availabilityDateFilter).toLocaleDateString()}.`
                  : selectedEmployees.length === 1
                    ? "No available times found for this employee in the current week."
                    : "No common available times found for all selected employees in this week."
                }
              </p>
              <div style={{ textAlign: 'center' }}>
                <button 
                  onClick={refreshAllData}
                  className="add-first-btn"
                  style={{ fontSize: '14px' }}
                >
                  <FiRefreshCw /> Refresh Data
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Calendar Navigation */}
      <div className="calendar-nav">
        <div className="nav-controls">
          <button onClick={() => navigateWeek(-1)} className="nav-btn">
            ← Previous Week
          </button>
          <button onClick={() => setCurrentDate(new Date())} className="today-btn">
            <FiRefreshCw /> Today
          </button>
          <button onClick={() => navigateWeek(1)} className="nav-btn">
            Next Week →
          </button>
        </div>
        
        <div className="date-range">
          {weekDates[0].toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} - {' '}
          {weekDates[6].toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      {/* Weekly Calendar View */}
      <div className="calendar-container">
        <div className="calendar-grid">
          {/* Time column */}
          <div className="time-column">
            <div className="time-header"></div>
            {timeSlots.map(time => (
              <div key={time} className="time-slot">
                {time}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map((date, dayIndex) => (
            <div key={dayIndex} className="day-column">
              <div className="day-header">
                <div className="day-name">{dayNames[dayIndex]}</div>
                <div className="day-number">{date.getDate()}</div>
              </div>
              
              <div className="day-slots">
                {timeSlots.map((time, timeIndex) => {
                  const cellData = getSlotsForTimeCell(date, time);
                  const { slots, employeeNames } = cellData;
                  
                  return (
                    <div key={timeIndex} className="time-cell">
                      {employeeNames.length > 0 && (
                        <div
                          className="availability-slot"
                          style={{ 
                            backgroundColor: 'rgba(28, 176, 162, 0.2)',
                            borderLeft: '3px solid #1CB0A2',
                            fontSize: '11px',
                            padding: '4px',
                            borderRadius: '6px'
                          }}
                          title={`Available: ${employeeNames.join(', ')}`}
                        >
                          <div className="slot-content">
                            <div className="slot-employee" style={{ fontWeight: '600', color: '#1e293b' }}>
                              {employeeNames.join(', ')}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingSlot ? 'Edit Availability' : 'Add Availability'}</h3>
              <button onClick={() => setShowAddModal(false)} className="close-btn">
                <FiX />
              </button>
            </div>

            <div className="modal-form">
              {error && <div className="error-message">{error}</div>}
              
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleStartDateChange(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    name="start_time"
                    value={formData.start_time}
                    onChange={(e) => setFormData(prev => ({...prev, start_time: e.target.value}))}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    min={formData.start_date || new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData(prev => ({...prev, end_date: e.target.value}))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    name="end_time"
                    value={formData.end_time}
                    onChange={(e) => setFormData(prev => ({...prev, end_time: e.target.value}))}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button onClick={() => setShowAddModal(false)} className="cancel-btn">
                  Cancel
                </button>
                <button onClick={handleSubmit} disabled={loading} className="save-btn">
                  <FiSave /> {loading ? 'Saving...' : (editingSlot ? 'Update' : 'Save')}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Schedule History Modal */}
      {showHistoryModal && (
        <div className="modal-overlay">
          <div className="modal history-modal">
            <div className="modal-header">
              <h3>
                <FiArchive /> Schedule History
                <span className="history-count">({scheduleHistory.length} past schedules)</span>
              </h3>
              <button onClick={() => setShowHistoryModal(false)} className="close-btn">
                <FiX />
              </button>
            </div>

            <div className="modal-content">
              {scheduleHistory.length > 0 ? (
                <div className="history-list">
                  {scheduleHistory.map(slot => (
                    <div key={slot.id} className="history-item expired">
                      <div className="schedule-period">
                        <div className="time-section from-section">
                          <div className="section-label">From:</div>
                          <div className="date">date: {new Date(slot.start_time).toLocaleDateString('en-GB')}</div>
                          <div className="day">day: {new Date(slot.start_time).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                          <div className="time">time: {new Date(slot.start_time).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          }).toLowerCase()}</div>
                        </div>
                        
                        <div className="arrow-separator">→</div>
                        
                        <div className="time-section to-section">
                          <div className="section-label">To:</div>
                          <div className="date">date: {new Date(slot.end_time).toLocaleDateString('en-GB')}</div>
                          <div className="day">day: {new Date(slot.end_time).toLocaleDateString('en-US', { weekday: 'long' })}</div>
                          <div className="time">time: {new Date(slot.end_time).toLocaleTimeString('en-US', { 
                            hour: '2-digit', 
                            minute: '2-digit',
                            hour12: true 
                          }).toLowerCase()}</div>
                        </div>
                      </div>
                      <div className="history-badge">
                        Expired
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-history">
                  <p>No schedule history found.</p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowHistoryModal(false)} className="cancel-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Scheduler;