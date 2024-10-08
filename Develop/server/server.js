const express = require('express');
const path = require('path');
const routes = require('./routes');
const {ApolloServer } = require('apollo-server-express');
const { authMiddleware } = require('./utils/auth');
const {typeDefs, resolvers} = require('./schemas');
const db = require('./config/connection');

async function start(){
  const app = express();
const PORT = process.env.PORT || 3005;

const server = new ApolloServer({
  typeDefs, 
  resolvers, 
  context:authMiddleware
});

await server.start();

server.applyMiddleware({app});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
  console.log(`Use GraphQl at http://localhost:${PORT}${server.graphqlPath}`);
});

};

start();