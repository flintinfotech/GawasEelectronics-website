import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthShell from '../components/AuthShell'

export default function Login() {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  // ProtectedRoute sends the page the customer wanted in location.state.from -> go back there after login
  const from = (location.state as { from?: string } | null)?.from
  if (isAuthenticated) return <Navigate to={from && from.startsWith('/') ? from : '/'} replace />
  return <AuthShell initialMode="login" />
}