// import * as SecureStore from "expo-secure-store";

// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import { createNativeStackNavigator } from "@react-navigation/native-stack";
// import { Pressable } from "react-native";
// import { useContext, useEffect } from "react";
// import { AuthContext } from "./context/auth";
// import { NavigationContainer } from "@react-navigation/native";
// import Login from "./pages/Login";
// import HomeScreen from "./pages/Home";
// import CreatePost from "./pages/CreatePost";
// import DetailPost from "./pages/DetailPost";
// import Register from "./pages/Register";

// const Stack = createNativeStackNavigator();
// const Tab = createBottomTabNavigator();
// // function MainTab() {
// //     const {setIsSignedIn} = useContext(AuthContext)
// //     return(
// //         <Tab.Navigator
// //         screenOptions={{
// //             headerRight:()=>{
// //                 return (
// //                     <Pressable
// //                     onPress={async()=>{
// //                         await SecureStore.deleteItemAsync("access_token")
// //                         setIsSignedIn(false)
// //                     }}
// //                     style={{backgroundColor:'red',padding:12}}>
// //                         <Text style={{color: 'white'}}>Logout</Text>
// //                     </Pressable>
// //                 )
// //             }
// //         }}>

// //         </Tab.Navigator>
// //     )
// // }

// export default function Navigation() {
//   const { setIsSignedIn } = useContext(AuthContext);
//   const { isSignedIn } = useContext(AuthContext);

//   useEffect(() => {
//     console.log(SecureStore.getItem("access_token"), "navcheck");

//     SecureStore.getItemAsync("access_token").then((r) => {
//       console.log(r, "<<<token");
//       if (r) {
//         setIsSignedIn(true);
//       }
//     });
//   }, []);
//   return (
//     <NavigationContainer>
//       <Stack.Navigator>
//         {isSignedIn ? (
//           <>
//             <Stack.Screen
//               name="Home"
//               component={HomeScreen}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen
//               name="CreatePost"
//               component={CreatePost}
//               options={{ headerShown: false }}
//             />
//             <Stack.Screen name="Post" component={DetailPost} />
//           </>
//         ) : (
//           <> 
//             <Stack.Screen name="Login" component={Login} />
//             <Stack.Screen name="Register" component={Register} />
//           </>
//         )}
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }


import * as SecureStore from "expo-secure-store";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Pressable, Text } from "react-native";
import { useContext, useEffect } from "react";
import { AuthContext } from "./context/auth";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./pages/Login";
import HomeScreen from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import DetailPost from "./pages/DetailPost";
import Register from "./pages/Register";
import SearchUser from "./pages/SearchUser";  // Create this page
import UserProfile from "./pages/UserProfile"; // Create this page
import { Ionicons, EvilIcons } from "@expo/vector-icons";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="CreatePost" component={CreatePost} options={{ headerShown: false }} />
      <Stack.Screen name="Post" component={DetailPost} />
    </Stack.Navigator>
  );
}

function MainTab() {
  const { setIsSignedIn } = useContext(AuthContext);

  return (
    <Tab.Navigator>
      <Tab.Screen name="HomeStack" component={HomeStack}  options={{headerShown:false, tabBarIcon:({color,size})=>(<Ionicons name="home-outline" size={24} color="black" />)}}/>
      <Tab.Screen name="SearchUser" component={SearchUser} options={{tabBarIcon:({color,size})=>(<Ionicons name="search-outline" size={24} color="black" />)}}/>
      <Tab.Screen name="UserProfile" component={UserProfile} options={{
        tabBarIcon:({color,size})=>(<Ionicons name="person-outline" size={24} color="black" />),
        headerRight: () => (
          <Pressable
            onPress={async () => {
              await SecureStore.deleteItemAsync("access_token");
              setIsSignedIn(false);
            }}
            style={{ backgroundColor: 'red', padding: 12 }}
          >
            <Text style={{ color: 'white' }}>Logout</Text>
          </Pressable>
        )
      }}/>
    </Tab.Navigator>
  );
}

export default function Navigation() {
  const { setIsSignedIn } = useContext(AuthContext);
  const { isSignedIn } = useContext(AuthContext);

  useEffect(() => {
    SecureStore.getItemAsync("access_token").then((r) => {
      if (r) {
        setIsSignedIn(true);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isSignedIn ? (
          <Stack.Screen name="Main" component={MainTab} options={{ headerShown: false }} />
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} options={{headerShown:false}} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
