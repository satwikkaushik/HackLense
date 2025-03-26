"use client"
import React from 'react'
import Navbar from '../components/Navbar'
import { useState, useEffect } from "react"
import "./Resource.css"
import { Trophy, Download, Eye, BookOpen, User } from "lucide-react"

const Resource = () => {
    const [topProblems, setTopProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [motivationalQuote, setMotivationalQuote] = useState("")

  const quotes = [
    "Success is not final, failure is not fatal: It is the courage to continue that counts.",
    "Education is the most powerful weapon which you can use to change the world.",
    "The beautiful thing about learning is that nobody can take it away from you.",
    "The function of education is to teach one to think intensively and to think critically.",
    "The mind is not a vessel to be filled, but a fire to be kindled.",
  ]

  useEffect(() => {
    // Set a random motivational quote
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)]
    setMotivationalQuote(randomQuote)

    // Fetch top problems and achievers
    const fetchTopProblems = async () => {
      try {
        setLoading(true)
        // This would be replaced with your actual API endpoint
        const response = await fetch("/api/top-achievers")

        if (!response.ok) {
          throw new Error("Failed to fetch top achievers data")
        }

        const data = await response.json()
        setTopProblems(data)
        setLoading(false)
      } catch (err) {
        setError(err.message)
        setLoading(false)

        // For demo purposes, set mock data if API fails
        setTopProblems([
          {
            id: 1,
            title: "Advanced Calculus Problem Set",
            description: "Solve the following problems related to multivariable calculus and optimization.",
            subject: "Mathematics",
            color: "#4285F4",
            achievers: [
              { id: 101, name: "Emma Johnson", score: 98, grade: "A+", submissionId: "sub_123", submissionType: "pdf" },
              { id: 102, name: "Michael Chen", score: 96, grade: "A", submissionId: "sub_124", submissionType: "jpg" },
            ],
          },
          {
            id: 2,
            title: "Literary Analysis: Shakespeare's Macbeth",
            description: "Analyze the themes of ambition and moral corruption in Shakespeare's Macbeth.",
            subject: "Literature",
            color: "#EA4335",
            achievers: [
              {
                id: 203,
                name: "Sophia Williams",
                score: 97,
                grade: "A+",
                submissionId: "sub_223",
                submissionType: "docx",
              },
              {
                id: 204,
                name: "James Rodriguez",
                score: 95,
                grade: "A",
                submissionId: "sub_224",
                submissionType: "pdf",
              },
            ],
          },
          {
            id: 3,
            title: "Physics: Quantum Mechanics Principles",
            description: "Explain the fundamental principles of quantum mechanics and their applications.",
            subject: "Physics",
            color: "#FBBC05",
            achievers: [
              {
                id: 305,
                name: "Olivia Martinez",
                score: 99,
                grade: "A+",
                submissionId: "sub_323",
                submissionType: "pdf",
              },
              {
                id: 306,
                name: "Noah Thompson",
                score: 97,
                grade: "A+",
                submissionId: "sub_324",
                submissionType: "docx",
              },
            ],
          },
          {
            id: 4,
            title: "Introduction to Python Programming",
            description:
              "Create a simple program that demonstrates basic Python concepts including variables, loops, and functions.",
            subject: "Computer Science",
            color: "#34A853",
            achievers: [
              { id: 407, name: "Ethan Brown", score: 100, grade: "A+", submissionId: "sub_423", submissionType: "zip" },
              { id: 408, name: "Ava Garcia", score: 98, grade: "A+", submissionId: "sub_424", submissionType: "py" },
            ],
          },
          {
            id: 5,
            title: "Historical Analysis: World War II",
            description: "Analyze the causes and consequences of World War II with a focus on diplomatic relations.",
            subject: "History",
            color: "#673AB7",
            achievers: [
              { id: 509, name: "Liam Wilson", score: 96, grade: "A", submissionId: "sub_523", submissionType: "pdf" },
              {
                id: 510,
                name: "Isabella Taylor",
                score: 94,
                grade: "A",
                submissionId: "sub_524",
                submissionType: "docx",
              },
            ],
          },
        ])
      }
    }

    fetchTopProblems()
  }, [])

  // Function to handle downloading a submission
  const handleDownload = (submissionId, studentName, submissionType) => {
    // In a real application, this would make an API call to download the file
    console.log(`Downloading submission ${submissionId} from ${studentName}`)

    // Mock download functionality
    alert(`Downloading ${studentName}'s submission (${submissionType.toUpperCase()})`)
  }

  // Function to handle viewing a submission
  const handleViewSubmission = (submissionId, studentName) => {
    // In a real application, this would navigate to a submission view page
    console.log(`Viewing submission ${submissionId} from ${studentName}`)

    // Mock view functionality
    alert(`Viewing ${studentName}'s submission details`)
  }

  // Helper function to get file type icon
  const getFileTypeIcon = (type) => {
    if (!type) return "📄"; // Default icon for unknown types
  
    switch (type.toLowerCase()) {
      case "pdf":
        return "📄";
      case "docx":
      case "doc":
        return "📝";
      case "ppt":
      case "pptx":
        return "📊";
      case "zip":
        return "📦";
      case "py":
        return "🐍";
      case "jpg":
      case "jpeg":
      case "png":
      case "gif":
      case "svg":
        return "🖼️"; // Image icon
      case "mp3":
      case "wav":
      case "aac":
      case "ogg":
        return "🎵"; // Audio icon
      case "mp4":
      case "avi":
      case "mov":
      case "mkv":
      case "webm":
        return "🎬"; // Video icon
      default:
        return "📄"; // Generic file icon
    }
  };
  

  if (loading) {
    return (
      <div class="loading-overlay">
        <div class="loading-container">
          <div class="loading-spinner"></div>
            <div class="loading-text">Loading Top Achievers...</div>
        </div>
      </div>
    )
  }

  if (error && topProblems.length === 0) {
    return (
      <div className="top-achievers-container">
        <div className="error-message">
          <h2>Error Loading Data</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Try Again</button>
        </div>
      </div>
    )
  }

  return (
    <>
    <Navbar />
    <div className="top-achievers-container">
      <div className="top-achievers-header fade-in">
        <div className="header-content">
          <h1>
            <Trophy className="trophy-icon" /> Our Top Achievers
          </h1>
          <p className="motivational-quote">"{motivationalQuote}"</p>
          <p className="subtitle">Celebrating excellence in our recent challenges</p>
        </div>
      </div>

      <div className="problems-list fade-in">
        {topProblems.map((problem, index) => (
          <div
            key={problem.id}
            className="problem-card fade-in"
            style={{ "--card-index": index, "--card-color": problem.color }}
          >
            <div className="problem-header" style={{ backgroundColor: problem.color }}>
              <h3>{problem.title}</h3>
            </div>
            <div className="problem-details">
              <p className="description">{problem.description}</p>
              <div className="problem-meta">
                <span className="subject" style={{ backgroundColor: problem.color }}>
                  <BookOpen className="meta-icon" /> {problem.subject}
                </span>
              </div>

              <div className="achievers-section">
                <h4>Top Performers</h4>

                {problem.achievers.map((achiever, idx) => (
                  <div key={achiever.id} className="achiever-card">
                    <div className="achiever-rank">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : "🥉"}</div>
                    <div className="achiever-info">
                      <div className="achiever-name-score">
                        <h5>
                          <User className="user-icon" /> {achiever.name}
                        </h5>
                        <div className="score">
                          <span className="score-value">{achiever.score}</span>
                          <span className="score-max">/100</span>
                          <span className="grade">{achiever.grade}</span>
                        </div>
                      </div>
                      <div className="submission-type">
                        <span className="file-type">
                          {getFileTypeIcon(achiever.submissionType)} {achiever.submissionType.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <div className="achiever-actions">
                      <button
                        className="download-button"
                        onClick={() => handleDownload(achiever.submissionId, achiever.name, achiever.submissionType)}
                        title={`Download ${achiever.name}'s submission`}
                      >
                        <Download className="button-icon" />
                      </button>
                      <button
                        className="view-button"
                        onClick={() => handleViewSubmission(achiever.submissionId, achiever.name)}
                        title={`View ${achiever.name}'s submission`}
                      >
                        <Eye className="button-icon" /> View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    </>
  )
}

export default Resource





