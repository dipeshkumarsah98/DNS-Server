/**
 * Interface representing the structure of a DNS header.
 */
export interface PacketType {
  packet_id: number; // Packet Identifier
  qr: number; // Query Response
  opCode: number; // Operation Code
  aa: number; // Authoritative Answer
  tc: number; // truncated message
  rd: number; // Recursion Desired
  ra: number; // Recursion Available
  z: number; // Reserved
  rcode: number; // Response code
  qdcount: number; // Question count
  ancount: number; // Answer count
  nscount: number; // Authority count
  arcount: number; // additional count
  question?: Question;
}

export interface Question {
  name: string;
  type: number;
  class: number;
}
