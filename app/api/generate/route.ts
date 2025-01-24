import { NextResponse } from 'next/server';
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();
        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" }, 
                { status: 400 }
            );
        }
        const output = await replicate.run(
            "sundai-club/umang_dog:1e051e6592416c9d64b455c3707addf52e0f7d3b47cb1287cb6fef6d9ec2ab9b",
            {
                input: {
                    prompt: prompt,
                    guidance_scale: 6,
                    prompt_strength: 0.5,
                    seed: 5000,
                    model: "dev",
                    num_inference_steps: 25
                }
            }
        );
        return NextResponse.json({ imageUrl: String(output) });
    } catch (error) {
        return NextResponse.json(
            { error: "Failed to generate image" },
            { status: 500 }
        );
    }
}