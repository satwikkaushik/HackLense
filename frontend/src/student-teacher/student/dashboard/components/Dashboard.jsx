import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import SideCalendar from './SideCalendar';
import { useAssignment } from '../hooks/useAssignments';

const Dashboard = ({ addNotification, updateAssignments }) => {
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [uploadingAssignmentId, setUploadingAssignmentId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [uploadType, setUploadType] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const assignmentRefs = useRef({});
  const navigate = useNavigate();
  const { assignments, loading } = useAssignment();

  // Apply filters to the assignments
  useEffect(() => {
    let filtered = [...assignments];
    if (searchTerm) {
      filtered = filtered.filter(assignment =>
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (filterStatus !== 'all') {
      filtered = filtered.filter(assignment => assignment.status === filterStatus);
    }
    if (filterSubject !== 'all') {
      filtered = filtered.filter(assignment => assignment.subject === filterSubject);
    }
    setFilteredAssignments(filtered);
  }, [searchTerm, filterStatus, filterSubject, assignments]);

  // IntersectionObserver for fade–in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.1 }
    );
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));
    return () => {
      fadeElements.forEach(el => observer.unobserve(el));
    };
  }, [filteredAssignments]);

  // Calculate assignment statistics
  const stats = {
    total: assignments.length,
    submitted: assignments.filter(a => a.status === 'submitted' || a.status === 'graded').length,
    pending: assignments.filter(a => a.status === 'pending').length,
    overdue: assignments.filter(a => a.status === 'pending' && new Date(a.deadline) < new Date()).length
  };

  // Helper: Format date string
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Helper: Get days remaining until deadline
  const getDaysRemaining = (deadline) => {
    if (!deadline) return 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(deadline);
    dueDate.setHours(0, 0, 0, 0);
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Helper: Check if assignment is overdue
  const isOverdue = (deadline) => {
    if (!deadline) return false;
    const dueDate = new Date(deadline);
    if (isNaN(dueDate.getTime())) return false;
    return dueDate < new Date();
  };

  // Helper: Get an icon for file types
  const getFileTypeIcon = (type) => {
    if (!type) return '📄 file';
    switch (type.toLowerCase()) {
      case 'pdf': return '📄 pdf';
      case 'docx':
      case 'doc': return '📝 docx';
      case 'ppt':
      case 'pptx': return '📊 ppt';
      case 'audio': return '🔊 audio';
      case 'video': return '🎬 video';
      case 'image': return '🖼️ image';
      case 'text': return '📃 text';
      default: return '📄 file';
    }
  };

  // Handle file upload simulation
  const handleFileUpload = (assignmentId, e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    if (!files || files.length === 0) {
      addNotification && addNotification({ message: "No file selected or the file is invalid.", type: "error" });
      return;
    }
    let fileType = 'text';
    const file = files[0];
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.pdf')) fileType = 'pdf';
    else if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) fileType = 'docx';
    else if (fileName.endsWith('.ppt') || fileName.endsWith('.pptx')) fileType = 'ppt';
    else if (fileName.endsWith('.zip') || fileName.endsWith('.rar')) fileType = 'zip';
    else if (file.type.startsWith('audio/')) fileType = 'audio';
    else if (file.type.startsWith('video/')) fileType = 'video';
    else if (file.type.startsWith('image/')) fileType = 'image';

    setUploadType(fileType);
    setUploadingAssignmentId(assignmentId);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            updateAssignments(prevAssignments =>
              prevAssignments.map(a =>
                a.id === assignmentId
                  ? { ...a, status: 'submitted', submittedOn: new Date().toISOString(), submissionType: fileType }
                  : a
              )
            );
            setUploadingAssignmentId(null);
            setUploadProgress(0);
            addNotification({ message: `Assignment submitted successfully as ${fileType.toUpperCase()}!`, type: 'success' });
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  // Drag & drop events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  const handleDragLeave = () => setDragging(false);
  const handleDrop = (assignmentId, e) => {
    e.preventDefault();
    setDragging(false);
    handleFileUpload(assignmentId, e);
  };

  // Toggle pin status
  // const togglePin = (assignmentId) => {
  //   const assignmentToToggle = assignments.find(a => a.id === assignmentId);
  //   if (!assignmentToToggle) return;
  //   const newPinStatus = !assignmentToToggle.isPinned;
  //   updateAssignments(prevAssignments =>
  //     prevAssignments.map(a =>
  //       a.id === assignmentId ? { ...a, isPinned: newPinStatus } : a
  //     )
  //   );
  //   addNotification({ 
  //     message: newPinStatus ? 'Assignment pinned to top' : 'Assignment unpinned', 
  //     type: 'info' 
  //   });
  // };

  // Navigate to the assignment details page
  const viewAssignment = (assignmentId) => {
    // Ensure the route path is defined in your router as "/assignment/:assignmentId"
    navigate(`/assignment/${assignmentId}`);
    addNotification({ message: 'Viewing assignment details', type: 'info' });
  };

  // Sort assignments (pinned first, then by deadline)
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    // if (a.isPinned && !b.isPinned) return -1;
    // if (!a.isPinned && b.isPinned) return 1;
    return new Date(a.deadline) - new Date(b.deadline);
  });

  // Unique subjects for filtering
  const subjects = ['all', ...new Set(assignments.map(a => a.subject))];

  // Completion percentage for display
  const completionPercentage = assignments.length > 0
    ? Math.round((stats.submitted / stats.total) * 100)
    : 0;

  if (loading) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard">
          <div className="dashboard-header fade-in">
            <div className="header-left">
              <h1>Student Dashboard</h1>
              <p className="subtitle">
                Welcome back! You've completed {completionPercentage}% of your assignments.
              </p>
            </div>
            <div className="header-right">
              <div className="completion-container">
                <div className="completion-bar">
                  <div className="progress-fill" style={{ width: `${completionPercentage}%` }}></div>
                </div>
                <span className="completion-text">{completionPercentage}% Complete</span>
              </div>
            </div>
          </div>

          <div className="stats-container fade-in">
            <div className="stat-card">
              <div className="stat-icon total">📚</div>
              <div className="stat-content">
                <h3>Total</h3>
                <p>{stats.total}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon submitted">✅</div>
              <div className="stat-content">
                <h3>Submitted</h3>
                <p>{stats.submitted}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon pending">⏳</div>
              <div className="stat-content">
                <h3>Pending</h3>
                <p>{stats.pending}</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon overdue">⚠️</div>
              <div className="stat-content">
                <h3>Overdue</h3>
                <p>{stats.overdue}</p>
              </div>
            </div>
          </div>

          <div className="assignments-header fade-in">
            <div className="header-left">
              <h2>Assignments</h2>
              <p className="result-count">
                {filteredAssignments.length} assignment{filteredAssignments.length !== 1 ? 's' : ''} found
              </p>
            </div>
            <div className="header-right">
              <div className="view-controls">
                <button 
                  className={`view-mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
                  onClick={() => setViewMode('grid')}
                  title="Grid View">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7"></rect>
                    <rect x="14" y="3" width="7" height="7"></rect>
                    <rect x="3" y="14" width="7" height="7"></rect>
                    <rect x="14" y="14" width="7" height="7"></rect>
                  </svg>
                </button>
                <button 
                  className={`view-mode-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                  title="List View">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="8" y1="6" x2="21" y2="6"></line>
                    <line x1="8" y1="12" x2="21" y2="12"></line>
                    <line x1="8" y1="18" x2="21" y2="18"></line>
                    <line x1="3" y1="6" x2="3.01" y2="6"></line>
                    <line x1="3" y1="12" x2="3.01" y2="12"></line>
                    <line x1="3" y1="18" x2="3.01" y2="18"></line>
                  </svg>
                </button>
              </div>
              <div className="search-box">
                <input 
                  type="text" 
                  placeholder="Search assignments..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} />
                <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <div className="filter-dropdown">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="graded">Graded</option>
                </select>
              </div>
              <div className="filter-dropdown">
                <select value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>
                      {subject === 'all' ? 'All Subjects' : subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={`assignments-list ${viewMode}`}>
            {sortedAssignments.length > 0 ? (
              sortedAssignments.map((assignment, index) => (
                <div 
                  key={assignment.id}
                  className={`assignment-card fade-in ${assignment.status} ${isOverdue(assignment.deadline) && assignment.status === 'pending' ? 'overdue' : ''} `}
                  ref={el => { assignmentRefs.current[assignment.id] = el; }}
                  style={{ '--card-index': index, '--card-color': assignment.color }}>
                  <div className="assignment-header" style={{ backgroundColor: assignment.color }}>
                    <div className="header-content">
                      <h3>{assignment.title}</h3>
                      <div className="status-badge">
                        {assignment.status === 'pending' ? 'To Do' : (assignment.status === 'submitted' ? 'Submitted' : 'Graded')}
                      </div>
                    </div>
                    {/* {assignment.isPinned && (
                      <div className="pinned-badge" title="Pinned Assignment">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <path d="M12 2C11.5 2 11 2.19 10.59 2.59L7.29 5.88L10.12 8.71L11 7.83V16.76L8.21 15.34L7 16.76L8.88 21H15.13L17 16.76L15.79 15.34L13 16.76V7.83L13.88 8.71L16.71 5.88L13.41 2.59C13 2.19 12.5 2 12 2Z" />
                        </svg>
                      </div>
                    )} */}
                  </div>
                  <div className="assignment-details">
                    <p className="description">{assignment.description}</p>
                    <div className="assignment-meta">
                      <span className="subject" style={{ backgroundColor: assignment.color }}>
                        {assignment.subject}
                      </span>
                      <span className={`deadline ${isOverdue(assignment.deadline) && assignment.status === 'pending' ? 'overdue' : ''}`}>
                        {isOverdue(assignment.deadline) && assignment.status === 'pending' ? 'OVERDUE: ' : 'Due: '}
                        {formatDate(assignment.deadline)}
                        {!isOverdue(assignment.deadline) && assignment.status === 'pending' && (
                          <span className="days-remaining">
                            ({getDaysRemaining(assignment.deadline)} day{getDaysRemaining(assignment.deadline) !== 1 ? 's' : ''} left)
                          </span>
                        )}
                      </span>
                    </div>
                    {assignment.status === 'pending' && (
                      <div 
                        className={`upload-area ${dragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(assignment.id, e)}>
                        {uploadingAssignmentId === assignment.id ? (
                          <div className="upload-progress">
                            <div className="progress-bar">
                              <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                            <span>{uploadProgress}% Uploaded</span>
                          </div>
                        ) : (
                          <>
                            <p>Drop files here or select file to upload</p>
                            <div className="file-types">
                              <span title="Text Documents">📃</span>
                              <span title="PDF Files">📄</span>
                              <span title="Images">🖼️</span>
                              <span title="Video Files">🎬</span>
                              <span title="Audio Files">🔊</span>
                            </div>
                            <input 
                              type="file" 
                              id={`file-upload-${assignment.id}`} 
                              className="file-input"
                              onChange={(e) => handleFileUpload(assignment.id, e)}
                              accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar,image/*,audio/*,video/*" />
                            <label htmlFor={`file-upload-${assignment.id}`} className="upload-button">
                              Select File
                            </label>
                          </>
                        )}
                      </div>
                    )}
                    {assignment.status === 'submitted' && (
                      <div className="submission-info">
                        <div className="submission-header">
                          <p>Submitted on: {formatDate(assignment.submittedOn)}</p>
                          {assignment.submissionType && (
                            <span className="file-type" title={`${assignment.submissionType.toUpperCase()} file`}>
                              {getFileTypeIcon(assignment.submissionType)}
                            </span>
                          )}
                        </div>
                        <p className="waiting-feedback">Awaiting feedback</p>
                      </div>
                    )}
                    {assignment.status === 'graded' && (
                      <div className="graded-info">
                        <div className="submission-header">
                          <div className="grade-display">
                            <span className="grade-label">Grade:</span>
                            <span className="grade">{assignment.grade}</span>
                          </div>
                          {assignment.submissionType && (
                            <span className="file-type" title={`${assignment.submissionType.toUpperCase()} file`}>
                              {getFileTypeIcon(assignment.submissionType)}
                            </span>
                          )}
                        </div>
                        <div className="feedback">
                          <h4>Feedback:</h4>
                          <p>{assignment.feedback}</p>
                        </div>
                      </div>
                    )}
                    <div className="card-actions">
                      <button 
                        className="view-button" 
                        onClick={() => viewAssignment(assignment.id)}>
                        View Details
                      </button>
                      {/* <button 
                        className={`pin-button ${assignment.isPinned ? 'pinned' : ''}`}
                        onClick={() => togglePin(assignment.id)}>
                        {assignment.isPinned ? 'Unpin' : 'Pin'}
                      </button> */}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-assignments fade-in">
                <div className="empty-state">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <line x1="9" y1="10" x2="15" y2="10"></line>
                  </svg>
                  <h3>No assignments found</h3>
                  <p>No assignments match your current filters.</p>
                  <button className="reset-filters" onClick={() => {
                    setSearchTerm('');
                    setFilterStatus('all');
                    setFilterSubject('all');
                  }}>
                    Reset Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
