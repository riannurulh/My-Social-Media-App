import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { LOGIN_PROFILE, SEARCH_USER } from "../query/users";
import { FOLLOW } from "../query/follow";

const SearchUser = () => {
  const [searchTerm, setSearchTerm] = useState("");
  let [searchUsers, { called, loading, data, error }] =
    useLazyQuery(SEARCH_USER);
  let [followFn, { loading: loadingFollow, error: errorFollow }] = useMutation(
    FOLLOW,
    {
      refetchQueries: [SEARCH_USER, LOGIN_PROFILE],
      update: (cache, { data: { follow } }) => {
        cache.modify({
          fields: {
            userLoginProfile(existingLoginProfile = {}) {
              return {
                ...existingLoginProfile,
                userLoginProfile: {
                  ...existingLoginProfile.userLoginProfile,
                  user: {
                    ...existingLoginProfile.userLoginProfile.user,
                    followings: [
                      ...existingLoginProfile.userLoginProfile.user.followings,
                      follow.followingId,
                    ],
                  },
                },
              };
            },
            userByUsername(existingSearchUser = {}) {
              return {
                ...existingSearchUser,
                userByUsername: existingSearchUser.userByUsername.map((user) => {
                  return user;
                }),
              };
            },
          }
        });
      },
    }
  );

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
              <Image
                source={{
                  uri: "https://randomuser.me/api/portraits/men/1.jpg",
                }}
                style={styles.profileImage}
              />
              <View style={styles.userInfo}>
                <Text style={styles.itemTextName} numberOfLines={1} ellipsizeMode="tail" >{item.name}</Text>
                <Text style={styles.itemText}>@{item.username}</Text>
                <Text style={styles.itemText}>{item.email}</Text>
              </View>
              <View style={styles.clicked}>
                {isFollowed = dataLogin.userLoginProfile.followings.some(
                  (el) => el._id === item._id
                )? true : false}
                {isFollowed ? (
                  <TouchableOpacity
                    style={styles.followButtonDisabled}
                    disabled={true}
                  >
                    <Text style={styles.followButtonText}>Followed</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.followButton}
                    onPress={async () => {
                      try {
                        await followFn({
                          variables: {
                            followingId: item._id,
                          },
                          optimisticResponse: {
                            follow: {
                              __typename: "Follow",
                              _id: Math.random().toString(),
                              followerId: dataLogin.userLoginProfile.user._id,
                              followingId: item._id,
                              createdAt: new Date().toISOString(),
                              updatedAt: new Date().toISOString(),
                            },
                          },
                          update: (cache, { data: { follow } }) => {
                            const existingLoginProfile = cache.readQuery({ query: LOGIN_PROFILE });

                            if (existingLoginProfile) {
                              const updatedFollowings = [
                                ...existingLoginProfile.userLoginProfile.followings,
                                {
                                  __typename: "User",
                                  _id: follow.followingId,
                                  name: item.name,
                                  username: item.username,
                                  email: item.email,
                                },
                              ];

                              cache.writeQuery({
                                query: LOGIN_PROFILE,
                                data: {
                                  userLoginProfile: {
                                    ...existingLoginProfile.userLoginProfile,
                                    followings: updatedFollowings,
                                  },
                                },
                              });
                            }
                          },
                        });
                      } catch (err) {
                        console.error("Follow error:", err);
                      }
                    }}
                  >
                    <Text style={styles.followButtonText}>Follow</Text>
                  </TouchableOpacity>
                )}
              </View>
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
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 40,
    marginBottom: 12,
    marginVertical:"auto"
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
    flexDirection: "row",
    justifyContent: "space-between",
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
    fontSize: 12,
    color: "#333",
    marginBottom: 5,
  },
  itemTextName: {
    fontSize: 16,
    color: "black",
    marginBottom: 5,
    fontWeight:"500"

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
//   profileImage:{
//     flex:1,
//   },
  userInfo:{
    flexGrow:2,
    marginLeft:5,
    // flexWrap:"wrap",
    // overflow:"hidden"
  },
//   clicked:{
//     flex:1,
//   },
});

export default SearchUser;
