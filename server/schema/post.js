const { hashSync } = require("bcryptjs");
const { db } = require("../config/mongodb");
const Post = require("../models/post");

const postTypeDefs = `#graphql
    type Comments {
        content: String
        username: String
        createdAt: String
        updatedAt: String
    }

    type Likes {
        username: String
        createdAt: String
        updatedAt: String
    }

    type Post {
        _id: String
        content: String
        tags: [String]
        imgUrl: String
        authorId: String
        comments: [Comments]
        likes: [Likes]
        createdAt: String
        updatedAt: String
    }

    type Query {
        posts: [Post]

        postById(id: Int!): Post
    }

    input PostForm {
        content: String!
        tags: [String]
        imgUrl: String
      #  comments: [Comments]
      #  likes: [Likes]
      #  createdAt: String
      #  updatedAt: String
    }

    type Mutation {
        AddPost(form: PostForm): Post
        addComment(postId: String!, content: String!): Comments
        addLike(postId: String!): Likes
    }
`;

const postResolver = {
  Query: {
    posts: async () => {
      return await Post.findAll();
    },
    postById: async (parent, args) => {
      return await Post.findByPk(args.id);
    },
  },
  Mutation: {
    AddPost: async (parent, { form }, contextValue) => {
      const user = await contextValue.authentication();

      if (!form.content) {
        throw new Error("Content cannot be empty");
      }

      form.authorId = user._id;

      const result = await Post.create(form);
      return result;
    },
    addComment: async (parent, args, contextValue) => {
      let { postId, content } = args;

      let user = await contextValue.authentication();

      let username = user.username;

      let post = await Post.addComment(postId, { content, username });

      return post;
    },

    addLike: async (parent, args, contextValue) => {
      let { postId } = args;

      let usera = await contextValue.authentication();

      let username = usera.username;
      
      let like = await Post.addLike(postId, { username });

      return like;
    },
  },
};

module.exports = {
  postTypeDefs,
  postResolver,
};
