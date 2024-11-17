import * as dgram from "dgram";
import { PacketType, Question } from "./types";

// You can use print statements as follows for debugging, they'll be visible when running tests.
console.log("Logs from your program will appear here!");

// Uncomment this block to pass the first stage
//
const udpSocket: dgram.Socket = dgram.createSocket("udp4");
const PORT = 2053;
const HOST = "127.0.0.1";

udpSocket.bind(PORT, HOST, () => {
  console.info(
    `${new Date().toISOString()} Server started at https://${HOST}:${PORT}`
  );
});

//  Each message consists of a 5 section: header, question, answer, authority, and additional.

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
  try {
    console.log(
      `[${new Date().toISOString()}] Received data from ${remoteAddr.address}:${
        remoteAddr.port
      }`
    );

    console.log(`[${new Date().toISOString()}] Data: ${data.toString("hex")}`);

    const question = encodeQuestion([
      {
        class: 1,
        name: "codecrafters.io",
        type: 1,
      },
    ]);

    const headerData: PacketType = {
      packet_id: 1223,
      qr: 1,
      opCode: 0,
      aa: 0,
      tc: 0,
      rd: 0,
      ra: 0,
      z: 0,
      rcode: 0,
      qdcount: 1,
      ancount: 0,
      nscount: 0,
      arcount: 0,
    };

    const header = encodePacket(headerData);
    const res = Buffer.concat([header, question]);

    udpSocket.send(res, remoteAddr.port, remoteAddr.address);
  } catch (e) {
    console.log(`Error sending data: ${e}`);
  }
});

udpSocket.on("error", (err) => {
  console.error(`server error:\n${err.stack}`);

  udpSocket.close();
});

/**
 * Creates a Encode DNS header buffer.
 * @returns {Buffer} The DNS header as a buffer.
 */
function encodePacket(packet: PacketType): Buffer {
  const buffer = Buffer.alloc(12);
  let offset = 0;

  buffer.writeUint16BE(packet.packet_id, offset);

  offset += 2;
  const flags =
    (packet.qr << 15) |
    (packet.opCode << 11) |
    (packet.aa << 10) |
    (packet.tc << 9) |
    (packet.rd << 8) |
    (packet.ra << 7) |
    packet.z |
    packet.rcode; // 16 bit value

  buffer.writeUInt16BE(flags, offset);

  offset += 2;
  buffer.writeUInt16BE(packet.qdcount, offset);

  offset += 2;
  buffer.writeUint16BE(packet.ancount, offset);

  offset += 2;
  buffer.writeUint16BE(packet.nscount, offset);

  offset += 2;

  buffer.writeUint16BE(packet.arcount, offset);
  offset += 2;

  return buffer;
}

function encodeQuestion(questions: Question[]) {
  return Buffer.concat(
    questions.map((question) => {
      const { name, type, class: c } = question;

      const str = name
        .split(",")
        .map((n) => `${String.fromCharCode(n.length)}${n}`)
        .join("");

      const typeAndClass = Buffer.alloc(4);

      typeAndClass.writeUint16BE(type, 0);
      typeAndClass.writeUint16BE(c, 2);

      return Buffer.concat([Buffer.from(str + "\0"), typeAndClass]);
    })
  );
}

function decodePacket(question: Question) {
  console.log("🚀 ~ decodePacket ~ question:", question.name.split("."));
}
