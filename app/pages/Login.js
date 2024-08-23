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

export default function Login({ navigation, route }) {
  console.log(route.params);

  const { setIsSignedIn } = useContext(AuthContext);
  const [loginFn, { data, loading, error }] = useMutation(LOGIN);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
//   const [isError, setIsError] = useState("");
// if (route.params) {
//   setIsError(route.params.error)
// }
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: "https://w7.pngwing.com/pngs/29/598/png-transparent-line-logo-social-media-messaging-apps-dynamic-color-lines-material-free-text-rectangle-logo.png",
        }}
        style={styles.logo}
      />
      {/* {isError&&(<Text>{route.params.error}</Text>)} */}
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
      <Button
        style={styles.button}
        title={loading ? "Login..." : "Login"}
        onPress={async () => {
          try {
            console.log({ password, username });
            const result = await loginFn({
              variables: {
                username,
                password,
              },
            });
            console.log(result,"<<<<");
            
            await SecureStore.setItemAsync(
              "access_token",
              result.data.login.accessToken
            );
            console.log(SecureStore.getItem("access_token"),'<<<<');
            
            setIsSignedIn(true);
          } catch (error) {
            console.log(error, "tai");
            // navigation.navigate("Login", { error });
          }
        }}
      />
      {/* <Text style={styles.buttonText}>Log In</Text> */}
      {/* </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "#FFFFFF",
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 40,
  },
  input: {
    height: 50,
    borderColor: "#e5e5e5",
    borderWidth: 1,
    // borderRadius: 25,
    paddingHorizontal: 20,
    marginBottom: 10,
    backgroundColor: "#f7f7f7",
  },
  button: {
    height: 50,
    backgroundColor: "#00C300",
    // borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
});
