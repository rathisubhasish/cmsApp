import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import '../App.css'
import { AuthProvider } from '../context/AuthContext'
import { ClientProvider } from '../context/ClientContext'
import Login from "../pages/Login/login"
import ProtectedRoute from '../routes/ProtectedRoutes'
import HomeLayout from '../HomeLayout'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClientProvider>
          <Routes>
             <Route element={<ProtectedRoute />}>
             <Route element={<HomeLayout />}>
              {/* <Route index element={<Dashboard />} /> */}
             
            </Route>
          </Route>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </ClientProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
