import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Button,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "@apollo/client";
import { CREATE_POST, GET_POST } from "../query/posts";

export default function CreatePost() {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tags, setTags] = useState("");
  const [createPostFn, { loading, error }] = useMutation(CREATE_POST, {
    refetchQueries: [GET_POST],
  });
  const navigation = useNavigation();

  const handlePost = async () => {
    try {
      const result = await createPostFn({
        variables: {
          form: {
            content,
            imgUrl: imageUrl || null,
            tags: tags ? tags.split(",").map(tag => tag.trim()) : null,
          },
        },
      });
      console.log(result);
      navigation.goBack();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Ionicons name="close-outline" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.headerText}>Create Post</Text>
            <TouchableOpacity 
              style={[styles.button, { backgroundColor: loading ? '#d1d1d1' : '#00C300' }]}
              onPress={handlePost}
              disabled={loading}
            >
              <Text style={styles.buttonText}>{loading ? "Submitting..." : "Post"}</Text>
            </TouchableOpacity>
          </View>

          <TextInput
            style={styles.textInput}
            value={content}
            onChangeText={setContent}
            placeholder="What's new?"
            placeholderTextColor="#a3a3a3"
            multiline
          />
          <TextInput
            style={styles.textInput}
            value={imageUrl}
            onChangeText={setImageUrl}
            placeholder="Image URL (optional)"
            placeholderTextColor="#a3a3a3"
          />
          <TextInput
            style={styles.textInput}
            value={tags}
            onChangeText={setTags}
            placeholder="Tags (comma-separated)"
            placeholderTextColor="#a3a3a3"
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 10, 
  },
  scrollView: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    textAlign: "center",
    flex: 1,
  },
  textInput: {
    height: 50,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#000",
  },
  button: {
    height: 40,
    width: 80,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
