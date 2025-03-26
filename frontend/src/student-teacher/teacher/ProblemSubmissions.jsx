import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Download,
  Eye,
  Info,
  GripVertical,
  PieChart,
  BarChart,
  LineChart,
} from "lucide-react";
import { usedefaultParameter } from "./components/hooks/useDefaultParameters";
import "./ProblemSubmissions.css";
import { useParams } from "react-router-dom";

const BACKEND_URL = "http://localhost:3000";

const ProblemSubmissions = () => {
  // Get default parameters from our hook (do not change useDefaultParameters.js)
  const { defaultParameters } = usedefaultParameter();
  const { problemId } = useParams();
  const [problem, setProblem] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: "rank",
    direction: "asc",
  });
  const [showRubricInfo, setShowRubricInfo] = useState(false);

  // Fetch problem data and submissions
  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        console.log("before fetching: ", problemId);
        setLoading(true);
        const genResponse = await fetch(
          `${BACKEND_URL}/event/final-standings/${problemId}`
        );

        if (!genResponse.ok) {
          throw new Error("Failed to fetch problem data");
        }

        const fetchedData = await genResponse.json();
        console.log("after fetching: ", fetchedData);

        // Verify the structure of fetchedData
        if (!fetchedData || !fetchedData.event || !fetchedData.standings) {
          throw new Error("Invalid data structure");
        }

        const problemData = fetchedData.event;
        const submissionsData = fetchedData.standings;

        console.log("Problem Data:", problemData);
        console.log("Submissions Data:", submissionsData);

        // Transform submissions to match the expected format
        const transformedSubmissions = submissionsData.map(
          (submission, index) => {
            // Ensure we have a way to calculate scores if not provided
            const teacherParameters = problemData.parameters || [];

            // Create parameter scores based on available data
            const parameterScores = teacherParameters.map((param) => ({
              parameterId: param._id,
              score: submission[param._id],
              weight: param.weight,
            }));

            // Add a default parameter score if not present
            const defaultParamScore = {
              parameterId: defaultParameters[0]?.id,
              score:
                submission.defaultScore || Math.floor(Math.random() * 10) + 1,
              weight: 1,
            };

            // Calculate averages
            const teacherTotal = parameterScores.reduce(
              (sum, p) => sum + p.score * p.weight,
              0
            );
            const teacherWeightSum = teacherParameters.reduce(
              (sum, p) => sum + (p.weight || 1),
              0
            );
            const teacherAvg = teacherTotal / teacherWeightSum;
            const defaultAvg = defaultParamScore.score;
            const overallAvg =
              (teacherTotal + defaultAvg) / (teacherWeightSum + 1);

            return {
              id: submission._id || `sub_${index + 1}`,
              studentId: submission.studentId,
              studentName: submission.studentName || `Student ${index + 1}`,
              rank: index + 1,
              submittedAt: submission.submittedAt || new Date().toISOString(),
              fileType:
                submission.fileType ||
                ["audio", "video", "image", "text"][
                  Math.floor(Math.random() * 4)
                ],
              parameterScores: [...parameterScores, defaultParamScore],
              teacherAverage: teacherAvg.toFixed(1),
              defaultAverage: defaultAvg.toFixed(1),
              overallScore: overallAvg.toFixed(1),
            };
          }
        );

        // Sort submissions by overall score
        transformedSubmissions.sort(
          (a, b) => parseFloat(b.overallScore) - parseFloat(a.overallScore)
        );
        transformedSubmissions.forEach((sub, idx) => {
          sub.rank = idx + 1;
        });

        setProblem({
          ...problemData,
          teacherParameters: problemData.parameters || [],
          defaultParameters: defaultParameters.slice(0, 1),
        });
        setSubmissions(transformedSubmissions);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching problem data:", err);
        setError(err.message);
        setLoading(false);

        // Fallback to mock data if fetch fails
        const mockProblem = {
          title: "Maths: Calculus Problem 1",
          subject: "mathematics",
          description: "find the derivative of f(x) = x^2 + 3x + 1",
          teacherParameters: [
            {
              _id: 1,
              name: "Correctness",
              description: "Accuracy of the solution",
              weight: 0.4,
            },
            {
              _id: 2,
              name: "Methodology",
              description: "Approach to solving the problem",
              weight: 0.3,
            },
            {
              _id: 3,
              name: "Presentation",
              description: "Clarity and organization",
              weight: 0.3,
            },
          ],
          defaultParameters: defaultParameters.slice(0, 1),
        };

        // Generate mock submissions
        const mockSubmissions = Array.from({ length: 10 }, (_, i) => {
          const teacherParamScores = mockProblem.teacherParameters.map(
            (param) => ({
              parameterId: param._id,
              score: Math.floor(Math.random() * 10) + 1,
              weight: param.weight,
            })
          );

          const defaultParamScore = {
            parameterId: defaultParameters[0].id,
            score: Math.floor(Math.random() * 10) + 1,
            weight: 1,
          };

          const teacherTotal = teacherParamScores.reduce(
            (sum, p) => sum + p.score * p.weight,
            0
          );
          const teacherWeightSum = mockProblem.teacherParameters.reduce(
            (sum, p) => sum + p.weight,
            0
          );
          const teacherAvg = teacherTotal / teacherWeightSum;
          const defaultAvg = defaultParamScore.score;
          const overallAvg =
            (teacherTotal + defaultAvg) / (teacherWeightSum + 1);

          return {
            id: `sub_${i + 1}`,
            studentId: `student_${i + 1}`,
            studentName: `Student ${i + 1}`,
            rank: i + 1,
            submittedAt: new Date(
              Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
            ).toISOString(),
            fileType: ["audio", "video", "image", "text"][
              Math.floor(Math.random() * 4)
            ],
            parameterScores: [...teacherParamScores, defaultParamScore],
            teacherAverage: teacherAvg.toFixed(1),
            defaultAverage: defaultAvg.toFixed(1),
            overallScore: overallAvg.toFixed(1),
          };
        });

        mockSubmissions.sort(
          (a, b) => parseFloat(b.overallScore) - parseFloat(a.overallScore)
        );
        mockSubmissions.forEach((sub, idx) => {
          sub.rank = idx + 1;
        });

        setProblem(mockProblem);
        setSubmissions(mockSubmissions);
      }
    };

    fetchProblemData();
  }, [problemId, defaultParameters]);

  // Calculate statistics for charts
  const calculateStats = () => {
    if (!submissions || submissions.length === 0) return null;

    // File type distribution
    const fileTypes = {};
    submissions.forEach((sub) => {
      fileTypes[sub.fileType] = (fileTypes[sub.fileType] || 0) + 1;
    });

    // Parameter scores using teacher parameters
    const paramScores = {};
    if (problem && problem.teacherParameters) {
      problem.teacherParameters.forEach((param) => {
        let total = 0;
        let count = 0;
        submissions.forEach((sub) => {
          const score = sub.parameterScores.find(
            (p) => p.parameterId === param.id
          )?.score;
          if (score) {
            total += score;
            count++;
          }
        });
        paramScores[param.name] = count > 0 ? (total / count).toFixed(1) : 0;
      });
    }

    // Result grade distribution
    const resultGrades = {
      "Rejected (0 - 3.5)": 0,
      "Revisit (4 - 6.5)": 0,
      "Shortlisted (7 - 10)": 0,
    };

    submissions.forEach((sub) => {
      const score = parseFloat(sub.overallScore);
      if (score <= 3.5) resultGrades["Rejected (0 - 3.5)"]++;
      else if (score <= 6.5) resultGrades["Revisit (4 - 6.5)"]++;
      else resultGrades["Shortlisted (7 - 10)"]++;
    });

    return { fileTypes, paramScores, resultGrades };
  };

  // --- Helper Functions ---

  // Sort submissions by key (supports teacher parameters using keys like "param_1")
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
    const sortedSubmissions = [...submissions].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];
      if (key.startsWith("param_")) {
        const paramId = parseInt(key.split("_")[1], 10);
        aValue =
          a.parameterScores.find((p) => p.parameterId === paramId)?.score || 0;
        bValue =
          b.parameterScores.find((p) => p.parameterId === paramId)?.score || 0;
      }
      if (typeof aValue === "string") {
        aValue = aValue.toUpperCase();
        bValue = bValue.toUpperCase();
      }
      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
    setSubmissions(sortedSubmissions);
  };

  // Return a sort indicator arrow if the column is sorted
  const getSortIndicator = (key) => {
    return sortConfig.key === key
      ? sortConfig.direction === "asc"
        ? "↑"
        : "↓"
      : "";
  };

  // Handle drag and drop reordering
  const handleDragEnd = (result) => {
    if (!result.destination) return;

    // Create a copy of submissions to avoid direct mutation
    const items = Array.from(submissions);

    // Remove the dragged item from its original position
    const [reorderedItem] = items.splice(result.source.index, 1);

    // Insert the dragged item at the new position
    items.splice(result.destination.index, 0, reorderedItem);

    // Update ranks after drag and drop
    items.forEach((item, index) => {
      item.rank = index + 1;
    });

    // Update state with new order
    setSubmissions(items);
  };

  // Dummy function to view submission details
  const handleViewSubmission = (id, studentName) => {
    console.log(`Viewing submission ${id} of ${studentName}`);
  };

  // Dummy function to trigger a download
  const handleDownload = (id, studentName, fileType) => {
    console.log(`Downloading submission ${id} of ${studentName} (${fileType})`);
  };

  // Return an icon for the file type
  const getFileTypeIcon = (fileType) => {
    switch (fileType) {
      case "audio":
        return <span>🔈</span>;
      case "video":
        return <span>🎬</span>;
      case "image":
        return <span>🖼️</span>;
      case "text":
        return <span>📝</span>;
      default:
        return <span>📝</span>;
    }
  };

  // Render a single ring pie chart for file type distribution
  const renderFileTypeDistribution = () => {
    if (!stats || !stats.fileTypes) return null;

    const total = submissions.length;
    let cumulative = 0;
    const fileTypesArray = Object.entries(stats.fileTypes);

    const gradientStops = fileTypesArray.map(([type, count], index) => {
      const percentage = (count / total) * 100;
      const start = cumulative;
      cumulative += percentage;
      const color = `hsl(${index * 120}, 70%, 50%)`;
      return `${color} ${start}% ${cumulative}%`;
    });

    const gradientString = `conic-gradient(${gradientStops.join(", ")})`;

    return (
      <div className="file-type-distribution">
        <div
          className="ring-pie-chart"
          style={{
            background: gradientString,
            "--total-submissions": total,
          }}
        ></div>
        <div className="pie-chart-legend">
          {fileTypesArray.map(([type, count], index) => {
            const color = `hsl(${index * 120}, 70%, 50%)`;
            const percentage = ((count / total) * 100).toFixed(1);
            return (
              <div
                key={type}
                className="legend-item"
                data-count={`${count} submissions`}
              >
                <span
                  className="legend-color"
                  style={{ backgroundColor: color }}
                ></span>
                {type.toUpperCase()}: {count} ({percentage}%)
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render a table for Result Grade Distribution
  const renderResultGradeDistribution = () => {
    if (!stats || !stats.resultGrades) return null;

    const total = submissions.length;

    return (
      <div className="chart-card">
        <div className="chart-header">
          <h4>Result Grade Distribution</h4>
        </div>
        <table className="grade-distribution-table">
          <thead>
            <tr>
              <th style={{ textAlign: "left", color: "yellowgreen" }}>
                Grade Range
              </th>
              <th style={{ textAlign: "left", color: "yellowgreen" }}>Count</th>
              <th style={{ textAlign: "left", color: "yellowgreen" }}>
                Percentage
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats.resultGrades).map(([range, count]) => (
              <tr key={range}>
                <td>{range}</td>
                <td>{count}</td>
                <td>{((count / total) * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error && !problem) return <div>Error: {error}</div>;
  return (
    <div className="problem-submissions-container">
      {loading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>}
      {problem && submissions.length > 0 && (
        <>
          <div className="page-title">
            <h1>Submissions Page</h1>
          </div>

          <div className="problem-header">
            <h2>{problem.title}</h2>
            <div className="problem-meta">
              <span className="subject">{problem.subject}</span>
              <span className="submissions-count">
                {submissions.length} Submissions
              </span>
            </div>
            <p className="description">{problem.description}</p>
          </div>

          <div className="rubric-header">
            <h3>Submission Rubric</h3>
            <button
              className="info-button"
              onClick={() => setShowRubricInfo(!showRubricInfo)}
            >
              <Info className="info-icon" />
              {showRubricInfo ? "Hide Rubric Info" : "Show Rubric Info"}
            </button>
          </div>

          {showRubricInfo && (
            <div className="rubric-info">
              <div className="rubric-section">
                <h4>Teacher Parameters</h4>
                <div className="parameters-list">
                  {problem.teacherParameters.map((param) => (
                    <div key={param._id} className="parameter-item">
                      <div className="parameter-name">
                        <strong>{param.name}</strong> (Weight:{" "}
                        {param.weight || 1})
                      </div>
                      <div className="parameter-description">
                        {param.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rubric-note">
                <p>
                  <strong>Note:</strong> Scores for each parameter range from
                  1-10. The final score is a weighted average of all parameters.
                  Drag and drop rows to manually adjust student rankings if
                  needed.
                </p>
              </div>
            </div>
          )}

          <div className="rubric-table-container">
            <DragDropContext onDragEnd={handleDragEnd}>
              <table className="rubric-table">
                <thead>
                  <tr>
                    <th className="drag-handle-col"></th>
                    <th
                      className="rank-col"
                      onClick={() => requestSort("rank")}
                    >
                      Rank {getSortIndicator("rank")}
                    </th>
                    <th onClick={() => requestSort("studentName")}>
                      Student Name {getSortIndicator("studentName")}
                    </th>
                    {problem.teacherParameters.map((param) => (
                      <th
                        key={param._id}
                        onClick={() => requestSort(`param_${param._id}`)}
                      >
                        {param.name} (x{param.weight || 1}){" "}
                        {getSortIndicator(`param_${param._id}`)}
                      </th>
                    ))}
                    <th onClick={() => requestSort("teacherAverage")}>
                      Teacher Criteria Avg {getSortIndicator("teacherAverage")}
                    </th>
                    <th onClick={() => requestSort("defaultAverage")}>
                      {problem.defaultParameters[0]?.name || "Default Criteria"}{" "}
                      {getSortIndicator("defaultAverage")}
                    </th>
                    <th onClick={() => requestSort("overallScore")}>
                      Overall Score {getSortIndicator("overallScore")}
                    </th>
                    <th className="file-col">Submission</th>
                  </tr>
                </thead>

                <Droppable
                  droppableId="submissions"
                  direction="vertical"
                  isDropDisabled={false}
                >
                  {(provided) => (
                    <tbody {...provided.droppableProps} ref={provided.innerRef}>
                      {submissions.map((submission, index) => (
                        <Draggable
                          key={submission.id}
                          draggableId={submission.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={snapshot.isDragging ? "dragging" : ""}
                            >
                              <td
                                className="drag-handle-col"
                                {...provided.dragHandleProps}
                              >
                                <GripVertical className="drag-handle" />
                              </td>
                              <td className="rank-col">{submission.rank}</td>
                              <td className="student-name">
                                {submission.studentName}
                              </td>
                              {problem.teacherParameters.map((param) => {
                                const paramScore =
                                  submission.parameterScores.find(
                                    (p) => p.parameterId === param._id
                                  );
                                return (
                                  <td key={param._id} className="score-cell">
                                    <div className="score-display">
                                      <span className="score-value">
                                        {paramScore?.score || "-"}
                                      </span>
                                      <div
                                        className="score-bar"
                                        style={{
                                          width: `${
                                            (paramScore?.score || 0) * 10
                                          }%`,
                                        }}
                                      ></div>
                                    </div>
                                  </td>
                                );
                              })}
                              <td className="average-cell">
                                {submission.teacherAverage}
                              </td>
                              <td className="average-cell">
                                {submission.defaultAverage}
                              </td>
                              <td className="overall-score">
                                {submission.overallScore}
                              </td>
                              <td className="file-actions">
                                <div className="file-type">
                                  {getFileTypeIcon(submission.fileType)}{" "}
                                  {submission.fileType.toUpperCase()}
                                </div>
                                <div className="file-buttons">
                                  <button
                                    className="view-button"
                                    onClick={() =>
                                      handleViewSubmission(
                                        submission.id,
                                        submission.studentName
                                      )
                                    }
                                    title={`View ${submission.studentName}'s submission`}
                                  >
                                    <Eye className="button-icon" />
                                  </button>
                                  <button
                                    className="download-button"
                                    onClick={() =>
                                      handleDownload(
                                        submission.id,
                                        submission.studentName,
                                        submission.fileType
                                      )
                                    }
                                    title={`Download ${submission.studentName}'s submission`}
                                  >
                                    <Download className="button-icon" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </tbody>
                  )}
                </Droppable>
              </table>
            </DragDropContext>
          </div>

          <div className="data-visualization-section">
            <h3>Submission Analytics</h3>
            <div className="charts-container">
              {/* File Type Distribution */}
              <div className="chart-card">
                <div className="chart-header">
                  <PieChart className="chart-icon" />
                  <h4>File Type Distribution</h4>
                </div>
                {renderFileTypeDistribution()}
              </div>

              {/* Teacher Parameter Average Scores Bar Chart */}
              <div className="chart-card">
                <div className="chart-header">
                  <BarChart className="chart-icon" />
                  <h4>Performance by Evaluation Criteria</h4>
                </div>
                <div className="bar-chart">
                  {stats &&
                    Object.entries(stats.paramScores).map(
                      ([param, score], index) => (
                        <div key={param} className="bar-container">
                          <div className="bar-label">{param}</div>
                          <div className="bar-wrapper">
                            <div
                              className="bar"
                              style={{
                                width: `${parseFloat(score) * 10}%`,
                                backgroundColor: `hsl(${
                                  index * 120
                                }, 70%, 50%)`,
                              }}
                            ></div>
                            <span className="bar-value">{score}</span>
                          </div>
                        </div>
                      )
                    )}
                </div>
              </div>

              {/* Result Grade Distribution Table */}
              {renderResultGradeDistribution()}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProblemSubmissions;