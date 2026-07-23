import { nanoid } from "nanoid";
import crypto from "crypto";
import Poll from "../models/Poll.js";

const hashVoter = (ip, slug) =>
  crypto.createHash("sha256").update(`${ip}-${slug}`).digest("hex");

export const createPoll = async (req, res) => {
  try {
    const { question, options, expiresInMinutes } = req.body;

    if (!question || !options || options.length < 2) {
      return res
        .status(400)
        .json({ message: "Question and at least 2 options are required" });
    }

    const slug = nanoid(8);
    const expiresAt = expiresInMinutes
      ? new Date(Date.now() + expiresInMinutes * 60000)
      : null;

    const poll = await Poll.create({
      slug,
      question,
      options: options.map((text) => ({ text, votes: 0 })),
      expiresAt,
    });

    res.status(201).json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPoll = async (req, res) => {
  try {
    const poll = await Poll.findOne({ slug: req.params.slug });
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    // auto-close expired polls
    if (poll.expiresAt && new Date() > poll.expiresAt && !poll.isClosed) {
      poll.isClosed = true;
      await poll.save();
    }

    const ip = req.ip;
    const voterHash = hashVoter(ip, poll.slug);
    const hasVoted = poll.voters.includes(voterHash);

    res.json({ poll, hasVoted });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const votePoll = async (io) => async (req, res) => {
  try {
    const { slug } = req.params;
    const { optionIndex } = req.body;
    const ip = req.ip;

    const poll = await Poll.findOne({ slug });
    if (!poll) return res.status(404).json({ message: "Poll not found" });

    if (poll.isClosed || (poll.expiresAt && new Date() > poll.expiresAt)) {
      return res.status(400).json({ message: "Poll is closed" });
    }

    const voterHash = hashVoter(ip, slug);
    if (poll.voters.includes(voterHash)) {
      return res.status(400).json({ message: "You already voted on this poll" });
    }

    if (optionIndex < 0 || optionIndex >= poll.options.length) {
      return res.status(400).json({ message: "Invalid option" });
    }

    poll.options[optionIndex].votes += 1;
    poll.voters.push(voterHash);
    await poll.save();

    io.to(slug).emit("pollUpdated", poll);

    res.json(poll);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
