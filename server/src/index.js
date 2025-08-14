import express from "express";
import cors from "cors";
import cryptoRoutes from "./routes/cryptoRoutes.js";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Cryptography API running" });
});

app.use("/api/crypto", cryptoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
