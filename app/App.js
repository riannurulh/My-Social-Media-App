import { StatusBar } from 'expo-status-bar';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Login from './pages/Login';
import Register from './pages/Register';

export default function App() {
  return (
    <View style={styles.container}>
      <Login/>
      {/* <Register/> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
  }
});
