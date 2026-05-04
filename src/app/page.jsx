"use client";

import React, { useState, useEffect } from "react";
import Cosciworklogo from "@/components/cosciworklogo";
import JoinEvent from "@/components/joinevent";
import Countingscan from "@/components/countingscan";
import ScanQRCode from "@/components/scanqrcode";
import RewardModal from "@/components/rewardmodal";
import MuseumBackground from "@/components/museumbg";
import RewardCard from "@/components/rewardcard";

export default function Home() {
  const [booths, setBooths] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scanned, setScanned] = useState([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null); // ✅ แก้ตรงนี้

  const [selectedBooth, setSelectedBooth] = useState(null);
  const [showReward, setShowReward] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // โหลด user จาก localStorage
  useEffect(()=>{
    const savedUserId=localStorage.getItem("user_id");
    const saved=JSON.parse(localStorage.getItem("scanned_booths"))
    const adminLogged = localStorage.getItem("admin_logged_in") === "true";

    if(savedUserId) setUser({id:Number(savedUserId)});
    setScanned(saved ?? []);
    setIsAdmin(adminLogged);
  },[])

  useEffect(() => {
    localStorage.setItem("scanned_booths", JSON.stringify(scanned));
  }, [scanned]);

  // ✅ โหลด booths
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/booths`
        );
        const data = await res.json();

        if (data.status === "success") {
          setBooths(data.data);
        } else {
          setError(data.message);
        }
      } catch (err) {
        console.error(err);
        setError("เชื่อม server ไม่ได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  //Sync DB
  useEffect(() => {
    if (!user) return;
  
    const fetchProgress = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/progress/${user.id}`
        );
        const data = await res.json();

        const dbScanned=data.scanned??[];
  
        if (data.scanned) {
          const local=JSON.parse(localStorage.getItem("scanned_booths"));
          const merge=[...new Set([...local,...dbScanned])]
          setScanned(merge);
          localStorage.setItem("scanned_booths", JSON.stringify(merge));
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchProgress();
  }, [user]);

  const allDone = booths.length > 0 && booths.every(b =>
    b.boothnum && (scanned ?? []).map(String).includes(String(b.boothnum))
  );

  useEffect(() => {
    if (allDone) setShowReward(true);
  }, [allDone]);

  if (isLoading) {
    return <div className="text-center p-4">กำลังโหลด...</div>;
  }

  return (
    <>
    <MuseumBackground/>
    <div className="flex flex-col min-h-screen">
      <JoinEvent
        onJoinSuccess={(data) => {
          // ✅ แก้ตรงนี้
          setUser({ id: data.user_id });
          localStorage.setItem("user_id", data.user_id);
        }}
      >
        <Cosciworklogo />
        <div className="flex justify-center px-5">
          <Countingscan count={scanned.length} />
        </div>

        <div className="section-title">
          <span>The Gallery</span>
        </div>
        
        <div className="flex justify-center px-5">
          <div className="grid grid-cols-2 gap-3 w-full max-w-sm">
            {booths.map((b, i) => {
              const done = b.boothnum && scanned.map(String).includes(String(b.boothnum));
              const num = String(i + 1).padStart(2, "0");

              return (
                <div
                  key={b.id||i}
                  className={`relative rounded overflow-hidden aspect-3/4 transition-all duration-700 ${done ? "cursor-pointer" : "cursor-default"}`}

                  onClick={()=>done&&setSelectedBooth(b)}
                  style={{
                    border: done
                      ? "1px solid rgba(201,169,110,0.4)"
                      : "1px solid rgba(201,169,110,0.15)",
                    boxShadow: done
                      ? "0 0 20px rgba(201,169,110,0.15), inset 0 0 40px rgba(0,0,0,0.3)"
                      : "inset 0 0 60px rgba(0,0,0,0.5)",
                  }}
                >
                  {/* image */}
                  {b.url ? (
                    <img
                      src={b.url}
                      alt={b.boothname}
                      loading="lazy" 
                      className={`absolute w-full h-full object-cover transition-all duration-700 ${
                        done ? "grayscale-0 brightness-100" : "grayscale brightness-[0.15]"
                      }`}
                    />
                  ) : (
                    <div className="absolute w-full h-full" style={{ background: "linear-gradient(135deg,#2a1f0e,#1a1208,#0d0a05)" }}/>
                  )}

                   {/* Overlay */}
                  <div
                    className="absolute inset-0 z-2 transition-all duration-700"
                    style={{
                      background: done
                        ? "linear-gradient(180deg,rgba(0,0,0,0) 40%,rgba(0,0,0,0.75) 100%)"
                        : "linear-gradient(180deg,rgba(201,169,110,0.08) 0%,rgba(10,8,5,0.6) 60%,rgba(10,8,5,0.85) 100%)",
                    }}
                  />
                  {/* Lock (ยังไม่ได้ scan) */}
                  {!done && (
                    <div className="absolute inset-0 z-[4] flex flex-col items-center justify-center gap-1.5">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center"
                        style={{
                          border: "1px solid rgba(201,169,110,0.12)",
                          background: "rgba(0,0,0,0.5)",
                          backdropFilter: "blur(4px)",
                          color: "rgba(201,169,110,0.15)",
                          fontSize: "1rem",
                        }}
                      >
                        🔒
                      </div>
                      <span
                        className="font-serif text-xs"
                        style={{ color: "rgba(201,169,110,0.12)" }}
                      >
                        No.{num}
                      </span>
                    </div>
                  )}

                  {/* Spotlight (เฉพาะ done) */}
                  {done && (
                    <div
                      className="absolute z-3 pointer-events-none"
                      style={{
                        top: "-20%", left: "50%", transform: "translateX(-50%)",
                        width: "80%", height: "60%",
                        background: "radial-gradient(ellipse,rgba(201,169,110,0.08) 0%,transparent 70%)",
                      }}
                    />
                  )}

              {/* Done Badge */}
              {done && (
                          <>
                            {/* เช็คมาร์ค */}
                            <div className="absolute top-2 right-2 z-5 w-6 h-6 rounded-full flex items-center justify-center"
                              style={{ background: "rgba(201,169,110,0.2)", border: "1px solid rgba(201,169,110,0.4)" }}>
                              <span className="text-[#c9a96e] text-xs">✓</span>
                            </div>

                            {/* ดูสมาชิก */}
                            <div className="absolute top-2 left-2 z-5 flex items-center gap-1 px-2 py-1 rounded text-xs"
                              style={{ background: "rgba(0,0,0,0.5)", color: "rgba(201,169,110,0.8)" }}>
                              👥 ดูสมาชิก
                            </div>
                          </>
                        )}

                  {/* Text Bottom */}
                  <div className="absolute bottom-0 left-0 right-0 z-5 p-2.5">
                    {done ? (
                      <>
                        <p className="text-xs font-serif tracking-widest uppercase mb-0.5"
                          style={{ color: "rgba(201,169,110,0.5)" }}>
                          EXHIBIT NO.{num}
                        </p>
                        <p className="text-white text-sm font-serif font-bold leading-tight">{b.boothname}</p>
                        <p className="text-xs font-serif italic mt-0.5" style={{ color: "rgba(201,169,110,0.6)" }}>
                          เยี่ยมชมแล้ว
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs font-serif tracking-widest uppercase mb-0.5"
                          style={{ color: "rgba(201,169,110,0.12)" }}>
                          EXHIBIT NO.{num}
                        </p>
                        <p className="text-sm font-serif leading-tight" style={{ color: "rgba(201,169,110,0.2)" }}>
                          {b.boothname}
                        </p>
                        <p className="text-xs font-serif italic mt-0.5" style={{ color: "rgba(201,169,110,0.15)" }}>
                          ยังไม่ได้เยี่ยมชม
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {allDone && (
          <div className="text-center text-green-400 font-bold">
            🎉 ครบทุกบูธแล้ว!
          </div>
        )}
      </JoinEvent>

 {/* ── Modal ── */}
 {selectedBooth && (
        <div
          className="fixed inset-0 z-90 flex items-center justify-center bg-black/70"
          onClick={() => setSelectedBooth(null)} // ← กดพื้นหลังปิด
        >
          <div
            className="bg-[#0f0c07] border border-[#c9a96e]/30 rounded-2xl p-6 w-[85%] max-w-sm mx-auto"
            onClick={(e) => e.stopPropagation()} // ← กันปิดตอนกด modal
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[#c9a96e]/50 text-xs tracking-widest uppercase font-serif mb-1">
                  สมาชิกบูธ
                </p>
                <h2 className="text-white font-serif text-xl font-bold">
                  {selectedBooth.boothname}
                </h2>
              </div>
              <button
                onClick={() => setSelectedBooth(null)}
                className="text-white/40 hover:text-white text-xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Members */}
            <div className="flex flex-col gap-2">
              {selectedBooth.members
                ? selectedBooth.members.split("||").map((name, i) => {
                    const ig = selectedBooth.instagrams?.split("||")[i];
                    return (
                      <div
                        key={i}
                        className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-3"
                      >
                        <span className="text-[#c9a96e] font-serif">{i + 1}.</span>
                        <div className="flex flex-col">
                          <span className="text-white text-sm">{name}</span>
                          {ig && (
                            <a
                              href={`https://instagram.com/${ig.replace("@", "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#c9a96e]/60 text-xs hover:text-[#c9a96e] transition-colors"
                            >
                              @{ig.replace("@", "")}
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })
                : <p className="text-white/40 text-sm text-center">ไม่มีข้อมูลสมาชิก</p>
  }
</div>

          </div>
        </div>
      )}
      
          <RewardCard
        scanned={scanned}
        total={booths.length}
        onOpen={() => setShowReward(true)}
      />
      <div className="flex justify-center mt-6 mb-8">
        {(user || isAdmin) && (
          <ScanQRCode
            userId={user?.id ?? 0} // ← admin ไม่มี user_id ส่ง 0 ไป
            onScanComplete={(data) => {
              if (data.boothnum === "__ADMIN__") {
                const allBoothnums = booths.map(b => String(b.boothnum));
                setScanned(allBoothnums);
                localStorage.setItem("scanned_booths", JSON.stringify(allBoothnums));
                return;
              }
              setScanned((prev) => [...new Set([...prev, data.boothnum])]);
            }}
          />
        )}
      </div>

      <RewardModal
        isOpen={showReward}
        onClose={() => setShowReward(false)}
        userId={user?.id ?? 1}  // ← admin ใช้ id = 1
        scanned={scanned}
        total={booths.length}
      />
    </div>
    </>
  );
}