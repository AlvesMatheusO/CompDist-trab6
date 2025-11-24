import grpc

from . import music_pb2 as music__pb2


class MusicStub(object):
    """Stub client for the Music service"""

    def __init__(self, channel):
        """Constructor.

        Args:
            channel: A grpc.Channel.
        """
        self.ListarUsuarios = channel.unary_unary(
            '/Music/ListarUsuarios',
            request_serializer=music__pb2.Empty.SerializeToString,
            response_deserializer=music__pb2.UsuariosResponse.FromString,
        )


class MusicServicer(object):
    """The service definition for Music."""

    def ListarUsuarios(self, request, context):
        """Override in server implementation."""
        context.set_code(grpc.StatusCode.UNIMPLEMENTED)
        context.set_details('Method not implemented!')
        raise NotImplementedError('Method not implemented!')


def add_MusicServicer_to_server(servicer, server):
    rpc_method_handlers = {
        'ListarUsuarios': grpc.unary_unary_rpc_method_handler(
            servicer.ListarUsuarios,
            request_deserializer=music__pb2.Empty.FromString,
            response_serializer=music__pb2.UsuariosResponse.SerializeToString,
        ),
    }
    generic_handler = grpc.method_handlers_generic_handler(
        'Music', rpc_method_handlers)
    server.add_generic_rpc_handlers((generic_handler,))
