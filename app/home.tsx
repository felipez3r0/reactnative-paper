import { View, Text, StyleSheet } from 'react-native'
import { useAuth } from '../context/auth'
import { Link } from 'expo-router'

export default function Home() {
  const { user } = useAuth()

  return (
    <View style={styles.container}>
      <Text>Bem-vindo, {user.email}!</Text>
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