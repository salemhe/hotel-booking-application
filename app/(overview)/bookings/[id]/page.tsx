import React from 'react'

const page = async ({ params }: { params: Promise<{ id: string}>}) => {
    const  { id } = await params
  return (
    <div className='mt-60'>This page displays details of {id} bookings </div>
  )
}

export default page