import grpc
from concurrent import futures

from grpc_api import music_pb2
from grpc_api import music_pb2_grpc

from shared.service import listar_usuarios


class MusicService(music_pb2_grpc.MusicServicer):
    def ListarUsuarios(self, request, context):
        return music_pb2.UsuariosResponse(
            usuarios=[
                music_pb2.Usuario(id=u["id"], nome=u["nome"], idade=u["idade"])
                for u in listar_usuarios()
            ]
        )


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    music_pb2_grpc.add_MusicServicer_to_server(MusicService(), server)
    server.add_insecure_port("[::]:8004")
    print("🚀 gRPC Python rodando em :8004")
    server.start()
    server.wait_for_termination()


if __name__ == "__main__":
    serve()
