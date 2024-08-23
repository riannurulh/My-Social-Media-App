import * as SecureStore from "expo-secure-store";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable } from "react-native";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/auth";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./pages/Login";
import HomeScreen from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import DetailPost from "./pages/DetailPost";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
// function MainTab() {
//     const {setIsSignedIn} = useContext(AuthContext)
//     return(
//         <Tab.Navigator
//         screenOptions={{
//             headerRight:()=>{
//                 return (
//                     <Pressable
//                     onPress={async()=>{
//                         await SecureStore.deleteItemAsync("access_token")
//                         setIsSignedIn(false)
//                     }}
//                     style={{backgroundColor:'red',padding:12}}>
//                         <Text style={{color: 'white'}}>Logout</Text>
//                     </Pressable>
//                 )
//             }
//         }}>

//         </Tab.Navigator>
//     )
// }

export default function Navigation() {
  const { setIsSignedIn } = useContext(AuthContext);
  const { isSignedIn } = useContext(AuthContext);

  useEffect(() => {
    console.log(SecureStore.getItem("access_token"),'navcheck');
    
    
    SecureStore.getItemAsync("access_token").then((r) => {
      console.log(r, "<<<token");
      if (r) {
        setIsSignedIn(true);
      }
    });
  }, []);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <>
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
          </>
        ) : (
          <Stack.Screen name="Login" component={Login} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
