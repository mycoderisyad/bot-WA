import { WASocket } from '@whiskeysockets/baileys';
import { connectDB } from './db';
import { generateAIResponse } from './ai';

export async function handleCommand(sock: WASocket, msg: any) {
    const chatId = msg.key.remoteJid;
    const text = msg.message.conversation?.trim().toLowerCase();
    const db = await connectDB();

    // Pastikan bot sudah terhubung
    if (!sock.user || !sock.user.id) {
        console.error("❌ Error: Bot belum sepenuhnya terhubung.");
        return;
    }

    // Ambil nomor bot
    const botPhone = sock.user.id.split(':')[0];

    // **Jadikan nomor bot sebagai admin jika belum ada dalam database**
    await db.execute(
        `INSERT IGNORE INTO users (phone, role) VALUES (?, 'admin')`,
        [botPhone]
    );

    // Ambil nomor pengirim
    const senderPhone = msg.key.participant?.split('@')[0] || chatId.split('@')[0];

    // **Cek jika bot mengirim pesan ke dirinya sendiri**
    if (senderPhone === botPhone) {
        console.log("📩 Bot menerima pesan dari dirinya sendiri.");
        if (!text.startsWith('#')) {
            console.log("⏩ Mengabaikan pesan non-perintah dari bot sendiri.");
            return;
        }
    }

    // **Logika Perintah**
    if (text.startsWith('#daftar')) {
        const phone = chatId.split('@')[0];
        await db.execute(`INSERT IGNORE INTO users (phone, role) VALUES (?, ?)`, [phone, 'user']);
        await sock.sendMessage(chatId, { text: '✅ Registrasi berhasil!' });
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
        const phone = chatId.includes('@g.us') 
            ? msg.key.participant?.split('@')[0]  // Jika dari grup, ambil nomor pengirim
            : chatId.split('@')[0];  // Jika dari chat pribadi, ambil nomor chat
    
        console.log(`📞 Nomor pengirim: ${phone}`); // Debugging
    
        // **Cek apakah pengirim adalah admin**
        const [userRows]: any = await db.execute(`SELECT role FROM users WHERE phone = ?`, [phone]);
        
        console.log(`🔍 Data user di DB:`, userRows); // Debugging
        
        if (userRows.length === 0) {
            await sock.sendMessage(chatId, { text: '❌ Nomor Anda belum terdaftar. Gunakan #daftar terlebih dahulu!' });
            return;
        }
    
        if (userRows[0].role !== 'admin') {
            await sock.sendMessage(chatId, { text: '❌ Anda bukan admin! Hanya admin yang dapat menambahkan barang.' });
            return;
        }
    
        // **Parsing Input**
        const args = text.split('-');
        if (args.length < 5) {
            await sock.sendMessage(chatId, { text: '⚠️ Format salah! Gunakan: #addlist-NamaBarang-KodeBarang-Harga-Stok\nContoh: #addlist-Kemeja-KM001-150000-10' });
            return;
        }
    
        const name = args[1];
        const code = args[2];
        const price = parseInt(args[3]);
        const stock = parseInt(args[4]);
    
        if (!name || !code || isNaN(price) || isNaN(stock)) {
            await sock.sendMessage(chatId, { text: '⚠️ Format salah! Harga dan stok harus berupa angka.' });
            return;
        }
    
        await db.execute(`INSERT INTO products (name, code, price, stock) VALUES (?, ?, ?, ?)`, [name, code, price, stock]);
        await sock.sendMessage(chatId, { text: `✅ Barang "${name}" berhasil ditambahkan ke daftar!` });
    }

    else if (text.startsWith('#beli')) {
        const args = text.split('-');
        if (args.length < 3) {
            await sock.sendMessage(chatId, { text: '⚠️ Format salah! Gunakan: #beli-KodeBarang-Jumlah\nContoh: #beli-KM001-2' });
            return;
        }

        const code = args[1];
        const amount = parseInt(args[2]);

        const [rows]: any = await db.execute(`SELECT * FROM products WHERE code = ?`, [code]);
        const product = rows[0];

        if (!product || product.stock < amount) {
            await sock.sendMessage(chatId, { text: '❌ Stok tidak mencukupi atau barang tidak ditemukan.' });
        } else {
            await db.execute(`UPDATE products SET stock = stock - ?, sold = sold + ? WHERE code = ?`, [amount, amount, code]);
            await sock.sendMessage(chatId, { text: `✅ Pembelian ${amount} ${product.name} berhasil!` });
        }
    } 

    else {
        const aiResponse = await generateAIResponse(text);
        await sock.sendMessage(chatId, { text: aiResponse });
    }

    db.end();
}
