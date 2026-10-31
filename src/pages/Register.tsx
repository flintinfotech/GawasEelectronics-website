import { Navigate } from 'react-router-dom'

// The backend has no customer registration API yet, so /register simply opens the login page.
export default function Register() {
  return <Navigate to="/login" replace />
}