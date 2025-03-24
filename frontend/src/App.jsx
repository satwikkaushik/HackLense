import { Routes, Route } from "react-router-dom";
import './App.css'
import LandingPage from './Pages/LandingPage';
import ChatbotButton from './components/ChatbotButton';
import StudentDashboard from './student-teacher/student/StudentDashboard'
import LoginPage from "./Pages/LoginPage";
import SignUpPage from "./Pages/SignUpPage";
import ContactPage from "./Pages/ContactPage";
import ScrollToTop from "./components/ScrollToTop";
import TeacherDashboard from "./student-teacher/teacher/dashboard/TeacherDashboard";
import UploadProblem from './student-teacher/teacher/components/uploadProblem/UploadProblem'

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/teacher-dashboard" element={<TeacherDashboard  />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/login-page" element={<LoginPage />} />
        <Route path="/signup-page" element={<SignUpPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/upload-problem" element={<UploadProblem/>}></Route>
      </Routes>
      <ChatbotButton />
      
    </>
  )
}

export default App