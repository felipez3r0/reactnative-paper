import { View, Text, StyleSheet } from 'react-native'
import { useAuth } from '../context/auth'

export default function Home() {
  const { user } = useAuth()

  return (
    <View style={styles.container}>
      <Text>Bem-vindo, {user.email}!</Text>
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