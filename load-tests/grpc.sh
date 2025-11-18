ghz \
  --insecure \
  --proto ./grpc-api/music.proto \
  --call music.MusicService.ListUsuarios \
  -c 50 \
  -n 2000 \
  0.0.0.0:50051