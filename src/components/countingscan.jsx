import React from 'react'

function Countingscan({count=0,total=10}) {
    const percent = Math.min((count / total) * 100, 100);
  return (
    <div className="relative overflow-hidden my-2 mb-7 bg-[#c9a96e]/4 border border-[#c9a96e]/12 rounded-2xl px-5.5 py-5
  before:content-[''] before:absolute before:top-0 before:left-0 before:right-0 before:h-px
  before:bg-linear-to-r before:from-transparent before:via-[#c9a96e]/30 before:to-transparent z-50 w-full max-w-sm">
    <div className="font-serif text-[0.72rem] tracking-[3px] text-[#c9a96e]/50 uppercase mb-2.5 ">Exhibition  Progress</div>
    <div className="flex items-baseline gap-2 mb-3.5">
      <div className="font-serif text-[3.8rem] font-bold text-white leading-none transition-all duration-500 [text-shadow:0_0_30px_rgba(201,169,110,0.3)]" id="scanCount">{count}</div>
      <div className="text-2xl text-[#333] font-light">&thinsp;/&thinsp;</div>
      <div className="text-2xl text-[#555] font-light">{total}</div>
      <div className="font-serif text-[0.85rem] text-[#666] ml-1 italic">บูธที่เยี่ยมชม</div>
    </div>

    <div className="h-0.75 bg-white/4 rounded-sm overflow-hidden">
        <div
          className="h-full rounded-sm transition-[width] duration-700 ease-in-out [box-shadow:0_0_8px_rgba(201,169,110,0.4)]"
          style={{
            background: "linear-gradient(90deg,#8B6914,#c9a96e,#e8cc99,#c9a96e)",
            backgroundSize: "200% 100%",
            width: `${percent}%`, 
          }}
        />
      </div>

  </div>
  )
}

export default Countingscan