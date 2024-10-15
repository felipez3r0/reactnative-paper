import React, { createContext, useContext, useState } from 'react'
import { router } from 'expo-router'
import firebaseApp from '../app/services/firebase'
import { initializeAuth, signInWithEmailAndPassword } from 'firebase/auth'

interface IUser {
  email: string
  password: string
}

interface IAuthContext {
  user: IUser
  setUser: (user: IUser) => void
  handleLogin: () => void
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext)

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser>({email: '', password: ''})

  function handleLogin() {
    if(!user || user.email === '' && user.password === '') {
      alert('Usuário ou senha inválidos')
    }

    const auth = initializeAuth(firebaseApp)
    signInWithEmailAndPassword(auth, user.email, user.password)
      .then(() => {
        router.push('Home')
      })
      .catch(() => {
        alert('Usuário ou senha inválidos')
      })
  }

  return (
    <AuthContext.Provider value={{ user, handleLogin, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}