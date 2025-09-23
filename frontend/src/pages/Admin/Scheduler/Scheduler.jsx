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
  FiRefreshCw
} from 'react-icons/fi';
import './Scheduler.css';
import useUserStore from "../../../stores/userStore";
import SchedulerApi from "../../../apis/schedulerApi";
import EmployeeApi from "../../../apis/employeeApi";

const Scheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user } = useUserStore();
  const schedulerApi = new SchedulerApi();
  const employeeApi = new EmployeeApi();

  // State for employees and schedules
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [mySchedules, setMySchedules] = useState([]);
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
  }, []);

  // Fetch all schedules when week changes
  // Fetch all schedules when week changes or employees load
// Fetch all schedules when week changes or employees list updates
useEffect(() => {
  if (employees.length > 0) {
    fetchAllSchedules();
  }
}, [currentDate, employees]);

  // Fetch common slots when selected employees change
  useEffect(() => {
    if (selectedEmployees.length > 0) {
      fetchCommonSlots();
    } else {
      setCommonSlots([]);
    }
  }, [selectedEmployees]);

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
        setMySchedules(response.data || []);
        console.log('My schedules loaded:', response.data);
      }
    } catch (error) {
      console.error('Error fetching my schedule:', error);
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

    console.log('Fetching ALL schedules for week:', {
      start: startOfWeek.toISOString(),
      end: endOfWeek.toISOString(),
      user: user?.employee_id
    });

    // Get ALL employee IDs including current user
    const allEmployeeIds = employees.map(emp => emp.employee_id);
    
    // Ensure current user is included
    if (user?.employee_id && !allEmployeeIds.includes(user.employee_id)) {
      allEmployeeIds.push(user.employee_id);
    }

    console.log('Fetching schedules for employees:', allEmployeeIds);

    const response = await schedulerApi.getEmployeeSchedules(
      allEmployeeIds,
      startOfWeek.toISOString(),
      endOfWeek.toISOString()
    );
    
    console.log('All schedules response:', response);
    
    if (response.success) {
      setAllSchedules(response.data || []);
      console.log('Total schedules loaded:', response.data.length);
      
      // Debug info
      const mySchedulesInAll = response.data.filter(slot => slot.employee_id === user?.employee_id);
      console.log('My schedules in allSchedules:', mySchedulesInAll.length);
    }
  } catch (error) {
    console.error('Error fetching all schedules:', error);
  }
};

  const fetchCommonSlots = async () => {
    try {
      const startOfWeek = new Date(currentDate);
      startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const response = await schedulerApi.getCommonSlots(selectedEmployees, {
        start_date: startOfWeek.toISOString().split('T')[0],
        end_date: endOfWeek.toISOString().split('T')[0]
      });
      if (response.success) {
        setCommonSlots(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching common slots:', error);
    }
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

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Check if a slot should be displayed in a specific hour cell
// Check if a slot should be displayed in a specific hour cell
const getSlotsForTimeCell = (date, time) => {
  const hour = parseInt(time.split(':')[0]);
  
  const cellStart = new Date(date);
  cellStart.setHours(hour, 0, 0, 0);
  
  const cellEnd = new Date(date);
  cellEnd.setHours(hour + 1, 0, 0, 0); // Changed to hour+1 to get the full hour range
  
  const filteredSlots = allSchedules.filter(slot => {
    const slotStart = new Date(slot.start_time);
    const slotEnd = new Date(slot.end_time);
    
    // Check if slot overlaps with this hour cell
    const overlaps = slotStart < cellEnd && slotEnd > cellStart;
    
    return overlaps;
  });
  
  return filteredSlots;
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
    await fetchAllSchedules();
    
    if (selectedEmployees.length > 0) {
      await fetchCommonSlots();
    }
  } catch (error) {
    console.error('Error refreshing data:', error);
  }
};


// Update handleSubmit function
const handleSubmit = async () => {
  setError('');
  setLoading(true);

  try {
    const startDateTime = new Date(`${formData.start_date}T${formData.start_time}`);
    const endDateTime = new Date(`${formData.end_date}T${formData.end_time}`);

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
    
    // Use the new refresh function
    await refreshAllData();
  } catch (err) {
    setError(err.response?.data?.error || err.error || 'Failed to save schedule');
  } finally {
    setLoading(false);
  }
};


  const handleEdit = (slot) => {
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
      await refreshAllData(); // Use the new refresh function
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

  const formatScheduleDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatScheduleTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="scheduler">
      <div className="scheduler-header">
        <div className="header-left">
          <h2>Free Time Scheduler</h2>
          <p>Manage your availability and find common meeting times</p>
        </div>
        
        <div className="header-actions">
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
            <p>No schedule slots added yet.</p>
            <button onClick={() => setShowAddModal(true)} className="add-first-btn">
              <FiPlus /> Add Time Slot
            </button>
          </div>
        )}
      </div>

      {/* Employee Filter Section */}
      <div className="employee-filter-card">
        <div className="filter-header">
          <h3>
            <FiFilter /> Select Employees to Check Common Availability
          </h3>
          <button 
            onClick={selectAllEmployees}
            className="select-all-btn"
          >
            {selectedEmployees.length === employees.length ? 'Deselect All' : 'Select All'}
          </button>
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
      </div>

      {/* Common Available Slots */}
      {selectedEmployees.length > 0 && (
        <div className="quick-view-card">
          <h3>
            <FiUsers /> Common Available Times
            <span className="slot-count">({commonSlots.length} slots)</span>
          </h3>
          {commonSlots.length > 0 ? (
            <div className="common-slots-grid">
              {commonSlots.map((slot, index) => (
                <div key={index} className="common-slot-item highlight">
                  <div className="slot-date">
                    {formatScheduleDate(slot.start_time)}
                  </div>
                  <div className="slot-time">
                    {formatScheduleTime(slot.start_time)} - {formatScheduleTime(slot.end_time)}
                  </div>
                  <div className="slot-admins">
                    {selectedEmployees.length} employees available
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-slots-message">No common available times found for selected employees.</p>
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
            const slotsInCell = getSlotsForTimeCell(date, time);
            
            return (
              <div key={timeIndex} className="time-cell">
                {slotsInCell.map(slot => {
                  const employee = employees.find(emp => emp.employee_id === slot.employee_id) || {};
                  const isMySchedule = slot.employee_id === user?.employee_id;
                  
                  return (
                    <div
                      key={slot.id}
                      className={`availability-slot ${isMySchedule ? 'my-schedule' : ''}`}
                      style={{ 
                        backgroundColor: isMySchedule 
                          ? 'rgba(255, 138, 0, 0.3)' 
                          : (employee.color || '#666') + '20',
                        borderLeft: `3px solid ${isMySchedule ? '#FF8A00' : (employee.color || '#666')}`
                      }}
                      onClick={() => isMySchedule && handleEdit(slot)}
                      title={`${employee.first_name || 'Unknown'} ${employee.last_name || ''}: ${formatScheduleTime(slot.start_time)} - ${formatScheduleTime(slot.end_time)}`}
                    >
                      <div className="slot-content">
                        <div className="slot-employee">
                          {employee.first_name} {employee.last_name}
                        </div>
                        <div className="slot-time-range">
                          {formatScheduleTime(slot.start_time)}-{formatScheduleTime(slot.end_time)}
                        </div>
                      </div>
                    </div>
                  );
                })}
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
    </div>
  );
};

export default Scheduler;