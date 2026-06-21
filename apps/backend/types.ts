import { z } from "zod";

export const preInterviewSchema = z.object({
    github: z.string(),
    linkedin: z.string(),
});