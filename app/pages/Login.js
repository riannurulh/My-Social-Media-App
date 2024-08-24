import React, { useContext, useState } from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Button,
} from "react-native";
import { AuthContext } from "../context/auth";
import { useMutation } from "@apollo/client";
import { LOGIN } from "../query/users";

export default function Login({ navigation }) {
  const { setIsSignedIn } = useContext(AuthContext);
  const [loginFn, { data, loading, error }] = useMutation(LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState("");

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://w7.pngwing.com/pngs/29/598/png-transparent-line-logo-social-media-messaging-apps-dynamic-color-lines-material-free-text-rectangle-logo.png",
        }}
        style={styles.logo}
      />
      {isError && <Text style={styles.errorText}>Error: {isError}</Text>}
      <TextInput
        style={styles.input}
        placeholder="Username"
        placeholderTextColor="#a3a3a3"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#a3a3a3"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonLoading]}
        onPress={async () => {
          try {
            const result = await loginFn({
              variables: { username, password },
            });
            
            await SecureStore.setItemAsync(
              "access_token",
              result.data.login.accessToken
            );
            
            setIsSignedIn(true);
          } catch (error) {
            setIsError(error.message);
          }
        }}
      >
        <Text style={styles.buttonText}>{loading ? "Logging in..." : "Login"}</Text>
      </TouchableOpacity>
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>New here?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Register")}>
          <Text style={styles.signupLink}> Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#F6F6F6",
  },
  logo: {
    width: 120,
    height: 120,
    alignSelf: "center",
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: "#dcdcdc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 20,
    marginBottom: 15,
    backgroundColor: "#ffffff",
  },
  button: {
    height: 50,
    backgroundColor: "#00C300", 
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonLoading: {
    backgroundColor: "#6dd400",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  errorText: {
    color: "red",
    marginBottom: 15,
    textAlign: "center",
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  signupText: {
    color: "#888888",
    fontSize: 16,
  },
  signupLink: {
    color: "#00C300", 
    fontSize: 16,
    fontWeight: "bold",
  },
});
