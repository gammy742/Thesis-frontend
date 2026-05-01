"use client"

import {React,useEffect,useState} from 'react'
import Link from 'next/link';
import{useRouter} from'next/navigation'


export default function page() {

    const[password,setPassword]=useState("");
    const[message,setMessage]=useState("");
    const router = useRouter();

    const handleSubmit = async(e)=>{
        e.preventDefault()

        try{
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/login`,{
                method:'POST',
                headers:{'Content-Type': 'application/json'},
                body:JSON.stringify({password: password})
            });

            const data = await response.json();
            if(data.status === "success"){
                localStorage.setItem("admin_logged_in","true");
                setMessage({ type: "success", text: data.message })

                router.push('/dashboard')
            }else{
                setMessage({ type: "error", text: data.message })
            }
        }catch(error){
            console.error("Login error:", error);
            setMessage({ type: "error", text: "เกิดข้อผิดพลาด กรุณาลองใหม่" })
        }
    }
      
  return (
    <>
    <form onSubmit={handleSubmit} className="flex bg-[rgba(0,0,0,0.92)] w-lvw z-50 fixed items-center p-24 justify-center inset-0" id="adminOverlay">
        <div className={`relative overflow-hidden w-full max-w-[320px] rounded-[20px] 
            bg-linear-to-b from-[#130f06] to-[#0a0805] 
            border border-[#C9A96E]/20 py-8 px-7 text-center 
            animate-[:popIn_0.4s_cubic-bezier(0.34,1.56,0.64,1)]
            before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px
            before:bg-linear-to-r before:from-transparent before:via-[#C9A96E]/50 before:to-transparent
            `}
        >
            <h1 className="mb-3 text-4xl ">🔑</h1>
            <h2 className="font-serif text-xl text-[#f0e6d3] mb-1">Admin Access</h2>
            <p className="font-serif text-[0.8rem] text-[#555] mb-6 italic">กรอก Admin ID เพื่อเข้าระบบ</p>
            <label htmlFor ="password" className='flex flex-col'>
                <input
                    className="w-full mb-3 p-[14px_16px]
                    bg-white/5 border border-[#C9A96E]/20 rounded-sm
                    font-serif  text-[#F0E6D3] 
                    tracking-[4px] text-center
                    focus:border-[#C9A96E]/50 focus:bg-[#C9A96E]/5
                    outline-none
                    transition-colors duration-300
                    
                    placeholder:text-[#333333] 
                    placeholder:tracking-[1px] 
                    placeholder:text-[0.85rem]"
                    type="password"
                    placeholder="Enter ID"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                />

                {message && (
                            <p className={`text-sm text-center mt-2 mb-4 ${
                                message.type === "success" 
                                    ? "text-green-400" 
                                    : "text-red-400"
                            }`}>
                                {message.text}
                            </p>
                        )}
                <button type="submit" className="w-full mb-2.5 p-3.5 rounded-sm
                bg-linear-to-br from-[#C9A96E] to-[#8B6914] 
                text-[#0A0805] font-serif text-[0.95rem] font-bold tracking-[1px]
                shadow-[0_4px_16px_rgba(201,169,110,0.25)]
                transition-all duration-300 cursor-pointer
                hover:shadow-[0_6px_24px_rgba(201,169,110,0.4)] hover:-translate-y-px
                active:scale-[0.97]" >
                    เข้าสู่ระบบ
                </button>
                <Link href="/">
                    <button type="submit" className="
                        w-full p-3 rounded-sm bg-transparent
                        border border-white/5 text-[#444444]
                        font-serif text-[0.85rem] cursor-pointer
                        transition-all duration-300
                        hover:border-[#333333] hover:text-[#666666]
                    " >
                        ยกเลิก
                    </button>
                </Link>
            </label>
            
        </div>
    </form>
    </>
  )
}
