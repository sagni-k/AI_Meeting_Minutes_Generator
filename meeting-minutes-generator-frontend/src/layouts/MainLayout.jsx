export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto p-4 font-semibold">
          AI Meeting Minutes Generator
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4">{children}</main>
    </div>
  );
}
