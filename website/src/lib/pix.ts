// Gerador de payload PIX (EMV BRCode / BACEN)

function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return ((crc & 0xffff) >>> 0).toString(16).toUpperCase().padStart(4, "0");
}

function field(id: string, value: string): string {
  const len = value.length.toString().padStart(2, "0");
  return `${id}${len}${value}`;
}

/**
 * Gera o payload PIX (copia-e-cola / QR Code) conforme padrão BACEN.
 * @param chave  Chave PIX do recebedor (CPF, email, telefone, chave aleatória, CNPJ)
 * @param nome   Nome do recebedor (máx 25 chars, sem caracteres especiais)
 * @param cidade Cidade do recebedor (máx 15 chars)
 * @param valor  Valor em reais (ex: 100.50)
 * @param txid   ID da transação (5–25 chars alfanuméricos)
 */
export function gerarPixPayload(
  chave: string,
  nome: string,
  cidade: string,
  valor: number,
  txid: string
): string {
  const merchantAccount = field("00", "BR.GOV.BCB.PIX") + field("01", chave);
  const valorStr = valor.toFixed(2);
  const nomeClean = nome.normalize("NFD").replace(/[̀-ͯ]/g, "").slice(0, 25);
  const cidadeClean = cidade.normalize("NFD").replace(/[̀-ͯ]/g, "").slice(0, 15);
  const txidClean = txid.replace(/[^a-zA-Z0-9]/g, "").slice(0, 25).padEnd(5, "0");

  const payload =
    field("00", "01") +                         // Payload Format Indicator
    field("26", merchantAccount) +               // Merchant Account Information
    field("52", "0000") +                        // Merchant Category Code
    field("53", "986") +                         // Transaction Currency (BRL)
    field("54", valorStr) +                      // Transaction Amount
    field("58", "BR") +                          // Country Code
    field("59", nomeClean) +                     // Merchant Name
    field("60", cidadeClean) +                   // Merchant City
    field("62", field("05", txidClean)) +        // Additional Data (txid)
    "6304";                                       // CRC placeholder

  return payload + crc16(payload);
}
