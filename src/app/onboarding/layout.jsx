export default function OnboardingLayout({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex flex-col items-center min-h-screen">
        <header className="w-full max-w-5xl px-6 py-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Nexora</span>
          </div>
        </header>
        <main className="flex-1 w-full max-w-5xl px-6 pb-12">{children}</main>
      </div>
    </div>
  );
}
