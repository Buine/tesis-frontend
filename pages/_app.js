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
    setAuthorized(false)
    authCheck({ url: window.location.pathname })
  }, [router, authCheck])

  var authCheck = useCallback(({ url }) => {
    setUser(userService.userValue)
    const path = url.split('?')[0]
    if (!userService.userValue && !publicPaths.includes(path)) {
      setAuthorized(false)
      router.push('/user/login')
    } else {
      setAuthorized(true)
    }
  }, [setAuthorized, router])

  return (authorized && <Component {...pageProps} />)
}

export default MyApp
