const { hashSync } = require("bcryptjs");
const User = require("../models/user");
const { db } = require("../config/mongodb");
const { validate } = require("graphql");
const { comparePassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const { sign } = require("jsonwebtoken");

const userTypeDefs = `#graphql
    type User {
        _id: String
        name: String
        username: String
        email: String
    }


    type UserResponse {
        user: User
        followers: [User]
        followings: [User]
    }

    type Query {
        users: [User]
        userById(id: String!): User
        userByUsername(username: String): [User]
        profile(userId: String!): UserResponse
        userLoginProfile: UserResponse
    }


    input UserForm {
        name: String
        username: String!
        email: String!
        password: String!
    }

    type LoginResponse {
        accessToken: String
        _id: String
        email: String
    }

    type Mutation {
        register(form: UserForm): User
        #pass belom diapus pas regis
        login(username: String!, password: String!): LoginResponse
    }
`;

const userResolver = {
  Query: {
    users: async () => {
      return await User.findAll();
    },
    userById: async (parent, args, contextValue) => {
      return await User.findByPk(args.id);
    },
    userLoginProfile: async (parent, args, contextValue) => {
      const user = await contextValue.authentication();
      if (!user) {
        throw new Error("User not found");
      }

      const getFollowersAndFollowings = async () => {
        const followers = await db
          .collection("Follow")
          .aggregate([
            { $match: { followingId: user._id } },
            {
              $lookup: {
                from: "User",
                localField: "followerId",
                foreignField: "_id",
                as: "follower",
              },
            },
            { $unwind: "$follower" },
          ])
          .toArray();

        const followings = await db
          .collection("Follow")
          .aggregate([
            { $match: { followerId: user._id } },
            {
              $lookup: {
                from: "User",
                localField: "followingId",
                foreignField: "_id",
                as: "following",
              },
            },
            { $unwind: "$following" },
          ])
          .toArray();

        return {
          followers: followers.map((doc) => doc.follower),
          followings: followings.map((doc) => doc.following),
        };
      };

      const { followers, followings } = await getFollowersAndFollowings();

      return {
        user,
        followers,
        followings,
      };
    },
    profile: async (parent, { userId }) => {
      const user = await User.findByPk(userId);
      if (!user) {
        throw new Error("not found");
      }
      let followers = [];
      let followings = [];

      let follower = await db
        .collection("follow")
        .aggregate([
          {
            $match: {
              followingId: user._id,
            },
          },

          {
            $lookup: {
              from: "user",
              localField: "followerId",
              foreignField: "_id",
              as: "follower",
            },
          },

          {
            $unwind: {
              path: "$follower",
            },
          },
        ])
        .toArray();

      let following = await db
        .collection("follow")
        .aggregate([
          {
            $match: {
              followerId: user._id,
            },
          },

          {
            $lookup: {
              from: "user",
              localField: "followingId",
              foreignField: "_id",
              as: "following",
            },
          },

          {
            $unwind: {
              path: "$following",
            },
          },
        ])
        .toArray();

      follower.map((el) => {
        return followers.push(el.follower);
      });
      console.log(follower);

      console.log(following);
      following.map((el) => {
        return followings.push(el.following);
      });

      return {
        user,
        followers,
        followings,
      };
    },
    userByUsername: async (parent, args, contextValue) => {
      await contextValue.authentication();
      const { username } = args;
      console.log(username, "awikawik");

      const pipeline = [];

      pipeline.push({
        $match: {
          $or: [
            {
              username: {
                $regex: username,
                $options: "i",
              },
            },
            {
              email: {
                $regex: username,
                $options: "i",
              },
            },
          ],
        },
      });
      const result = await db.collection("User").aggregate(pipeline).toArray();

      delete result[0].password;
      console.log(result,'iki');

      return result;
    },
  },
  Mutation: {
    register: async (parent, { form }) => {
      if (!form.username) {
        throw new Error("Username cannot be empty");
      }

      const checkUsername = await db
        .collection("User")
        .findOne({ username: form.username });

      if (checkUsername) {
        throw new Error("Username must be unique");
      }

      if (!form.email) {
        throw new Error("Email cannot be empty");
      }

      const validateEmail = (email) => {
        return email.match(
          /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
      };

      if (!validateEmail(form.email)) {
        throw new Error("Invalid email format");
      }

      const email = form.email;
      const checkEmail = await db.collection("User").findOne({ email });

      if (checkEmail) {
        throw new Error("Email must be unique");
      }

      if (!form.password) {
        throw new Error("Password cannot be empty");
      }

      if (form.password.length < 5) {
        throw new Error("Password length min 5");
      }
      form.password = hashSync(form.password);
      const result = await User.create(form);

      delete result.password;

      return result;
    },
    login: async (parent, args) => {
      const { username, password } = args;
      if (!username) {
        throw new Error("Username is required");
      }
      if (!password) {
        throw new Error("Password is required");
      }

      const checkUsername = await db.collection("User").findOne({ username });

      if (!checkUsername) {
        throw new Error("Username / password invalid");
      }

      const checkPassword = comparePassword(password, checkUsername.password);

      if (!checkPassword) {
        throw new Error("Username / password invalid");
      }

      const accessToken = signToken({ _id: checkUsername._id });

      return {
        _id: checkUsername.id,
        email: checkUsername.username,
        accessToken: accessToken,
      };
    },
  },
};

module.exports = {
  userTypeDefs,
  userResolver,
};
