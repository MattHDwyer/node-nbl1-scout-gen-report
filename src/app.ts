import express, { Router } from "express";
import { playerRoutes, teamRoutes } from "./api/routes";

const app = express();

app.use(express.json());
app.use("/", playerRoutes);
app.use("/", teamRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
