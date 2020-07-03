import "@babel/polyfill/noConflict";
import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import prisma from "./prisma";
import { resolvers, fragmentReplacements } from "./resolvers";

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  fragmentReplacements,
  resolvers,
  context(request) {
    return {
      db,
      prisma,
      pubsub,
      request,
    };
  },
});

server.start({ port: process.env.PORT || 4000 }, () => {
  console.log("the server is up!");
});
