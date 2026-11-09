const express = require('express');
const mysql = require('mysql2/promise');
require('dotenv').config();
const cors = require('cors'); 

const app = express();
app.use(express.json());

// 1. Összes termék lekérése
app.get("/api/termekek", (req, res) => {
    const data = db.prepare("SELECT * FROM termekek ORDER BY nev").all();
    res.json(data);
});

// 2. Csak az elérhető termékek
app.get("/api/termekek/elerheto", (req, res) => {
    const data = db.prepare(
        "SELECT id, kategoria_id, nev, keszlet, elerheto FROM termekek WHERE elerheto = 1"
    ).all();

    res.json(data);
});

// 3. Keresés név alapján
app.get("/api/termekek/kereses/:szoveg", (req, res) => {
    const szoveg = `%${req.params.szoveg}%`;

    const data = db.prepare(
        "SELECT * FROM termekek WHERE nev LIKE %egér%"
    ).all(szoveg);

    res.json(data);
});

// 4. Statisztika
app.get("/api/termekek/statisztika", (req, res) => {
    const data = db.prepare(
        "SELECT COUNT(*) AS termek_db, AVG(ar) AS atlag_ar, SUM(keszlet) AS ossz_keszlet FROM termekek"
    ).get();

    res.json(data);
});

// 5. Drága termékek (> 10 000 Ft)
app.get("/api/termekek/dragak", (req, res) => {
    const data = db.prepare(
        "SELECT nev, ar FROM termekek WHERE ar > 10000"
    ).all();

    res.json(data);
});

// POST - Új termék felvétele
app.post("/api/termekek", (req, res) => {
    const { kategoria_id, nev, keszlet, ar, elerheto } = req.body;

    const result = db.prepare(`
        INSERT INTO termekek (kategoria_id, nev, keszlet, ar, elerheto)
        VALUES (?, ?, ?, ?, ?)
    `).run(kategoria_id, nev, keszlet, ar, elerheto);

    res.json({
        message: "Termék hozzáadva",
        id: result.lastInsertRowid
    });
});

// DELETE - Termék törlése ID alapján
app.delete("/api/termekek/:id", (req, res) => {
    const result = db.prepare(
        "DELETE FROM termekek WHERE id = ?"
    ).run(req.params.id);

    res.json({
        message: "Termék törölve",
        toroltSorok: result.changes
    });
});

app.listen(3000, () => {
    console.log("Server fut: http://localhost:3000");
});

//2 insert into, 2 update, 2 delete