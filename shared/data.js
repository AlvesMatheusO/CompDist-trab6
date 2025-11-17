let nextUserId = 1;
let nextMusicId = 1;
let nextPlaylistId = 1;

const usuarios = [
  { id: nextUserId++, nome: "Iana", idade: 22 },
  { id: nextUserId++, nome: "Matheus", idade: 23 },
];

const musicas = [
  { id: nextMusicId++, nome: "SOLO", artista: "JENNIE" },
  { id: nextMusicId++, nome: "Hype Boy", artista: "NewJeans" },
  { id: nextMusicId++, nome: "Drama", artista: "aespa" },
];

const playlists = [
  {
    id: nextPlaylistId++,
    nome: "Favoritas da Iana",
    usuarioId: 1,
    musicaIds: [1, 2],
  },
  {
    id: nextPlaylistId++,
    nome: "Matt's Playlist",
    usuarioId: 2,
    musicaIds: [2, 3],
  },
];

module.exports = {
  usuarios,
  musicas,
  playlists,
  counters: { nextUserId, nextMusicId, nextPlaylistId },
};
