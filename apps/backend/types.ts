import { z } from "zod";

export const preInterviewSchema = z.object({
    githubUrl: z
        .string()
        .trim()
        .url("githubUrl must be a valid URL")
        .refine((value) => {
            const url = new URL(value);
            const pathParts = url.pathname.split("/").filter(Boolean);

            return (
                ["github.com", "www.github.com"].includes(url.hostname.toLowerCase()) &&
                pathParts.length === 1
            );
        },),
});
