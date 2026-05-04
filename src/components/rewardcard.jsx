"use client";

export default function RewardCard({ scanned = [], total = 10, onOpen }) {
  const allDone = scanned.length >= total;

  return (
    <div className="flex flex-col items-center justify-center py-8 px-6 text-center">

      {/* ? Circle */}
      <div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{
          border: "1px solid rgba(201,169,110,0.2)",
          background: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
        }}
      >
        <span
          className="font-serif text-2xl font-bold"
          style={{ color: "rgba(201,169,110,0.4)" }}
        >
          {allDone ? "🏆" : "?"}
        </span>
      </div>

      {/* Title */}
      <h2
        className="font-serif text-xl font-bold mb-3"
        style={{ color: "rgba(240,230,211,0.85)" }}
      >
        Special Exhibition
      </h2>

      {/* Subtitle */}
      <p
        className="font-serif text-sm leading-relaxed mb-6"
        style={{ color: "rgba(201,169,110,0.35)" }}
      >
        {allDone ? (
          <>แตะเพื่อรับรางวัล</>
        ) : (
          <>เยี่ยมชมครบทุกบูถ<br />เพื่อปลดล็อค</>
        )}
      </p>

      {/* Dots */}
      <div className="flex gap-2 flex-wrap justify-center mb-4">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="w-2.5 h-2.5 rounded-full transition-all duration-500"
            style={{
              background: i < scanned.length
                ? "rgba(201,169,110,0.8)"
                : "rgba(201,169,110,0.15)",
              boxShadow: i < scanned.length
                ? "0 0 6px rgba(201,169,110,0.4)"
                : "none",
            }}
          />
        ))}
      </div>

      {/* Counter */}
      <p
        className="font-serif text-sm mb-6"
        style={{ color: "rgba(201,169,110,0.3)" }}
      >
        {scanned.length} of {total} visited
      </p>

      {/* ปุ่มรับรางวัล เฉพาะครบแล้ว */}
      {allDone && (
        <button
          onClick={onOpen}
          className="px-8 py-3 rounded-xl font-serif font-bold text-[#0a0805] text-sm transition-all duration-300 active:scale-95"
          style={{
            background: "linear-gradient(135deg,#c9a96e,#8B6914,#c9a96e)",
            boxShadow: "0 4px 20px rgba(201,169,110,0.3)",
          }}
        >
          🎁 รับรางวัล
        </button>
      )}
    </div>
  );
}