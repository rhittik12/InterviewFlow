import express from "express";
import { preInterviewSchema } from "./types";
import cors from "cors";
import axios from "axios";
import { scrapeGithub } from "./scrapers/github";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/pre-interview", async (req, res) => {
    const result = preInterviewSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            message: "Invalid request",
            errors: result.error.flatten().fieldErrors,
        });
        return;
    }

    const githubUrl = new URL(result.data.githubUrl);
    const githubUsername = githubUrl.pathname.split("/").filter(Boolean)[0]!;

    try {
        const repositories = await scrapeGithub(githubUsername);

        res.status(200).json({
            githubUsername,
            repositoryCount: repositories.length,
            repositories,
        });
    } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 404) {
            res.status(404).json({
                message: `GitHub user "${githubUsername}" was not found`,
            });
            return;
        }

        console.error("Failed to fetch GitHub repositories:", error);
        res.status(502).json({
            message: "Unable to fetch repositories from GitHub",
        });
    }
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
