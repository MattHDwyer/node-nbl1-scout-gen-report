import mongoose from "mongoose";

export const player = new mongoose.Schema(
  {
    playerId: {
      type: String,
      required: true,
      unique: true,
    },
    playerName: {
      type: String,
      required: true,
    },
    playerPosition: {
      type: String,
    },
    playerNumber: {
      type: Number || String,
    },
    playerHeight: {
      type: Number || String,
    },
    playerCareerStats: {
      type: Map,
      of: String,
    },
    playerPreviousSeasonStats: {
      type: Map,
      of: String,
    },
    playerCurrentSeasonStats: {
      type: Map,
      of: String,
    },
    playerHowToGuard: {
      type: String,
    },
    playerSummary: {
      type: String,
    },
    playerImages: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);

export const Player = mongoose.model("player", player);
