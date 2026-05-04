"use client"
import{React,useState,useEffect} from "react"

export default function Countdown(){
    const [status,setStatus]=useState('loading')
    const [eventDates,setEventDates]=useState("")
    const [timeLeft,setTimeLeft]=useState("")
    const [currentDateText,setCurrentDateText]=useState("")

    const[isAdmin,setIsAdmin]=useState(false);
    //fetch api
    useEffect(()=>{
        //check key
        const checkAdmin = localStorage.getItem("admin_logged_in") === "true";

        if(checkAdmin){
            setIsAdmin(true);
            return;
        }

        const fetchEventStatus = async()=>{
            try{
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/countdown`)
                const data = await response.json()

                if(data.is_going){
                    setStatus('ongoing')
                }else if(data.is_expired){
                    setStatus('expired')
                }else{
                    setStatus('waiting')
                    setEventDates({
                        start:new Date(data.event_start).getTime(),
                        end:new Date(data.event_end).getTime()
                    })
                }
            }catch(error){
                console.error("Error fetching countdown API:", error);
            }
        };
        fetchEventStatus();
    },[])

    //Realtime countdown
    useEffect(()=>{
        if(status !== 'waiting'||!eventDates) return;

        const thaiMonths=[
            'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
            'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
        ];

        const updateTimer=()=>{
            const now= new Date();
            const y = now.getFullYear();
            const m = now.getMonth();
            const d =now.getDate();

            setCurrentDateText(`วันนี้: ${d} ${thaiMonths[m]} ${y+543}`);

            //Calculate gap of time from api
            const diff = eventDates.start-now.getTime();

            if(diff<=0){
                //When count to 0 set to ongoing status
                setStatus('ongoing');
            }else{
                const dd = Math.floor(diff / 86400000);
                const h = Math.floor((diff % 86400000) / 3600000);
                const mi = Math.floor((diff % 3600000) / 60000);
                const s = Math.floor((diff % 60000) / 1000);

                const formattedTime = dd > 0 
                    ?`${dd} วัน ${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}:${String(s).padStart(2, '0')}`
                    :`${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}:${String(s).padStart(2, '0')}`; //Ternary Operator

                setTimeLeft(formattedTime);
                console.log("เวลาเริ่มงาน (Timestamp):", eventDates.start);
            }
        }

        updateTimer();
        const timerInterval= setInterval(updateTimer,1000);

        return () => clearInterval(timerInterval);
    },[status,eventDates])

    //Admin Permission
    if(isAdmin) return null;


    //Waiting API
    if(status === 'loading') return null;

    //Status ongoing
    if(status==='ongoing') return null;

    const isEnded = status ==='expired';

    return(
        <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-linear-to-b from-[#1c1408] to-[#0a0805] py-10 px-6 text-center overflow-y-auto'>
            <div className="text-[4rem] mb-5 animate-floatUp shrink-0">
                {isEnded? '⌛' : '🔒'}
            </div>

            <h2 className="font-serif text-[1.8rem] font-black text-white mb-2 leading-[1.3] shrink-0">
                {isEnded ? 'หมดเวลาแล้ว' : 'ยังไม่ถึงวันงาน'}
            </h2>

            <div className="font-serif text-[1rem] italic text-[#c9a96e99] mb-7.5 leading-[1.8] shrink-0">
                {isEnded ? (
                <>
                    กิจกรรมสิ้นสุดแล้ว<br />
                    ขอบคุณที่เข้าร่วมงาน 🙏
                </>
                ) : (
                <>
                    กิจกรรมนี้จัดขึ้นในวันที่<br />
                    <b style={{ color: '#c9a96e' }}>17 — 18 พฤษภาคม 2569</b>
                </>
                )}
            </div>

            <div className="flex flex-col items-center relative bg-[#c9a96e]/6 border border-[#c9a96e]/20 rounded-sm px-8 py-5 mb-7.5 mx-auto w-fit
            before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px 
            before:bg-linear-to-r before:from-transparent before:via-[#c9a96e]/40 before:to-transparent">
                <h1 className="font-serif text-[0.7rem] tracking-[3px] text-[#c9a96e]/40 uppercase mb-2">— Event Date —</h1>
                <h2 className="font-serif text-[1.3rem] text-[#c9a96e] tracking-[1px]">17 · 18 May 2026</h2>
                <p className="font-serif text-[0.85rem] text-[#444] italic mt-2">{currentDateText}</p>
            </div>

            {/* จะแสดงกล่องนับถอยหลังเฉพาะตอนที่ยังไม่ถึงวันงานเท่านั้น */}
            <div className="flex items-center gap-3 mb-6 w-full max-w-75 mx-auto
            before:content-[''] before:flex-1 before:h-px before:bg-linear-to-r before:from-transparent before:via-[#c9a96e]/20 before:to-transparent
            after:content-[''] after:flex-1 after:h-px after:bg-linear-to-r after:from-transparent after:via-[#c9a96e]/20 after:to-transparent">
                <span className="text-[0.8rem] text-[#c9a96e]/30 shrink-0">✦</span>
            </div>
            <div className="bg-black/30 border border-[#c9a96e]/10 rounded-sm px-6 py-4 mb-5 justify-center w-fit text-center mx-auto">
                <p className="font-serif text-[0.7rem] tracking-[2px] text-[#c9a96e]/30 uppercase mb-2.5">เริ่มงานใน</p>
                {!isEnded && timeLeft && (
                    <div className="font-serif text-[2rem] text-[#c9a96e] tracking-[4px]">
                        {timeLeft}
                    </div>
                )}
            </div>
            <p className="font-serif text-[0.8rem] text-[#c9a96e]/25 italic tracking-[1px] mt-4 shrink-0">
                Coexist · COSCI
            </p>

            {isEnded && (
                <button
                    onClick={() => router.push("/")}
                    className="mt-4 px-6 py-3 rounded-xl font-serif text-sm text-[#0a0805] font-bold"
                    style={{ background: "linear-gradient(135deg,#c9a96e,#8B6914,#c9a96e)" }}
                >
                    กลับหน้าหลัก
                </button>
                )}
        </div>
    )

}

/*<div class="dl-ornament"><span>✦</span></div>
  <div class="countdown-wrap" id="countdownWrap">
    <div class="countdown-label">เริ่มงานใน</div>
    <div class="countdown-timer" id="countdownTimer">--:--:--</div>
  </div>
  <div style="font-family:'Times New Roman',Times,serif;font-size:0.8rem;color:rgba(201,169,110,0.25);font-style:italic;letter-spacing:1px;margin-top:16px">
    Coexist · COSCI
  </div> */