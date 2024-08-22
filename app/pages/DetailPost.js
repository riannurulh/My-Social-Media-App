
import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';

export default function DetailPost({ route }) {
  const { post } = route.params;
  const [likes, setLikes] = useState(post.likes);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const handleLike = () => {
    setLikes(likes + 1);
  };

  const handleComment = () => {
    setComments([...comments, comment]);
    setComment('');
  };

  return (
    <View style={{ padding: 15 }}>
      <Text>{post.user}</Text>
      <Text>{post.content}</Text>
      <Text>{likes} likes</Text>
      <Button title="Like" onPress={handleLike} />
      <View>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Write a comment..."
          style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 10 }}
        />
        <Button title="Comment" onPress={handleComment} />
      </View>
      <View>
        {comments.map((com, index) => (
          <Text key={index}>{com}</Text>
        ))}
      </View>
    </View>
  );
}
