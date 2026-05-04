// components/loadingpage.jsx
export default function LoadingScreen() {
    return (
      <div
        className="fixed inset-0 flex flex-col items-center justify-center"
        style={{ background: "linear-gradient(160deg, #0d0a05 0%, #1a1208 50%, #0d0a05 100%)" }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(201,169,110,0.07) 0%, transparent 65%)",
          }}
        />
  
        {/* Frame */}
        <div
          className="relative flex flex-col items-center px-10 py-12"
          style={{
            border: "1px solid rgba(201,169,110,0.2)",
            boxShadow: "0 0 60px rgba(201,169,110,0.05), inset 0 0 40px rgba(0,0,0,0.4)",
          }}
        >
          {/* Corner TL */}
          <div
            className="absolute top-0 left-0 w-5 h-5"
            style={{
              borderTop: "1px solid rgba(201,169,110,0.6)",
              borderLeft: "1px solid rgba(201,169,110,0.6)",
            }}
          />
          {/* Corner TR */}
          <div
            className="absolute top-0 right-0 w-5 h-5"
            style={{
              borderTop: "1px solid rgba(201,169,110,0.6)",
              borderRight: "1px solid rgba(201,169,110,0.6)",
            }}
          />
          {/* Corner BL */}
          <div
            className="absolute bottom-0 left-0 w-5 h-5"
            style={{
              borderBottom: "1px solid rgba(201,169,110,0.6)",
              borderLeft: "1px solid rgba(201,169,110,0.6)",
            }}
          />
          {/* Corner BR */}
          <div
            className="absolute bottom-0 right-0 w-5 h-5"
            style={{
              borderBottom: "1px solid rgba(201,169,110,0.6)",
              borderRight: "1px solid rgba(201,169,110,0.6)",
            }}
          />
  
          {/* Icon */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
            style={{
              background: "radial-gradient(circle, rgba(201,169,110,0.15) 0%, rgba(0,0,0,0) 70%)",
              border: "1px solid rgba(201,169,110,0.25)",
            }}
          >
            <span style={{ fontSize: "1.8rem" }}>🏛️</span>
          </div>
  
          {/* Title */}
          <p
            className="font-serif tracking-[0.3em] uppercase text-xs mb-1"
            style={{ color: "rgba(201,169,110,0.4)" }}
          >
            Welcome to
          </p>
          <h1
            className="font-serif text-2xl font-bold tracking-widest mb-6 text-center"
            style={{ color: "rgba(201,169,110,0.9)" }}
          >
            The Gallery
          </h1>
  
          {/* Divider */}
          <div className="flex items-center gap-3 mb-8 w-48">
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(201,169,110,0.2)" }}
            />
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: "rgba(201,169,110,0.4)" }}
            />
            <div
              className="flex-1 h-px"
              style={{ background: "rgba(201,169,110,0.2)" }}
            />
          </div>
  
          {/* Spinner dots */}
          <div className="flex gap-2 mb-5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "rgba(201,169,110,0.7)",
                  animation: `museumPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
  
          {/* Status text */}
          <p
            className="font-serif text-xs tracking-[0.2em] uppercase"
            style={{ color: "rgba(201,169,110,0.35)" }}
          >
            กำลังเปิดประตูพิพิธภัณฑ์...
          </p>
        </div>
  
        {/* Bottom tagline */}
        <p
          className="absolute bottom-8 font-serif text-xs tracking-widest"
          style={{ color: "rgba(201,169,110,0.2)" }}
        >
          COSCIWORK EXHIBITION
        </p>
  
        {/* Animation */}
        <style>{`
          @keyframes museumPulse {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50%       { opacity: 1;   transform: scale(1.2); }
          }
        `}</style>
      </div>
    );
  }