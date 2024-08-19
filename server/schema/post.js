const { hashSync } = require("bcryptjs");
const { db } = require("../config/mongodb");
const Post = require("../models/post");

const postTypeDefs = `#graphql
    type Comments {
        content: String
        username: String
        # createdAt: date
        # updatedAt: date
    }

    type Likes {
        username: String
      #  createdAt: date
      #  updatedAt: date
    }

    type Post {
        _id: String
        content: String
        tags: [String]
        imgUrl: String
        authorId: String
        comments: [Comments]
        likes: [Likes]
      #  createdAt: date
      #  updatedAt: date
    }

    type Query {
        posts: [Post]

        postById(id: Int!): Post
    }

    input PostForm {
        content: String!
        tags: [String]
        imgUrl: String
        authorId: String!
      #  comments: [Comments]
      #  likes: [Likes]
      #  createdAt: date
      #  updatedAt: date
    }

    type Mutation {
        AddPost(form: PostForm): Post
        
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
    AddPost: async (parent, { form }) => {
      if (!form.content) {
        throw new Error("Content cannot be empty");
      }

      if (!form.authorId) {
        throw new Error("authorId cannot be empty");
      }

      const result = await Post.create(form);
      return result;
    },
  },
};

module.exports = {
  postTypeDefs,
  postResolver,
};
