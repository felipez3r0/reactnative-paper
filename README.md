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

## 4 - Implementando a tela de login com useContext

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

### 5 - Utlizando bibliotecas como expo-sensors e o expo-camera

Podemos utilizar bibliotecas do Expo para acessar sensores do dispositivo. Vamos utilizar o `expo-sensors` para acessar o giroscópio do dispositivo.

```tsx
// app/sensors.tsx
import { View, Text, StyleSheet } from 'react-native'
import { Gyroscope } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Button } from 'react-native-paper';
import { Subscription } from 'expo-sensors/build/Pedometer'

export default function Sensors() {
  const [{ x, y, z }, setData] = useState({
    x: 0,
    y: 0,
    z: 0,
  }); // Cria um objeto com x, y e z
  const [subscription, setSubscription] = useState<Subscription | null>(null); // Cria uma subscription para o giroscópio - esse hook é utilizado para armazenar o estado do giroscópio

  const _slow = () => Gyroscope.setUpdateInterval(1000); // Função para setar o intervalo de atualização do giroscópio para 1000ms
  const _fast = () => Gyroscope.setUpdateInterval(16); // Função para setar o intervalo de atualização do giroscópio para 16ms

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);
      })
    );
  }; // Função para adicionar um listener ao giroscópio

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  }; // Função para remover o listener do giroscópio

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []); // Hook para adicionar o listener ao giroscópio e remover o listener ao desmontar o componente

  return (
    <View style={styles.container}>
      <Text>Giroscópio</Text>
      <Text>X: {x}</Text>
      <Text>Y: {y}</Text>
      <Text>Z: {z}</Text>

      <Button onPress={_slow}>Lento</Button>
      <Button onPress={_fast}>Rápido</Button>
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

Podemos criar também uma tela para acessar a câmera do dispositivo utilizando o `expo-camera`.

```tsx
// app/camera.tsx
import { View, StyleSheet } from 'react-native'
import { CameraView } from 'expo-camera'

export default function Camera() {
  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing='back' />
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
  camera: {
    height: 300,
    width: 300,
  }
})
```

Na home podemos adicionar botões para acessar as telas de sensores e câmera. Lembrando que o componente Link é importado do `expo-router`.

```tsx
      <Link href="/sensors">Sensores</Link>
      <Link href="/camera">Câmera</Link>
```

Usando outra extensão do Expo, o `expo-file-system`, podemos salvar a imagem capturada pela câmera no dispositivo. Vamos adicionar um botão para tirar a foto e outro para salvar a foto. A foto que for salva nesse formato será exibida na tela usando o cache e vai ficar salva dentro da pasta do app (detalhe aqui é que essa pasta não é acessível pelo usuário sem ser com acesso root).

```tsx
// app/camera.tsx
import { View, StyleSheet } from 'react-native'
import { CameraView } from 'expo-camera'
import { Avatar, Button } from 'react-native-paper'
import * as FileSystem from 'expo-file-system'
import { useEffect, useState } from 'react'

export default function Camera() {
  const [photo, setPhoto] = useState<string | null>(null) // Cria um estado para armazenar a foto
  const photoFileName = FileSystem.documentDirectory + 'photo.jpg' // Cria um caminho para salvar a foto

  let cameraRef: CameraView | null = null

  const takePicture = async () => { // Função para tirar a foto
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync() // Tira a foto
      if (photo) {
        setPhoto(photo.uri) // Atualiza o estado da foto
        await FileSystem.copyAsync({ // Copia a foto para o caminho criado
          from: photo.uri,
          to: photoFileName,
        })    
      }
    }
  }

  const verifyExistedPhoto = async () => { // Função para verificar se a foto já existe
    const file = await FileSystem.getInfoAsync(photoFileName) // Verifica se a foto já existe
    if(file.exists) {
      setPhoto(file.uri) // Atualiza o estado da foto
    }
  }

  useEffect(() => {
    verifyExistedPhoto() // Verifica se a foto já existe
  }, [])

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} ref={ref => cameraRef = ref} facing='front' />
      <Button onPress={takePicture}>Tirar foto</Button>

      {photo && <Avatar.Image size={250} source={{ uri: photo }} />}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  camera: {
    height: 300,
    width: 300,
  }
})
```

### 6 - Criando uma página com a View em abas no Expo Router

Vamos começar criando uma pasta chamada profile e dentro dela vamos criar um arquivo _layout.tsx e uma pasta (tabs) com os arquivos index.tsx e configuration.tsx

Na pasta profile vamos criar um arquivo _layout.tsx

```tsx
import { Stack } from 'expo-router/stack';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}
```

Na pasta profile/tabs vamos criar um arquivo _layout.tsx também e adicionar o código abaixo.

```tsx
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: 'blue' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Início',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="configuration"
        options={{
          title: 'Configuração',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="cog" color={color} />,
        }}
      />
    </Tabs>
  );
}
```

Ainda na pasta profile/(tabs) vamos criar um arquivo index.tsx

```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab Home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```

E um arquivo configuration.tsx

```tsx
import { View, Text, StyleSheet } from 'react-native';

export default function Tab() {
  return (
    <View style={styles.container}>
      <Text>Tab Configurações</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
```
