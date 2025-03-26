import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { useAssignment } from "../hooks/useAssignments";

const BACKEND_URL = "http://localhost:3000";

const Dashboard = ({ addNotification }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [dragging, setDragging] = useState(false);
  const [uploadingAssignmentId, setUploadingAssignmentId] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState("grid");
  const [fileLanguages, setFileLanguages] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [submittedAssignments, setSubmittedAssignments] = useState({});
  const [assignmentStatuses, setAssignmentStatuses] = useState({});
  const navigate = useNavigate();
  const { assignments, setAssignments, loading } = useAssignment();

  // Load submitted assignments from local storage on component mount
  useEffect(() => {
    const storedSubmissions = localStorage.getItem("submittedAssignments");
    const storedStatuses = localStorage.getItem("assignmentStatuses");

    if (storedSubmissions) {
      setSubmittedAssignments(JSON.parse(storedSubmissions));
    }

    if (storedStatuses) {
      setAssignmentStatuses(JSON.parse(storedStatuses));
    }
  }, []);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  // Define default colors for assignments
  const defaultColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#8B5CF6", // Purple
    "#F43F5E", // Rose
    "#F59E0B", // Amber
  ];

  // Process assignments with additional metadata
  const processedAssignments = useMemo(() => {
    return assignments.map((assignment, index) => {
      const localStatus = assignmentStatuses[assignment._id] || "pending";
      return {
        id: assignment._id,
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject || "Event",
        status: localStatus,
        deadline: assignment.endDate,
        color: defaultColors[index % defaultColors.length],
      };
    });
  }, [assignments, assignmentStatuses]);

  // Memoize filtered assignments to prevent unnecessary re-renders
  const filteredAssignments = useMemo(() => {
    let filtered = processedAssignments;

    if (searchTerm) {
      filtered = filtered.filter(
        (assignment) =>
          assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          assignment.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter(
        (assignment) => assignment.status === filterStatus
      );
    }

    if (filterSubject !== "all") {
      filtered = filtered.filter(
        (assignment) => assignment.subject === filterSubject
      );
    }

    return filtered;
  }, [processedAssignments, searchTerm, filterStatus, filterSubject]);

  // Compute stats based on processed assignments
  const stats = useMemo(() => {
    const total = processedAssignments.length;
    const submitted = processedAssignments.filter(
      (a) => a.status === "submitted" || a.status === "graded"
    ).length;
    const pending = processedAssignments.filter(
      (a) => a.status === "pending"
    ).length;
    const overdue = processedAssignments.filter(
      (a) => a.status === "pending" && new Date(a.deadline) < new Date()
    ).length;

    return { total, submitted, pending, overdue };
  }, [processedAssignments]);

  // Compute completion percentage
  const completionPercentage = useMemo(() => {
    return stats.total > 0
      ? Math.round((stats.submitted / stats.total) * 100)
      : 0;
  }, [stats]);

  // Helper: Format date string
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
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

  // File upload handler
  const handleFileUpload = (assignmentId, e) => {
    e.preventDefault();
    const files = e.dataTransfer ? e.dataTransfer.files : e.target.files;

    // Check if language is selected
    const selectedLanguage = fileLanguages[assignmentId];
    if (!selectedLanguage) {
      addNotification &&
        addNotification({
          message: "Please select a language before uploading.",
          type: "error",
        });
      return;
    }

    if (!files || files.length === 0) {
      addNotification &&
        addNotification({
          message: "No file selected or the file is invalid.",
          type: "error",
        });
      return;
    }

    const file = files[0];
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/*",
      "audio/*",
      "video/*",
    ];

    // Check file type
    if (!allowedTypes.some((type) => file.type.match(type))) {
      addNotification &&
        addNotification({
          message:
            "Invalid file type. Please upload PDF, DOCX, TXT, image, audio, or video.",
          type: "error",
        });
      return;
    }

    // Determine file type
    let fileType = "text";
    if (file.type.startsWith("image/")) fileType = "image";
    else if (file.type.startsWith("audio/")) fileType = "audio";
    else if (file.type.startsWith("video/")) fileType = "video";
    else if (file.type === "application/pdf") fileType = "pdf";
    else if (file.type.includes("wordprocessingml.document")) fileType = "docx";

    // Prepare submission data
    const submissionData = {
      event: assignmentId,
      fileType: fileType,
      fileLanguage: selectedLanguage,
      file: file,
    };

    // Update local state to track uploaded file
    setUploadedFiles((prev) => ({
      ...prev,
      [assignmentId]: submissionData,
    }));

    // Simulate upload progress
    setUploadingAssignmentId(assignmentId);
    setUploadProgress(100);
  };

  // New submit handler
  const handleSubmit = (assignmentId) => {
    // Check if assignment is already submitted
    if (submittedAssignments[assignmentId]) {
      addNotification &&
        addNotification({
          message: "This assignment has already been submitted.",
          type: "error",
        });
      return;
    }

    // Confirm submission
    const confirmSubmit = window.confirm(
      "Are you sure you want to submit this assignment? You can only submit once."
    );

    if (!confirmSubmit) return;

    // Get uploaded file
    const uploadedFile = uploadedFiles[assignmentId];
    if (!uploadedFile) {
      addNotification &&
        addNotification({
          message: "Please upload a file before submitting.",
          type: "error",
        });
      return;
    }

    // Prepare form data for upload
    const formData = new FormData();
    formData.append("event", uploadedFile.event);
    formData.append("fileType", uploadedFile.fileType);
    formData.append("fileLanguage", uploadedFile.fileLanguage);
    formData.append("file", uploadedFile.file);

    // Submit to backend
    fetch(`${BACKEND_URL}/submissions`, {
      method: "POST",
      credentials: "include",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        // Update local storage for submitted assignments
        const newSubmittedAssignments = {
          ...submittedAssignments,
          [assignmentId]: true,
        };
        setSubmittedAssignments(newSubmittedAssignments);
        localStorage.setItem(
          "submittedAssignments",
          JSON.stringify(newSubmittedAssignments)
        );

        // Update assignment status
        const newAssignmentStatuses = {
          ...assignmentStatuses,
          [assignmentId]: "submitted",
        };
        setAssignmentStatuses(newAssignmentStatuses);
        localStorage.setItem(
          "assignmentStatuses",
          JSON.stringify(newAssignmentStatuses)
        );

        // Handle successful upload
        addNotification &&
          addNotification({
            message: `Assignment submitted successfully as ${uploadedFile.fileType.toUpperCase()}!`,
            type: "success",
          });
      })
      .catch((error) => {
        console.error("Upload error:", error);
        addNotification &&
          addNotification({
            message: "Upload failed. Please try again.",
            type: "error",
          });
      });
  };

  // Handle file drop
  const handleDrop = (assignmentId, e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent duplicate events
    setDragging(false);
    if (e.dataTransfer && e.dataTransfer.files.length > 0) {
      handleFileUpload(assignmentId, e);
    }
  };

  // Get unique subjects for filtering
  const subjects = useMemo(() => {
    const subjectSet = new Set(
      assignments.map((a) => a.subject).filter(Boolean)
    );
    return ["all", ...subjectSet];
  }, [assignments]);

  if (loading)
    return (
      <div class="loading-overlay">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <div class="loading-text">Loading...</div>
        </div>
      </div>
    );

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <div className="dashboard">
          <div className="dashboard-header fade-in">
            <div className="header-left">
              <h1>Student Dashboard</h1>
              <p className="subtitle">
                Welcome back! You've completed {completionPercentage}% of your
                assignments.
              </p>
            </div>
            <div className="header-right">
              <div className="completion-container">
                <div className="completion-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
                <span className="completion-text">
                  {completionPercentage}% Complete
                </span>
              </div>
            </div>
          </div>

          <div className="stats-container1 fade-in">
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

          {/* Rest of the component remains the same as in the previous version */}
          {/* Render assignment cards with the same logic as before */}
          <div className="assignments-header fade-in">
            <div className="header-left">
              <h2>Assignments</h2>
            </div>
            <div className="header-right">
              {/* View controls, search box, and filters remain the same */}
              <div className="view-controls">
                <button
                  className={`view-mode-btn ${
                    viewMode === "grid" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  <div className="view">
                    <ion-icon name="apps-outline"></ion-icon>
                  </div>
                </button>
                <button
                  className={`view-mode-btn ${
                    viewMode === "list" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  <div className="view">
                    <ion-icon name="list"></ion-icon>
                  </div>
                </button>
              </div>
              <div className="search-box">
                <input
                  type="text"
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <svg
                  className="search-icon"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
              <div className="filter-dropdown">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="submitted">Submitted</option>
                  <option value="graded">Graded</option>
                </select>
              </div>
              <div className="filter-dropdown">
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                >
                  {subjects.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className={`assignments-list ${viewMode}`}>
            {filteredAssignments.length > 0 ? (
              filteredAssignments.map((assignment, index) => (
                <div
                  key={assignment.id}
                  className={`assignment-card fade-in ${assignment.status} ${
                    isOverdue(assignment.deadline) &&
                    assignment.status === "pending"
                      ? ""
                      : ""
                  } `}
                  style={{
                    "--card-index": index,
                    "--card-color": assignment.color,
                  }}
                >
                  <div
                    className="assignment-header"
                    style={{ backgroundColor: assignment.color }}
                  >
                    <div className="header-content">
                      <h3>{assignment.title}</h3>
                      <div className="status-badge">
                        {assignment.status === "pending"
                          ? "To Do"
                          : assignment.status === "submitted"
                          ? "Submitted"
                          : "Graded"}
                      </div>
                    </div>
                  </div>
                  <div className="assignment-details">
                    <p className="description">{assignment.description}</p>
                    <div className="assignment-meta">
                      <span
                        className="subject"
                        style={{ backgroundColor: assignment.color }}
                      >
                        {assignment.subject}
                      </span>
                      <span
                        className={`deadline ${
                          isOverdue(assignment.deadline) &&
                          assignment.status === "pending"
                            ? "overdue"
                            : ""
                        }`}
                      >
                        {isOverdue(assignment.deadline) &&
                        assignment.status === "pending"
                          ? "OVERDUE: "
                          : "Due: "}
                        {formatDate(assignment.deadline)}
                        {!isOverdue(assignment.deadline) &&
                          assignment.status === "pending" && (
                            <span className="days-remaining">
                              ({getDaysRemaining(assignment.deadline)} day
                              {getDaysRemaining(assignment.deadline) !== 1
                                ? "s"
                                : ""}{" "}
                              left)
                            </span>
                          )}
                      </span>
                    </div>
                    {assignment.status === "pending" &&
                      !isOverdue(assignment.deadline) && (
                        <>
                          {!submittedAssignments[assignment.id] ? (
                            <>
                              <div className="language-select">
                                <select
                                  value={fileLanguages[assignment.id] || ""}
                                  onChange={(e) =>
                                    setFileLanguages((prev) => ({
                                      ...prev,
                                      [assignment.id]: e.target.value,
                                    }))
                                  }
                                >
                                  <option value="">Select Language</option>
                                  <option value="english">English</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>

                              <div
                                className={`upload-area ${
                                  dragging ? "dragging" : ""
                                }`}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(assignment.id, e)}
                              >
                                {uploadingAssignmentId === assignment.id ? (
                                  <div className="upload-progress">
                                    <div className="progress-bar">
                                      <div
                                        className="progress"
                                        style={{ width: "100%" }}
                                      ></div>
                                    </div>
                                    <span>File Ready to Submit</span>
                                  </div>
                                ) : (
                                  <>
                                    <p>
                                      Drop files here or select file to upload
                                    </p>
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
                                      onChange={(e) => {
                                        if (e.target.files.length > 0) {
                                          handleFileUpload(assignment.id, e);
                                        }
                                      }}
                                      accept=".pdf,.doc,.docx,.txt,image/*,audio/*,video/*"
                                    />
                                    <label
                                      htmlFor={`file-upload-${assignment.id}`}
                                      className="upload-button"
                                    >
                                      Select File
                                    </label>
                                  </>
                                )}
                              </div>

                              {uploadedFiles[assignment.id] && (
                                <div className="submit-section">
                                  <button
                                    className="submit-button"
                                    onClick={() => handleSubmit(assignment.id)}
                                    disabled={!fileLanguages[assignment.id]}
                                  >
                                    Submit Assignment
                                  </button>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="submitted-section">
                              <div className="submission-info">
                                <span className="submitted-badge">
                                  ✅ Submitted
                                </span>
                                <p className="submit">
                                  File Type:{" "}
                                  {uploadedFiles[
                                    assignment.id
                                  ]?.fileType.toUpperCase()}
                                  <br />
                                  Language:{" "}
                                  {uploadedFiles[assignment.id]?.fileLanguage}
                                </p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-assignments fade-in">
                <div className="empty-state">
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    <line x1="9" y1="10" x2="15" y2="10"></line>
                  </svg>
                  <h3>No assignments found</h3>
                  <p>No assignments match your current filters.</p>
                  <button
                    className="reset-filters"
                    onClick={() => {
                      setSearchTerm("");
                      setFilterStatus("all");
                      setFilterSubject("all");
                    }}
                  >
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
