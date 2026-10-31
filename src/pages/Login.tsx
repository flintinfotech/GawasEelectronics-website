import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthShell from '../components/AuthShell'

export default function Login() {
  const { user } = useAuth()
  if (user) return <Navigate to="/" replace />
  return <AuthShell initialMode="login" />
}