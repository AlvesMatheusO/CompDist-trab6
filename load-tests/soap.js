import http from "k6/http";
import { sleep } from "k6";

export const options = {
  vus: 20,         // 20 usuários virtuais
  duration: "20s", // tempo total
};

const body = `<?xml version="1.0"?>
<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
  <Body>
    <ListUsuarios xmlns="urn:MusicService"/>
  </Body>
</Envelope>`;

export default function () {
  const res = http.post(
    "http://localhost:3004/soap",
    body,
    {
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        "SOAPAction": "listUsuarios",
      },
    }
  );

  sleep(1);
}
