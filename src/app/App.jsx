import { BrowserRouter, Route, Routes } from 'react-router-dom'
import '../App.css'
import { AuthProvider } from '../context/AuthContext'
import { ClientProvider } from '../context/ClientContext'
import Login from "../pages/Login/login"
import Home from "../pages/Home"
import Client from "../pages/Client"
import ClientDetail from "../pages/ClientDetail"
import Proposal from "../pages/Proposal"
import CreateProposal from "../pages/Proposal/Create"
import ProposalBuilder from "../pages/Proposal/Builder"
import Contract from "../pages/Contract"
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
                <Route path="proposal/create" element={<CreateProposal />} />
                <Route path="proposal/:id" element={<ProposalBuilder />} />
                <Route path="contract" element={<Contract />} />
                <Route path="contract/:id" element={<ContractDetail />} />
                <Route path="proposal-discussion/:id" element={<ProposalDiscussion />} />
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
