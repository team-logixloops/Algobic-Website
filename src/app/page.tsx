export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black overflow-hidden px-4 sm:px-8 select-none">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] sm:w-[800px] sm:h-[800px] bg-gradient-to-tr from-orange-600/20 via-amber-500/15 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="relative z-10 max-w-7xl w-full flex flex-col items-center justify-center text-center py-12">
        {/* Line 1: Oversized Orange Heading */}
        <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] xl:text-[11rem] font-black tracking-tight leading-none bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_60px_rgba(249,115,22,0.35)] break-words">
          Algobic\ by LogixLoops
        </h1>

        {/* Line 2: Coming Soon Subtitle */}
        <p className="mt-8 sm:mt-12 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[0.25em] sm:tracking-[0.35em] uppercase text-orange-400/90 drop-shadow-[0_0_20px_rgba(251,146,60,0.3)]">
          Coming soon
        </p>
      </div>

      {/* Subtle bottom decorative line */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent rounded-full" />
    </main>
  );
}
