import mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

export async function connectDB() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME
    });
    return connection;
}

export async function setupDatabase() {
    const db = await connectDB();
    await db.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            phone VARCHAR(20) UNIQUE,
            role ENUM('admin', 'user') DEFAULT 'user'
        );
    `);
    await db.query(`
        CREATE TABLE IF NOT EXISTS products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255),
            code VARCHAR(50) UNIQUE,
            price INT,
            stock INT,
            sold INT DEFAULT 0
        );
    `);
    console.log('Database MySQL is ready.');
}
