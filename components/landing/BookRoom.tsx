import React from 'react'
import { TabbedSearch } from './TabbedSearch'

const BookRoom = () => {
  return (
    <section className='py-16 md:pt-0 container px-4 md:px-8 mx-auto relative'>
      <div className='absolute -top-20' />
        {/* <div className='w-full bg-[#484848] rounded-3xl grid py-7 px-9'>
            <BookSection />
        </div> */}
        <TabbedSearch />
    </section>
  )
}

export default BookRoom