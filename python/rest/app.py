from fastapi import FastAPI
from shared.service import (
    listar_usuarios, listar_musicas, playlists_por_usuario,
    musicas_por_playlist, playlists_por_musica
)

app = FastAPI()

@app.get("/usuarios")
def get_users(): return listar_usuarios()

@app.get("/musicas")
def get_songs(): return listar_musicas()

@app.get("/usuarios/{uid}/playlists")
def get_usr_pl(uid: int): return playlists_por_usuario(uid)

@app.get("/playlists/{pid}/musicas")
def get_pl_ms(pid: int): return musicas_por_playlist(pid)

@app.get("/musicas/{mid}/playlists")
def get_ms_pl(mid: int): return playlists_por_musica(mid)

