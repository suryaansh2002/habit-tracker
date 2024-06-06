import React from 'react'

export default function BottomNav({highlight}) {
  return (
    <div className='fixed bottom-0 left-0  w-[100vw] flex justify-between bg-[lightgray] h-[4rem]'>
      <a href='/dashboard'>
        <div className={`text-sm w-max text-center p-2 py-4`}>
            Home
        </div>
      </a>
      <a href='/track'>
        <div className={`text-sm w-max text-center p-2 py-4`}>
            Track
        </div>
      </a>
      <a href='/profile'>
        <div className={`text-sm w-max text-center p-2 py-4`}>
            Profile
        </div>
      </a>
        
    </div>
  )
}
