export const SplashScreen = () => {
  return (
    // TAILWIND: Using a sleek gradient background and centering everything
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900 text-white">
      {/* Logo Placeholder: A sleek, pulsing glassmorphism box */}
      <div className="w-24 h-24 mb-6 bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl flex items-center justify-center animate-pulse border border-white/30">
        <span className="text-4xl">✨</span>
      </div>

      <h1
        data-testid="splash-screen"
        className="text-5xl font-extrabold tracking-tight drop-shadow-lg"
      >
        Habit Tracker
      </h1>

      <p className="mt-4 text-blue-200 font-medium tracking-wide animate-pulse">
        Building a better you...
      </p>
    </div>
  );
};
