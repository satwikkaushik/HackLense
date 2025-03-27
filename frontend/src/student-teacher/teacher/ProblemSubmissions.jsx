import React, { useState, useEffect, useRef } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import {
  Download,
  Eye,
  Info,
  GripVertical,
  PieChart,
  BarChart,
  LineChart,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { usedefaultParameter } from "./components/hooks/useDefaultParameters";
import "./ProblemSubmissions.css";
import { useParams, useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:3000";
const DraggableRow = ({ 
  submission, 
  index, 
  moveRow, 
  problem, 
  expandedSummaries, 
  toggleSummary 
}) => {
  const ref = useRef(null);
  
  const [, drop] = useDrop({
    accept: 'row',
    hover: (draggedItem, monitor) => {
      if (!ref.current) return;
      
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      
      if (dragIndex === hoverIndex) return;
      
      moveRow(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    }
  });
  
  const [{ isDragging }, drag, dragPreview] = useDrag({
    type: 'row',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  drag(drop(ref));

  return (
    <tbody ref={dragPreview} style={{ opacity: isDragging ? 0.5 : 1 }}>
      <tr ref={ref}>
        <td ref={drag}>
          <GripVertical size={20} className="drag-handle" />
        </td>
        <td>{submission.rank}</td>
        <td>{submission.studentName}</td>
        {problem.subject === "innovation" && (
          <>
            {submission.paramsWise.map((score, paramIndex) => (
              <td key={`param-${paramIndex}`}>{parseFloat(score).toFixed(2)}</td>
            ))}
            <td>{parseFloat(submission.defaultParamsScore).toFixed(2)}</td>
          </>
        )}
        <td>{parseFloat(submission.finalScore).toFixed(2)}</td>
        <td>
          <button 
            onClick={() => toggleSummary(submission.id)}
            className="summary-toggle-btn"
          >
            {expandedSummaries[submission.id] ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </td>
      </tr>
      {expandedSummaries[submission.id] && (
        <tr>
          <td 
            colSpan={problem.subject === "innovation" ? 7 : 5} 
            className="summary-row"
          >
            <div className="summary-content">
              <h4>Summary for {submission.studentName}</h4>
              <p>{submission.summary}</p>
            </div>
          </td>
        </tr>
      )}
    </tbody>
  );
};

const ProblemSubmissions = () => {
  const { defaultParameters } = usedefaultParameter();
  const { problemId } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [originalSubmissions, setOriginalSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSummaries, setExpandedSummaries] = useState({});

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setLoading(true);
        const genResponse = await fetch(
          `${BACKEND_URL}/event/final-standings/${problemId}`
        );

        if (!genResponse.ok) {
          throw new Error("Failed to fetch problem data");
        }

        const fetchedData = await genResponse.json();

        if (!fetchedData || !fetchedData.event || !fetchedData.standings) {
          throw new Error("Invalid data structure");
        }

        const problemData = fetchedData.event;
        const submissionsData = fetchedData.standings;

        const transformedSubmissions = submissionsData.map(
          (submission, index) => {
            const baseSubmission = {
              id: `sub_${index + 1}`,
              studentName: submission.student || `Student ${index + 1}`,
              rank: index + 1,
              finalScore: submission.finalScore,
              summary: submission.summary,
            };

            if (problemData.subject === "innovation") {
              return {
                ...baseSubmission,
                defaultParamsScore: submission.defaultParamsScore,
                paramsWise: submission.paramsWise,
              };
            }

            return baseSubmission;
          }
        );

        transformedSubmissions.sort(
          (a, b) => parseFloat(b.finalScore) - parseFloat(a.finalScore)
        );
        transformedSubmissions.forEach((sub, idx) => {
          sub.rank = idx + 1;
        });

        setProblem({
          ...problemData,
          teacherParameters: problemData.subject === "innovation" 
            ? problemData.parameters 
            : [],
        });
        setSubmissions(transformedSubmissions);
        setOriginalSubmissions([...transformedSubmissions]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching problem data:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProblemData();
  }, [problemId]);

  // Move row in submissions
  const moveRow = (dragIndex, hoverIndex) => {
    const newSubmissions = [...submissions];
    const draggedSubmission = newSubmissions[dragIndex];
    
    // Remove the dragged submission from its original position
    newSubmissions.splice(dragIndex, 1);
    
    // Insert the dragged submission at the new position
    newSubmissions.splice(hoverIndex, 0, draggedSubmission);

    // Reassign ranks
    const updatedSubmissions = newSubmissions.map((submission, index) => ({
      ...submission,
      rank: index + 1
    }));

    setSubmissions(updatedSubmissions);
  };

  // Toggle summary visibility
  const toggleSummary = (submissionId) => {
    setExpandedSummaries(prev => ({
      ...prev,
      [submissionId]: !prev[submissionId]
    }));
  };

  // Reset ranking to original
  const resetRanking = () => {
    setSubmissions([...originalSubmissions]);
  };

  // Download PDF of rankings
  const downloadRankingPDF = () => {
    const doc = new jsPDF();
    
    doc.setFontSize(16);
    doc.text(`Problem: ${problem.title}`, 14, 20);
    doc.setFontSize(12);
    doc.text(`Subject: ${problem.subject}`, 14, 30);
    doc.text(`Description: ${problem.description}`, 14, 40);

    const tableColumn = ["Rank", "Student Name", "Final Score"];
    const tableRows = submissions.map((submission) => [
      submission.rank,
      submission.studentName,
      submission.finalScore
    ]);

    doc.autoTable({
      startY: 60,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
    });

    doc.save(`${problem.title}_Rankings.pdf`);
  };

  // Render grade distribution stats
  const renderGradeDistribution = () => {
    const total = submissions.length;
    return (
      <table className="grade-distribution-table">
        <thead>
          <tr>
            <th style={{ textAlign: "left", color: "yellowgreen" }}>Grade Range</th>
            <th style={{ textAlign: "left", color: "yellowgreen" }}>Count</th>
            <th style={{ textAlign: "left", color: "yellowgreen" }}>Percentage</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Rejected (0 - 3.5)</td>
            <td>
              {submissions.filter(s => s.finalScore <= 3.5).length}
            </td>
            <td>
              {((submissions.filter(s => s.finalScore <= 3.5).length / total) * 100).toFixed(1)}%
            </td>
          </tr>
          <tr>
            <td>Revisit (3.6 - 6.5)</td>
            <td>
              {submissions.filter(s => s.finalScore > 3.5 && s.finalScore <= 6.5).length}
            </td>
            <td>
              {((submissions.filter(s => s.finalScore > 3.5 && s.finalScore <= 6.5).length / total) * 100).toFixed(1)}%
            </td>
          </tr>
          <tr>
            <td>Shortlisted (6.6 - 10)</td>
            <td>
              {submissions.filter(s => s.finalScore > 6.5).length}
            </td>
            <td>
              {((submissions.filter(s => s.finalScore > 6.5).length / total) * 100).toFixed(1)}%
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="problem-submissions-container">
        <div className="page-header">
          <button 
            onClick={() => navigate('/teacher-dashboard')} 
            className="download-button"
          >
            <ArrowLeft size={24} />
            Back to Dashboard
          </button>
        </div>

        {problem && submissions.length > 0 && (
          <>
            <div className="page-actions">
              
            </div>

            <div className="page-title">
              <h1>Submissions Page</h1>
              <div>
                <button onClick={resetRanking} className="download-button">
                Reset Original Ranking
              </button>
              </div>
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
    
            <div className="rubric-table-container">
              <table className="rubric-table">
                <thead>
                  <tr>
                    <th>Drag</th>
                    <th>Rank</th>
                    <th>Student Name</th>
                    {problem.subject === "innovation" && (
                      <>
                        {problem.parameters.map((param, index) => (
                          <th key={param._id}>
                            {param.name} (Priority {param.priority})
                          </th>
                        ))}
                        <th>Default Params Score</th>
                      </>
                    )}
                    <th>Final Score</th>
                    <th>Summary</th>
                  </tr>
                </thead>
                {submissions.map((submission, index) => (
                  <DraggableRow
                    key={submission.id}
                    index={index}
                    submission={submission}
                    moveRow={moveRow}
                    problem={problem}
                    expandedSummaries={expandedSummaries}
                    toggleSummary={toggleSummary}
                  />
                ))}
              </table>
            </div>
    
            <div className="data-visualization-section">
              <h3>Submission Analytics</h3>
              <div className="charts-container">
                <div className="chart-card">
                  <div className="chart-header">
                    <h4>Result Grade Distribution</h4>
                  </div>
                  {renderGradeDistribution()}
                </div>
                
                {problem.subject === "innovation" && (
                  <div className="chart-card">
                    <div className="chart-header">
                      <h4>Performance by Evaluation Criteria</h4>
                    </div>
                    <div className="bar-chart">
                      {problem.parameters.map((param, index) => (
                        <div key={param._id} className="bar-container">
                          <div className="bar-label">{param.name}</div>
                          <div className="bar-wrapper">
                            <div
                              className="bar"
                              style={{
                                width: `${submissions.reduce((sum, submission) => 
                                  sum + parseFloat(submission.paramsWise[index]), 0) / submissions.length * 10}%`,
                                backgroundColor: `hsl(${index * 120}, 70%, 50%)`
                              }}
                            ></div>
                            <span className="bar-value">
                              {(submissions.reduce((sum, submission) => 
                                sum + parseFloat(submission.paramsWise[index]), 0) / submissions.length).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </DndProvider>
  );
};

export default ProblemSubmissions;