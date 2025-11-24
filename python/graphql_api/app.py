import strawberry
from fastapi import FastAPI
from strawberry.fastapi import GraphQLRouter

from shared.service import (
    listar_usuarios,
    listar_musicas,
    listar_playlists_por_usuario,
    listar_musicas_por_playlist,
    listar_playlists_por_musica,
)

# -----------------------------
# TYPES
# -----------------------------

@strawberry.type
class Usuario:
    id: int
    nome: str
    idade: int


@strawberry.type
class Musica:
    id: int
    nome: str
    artista: str


@strawberry.type
class Playlist:
    id: int
    nome: str
    usuarioId: int


# -----------------------------
# ROOT QUERY
# -----------------------------

@strawberry.type
class Query:

    usuarios: list[Usuario] = strawberry.field(resolver=lambda: listar_usuarios())
    musicas: list[Musica] = strawberry.field(resolver=lambda: listar_musicas())

    @strawberry.field
    def playlists_por_usuario(self, usuario_id: int) -> list[Playlist]:
        return listar_playlists_por_usuario(usuario_id)

    @strawberry.field
    def musicas_por_playlist(self, playlist_id: int) -> list[Musica]:
        return listar_musicas_por_playlist(playlist_id)

    @strawberry.field
    def playlists_por_musica(self, musica_id: int) -> list[Playlist]:
        return listar_playlists_por_musica(musica_id)


schema = strawberry.Schema(query=Query)

# -----------------------------
# FASTAPI APP
# -----------------------------

app = FastAPI()

graphql_app = GraphQLRouter(schema)
app.include_router(graphql_app, prefix="/graphql")

# -----------------------------
# OPTIONAL ROOT
# -----------------------------

@app.get("/")
def root():
    return {"status": "GraphQL Python OK", "endpoint": "/graphql"}
