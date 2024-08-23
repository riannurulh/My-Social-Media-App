import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { View, Text, Button, TextInput, StyleSheet, Image, SafeAreaView } from "react-native";
import { GET_DETAIL_POST } from "../query/posts";

export default function DetailPost({ route }) {
  // const { data, loading, error } = useQuery(GET_DETAIL_POST, {
  //   variables: { postByIdId: route.params.post }
  // });
  console.log(route.params, "ini di deat");
  // console.log(data, loading, error, "ini di deat");

  //   const [likes, setLikes] = useState(route.params.post);
    const [comment, setComment] = useState('');
    let [commentPostFn, { loadingLike, errorLike }] = useMutation(LIKE_POST, {
      refetchQueries: [GET_POST],
    });
  //   const [comments, setComments] = useState([]);

  // const handleLike = () => {
  //   setLikes(likes + 1);
  // };

  // const handleComment = () => {
  //   if (comment.length === 0) return;

  //   setComments([...comments, comment]);
  //   setComment("");
  // };
  // if (loading) {
  //   return <Text>Loading...</Text>;
  // }
  return(
  <View style={{flex:1}}>
    <View style={styles.postContainer}>
      <Text style={styles.postUser}>{route.params.post.author.name}</Text>
      <Text style={styles.postContent}>{route.params.post.content}</Text>
      {route.params.post.image && (
        <Image source={{ uri: route.params.post.image }} style={styles.postImage} />
      )}
      <Text style={styles.postLikes}>{route.params.post.likes.length} likes</Text>
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
      <Button title="Comment" 
      // onPress={handleComment} 
      />
      {route.params.post.comments.length > 0 && (
        <View style={styles.commentList}>
          {route.params.post.comments.map((com, index) => (
            <Text key={index} style={styles.comment}>
              {com}
            </Text>
          ))}
        </View>
      )}
    </View>
  </View>)
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
});
