import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import '../App.css'
import { AuthProvider } from '../context/AuthContext'
import { ClientProvider } from '../context/ClientContext'
import Login from "../pages/Login/login"
import Home from "../pages/Home"
import Client from "../pages/Client"
import ClientDetail from "../pages/ClientDetail"
import Proposal from "../pages/Proposal"
import Contract from "../pages/Contract"
import ESign from "../pages/ESign"
import ContractDetail from "../pages/ContractDetail"
import ProposalDiscussion from "../pages/ProposalDiscussion"
import UploadDocument from "../pages/UploadDocument"
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
                <Route path="client/:clientId" element={<ClientDetail />} />
                <Route path="proposal" element={<Proposal />} />
                <Route path="contract" element={<Contract />} />
                <Route path="contract/:id" element={<ContractDetail />} />
                <Route path="proposal-discussion/:id" element={<ProposalDiscussion />} />
                <Route path="e-sign" element={<ESign />} />
                <Route path="e-sign/:id" element={<ContractDetail />} />
                <Route path="upload-document" element={<UploadDocument />} />
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
