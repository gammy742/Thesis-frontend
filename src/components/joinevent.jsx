"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JoinEvent({ children, onJoinSuccess }) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [err, setErr] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState(null);

  const [isChecking, setIsChecking] = useState(true);

  // ✅ โหลด user จาก localStorage
  useEffect(() => {
    const checkAdmin = localStorage.getItem("admin_logged_in") === "true";
    if (checkAdmin && window.location.pathname !== "/admin") {
      setIsAdmin(true);
      setIsChecking(false);
      return;
    }

    const savedId = localStorage.getItem("user_id");
    const savedName = localStorage.getItem("username");

    if (savedId && savedName) {
      setUser({
        id: Number(savedId),
        name: savedName,
        loginAt: new Date().toLocaleTimeString(),
      });
    }
    setIsChecking(false);
  }, []);

  // ✅ logout
  const handleLogout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    setUser(null);
  };

  // ✅ join API
  const joinPage = async () => {
    if (!name.trim()) {
      setErr(true);
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name }),
        }
      );

      const data = await response.json();

      if (data.success) {
        const userData = {
          id: data.data.id,
          name: data.data.name,
          loginAt: new Date().toLocaleTimeString(),
        };

        localStorage.setItem("user_id", userData.id);
        localStorage.setItem("username", userData.name);

        setUser(userData);
        setShowAlert(true);

        // 🔥 สำคัญ: แจ้ง parent (Home)
        onJoinSuccess?.({
          user_id: userData.id,
        });
      } else {
        setErr(true);
        alert(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
    }
  };

  const initials = user?.name?.charAt(0)?.toUpperCase() || "?";

  if (isChecking) return null;
  // ✅ admin → ข้าม
  if (isAdmin) return <>{children}</>;

  // ✅ login แล้ว → แสดงหน้า main
  if (user) return <>{children}</>;

  // ❌ ยังไม่ login → แสดงฟอร์ม
  return (
    <div className="min-h-screen bg-[#0a0804] flex flex-col items-center justify-center py-12 px-6 font-mono relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-[repeating-linear-gradient(0deg,transparent,transparent_39px,#c9a96e08_39px,#c9a96e08_40px)]" />

      <p className="text-[9px] tracking-[5px] text-[#c9a96e80] uppercase mb-2">
        Cosci Work · Museum
      </p>
      <h1 className="text-[9px] tracking-[5px] text-[#c9a96e80] uppercase mb-2">
        เข้าสู่ระบบ
      </h1>

      <div className="flex items-center gap-3 w-full max-w-75 mb-7">
        <div className="flex-1 h-px bg-[#c9a96e35]" />
        <span className="text-[#c9a96e] text-[10px]">✦</span>
        <div className="flex-1 h-px bg-[#c9a96e35]" />
      </div>

      <div className="w-full flex flex-col items-center">
        <div className="w-full max-w-75 mb-5">
          <label className="block text-[9px] tracking-[3px] text-[#c9a96e80] uppercase mb-2">
            ชื่อของคุณ
          </label>

          <input
            className={`w-full bg-transparent border-0 border-b py-2.5 text-[#f0e8d0] outline-none ${
              err ? "border-red-400" : "border-[#c9a96e40]"
            }`}
            type="text"
            placeholder="กรอกชื่อ"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErr(false);
            }}
          />

          {err && (
            <p className="text-red-400 text-xs mt-1">
              กรุณากรอกชื่อก่อนเข้าใช้งาน
            </p>
          )}
        </div>

        <button
          onClick={joinPage}
          className="w-full max-w-75 p-3 bg-[#c9a96e] text-[#0a0804] text-sm font-bold"
        >
          เข้าร่วม
        </button>

        {showAlert && (
          <div className="w-full max-w-75 mt-5 p-4 border border-[#c9a96e35]">
            <p className="text-[#c9a96e] text-xs">ยินดีต้อนรับ</p>
            <p className="text-lg text-white">{name}</p>
          </div>
        )}
      </div>
    </div>
  );
}