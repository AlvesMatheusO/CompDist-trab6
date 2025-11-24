from .data import usuarios, musicas, playlists


def listar_usuarios():
    return usuarios


def listar_musicas():
    return musicas


def listar_playlists():
    return playlists


def listar_playlists_por_usuario(usuario_id: int):
    return [p for p in playlists if p["usuarioId"] == usuario_id]


def listar_musicas_por_playlist(playlist_id: int):
    playlist = next((p for p in playlists if p["id"] == playlist_id), None)
    if not playlist:
        return []
    ids = playlist["musicaIds"]
    return [m for m in musicas if m["id"] in ids]


def listar_playlists_por_musica(musica_id: int):
    return [p for p in playlists if musica_id in p["musicaIds"]]
