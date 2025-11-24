import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 50,
  duration: "20s",
};

const soapEnvelope = `<?xml version="1.0"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
  <soap:Body>
    <ListarUsuarios xmlns="http://example.com/musics"/>
  </soap:Body>
</soap:Envelope>`;

export default function () {
  const res = http.post(
    "http://localhost:3002/wsdl",
    soapEnvelope,
    { headers: { "Content-Type": "text/xml" } }
  );

  check(res, { "status 200": (r) => r.status === 200 });
}
