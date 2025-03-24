import { WASocket } from '@whiskeysockets/baileys';
import { connectDB } from './db';
import { generateAIResponse } from './ai';

export async function handleCommand(sock: WASocket, msg: any) {
    const chatId = msg.key.remoteJid;
    const text = msg.message.conversation.trim().toLowerCase();
    const db = await connectDB();

    if (text.startsWith('#daftar')) {
        const phone = chatId.split('@')[0];
        await db.execute(`INSERT IGNORE INTO users (phone) VALUES (?)`, [phone]);
        await sock.sendMessage(chatId, { text: 'Registrasi berhasil!' });
    } 
    else if (text === '#stok') {
        const [products] = await db.execute(`SELECT * FROM products`);
        let response = '📦 Stok Barang:\n';
        (products as any[]).forEach(p => {
            response += `${p.name} - Rp${p.price} (Stok: ${p.stock}, Terjual: ${p.sold}, Kode: ${p.code})\n`;
        });
        await sock.sendMessage(chatId, { text: response });
    } 
    else if (text.startsWith('#addlist')) {
        const [_, name, code, price, stock] = text.split('-');
        await db.execute(`INSERT INTO products (name, code, price, stock) VALUES (?, ?, ?, ?)`, [name, code, parseInt(price), parseInt(stock)]);
        await sock.sendMessage(chatId, { text: 'Barang berhasil ditambahkan!' });
    } 
    else if (text.startsWith('#beli')) {
        const [_, code, amount] = text.split('-');
        const [rows]: any = await db.execute(`SELECT * FROM products WHERE code = ?`, [code]);
        const product = rows[0];

        if (!product || product.stock < parseInt(amount)) {
            await sock.sendMessage(chatId, { text: 'Stok tidak mencukupi atau barang tidak ditemukan.' });
        } else {
            await db.execute(`UPDATE products SET stock = stock - ?, sold = sold + ? WHERE code = ?`, [parseInt(amount), parseInt(amount), code]);
            await sock.sendMessage(chatId, { text: `Pembelian ${amount} ${product.name} berhasil!` });
        }
    } 
    else {
        const aiResponse = await generateAIResponse(text);
        await sock.sendMessage(chatId, { text: aiResponse });
    }

    db.end();
}
