import Image from "next/image";

export const SplashScreen = () => {
  return (
    // TAILWIND: Using a sleek gradient background and centering everything
    <div className="flex flex-col items-center justify-center min-h-screen bg-linear-to-br from-blue-600 to-indigo-900 text-white">
      {/* Logo Container: Added 'overflow-hidden' just in case your logo has square corners */}
      <div className="w-24 h-24 mb-6 bg-white/20 backdrop-blur-md rounded-3xl shadow-2xl flex items-center justify-center animate-pulse border border-white/30 overflow-hidden">
        {/* 2. Replace the span with the Next.js Image component */}
        <Image
          src="/icon-512.png" // <-- CHANGE THIS if you named your file something else!
          alt="Habit Tracker Logo"
          width={96} // 96px matches Tailwind's w-24 (24 * 4px)
          height={96} // Matches h-24
          className="object-contain p-2" // p-2 gives the logo a little breathing room inside the glass box
        />
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
