import { Router } from "express";
import { fetchTeamStats } from "./components/nbl1-api/player";
import { fetchTeamDetails } from "./components/nbl1-api/team";
import { Team } from "../models/nbl1/Team";
import { Player } from "../models/nbl1/Player";
import { verifyToken } from "../middleware/authMiddleware";
import { loginRoutes } from "./components/login/auth";
import { teamRoute as teamRosterRoutes } from "./components/team-roster/team-roster";

const playerRoutes = Router();
const teamRoutes = Router();
const userRoutes = Router();

playerRoutes.post("/update-player", async (req, res) => {
  const player = req.body.playerDetails;
  console.log(player);
  try {
    await Player.findOneAndUpdate(
      {
        playerId: req.body.playerId,
      },
      {
        playerPosition: player.playerPosition,
        playerNumber: player.playerNumber,
        playerHeight: player.playerHeight,
        playerHowToGuard: player.playerHowToGuard,
        playerSummaryTitle: player.playerSummaryTitle,
        playerSummary: player.playerSummary,
      }
    ).exec();
  } catch (err) {
    console.log(err);
  }
  return res.send(`${req.body.playerId} updated`);
});

playerRoutes.get("/player-stats", async (req, res) => {
  const teamId = req.query.teamid as string;
  if (!teamId) return res.status(400).send("No team id provided");
  try {
    const playerStats = await fetchTeamStats(req.query.teamid as string);

    playerStats?.forEach(async (player: any) => {
      console.log(player);
      const playerToAdd = {
        playerId: player.playerId,
        playerName: player.playerName,
        playerCareerStats: player.playerCareerStats,
        playerPreviousSeasonStats: player.player2023Stats,
        playerCurrentSeasonStats: player.player2024Stats,
        playerImages: player.playerImages,
      };

      const updatedPlayer = await Player.findOneAndUpdate(
        { playerId: player.playerId },
        playerToAdd,
        {
          upsert: true,
          new: true,
        }
      ).exec();

      await Team.findOneAndUpdate(
        {
          teamId: teamId,
        },
        {
          $push: { players: updatedPlayer._id },
        }
      ).exec();
      return;
    });

    return res.send(playerStats);
  } catch (err) {
    console.error(err);
    return res.status(500).send("An error occurred");
  }
});

teamRoutes.get("/fetch-teams", async (req, res) => {
  const teamDetails = await fetchTeamDetails();
  teamDetails.forEach(async (team: any) => {
    const teamToAdd = {
      teamId: team.id,
      teamName: team.name,
      logoUrl: team.logoUrl,
      players: [],
    };
    return await Team.findOneAndUpdate({ teamId: team.id }, teamToAdd, {
      upsert: true,
    }).exec();
  });
  return res.send(teamDetails);
});

userRoutes.get("/view-report", verifyToken, (req, res) => {
  res.status(200).send({ message: "You are logged in!" });
});

export { playerRoutes, teamRoutes, loginRoutes, userRoutes, teamRosterRoutes };
