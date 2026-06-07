import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from "qrcode";

let client: Client | null = null;
let qrCodeData: string | null = null;
let isReady = false;

export function initWhatsApp() {
  if (client) return client;

  client = new Client({
    authStrategy: new LocalAuth(), 
    puppeteer: {
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"], 
    }
  });

  // Telefon ulanmagan bo'lsa, QR-kod yaratadi
  client.on("qr", (qr) => {
    qrCodeData = qr;
    isReady = false;
    console.log("WhatsApp QR-kod tayyor. Uni tizim panelida skanerlang.");
  });

  // Telefon muvaffaqiyatli ulansa
  client.on("ready", () => {
    qrCodeData = null;
    isReady = true;
    console.log("WhatsApp muvaffaqiyatli ulandi va tayyor!");
  });

  client.initialize().catch(err => console.error("WhatsApp init xatosi:", err));

  return client;
}

// Tashqaridan holatni tekshirish uchun funksiyalar
export const getWhatsAppStatus = () => ({ isReady, hasQr: !!qrCodeData, qrCodeData });

// Xabar yuborish asosiy funksiyasi
export async function sendWhatsAppMessage(phoneNumber: string, message: string) {
  if (!isReady || !client) {
    throw new Error("WhatsApp ulunmagan yoki tayyor emas!");
  }
  const cleanNumber = phoneNumber.replace(/\D/g, "");
  const chatId = `${cleanNumber}@c.us`;
  await client.sendMessage(chatId, message);
}