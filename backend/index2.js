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

// 3. Dodavanje nove opreme
app.post("/api/oprema", (req, res) => {
    const { naziv, serijski_broj, god_proizvodnje, dobavljac } = req.body;
    const query = "INSERT INTO IT_oprema_projekt_2025 (naziv, serijski_broj, god_proizvodnje, dobavljac) VALUES (?, ?, ?, ?)";
    connection.query(query, [naziv, serijski_broj, god_proizvodnje, dobavljac], (err, results) => {
        if (err) {
            console.error("Greška pri dodavanju opreme:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.status(201).send("Nova oprema uspješno dodana.");
    });
});

// 4. Ažuriranje postojeće opreme
app.put("/api/oprema/:id", (req, res) => {
    const id = req.params.id;
    const { naziv, serijski_broj, god_proizvodnje, dobavljac } = req.body;
    const query = "UPDATE IT_oprema_projekt_2025 SET naziv = ?, serijski_broj = ?, god_proizvodnje = ?, dobavljac = ? WHERE id = ?";
    connection.query(query, [naziv, serijski_broj, god_proizvodnje, dobavljac, id], (err, results) => {
        if (err) {
            console.error("Greška pri ažuriranju opreme:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.send("Oprema uspješno ažurirana.");
    });
});

// 5. Brisanje opreme
app.delete("/api/oprema/:id", (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM IT_oprema_projekt_2025 WHERE id = ?";
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Greška pri brisanju opreme:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.send("Oprema uspješno obrisana.");
    });
});

// RUTE ZA TABLICU servis_opreme_projekt_2025

// 1. Dohvaćanje svih servisa za određenu opremu
app.get("/api/servisi/:oprema_id", (req, res) => {
    const opremaId = req.params.oprema_id;
    const query = "SELECT * FROM servis_opreme_projekt_2025 WHERE oprema_id = ?";
    connection.query(query, [opremaId], (err, results) => {
        if (err) {
            console.error("Greška pri dohvaćanju servisa:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.json(results);
    });
});

// 2. Dodavanje novog servisa
app.post("/api/servisi", (req, res) => {
    const { oprema_id, datum_kvara, kvar_opis, datum_servisa, servis_opis } = req.body;
    const query = "INSERT INTO servis_opreme_projekt_2025 (oprema_id, datum_kvara, kvar_opis, datum_servisa, servis_opis) VALUES (?, ?, ?, ?, ?)";
    connection.query(query, [oprema_id, datum_kvara, kvar_opis, datum_servisa, servis_opis], (err, results) => {
        if (err) {
            console.error("Greška pri dodavanju servisa:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.status(201).send("Novi servis uspješno dodan.");
    });
});

// 3. Ažuriranje postojećeg servisa
app.put("/api/servisi/:id", (req, res) => {
    const id = req.params.id;
    const { datum_kvara, kvar_opis, datum_servisa, servis_opis } = req.body;
    const query = "UPDATE servis_opreme_projekt_2025 SET datum_kvara = ?, kvar_opis = ?, datum_servisa = ?, servis_opis = ? WHERE id = ?";
    connection.query(query, [datum_kvara, kvar_opis, datum_servisa, servis_opis, id], (err, results) => {
        if (err) {
            console.error("Greška pri ažuriranju servisa:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.send("Servis uspješno ažuriran.");
    });
});

// 4. Brisanje servisa
app.delete("/api/servisi/:id", (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM servis_opreme_projekt_2025 WHERE id = ?";
    connection.query(query, [id], (err, results) => {
        if (err) {
            console.error("Greška pri brisanju servisa:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.send("Servis uspješno obrisan.");
    });
});

//Ruta za dohvaćanje servisirane opreme
app.get("/api/oprema_servisirana", (req, res) => {
    const query = `
        SELECT * 
        FROM status_opreme_projekt_2025
        WHERE status = 'servisirana';
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Greška pri dohvaćanju servisirane opreme:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }

        if (results.length === 0) {
            res.status(404).send("Nema servisirane opreme.");
            return;
        }

        res.json(results);
    });
});



//Ruta za dohvaćanje opreme s kvarovima
app.get("/api/oprema_kvarovi", (req, res) => {
    const query = `
        SELECT * 
        FROM status_opreme_projekt_2025
        WHERE status = 'kvar';
    `;

    connection.query(query, (err, results) => {
        if (err) {
            console.error("Greška pri dohvaćanju opreme s kvarovima:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }

        if (results.length === 0) {
            res.status(404).send("Nema opreme s prijavljenim kvarovima.");
            return;
        }

        res.json(results);
    });
});


// Pokretanje servera
app.listen(port, () => {
    console.log(`Server pokrenut na portu ${port}`);
});
