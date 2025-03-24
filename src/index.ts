import makeWASocket, { DisconnectReason, useMultiFileAuthState } from '@whiskeysockets/baileys';
import { Boom } from '@hapi/boom';
import * as qrcode from 'qrcode-terminal';
import { setupDatabase, connectDB } from './db';
import { handleCommand } from './commands';

async function startBot() {
    await setupDatabase();
    
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const sock = makeWASocket({
        auth: state,
        printQRInTerminal: true
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error as Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Connection closed. Reconnecting...', shouldReconnect);
            if (shouldReconnect) startBot();
        } else if (connection === 'open') {
            console.log('WhatsApp Bot Connected');
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
