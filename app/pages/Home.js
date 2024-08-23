// screens/HomeScreen.js
import React from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Pressable,
  Button,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Ionicons, EvilIcons } from "@expo/vector-icons";
import { GET_POST, LIKE_POST } from "../query/posts";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen({ navigation }) {
  const { data, loading, error } = useQuery(GET_POST);
  console.log(data, loading, error, "home");
  let [likePostFn, { loadingLike, errorLike }] = useMutation(LIKE_POST, {
    refetchQueries: [GET_POST],
  });
  // async function handleLike(value) {
  //   console.log("masukkkkkk");

  //   let [likePostFn, { loading, error }] = useMutation(LIKE_POST, {
  //     refetchQueries: [GET_POST],
  //   });
  //   const result = await likePostFn({
  //     variables: {
  //       postId: value,
  //     },
  //   });
  //   console.log(result, "tatat");
  //   return;
  // }
  // if (error) {
  //   console.log(error,'mampir');

  //   // await SecureStore.deleteItemAsync("access_token");
  //   // navigation.navigate("Login");
  //   return
  // }
  if (loading) {
    return <Text>Loading...</Text>;
  }
  
  if (loadingLike) {
    return <Text>Loading...</Text>;
  }
  

  return (
    <SafeAreaView>
      <View style={styles.voom}>
        <Text style={styles.headerVoom}>LINE VOOM</Text>
        <Pressable onPress={() => navigation.navigate("CreatePost")}>
          <Text style={styles.headerText}>+</Text>
        </Pressable>
      </View>
      <FlatList
        data={data.posts}
        keyExtractor={(item) => item._id}
        renderItem={(props) => {
          return (
            <Pressable
              onPress={() => navigation.navigate("Post", { post: props.item })}
            >
              <View key={props.item._id} style={styles.postContainer}>
                <View style={styles.header}>
                  <Image
                    source={{ uri: props.item.imgUrl }}
                    style={styles.avatar}
                  />
                  <Text style={styles.postUser}>{props.item.author.name}</Text>
                </View>
                <Text style={styles.postContent}>{props.item.content}</Text>
                <View style={styles.footer}>
                  <TouchableOpacity
                    style={styles.postLikes}
                    onPress={async () => {
                      // handleLike(props.item._id)
                      console.log("masukkkkkk");

                      const result = await likePostFn({
                        variables: {
                          postId: props.item._id,
                        },
                      });
                      console.log(result, "tatat");
                      return;
                    }}
                  >
                    {/* <Icon name="thumb-up" size={15} color="gray" /> */}
                    <Ionicons name="happy-outline" size={24} color="black" />
                  </TouchableOpacity>
                  <Text>{props.item.likes.length}</Text>
                  <TouchableOpacity
                    style={styles.postLikes}
                    // onPress={() => navigation.navigate("Post", { post: item })}
                  >
                    <Ionicons
                      name="chatbubble-outline"
                      size={24}
                      color="black"
                    />
                  </TouchableOpacity>
                  <Text>{props.item.comments.length}</Text>
                </View>
                <Text style={styles.timestamp}>{props.item.createdAt}</Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerVoom: {
    fontSize: 30,
    fontWeight: "500",
  },
  headerText: {
    fontSize: 30,
  },
  voom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
    paddingRight: 15,
    margin: 10,
  },
  container: {
    flex: 1,
    // backgroundColor: "#f5f5f5",
    backgroundColor: "fff",
  },
  newPostContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  postButton: {
    backgroundColor: "#007bff",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  postButtonText: {
    color: "#fff",
  },
  previewImage: {
    width: "100%",
    height: 200,
    marginTop: 10,
    borderRadius: 5,
  },
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 1 },
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
  },
  postUser: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
  postContent: {
    marginTop: 10,
    fontSize: 14,
    color: "#333",
  },
  postImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  postLikes: {
    color: "gray",
    marginLeft: 10,
  },
  timestamp: {
    marginTop: 5,
    color: "gray",
    fontSize: 12,
  },
});
