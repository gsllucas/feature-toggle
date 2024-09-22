import express from 'express';
import cors from 'cors';
import http from 'http';

import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';

import typeDefs from './graphql/typedefs';
import resolvers from './graphql/resolvers';
import { redisClient } from './redis/client';

const parser = express.json();

const app = express();
const httpServer = http.createServer(app);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();
await redisClient.connect();

app.use(
  '/graphql',
  cors(),
  parser,
  expressMiddleware(server, {
    context: async ({ req }) => ({ Authorization: req.headers.authorization }),
  })
);

const PORT = process.env.PORT ?? 3001;
httpServer.listen(PORT, () =>
  console.log(`GraphQL Server listening on http://localhost:${PORT}/graphql`)
);
