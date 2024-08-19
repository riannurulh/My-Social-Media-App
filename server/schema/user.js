const { hashSync } = require("bcryptjs");
const User = require("../models/user");
const { db } = require("../config/mongodb");

const userTypeDefs = `#graphql
    type User {
        _id: String
        name: String
        username: String
        email: String
        password: String
    }

    type Query {
        users: [User]

        userById(id: Int!): User
    }

    input UserForm {
        name: String
        username: String!
        email: String!
        password: String!
    }

    type Mutation {
        AddUser(form: UserForm): User
    }
`;

const userResolver = {
  Query: {
    users: async () => {
      return await User.findAll();
    },
    userById: async (parent, args) => {
      return await User.findByPk(args.id);
    },
  },
  Mutation: {
    AddUser: async (parent, { form }) => {
      if (!form.username) {
        throw new Error("Username cannot be empty");
      }

      // const username  = form.username
      // const checkUsername =  await User.findOne({username:form.username})
      const checkUsername = await db
        .collection("User")
        .findOne({ username: form.username });

      console.log(checkUsername);

      if (checkUsername) {
        throw new Error("Username must be unique");
      }

      if (!form.email) {
        throw new Error("Email cannot be empty");
      }

      const email = form.email;
      const checkEmail = await db.collection("User").findOne({ email });

      if (checkEmail) {
        throw new Error("Email must be unique");
      }

      if (!form.password) {
        throw new Error("Password cannot be empty");
      }
      form.password = hashSync(form.password);
      const result = await User.create(form);
      return result;
    },
  },
};

module.exports = {
  userTypeDefs,
  userResolver,
};
