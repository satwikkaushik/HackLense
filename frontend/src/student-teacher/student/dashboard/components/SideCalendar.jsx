import { useState, useEffect } from 'react';
import './SideCalendar.css';
import { useAssignment } from '../hooks/useAssignments';

const SideCalendar = () => {
  const [currentDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [calendarDays, setCalendarDays] = useState([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState([]);
  const [assignmentStatuses, setAssignmentStatuses] = useState({});
  const [submittedAssignments, setSubmittedAssignments] = useState([]);
  const { assignments } = useAssignment();
  
  // Load assignment statuses and submitted assignments from localStorage
  useEffect(() => {
    const storedSubmissions = localStorage.getItem('submittedAssignments');
    const storedStatuses = localStorage.getItem('assignmentStatuses');
    
    if (storedSubmissions) {
      try {
        const parsedSubmissions = JSON.parse(storedSubmissions);
        setSubmittedAssignments(Array.isArray(parsedSubmissions) ? parsedSubmissions : []);
      } catch (error) {
        console.error("Error parsing submitted assignments:", error);
        setSubmittedAssignments([]);
      }
    }
    
    if (storedStatuses) {
      try {
        const parsedStatuses = JSON.parse(storedStatuses);
        setAssignmentStatuses(typeof parsedStatuses === 'object' ? parsedStatuses : {});
      } catch (error) {
        console.error("Error parsing assignment statuses:", error);
        setAssignmentStatuses({});
      }
    }
  }, []);
  
  // Generate calendar days based on current month and assignments
  useEffect(() => {
    // Generate calendar even if no assignments
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    const days = [];
    
    // Add empty cells for days before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: '', date: null });
    }
    
    // Add days with potential assignment events
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i);
      const dateString = date.toISOString().split('T')[0];
      
      const dayAssignments = assignments.filter(assignment => {
        if (!assignment || !assignment.endDate) return false;
        const deadlineDate = new Date(assignment.endDate).toISOString().split('T')[0];
        return deadlineDate === dateString;
      });
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isToday = date.getTime() === today.getTime();
      
      days.push({
        day: i,
        date: dateString,
        assignments: dayAssignments,
        isToday
      });
    }
    
    setCalendarDays(days);
  }, [currentMonth, currentYear, assignments]);
  
  // Update upcoming deadlines whenever assignments change
  useEffect(() => {
    if (!assignments) return;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    const upcoming = assignments
      .filter(assignment => {
        if (!assignment || !assignment.endDate) return false;
        
        // Check if assignment is not submitted
        const isSubmitted = Array.isArray(submittedAssignments) && 
          submittedAssignments.some(
            submitted => submitted?._id === assignment._id
          );
        
        // Get local status if exists
        const localStatus = assignmentStatuses[assignment._id] || 'pending';
        
        const deadlineDate = new Date(assignment.endDate);
        return !isSubmitted && 
               localStatus === 'pending' && 
               deadlineDate >= today && 
               deadlineDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.endDate) - new Date(b.endDate));
    
    setUpcomingDeadlines(upcoming);
  }, [assignments, submittedAssignments, assignmentStatuses]);
  
  // Navigate months
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Format month name
  const getMonthName = () => {
    return new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (error) {
      console.error("Error formatting date:", error);
      return '';
    }
  };
  
  // Calculate days remaining
  const getDaysRemaining = (deadline) => {
    if (!deadline) return 0;
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const dueDate = new Date(deadline);
      dueDate.setHours(0, 0, 0, 0);
      
      const diffTime = dueDate - today;
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    } catch (error) {
      console.error("Error calculating days remaining:", error);
      return 0;
    }
  };
  
  return (
    <div className="side-calendar">
      <div className="calendar-header">
        <button className="month-nav" onClick={prevMonth}>❮</button>
        <h3>{getMonthName()} {currentYear}</h3>
        <button className="month-nav" onClick={nextMonth}>❯</button>
      </div>
      
      <div className="calendar-grid">
        <div className="weekday">Sun</div>
        <div className="weekday">Mon</div>
        <div className="weekday">Tue</div>
        <div className="weekday">Wed</div>
        <div className="weekday">Thu</div>
        <div className="weekday">Fri</div>
        <div className="weekday">Sat</div>
        
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            className={`day ${!day.date ? 'empty' : ''} ${day.isToday ? 'today' : ''} ${day.assignments?.length > 0 ? 'has-events' : ''}`}
          >
            {day.day}
            {day.assignments && day.assignments.length > 0 && (
              <div className="day-event-indicator">
                {day.assignments.filter(assignment => {
                  // Filter out submitted assignments and assignments with non-pending status
                  const isSubmitted = Array.isArray(submittedAssignments) && 
                    submittedAssignments.some(
                      submitted => submitted?._id === assignment._id
                    );
                  const localStatus = assignmentStatuses[assignment._id] || 'pending';
                  return !isSubmitted && localStatus === 'pending';
                }).map((assignment, idx) => {
                  const localStatus = assignmentStatuses[assignment._id] || 'pending';
                  return (
                    <span 
                      key={`${assignment._id}-${idx}`} 
                      className={`event-dot ${localStatus}`}
                      style={{ backgroundColor: assignment.color || '#007bff' }}
                      title={assignment.title}
                    ></span>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <div className="upcoming-events">
        <h3>Upcoming Deadlines</h3>
        
        {upcomingDeadlines.length > 0 ? (
          <div className="event-list">
            {upcomingDeadlines.map((assignment) => (
              <div 
                key={assignment._id} 
                className="event-item"
              >
                <div 
                  className="event-color-indicator" 
                  style={{ backgroundColor: assignment.color || '#007bff' }}
                ></div>
                <div className="event-content">
                  <div className="event-date">
                    {formatDate(assignment.endDate)}
                    <span className="days-remaining">
                      ({getDaysRemaining(assignment.endDate)} day{getDaysRemaining(assignment.endDate) !== 1 ? 's' : ''} left)
                    </span>
                  </div>
                  <div className="event-title">{assignment.title}</div>
                  <div className="event-subject">{assignment.subject}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-events">No upcoming deadlines for the next 7 days.</p>
        )}
      </div>
    </div>
  );
};

export default SideCalendar;