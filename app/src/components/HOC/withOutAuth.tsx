'use client'
import { options } from '@/app/api/auth/[...nextauth]/option'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export const WithoutAuth = (Component: any) => {
  return function WithoutAuth(props: any) {
    const {data:authData,status} =useSession()
    useEffect(() => {
      if (status!='loading' &&authData?.user && authData.user.role=='Organization') {
        redirect('/profile/organization')
      }
      if (status!='loading' &&authData?.user && authData.user.role=='Jobseeker') {
        redirect('/profile/jobseeker')
      }
    
    }, [authData,status])


    if(status=='loading'){
      return <></>
    }
    return <Component {...props} />
  }
}