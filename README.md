# Projeto React Native + React Native Paper

## Descrição

Projeto desenvolvido com React Native e React Native Paper.

## 1 - Instalação

Vamos criar o projeto partindo de um template em branco com TypeScript.

```bash
npx create-expo-app@latest --template expo-template-blank-typescript
```

Vamos instalar algumas dependências adicionais como o Router, Safe-Area e etc

```bash
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

Agora vamos instalar o [React Native Paper](https://reactnativepaper.com/).

```bash
npx expo install react-native-paper
```

Vamos adicionar mais algumas dependências que serão utilizadas no decorrer do projeto.

```bash
npx expo install axios firebase expo-camera expo-file-system expo-secure-store expo-sensors
```

## 2 - Configuração do PaperProvider

Vamos configurar o `PaperProvider` no arquivo `App.tsx`.

```tsx
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import { PaperProvider } from 'react-native-paper'

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!</Text>
        <StatusBar style="auto" />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
```

Podemos adicionar um Button agora para testar o React Native Paper.

```tsx
<Button icon="camera" mode="contained">
  Press me
</Button>
```

## 3 - Criando uma tela de login básica

Devemos ajustar agora o entry point no package.json para que o Expo Router funcione corretamente.

```json
"main": "expo-router/entry",
```

Vamos adicionar também o scheme no app.json para configurar o deep linking (cuidado com espaços e acentos, lembre-se que isso pode quebrar o projeto)

```json
"expo": {
    "scheme": "nome-do-projeto"
  }
```

Agora podemos criar uma pasta `app`e dentro dela vamos adicionar um arquivo `index.tsx` que será nossa tela de login e um arquivo `_layout.tsx` que será o layout padrão do app.

```tsx
// app/_layout.tsx
import { Slot } from "expo-router"
import { PaperProvider } from "react-native-paper"

export default function Layout() {
  return (
    <PaperProvider>
      <Slot />
    </PaperProvider>
  )
}
```

```tsx
// app/index.tsx
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
```

## Implementando uma tela de login com useContext

Vamos criar um contexto para armazenar o estado de autenticação do usuário. Nosso login será inicialmente feito com usuário e senha fixos.

Depois vamos implementar o login com Firebase e usando nossa API.

```tsx
// context/auth.tsx
import React, { createContext, useContext, useState } from 'react'
import { router } from 'expo-router'

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
    if(user && user.email === 'admin' && user.password === 'admin') {
      router.push('home')
    } else {
      alert('Usuário ou senha inválidos')
    }
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
```

Precisamos adicionar o nosso Provider ao arquivo _layout.tsx.

```tsx
import { Slot } from "expo-router"
import { PaperProvider } from "react-native-paper"
import { AuthProvider } from "../context/auth"

export default function Layout() {
  return (
      <PaperProvider>
        <AuthProvider>
          <Slot />
        </AuthProvider>
      </PaperProvider>
  )
}
```

Agora vamos ajustar o arquivo `app/index.tsx` para utilizar o contexto de autenticação.

```tsx
import { View, StyleSheet } from 'react-native'
import { Button, TextInput } from 'react-native-paper'
import { useAuth } from '../context/auth'

export default function Login() {
  const { user, handleLogin, setUser } = useAuth()

  return (
    <View style={styles.container}>
      <TextInput label="Email" style={styles.mt20} onChangeText={text => setUser({...user, email: text})} />
      <TextInput label="Senha" secureTextEntry={true} style={styles.mt20} onChangeText={text => setUser({...user, password: text})} />
      <Button mode="contained" style={styles.mt20} onPress={handleLogin}>Entrar</Button>
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
```

Agora podemos criar a rota `home` e a tela `Home` para redirecionar o usuário após o login.

```tsx
// app/home.tsx
import { View, Text, StyleSheet } from 'react-native'

export default function Home() {
  return (
    <View style={styles.container}>
      <Text>Bem-vindo!</Text>
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
```

Com o context podemos imprimir o email do usuário na tela de `Home`.

```tsx
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
```