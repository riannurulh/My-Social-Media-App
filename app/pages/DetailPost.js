import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { CREATE_COMMENT, GET_POST } from "../query/posts";
import { useNavigation } from "@react-navigation/native";

export default function DetailPost({ route }) {
  const navigation = useNavigation();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState(route.params.post.comments);
  const [commentPostFn, { loading: loadingComment }] = useMutation(
    CREATE_COMMENT,
    {
      refetchQueries: [GET_POST],
    }
  );

  const handlePostComment = async () => {
    if (comment.trim() === "") return;

    try {
      const result = await commentPostFn({
        variables: {
          postId: route.params.post._id,
          content: comment,
        },
      });

      setComments([...comments, result.data.addComment]);
      setComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
    }
  };

  const renderComment = ({ item }) => (
    <View style={styles.commentContainer}>
      <View style={styles.commentHeader}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
          style={styles.avatar}
        />
        <Text style={styles.commentUser}>{item.username}</Text>
      </View>
      <Text style={styles.commentContent}>{item.content}</Text>
      <Text style={styles.commentTimestamp}>{item.createdAt}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.postContainer}>
        <View style={styles.header}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            style={styles.avatar}
          />
          <Text style={styles.postUser}>{route.params.post.author.name}</Text>
        </View>
        {/* <Text style={styles.postUser}>{route.params.post.author.name}</Text> */}
        <Text style={styles.postContent}>{route.params.post.content}</Text>
        {route.params.post.imgUrl && (
          <Image
            source={{ uri: route.params.post.imgUrl }}
            style={styles.postImage}
          />
        )}
        <Text style={styles.postLikes}>
          {route.params.post.likes.length} likes
        </Text>
      </View>

      <View style={styles.commentsSection}>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Write a comment..."
          style={styles.input}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: loadingComment ? "#d1d1d1" : "#00C300" },
          ]}
          onPress={handlePostComment}
          disabled={loadingComment}
        >
          <Text style={styles.buttonText}>
            {loadingComment ? "Submitting..." : "Post"}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={comments}
          renderItem={renderComment}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.commentList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  postContainer: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    margin: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  postUser: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5,
  },
  postContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  postLikes: {
    color: "#888",
    fontSize: 14,
  },
  commentsSection: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    fontSize: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    height: 45,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  commentList: {
    marginTop: 15,
  },
  commentContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingBottom: 10,
  },
  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  commentUser: {
    fontWeight: "bold",
    fontSize: 14,
  },
  commentContent: {
    fontSize: 14,
  },
  commentTimestamp: {
    marginTop: 5,
    color: "#888",
    fontSize: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    elevation: 4, 
  },
});
