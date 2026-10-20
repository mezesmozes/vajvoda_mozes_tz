const express = require("express");
const Database = require("rakter_db");
 
const app = express();
const db = new Database("raktar.db");

//1
app.get("/api/termekek", (req, res) => {
    const data = db.prepare("SELECT nev from termekek order by disc").all();
    res.json(data);
});
//2
app.get("/api/termekek/elerheto", (req, res) => {
    const data = db.prepare("SELECT id, kategoria_id, nev, ,keszlet, elerheto from termekek where elerheto like 1;").all();
    res.json(data);
});
//3
app.get("/api/termekek/kereses/:szoveg", (req, res) => {
    const data = db.prepare("SELECT * from kategoriak, termekek where %fej%").all();
    res.json(data);
});
//4
app.get("/api/termekek/statisztika", (req, res) => {
    const data = db.prepare("SELECT nev, keszlet, ar(AVG) from termekek").all();
    res.json(data);
});
//5
app.get("/api/termekek/dragak", (req, res) => {
    const data = db.prepare("SELECT nev from termekek where ar > 10000").all();
    res.json(data);
});


app.listen(3000, () => {
    console.log("Server fut: http://localhost:3000");
});