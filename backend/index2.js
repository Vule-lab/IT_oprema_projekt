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

// Dohvaćanje svih zapisa
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

// Unos nove opreme
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

// Brisanje opreme
// Brisanje opreme i povezanih podataka
app.delete("/api/oprema/:id", (req, res) => {
    const id = req.params.id;

    // Prvo obriši povezane podatke iz povijesti i statusa opreme
    const deletePovijest = "DELETE FROM povijest_opreme_projekt_2025 WHERE oprema_id = ?";
    const deleteStatus = "DELETE FROM status_opreme_projekt_2025 WHERE oprema_id = ?";
    const deleteOprema = "DELETE FROM IT_oprema_projekt_2025 WHERE id = ?";

    connection.query(deletePovijest, [id], (err, results) => {
        if (err) {
            console.error("Greška pri brisanju povijesti opreme:", err);
            res.status(500).send("Greška pri brisanju povijesti opreme.");
            return;
        }

        connection.query(deleteStatus, [id], (err, results) => {
            if (err) {
                console.error("Greška pri brisanju statusa opreme:", err);
                res.status(500).send("Greška pri brisanju statusa opreme.");
                return;
            }

            connection.query(deleteOprema, [id], (err, results) => {
                if (err) {
                    console.error("Greška pri brisanju opreme:", err);
                    res.status(500).send("Greška pri brisanju opreme.");
                    return;
                }

                if (results.affectedRows === 0) {
                    res.status(404).send("Oprema s navedenim ID-jem ne postoji.");
                    return;
                }

                res.send("Oprema i svi povezani podaci uspješno obrisani.");
            });
        });
    });
});



// POST ruta za prijavu kvara
app.post("/api/povijest", (req, res) => {
    const { oprema_id, datum_kvara, kvar_opis } = req.body;

    if (!oprema_id || !datum_kvara || !kvar_opis) {
        res.status(400).send("Sva polja su obavezna.");
        return;
    }

    console.log("Podaci koji se spremaju u bazu:", req.body);

    const query = `
        INSERT INTO povijest_opreme_projekt_2025 (oprema_id, datum_kvara, kvar_opis)
        VALUES (?, ?, ?);
    `;
    
    connection.query(query, [oprema_id, datum_kvara, kvar_opis], (err, results) => {
        if (err) {
            console.error("Greška pri unosu kvara:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }
        res.status(201).send("Kvar uspješno prijavljen.");
    });
});

// Unos servisa i ažuriranje statusa opreme
app.post("/api/servis", (req, res) => {
    const { oprema_id, datum_servisa, servis_opis } = req.body;

    if (!oprema_id || !datum_servisa || !servis_opis) {
        res.status(400).send("Sva polja su obavezna.");
        return;
    }

    // Ažuriranje povijesti opreme sa servisnim podacima
    const updatePovijest = `
        UPDATE povijest_opreme_projekt_2025
        SET datum_servisa = ?, servis_opis = ?
        WHERE oprema_id = ?;
    `;

    connection.query(updatePovijest, [datum_servisa, servis_opis, oprema_id], (err, results) => {
        if (err) {
            console.error("Greška pri unosu servisa u povijest:", err);
            res.status(500).send("Greška na serveru.");
            return;
        }

        // Ažuriranje statusa opreme u status_opreme_projekt_2025
        const updateStatus = `
            UPDATE status_opreme_projekt_2025
            SET status = 'servisirana', datum = ?, opis = ?
            WHERE oprema_id = ?;
        `;

        connection.query(updateStatus, [datum_servisa, servis_opis, oprema_id], (err, results) => {
            if (err) {
                console.error("Greška pri ažuriranju statusa opreme:", err);
                res.status(500).send("Greška na serveru.");
                return;
            }

            res.status(201).send("Servis uspješno dodan i oprema ažurirana.");
        });
    });
});






// Prijava kvara
app.get("/api/povijest", (req, res) => {
    const query = `
        SELECT 
            p.id, 
            p.oprema_id, 
            o.naziv AS naziv_opreme, 
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
        console.log("Dohvaćeni podaci iz povijesti opreme:", results);
        res.json(results);
    });
});


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
