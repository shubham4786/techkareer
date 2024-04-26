import React from 'react'
import { CiSearch } from 'react-icons/ci'

function SearchSectionWrapper({children}:{children: React.ReactNode}) {
  return (
    <>
        <div className="search-section w-full flex justify-center items-center h-[7vh]  border-b-[1px] border-b-[solid] border-b-[#E1E4E8]">
              <div className="input-search-container w-[90%] m-auto flex justify-center items-center rounded-[10px] overflow-hidden border-[1px] border-solid border-[#a4a8ad]  ps-1 pe-1 ">
                    {children}
                <CiSearch  className="cursor-pointer"></CiSearch>
              </div>
            </div>
</>
  )
}

export default SearchSectionWrapper