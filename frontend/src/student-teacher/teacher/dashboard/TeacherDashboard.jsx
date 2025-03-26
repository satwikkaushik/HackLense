// import { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import { Link } from "react-router-dom";
// import "./TeacherDashboard.css";
// import Navbar from "../components/Navbar";

// import { useProblems } from "./useProblems";

// const TeacherDashboard = ({ addNotification }) => {
//   const [filteredProblems, setFilteredProblems] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterStatus, setFilterStatus] = useState("all");
//   const [filterSubject, setFilterSubject] = useState("all");
//   const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
//   const problemRefs = useRef({});
//   const navigate = useNavigate();
//   const { problems, loading } = useProblems();

//   // Apply filters to the problems
//   useEffect(() => {
//     let filtered = [...problems];
//     if (searchTerm) {
//       filtered = filtered.filter(
//         (problem) =>
//           problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           problem.description
//             .toLowerCase()
//             .includes(searchTerm.toLowerCase()) ||
//           problem.subject.toLowerCase().includes(searchTerm.toLowerCase())
//       );
//     }
//     if (filterStatus !== "all") {
//       filtered = filtered.filter((problem) => problem.status === filterStatus);
//     }
//     if (filterSubject !== "all") {
//       filtered = filtered.filter(
//         (problem) => problem.subject === filterSubject
//       );
//     }
//     setFilteredProblems(filtered);
//   }, [searchTerm, filterStatus, filterSubject, problems]);

//   // IntersectionObserver for fade-in animations
//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (entry.isIntersecting) {
//             entry.target.classList.add("visible");
//           }
//         });
//       },
//       { threshold: 0.1 }
//     );
//     const fadeElements = document.querySelectorAll(".fade-in");
//     fadeElements.forEach((el) => observer.observe(el));
//     return () => {
//       fadeElements.forEach((el) => observer.unobserve(el));
//     };
//   }, [filteredProblems]);

//   // Calculate problem statistics
//   const stats = {
//     total: problems.length,
//     active: problems.filter((p) => p.status === "active").length,
//     completed: problems.filter((p) => p.status === "completed").length,
//     graded: problems.filter((p) => p.status === "graded").length,
//   };

//   // Helper: Format date string
//   const formatDate = (dateString) => {
//     if (!dateString) return "";
//     const date = new Date(dateString);
//     if (isNaN(date.getTime())) return "Invalid date";
//     return new Intl.DateTimeFormat("en-US", {
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     }).format(date);
//   };

//   // Helper: Get days remaining until deadline
//   const getDaysRemaining = (deadline) => {
//     if (!deadline) return 0;
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const dueDate = new Date(deadline);
//     dueDate.setHours(0, 0, 0, 0);
//     const diffTime = dueDate - today;
//     return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//   };

//   // Helper: Check if problem is overdue
//   const isOverdue = (deadline) => {
//     if (!deadline) return false;
//     const dueDate = new Date(deadline);
//     if (isNaN(dueDate.getTime())) return false;
//     return dueDate < new Date();
//   };

//   // Navigate to the problem details page
//   const viewProblem = (problemId) => {
//     navigate(`/problem/${problemId}`);
//     addNotification({ message: "Viewing problem details", type: "info" });
//   };

//   // Sort problems (by deadline)
//   const sortedProblems = [...filteredProblems].sort((a, b) => {
//     return new Date(a.deadline) - new Date(b.deadline);
//   });

//   // Unique subjects for filtering
//   const subjects = ["all", ...new Set(problems.map((p) => p.subject))];

//   if (loading) return <div>Loading...</div>;

