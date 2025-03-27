import React, { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { motion, AnimatePresence } from "framer-motion";
import "./UploadProblem.css";
import { usedefaultParameter } from "../hooks/useDefaultParameters";
import { useNavigate } from "react-router-dom"; // Import for navigation

// ON Success : redirect to Dashboard!

const ItemTypes = {
  PARAMETER: "parameter",
};

const ParameterItem = ({ id, name, index, moveItem }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.PARAMETER,
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const [, drop] = useDrop(() => ({
    accept: ItemTypes.PARAMETER,
    hover: (item) => {
      if (item.index === index) return;
      moveItem(item.index, index);
      item.index = index;
    },
  }));

  return (
    <motion.div
      ref={(node) => drag(drop(node))}
      className={`parameter-item ${isDragging ? "dragging" : ""}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="drag-handle">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
          <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
          <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
          <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
        </svg>
      </div>
      <span className="parameter-priority">{index + 1}</span>
      <span className="parameter-name">{name}</span>
    </motion.div>
  );
};

const ParameterList = ({ parameters, setParameters }) => {
  const moveItem = (fromIndex, toIndex) => {
    setParameters((prevParameters) => {
      const updatedParameters = [...prevParameters];
      const [movedItem] = updatedParameters.splice(fromIndex, 1);
      updatedParameters.splice(toIndex, 0, movedItem);
      return updatedParameters;
    });
  };

  return (
    <div className="parameters-container">
      <h3>Drag to Prioritize Parameters</h3>
      <AnimatePresence>
        {parameters.map((param, index) => (
          <ParameterItem
            key={param.id}
            id={param.id}
            name={param.name}
            index={index}
            moveItem={moveItem}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

function UploadProblem() {
  const navigate = useNavigate(); // Hook for navigation
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [paramName, setParamName] = useState("");
  const [paramDescription, setParamDescription] = useState("");
  const [department, setDepartmet] = useState("");
  const [parameters, setParameters] = useState([]);
  const [startDate, setStartDate] = useState(getCurrentDate());
  const [endDate, setEndDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const { defaultParameters, setDefaultParameters } = usedefaultParameter();
  const [subject, setSubject] = useState("");
  const [dateError, setDateError] = useState('');


  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    month = month < 10 ? `0${month}` : month;
    day = day < 10 ? `0${day}` : day;

    return `${year}-${month}-${day}`;
  }

  // Function to reset all form fields
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setParamName("");
    setParamDescription("");
    setDepartmet("");
    setParameters([]);
    setStartDate(getCurrentDate());
    setEndDate("");
    setSubject("");
    setError("");
  };

  // Function to handle cancel button click
  const handleCancel = () => {
    resetForm();
    navigate("/teacher-dashboard"); // Redirect to teacher dashboard
  };

  const addParameter = () => {
    if (paramName.trim() && parameters.length < 5) {
      setParameters([
        ...parameters,
        {
          id: Date.now().toString(),
          name: paramName.trim(),
          description: paramDescription.trim() || "No description provided",
        },
      ]);
      setParamName("");
      setParamDescription("");
    } else if (parameters.length >= 5) {
      setError("Maximum 5 parameters allowed");
      setTimeout(() => setError(""), 3000);
    } else {
      setError("Parameter name cannot be empty");
      setTimeout(() => setError(""), 3000);
    }
  };

  const removeDefaultParameter = (id) => {
    setDefaultParameters(defaultParameters.filter((param) => param.id !== id));
  };

  const removeParameter = (id) => {
    setParameters(parameters.filter((param) => param.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDateError('');
    if (!startDate) {
      setError("Start date is required");
      setTimeout(() => setError(""), 3000);
      return;
    }
  
    if (!endDate) {
      setError("Last date is required");
      setTimeout(() => setError(""), 3000);
      return;
    }
    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (start > end) {
      setDateError("End date must be after or equal to start date");
      return;
    }
    if (!description.trim()) {
      setError("Problem statement is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!subject) {
      setError("Subject selection is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (subject === "innovation" && parameters.length === 0) {
      setError("At least one parameter is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!endDate) {
      setError("Last date is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (!endDate) {
      setError("Last date is required");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setIsSubmitting(true);

    // Create the final object with priorities
    const finalData = {
      title,
      description,
      subject,
      department,
      startDate,
      endDate,
    };

    // Create separate parameters object with descriptions
    const finalDataParameters = parameters.map((param, index) => ({
      name: param.name,
      description: param.description,
      priority: index + 1,
    }));

    console.log("Submitting data:", finalData);
    console.log("Parameters data:", finalDataParameters);

    // Simulate API call
    try {
      // Replace with actual API call
      const response = await fetch("http://localhost:3000/event", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...finalData,
          parameters: finalDataParameters,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit. Please try again.");
      }

      const result = await response.json();
      console.log("Submission successful:", result);

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        resetForm();
        navigate("/teacher-dashboard"); // Redirect to dashboard on success
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to submit. Please try again.");
      setTimeout(() => setError(""), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app-container">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="title">Problem Statement Creator</h1>
          <p className="subtitle">
            Create prioritized parameters for student focus
          </p>

          <form onSubmit={handleSubmit}>
            <div className="content-wrapper">
              {/* Left column: Problem Statement & Description */}
              <div className="content-left">
                <div className="form-group">
                  <label htmlFor="tite">Title *</label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter Title"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Problem Statement *</label>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter the main problem statement"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="departmet">Department *</label>
                  <textarea
                    id="department"
                    value={department}
                    onChange={(e) => setDepartmet(e.target.value)}
                    placeholder="Enter department for students"
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">Select Subject *</label>
                  <select
                    id="subject"
                    className="subject-select"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science</option>
                    <option value="coding">Coding</option>
                    <option value="innovation">Innovation Challenge</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="startDate">Start Date *</label>
                  <input
                    className="custom-date"
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      // Reset end date if it's now before the new start date
                      if (e.target.value && endDate && new Date(e.target.value) > new Date(endDate)) {
                        setEndDate('');
                      }
                    }}
                    required
                  />
                </div>
              <div className="form-group">
                <label htmlFor="endDate">Last Date *</label>
                <input
                  className="custom-date"
                  type="date"
                  id="endDate"
                  value={endDate}
                  min={startDate} // Prevent selecting dates before start date
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="Enter End Date"
                  required
                  disabled={!startDate} // Disable end date selection until start date is chosen
                />
                {dateError && <div className="error-message">{dateError}</div>}
              </div>
                {/* <div className="form-group">
                  <label htmlFor="startDate">Start Date *</label>
                  <input
                    className="custom-date"
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="endDate">Last Date *</label>
                  <input
                    className="custom-date"
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="Enter End Date"
                    required
                  />
                </div> */}
                {subject === "innovation" && (
                  <div className="form-group">
                    <label>Added Parameters</label>
                    <div className="parameters-list">
                      {parameters.length > 0 ? (
                        parameters.map((param) => (
                          <motion.div
                            key={param.id}
                            className="parameter-tag"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                          >
                            {param.name}: {param.description}
                            <button
                              type="button"
                              className="remove-btn"
                              onClick={() => removeParameter(param.id)}
                            >
                              ×
                            </button>
                          </motion.div>
                        ))
                      ) : (
                        <p className="parameter-limit">
                          (No parameters added yet)
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Right column: Parameters */}
              {subject === "innovation" && (
                <div className="content-right">
                  <div className="form-group parameter-input">
                    <label htmlFor="paramName">Add Parameters (Max 5)</label>
                    <div className="parameter-add">
                      <input
                        type="text"
                        id="paramName"
                        value={paramName}
                        onChange={(e) => setParamName(e.target.value)}
                        placeholder="Enter parameter name"
                        disabled={parameters.length >= 5}
                      />
                    </div>

                    <label htmlFor="paramDescription">
                      Parameter Description
                    </label>
                    <textarea
                      id="paramDescription"
                      value={paramDescription}
                      onChange={(e) => setParamDescription(e.target.value)}
                      placeholder="Enter parameter description"
                      disabled={parameters.length >= 5}
                    />
                    <button
                      type="button"
                      onClick={addParameter}
                      className="add-btn"
                      disabled={parameters.length >= 5 || !paramName.trim()}
                    >
                      Add Parameter
                    </button>

                    {parameters.length >= 5 && (
                      <p className="parameter-limit">
                        Maximum limit reached (5/5)
                      </p>
                    )}
                  </div>

                  {parameters.length > 0 && (
                    <ParameterList
                      parameters={parameters}
                      setParameters={setParameters}
                    />
                  )}
                </div>
              )}
            </div>

            {subject === "innovation" && (
              <div className="form-group">
                <div className="parameters-list">
                  <label>
                    (Default parameters to evaluate are listed below. You can
                    remove or add your own in the Add Parameters section)
                  </label>
                  {defaultParameters.map((param) => (
                    <motion.div
                      key={param.id}
                      className="parameter-tag"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.3 }}
                    >
                      {param.name}
                      <button
                        type="button"
                        className="remove-btn"
                        onClick={() => removeDefaultParameter(param.id)}
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            <AnimatePresence>
              {error && (
                <motion.div
                  className="error"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="button-group">
              <motion.button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>

              <motion.button
                type="submit"
                className={`submit-btn-2 ${isSubmitting ? "submitting" : ""} ${
                  isSuccess ? "success" : ""
                }`}
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isSubmitting ? (
                  <span className="spinner"></span>
                ) : isSuccess ? (
                  "Success!"
                ) : (
                  "Submit"
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </DndProvider>
  );
}

export default UploadProblem;
