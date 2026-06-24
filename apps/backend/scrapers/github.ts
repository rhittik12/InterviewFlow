import axios from "axios";
import { HttpsProxyAgent } from "https-proxy-agent";

const {
    PROXY_USERNAME,
    PROXY_PASSWORD,
    PROXY_HOST,
    PROXY_PORT,
} = process.env;

if (!PROXY_USERNAME || !PROXY_PASSWORD || !PROXY_HOST || !PROXY_PORT) {
    throw new Error("Proxy environment variables are missing");
}

const proxyUrl = new URL(`http://${PROXY_HOST}:${PROXY_PORT}`);

proxyUrl.username = PROXY_USERNAME;
proxyUrl.password = PROXY_PASSWORD;

const httpsAgent = new HttpsProxyAgent(proxyUrl);

type GithubRepository = {
    description: string | null;
    name: string;
    full_name: string;
    stargazers_count: number;
    html_url: string;
};

export const scrapeGithub = async (username: string) => {
    const userRepos = await axios.get<GithubRepository[]>(
        `https://api.github.com/users/${encodeURIComponent(username)}/repos`,
        {
            httpsAgent,

            // Prevent Axios from applying a second proxy configuration.
            proxy: false,

            headers: {
                Accept: "application/vnd.github+json",
                "User-Agent": "InterviewFlow",
            },

            params: {
                per_page: 100,
                sort: "updated",
            },
            timeout: 15_000,
        },
    );

    return userRepos.data.map((repository) => ({
        description: repository.description,
        name: repository.name,
        fullName: repository.full_name,
        starCount: repository.stargazers_count,
        url: repository.html_url,
    }));
};