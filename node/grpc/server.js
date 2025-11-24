import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import { listarUsuarios } from "../shared/service.js";

const pkgDef = protoLoader.loadSync("music.proto");
const proto = grpc.loadPackageDefinition(pkgDef);

const server = new grpc.Server();

server.addService(proto.Music.service, {
  ListarUsuarios(_, callback) {
    callback(null, { usuarios: listarUsuarios() });
  }
});

server.bindAsync("0.0.0.0:3004", grpc.ServerCredentials.createInsecure(), () => {
  console.log("gRPC Node na 3004");
  server.start();
});
