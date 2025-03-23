// npm install react-dnd react-dnd-html5-backend framer-motion

import React, { useState, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import './UploadProblem.css';
import { usedefaultParameter} from '../hooks/useDefaultParameters';

const ItemTypes = {
  PARAMETER: 'parameter',
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
      className={`parameter-item ${isDragging ? 'dragging' : ''}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="drag-handle">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

function App() {
  const [problemStatement, setProblemStatement] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [paramName, setParamName] = useState('');
  const [parameters, setParameters] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const {defaultParameters, setDefaultParameters} = usedefaultParameter();

  const addParameter = () => {
    if (paramName.trim() && parameters.length < 5) {
      setParameters([
        ...parameters,
        { id: Date.now().toString(), name: paramName.trim() },
      ]);
      setParamName('');
    } else if (parameters.length >= 5) {
      setError('Maximum 5 parameters allowed');
      setTimeout(() => setError(''), 3000);
    } else {
      setError('Parameter name cannot be empty');
      setTimeout(() => setError(''), 3000);
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

    if (!problemStatement.trim()) {
      setError('Problem statement is required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    if (parameters.length === 0) {
      setError('At least one parameter is required');
      setTimeout(() => setError(''), 3000);
      return;
    }

    setIsSubmitting(true);

    // Create the final object with priorities
    const finalData = {
      problemStatement,
      problemDescription,
      parameters: parameters.map((param, index) => ({
        id: param.id,
        name: param.name,
        priority: index + 1,
      })),
    };

    console.log('Submitting data:', finalData);

    // Simulate API call
    try {
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setProblemStatement('');
        setProblemDescription('');
        setParameters([]);
      }, 2000);
    } catch (err) {
      setError('Failed to submit. Please try again.');
      setTimeout(() => setError(''), 3000);
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
          <p className="subtitle">Create prioritized parameters for student focus</p>
          
          <form onSubmit={handleSubmit}>
            <div className="content-wrapper">
              {/* Left column: Problem Statement & Description */}
              <div className="content-left">
                <div className="form-group">
                  <label htmlFor="problemStatement">Problem Statement *</label>
                  <textarea
                    // type="text"
                    id="problemStatement"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Enter the main problem statement"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="problemDescription">Problem Description</label>
                  <textarea
                    id="problemDescription"
                    value={problemDescription}
                    onChange={(e) => setProblemDescription(e.target.value)}
                    placeholder="Provide additional details about the problem"
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="problemStatement">Problem Statement *</label>
                  <input class="custom-date"
                    type="date"
                    id="startDate"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Enter Start Day"
                    required
                  />
                </div>

                <div className="form-group"> 
                  <label htmlFor="problemStatement">Problem Statement *</label>
                  <input class="custom-date"
                    type="date"
                    id="endDate"
                    value={problemStatement}
                    onChange={(e) => setProblemStatement(e.target.value)}
                    placeholder="Enter End Date"
                    required
                  />
                </div>
              </div>
              
              {/* Right column: Parameters */}
              <div className="content-right">
                <div className="form-group parameter-input">
                  <label htmlFor="paramName">Add Parameters (Max 5)</label>
                  <div className="parameter-add">
                    <input
                      type="text"
                      id="paramName"
                      value={paramName}
                      onChange={(e) => setParamName(e.target.value)}
                      placeholder="Enter parameter"
                      disabled={parameters.length >= 5}
                    />
                    <button
                      type="button"
                      onClick={addParameter}
                      className="add-btn"
                      disabled={parameters.length >= 5}
                    >
                      Add
                    </button>
                  </div>
                  {parameters.length >= 5 && (
                    <p className="parameter-limit">Maximum limit reached (5/5)</p>
                  )}
                </div>

                {parameters.length > 0 && (
                  <ParameterList 
                    parameters={parameters} 
                    setParameters={setParameters} 
                  />
                )}

                <div className="parameters-list">
                  {parameters.map((param) => (
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
                        onClick={() => removeParameter(param.id)}
                      >
                        ×
                      </button>
                    </motion.div>
                  ))}
                </div>
                <div className="parameters-list">
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
            </div>

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

            <motion.button
              type="submit"
              className={`submit-btn ${isSubmitting ? 'submitting' : ''} ${isSuccess ? 'success' : ''}`}
              disabled={isSubmitting}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isSubmitting ? (
                <span className="spinner"></span>
              ) : isSuccess ? (
                'Success!'
              ) : (
                'Submit'
              )}
            </motion.button>
          </form>
        </motion.div>
      </div>
    </DndProvider>
  );
}

export default App;
