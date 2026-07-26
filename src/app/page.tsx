export default function Home() {
  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-center bg-black text-white overflow-hidden px-4 sm:px-8 select-none">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] sm:w-[750px] sm:h-[750px] bg-gradient-to-tr from-orange-600/20 via-orange-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Container */}
      <div className="relative z-10 max-w-7xl w-full flex flex-col items-center justify-center text-center py-12">
        {/* Line 1: Algobic\ in Orange */}
        <h1 className="text-6xl sm:text-8xl md:text-[9rem] lg:text-[11rem] font-black tracking-tight leading-none bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500 bg-clip-text text-transparent drop-shadow-[0_0_50px_rgba(249,115,22,0.35)]">
          Algobic\
        </h1>

        {/* Line 2: by LogixLoops in smaller white text */}
        <h2 className="mt-4 sm:mt-6 text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-normal text-zinc-100 drop-shadow-sm">
          by LogixLoops
        </h2>

        {/* Line 3: Coming soon */}
        <p className="mt-8 sm:mt-12 text-xl sm:text-3xl md:text-4xl lg:text-5xl font-medium tracking-[0.3em] uppercase text-zinc-400">
          Coming soon
        </p>
      </div>

      {/* Decorative accent */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent rounded-full" />
    </main>
  );
}
