import { ApolloServer } from "apollo-server-express";
import express from "express";
import { buildSchema } from "type-graphql";
import { getConnectionOptions, createConnection } from "typeorm";
import { UploadResolver } from "./resolvers/UploadResolver";
import { graphqlUploadExpress } from "graphql-upload";
import cors from "cors";

(async () => {
  const app = express();
  app.use(cors())
  const options = await getConnectionOptions(
    process.env.NODE_ENV || "development"
  );
  await createConnection({ ...options, name: "default" });

  const apolloServer = new ApolloServer({
    uploads: false,
    schema: await buildSchema({
      resolvers: [UploadResolver],
      validate: true,
    }),
    context: ({ req, res }: { req: any, res: any }) => ({ req, res }),
  });
  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));
  apolloServer.applyMiddleware({ app, cors: false });
  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`server started at http://localhost:${port}/graphql`);
  });
})();