//   return (
//     <>
//       <Navbar />
//       <div className="dashboard-container">
//         <div className="dashboard-content">
//           <div className="dashboard">
//             <div className="dashboard-header fade-in">
//               <div className="header-left">
//                 <h1>Teacher Dashboard</h1>
//                 <p className="subtitle">
//                   Welcome back! You've created {stats.total} problems for your
//                   students.
//                 </p>
//               </div>
//               <div className="header-right">
//                 <div className="completion-container">
//                   <div className="upload-problem-button">
//                     <Link to="/upload-problem">
//                       <button className="upload-btn">
//                         <span className="plus-sign">+</span> Upload Problem
//                       </button>
//                     </Link>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="stats-container fade-in">
//               <div className="stat-card">
//                 <div className="stat-icon total">📚</div>
//                 <div className="stat-content">
//                   <h3>Total</h3>
//                   <p>{stats.total}</p>
//                 </div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-icon active">✅</div>
//                 <div className="stat-content">
//                   <h3>Active</h3>
//                   <p>{stats.active}</p>
//                 </div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-icon completed">⏳</div>
//                 <div className="stat-content">
//                   <h3>Completed</h3>
//                   <p>{stats.completed}</p>
//                 </div>
//               </div>
//               <div className="stat-card">
//                 <div className="stat-icon scored">🏆</div>
//                 <div className="stat-content">
//                   <h3>Graded</h3>
//                   <p>{stats.graded}</p>
//                 </div>
//               </div>
//             </div>

//             <div className="assignments-header fade-in">
//               <div className="header-left">
//                 <h2>Problems</h2>
//               </div>
//               <div className="header-right">
//                 <div className="view-controls">
//                   <button
//                     className={`view-mode-btn ${
//                       viewMode === "grid" ? "active" : ""
//                     }`}
//                     onClick={() => setViewMode("grid")}
//                     title="Grid View"
//                   >
//                     <div className="view">
//                       <ion-icon name="apps-outline"></ion-icon>
//                     </div>
//                   </button>
//                   <button
//                     className={`view-mode-btn ${
//                       viewMode === "list" ? "active" : ""
//                     }`}
//                     onClick={() => setViewMode("list")}
//                     title="List View"
//                   >
//                     <div className="view">
//                       <ion-icon name="list"></ion-icon>
//                     </div>
//                   </button>
//                 </div>
//                 <div className="search-box">
//                   <input
//                     type="text"
//                     placeholder="Search problems..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                   />
//                   <svg
//                     className="search-icon"
//                     width="18"
//                     height="18"
//                     viewBox="0 0 24 24"
//                     fill="none"
//                     stroke="currentColor"
//                     strokeWidth="2"
//                   >
//                     <circle cx="11" cy="11" r="8"></circle>
//                     <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
//                   </svg>
//                 </div>
//                 <div className="filter-dropdown">
//                   <select
//                     value={filterStatus}
//                     onChange={(e) => setFilterStatus(e.target.value)}
//                   >
//                     <option value="all">All Statuses</option>
//                     <option value="active">Active</option>
//                     <option value="completed">Completed</option>
//                     <option value="graded">Graded</option>
//                   </select>
//                 </div>
//                 <div className="filter-dropdown">
//                   <select
//                     value={filterSubject}
//                     onChange={(e) => setFilterSubject(e.target.value)}
//                   >
//                     {subjects.map((subject) => (
//                       <option key={subject} value={subject}>
//                         {subject === "all" ? "All Subjects" : subject}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className={`assignments-list ${viewMode}`}>
//               {sortedProblems.length > 0 ? (
//                 sortedProblems.map((problem, index) => (
//                   <div
//                     key={problem.id}
//                     className={`assignment-card fade-in ${problem.status} ${
//                       isOverdue(problem.deadline) && problem.status === "active"
//                         ? "overdue"
//                         : ""
//                     } `}
//                     ref={(el) => {
//                       problemRefs.current[problem.id] = el;
//                     }}
//                     style={{
//                       "--card-index": index,
//                       "--card-color": problem.color,
//                     }}
//                   >
//                     <div
//                       className="assignment-header"
//                       style={{ backgroundColor: problem.color }}
//                     >
//                       <div className="header-content">
//                         <h3>{problem.title}</h3>
//                         <div className="status-badge">
//                           {problem.status === "active"
//                             ? "Active"
//                             : problem.status === "completed"
//                             ? "Completed"
//                             : "Graded"}
//                         </div>
//                       </div>
//                     </div>
//                     <div className="assignment-details">
//                       <p className="description">{problem.description}</p>
//                       <div className="assignment-meta">
//                         <span
//                           className="subject"
//                           style={{ backgroundColor: problem.color }}
//                         >
//                           {problem.subject}
//                         </span>
//                         <span
//                           className={`deadline ${
//                             isOverdue(problem.deadline) &&
//                             problem.status === "active"
//                               ? "overdue"
//                               : ""
//                           }`}
//                         >
//                           {isOverdue(problem.deadline) &&
//                           problem.status === "active"
//                             ? "OVERDUE: "
//                             : "Due: "}
//                           {formatDate(problem.deadline)}
//                           {!isOverdue(problem.deadline) &&
//                             problem.status === "active" && (
//                               <span className="days-remaining">
//                                 ({getDaysRemaining(problem.deadline)} day
//                                 {getDaysRemaining(problem.deadline) !== 1
//                                   ? "s"
//                                   : ""}{" "}
//                                 left)
//                               </span>
//                             )}
//                         </span>
//                       </div>

