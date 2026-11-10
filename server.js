const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: "localhost",
    port: 3307,
    user: "root",
    password: "",
    database: "raktar_db"
});

db.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }

    console.log("MySQL kapcsolódva");
});

app.get("/", (req, res) => {
    res.send("API működik");
});

app.get("/api/termekek", (req, res) => {
    db.query(
        "SELECT * FROM termekek ORDER BY nev",
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

app.get("/api/termekek/elerheto", (req, res) => {
    db.query(
        "SELECT id, kategoria_id, nev, keszlet, elerheto FROM termekek WHERE elerheto = 1",
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

app.get("/api/termekek/dragak", (req, res) => {
    db.query(
        "SELECT nev, ar FROM termekek WHERE ar > 10000",
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

app.get("/api/termekek/statisztika", (req, res) => {
    db.query(
        "SELECT COUNT(*) AS termek_db, AVG(ar) AS atlag_ar, SUM(keszlet) AS ossz_keszlet FROM termekek",
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result[0]);
        }
    );
});

app.get("/api/termekek/kereses/:szoveg", (req, res) => {
    db.query(
        "SELECT * FROM termekek WHERE nev LIKE ?",
        [`%${req.params.szoveg}%`],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

app.post("/api/termekek", (req, res) => {
    const { kategoria_id, nev, ar, keszlet, elerheto } = req.body;

    db.query(
        "INSERT INTO termekek(kategoria_id, nev, ar, keszlet, elerheto) VALUES (?, ?, ?, ?, ?)",
        [kategoria_id, nev, ar, keszlet, elerheto],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                message: "Termék hozzáadva",
                id: result.insertId
            });
        }
    );
});

app.put("/api/termekek/:id", (req, res) => {
    const { kategoria_id, nev, ar, keszlet, elerheto } = req.body;

    db.query(
        "UPDATE termekek SET kategoria_id=?, nev=?, ar=?, keszlet=?, elerheto=? WHERE id=?",
        [
            kategoria_id,
            nev,
            ar,
            keszlet,
            elerheto,
            req.params.id
        ],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                message: "Termék módosítva",
                modositottSorok: result.affectedRows
            });
        }
    );
});

app.delete("/api/termekek/:id", (req, res) => {
    db.query(
        "DELETE FROM termekek WHERE id = ?",
        [req.params.id],
        (err, result) => {
            if (err) return res.status(500).json(err);

            res.json({
                message: "Termék törölve",
                toroltSorok: result.affectedRows
            });
        }
    );
});

app.put("/api/termekek/:id", (req, res) => {
    const { kategoria_id, nev, ar, keszlet, elerheto } = req.body;

    db.query(
        `UPDATE termekek
         SET kategoria_id = ?,
             nev = ?,
             ar = ?,
             keszlet = ?,
             elerheto = ?
         WHERE id = ?`,
        [
            kategoria_id,
            nev,
            ar,
            keszlet,
            elerheto,
            req.params.id
        ],
        (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Termék módosítva",
                modositottSorok: result.affectedRows
            });
        }
    );
});

app.listen(3000, () => {
    console.log("Server fut: http://localhost:3000");
});