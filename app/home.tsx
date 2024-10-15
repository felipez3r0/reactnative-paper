import { View, Text, StyleSheet } from 'react-native'
import { useAuth } from '../context/auth'
import { Link } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { useEffect, useState } from 'react'

export default function Home() {
  const { user } = useAuth()
  const [token, setToken] = useState('') // Criamos um estado para armazenar o token

  useEffect(() => {
    async function getToken() {
      const token = await SecureStore.getItemAsync('token') // Recuperamos o token do SecureStore
      if(token) setToken(token)
    }

    getToken()
  }, [])

  return (
    <View style={styles.container}>
      <Text>Bem-vindo, {user.email}!</Text>
      <Text>Token: {token}</Text>
      <Link href="/sensors">Sensores</Link>
      <Link href="/camera">Câmera</Link>
      <Link href="/profile">Perfil</Link>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  }
})