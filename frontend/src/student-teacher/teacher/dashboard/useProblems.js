import { useState, useEffect } from "react";

const BACKEND_URL = "http://localhost:3000";

/*
createdAt
: 
"2025-03-24T06:57:22.530Z"
createdBy
: 
"67dfeddef5366cc72a57ae51"
description
: 
"A 48-hour hackathon to solve real-world problems."
endDate
: 
"2025-04-03T09:00:00.000Z"
keywords
: 
[]
parameters
: 
[]
rubric
: 
"67e070ef9ef4da4b34d02b8e"
startDate
: 
"2025-04-01T09:00:00.000Z"
submissions
: 
2
title
: 
"Hackathon 2025"
__v
: 
0
_id
: 
"67e10252e39d7bcc3dc4d0a0"
*/
export const useProblems = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchProblems = async () => {
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${BACKEND_URL}/event/specific`, {
          credentials: "include", // This ensures cookies are sent with the request
        });
        const data = await response.json();
        setProblems(data);
      } catch (error) {
        console.error("Error fetching problems:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  return { problems, loading, setProblems };
};
