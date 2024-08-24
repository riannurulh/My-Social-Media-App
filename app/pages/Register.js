import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useMutation, gql } from '@apollo/client';


const REGISTER_MUTATION = gql`
  mutation Register($form: UserForm!) {
    register(form: $form) {
      _id
      name
      username
      email
    }
  }
`;

const Register = ({ navigation }) => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  
  const [register, { loading, error }] = useMutation(REGISTER_MUTATION);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    try {
      const { data } = await register({
        variables: {
          form: {
            name,
            username,
            email,
            password,
          },
        },
      });
      console.log('Registration successful:', data);
      navigation.navigate('Login'); 
    } catch (err) {
      console.error('Registration error:', err);
      Alert.alert('Registration failed', err.message);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://w7.pngwing.com/pngs/29/598/png-transparent-line-logo-social-media-messaging-apps-dynamic-color-lines-material-free-text-rectangle-logo.png' }}
        style={styles.logo}
      />
      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#a3a3a3"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#a3a3a3"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#a3a3a3"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#a3a3a3"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        placeholderTextColor="#a3a3a3"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <TouchableOpacity
        style={[styles.button, { backgroundColor: loading ? '#d1d1d1' : '#00C300' }]}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>{loading ? 'Registering...' : 'Sign Up'}</Text>
      </TouchableOpacity>
      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.footerLink}> Log In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#F6F6F6', 
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: '#dcdcdc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#ffffff',
  },
  button: {
    height: 50,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#888888',
    fontSize: 16,
  },
  footerLink: {
    color: '#00C300',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Register;
