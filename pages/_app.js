import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import userService from '../services/users'
import '../styles/globals.css'
import publicPaths from '../utils/routesPublicCatalog'

function MyApp({ Component, pageProps }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    authCheck({url: window.location.pathname})

    const hideContent = () => setAuthorized(false)
    router.events.on('routeChangeStart', hideContent)
    router.events.on('routeChangeComplete', authCheck)

    return () => {
      router.events.off('hashChangeStart', hideContent)
      router.events.off('hashChangeComplete', authCheck)
    }
    
  }, [authCheck, router])

  var authCheck = useCallback(({url}) => {
    url = url ? url : window.location.pathname
    setUser(userService.userValue)
    const path = url.split('?')[0]
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false)
      router.push('/user/login')
    } else {
      setAuthorized(true)
    }
  }, [router])

  return (authorized && <Component {...pageProps} />)
}

export default MyApp
