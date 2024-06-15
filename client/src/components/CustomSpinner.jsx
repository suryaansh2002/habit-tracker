import { Spin } from 'antd'
import React from 'react'

export default function CustomSpinner() {
  return (
    <div className='flex justify-center items-center h-[90vh] w-[100%]'>
        <Spin size='large'/>
    </div>
  )
}
