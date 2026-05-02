import "./musuembg.css"
export default function MuseumBackground() {
    return (
      <>
            <div className="bigBG">
                <div className="museum-bg"></div>
                <div className="vignette"></div>
                <div className="light-beam"></div>
                <div className="museum-frame-top"></div>
                <div className="museum-frame-bottom"></div>
        
                {["co-tl", "co-tr", "co-bl", "co-br"].map((pos) => (
                    <div className={`corner-ornament ${pos}`} key={pos}>
                        <svg viewBox="0 0 60 60" fill="none">
                        <path d="M5 5 L5 25 Q5 5 25 5 Z" fill="rgba(201,169,110,0.6)" />
                        <path d="M5 5 L30 5 Q5 5 5 30 Z" fill="rgba(201,169,110,0.3)" />
                        <circle cx="5" cy="5" r="2" fill="rgba(201,169,110,0.8)" />
                        </svg>
                    </div>
                ))}
            </div>
      </>
    );
  }