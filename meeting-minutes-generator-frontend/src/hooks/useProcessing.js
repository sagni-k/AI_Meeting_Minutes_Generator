import { useState } from "react";
import { uploadAudio, processTranscript } from "../services/api";

export function useProcessing() {
  const [loading, setLoading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [error, setError] = useState(null);

  const [selectedFile, setSelectedFile] = useState(null);
  const [transcript, setTranscript] = useState("");
  const [result, setResult] = useState(null);

  const handleAudioUpload = async () => {
    if (!selectedFile) {
      setError("Please select an audio file first.");
      return;
    }

    try {
      setLoading(true);
      setStatusText("Transcription in progress...");
      setError(null);

      const res = await uploadAudio(selectedFile);

      if (!res.data?.transcript) {
        throw new Error("STT_FAILED");
      }

      setTranscript(res.data.transcript);
    } catch (err) {
      if (err.response) {
        setError("Audio transcription failed. Please try a different audio file.");
      } else if (err.request) {
        setError("Backend service is unavailable. Please try again later.");
      } else {
        setError("Unexpected error during transcription.");
      }
    } finally {
      setLoading(false);
      setStatusText("");
    }
  };

  const handleProcessTranscript = async (model) => {
    if (!transcript) {
      setError("Please provide a transcript before processing.");
      return;
    }

    try {
      setLoading(true);
      setStatusText("LLM is processing...");
      setError(null);
      setResult(null);

      const res = await processTranscript(transcript, model);
      setResult(res.data);
    } catch (err) {
      if (err.response) {
        setError("AI processing failed. Try switching the model or retry later.");
      } else if (err.request) {
        setError("Backend service is unavailable. Please try again later.");
      } else {
        setError("Unexpected error during AI processing.");
      }
    } finally {
      setLoading(false);
      setStatusText("");
    }
  };

  

  const clearSelectedFile = () => {
    setSelectedFile(null);
    setError(null);
  };

  const clearTranscript = () => {
    setTranscript("");
    setResult(null);
    setError(null);
  };

  const clearAll = () => {
    setSelectedFile(null);
    setTranscript("");
    setResult(null);
    setError(null);
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

    clearSelectedFile,
    clearTranscript,
    clearAll,
  };
}
