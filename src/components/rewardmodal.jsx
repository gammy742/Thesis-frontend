"use client";
import { useState, useEffect } from "react";

export default function RewardModal({ isOpen, onClose, userId, scanned = [], total = 10 }) {
  const [claimed, setClaimed] = useState(false);
  const [claimedTime, setClaimedTime] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (!isOpen) return;
    const lastClaimed = localStorage.getItem("reward_claimed_date");
    if (lastClaimed === today) {
      setClaimed(true);
      const t = localStorage.getItem("reward_claimed_time");
      if (t) setClaimedTime(new Date(t).toLocaleString("th-TH"));
    } else {
      setClaimed(false);
      setClaimedTime(null);
    }
  }, [isOpen]);

  const claimReward = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reward/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId }),
      });
      const data = await res.json();
      if (data.status === "success" || data.status === "warning") {
        const now = new Date().toISOString();
        localStorage.setItem("reward_claimed_date", today);
        localStorage.setItem("reward_claimed_time", now);
        setClaimed(true);
        setClaimedTime(new Date(now).toLocaleString("th-TH"));
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/70"
      onClick={onClose}
    >
      <div
        className="bg-[#0f0c07] border border-[#c9a96e]/30 rounded-t-3xl w-full max-w-md p-6 pb-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mb-6" />

        {!claimed ? (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="text-5xl">🏆</div>
            <h2 className="text-2xl font-bold font-serif"
              style={{
                background: "linear-gradient(90deg,#c9a96e,#e8cc99,#c9a96e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundSize: "200%",
              }}>
              ยินดีด้วย
            </h2>
            <p className="text-white/60 text-sm">คุณเยี่ยมชมครบทุกบูถแล้ว</p>
            <div className="text-[#c9a96e]/40 text-lg">✦</div>

            {/* Coupon */}
            <div className="w-full border border-[#c9a96e]/30 rounded-2xl p-4 bg-white/5">
              <p className="text-[#c9a96e]/50 text-xs tracking-widest uppercase font-serif mb-2">
                Exhibition Reward
              </p>
              <p className="text-white font-serif text-2xl font-bold tracking-widest">
                COEXIST2026
              </p>
            </div>

            {/* Info */}
            <div className="text-white/50 text-sm text-left w-full flex flex-col gap-1.5">
              <p>📍 รับของรางวัลที่บูถแลกรางวัล</p>
              <p>🕐 ภายในวันงานเท่านั้น</p>
              <p>📋 แสดงหน้าจอให้เจ้าหน้าที่</p>
            </div>

            <button onClick={claimReward}
              className="w-full py-4 rounded-xl font-serif font-bold text-[#0a0805] mt-2"
              style={{ background: "linear-gradient(135deg,#c9a96e,#8B6914,#c9a96e)" }}>
              รับทราบ — ไปรับของรางวัล
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-20 h-20 rounded-full border-4 border-[#c9a96e] flex items-center justify-center">
              <svg viewBox="0 0 52 52" className="w-12 h-12">
                <path fill="none" stroke="#c9a96e" strokeWidth="4"
                  strokeLinecap="round" strokeLinejoin="round"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h2 className="text-white font-serif text-2xl font-bold">รับรางวัลแล้ว</h2>
            <p className="text-white/50 text-sm">ขอบคุณที่ร่วมกิจกรรม!</p>
            <div className="text-[#c9a96e]/40 text-lg">✦</div>

            <div className="flex items-center gap-3 bg-white/5 border border-[#c9a96e]/20 rounded-2xl px-5 py-4 w-full">
              <div className="text-3xl">🏛️</div>
              <div className="text-left">
                <p className="text-white font-serif font-bold">Coexist · COSCI</p>
                <p className="text-white/40 text-xs">Museum of Student Innovation</p>
              </div>
            </div>

            <div className="border-2 border-dashed border-[#c9a96e]/40 rounded-2xl px-8 py-4 w-full">
              <p className="text-[#c9a96e] font-bold text-xl tracking-widest font-serif">CLAIMED</p>
              {claimedTime && <p className="text-white/40 text-xs mt-1">{claimedTime}</p>}
            </div>

            <div className="flex gap-3 text-[#c9a96e]/40 text-lg">
              {["✦","·","✦","·","✦"].map((s, i) => <span key={i}>{s}</span>)}
            </div>

            <button onClick={onClose}
              className="w-full py-4 rounded-xl font-serif font-bold text-[#0a0805]"
              style={{ background: "linear-gradient(135deg,#c9a96e,#8B6914,#c9a96e)" }}>
              ตกลง
            </button>
          </div>
        )}
      </div>
    </div>
  );
}