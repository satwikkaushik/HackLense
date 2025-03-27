import { useEffect, useState } from "react";

const BACKEND_URL = "http://localhost:3000";

/*
{
    _id: '624f2f1c9b0b3b0015f3b3b3',
    title: 'After Cookies Two 2',
    description: 'asdasd',
    subject: 'coding',
    startDate: 2025-03-25T00:00:00.000Z,
    endDate: 2025-03-29T00:00:00.000Z,
    parameters: [],
    submissions: 0,
    createdBy: new ObjectId('67dfedaef5366cc72a57ae47'),
    keywords: [],
    createdAt: 2025-03-24T19:01:00.148Z,
  }
*/

export const useAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAssignments = async () => {
      //add async
      setLoading(true);
      try {
        // Replace with your actual API endpoint
        const response = await fetch(`${BACKEND_URL}/event`);
        const data = await response.json();
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
    console.log(assignments);
  }, [assignments.length]); // Re-fetch when assignment count changes

  return {
    assignments,
    setAssignments,
    loading,
  };
};
