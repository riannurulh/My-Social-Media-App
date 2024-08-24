import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LOGIN_PROFILE, SEARCH_USER } from "../query/users"; 
import { FOLLOW } from "../query/follow";

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  let [searchUsers, { called, loading, data, error }] = useLazyQuery(SEARCH_USER);
  let [followFn, { loading: loadingFollow, error: errorFollow }] = useMutation(FOLLOW, {
    refetchQueries: [SEARCH_USER, LOGIN_PROFILE],
  });

  const {
    data: dataLogin,
    loading: loadingLogin,
    error: errorLogin,
  } = useQuery(LOGIN_PROFILE);

  if (loadingLogin || loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  const handleSearch = () => {
    searchUsers({
      variables: { username: searchTerm },
    });
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search by username or email"
        value={searchTerm}
        onChangeText={setSearchTerm} 
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Search</Text>
      </TouchableOpacity>

      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      {error && <Text style={styles.errorText}>User not found</Text>}
      {called && data && data.userByUsername && (
        <FlatList
          data={data.userByUsername} 
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text style={styles.itemText}>Name: {item.name}</Text>
              <Text style={styles.itemText}>Username: {item.username}</Text>
              <Text style={styles.itemText}>Email: {item.email}</Text>
              {dataLogin.userLoginProfile.followings.some(
                (el) => el._id === item._id
              ) ? (
                <TouchableOpacity style={styles.followButtonDisabled} disabled={true}>
                  <Text style={styles.followButtonText}>Followed</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={styles.followButton}
                  onPress={async () => {
                    const result = await followFn({
                      variables: {
                        followingId: item._id,
                      },
                    });
                    console.log(result, "Follow successful");
                  }}
                >
                  <Text style={styles.followButtonText}>Follow</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FFFFFF", 
  },
  input: {
    height: 40,
    borderColor: "#e0e0e0",
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#F7F7F7", 
  },
  searchButton: {
    backgroundColor: "#00C300", 
    borderRadius: 5,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  item: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#F9F9F9", 
    borderColor: "#e0e0e0",
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  itemText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
  },
  followButton: {
    backgroundColor: "#00C300", 
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop: 10,
  },
  followButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  followButtonDisabled: {
    backgroundColor: "#D3D3D3", 
    borderRadius: 5,
    paddingVertical: 5,
    paddingHorizontal: 10,
    alignItems: "center",
    marginTop: 10,
  },
  loadingText: {
    textAlign: "center",
    fontSize: 16,
    color: "#333",
    marginTop: 20,
  },
  errorText: {
    textAlign: "center",
    fontSize: 16,
    color: "red",
    marginTop: 20,
  },
});

export default SearchUser;
