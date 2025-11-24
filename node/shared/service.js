import { usuarios, musicas, playlists } from "./data.js";

export function listarUsuarios() { return usuarios; }
export function listarMusicas() { return musicas; }
export function listarPlaylists() { return playlists; }

export function playlistsPorUsuario(id) {
  return playlists.filter(p => p.usuarioId === Number(id));
}

export function musicasPorPlaylist(id) {
  const p = playlists.find(x => x.id === Number(id));
  return p ? p.musicaIds.map(i => musicas.find(m => m.id === i)) : [];
}

export function playlistsPorMusica(id) {
  return playlists.filter(p => p.musicaIds.includes(Number(id)));
}