//                       {/* Teacher-specific submission information */}
//                       <div className="submission-stats">
//                         <div className="submission-header">
//                           <h4>Student Submissions:</h4>
//                           <span className="submission-count">
//                             {problem.submissionCount || 0} /{" "}
//                             {problem.totalStudents || 30}
//                           </span>
//                         </div>
//                         <div className="submission-progress">
//                           <div
//                             className="progress-bar"
//                             style={{
//                               width: `${
//                                 problem.submissionCount
//                                   ? (problem.submissionCount /
//                                       (problem.totalStudents || 30)) *
//                                     100
//                                   : 0
//                               }%`,
//                               backgroundColor: problem.color,
//                             }}
//                           ></div>
//                         </div>
//                         <p className="submission-status">
//                           {problem.submissionCount
//                             ? `${problem.submissionCount} student${
//                                 problem.submissionCount !== 1
//                                   ? "s have"
//                                   : " has"
//                               } submitted their solution${
//                                 problem.submissionCount !== 1 ? "s" : ""
//                               }`
//                             : "No submissions yet"}
//                         </p>

//                         {/* {problem.status === "graded" && (
//                         <div className="grading-summary">
//                           <p>
//                             Average Score: <strong>{problem.averageScore || "N/A"}</strong>
//                           </p>
//                           <p>
//                             Highest Score: <strong>{problem.highestScore || "N/A"}</strong>
//                           </p>
//                         </div>
//                       )} */}
//                       </div>

//                       <div className="card-actions">
//                         <button
//                           className="view-button"
//                           onClick={() => viewProblem(problem.id)}
//                         >
//                           View Submissions
//                         </button>
//                         {/* Render the Pause/Activate button only if the problem is active */}
//                         {problem.status === "active" && (
//                           <button
//                             className="status-button pause"
//                             onClick={() => {
//                               // This would update the problem status in a real app
//                               addNotification({
//                                 message: `Problem paused`,
//                                 type: "info",
//                               });
//                             }}
//                           >
//                             Pause
//                           </button>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))
//               ) : (
//                 <div className="no-assignments fade-in">
//                   <div className="empty-state">
//                     <svg
//                       width="64"
//                       height="64"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       stroke="currentColor"
//                       strokeWidth="1.5"
//                     >
//                       <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
//                       <line x1="9" y1="10" x2="15" y2="10"></line>
//                     </svg>
//                     <h3>No problems found</h3>
//                     <p>No problems match your current filters.</p>
//                     <button
//                       className="reset-filters"
//                       onClick={() => {
//                         setSearchTerm("");
//                         setFilterStatus("all");
//                         setFilterSubject("all");
//                       }}
//                     >
//                       Reset Filters
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default TeacherDashboard;


