"use client";

import { readDataStream } from "ai";
import type { OnboardingProfile, Question, TurnMessage } from "@/lib/types";
import { useCallback, useState } from "react";

interface StreamParams {
  profile: OnboardingProfile;
  question: Question;
  history: TurnMessage[];
  candidateAnswer?: string;
  isOpening: boolean;
  isLastQuestion?: boolean;
}

export function useInterviewerStream() {
  const [text, setText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stream = useCallback(async (params: StreamParams): Promise<string> => {
    setIsStreaming(true);
    setError(null);
    setText("");

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error ?? "Interview unavailable. Please retry.");
      }

      if (!res.body) throw new Error("No response stream");

      let full = "";
      for await (const chunk of readDataStream(res.body)) {
        if (chunk.type === "text-delta") {
          full += chunk.textDelta;
          setText(full);
        }
      }

      return full;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong. Please retry.";
      setError(msg);
      throw e;
    } finally {
      setIsStreaming(false);
    }
  }, []);

  const reset = useCallback(() => {
    setText("");
    setError(null);
  }, []);

  return { text, isStreaming, error, stream, reset, setText };
}
