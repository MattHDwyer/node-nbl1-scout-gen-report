import { Router } from "express";
import { fetchTeamStats } from "./components/player";
import { fetchTeamDetails } from "./components/team";

const playerRoutes = Router();
const teamRoutes = Router();

playerRoutes.get("/player-stats", async (req, res) => {
  console.log(req.query);
  const playerStats = await fetchTeamStats(
    req.query.teamid as string,
    req.query.xquarksrc as string
  );

  return res.send(playerStats);
});

teamRoutes.get("/teams", async (req, res) => {
  const teamDetails = await fetchTeamDetails();

  return res.send(teamDetails);
});

export { playerRoutes, teamRoutes };
