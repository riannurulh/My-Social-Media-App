import React from "react";
import * as SecureStore from "expo-secure-store";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { gql, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { GET_POST, LIKE_POST } from "../query/posts";
import { LOGIN_PROFILE } from "../query/users";

export default function HomeScreen({ navigation }) {
  const { data, loading, error } = useQuery(GET_POST);
  const [likePostFn, { loading: loadingLike, error: errorLike }] = useMutation(
    LIKE_POST,
    {
      refetchQueries: [GET_POST],
    }
  );

  const {
    data: dataLogin,
    loading: loadingLogin,
    error: errorLogin,
  } = useQuery(LOGIN_PROFILE);

  if (loading || loadingLogin) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  if (error || errorLike || errorLogin) {
    return (
      <Text style={styles.errorText}>
        An error occurred. Please try again later.
      </Text>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>LINE VOOM</Text>
        <Pressable
          style={styles.createPostButton}
          onPress={() => navigation.navigate("CreatePost")}
        >
          <Text style={styles.createPostText}>+</Text>
        </Pressable>
      </View>
      <FlatList
        data={data.posts}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => {
          const isLiked = item.likes.some(
            (el) => el.username === dataLogin.userLoginProfile.user.username
          );

          return (
            <Pressable
              onPress={() => navigation.navigate("Post", { post: item })}
            >
              <View style={styles.postContainer}>
                <View style={styles.postHeader}>
                  <Image
                    source={{
                      uri: "https://randomuser.me/api/portraits/men/1.jpg",
                    }}
                    style={styles.avatar}
                  />
                  <Text style={styles.username}>{item.author.name}</Text>
                </View>
                <Text style={styles.postContent}>{item.content}</Text>
                {item.imgUrl && (
                  <Image
                    source={{ uri: item.imgUrl }}
                    style={styles.postImage}
                  />
                )}
                <View style={styles.postFooter}>
                  {isLiked ? (
                    <TouchableOpacity style={styles.likeButton} disabled={true}>
                      <Ionicons name="happy" size={24} color="#00C300" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.likeButton}
                      onPress={async () => {
                        try {
                          await likePostFn({ variables: { postId: item._id } });
                        } catch (error) {
                          console.error("Failed to like post", error);
                        }
                      }}
                    >
                      <Ionicons
                        name="happy-outline"
                        size={24}
                        color="gray"
                      />
                    </TouchableOpacity>
                  )}

                  <Text style={styles.likeCount}>{item.likes.length}</Text>
                  <TouchableOpacity style={styles.commentButton} disabled>
                    <Ionicons
                      name="chatbubble-ellipses-outline"
                      size={24}
                      color="gray"
                    />
                  </TouchableOpacity>
                  <Text style={styles.commentCount}>
                    {item.comments.length}
                  </Text>
                </View>
                <Text style={styles.timestamp}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    // backgroundColor: "red",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 5,
    padding: 15,
    backgroundColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  createPostButton: {
    width: 40,
    height: 40,
    backgroundColor: "#00C300",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  createPostText: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
  },
  postContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  postContent: {
    fontSize: 14,
    color: "#333",
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  likeCount: {
    fontSize: 14,
    color: "#333",
    marginRight: 15,
  },
  commentButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
  },
  commentCount: {
    fontSize: 14,
    color: "#333",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  loadingText: {
    fontSize: 18,
    textAlign: "center",
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
