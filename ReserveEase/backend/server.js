import dotenv from "dotenv";
import app from "./app.js";

// Config file path load karein
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server Running On Port ${PORT}`);
});