export default function TranscriptBox({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste or edit transcript here..."
      className="w-full h-40 p-3 border rounded resize-none"
    />
  );
}
