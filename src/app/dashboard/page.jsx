"use client"
import React from 'react'
import { useRouter } from 'next/navigation' 
import ProtectedRoute from '@/components/protectedroute'
import Link from 'next/link'

function page() {
    const router = useRouter()

    const handleLogout=()=>{
        localStorage.removeItem("admin_logged_in")
        router.replace("/admin"); 
    }

  return (
    <ProtectedRoute>
        <div className="admin-sheet">
                    <h1 className="admin-title">ยินดีต้อนรับสู่ระบบหลังบ้าน</h1>
                    <p>ข้อมูลความลับอยู่ที่นี่...</p>
                    <button onClick={handleLogout}>logout</button>
                </div>

        <Link href="/event">
            <button className="p-3 bg-[#C9A96E] text-black rounded hover:opacity-80">
            👀 กลับไปดูหน้าเว็บหลัก (หน้าซ่อน)
            </button>
        </Link>
    </ProtectedRoute>
  )
}

export default page