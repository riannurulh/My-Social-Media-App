const { hashSync } = require("bcryptjs");
const { db } = require("../config/mongodb");
const { ObjectId } = require("mongodb");
const Post = require("../models/post");
const Follow = require("../models/follow");

const followTypeDefs = `#graphql
    type Follow {
        _id: String
        followingId: String
        followerId: String
        createdAt: String
        updatedAt: String
    }

    type Query {
        followerList: [Follow]
    }

    type Mutation {
        follow(followingId: String!): Follow
    }
`;

const followResolver = {
  Query: {
    followerList: async (parent, args, contextValue) => {
      return await Follow.findAll();
    },
  },
  Mutation: {
    follow: async (parent, args, contextValue) => {
      let { followingId } = args;

      let user = await contextValue.authentication();

      let followerId = user._id;

      let checkFollow = await Follow.findAll();
      console.log(checkFollow, "wkwkwkkwk");
      checkFollow = checkFollow.find(
        (el) =>
          el.followingId === followingId &&
          el.followerId === followerId
      );

      if (checkFollow) {
        throw new Error("udah ada");
      }

      let follow = await Follow.create({ followerId, followingId });

      return follow;
    },
  },
};

module.exports = {
  followTypeDefs,
  followResolver,
};
