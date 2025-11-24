import http from "http";
import soap from "soap";
import {
  listarUsuarios,
  listarMusicas,
  listarPlaylists
} from "../shared/service.js";

const service = {
  MusicService: {
    MusicPort: {
      ListarUsuarios(args) {
        return { usuarios: { usuario: listarUsuarios() } };
      },
      ListarMusicas(args) {
        return { musicas: { musica: listarMusicas() } };
      },
      ListarPlaylists(args) {
        return { playlists: { playlist: listarPlaylists() } };
      }
    }
  }
};

const wsdl = `
<definitions name="MusicService"
             targetNamespace="http://example.com/music"
             xmlns="http://schemas.xmlsoap.org/wsdl/"
             xmlns:tns="http://example.com/music"
             xmlns:xsd="http://www.w3.org/2001/XMLSchema"
             xmlns:soap="http://schemas.xmlsoap.org/wsdl/soap/">

  <types>
    <xsd:schema targetNamespace="http://example.com/music">
      <xsd:element name="ListarUsuariosResponse">
        <xsd:complexType>
          <xsd:sequence>
            <xsd:element name="usuarios" type="tns:Usuarios"/>
          </xsd:sequence>
        </xsd:complexType>
      </xsd:element>

      <xsd:complexType name="Usuarios">
        <xsd:sequence>
          <xsd:element name="usuario" type="tns:Usuario" maxOccurs="unbounded"/>
        </xsd:sequence>
      </xsd:complexType>

      <xsd:complexType name="Usuario">
        <xsd:sequence>
          <xsd:element name="id" type="xsd:int"/>
          <xsd:element name="nome" type="xsd:string"/>
          <xsd:element name="idade" type="xsd:int"/>
        </xsd:sequence>
      </xsd:complexType>

    </xsd:schema>
  </types>

  <message name="ListarUsuariosRequest"/>
  <message name="ListarUsuariosResponse">
    <part name="usuarios" element="tns:ListarUsuariosResponse"/>
  </message>

  <portType name="MusicPort">
    <operation name="ListarUsuarios">
      <input message="tns:ListarUsuariosRequest"/>
      <output message="tns:ListarUsuariosResponse"/>
    </operation>
  </portType>

  <binding name="MusicBinding" type="tns:MusicPort">
    <soap:binding style="document"
                  transport="http://schemas.xmlsoap.org/soap/http"/>
    <operation name="ListarUsuarios">
      <soap:operation soapAction="ListarUsuarios"/>
      <input><soap:body use="literal"/></input>
      <output><soap:body use="literal"/></output>
    </operation>
  </binding>

  <service name="MusicService">
    <port name="MusicPort" binding="tns:MusicBinding">
      <soap:address location="http://localhost:3002/wsdl"/>
    </port>
  </service>

</definitions>
`;

const server = http.createServer((req, res) => res.end("SOAP API online."));
server.listen(3002, () =>
  console.log("SOAP Node rodando em http://localhost:3002/wsdl?wsdl")
);

soap.listen(server, "/wsdl", service, wsdl);
