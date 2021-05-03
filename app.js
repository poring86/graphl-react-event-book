const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { graphqlHTTP } = require("express-graphql");
const { buildSchema } = require("graphql");

const Event = require("./models/event");
const User = require("./models/user");

const app = express();

const events = [];

app.use(bodyParser.json());

app.use(
    "/graphql",
    graphqlHTTP({
        schema: buildSchema(`
        type Event{
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        type User{
            _id: ID!
            email: String!
            password:String
        }
        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }
        input UserInput{
            email: String!
            password: String!
        }
        type RootQuery {
            events: [Event!]!
        }
        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
        rootValue: {
            events: () => {
                return Event.find()
                    .then((events) => {
                        return events.map((event) => {
                            console.log(event);
                            return {
                                ...event._doc,
                                // _id: event._doc._id.toString(),
                            };
                        });
                    })
                    .catch((err) => {
                        throw err;
                    });
            },
            createEvent: (args) => {
                // const event = {
                //     _id: Math.random().toString(),
                //     title: args.eventInput.title,
                //     description: args.eventInput.description,
                //     price: +args.eventInput.price,
                //     date: args.eventInput.date,
                // };
                const event = new Event({
                    title: args.eventInput.title,
                    description: args.eventInput.description,
                    price: +args.eventInput.price,
                    date: new Date(args.eventInput.date),
                });
                event
                    .save()
                    .then((result) => {
                        // console.log(...result._doc);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
                // events.push(event);
                return event;
            },
            createUser: (args) => {
                return User.findOne({ email: args.userInput.email })
                    .then((user) => {
                        if (user) {
                            throw new Error("User exists already");
                        }
                        return bcrypt.hash(args.userInput.password, 12);
                    })
                    .then((hashedPassword) => {
                        const user = new User({
                            email: args.userInput.email,
                            password: hashedPassword,
                        });
                        return user.save();
                    })
                    .then((result) => {
                        return {
                            ...result._doc,
                            password: null,
                        };
                    })
                    .catch((err) => {
                        throw err;
                    });
            },
        },
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
