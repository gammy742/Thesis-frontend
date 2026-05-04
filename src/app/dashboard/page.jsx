"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation' 
import ProtectedRoute from '@/components/protectedroute'
import Link from 'next/link'

function Page() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const isAdmin = localStorage.getItem("admin_logged_in") === "true";
    if (!isAdmin) { router.push("/"); return; }
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reward/dashboard`);
      const json = await res.json();
      if (json.status === "success") setData(json.data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    router.replace("/");
  };

  return (
    <ProtectedRoute>
      {isLoading ? (
        <div className="min-h-screen bg-[#0a0805] flex items-center justify-center text-[#c9a96e] font-serif">
          กำลังโหลด...
        </div>
      ) : (
        <div className="min-h-screen bg-[#0a0805] text-white font-serif p-6 pb-10">

          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold mb-1"
                style={{
                  background: "linear-gradient(90deg,#c9a96e,#e8cc99)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>
                Dashboard
              </h1>
              <p className="text-white/30 text-xs tracking-widest uppercase">Coexist · COSCI</p>
            </div>
            <button onClick={handleLogout}
              className="text-[#c9a96e]/40 text-xs border border-[#c9a96e]/20 px-3 py-1.5 rounded-lg hover:text-[#c9a96e]/70 transition-colors">
              ออกจากระบบ
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { label: "ผู้เข้าร่วมทั้งหมด", value: data?.total_users ?? 0, icon: "👥" },
              { label: "สแกนครบทุกบูถ", value: data?.completed_all ?? 0, icon: "🏆" },
              { label: "รับรางวัลแล้ว", value: data?.claimed_today ?? 0, icon: "🎁" },
              { label: "ยังไม่รับรางวัล", value: (data?.completed_all ?? 0) - (data?.claimed_today ?? 0), icon: "⏳" },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 border border-[#c9a96e]/20 rounded-2xl p-4">
                <div className="text-2xl mb-1">{s.icon}</div>
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-white/40 text-xs mt-1">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Booth Stats */}
          <div className="bg-white/5 border border-[#c9a96e]/20 rounded-2xl p-4 mb-4">
            <p className="text-[#c9a96e]/50 text-xs tracking-widest uppercase mb-4">
              สถิติแต่ละบูถ
            </p>
            <div className="flex flex-col gap-3">
              {data?.booth_stats?.map((b, i) => {
                const percent = data.total_users > 0
                  ? Math.round((b.scan_count / data.total_users) * 100) : 0;
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-white/80">{b.boothname}</span>
                      <span className="text-[#c9a96e]">{b.scan_count} คน ({percent}%)</span>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${percent}%`,
                          background: "linear-gradient(90deg,#8B6914,#c9a96e)"
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <button onClick={fetchDashboard}
            className="w-full py-3 rounded-xl text-sm font-bold text-[#0a0805] mb-3"
            style={{ background: "linear-gradient(135deg,#c9a96e,#8B6914,#c9a96e)" }}>
            🔄 รีเฟรช
          </button>

          <Link href="/">
            <button className="w-full py-3 rounded-xl text-sm font-bold border border-[#c9a96e]/20 text-[#c9a96e]/50 hover:text-[#c9a96e]/80 transition-colors">
              👀 ดูหน้าเว็บหลัก
            </button>
          </Link>

        </div>
      )}
    </ProtectedRoute>
  );
}

export default Page