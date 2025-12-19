export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen text-white bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-4xl mx-auto p-4 font-semibold">
          AI Meeting Minutes Generator
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {children}
      </main>
    </div>
  );
}

