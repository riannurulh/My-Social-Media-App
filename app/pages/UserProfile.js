import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@apollo/client";
import { LOGIN_PROFILE } from "../query/users";

const UserProfile = () => {
  const { data, loading, error } = useQuery(LOGIN_PROFILE, {
    fetchPolicy: "network-only",
  });

  if (loading)
    return (
      <ActivityIndicator size="large" color="#00C300" style={styles.loader} />
    );
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;

  const { user, followers, followings } = data.userLoginProfile;

  return (
    <View style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileUsername}>@{user.username}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>
      <View style={styles.section}>
        <View style={styles.followerContainer}>
          <Text style={styles.sectionTitle}>Followers</Text>
          <Text>{followers.length}</Text>
        </View>
        {followers.length > 0 ? (
          <FlatList
            data={followers}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>{item.username}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noDataText}>No followers</Text>
        )}
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Followings</Text>
        {followings.length > 0 ? (
          <FlatList
            data={followings}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <View style={styles.listItem}>
                <Text style={styles.listItemText}>{item.username}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noDataText}>No followings</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  followerContainer:{
    flex: "row",
    justifyContent:"flex-start"
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 24,
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  profileUsername: {
    fontSize: 16,
    color: "#888",
    marginBottom: 8,
  },
  profileEmail: {
    fontSize: 14,
    color: "#555",
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  listItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  listItemText: {
    fontSize: 16,
    color: "#333",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    backgroundColor: "#FFFFFF",
  },
  noDataText: {
    textAlign: "center",
    color: "#888",
  },
});

export default UserProfile;
