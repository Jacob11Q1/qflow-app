import { Routes, Route, Navigate } from 'react-router-dom'

import AppLayout from '@/components/AppLayout'

import Landing from '@/pages/Landing'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import NotFound from '@/pages/NotFound'

import Dashboard from '@/pages/app/Dashboard'
import Proposals from '@/pages/app/Proposals'
import ScopeCreep from '@/pages/app/ScopeCreep'
import Clients from '@/pages/app/Clients'
import Invoices from '@/pages/app/Invoices'
import Contracts from '@/pages/app/Contracts'
import Revenue from '@/pages/app/Revenue'
import Settings from '@/pages/app/Settings'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Authenticated app shell */}
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Navigate to="/app/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="proposals" element={<Proposals />} />
        <Route path="scope-creep" element={<ScopeCreep />} />
        <Route path="clients" element={<Clients />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="contracts" element={<Contracts />} />
        <Route path="revenue" element={<Revenue />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
