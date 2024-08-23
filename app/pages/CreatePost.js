import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Pressable,
  Button,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@apollo/client";
import { CREATE_POST, GET_POST } from "../query/posts";

export default function CreatePost({ navigate }) {
  let [content, setContent] = useState("");
  let [createPostFn, { loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: [GET_POST],
  });
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()}>
          <Ionicons name="close-outline" size={24} color="black" />
        </Pressable>
        <View style={styles.headerCenter}></View>
        {/* <TouchableOpacity> */}
        <Button
          style={styles.postButton}
          title={loading ? "Submitting..." : "Post"}
          onPress={async () => {
            console.log(content, "contet");
            const result = await createPostFn({
              variables: {
                form: { content: content, imgUrl: null, tags: null },
              },
            });
            console.log(result);

            navigation.goBack();
          }}
        />
        {/* </TouchableOpacity> */}
      </View>

      {/* Input Field */}
      <TextInput
        style={styles.textInput}
        value={content}
        onChangeText={setContent}
        placeholder="What's new?"
        placeholderTextColor="#aaa"
        multiline
      />

      {/* Footer Icons */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Ionicons name="image-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="happy-outline" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity>
          <Ionicons name="location-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  postButton: {
    fontSize: 16,
    color: "gray",
  },
  textInput: {
    flex: 1,
    marginTop: 20,
    fontSize: 18,
    color: "#000",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
  },
});
