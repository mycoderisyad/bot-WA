import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as qrcode from 'qrcode-terminal';
import { setupDatabase, connectDB } from './db';
import { handleCommand } from './commands';
import fs from 'fs';
import path from 'path';

async function startBot() {
    await setupDatabase();
    const sessionPath = path.join(__dirname, "..", "auth"); // Path ke session folder
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
            console.log(`🛑 Bot terputus, alasan: ${reason}`);

            if (reason === DisconnectReason.loggedOut) {
                console.log("🗑 Menghapus session karena logout...");
                
                // Hapus folder session otomatis
                if (fs.existsSync(sessionPath)) {
                    fs.rmSync(sessionPath, { recursive: true, force: true });
                    console.log("✅ Session dihapus. Jalankan ulang bot untuk scan QR.");
                }

                process.exit(); // Keluar dari proses, mencegah reconnect otomatis
            } else {
                console.log("🔄 Menghubungkan ulang...");
                startBot(); // Restart bot jika hanya terputus sementara
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp Bot Connected!');
        }
    });

    sock.ev.on('messages.upsert', async ({ messages }) => {
        const message = messages[0];
        if (!message.key.fromMe && message.message?.conversation) {
            await handleCommand(sock, message);
        }
    });
}

startBot();
