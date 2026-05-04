"use client";

import React, { useState, useCallback, useRef } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";

import "./scanqrcode.css"

// ✅ boothnum ที่มีในระบบ (ตรงกับ QR ที่ปริ้น)
const VALID_BOOTHS = [
  "BOOTH_01", "BOOTH_02", "BOOTH_03", "BOOTH_04", "BOOTH_05",
  "BOOTH_06", "BOOTH_07", "BOOTH_08", "BOOTH_09", "BOOTH_10",
];

export default function ScanQRCode({ userId, onScanComplete }) {
  const [showScanner, setShowScanner] = useState(false);
  const [msg, setMsg]                 = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [debugText, setDebugText]     = useState("");
  const isProcessingRef               = useRef(false);

  // Fetch Api
  const saveScan = async (boothnum) => {
    console.log("Sending:", { user_id: userId, booth_id: boothnum });
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/scan`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id:  userId,
        booth_id: boothnum, 
      }),
    });
    return res.json();
  };

  //Admin
  const AdminQr=process.env.NEXT_PUBLIC_ADMIN_QR;
  // Scan
  const handleScan = useCallback(
    async (results) => {
        const raw = Array.isArray(results)
        ? results?.[0]?.rawValue
        : results?.rawValue;
      const text =raw;
      if (!text || isProcessingRef.current) return;

      const boothnum = text.trim().toUpperCase();
      setDebugText(`QR: "${boothnum}"`); // debug

      //Admin privillage
      if(boothnum===AdminQr){
        isProcessingRef.current=true;
        setIsProcessing(true);
        setMsg({ text: "🔓 Admin Mode: ปลดล็อคทุกบูถ", type: "success" });
        onScanComplete?.({boothnum:"__ADMIN__"});
        setTimeout(()=>closeScanner(),2000);
        setTimeout(()=>{
            isProcessingRef.current=false;
            setIsProcessing(false);
        },2500)

        return;
      }

      // ✅ เช็คว่า QR ตรงกับ boothnum ในระบบ
      if (!VALID_BOOTHS.includes(boothnum)) {
        setMsg({
          text: `QR นี้ไม่ใช่ของฐานกิจกรรม\n(ค่าที่ได้: "${boothnum}")`,
          type: "error",
        });
        return;
      }

      // เริ่ม process
      isProcessingRef.current = true;
      setIsProcessing(true);
      setMsg({ text: "กำลังบันทึกข้อมูล...", type: "loading" });

      try {
        const result = await saveScan(boothnum);
        console.log("API response:", result);

        if (result.status === "success") {
          setMsg({
            text:  result.message,
            type:  "success",
            extra: result.data,
          });
          onScanComplete?.(result.data);
          setTimeout(() => closeScanner(), 2500);

        }else if (result.status === "warning") {
          setMsg({ text: result.message, type: "warning" });

        }else{
          setMsg({ text: result.message, type: "error" });
        }

      } catch (err) {
        console.error(err);
        setMsg({ text: "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่", type: "error" });
      } finally {
        setTimeout(() => {
          isProcessingRef.current = false;
          setIsProcessing(false);
        }, 2500);
      }
    },
    [userId, onScanComplete]
  );

  const openScanner = () => {
    setMsg(null);
    setDebugText("");
    setShowScanner(true);
  };

  const closeScanner = () => {
    setShowScanner(false);
    setMsg(null);
    setDebugText("");
    isProcessingRef.current = false;
    setIsProcessing(false);
  };

  const msgConfig = {
    loading: { bg: "rgba(108,99,255,0.9)", icon: "⏳", spin: true  },
    success: { bg: "rgba(39,174,96,0.9)",  icon: "✅", spin: false },
    warning: { bg: "rgba(243,156,18,0.9)", icon: "⚠️", spin: false },
    error:   { bg: "rgba(231,76,60,0.9)",  icon: "❌", spin: false },
  };

  return (
    <>
      <style>{`
        @keyframes scanMove { 0%,100%{top:10%} 50%{top:85%} }
        @keyframes spin { to{transform:rotate(360deg)} }
        @keyframes slideUp {
          from{transform:translateY(20px);opacity:0}
          to{transform:translateY(0);opacity:1}
        }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        .scan-line {
          position:absolute; left:0; right:0; height:3px;
          background:linear-gradient(90deg,transparent,#fff,transparent);
          animation:scanMove 2s ease-in-out infinite; z-index:3;
        }
        .spin-icon { display:inline-block; animation:spin 1s linear infinite; }
      `}</style>

      {/* ── ปุ่มเปิด ── */}
      <button onClick={openScanner} className="scan-btn">
        <span>▣</span><span>สแกน QR Code</span>
      </button>

      {/* ── Fullscreen Scanner ── */}
      {showScanner && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 9999,
          background: "#000", display: "flex", flexDirection: "column",
          animation: "fadeIn 0.25s ease",
        }}>
          {/* กล้อง */}
          <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
            <Scanner
              onScan={handleScan}
              onError={(err) => {
                console.error(err);
                setMsg({ text: "ไม่สามารถเปิดกล้องได้ กรุณาอนุญาตการเข้าถึงกล้อง", type: "error" });
              }}
              constraints={{ facingMode: "environment" }}
              styles={{
                container: { width: "100%", height: "100%", position: "absolute", inset: 0 },
                video:     { width: "100%", height: "100%", objectFit: "cover" },
              }}
            />

            {!isProcessing && <div className="scan-line" />}

            {/* dimmer + กรอบเล็ง */}
            <div style={{
              position: "absolute", inset: 0,
              display: "flex", alignItems: "center", justifyContent: "center",
              pointerEvents: "none", zIndex: 2,
            }}>
              <div style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)",
                maskImage: "radial-gradient(ellipse 260px 260px at 50% 50%,transparent 60%,black 100%)",
                WebkitMaskImage: "radial-gradient(ellipse 260px 260px at 50% 50%,transparent 60%,black 100%)",
              }}/>
              <div style={{ position: "relative", width: "260px", height: "260px" }}>
                {[
                  { top: 0,    left: 0,  borderWidth: "4px 0 0 4px", borderRadius: "8px 0 0 0" },
                  { top: 0,    right: 0, borderWidth: "4px 4px 0 0", borderRadius: "0 8px 0 0" },
                  { bottom: 0, left: 0,  borderWidth: "0 0 4px 4px", borderRadius: "0 0 0 8px" },
                  { bottom: 0, right: 0, borderWidth: "0 4px 4px 0", borderRadius: "0 0 4px 0" },
                ].map((c, i) => (
                  <div key={i} style={{
                    position: "absolute", width: "36px", height: "36px",
                    borderColor: "#fff", borderStyle: "solid", ...c,
                  }}/>
                ))}
              </div>
            </div>

            {/* Header */}
            <div className="scan-btn.active">
              <div style={{ color: "#fff", fontSize: "18px", fontWeight: "700" }}>
                📷 สแกน QR Code
              </div>
              <button onClick={closeScanner} className="close-scan-btn">✕</button>
            </div>

            {/* hint */}
            {!msg && (
              <div style={{
                position: "absolute", bottom: "220px", left: 0, right: 0,
                textAlign: "center", color: "rgba(255,255,255,0.8)",
                fontSize: "15px", zIndex: 10,
              }}>
                จ่อกล้องไปที่ QR Code ของบูธ
              </div>
            )}

            {/* debug */}
            {debugText && (
              <div style={{
                position: "absolute", bottom: "215px",
                left: "16px", right: "16px",
                background: "rgba(0,0,0,0.8)", color: "#0ff",
                fontSize: "12px", padding: "6px 12px",
                borderRadius: "8px", textAlign: "center",
                zIndex: 10, fontFamily: "monospace",
              }}>
                {debugText}
              </div>
            )}
          </div>

          {/* Bottom */}
          <div style={{
            background: "#111", padding: "20px 24px",
            paddingBottom: "calc(20px + env(safe-area-inset-bottom))",
            display: "flex", flexDirection: "column", gap: "12px",
          }}>
            {/* สถานะ */}
            {msg && (
              <div style={{
                padding: "14px 20px", borderRadius: "14px",
                background: msgConfig[msg.type]?.bg,
                color: "#fff", fontSize: "15px", fontWeight: "600",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: "6px",
                animation: "slideUp 0.3s ease", whiteSpace: "pre-line",
                textAlign: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span className={msgConfig[msg.type]?.spin ? "spin-icon" : ""}>
                    {msgConfig[msg.type]?.icon}
                  </span>
                  {msg.text}
                </div>

                {/* ✅ แสดงข้อมูลจาก Flask */}
                {msg.extra && (
                  <div style={{
                    fontSize: "13px", opacity: 0.9,
                    borderTop: "1px solid rgba(255,255,255,0.25)",
                    paddingTop: "8px", marginTop: "4px",
                    display: "flex", flexDirection: "column", gap: "4px",
                  }}>
                    <span>👤 {msg.extra.username}</span>
                    <span>🏛️ {msg.extra.boothname} ({msg.extra.boothnum})</span>
                    <span>📊 สแกนแล้ว {msg.extra.total_scanned}/10 ฐาน</span>
                    <span>🎯 เหลืออีก {msg.extra.remaining} ฐาน</span>
                  </div>
                )}
              </div>
            )}

            <button onClick={closeScanner} style={{
              padding: "14px", borderRadius: "14px",
              border: "2px solid rgba(255,255,255,0.15)",
              background: "transparent", color: "rgba(255,255,255,0.7)",
              fontSize: "16px", fontWeight: "600", cursor: "pointer",
            }}>
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </>
  );
}