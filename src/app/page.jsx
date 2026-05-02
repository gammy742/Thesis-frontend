"use client";

import React from "react";
import { useState,useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Cosciworklogo from "@/components/cosciworklogo";
import MuseumBackground from "@/components/museumbg";
import Countdown from "@/components/countdown";

export default function Home() {
  const [booths, setBooths] = useState([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [scanned, setScanned] = useState([1, 3]);

  useEffect(()=>{
    const fetchData=async()=>{
      try{
        const response =await fetch(`${process.env.NEXT_PUBLIC_API_URL}/booths`)
        const data = await response.json()

        if(data.status ==="success"){
          setBooths(data.data)
          console.log(data)
        }else{
            setStatus(result.message)
        }

      }catch(error){
          console.error("Error fetching countdown API:", error);
          setError("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
      }finally{
        setIsLoading(false);// ปิดสถานะโหลดข้อมูล
      }
    }
    fetchData();

  },[])
  
  if (isLoading) {
    return <div className="text-center p-4">กำลังโหลดข้อมูล...</div>;
  }
  const allDone = scanned.length >= 10;
  return (
    <>
      <Cosciworklogo/>

      {/*Boothcard Section*/}
      <div className="section-title"><span>The Gallery</span></div>
      <div className="grid grid-cols-2 gap-4 p-4">
        {booths.map((b,i)=>{
          const done=scanned.includes(b.id)

          return(
            <div key={b.id ||i} className="relative overflow-hidden h-56 rounded-sm border border-[#c9a96e]/20">
              {/*image bg */}
              {b.url ?(
                <img src={b.url} alt={b.boothname}  className={`absolute inset-0 w-full h-full object-cover transition-[filter,transform] duration-700 ease-in-out
                  ${done ? 'scale-100 grayscale-0' : 'scale-105 grayscale blur-sm brightness-60'}`}/>
                ):(
                  <div className="absolute inset-0 bg-[#1a1408] z-0" />
                )
              }

              {/* Overlay ตอน lock */}
              {!done && (
                <div className="absolute inset-0 z-10 bg-black/60 backdrop-blur-[2px]" />
              )}

              {/* ไอคอนล็อค */}
              {!done && (
                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-1">
                  <div className="w-10 h-10 rounded-full bg-black/40 border border-[#c9a96e]/20 flex items-center justify-center text-xl">
                    🔒
                  </div>
                  <span className="text-[#c9a96e]/50 text-xs font-serif">No.{String(i+1).padStart(2,'0')}</span>
                </div>
              )}

              {/* ✓ ตอน done */}
              {done && (
                <div className="absolute top-2 right-2 z-20 text-green-400 text-2xl font-bold">✓</div>
              )}

              {/* ข้อมูลล่าง */}
              <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/50 px-3 py-2">
                <p className="text-[#c9a96e] text-[0.65rem] tracking-[2px] font-serif uppercase">
                  Exhibit No.{String(i+1).padStart(2,'0')}
                </p>
                <p className="text-white text-sm font-bold font-serif truncate">{b.boothname}</p>
                <p className="text-[#c9a96e]/50 text-xs font-serif italic">
                  {done ? 'เยี่ยมชมแล้ว ✓' : 'ยังไม่ได้เยี่ยมชม'}
                </p>
              </div>


            </div>
          )
        })}
      </div>
     
      
      {/*  ถ้าไม่มีข้อมูล */}
      {booths.length === 0 && <p>ยังไม่มีข้อมูลบูธในขณะนี้</p>}
    </>
  );
}

/**position:relative;z-index:2;
    max-width:430px;margin:0 auto;
    padding:0 18px 150px; */