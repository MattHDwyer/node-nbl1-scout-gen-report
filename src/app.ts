import express, { Router } from "express";
import {
  playerRoutes,
  teamRoutes,
  loginRoutes,
  teamRosterRoutes,
} from "./api/routes";
import { dbConnect } from "./connect";
import "dotenv/config";

const app = express();

app.use(express.json());

dbConnect();

app.use("/", playerRoutes);
app.use("/", teamRoutes);
app.use("/auth", loginRoutes);
app.use("/team-roster", teamRosterRoutes);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
