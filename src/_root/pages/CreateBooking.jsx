
import BookingForm from '@/components/forms/BookingForm'
import React from 'react'
import { MdOutlineAddComment } from 'react-icons/md'

const CreateBooking = () => {
  return (
    <div className="flex flex-1 bg-slate-800">
      <div className="flex flex-col flex-1 items-center gap-10 overflow-scroll py-10 px-5 md:px-8 lg:p-14">
        <div className="max-w-5xl flex justify-start items-center gap-3 w-full">
          <MdOutlineAddComment size={36} color="white" />
          <h2 className="text-[24px] text-white font-bold leading-[140%] tracking-tighter md:text-[36px] md:font-bold md:leading-[140%] md:tracking-tighter text-left w-full">
            Create Booking
          </h2>
        </div>
        <BookingForm/>
      </div>
    </div>
  )
}

export default CreateBooking