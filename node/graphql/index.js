import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import {
  listarUsuarios,
  listarMusicas,
  playlistsPorUsuario,
  musicasPorPlaylist,
  playlistsPorMusica
} from "../shared/service.js";

const typeDefs = `
  type Usuario {
    id: ID!
    nome: String!
    idade: Int!
  }

  type Musica {
    id: ID!
    nome: String!
    artista: String!
  }

  type Playlist {
    id: ID!
    nome: String!
  }

  type Query {
    usuarios: [Usuario!]!
    musicas: [Musica!]!
  }
`;

const resolvers = {
  Query: {
    usuarios: () => listarUsuarios(),
    musicas: () => listarMusicas()
  }
};

async function start() {
  const app = express();

  app.use(cors());
  app.use(bodyParser.json());

  const server = new ApolloServer({
    typeDefs,
    resolvers
  });

  await server.start();

  app.use("/graphql", expressMiddleware(server));

  app.listen(3003, () =>
    console.log("🚀 GraphQL Node rodando em http://localhost:3003/graphql")
  );
}

start();
