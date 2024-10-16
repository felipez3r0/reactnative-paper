import { initializeApp } from 'firebase/app'

const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
  measurementId: ""
}

const firebaseApp = initializeApp(firebaseConfig)

export default firebaseApp