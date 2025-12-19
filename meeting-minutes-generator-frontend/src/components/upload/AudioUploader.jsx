import Button from "../common/Button";

export default function AudioUploader({ selectedFile, onFileSelect, onTranscribe, disabled }) {
  return (
    <div className="border rounded p-4 bg-white space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-700">
          {selectedFile ? (
            <span className="font-medium">{selectedFile.name}</span>
          ) : (
            <span className="text-gray-400">No file chosen</span>
          )}
        </div>

        <label className="cursor-pointer">
          <input
            type="file"
            accept="audio/*"
            className="hidden"
            onChange={(e) => onFileSelect(e.target.files[0])}
          />
          <span className="px-3 py-2 border rounded text-sm hover:bg-gray-100">
            Choose file
          </span>
        </label>
      </div>

      <Button
        disabled={!selectedFile || disabled}
        onClick={onTranscribe}
      >
        Transcribe Audio
      </Button>
    </div>
  );
}
