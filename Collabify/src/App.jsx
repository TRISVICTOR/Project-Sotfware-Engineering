import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import PageAwal from "./pages/PageAwal"
import Login from "./pages/LogInPage"
import Signup from "./pages/SignUpPage"
import Home from "./pages/HomePage"
import PageMyTask from "./pages/MyTaskPage"
import PageFriend from "./pages/FriendPage"
import AddTaskPage from "./pages/AddTaskPage"
import AddFriendPage from "./pages/AddFriendPage"
import AssignmentGroup from "./pages/AssignmentTaskIfAGroupProject"
import ProfilePage from "./pages/ProfilePage"
import ChangePassword from "./pages/ChangePasswordPage"
import ChangeUsernameEmail from "./pages/ChangeUsernameEmailPage"

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" />
  return children
}

const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <div>Loading...</div>
  if (user) return <Navigate to="/home" />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Halaman BELUM login */}
        <Route path="/" element={<PageAwal />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/signup" element={<GuestRoute><Signup /></GuestRoute>} />

        {/* Halaman SUDAH login */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/mytask" element={<ProtectedRoute><PageMyTask /></ProtectedRoute>} />
        <Route path="/friend" element={<ProtectedRoute><PageFriend /></ProtectedRoute>} />
        <Route path="/addtask" element={<ProtectedRoute><AddTaskPage /></ProtectedRoute>} />
        <Route path="/addfriend" element={<ProtectedRoute><AddFriendPage /></ProtectedRoute>} />
        <Route path="/groupproject" element={<ProtectedRoute><AssignmentGroup /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/changepassword" element={<ProtectedRoute><ChangePassword /></ProtectedRoute>} />
        <Route path="/changeusernameemail" element={<ProtectedRoute><ChangeUsernameEmail /></ProtectedRoute>} />

      </Routes>
    </BrowserRouter>
  )
}

export default App