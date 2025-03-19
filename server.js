const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Conectare la baza de date SQLite
const db = new sqlite3.Database("clients.db", (err) => {
  if (err) {
    console.error("Eroare la conectarea la baza de date:", err.message);
  } else {
    console.log("Conectat la baza de date SQLite.");
  }
});

// Setare pentru încărcarea fișierelor
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads";
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Endpoint pentru obținerea listei de clienți
app.get("/api/clienti", (req, res) => {
  db.all("SELECT * FROM clienti", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Endpoint pentru obținerea unui client după contract
app.get("/api/client/:contract", (req, res) => {
  const contract = req.params.contract;
  db.get("SELECT * FROM clienti WHERE contract = ?", [contract], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: "Clientul nu a fost găsit" });
      return;
    }
    res.json(row);
  });
});

app.get("/api/clienti/:contract", (req, res) => {
    console.log("Request primit pentru contract:", req.params.contract);
    
    const { contract } = req.params;
    db.get("SELECT * FROM clienti WHERE contract = ?", [contract], (err, row) => {
        if (err) {
            console.error("Eroare la interogare:", err.message);
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            console.log("Clientul nu a fost găsit:", contract);
            res.status(404).json({ error: "Client not found" });
            return;
        }
        res.json(row);
    });
});

// Endpoint pentru adăugarea unui nou client
app.post("/api/clienti", (req, res) => {
    console.log("Date primite la server:", req.body);
    
    const { 
        nume, email, telefon, status, 
        correspondence_judet, correspondence_localitate, correspondence_strada, correspondence_numarStrada, correspondence_bloc, correspondence_apartament,
        consumption_judet, consumption_localitate, consumption_strada, consumption_numarStrada, consumption_bloc, consumption_apartament 
    } = req.body;

    if (!nume || !email || !telefon) {
        return res.status(400).json({ error: "Toate câmpurile sunt necesare!" });
    }

    db.run(
        `INSERT INTO clienti (
            nume, email, telefon, status, 
            correspondence_judet, correspondence_localitate, correspondence_strada, correspondence_numarStrada, correspondence_bloc, correspondence_apartament,
            consumption_judet, consumption_localitate, consumption_strada, consumption_numarStrada, consumption_bloc, consumption_apartament
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            nume, email, telefon, status, 
            correspondence_judet, correspondence_localitate, correspondence_strada, correspondence_numarStrada, correspondence_bloc, correspondence_apartament,
            consumption_judet, consumption_localitate, consumption_strada, consumption_numarStrada, consumption_bloc, consumption_apartament
        ],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ contract: this.lastID });
        }
    );
});

// Endpoint pentru editarea unui client
app.put("/api/edit-client/:contract", (req, res) => {
  const { 
    nume, email, telefon, status, 
    correspondence_judet, correspondence_localitate, correspondence_strada, correspondence_numarStrada, correspondence_bloc, correspondence_apartament,
    consumption_judet, consumption_localitate, consumption_strada, consumption_numarStrada, consumption_bloc, consumption_apartament 
  } = req.body;
  const contract = req.params.contract;

  db.run(
    `UPDATE clienti SET 
        nume = ?, email = ?, telefon = ?, status = ?, 
        correspondence_judet = ?, correspondence_localitate = ?, correspondence_strada = ?, correspondence_numarStrada = ?, correspondence_bloc = ?, correspondence_apartament = ?, 
        consumption_judet = ?, consumption_localitate = ?, consumption_strada = ?, consumption_numarStrada = ?, consumption_bloc = ?, consumption_apartament = ? 
    WHERE contract = ?`,
    [
      nume, email, telefon, status, 
      correspondence_judet, correspondence_localitate, correspondence_strada, correspondence_numarStrada, correspondence_bloc, correspondence_apartament,
      consumption_judet, consumption_localitate, consumption_strada, consumption_numarStrada, consumption_bloc, consumption_apartament,
      contract
    ],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Client actualizat cu succes!" });
    }
  );
});

// Endpoint pentru ștergerea unui client
app.delete("/api/delete-client/:contract", (req, res) => {
  const contract = req.params.contract;

  db.run("DELETE FROM clienti WHERE contract = ?", [contract], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Client șters cu succes!" });
  });
});

// Endpoint pentru ștergerea unui document
app.delete("/api/documents/:id", (req, res) => {
  const documentId = req.params.id;

  db.run("DELETE FROM documents WHERE id = ?", [documentId], function (err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ message: "Document șters cu succes!" });
  });
});

// Endpoint pentru încărcarea documentelor
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "Niciun fișier nu a fost încărcat." });
  }

  const { contract } = req.body;
  const filename = req.file.filename;
  const filepath = `/uploads/${filename}`;

  db.run(
    "INSERT INTO documents (contract, filename) VALUES (?, ?)",
    [contract, filename],
    function (err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ message: "Fișier încărcat cu succes!", filename, filepath });
    }
  );
});

// Endpoint pentru obținerea documentelor unui client
app.get("/api/documents/:contract", (req, res) => {
  const contract = req.params.contract;
  db.all("SELECT * FROM documents WHERE contract = ?", [contract], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Pornirea serverului
app.listen(PORT, () => {
  console.log(`Serverul rulează pe http://localhost:${PORT}`);
});