import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./TeacherDashboard.css";
import Navbar from "../components/Navbar";
import { useProblems } from "./useProblems";

const TeacherDashboard = ({ addNotification }) => {
  // Define default colors for problems
  const defaultColors = [
    "#3B82F6", // Blue
    "#10B981", // Green
    "#8B5CF6", // Purple
    "#F43F5E", // Rose
    "#F59E0B", // Amber
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubject, setFilterSubject] = useState("all");
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();
  const { problems, loading } = useProblems();

  // Process problems with additional metadata
  const processedProblems = useMemo(() => {
    return problems.map((problem, index) => ({
      id: problem._id,
      title: problem.title,
      description: problem.description,
      subject: problem.subject || "Problem",
      status:
        problem.submissions > 0
          ? problem.submissions === problem.totalStudents
            ? "completed"
            : "active"
          : "active",
      deadline: problem.endDate,
      color: defaultColors[index % defaultColors.length],
      submissionCount: problem.submissions || 0,
      totalStudents: problem.totalStudents || 30,
    }));
  }, [problems]);

  // Memoize filtered problems to prevent unnecessary re-renders
  const filteredProblems = useMemo(() => {
    let filtered = processedProblems;

    if (searchTerm) {
      filtered = filtered.filter(
        (problem) =>
          problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          problem.description
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          problem.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((problem) => problem.status === filterStatus);
    }

    if (filterSubject !== "all") {
      filtered = filtered.filter(
        (problem) => problem.subject === filterSubject
      );
    }

    return filtered;
  }, [processedProblems, searchTerm, filterStatus, filterSubject]);

  // IntersectionObserver for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.1 }
    );
    const fadeElements = document.querySelectorAll(".fade-in");
    fadeElements.forEach((el) => observer.observe(el));
    return () => {
      fadeElements.forEach((el) => observer.unobserve(el));
    };
  }, [filteredProblems]);

  // Calculate problem statistics
  const stats = {
    total: processedProblems.length,
    active: processedProblems.filter((p) => p.status === "active").length,
/*     completed: processedProblems.filter((p) => p.status === "completed").length, */
    graded: processedProblems.filter((p) => p.status === "graded").length,
  };

/*   // Compute completion percentage
  const completionPercentage =
    processedProblems.length > 0
      ? Math.round((stats.completed / stats.total) * 100)
      : 0; */

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

  // Helper: Check if problem is overdue
  const isOverdue = (deadline) => {
    if (!deadline) return false;
    const dueDate = new Date(deadline);
    if (isNaN(dueDate.getTime())) return false;
    return dueDate < new Date();
  };

  // Get unique subjects for filtering
  const subjects = useMemo(() => {
    const subjectSet = new Set(problems.map((p) => p.subject).filter(Boolean));
    return ["all", ...subjectSet];
  }, [problems]);

  // Sort problems (by deadline)
  const sortedProblems = [...filteredProblems].sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  // Navigate to the problem details page
  const viewProblem = (problemId) => {
    navigate(`/submissions/${problemId}`);
    addNotification &&
      addNotification({ message: "Viewing problem details", type: "info" });
  };

  if (loading) return <div class="loading-overlay">
  <div class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">Loading...</div>
  </div>
