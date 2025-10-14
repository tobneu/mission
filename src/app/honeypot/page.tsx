export default function HoneypotPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-8 bg-black">
      <h1 className="text-6xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-yellow-500 animate-pulse">Gotcha!</h1>
      <p className="text-2xl mb-8 text-gray-300">Sieht so aus, als hättest du versucht, das System auszutricksen...</p>
      <div className="aspect-w-16 aspect-h-9 w-full max-w-3xl shadow-2xl shadow-red-500/50 rounded-lg overflow-hidden">
        <iframe width="560" height="315" src="https://www.youtube.com/embed/FoD0rTRGaNE?autoplay=1" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>
      </div>
    </div>
  );
}
