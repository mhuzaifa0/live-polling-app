import express from "express";
import { createPoll, getPoll, votePoll } from "../controllers/pollController.js";

export default function pollRoutes(io) {
  const router = express.Router();

  router.post("/", createPoll);
  router.get("/:slug", getPoll);
  router.post("/:slug/vote", votePoll(io));

  return router;
}
