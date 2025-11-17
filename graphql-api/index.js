import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

import { usuarios, musicas, playlists } from "../shared/data.js";

// Schema GraphQL
const typeDefs = `#graphql
  type Usuario {
    id: ID!
    nome: String!
    idade: Int!
    playlists: [Playlist!]!
  }

  type Musica {
    id: ID!
    nome: String!
    artista: String!
    playlists: [Playlist!]!
  }

  type Playlist {
    id: ID!
    nome: String!
    usuario: Usuario!
    musicas: [Musica!]!
  }

  type Query {
    usuarios: [Usuario!]!
    musicas: [Musica!]!
    playlistsPorUsuario(usuarioId: ID!): [Playlist!]!
    musicasPorPlaylist(playlistId: ID!): [Musica!]!
    playlistsPorMusica(musicaId: ID!): [Playlist!]!
  }
`;

const resolvers = {
  Query: {
    usuarios: () => usuarios,
    musicas: () => musicas,
    playlistsPorUsuario: (_, { usuarioId }) =>
      playlists.filter((p) => p.usuarioId === Number(usuarioId)),
    musicasPorPlaylist: (_, { playlistId }) => {
      const playlist = playlists.find((p) => p.id === Number(playlistId));
      if (!playlist) return [];
      return playlist.musicaIds.map((id) =>
        musicas.find((m) => m.id === id)
      );
    },
    playlistsPorMusica: (_, { musicaId }) =>
      playlists.filter((p) => p.musicaIds.includes(Number(musicaId))),
  },

  Usuario: {
    playlists: (usuario) =>
      playlists.filter((p) => p.usuarioId === usuario.id),
  },

  Musica: {
    playlists: (musica) =>
      playlists.filter((p) => p.musicaIds.includes(musica.id)),
  },

  Playlist: {
    usuario: (playlist) =>
      usuarios.find((u) => u.id === playlist.usuarioId),
    musicas: (playlist) =>
      playlist.musicaIds.map((id) => musicas.find((m) => m.id === id)),
  },
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  app.use(
    "/graphql",
    expressMiddleware(server)
  );

  const PORT = 3002;
  app.listen(PORT, () => {
    console.log(`🚀 GraphQL API rodando em http://localhost:${PORT}/graphql`);
  });
}

startServer();
