import { Router } from "express";
import { Team } from "../../../models/nbl1/Team";
import { Player } from "../../../models/nbl1/Player";

const teamRoute = Router();

teamRoute.get("/team/:id", async (req, res) => {
  const id = req.params.id;
  console.log("query param", req.params);
  try {
    const teamDetails: any = await Team.findById(id).populate("players").exec();
    return res.send(teamDetails);
  } catch (err) {
    console.log(err);
  }
});

teamRoute.get("/available-scouts", async (req, res) => {
  console.log("request for available scouts");
  try {
    const teamScoutsAvailable: any = await Team.find({
      scoutPublished: true,
    }).exec();
    console.log("teamScoutsAvailable", teamScoutsAvailable);
    return res.send(teamScoutsAvailable);
  } catch (err) {
    console.log(err);
  }
  return res.send;
});

teamRoute.post("/update-scout-details", async (req, res) => {
  try {
    const team = req.body.teamDetails;
    console.log(req.body);
    console.log(team);

    const updateFields: Record<string, string> = {};
    // Loop through each key in teamDetails and add it to the updateFields object
    Object.keys(team).forEach((key) => {
      updateFields[key] = team[key];
    });

    const updatedTeam = await Team.findOneAndUpdate(
      {
        teamId: req.body.teamId,
      },
      {
        scoutPublished: team.scoutPublished,
        depthChart: team.depthChart,
        matchups: team.matchups,
        defensiveSchemes: team.defensiveSchemes,
        keysToTheGame: team.keysToTheGame,
        showDepthChart: team.showDepthChart,
        showMatchups: team.showMatchups,
        showDefensiveSchemes: team.showDefensiveSchemes,
        showKeysToTheGame: team.showKeysToTheGame,
        gameDetails: team.gameDetails,
      },
      {
        new: true,
      }
    ).exec();
    return updatedTeam;
  } catch (err) {
    console.log(err);
  }
});

export { teamRoute };
