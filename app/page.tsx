"use client";

import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const generateModel = async () => {
    try {
      const modelResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });


      if (!modelResponse.ok) {
        const errorData = await modelResponse.json();
        if (modelResponse.status === 400) {
          setError("Please enter a non-empty prompt");
        } else {
          setError(errorData.error || "An error occurred while generating the image. Please try again.");
        }
        return;
      }

      const modelData = await modelResponse.json();
      if (!modelData.imageUrl) {
        setError("No image URL received from the server");
        return;
      }
      
      setImageUrl(modelData.imageUrl);
      setError(null);
    } catch (error) {
      console.error('Error:', error);
      setError("An error occurred while generating the image. Please try again.");
    }
  };
  
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Generate a MITHOO picture</h1>
        <h3 className="font-bold">Enter your prompt and click generate</h3>
        
        <div className="flex flex-col gap-4 w-full max-w-md">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt here..."
            className="w-full px-4 py-2 rounded-md border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={generateModel}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Generate
          </button>
        </div>

        {imageUrl && (
          <div className="w-full max-w-md">
            <Image
              src={imageUrl}
              alt="Generated image"
              width={512}
              height={512}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

      </main>
      
    </div>
  );
}

