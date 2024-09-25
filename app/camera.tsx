import { View, StyleSheet } from 'react-native'
import { CameraView } from 'expo-camera'
import { Avatar, Button } from 'react-native-paper'
import * as FileSystem from 'expo-file-system'
import { useEffect, useState } from 'react'

export default function Camera() {
  const [photo, setPhoto] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<string | undefined>(undefined)
  const photoFileName = FileSystem.documentDirectory + 'photo.jpg'

  let cameraRef: CameraView | null = null

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync()
      if (photo) {
        setPhoto(photo.uri)
        await FileSystem.copyAsync({
          from: photo.uri,
          to: photoFileName,
        })    
      }
    }
  }

  const verifyExistedPhoto = async () => {
    const file = await FileSystem.getInfoAsync(photoFileName)
    if(file.exists) {
      setPhoto(file.uri)
    }
  }

  useEffect(() => {
    verifyExistedPhoto()
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