"use client"; 

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ProtectedRoute({ children }) {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);


    useEffect(() => {
        // check password from flask
        const adminStatus = localStorage.getItem("admin_logged_in");

        if (!adminStatus) {
            // ถ้าไม่มีสิทธิ์ ให้ดีดกลับไปหน้า Login
            router.replace("/admin"); 
        } else {
            // ถ้ามีสิทธิ์ ให้อนุญาตให้เข้าถึงเนื้อหาได้
            setIsAuthorized(true); 
        }
    }, [router]);

    // ระหว่างที่ระบบกำลังตรวจสอบ ให้แสดงหน้าว่างๆ หรือ Loading เพื่อไม่ให้ข้อมูลความลับกระพริบให้เห็น
    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#130f06] flex items-center justify-center">
                <p className="text-[#C9A96E] font-serif tracking-[2px]">Verifying Access...</p>
            </div>
        );
    }

    return <>{children}</>;
}