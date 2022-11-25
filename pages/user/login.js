import Link from "next/link";
import { useRouter } from "next/router"
import { useState } from "react"
import userService from "../../services/users"
import styles from "../../styles/IntegrationCreate.module.css"

export default function Login() {
    const router = useRouter();

    const [userLoginData, setUserLoginData] = useState({email: '', password: ''})
    const isAuthenticated = userService.userValue

    if (isAuthenticated) {
        router.push("/")
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        return userService
        .logIn(userLoginData).then(() => {
            router.push("/")
        }).catch(err => {
            console.error(err)
            alert("The username or password is incorrect")
        })
    }

    return (
            <main className={styles.main}>
                <div>
                    <h3>Log in</h3>
                    <p>Ingress your data for access</p>
                </div>
                <div className={styles.window} style={{minHeight: '150px'}}>
                    <div className={styles.window_toolbar}>
                        <div className={styles.window_circle} style={{backgroundColor: '#FF5151'}} />
                        <div className={styles.window_circle} style={{backgroundColor: '#FFD43D'}} />
                        <div className={styles.window_circle} style={{backgroundColor: '#86CF4C'}} />
                    </div>
                    <div className={styles.window_container}>
                        <form onSubmit={handleSubmit}>
                        <label className={styles.label}>Email</label>
                            <input
                                placeholder="Email"
                                onChange={(e) => setUserLoginData({email: e.target.value, password: userLoginData.password})}
                                value={userLoginData.email}
                                required
                            ></input>
                            <label className={styles.label}>Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                onChange={(e) => setUserLoginData({email: userLoginData.email, password: e.target.value})}
                                value={userLoginData.password}
                                required
                            ></input>
                            <div style={{display: 'flex', flexDirection: 'row-reverse', color: '#9C5EFA'}}>
                            <a className={styles.label}><Link href="/user/signup">Signup?</Link></a>
                            </div>
                            <button style={{marginTop: '15px', marginBottom: '12px'}}>Login</button>
                        </form>
                    </div>
                </div>
            </main>
    )
}