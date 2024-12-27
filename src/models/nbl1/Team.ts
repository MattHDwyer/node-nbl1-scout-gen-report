import mongoose from "mongoose";

export const team = new mongoose.Schema(
  {
    teamId: {
      type: String,
      required: true,
      unique: true,
    },
    players: [{ type: mongoose.Schema.Types.ObjectId, ref: "player" }],
    teamName: {
      type: String,
      required: true,
      unique: true,
    },
    logoUrl: {
      type: String,
    },
    scoutPublished: {
      type: Boolean,
      required: true,
    },
    depthChart: {
      type: String,
    },
    matchups: [
      {
        type: String,
      },
    ],
    defensiveSchemes: [
      {
        type: String,
      },
    ],
    keysToTheGame: [
      {
        type: String,
      },
    ],
    showDepthChart: {
      type: Boolean,
      required: true,
    },
    showMatchups: {
      type: Boolean,
      required: true,
    },
    showDefensiveSchemes: {
      type: Boolean,
      required: true,
    },
    showKeysToTheGame: {
      type: Boolean,
      required: true,
    },
    gameDetails: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Team = mongoose.model("team", team);
