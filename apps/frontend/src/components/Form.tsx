import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";
import axios from "axios";
import { BACKEND_URL } from "@/lib/config";

export function Form() {
    const [githubUrl, setGithubUrl] = useState("");

    const handleStartInterview = async () => {
        if (!githubUrl) {
            toast("Please enter Github URLs");
            return;
        }

        try {
            const response = await axios.post(`${BACKEND_URL}/api/v1/pre-interview`, { githubUrl });
            console.log(response.data);
        } catch (error) {
            toast.error("Failed to start interview");
            console.error(error);
        }
        
    };

    return (
        <div className="h-screen w-screen flex justify-center items-center">
            <div>
                <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                    AI Interview Prep
                </h2>
                <div className="p-2">
                    <Input placeholder="Github Url" onChange={(e) => setGithubUrl(e.target.value)} />
                </div>
                <div className="flex justify-center p-4">
                    <Button onClick={handleStartInterview}>Start Interview</Button>
                </div>
            </div>
        </div>
    );
}