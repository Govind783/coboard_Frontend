import Image from 'next/image'
import { Inter } from 'next/font/google'
import LandingPageIndex from '@/components/LandingPage/LandingPageIndex'
import { useUser, withPageAuthRequired } from '@auth0/nextjs-auth0/client';
import { useEffect, useLayoutEffect } from 'react';
import { deletCookiesNext, hasCookiesNext, setCookiesNext } from '@/cookies/cookiesConfig';
import { useRouter } from 'next/router';

export default function Home() {
  const { user, error, isLoading } = useUser();
  useLayoutEffect(() => {

    if (!user?.email) {
      deletCookiesNext("user_email");
      deletCookiesNext("nameOfUser");
      
    }
  }, [])

  return (
    <>
      <LandingPageIndex />
    </>
  )
}
