import { useMutation, useQuery } from "@apollo/client";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Image,
  SafeAreaView,
} from "react-native";
import {
  CREATE_COMMENT,
  GET_DETAIL_POST,
  GET_POST,
  LIKE_POST,
} from "../query/posts";
import { useNavigation } from "@react-navigation/native";

export default function DetailPost({ route, navigate }) {
  // const { data, loading, error } = useQuery(GET_DETAIL_POST, {
  //   variables: { postByIdId: route.params.post }
  // });
  const navigation = useNavigation();
  console.log(route.params, "ini di deat");
  // console.log(data, loading, error, "ini di deat");

  //   const [likes, setLikes] = useState(route.params.post);
  const [comment, setComment] = useState("");
  let [commentPostFn, { loadingComment, errorComment }] = useMutation(
    CREATE_COMMENT,
    {
      refetchQueries: [GET_POST],
    }
  );
  const [comments, setComments] = useState(route.params.post.comments);
  console.log(comments, "cekisi");

  // const handleLike = () => {
  //   setLikes(likes + 1);
  // };

  // const handleComment = () => {
  //   if (comment.length === 0) return;

  //   setComments([...comments, comment]);
  //   setComment("");
  // };
  if (loadingComment) {
    return <Text>Loading...</Text>;
  }
  useEffect(()=>{
    console.log(comments);
    
  },[setComments])
  return (
    <View style={{ flex: 1 }}>
      <View style={styles.postContainer}>
        <Text style={styles.postUser}>{route.params.post.author.name}</Text>
        <Text style={styles.postContent}>{route.params.post.content}</Text>
        {route.params.post.image && (
          <Image
            source={{ uri: route.params.post.image }}
            style={styles.postImage}
          />
        )}
        <Text style={styles.postLikes}>
          {route.params.post.likes.length} likes
        </Text>
        {/* <Button title="Like" 
      // onPress={handleLike} 
      /> */}
      </View>
      <View style={styles.commentsContainer}>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Write a comment..."
          style={styles.input}
        />
        <Button
          title={loadingComment ? "Submitting..." : "Post"}
          // onPress={handleComment}
          
        />
        {comments.length > 0 && (
          <View style={styles.commentList}>
            {comments.map((com) => (
              <View style={styles.commentsContainer}>
                <View style={styles.header}>
                  <Image source={{ uri: com.imgUrl }} style={styles.avatar} />
                  <Text style={styles.postUser}>{com.username}</Text>
                </View>
                <Text style={styles.comment}>{com.content}</Text>
                <Text style={styles.timestamp}>{com.createdAt}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: "#f5f5f5",
  },
  postContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
  },
  postUser: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  postContent: {
    marginBottom: 10,
  },
  postImage: {
    width: "100%",
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  postLikes: {
    color: "gray",
    marginBottom: 10,
  },
  commentsContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  commentList: {
    marginTop: 15,
  },
  comment: {
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    paddingVertical: 10,
  },
  timestamp: {
    marginTop: 5,
    color: "gray",
    fontSize: 12,
  },
  avatar: {
    width: 25,
    height: 25,
    borderRadius: 20,
  },
});
