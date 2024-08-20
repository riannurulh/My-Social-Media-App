const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { userTypeDefs, userResolver } = require("./schema/user");
const { postTypeDefs, postResolver } = require("./schema/post");
const { verifyToken } = require("./helpers/jwt");
const User = require("./models/user");
const { followTypeDefs, followResolver } = require("./schema/follow");

const server = new ApolloServer({
  typeDefs: [userTypeDefs, postTypeDefs, followTypeDefs],
  resolvers: [userResolver, postResolver, followResolver],
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: ({ req }) => {
    async function authentication() {
      const authorization = req.headers.authorization || "";
      console.log(authorization);

      if (!authorization) {
        throw new Error("Invalid tokena");
      }
      const [bearer, token] = authorization.split(" ");
      if (bearer !== "Bearer") {
        throw new Error("Invalid tokenb");
      }
      const payload = verifyToken(token);

      console.log(payload);
      const user = await User.findByPk(payload._id);

      return user;
    }
    return { authentication };
  },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
