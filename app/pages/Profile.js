import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useQuery } from "@apollo/client";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { LOGIN_PROFILE, PROFILE } from "../query/users";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";

const initialLayout = { width: Dimensions.get("window").width };

const Followers = ({ followers }) => (
  <View style={styles.section}>
    <FlatList
      data={followers}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            style={styles.profileImageFoll}
          />
          <Text style={styles.listItemText}>{item.username}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.noDataText}>No followers</Text>}
    />
  </View>
);

const Followings = ({ followings }) => (
  <View style={styles.section}>
    <FlatList
      data={followings}
      keyExtractor={(item) => item._id}
      renderItem={({ item }) => (
        <View style={styles.listItem}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
            style={styles.profileImageFoll}
          />
          <Text style={styles.listItemText}>{item.username}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.noDataText}>No followings</Text>}
    />
  </View>
);

const Profile = ({ route }) => {
  const navigation = useNavigation();
  const { data, loading, error } = useQuery(
    PROFILE,
    { variables: { userId: route.params.id } },
    {
      fetchPolicy: "network-only",
    }
  );

  const {
    data: dataLogin,
    loading: loadingLogin,
    error: errorLogin,
  } = useQuery(LOGIN_PROFILE);

  const [index, setIndex] = useState(0);
  const [routes, setRoutes] = useState([
    { key: "followers", title: "Followers" },
    { key: "followings", title: "Followings" },
  ]);

  if (loading||loadingLogin)
    return (
      <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
    );
  if (error) return <Text style={styles.error}>Error: {error.message}</Text>;
  console.log(data, "ini");
  console.log(dataLogin.userLoginProfile.followings.some(
    (el) => el._id === data.profile.user._id
  ));
  

  const { user, followers, followings } = data.profile;
  console.log(user, "user");

  const updatedRoutes = [
    { key: "followers", title: `Followers (${followers.length})` },
    { key: "followings", title: `Followings (${followings.length})` },
  ];

  const renderScene = SceneMap({
    followers: () => <Followers followers={followers} />,
    followings: () => <Followings followings={followings} />,
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Search")}>
          <Ionicons name="close-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.profileHeader}>
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
              style={styles.profileImage}
            />
            <Text style={styles.profileName}>{user.name}</Text>
            <Text style={styles.profileUsername}>@{user.username}</Text>
          </View>
          <Text style={styles.profileEmail}>FOLLOW</Text>
        </View>
        <TabView
          navigationState={{ index, routes: updatedRoutes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={styles.indicator}
              style={styles.tabBar}
              labelStyle={styles.tabLabel}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems: "center",
    marginBottom: 24,
    paddingLeft:0,
    padding: 16,
    backgroundColor: "#FFFFFF",
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileImageFoll: {
    width: 35,
    height: 35,
    borderRadius: 40,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "500",
    color: "#333",
  },
  profileUsername: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: "#666",
    borderRadius:15,
    borderWidth:1,
    paddingVertical:7,
    padding:15
  },
  section: {
    flex: 1,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    borderRadius: 8,
    marginVertical: 4,
  },
  listItemText: {
    fontSize: 14,
    color: "#333",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#F4F4F4",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: 20,
    backgroundColor: "#F4F4F4",
  },
  noDataText: {
    textAlign: "center",
    color: "#888",
  },
  tabBar: {
    backgroundColor: "#FFFFFF",
    elevation: 0,
  },
  indicator: {
    backgroundColor: "#00C300",
  },
  tabLabel: {
    fontWeight: "500",
    color: "#333",
    // color:"red",
  },
});

export default Profile;
