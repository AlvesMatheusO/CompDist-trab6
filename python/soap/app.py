from spyne import Application, rpc, ServiceBase, Unicode, Integer, Array
from spyne.protocol.soap import Soap11
from spyne.server.wsgi import WsgiApplication

from shared.service import (
    listar_usuarios,
    listar_musicas,
    listar_playlists_por_usuario,
    listar_musicas_por_playlist,
    listar_playlists_por_musica,
)

# -----------------------------
# Tipos SOAP
# -----------------------------

class UsuarioSOAP(ServiceBase):
    id = Integer
    nome = Unicode
    idade = Integer


class MusicaSOAP(ServiceBase):
    id = Integer
    nome = Unicode
    artista = Unicode


class PlaylistSOAP(ServiceBase):
    id = Integer
    nome = Unicode
    usuarioId = Integer


# -----------------------------
# Serviço SOAP
# -----------------------------

class MusicService(ServiceBase):

    @rpc(_returns=Array(Unicode))
    def listarUsuarios(ctx):
        usuarios = listar_usuarios()
        return [f"{u['id']} - {u['nome']} ({u['idade']} anos)" for u in usuarios]

    @rpc(_returns=Array(Unicode))
    def listarMusicas(ctx):
        musicas = listar_musicas()
        return [f"{m['id']} - {m['nome']} ({m['artista']})" for m in musicas]

    @rpc(Integer, _returns=Array(Unicode))
    def listarPlaylistsPorUsuario(ctx, usuario_id):
        playlists = listar_playlists_por_usuario(usuario_id)
        return [f"{p['id']} - {p['nome']} (user {p['usuarioId']})" for p in playlists]

    @rpc(Integer, _returns=Array(Unicode))
    def listarMusicasPorPlaylist(ctx, playlist_id):
        musicas = listar_musicas_por_playlist(playlist_id)
        return [f"{m['id']} - {m['nome']} ({m['artista']})" for m in musicas]

    @rpc(Integer, _returns=Array(Unicode))
    def listarPlaylistsPorMusica(ctx, musica_id):
        playlists = listar_playlists_por_musica(musica_id)
        return [f"{p['id']} - {p['nome']} (user {p['usuarioId']})" for p in playlists]


# -----------------------------
# Configuração da Aplicação SOAP
# -----------------------------

application = Application(
    [MusicService],
    'music.soap.service',
    in_protocol=Soap11(validator="lxml"),
    out_protocol=Soap11(),
)

application = WsgiApplication(application)

# -----------------------------
# Servidor (WSGI standalone)
# -----------------------------

if __name__ == "__main__":
    from wsgiref.simple_server import make_server

    print("🔵 SOAP Python rodando em http://localhost:8002")
    print("🔵 WSDL: http://localhost:8002/?wsdl")

    server = make_server("0.0.0.0", 8002, application)
    server.serve_forever()
