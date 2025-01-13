const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const cors = require("cors");

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL konekcija
const connection = mysql.createConnection({
    host: "ucka.veleri.hr",
    user: "pvuletic",
    password: "11", 
    database: "pvuletic" 
});

connection.connect((err) => {
    if (err) {
        console.error("Greška pri povezivanju s bazom podataka:", err);
        return;
    }
    console.log("Povezan s bazom podataka!");
});

// RUTE ZA TABLICU IT_oprema_projekt_2025

// 1. Dohvaćanje svih zapisa
app.get("/api/oprema", (req, res) => {
    const query = "SELECT * FROM IT_oprema_projekt_2025";
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Greška pri dohvaćanju podataka:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.json(results);
    });
});

// 2. Dohvaćanje jednog zapisa prema ID-ju
app.get("/api/oprema/:id", (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM IT_oprema_projekt_2025 WHERE id = ?";
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Greška pri dohvaćanju podatka:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.json(results[0]);
    });
});

// 3. Unos nove opreme
app.post("/api/oprema", (req, res) => {
    const { naziv, serijski_broj, god_proizvodnje, dobavljac } = req.body;

    if (!naziv || !serijski_broj || !god_proizvodnje || !dobavljac) {
        res.status(400).send("Sva polja su obavezna.");
        return;
    }

    const query = `
        INSERT INTO IT_oprema_projekt_2025 (naziv, serijski_broj, god_proizvodnje, dobavljac)
        VALUES (?, ?, ?, ?);
    `;
    connection.query(query, [naziv, serijski_broj, god_proizvodnje, dobavljac], (err, results) => {
        if (err) {
            console.error("Greška pri unosu opreme:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.status(201).send("Oprema uspješno dodana.");
    });
});

// 4. Brisanje opreme prema ID-ju
app.delete("/api/oprema/:id", (req, res) => {
    const id = req.params.id;

    const query = "DELETE FROM IT_oprema_projekt_2025 WHERE id = ?";
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Greška pri brisanju opreme:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }

        if (results.affectedRows === 0) {
            res.status(404).send("Oprema s navedenim ID-jem ne postoji.");
            return;
        }

        res.send("Oprema uspješno obrisana.");
    });
});



// RUTE ZA TABLICU povijest_opreme_projekt_2025

// 1. Dohvaćanje povijesti za svu opremu
app.get("/api/povijest", (req, res) => {
    const query = `
        SELECT 
            p.id, 
            p.oprema_id, 
            o.naziv AS oprema_naziv, 
            p.datum_kvara, 
            p.kvar_opis, 
            p.datum_servisa, 
            p.servis_opis
        FROM 
            povijest_opreme_projekt_2025 p
        JOIN 
            IT_oprema_projekt_2025 o ON p.oprema_id = o.id;
    `;
    connection.query(query, (err, results) => {
        if (err) {
            console.error("Greška pri dohvaćanju povijesti opreme:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.json(results);
    });
});

// 2. Dohvaćanje povijesti za određenu opremu
app.get("/api/povijest/:oprema_id", (req, res) => {
    const opremaId = req.params.oprema_id;
    const query = `
        SELECT 
            p.id, 
            p.oprema_id, 
            o.naziv AS oprema_naziv, 
            p.datum_kvara, 
            p.kvar_opis, 
            p.datum_servisa, 
            p.servis_opis
        FROM 
            povijest_opreme_projekt_2025 p
        JOIN 
            IT_oprema_projekt_2025 o ON p.oprema_id = o.id
        WHERE 
            p.oprema_id = ?;
    `;
    connection.query(query, [opremaId], (err, results) => {
        if (err) {
            console.error("Greška pri dohvaćanju povijesti za određenu opremu:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.json(results);
    });
});

// 3. Brisanje zapisa iz povijesti
app.delete("/api/povijest/:id", (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM povijest_opreme_projekt_2025 WHERE id = ?";
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Greška pri brisanju zapisa iz povijesti opreme:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.send("Zapis uspješno obrisan.");
    });
});

// RUTE ZA TABLICU status_opreme_projekt_2025

// Dohvaćanje opreme prema statusu
app.get("/api/status_opreme", (req, res) => {
    const { status } = req.query;
    const query = `
        SELECT 
            s.id, 
            s.oprema_id, 
            o.naziv AS oprema_naziv, 
            s.status, 
            s.datum, 
            s.opis
        FROM 
            status_opreme_projekt_2025 s
        JOIN 
            IT_oprema_projekt_2025 o ON s.oprema_id = o.id
        WHERE 
            s.status = ?;
    `;
    connection.query(query, [status], (err, results) => {
        if (err) {
            console.error("Greška pri dohvaćanju statusa opreme:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.json(results);
    });
});

// Pokretanje servera
app.listen(port, () => {
    console.log(`Server pokrenut na portu ${port}`);
});
