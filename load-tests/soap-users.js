import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vusers: 50,
  duration: "20s",
};

const soapBody = `<?xml version="1.0"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"
                  xmlns:mus="urn:MusicService">
  <soapenv:Header/>
  <soapenv:Body>
    <mus:ListUsuarios/>
  </soapenv:Body>
</soapenv:Envelope>`;

export default function () {
  const res = http.post(
    "http://localhost:3004/soap",
    soapBody,
    {
      headers: {
        "Content-Type": "text/xml;charset=UTF-8",
        SOAPAction: "listUsuarios",
      },
    }
  );

  check(res, { "status 200": (r) => r.status === 200 });
  sleep(1);
}
