export default function Button({ children, ...props }) {
  return (
    <button
      {...props}
      className="px-5 py-2.5 rounded-xl
                 bg-black/80 text-white
                 border border-white/30
                 hover:bg-black
                 transition
                 disabled:opacity-50
                 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
