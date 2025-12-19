import AudioUploader from "../components/upload/AudioUploader";
import TranscriptBox from "../components/results/TranscriptBox";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import { useProcessing } from "../hooks/useProcessing";
import { useState } from "react";

export default function Home() {
  const {
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
  } = useProcessing();

  const [model, setModel] = useState("groq");

  return (
    <div className="space-y-6">
      {/* Audio upload section */}
      <AudioUploader
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
        onTranscribe={handleAudioUpload}
        disabled={loading}
      />

      {loading && <Loader text={statusText} />}

      {/* Transcript input / edit */}
      <TranscriptBox value={transcript} onChange={setTranscript} />

      {/* Model selector */}
      <div className="flex items-center gap-3">
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border rounded p-2"
        >
          <option value="groq">Groq</option>
          <option value="gemini">Gemini</option>
        </select>

        <span className="text-xs text-gray-500">
          Choose another model if one is overloaded
        </span>
      </div>

      {/* LLM trigger */}
      <Button
        disabled={!transcript || loading}
        onClick={() => handleProcessTranscript(model)}
      >
        Generate Meeting Minutes
      </Button>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      {result && (
        <pre className="bg-white p-4 rounded border text-sm overflow-x-auto">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}
