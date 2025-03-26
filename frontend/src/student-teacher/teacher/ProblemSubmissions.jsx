import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Download, Eye, Info, GripVertical, PieChart, BarChart, LineChart } from 'lucide-react';
import { usedefaultParameter } from './components/hooks/useDefaultParameters';
import './ProblemSubmissions.css';

const ProblemSubmissions = ({ problemId }) => {
  // Get default parameters from our hook (do not change useDefaultParameters.js)
  const { defaultParameters } = usedefaultParameter();

  const [problem, setProblem] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });
  const [showRubricInfo, setShowRubricInfo] = useState(false);

  // Fetch problem data and submissions
  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setLoading(true);
        // Replace these API calls with your actual endpoints
        const problemResponse = await fetch(`/api/problems/${problemId}`);
        const submissionsResponse = await fetch(`/api/problems/${problemId}/submissions`);

        
        if (!problemResponse.ok || !submissionsResponse.ok) {
          throw new Error('Failed to fetch problem data');
        }
        
        const problemData = await problemResponse.json();
        const submissionsData = await submissionsResponse.json();
        
        setProblem(problemData);
        setSubmissions(submissionsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        
        // Create mock problem data if fetch fails
        const mockProblem = {
          title: 'Innovative Problem Solving Challenge',
          subject: 'Innovative Design',
          description: 'Create an innovative solution addressing a real-world challenge',
          teacherParameters: [
            { id: 1, name: 'Creativity', description: 'Originality and unique approach', weight: 0.3 },
            { id: 2, name: 'Feasibility', description: 'Practical implementation potential', weight: 0.3 },
            { id: 3, name: 'Impact', description: 'Potential societal or industrial benefit', weight: 0.4 }
          ],
          // Use the first default parameter from our hook
          defaultParameters: [defaultParameters[0]],
        };

        // Generate 10 mock submissions
        const mockSubmissions = Array.from({ length: 10 }, (_, i) => {
          const teacherParamScores = mockProblem.teacherParameters.map(param => ({
            parameterId: param.id,
            score: Math.floor(Math.random() * 10) + 1,
            weight: param.weight
          }));

          const defaultParamScore = {
            parameterId: defaultParameters[0].id,
            score: Math.floor(Math.random() * 10) + 1,
            weight: 1
          };

          const teacherTotal = teacherParamScores.reduce((sum, p) => sum + (p.score * p.weight), 0);
          const teacherWeightSum = mockProblem.teacherParameters.reduce((sum, p) => sum + p.weight, 0);
          const teacherAvg = teacherTotal / teacherWeightSum;
          const defaultAvg = defaultParamScore.score;
          const overallAvg = (teacherTotal + defaultAvg) / (teacherWeightSum + 1);

          return {
            id: `sub_${i + 1}`,
            studentId: `student_${i + 1}`,
            studentName: `Student ${i + 1}`,
            rank: i + 1,
            submittedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
            fileType: ['audio', 'video', 'image', 'text'][Math.floor(Math.random() * 3)],
            parameterScores: [...teacherParamScores, defaultParamScore],
            teacherAverage: teacherAvg.toFixed(1),
            defaultAverage: defaultAvg.toFixed(1),
            overallScore: overallAvg.toFixed(1)
          };
        });

        // Sort by overall score descending and reassign ranks
        mockSubmissions.sort((a, b) => parseFloat(b.overallScore) - parseFloat(a.overallScore));
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
    submissions.forEach(sub => {
      fileTypes[sub.fileType] = (fileTypes[sub.fileType] || 0) + 1;
    });
    
    // Parameter scores using teacher parameters
    const paramScores = {};
    if (problem && problem.teacherParameters) {
      problem.teacherParameters.forEach(param => {
        let total = 0;
        let count = 0;
        submissions.forEach(sub => {
          const score = sub.parameterScores.find(p => p.parameterId === param.id)?.score;
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
      'Rejected (0 - 3.5)': 0,
      'Revisit (4 - 6.5)': 0,
      'Shortlisted (7 - 10)': 0
    };
    
    submissions.forEach(sub => {
      const score = parseFloat(sub.overallScore);
      if (score <= 3.5) resultGrades['Rejected (0 - 3.5)']++;
      else if (score <= 6.5) resultGrades['Revisit (4 - 6.5)']++;
      else resultGrades['Shortlisted (7 - 10)']++;
    });
    
    return { fileTypes, paramScores, resultGrades };
  };

  const stats = calculateStats();

  // --- Helper Functions ---

  // Sort submissions by key (supports teacher parameters using keys like "param_1")
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    const sortedSubmissions = [...submissions].sort((a, b) => {
      let aValue = a[key];
      let bValue = b[key];
      if (key.startsWith('param_')) {
        const paramId = parseInt(key.split('_')[1], 10);
        aValue = a.parameterScores.find(p => p.parameterId === paramId)?.score || 0;
        bValue = b.parameterScores.find(p => p.parameterId === paramId)?.score || 0;
      }
      if (typeof aValue === 'string') {
        aValue = aValue.toUpperCase();
        bValue = bValue.toUpperCase();
      }
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setSubmissions(sortedSubmissions);
  };

  // Return a sort indicator arrow if the column is sorted
  const getSortIndicator = (key) => {
    return sortConfig.key === key ? (sortConfig.direction === 'asc' ? '↑' : '↓') : '';
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
      case 'audio': return <span>🔈</span>;
      case 'video': return <span>🎬</span>;
      case 'image': return <span>🖼️</span>;
      case 'text': return <span>📝</span>;
      default: return <span>📝</span>;
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
    
    const gradientString = `conic-gradient(${gradientStops.join(', ')})`;
  
    return (
      <div className="file-type-distribution">
        <div 
          className="ring-pie-chart" 
          style={{ 
            background: gradientString,
            '--total-submissions': total 
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
              <th style={{ textAlign: 'left', color: 'yellowgreen' }}>Grade Range</th>
              <th style={{ textAlign: 'left', color: 'yellowgreen'}}>Count</th>
              <th style={{ textAlign: 'left', color: 'yellowgreen' }}>Percentage</th>
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
      <div className="page-title">
        <h1>Submissions Page</h1>
      </div>
      
      <div className="problem-header">
        <h2>{problem.title}</h2>
        <div className="problem-meta">
          <span className="subject">{problem.subject}</span>
          <span className="submissions-count">{submissions.length} Submissions</span>
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
          {showRubricInfo ? 'Hide Rubric Info' : 'Show Rubric Info'}
        </button>
      </div>
  
      {showRubricInfo && (
        <div className="rubric-info">
          <div className="rubric-section">
            <h4>Teacher Parameters</h4>
            <div className="parameters-list">
              {problem.teacherParameters.map(param => (
                <div key={param.id} className="parameter-item">
                  <div className="parameter-name">
                    <strong>{param.name}</strong> (Weight: {param.weight})
                  </div>
                  <div className="parameter-description">{param.description}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* <div className="rubric-section">
            <h4>Default Parameters</h4>
            <div className="parameters-list">
              {problem.defaultParameters.map(param => (
                <div key={param.id} className="parameter-item">
                  <div className="parameter-name">
                    <strong>{param.name}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div> */}
          
          <div className="rubric-note">
            <p>
              <strong>Note:</strong> Scores for each parameter range from 1-10. The final score is a weighted average of all parameters.
              Drag and drop rows to manually adjust student rankings if needed.
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
                <th className="rank-col" onClick={() => requestSort('rank')}>
                  Rank {getSortIndicator('rank')}
                </th>
                <th onClick={() => requestSort('studentName')}>
                  Student Name {getSortIndicator('studentName')}
                </th>
                {problem.teacherParameters.map(param => (
                  <th key={param.id} onClick={() => requestSort(`param_${param.id}`)}>
                    {param.name} (x{param.weight}) {getSortIndicator(`param_${param.id}`)}
                  </th>
                ))}
                <th onClick={() => requestSort('teacherAverage')}>
                  Teacher Criteria Avg {getSortIndicator('teacherAverage')}
                </th>
                <th onClick={() => requestSort('defaultAverage')}>
                  {problem.defaultParameters[0].name} {getSortIndicator('defaultAverage')}
                </th>
                <th onClick={() => requestSort('overallScore')}>
                  Overall Score {getSortIndicator('overallScore')}
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
                <tbody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {submissions.map((submission, index) => (
                    <Draggable key={submission.id} draggableId={submission.id} index={index}>
                      {(provided, snapshot) => (
                        <tr
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={snapshot.isDragging ? 'dragging' : ''}
                        >
                          <td className="drag-handle-col" {...provided.dragHandleProps}>
                            <GripVertical className="drag-handle" />
                          </td>
                          <td className="rank-col">{submission.rank}</td>
                          <td className="student-name">{submission.studentName}</td>
                          {problem.teacherParameters.map(param => {
                            const paramScore = submission.parameterScores.find(p => p.parameterId === param.id);
                            return (
                              <td key={param.id} className="score-cell">
                                <div className="score-display">
                                  <span className="score-value">{paramScore?.score || '-'}</span>
                                  <div 
                                    className="score-bar" 
                                    style={{ width: `${(paramScore?.score || 0) * 10}%` }}
                                  ></div>
                                </div>
                              </td>
                            );
                          })}
                          <td className="average-cell">{submission.teacherAverage}</td>
                          <td className="average-cell">{submission.defaultAverage}</td>
                          <td className="overall-score">{submission.overallScore}</td>
                          <td className="file-actions">
                            <div className="file-type">
                              {getFileTypeIcon(submission.fileType)} {submission.fileType.toUpperCase()}
                            </div>
                            <div className="file-buttons">
                              <button 
                                className="view-button"
                                onClick={() => handleViewSubmission(submission.id, submission.studentName)}
                                title={`View ${submission.studentName}'s submission`}
                              >
                                <Eye className="button-icon" />
                              </button>
                              <button 
                                className="download-button"
                                onClick={() => handleDownload(submission.id, submission.studentName, submission.fileType)}
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
              {stats && Object.entries(stats.paramScores).map(([param, score], index) => (
                <div key={param} className="bar-container">
                  <div className="bar-label">{param}</div>
                  <div className="bar-wrapper">
                    <div 
                      className="bar" 
                      style={{ 
                        width: `${parseFloat(score) * 10}%`,
                        backgroundColor: `hsl(${index * 120}, 70%, 50%)`
                      }}
                    ></div>
                    <span className="bar-value">{score}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Result Grade Distribution Table */}
          {renderResultGradeDistribution()}
        </div>
      </div>
    </div>
  );
};

export default ProblemSubmissions;