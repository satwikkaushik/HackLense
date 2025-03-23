import { useEffect, useState } from "react";
// const mockUser=[
//     {
//         id:1,
//         name:"golu don",
//         subject:"angrezi",
//         marks:90,
//         isSubmitted:[
//             {problemStatementid: 1, isSubmitted:false},
//             {problemStatementid: 2, isSubmitted:false},
//             {problemStatementid: 1, isSubmitted:false}
//         ]

//     }
// ]
const mockAssignments = [
    {
      id: 1,
      title: 'Calculus Problem Set 3',
      description: 'Complete problems 1-15 from Chapter 4',
      subject: 'Mathematics',
      deadline: '2025-03-25T23:59:59',
      status: 'pending',
      isPinned: true,
      color: '#4f6df5',
    },
    {
      id: 2,
      title: 'Essay on Modern Literature',
      description: 'Write a 1500-word analysis of post-modern themes in selected works',
      subject: 'Computer Science',
      deadline: '2025-03-28T23:59:59',
      status: 'pending',
      isPinned: false,
      color: '#e64c65',
    },
    {
      id: 3,
      title: 'Physics Lab Report',
      description: 'Document your findings from the pendulum experiment',
      subject: 'Science',
      deadline: '2025-03-24T23:59:59',
      status: 'submitted',
      submittedOn: '2025-03-20T15:30:00',
      submissionType: 'pdf',
      isPinned: false,
      color: '#11a8ab',
    },
    {
      id: 4,
      title: 'History Research Paper',
      description: 'Research paper on the Industrial Revolution',
      subject: 'Computer Science',
      deadline: '2025-03-15T23:59:59',
      status: 'graded',
      grade: 'A-',
      feedback: 'Excellent research but conclusion could be stronger.',
      submittedOn: '2025-03-14T22:15:00',
      submissionType: 'docx',
      isPinned: false,
      color: '#fcb150',
    },
    {
      id: 5,
      title: 'Chemistry Experiment Analysis',
      description: 'Analyze the results of our acid-base titration experiment',
      subject: 'Science',
      deadline: '2025-03-26T23:59:59',
      status: 'pending',
      isPinned: false,
      color: '#50c1e9',
    }
  ];

export const useAssignment = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchAssignments =  () => {//add async
    //   setLoading(true);
    //   try {
    //     // Replace with your actual API endpoint
    //     const response = await fetch('/api/assignments');
    //     const data = await response.json();
    //     setAssignments(data);
    //   } catch (error) {
    //     console.error('Error fetching assignments:', error);
    //   } finally {
    //     setLoading(false);
    //   }
        setAssignments(mockAssignments);
    
    };
    
    fetchAssignments();
  }, [assignments.length]); // Re-fetch when assignment count changes
  
  return {
    assignments,
    loading
  };
};
 