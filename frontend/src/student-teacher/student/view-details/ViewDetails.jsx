import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewDetails.css';
import { useAssignment } from '../dashboard/hooks/useAssignments';

const ViewDetails = ({ addNotification, updateAssignments }) => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const { assignments, loading } = useAssignment();
  const [assignment, setAssignment] = useState(null);
  const [submissionType, setSubmissionType] = useState('file'); // 'file' or 'text'
  const [textSolution, setTextSolution] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadType, setUploadType] = useState('');
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef(null);
  const contentRef = useRef(null);

  // Animation timing refs
  const headerAnimTimeout = useRef(null);
  const detailsAnimTimeout = useRef(null);
  const actionsAnimTimeout = useRef(null);

  useEffect(() => {
    // Find the assignment
    if (!loading && assignments.length > 0) {
      const found = assignments.find(a => a.id === assignmentId);
      if (found) {
        setAssignment(found);
      } else {
        addNotification({ message: 'Assignment not found', type: 'error' });
        navigate('/dashboard');
      }
    }
  }, [assignmentId, assignments, loading, navigate, addNotification]);

  // Trigger animations on component mount
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.classList.add('fade-in-active');
      
      headerAnimTimeout.current = setTimeout(() => {
        const header = document.querySelector('.details-header');
        if (header) header.classList.add('slide-in-active');
      }, 100);
      
      detailsAnimTimeout.current = setTimeout(() => {
        const details = document.querySelector('.details-content');
        if (details) details.classList.add('slide-in-active');
      }, 300);
      
      actionsAnimTimeout.current = setTimeout(() => {
        const actions = document.querySelector('.details-actions');
        if (actions) actions.classList.add('slide-in-active');
      }, 500);
    }
    
    return () => {
      clearTimeout(headerAnimTimeout.current);
      clearTimeout(detailsAnimTimeout.current);
      clearTimeout(actionsAnimTimeout.current);
    };
  }, [assignment]);

  // Format date strings
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Get days remaining
  const getDaysRemaining = (deadline) => {
    if (!deadline) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset hours to get full days
    
    const dueDate = new Date(deadline);
    dueDate.setHours(0, 0, 0, 0); // Reset hours for accurate day diff
    
    const diffTime = dueDate - today;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  // Check if assignment is overdue
  const isOverdue = (deadline) => {
    if (!deadline) return false;
    
    const dueDate = new Date(deadline);
    // Check if date is valid
    if (isNaN(dueDate.getTime())) return false;
    
    return dueDate < new Date();
  };

  // Handle file upload simulation
  const handleFileUpload = (e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;
    
    if (!files || files.length === 0) {
      addNotification({ 
        message: "No file selected or the file is invalid.", 
        type: "error" 
      });
      return;
    }
    
    if (files.length) {
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
      setUploadingFile(true);
      setUploadProgress(0);
      
      // Simulate upload progress
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              const updatedAssignment = {
                ...assignment,
                status: 'submitted',
                submittedOn: new Date().toISOString(),
                submissionType: fileType
              };
              
              setAssignment(updatedAssignment);
              updateAssignments(prev => 
                prev.map(a => a.id === assignmentId ? updatedAssignment : a)
              );
              
              setUploadingFile(false);
              setUploadProgress(0);
              addNotification({ 
                message: `Assignment submitted successfully as ${fileType.toUpperCase()}!`, 
                type: 'success' 
              });
            }, 500);
            return 100;
          }
          return prev + 5;
        });
      }, 100);
    }
  };

  // Handle text submission
  const handleTextSubmit = () => {
    if (!textSolution.trim()) {
      addNotification({ 
        message: "Please enter your solution before submitting.", 
        type: "warning" 
      });
      return;
    }
    
    // Simulate processing
    setUploadingFile(true);
    setUploadProgress(0);
    setUploadType('text');
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            const updatedAssignment = {
              ...assignment,
              status: 'submitted',
              submittedOn: new Date().toISOString(),
              submissionType: 'text',
              textSubmission: textSolution
            };
            
            setAssignment(updatedAssignment);
            updateAssignments(prev => 
              prev.map(a => a.id === assignmentId ? updatedAssignment : a)
            );
            
            setUploadingFile(false);
            setUploadProgress(0);
            setTextSolution('');
            addNotification({ 
              message: "Text solution submitted successfully!", 
              type: "success" 
            });
          }, 500);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };
  
  // Handle drag events
  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };
  
  const handleDragLeave = () => setDragging(false);
  
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFileUpload(e);
  };
  
  // Navigate back to dashboard
  const goBack = () => {
    // Add exit animations
    const content = contentRef.current;
    if (content) {
      content.classList.remove('fade-in-active');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 300);
    } else {
      navigate('/dashboard');
    }
  };
  
  // Get file type icon
  const getFileTypeIcon = (type) => {
    if (!type) return '📄 file';
    
    switch(type.toLowerCase()) {
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

  if (loading || !assignment) {
    return (
      <div className="view-details-loading">
        <div className="loading-spinner"></div>
        <p>Loading assignment details...</p>
      </div>
    );
  }

  return (
    <div className="view-details-container" ref={contentRef}>
      <div className="view-details-content">
        <div className="back-navigation">
          <button className="back-button" onClick={goBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
        </div>
        
        <div className="details-header slide-in">
          <div 
            className="header-content" 
            style={{ backgroundColor: assignment.color }}
          >
            <div className="title-section">
              <h1>{assignment.title}</h1>
              <div className={`status-badge ${assignment.status}`}>
                {assignment.status === 'pending' ? 'To Do' : 
                 assignment.status === 'submitted' ? 'Submitted' : 'Graded'}
              </div>
            </div>
            
            <div className="header-meta">
              <span className="subject-badge" style={{ backgroundColor: assignment.color }}>
                {assignment.subject}
              </span>
              <span className={`deadline-badge ${isOverdue(assignment.deadline) && assignment.status === 'pending' ? 'overdue' : ''}`}>
                {isOverdue(assignment.deadline) && assignment.status === 'pending' 
                  ? 'OVERDUE' 
                  : 'Due'}: {formatDate(assignment.deadline)}
              </span>
            </div>
          </div>
        </div>
        
        <div className="details-content slide-in">
          <div className="details-section">
            <h2>Assignment Details</h2>
            <div className="description-box">
              <p>{assignment.description}</p>
            </div>
            
            <div className="time-info">
              {!isOverdue(assignment.deadline) && assignment.status === 'pending' && (
                <div className="time-remaining">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>
                    {getDaysRemaining(assignment.deadline)} day{getDaysRemaining(assignment.deadline) !== 1 ? 's' : ''} remaining
                  </span>
                </div>
              )}
              
              {isOverdue(assignment.deadline) && assignment.status === 'pending' && (
                <div className="time-overdue">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                  <span>
                    Overdue by {Math.abs(getDaysRemaining(assignment.deadline))} day{Math.abs(getDaysRemaining(assignment.deadline)) !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
              
              {assignment.submittedOn && (
                <div className="submitted-on">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span>
                    Submitted on: {formatDate(assignment.submittedOn)}
                  </span>
                </div>
              )}
            </div>
            
            {assignment.submissionType && (
              <div className="submission-info">
                <h3>Your Submission</h3>
                <div className="submission-details">
                  <div className="file-info">
                    <div className="file-icon">{getFileTypeIcon(assignment.submissionType)}</div>
                    <div className="file-meta">
                      <p className="file-name">
                        assignment-submission.{assignment.submissionType}
                      </p>
                      <p className="file-date">
                        Submitted on {formatDate(assignment.submittedOn)}
                      </p>
                    </div>
                  </div>
                  
                  {assignment.submissionType === 'text' && assignment.textSubmission && (
                    <div className="text-submission">
                      <h4>Your Text Solution:</h4>
                      <div className="text-content">
                        {assignment.textSubmission}
                      </div>
                    </div>
                  )}
                  
                  <button className="download-button">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                      <polyline points="7 10 12 15 17 10"></polyline>
                      <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                    Download
                  </button>
                </div>
              </div>
            )}
            
            {assignment.status === 'graded' && (
              <div className="feedback-section">
                <h3>Instructor Feedback</h3>
                <div className="grade-display">
                  <div className="grade">{assignment.grade}</div>
                  <div className="grade-label">Grade</div>
                </div>
                <div className="feedback-content">
                  <h4>Comments:</h4>
                  <p>{assignment.feedback}</p>
                </div>
              </div>
            )}
          </div>
          
          {assignment.status === 'pending' && (
            <div className="submission-section">
              <h2>Submit Your Solution</h2>
              
              <div className="submission-tabs">
                <button 
                  className={`tab-button ${submissionType === 'file' ? 'active' : ''}`}
                  onClick={() => setSubmissionType('file')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
                    <polyline points="13 2 13 9 20 9"></polyline>
                  </svg>
                  Upload File
                </button>
                <button 
                  className={`tab-button ${submissionType === 'text' ? 'active' : ''}`}
                  onClick={() => setSubmissionType('text')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="17" y1="10" x2="3" y2="10"></line>
                    <line x1="21" y1="6" x2="3" y2="6"></line>
                    <line x1="21" y1="14" x2="3" y2="14"></line>
                    <line x1="17" y1="18" x2="3" y2="18"></line>
                  </svg>
                  Write Text
                </button>
              </div>
              
              {uploadingFile ? (
                <div className="upload-progress">
                  <div className="progress-info">
                    <p>Uploading {uploadType.toUpperCase()} submission...</p>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <>
                  {submissionType === 'file' ? (
                    <div 
                      className={`file-upload-area ${dragging ? 'dragging' : ''}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="upload-icon">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                          <polyline points="17 8 12 3 7 8"></polyline>
                          <line x1="12" y1="3" x2="12" y2="15"></line>
                        </svg>
                      </div>
                      <div className="upload-text">
                        <p>Drag & drop your file here</p>
                        <span>or</span>
                      </div>
                      <input 
                        type="file"
                        ref={fileInputRef}
                        className="file-input"
                        onChange={handleFileUpload}
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip,.rar,image/*,audio/*,video/*"
                      />
                      <button 
                        className="browse-button"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Browse Files
                      </button>
                      <div className="supported-formats">
                        <p>Supported formats:</p>
                        <div className="format-icons">
                          <span title="Text Documents">📃</span>
                          <span title="PDF Files">📄</span>
                          <span title="Images">🖼️</span>
                          <span title="Video Files">🎬</span>
                          <span title="Audio Files">🔊</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-submission-area">
                      <textarea
                        className="text-solution-input"
                        placeholder="Type your solution here..."
                        value={textSolution}
                        onChange={(e) => setTextSolution(e.target.value)}
                      ></textarea>
                      <div className="text-actions">
                        <button 
                          className="submit-text-button"
                          onClick={handleTextSubmit}
                          disabled={!textSolution.trim()}
                        >
                          Submit Solution
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="details-actions slide-in">
          <button className="action-button back-button-large" onClick={goBack}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Dashboard
          </button>
          
          {assignment.status === 'pending' && (
            <button 
              className="action-button submit-button" 
              onClick={() => submissionType === 'file' ? fileInputRef.current.click() : handleTextSubmit()}
              disabled={submissionType === 'text' && !textSolution.trim()}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              Submit Assignment
            </button>
          )}
          
          {assignment.status === 'submitted' && (
            <div className="submission-status">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Awaiting feedback from instructor
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewDetails;