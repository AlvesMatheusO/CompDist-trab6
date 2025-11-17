const path = require("path");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const { usuarios, musicas, playlists } = require("../shared/data");

const PROTO_PATH = path.join(__dirname, "music.proto");

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});

const musicProto = grpc.loadPackageDefinition(packageDefinition).music;

function listUsuarios(call, callback) {
  callback(null, { usuarios });
}

function listMusicas(call, callback) {
  callback(null, { musicas });
}

function listPlaylistsPorUsuario(call, callback) {
  const { usuarioId } = call.request;
  const result = playlists.filter((p) => p.usuarioId === usuarioId);
  callback(null, { playlists: result });
}

function listMusicasPorPlaylist(call, callback) {
  const { playlistId } = call.request;
  const playlist = playlists.find((p) => p.id === playlistId);
  if (!playlist) return callback(null, { musicas: [] });
  const result = playlist.musicaIds.map((id) =>
    musicas.find((m) => m.id === id)
  );
  callback(null, { musicas: result });
}

function listPlaylistsPorMusica(call, callback) {
  const { musicaId } = call.request;
  const result = playlists.filter((p) => p.musicaIds.includes(musicaId));
  callback(null, { playlists: result });
}

function main() {
  const server = new grpc.Server();
  server.addService(musicProto.MusicService.service, {
    ListUsuarios: listUsuarios,
    ListMusicas: listMusicas,
    ListPlaylistsPorUsuario: listPlaylistsPorUsuario,
    ListMusicasPorPlaylist: listMusicasPorPlaylist,
    ListPlaylistsPorMusica: listPlaylistsPorMusica,
  });

  const address = "0.0.0.0:50051";
  server.bindAsync(
    address,
    grpc.ServerCredentials.createInsecure(),
    () => {
      console.log(`gRPC server rodando em ${address}`);
      server.start();
    }
  );
}

main();
