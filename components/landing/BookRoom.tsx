import React from 'react'
import BookSection from './BookSection'

const BookRoom = () => {
  return (
    <section className='pb-16 container px-4 md:px-8 mx-auto'>
        <div className='w-full bg-[#484848] rounded-3xl grid py-7 px-9'>
            <BookSection />
        </div>
    </section>
  )
}

export default BookRoom