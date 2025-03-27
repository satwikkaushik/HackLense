import { useEffect, useState } from "react";

const dParameters = [
    { id: "1", name: "Relevance" },
    { id: "2", name: "Feasibility" },
    { id: "3", name: "Innovation" },
    { id: "4", name: "Presentation" },
    { id: "5", name: "Impact" },
    { id: "6", name: "Completeness" },
    { id: "7", name: "Technical Depth" },
];


export const usedefaultParameter = () => {
  const [defaultParameters, setDefaultParameters] = useState(dParameters);
  const [loading, setLoading] = useState(false);

//   setDefaultParameters(dParameters)
  useEffect(() => {
    const fetchDefaultParameters =  () => {
        setDefaultParameters(defaultParameters);
    };
    
    fetchDefaultParameters();
  }, [defaultParameters.length]); // Re-fetch when defaultParameter count changes

  
  return {
    // removeDefaultParameter,
    defaultParameters,
    setDefaultParameters,
    loading
  };
};