import { View, StyleSheet } from 'react-native'
import { Button, TextInput } from 'react-native-paper'

export default function Login() {
  return (
    <View style={styles.container}>
      <TextInput label="Email" style={styles.mt20} />
      <TextInput label="Senha" secureTextEntry={true} style={styles.mt20} />
      <Button mode="contained" style={styles.mt20}>Entrar</Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  mt20: {
    marginTop: 20,
  },
})