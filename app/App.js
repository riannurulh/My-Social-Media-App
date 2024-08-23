import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import HomeScreen from "./pages/Home";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apollo";
import DetailPost from "./pages/DetailPost";
import CreatePost from "./pages/CreatePost";
import AuthProvider from "./context/auth";
import Navigation from "./navigation";
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <ApolloProvider client={client}>
        {/* <NavigationContainer> */}
          {/* <Stack.Navigator>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CreatePost"
              component={CreatePost}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Post" component={DetailPost} />
          </Stack.Navigator> */}
          <Navigation/>
        {/* </NavigationContainer> */}
      </ApolloProvider>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
