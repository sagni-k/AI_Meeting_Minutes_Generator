import { useState } from "react";
import { uploadAudio, processTranscript } from "../services/api";

export function useProcessing() {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);

  // Explicit STT trigger
  const handleAudioUpload = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      setStatusText("Transcription in progress...");
      setError(null);

      const res = await uploadAudio(selectedFile);

      if (!res.data?.transcript) {
        throw new Error("STT failed or timed out");
      }

      setTranscript(res.data.transcript);
    } catch (err) {
      setError("Speech-to-text failed. Please try again.");
    } finally {
      setLoading(false);
      setStatusText("");
    }
  };

  // LLM processing
  const handleProcessTranscript = async (model) => {
    if (!transcript) return;

    try {
      setLoading(true);
      setStatusText("LLM is processing...");
      setError(null);
      setResult(null);

      const res = await processTranscript(transcript, model);
      setResult(res.data);
    } catch (err) {
      setError("LLM failed after maximum retries.");
    } finally {
      setLoading(false);
      setStatusText("");
    }
  };

  return {
    loading,
    statusText,
    error,

    selectedFile,
    setSelectedFile,

    transcript,
    setTranscript,

    result,

    handleAudioUpload,
    handleProcessTranscript,
  };
}
