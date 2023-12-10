import "reflect-metadata";
import express, { Express } from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { TaskResolver } from "./resolvers/task";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { createConnection, Connection } from 'typeorm'
import { Task } from './entities/Task'
const main = async () => {
    const conn: Connection = await createConnection({
        type: "postgres", // replace with the DB of your choice
        host: "127.0.0.1",
        database: "todolist-graphql-db", // replace with the name of your DB
        username: "postgres", // replace with your database user's username
        password: "mysecretpassword", // replace with your database user's password
        logging: true, // this shows the SQL that's being run
        synchronize: true, // this automatically runs all the database migrations, so you don't have to :)
        entities: [Task],
        port: 5432,
    });

    const apolloServer = new ApolloServer({
        schema: await buildSchema({
            resolvers: [TaskResolver],
            validate: false,
        }),
        plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
    });

    await apolloServer.start();
    const app: Express = express();

    apolloServer.applyMiddleware({ app });

    app.get("/", (_req, res) => res.send("you have not screwed up!"));

    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => console.log(`server started on port ${PORT}`));
};

main().catch((err) => console.error(err));
