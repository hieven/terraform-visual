import { Home } from '@app/containers'
import { useEffect } from 'react'
import { Amplitude } from '@app/utils/amplitude'

const Page = () => {
  useEffect(() => {
    Amplitude.logEvent('enter page', { page: 'home' })
  }, [])

  return Home.C()
}

export default Page
