const { hashSync } = require("bcryptjs");
const { db } = require("../config/mongodb");
const Post = require("../models/post");
const redis = require("../config/redis");

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
        author: User
    }

    type Query {
        posts: [Post]

        postById(id: String!): Post
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
    posts: async (parent, args, contextValue) => {
      await contextValue.authentication();
      const cachePosts = await redis.get("posts:all");
      if (cachePosts) {
        return JSON.parse(cachePosts);
      }
      const pipeline = [];

      pipeline.push({
        $sort: {
          createdAt: 1,
        },
      });
      pipeline.push({
        $lookup: {
          from: "User",
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      });

      pipeline.push({
        $unwind: {
          path: "$author",
        },
      });
      // return await Post.findAll();
      let result = await db.collection("Posts").aggregate(pipeline).toArray();

      await redis.set("posts:all", JSON.stringify(result));
      return result;
    },
    postById: async (parent, args, contextValue) => {
      await contextValue.authentication();
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
      await redis.del("posts:all");
      return result;
    },
    addComment: async (parent, args, contextValue) => {
      let { postId, content } = args;

      let user = await contextValue.authentication();
      let checkPost = await Post.findByPk(postId);
      if (!checkPost) {
        throw new Error("Post not found");
      }

      let username = user.username;

      let post = await Post.addComment(postId, { content, username });
      await redis.del("posts:all");
      return post;
    },

    addLike: async (parent, args, contextValue) => {
      let { postId } = args;

      let usera = await contextValue.authentication();

      let username = usera.username;
      let checkPost = await Post.findByPk(postId);
      if (!checkPost) {
        throw new Error("Post not found");
      }

      const allowLike = checkPost.likes.find((el) => el.username === username);
      if (allowLike) {
        throw new Error("you are already liked this post");
      }
      let like = await Post.addLike(postId, { username });
      await redis.del("posts:all");
      return like;
    },
  },
};

module.exports = {
  postTypeDefs,
  postResolver,
};
