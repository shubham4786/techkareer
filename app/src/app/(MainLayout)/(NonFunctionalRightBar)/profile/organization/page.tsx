'use client'
import CompanyProfile from '@/components/CompanyProfile/CompanyProfile'
import { WithAuthOrg } from '@/components/HOC/withAuthOrg'
import {  BottomBar, Navbar } from '@/components/components'
import { useSession } from 'next-auth/react'
import React from 'react'

function OrganizationProfilePage() {
   const session= useSession()
    
   return (
    <>
    <Navbar>@{session.data?.user.username}</Navbar>
        <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full flex justify-center">
        {/* <CompanyDetails username={auth?.user.username}></CompanyDetails> */}
            <CompanyProfile></CompanyProfile>
        </div>
        <BottomBar></BottomBar>

      </>
  )
}

export default WithAuthOrg(OrganizationProfilePage)