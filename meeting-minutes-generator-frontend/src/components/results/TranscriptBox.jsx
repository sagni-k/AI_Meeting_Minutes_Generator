export default function TranscriptBox({ value, onChange }) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Paste or edit transcript here..."
      className="w-full h-44 p-4 rounded-2xl resize-none
                 bg-white/10 backdrop-blur-md
                 border border-white/20 shadow-xl
                 text-white placeholder-gray-400
                 focus:outline-none focus:ring-2 focus:ring-white/30"
    />
  );
}
