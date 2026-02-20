import { useContext } from 'react'
import { AuthContext } from '../core/contexts/auth'

export const useAuth = () => useContext(AuthContext)
