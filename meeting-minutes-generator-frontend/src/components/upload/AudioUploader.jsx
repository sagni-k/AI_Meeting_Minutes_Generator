import { useRef } from "react";
import Button from "../common/Button";

export default function AudioUploader({
  selectedFile,
  onFileSelect,
  onTranscribe,
  onClear,
  disabled,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelect(file);
    }
  };

  const handleClear = () => {
    onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; 
    }
  };

  return (
    <div
      className="rounded-2xl bg-white/10 backdrop-blur-md
                 border border-white/20 shadow-xl
                 p-5 space-y-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm text-gray-200 truncate">
          {selectedFile ? (
            <span className="font-medium">{selectedFile.name}</span>
          ) : (
            <span className="text-gray-400">Select an audio file</span>
          )}
        </div>

        <div className="flex gap-2">
          <label className="cursor-pointer">
            <input
              ref={fileInputRef}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <span
              className="px-4 py-2 rounded-lg text-sm
                         bg-white/10 text-white
                         border border-white/30
                         hover:bg-white/20 transition"
            >
              Choose file
            </span>
          </label>

          {selectedFile && (
            <button
              onClick={handleClear}
              className="px-3 py-2 rounded-lg text-sm
                         border border-red-400/40
                         text-red-300
                         hover:bg-red-400/10 transition"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <Button disabled={!selectedFile || disabled} onClick={onTranscribe}>
        Transcribe Audio
      </Button>
    </div>
  );
}
