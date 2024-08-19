const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { userTypeDefs, userResolver } = require("./schema/user");
const { postTypeDefs, postResolver } = require("./schema/post");

const server = new ApolloServer({
  typeDefs: [userTypeDefs,postTypeDefs],
  resolvers: [userResolver,postResolver]
})

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`🚀  Server ready at: ${url}`);
});
