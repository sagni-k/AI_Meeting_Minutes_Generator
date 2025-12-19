export default function Loader({ text }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-gray-700"></div>
      <p className="text-sm text-gray-600">{text}</p>
    </div>
  );
}
