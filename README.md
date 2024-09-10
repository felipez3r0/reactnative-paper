# Projeto React Native + React Native Paper

## Descrição

Projeto desenvolvido com React Native e React Native Paper.

## Instalação

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

## Configuração do PaperProvider

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