</div>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="dashboard">
            <div className="dashboard-header fade-in">
              <div className="header-left">
                <h1>Teacher Dashboard</h1>
                <p className="subtitle">
                Welcome back! You've created {stats.total} problems statements for your students.
                </p>
              </div>
              <div className="header-right">
                <div className="upload-problem-button">
                  <Link to="/upload-problem">
                    <button className="upload-btn">
                      <span className="plus-sign">+</span> Upload Problem
                    </button>
                  </Link>
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
                <div className="stat-icon active">✅</div>
                <div className="stat-content">
                  <h3>Active</h3>
                  <p>{stats.active}</p>
                </div>
              </div>
              {/* <div className="stat-card">
                <div className="stat-icon pending">⏳</div>
                <div className="stat-content">
                  <h3>Completed</h3>
                  <p>{stats.completed}</p>
                </div>
              </div> */}
              <div className="stat-card">
                <div className="stat-icon overdue">⚠️</div>
                <div className="stat-content">
                  <h3>Graded</h3>
                  <p>{stats.graded}</p>
                </div>
              </div>
            </div>

            <div className="assignments-header fade-in">
              <div className="header-left">
                <h2>Problems</h2>
              </div>
              <div className="header-right">
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
                    placeholder="Search problems..."
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
                    <option value="active">Active</option>
                    {/* <option value="completed">Completed</option> */}
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
              {sortedProblems.length > 0 ? (
                sortedProblems.map((problem, index) => (
                  <div
                    key={problem.id}
                    className={`assignment-card fade-in ${problem.status} ${
                      isOverdue(problem.deadline) && problem.status === "active"
                        ? /* "overdue" */"graded"
                        : ""
                    } `}
                    style={{
                      "--card-index": index,
                      "--card-color": problem.color,
                    }}
                  >
                    <div
                      className="assignment-header"
                      style={{ backgroundColor: problem.color }}
                    >
                      <div className="header-content">
                        <h3>{problem.title}</h3>
                        <div className="status-badge">
                          {problem.status === "active"
                            ? "Active"
                            /* : problem.status === "completed"
                            ? "Completed" */
                            : "Graded"}
                        </div>
                      </div>
                    </div>
                    <div className="assignment-details">
                      <p className="description">{problem.description}</p>
                      <div className="assignment-meta">
                        <span
                          className="subject"
                          style={{ backgroundColor: problem.color }}
                        >
                          {problem.subject}
                        </span>
                        <span
                          className={`deadline ${
                            isOverdue(problem.deadline) &&
                            problem.status === "active"
                              ? /* "overdue" */"graded"
                              : ""
                          }`}
                        >
                          {isOverdue(problem.deadline) &&
                          problem.status === "active"
                            ? "GRADED"
                            : "Due: "}
                          {formatDate(problem.deadline)}
                          {!isOverdue(problem.deadline) &&
                            problem.status === "active" && (
                              <span className="days-remaining">
                                ({getDaysRemaining(problem.deadline)} day
                                {getDaysRemaining(problem.deadline) !== 1
                                  ? "s"
                                  : ""}{" "}
                                left)
                              </span>
                            )}
                        </span>
                      </div>

                      <div className="submission-stats">
                        <div className="submission-header">
                          <h4>Student Submissions: </h4>
                          
                          
                        </div>
                         <div className="submission-progress">
                          {/* <div
                            className="progress-bar"
                            style={{
                              width: `${
                                (problem.submissionCount /
                                  problem.totalStudents) *
                                100
                              }%`,
                              backgroundColor: problem.color,
                            }}
                          ></div> */}
                            <div className="submission-dots">
                            
                            <span className="submission-count"><h4>{problem.submissionCount} Submitted</h4></span>
                          </div>

                        </div><br></br>
                        {/* <p className="submission-status">
                          <i>Results will be available once the deadline ends!</i>
                        </p> */}
                      </div>

                      {isOverdue(problem.deadline) ? (
                        <button
                          className="view-button"
                          onClick={() => viewProblem(problem.id)}
                        >
                          View Submissions
                        </button>
                      ) : (
                        <p className="submission-status">
                          <i>Results will be available once the deadline ends!</i>
                        </p>
                      )}

                        {/* {problem.status === "active" && (
                          <button
                            className="status-button pause"
                            onClick={() => {
                              addNotification &&
                                addNotification({
                                  message: `Problem paused`,
                                  type: "info",
                                });
                            }}
                          >
                            Pause
                          </button>
                        )} */}
                      </div>
                    </div>
                  // </div>
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
                    <h3>No problems found</h3>
                    <p>No problems match your current filters.</p>
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
    </>
  );
};

export default TeacherDashboard;
