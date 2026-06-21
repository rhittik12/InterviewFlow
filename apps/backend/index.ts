import express from "express";
import { json } from "express";
import { preInterviewSchema } from "./types";
import axios from "axios";

const app = express();
app.use(express.json());

app.post("/api/v1/pre-interview", async(req, res) => {
    const { success, data } = preInterviewSchema.safeParse(req.body);

    if (!success) {
        res.status(411).json({
            message: "Invalid request",
        })
        return;
    }

    const githubUrl = data.github;
    const linkedinUrl = data.linkedin;

    const githubUsername = githubUrl.replace(/\/$/,'').split('/').pop();
    const linkedinUsername = linkedinUrl.replace(/\/$/, '').split('/').pop();

    const userRepos = await axios.get(`https://api.github.com/users/${githubUsername}/repos`);
    const filteredUserRepos = userRepos.data.map((x: any) => ({
        description: x.description,
        name: x.name,
        fullname: x.full_name,
        starCount: x.stargazers_count
    }))

    console.log(filteredUserRepos);


});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});