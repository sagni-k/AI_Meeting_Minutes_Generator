import AudioUploader from "../components/upload/AudioUploader";
import TranscriptBox from "../components/results/TranscriptBox";
import Button from "../components/common/Button";
import Loader from "../components/common/Loader";
import MeetingResults from "../components/results/MeetingResults";
import { useProcessing } from "../hooks/useProcessing";
import { generateMeetingReport } from "../utils/pdfGenerator";
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

    clearSelectedFile,
    clearTranscript,
    clearAll,
  } = useProcessing();

  const [model, setModel] = useState("groq");

  return (
    <div className="space-y-10">
      <AudioUploader
        selectedFile={selectedFile}
        onFileSelect={setSelectedFile}
        onTranscribe={handleAudioUpload}
        onClear={clearSelectedFile}
        disabled={loading}
      />

      {loading && <Loader text={statusText} />}

      <div className="rounded-2xl bg-white/10 backdrop-blur-md
                      border border-white/20 shadow-xl
                      p-6 space-y-6">

        <TranscriptBox value={transcript} onChange={setTranscript} />

        <div className="flex flex-wrap items-center gap-4">
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="bg-white/10 backdrop-blur-md
                       border border-white/20
                       rounded-xl px-3 py-2
                       text-white
                       focus:outline-none"
          >
            <option value="groq" className="text-black">Groq</option>
            <option value="gemini" className="text-black">Gemini</option>
          </select>

          <span className="text-xs text-gray-300">
            Choose another model if one is overloaded
          </span>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            disabled={!transcript || loading}
            onClick={() => handleProcessTranscript(model)}
          >
            Generate Meeting Minutes
          </Button>

          {transcript && (
            <button
              onClick={clearTranscript}
              className="px-4 py-2 rounded-xl
                         border border-red-400/40
                         text-red-300
                         hover:bg-red-400/10 transition"
            >
              Clear Transcript
            </button>
          )}

          {(selectedFile || transcript || result) && (
            <button
              onClick={clearAll}
              className="px-4 py-2 rounded-xl
                         border border-white/30
                         text-gray-300
                         hover:bg-white/10 transition"
            >
              Reset All
            </button>
          )}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {result && (
        <>
          <MeetingResults data={result} />

          <div className="flex justify-end">
            <Button onClick={() => generateMeetingReport(result)}>
              Download Report
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
