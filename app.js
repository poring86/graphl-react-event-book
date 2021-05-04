const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const { graphqlHTTP } = require("express-graphql");

const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const app = express();

// const events = [];

app.use(bodyParser.json());

app.use(
    "/graphql",
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true,
    })
);

console.log(process.env.MONGODB_URL);

mongoose
    .connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => {
        app.listen(3000, () => {
            console.log("Listening on port 3000");
        });
    });
