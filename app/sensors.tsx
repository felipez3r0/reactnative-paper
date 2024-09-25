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
  });
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const _slow = () => Gyroscope.setUpdateInterval(1000);
  const _fast = () => Gyroscope.setUpdateInterval(16);

  const _subscribe = () => {
    setSubscription(
      Gyroscope.addListener(gyroscopeData => {
        setData(gyroscopeData);
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);  

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