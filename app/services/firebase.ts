import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "SUA_API",
  authDomain: "SEU_DOMINIO",
  projectId: "SEU_ID",
  databaseURL: "SUA_URL",
  storageBucket: "SEU_BUCKET",
  messagingSenderId: "SEU_ID"
}

const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp