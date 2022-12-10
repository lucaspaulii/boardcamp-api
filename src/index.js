import express from "express";
import cors from "cors";
import categoryRoutes from "./routes/categoryRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(categoryRoutes);
app.use(gameRoutes);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`app running at: port ${port}`));
