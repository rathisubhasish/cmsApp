import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import '../App.css'
import { AuthProvider } from '../context/AuthContext'
import { ClientProvider } from '../context/ClientContext'
import Login from "../pages/Login/login"
import Home from "../pages/Home"
import Client from "../pages/Client"
import Proposal from "../pages/Proposal"
import Settings from "../pages/Settings"
import ProtectedRoute from '../routes/ProtectedRoutes'
import HomeLayout from '../HomeLayout'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ClientProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute />}>
              <Route element={<HomeLayout />}>
                <Route index element={<Home />} />
                <Route path="client" element={<Client />} />
                <Route path="proposal" element={<Proposal />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </ClientProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
