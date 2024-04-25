import { BottomBar, CompanyDetails, JobseekerDetails, Navbar } from '@/components/components';
import React from 'react'

function CompanyDetailsPage({ params }: { params: { username: string }}) {
  
    return (
      <>
        <Navbar>@{params.username}</Navbar>
        <div className="scrollable-content-wrapper max-sm:h-[80vh] h-[90vh] w-full flex justify-center">
        <CompanyDetails username={params.username}></CompanyDetails>
        </div>
        <BottomBar></BottomBar>
      </>
    );
}

export default CompanyDetailsPage