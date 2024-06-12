import React from 'react'

export default function BottomNav({highlight}) {
  return (
    <div className='fixed bottom-0  w-[100%] flex justify-around bg-[#000000] h-[4rem] text-white'>
      <a href='/dashboard'>
        <div className={`text-sm w-max text-center p-2 py-4 my-2 rounded-lg`} style={highlight=='home' ? {color:'black', background:'white'}:{}}>
            Home
        </div>
      </a>
      <a href='/track'>
        <div className={`text-sm w-max text-center p-2 py-4 my-2 rounded-lg`} style={highlight=='track' ? {color:'black', background:'white'}:{}}>
            Track
        </div>
      </a>
      <a href='/profile'>
        <div className={`text-sm w-max text-center p-2 py-4 my-2 rounded-lg`} style={highlight=='profile' ? {color:'black', background:'white'}:{}}>
            Profile
        </div>
      </a>
        
    </div>
  )
}
