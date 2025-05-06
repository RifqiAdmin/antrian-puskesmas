import express from "express";
import cors from "cors";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "data.json";

function loadData() {
  if (!fs.existsSync(FILE)) return { nomorTerakhir: 0, antrian: [] };
  return JSON.parse(fs.readFileSync(FILE));
}

function saveData(data) {
  fs.writeFileSync(FILE, JSON.stringify(data));
}

app.get("/antrian", (req, res) => {
  res.json(loadData());
});

app.post("/tambah", (req, res) => {
  const data = loadData();
  data.nomorTerakhir++;
  data.antrian.push({ nomor: data.nomorTerakhir, dipanggil: false });
  saveData(data);
  res.json({ nomor: data.nomorTerakhir });
});

app.post("/panggil", (req, res) => {
  const { loket } = req.body;
  const data = loadData();
  const next = data.antrian.find(a => !a.dipanggil);
  if (next) {
    next.dipanggil = true;
    next.loket = loket;
    saveData(data);
    res.json(next);
  } else {
    res.status(404).json({ error: "Tidak ada antrian." });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
