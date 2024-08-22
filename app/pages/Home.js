
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

const posts = [
  { id: '1', user: 'User1', content: 'This is a sample post', likes: 10 },
  { id: '2', user: 'User2', content: 'Another interesting post!', likes: 20 },
];

export default function Home({ navigation }) {
  return (
    <View>
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Post', { post: item })}>
            <View style={{ padding: 15, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
              <Text>{item.user}</Text>
              <Text>{item.content}</Text>
              <Text>{item.likes} likes</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
