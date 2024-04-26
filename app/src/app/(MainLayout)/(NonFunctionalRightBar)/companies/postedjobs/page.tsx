'use client'
import { WithAuthOrg } from '@/components/HOC/withAuthOrg'
import { BottomBar, Navbar, PostedJobsList } from '@/components/components'
import React from 'react'

function PostedJobsListPage({  }: { params: { orgId: number }}) {
  return (
    <>
        <Navbar>Jobs Posted By Organization</Navbar>
        <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full ">
          <PostedJobsList ></PostedJobsList>
        </div>
        <BottomBar></BottomBar>

    </>
  )
}

export default WithAuthOrg(PostedJobsListPage)