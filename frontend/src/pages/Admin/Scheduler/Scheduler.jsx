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
  FiGlobe,
  FiRefreshCw
} from 'react-icons/fi';
import './Scheduler.css';

const Scheduler = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSlot, setEditingSlot] = useState(null);
  const [error, setError] = useState('');
  
  // Mock data for admins
  const [admins] = useState([
    { 
      id: '1', 
      name: 'John Doe', 
      timezone: 'EST (UTC-5)', 
      country: 'USA',
      color: '#1CB0A2',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg'
    },
    { 
      id: '2', 
      name: 'Sarah Chen', 
      timezone: 'JST (UTC+9)', 
      country: 'Japan',
      color: '#067ECC',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
    },
    { 
      id: '3', 
      name: 'Alex Kumar', 
      timezone: 'IST (UTC+5:30)', 
      country: 'India',
      color: '#FB9227',
      avatar: 'https://randomuser.me/api/portraits/men/75.jpg'
    },
    { 
      id: '4', 
      name: 'Emma Wilson', 
      timezone: 'GMT (UTC+0)', 
      country: 'UK',
      color: '#9333ea',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
    }
  ]);

  // Mock availability data
  const [availabilitySlots, setAvailabilitySlots] = useState([
    {
      id: '1',
      adminId: '1',
      date: '2024-08-23',
      startTime: '09:00',
      endTime: '12:00',
    },
    {
      id: '2',
      adminId: '2',
      date: '2024-08-23',
      startTime: '14:00',
      endTime: '17:00',
    },
    {
      id: '3',
      adminId: '3',
      date: '2024-08-23',
      startTime: '06:00',
      endTime: '09:00',
    },
    {
      id: '4',
      adminId: '4',
      date: '2024-08-23',
      startTime: '09:00',
      endTime: '12:00',
    },
    {
      id: '5',
      adminId: '1',
      date: '2024-08-24',
      startTime: '10:00',
      endTime: '11:30',
    }
  ]);

  const [formData, setFormData] = useState({
    adminId: '',
    date: '',
    startTime: '',
    endTime: '',
  });

  // Get current week dates
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
  
  // 24-hour time slots for international use
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    return `${i.toString().padStart(2, '0')}:00`;
  });

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const validateTimeRange = (startTime, endTime) => {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return start < end;
  };

  const validateSlotOverlap = (adminId, date, startTime, endTime, excludeId = null) => {
    return availabilitySlots.some(slot => {
      if (slot.adminId !== adminId || slot.date !== date || slot.id === excludeId) {
        return false;
      }
      
      const slotStart = new Date(`2000-01-01T${slot.startTime}`);
      const slotEnd = new Date(`2000-01-01T${slot.endTime}`);
      const newStart = new Date(`2000-01-01T${startTime}`);
      const newEnd = new Date(`2000-01-01T${endTime}`);
      
      return (newStart < slotEnd && newEnd > slotStart);
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = () => {
    setError('');

    // Validation
    if (!formData.adminId || !formData.date || !formData.startTime || !formData.endTime) {
      setError('Please fill in all required fields');
      return;
    }
    
    if (!validateTimeRange(formData.startTime, formData.endTime)) {
      setError('End time must be after start time');
      return;
    }

    if (validateSlotOverlap(formData.adminId, formData.date, formData.startTime, formData.endTime, editingSlot?.id)) {
      setError('This time slot overlaps with an existing schedule for this admin');
      return;
    }
    
    if (editingSlot) {
      // Update existing slot
      setAvailabilitySlots(slots => 
        slots.map(slot => 
          slot.id === editingSlot.id 
            ? { ...slot, ...formData }
            : slot
        )
      );
      setEditingSlot(null);
    } else {
      // Add new slot
      const newSlot = {
        ...formData,
        id: Date.now().toString()
      };
      setAvailabilitySlots(prev => [...prev, newSlot]);
    }

    setShowAddModal(false);
    setFormData({
      adminId: '',
      date: formatDate(new Date()),
      startTime: '',
      endTime: '',
    });
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      adminId: slot.adminId,
      date: slot.date,
      startTime: slot.startTime,
      endTime: slot.endTime,
    });
    setShowAddModal(true);
    setError('');
  };

  const handleDelete = (slotId) => {
    if (window.confirm('Are you sure you want to delete this time slot?')) {
      setAvailabilitySlots(slots => slots.filter(slot => slot.id !== slotId));
    }
  };

  const getAdminById = (id) => {
    return admins.find(admin => admin.id === id);
  };

  const navigateWeek = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction * 7));
    setCurrentDate(newDate);
  };

  // Find common available slots where all admins are available at the same time
  const findAllCommonSlots = () => {
    const commonSlots = [];
    
    // Get all dates from availability slots
    const allDates = [...new Set(availabilitySlots.map(slot => slot.date))];
    
    // For each date, check each time slot to see if all admins are available
    allDates.forEach(date => {
      // Create a grid for this date: timeSlot -> adminId -> available
      const timeGrid = {};
      
      // Initialize time grid
      timeSlots.forEach(time => {
        timeGrid[time] = {};
        admins.forEach(admin => {
          timeGrid[time][admin.id] = false;
        });
      });
      
      // Mark available times
      availabilitySlots.forEach(slot => {
        if (slot.date === date) {
          const startHour = parseInt(slot.startTime.split(':')[0]);
          const endHour = parseInt(slot.endTime.split(':')[0]);
          
          for (let hour = startHour; hour < endHour; hour++) {
            const timeKey = `${hour.toString().padStart(2, '0')}:00`;
            if (timeGrid[timeKey]) {
              timeGrid[timeKey][slot.adminId] = true;
            }
          }
        }
      });
      
      // Find time slots where all admins are available
      let currentStart = null;
      let currentEnd = null;
      
      timeSlots.forEach(time => {
        const allAvailable = admins.every(admin => timeGrid[time][admin.id]);
        
        if (allAvailable && currentStart === null) {
          // Start of a new common slot
          currentStart = time;
        } else if (!allAvailable && currentStart !== null) {
          // End of a common slot
          currentEnd = time;
          commonSlots.push({
            date,
            startTime: currentStart,
            endTime: currentEnd,
            admins: admins
          });
          currentStart = null;
          currentEnd = null;
        }
      });
      
      // Handle case where common slot continues to the end of the day
      if (currentStart !== null) {
        currentEnd = '24:00';
        commonSlots.push({
          date,
          startTime: currentStart,
          endTime: currentEnd,
          admins: admins
        });
      }
    });
    
    return commonSlots.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const allCommonSlots = findAllCommonSlots();

  // Find slots for a specific time cell
  const getSlotsForTimeCell = (date, time) => {
    const dateStr = formatDate(date);
    const hour = parseInt(time.split(':')[0]);
    
    return availabilitySlots.filter(slot => {
      if (slot.date !== dateStr) return false;
      
      const startHour = parseInt(slot.startTime.split(':')[0]);
      const endHour = parseInt(slot.endTime.split(':')[0]);
      
      return hour >= startHour && hour < endHour;
    });
  };

  // Group admins by time slot for display
  const getAdminsForTimeCell = (date, time) => {
    const slots = getSlotsForTimeCell(date, time);
    return slots.map(slot => getAdminById(slot.adminId));
  };

  return (
    <div className="scheduler">
      <div className="scheduler-header">
        <div className="header-left">
          <h2>Free Time Scheduler</h2>
          <p>Coordinate availability across different time zones</p>
        </div>
        
        <div className="header-actions">
          <button 
            onClick={() => {
              setShowAddModal(true);
              setEditingSlot(null);
              setFormData({
                adminId: '',
                date: formatDate(new Date()),
                startTime: '',
                endTime: '',
              });
              setError('');
            }}
            className="add-slot-btn"
          >
            <FiPlus /> Add Availability
          </button>
        </div>
      </div>

      {/* All Common Available Slots - Quick View Card */}
      <div className="quick-view-card">
        <h3>
          <FiUsers /> All Admins Available - Quick View
          <span className="slot-count">({allCommonSlots.length} time slots)</span>
        </h3>
        {allCommonSlots.length > 0 ? (
          <div className="common-slots-grid">
            {allCommonSlots.map((slot, index) => (
              <div key={index} className="common-slot-item highlight">
                <div className="slot-date">
                  {new Date(slot.date).toLocaleDateString('en-US', {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric'
                  })}
                </div>
                <div className="slot-time">
                  {slot.startTime} - {slot.endTime}
                </div>
                <div className="slot-admins">
                  All team members available
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-slots-message">No common available times found for all admins.</p>
        )}
      </div>

      {/* Admin Info Cards */}
      <div className="admin-cards">
        {admins.map(admin => (
          <div key={admin.id} className="admin-card">
            <img src={admin.avatar} alt={admin.name} />
            <div className="admin-info">
              <h4>{admin.name}</h4>
              <p><FiGlobe /> {admin.country}</p>
              <span className="timezone">{admin.timezone}</span>
            </div>
            <div 
              className="admin-color" 
              style={{ backgroundColor: admin.color }}
            ></div>
          </div>
        ))}
      </div>

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
                  const adminsInSlot = getAdminsForTimeCell(date, time);
                  const isAllAdmins = adminsInSlot.length === admins.length;
                  
                  return (
                    <div key={timeIndex} className="time-cell">
                      {adminsInSlot.length > 0 && (
                        <div
                          className={`availability-slot ${isAllAdmins ? 'all-admins' : ''}`}
                          style={{ 
                            backgroundColor: isAllAdmins 
                              ? 'rgba(255, 138, 0, 0.3)' 
                              : adminsInSlot[0].color + '20',
                            borderColor: isAllAdmins 
                              ? '#FF8A00' 
                              : adminsInSlot[0].color
                          }}
                        >
                          <div className="slot-content">
                            <div className="slot-admins">
                              {adminsInSlot.map(admin => admin.name.split(' ')[0]).join(', ')}
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
              <button 
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSlot(null);
                  setError('');
                }}
                className="close-btn"
              >
                <FiX />
              </button>
            </div>

            <div className="modal-form">
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label>Admin</label>
                <select
                  name="adminId"
                  value={formData.adminId}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Admin</option>
                  {admins.map(admin => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name} ({admin.country})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingSlot(null);
                    setError('');
                  }}
                  className="cancel-btn"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleSubmit} 
                  className="save-btn"
                >
                  <FiSave /> {editingSlot ? 'Update' : 'Save'}
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