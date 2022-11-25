import Link from "next/link";
import { useRouter } from "next/router"
import { useState } from "react"
import userService from "../../services/users"
import styles from "../../styles/IntegrationCreate.module.css"

export default function SignUp() {
    const router = useRouter();

    const [userSignUpData, setUserSignUpData] = useState({first_name: '', last_name: '', email: '', password: ''})
    const isAuthenticated = userService.userValue

    if (isAuthenticated) {
        router.push("/")
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        return userService
        .signUp(userSignUpData).then(() => {
            router.push("/user/login")
        }).catch(err => {
            console.error(err)
            alert("An unexpected error has occurred, try again later.")
        })
    }

    return (
        !isAuthenticated && 
        <main className={styles.main}>
            <div>
                <h3>Sign Up</h3>
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
                        <label className={styles.label}>First name</label>
                            <input
                                placeholder="First name"
                                onChange={(e) => setUserSignUpData({...userSignUpData, first_name: e.target.value})}
                                value={userSignUpData.first_name}
                                required
                            ></input>
                            <label className={styles.label}>Last name</label>
                            <input
                                placeholder="Last name"
                                onChange={(e) => setUserSignUpData({...userSignUpData, last_name: e.target.value})}
                                value={userSignUpData.last_name}
                                required
                            ></input>
                            <label className={styles.label}>Email</label>
                            <input
                                placeholder="Email"
                                type="email"
                                onChange={(e) => setUserSignUpData({...userSignUpData, email: e.target.value})}
                                value={userSignUpData.email}
                                required
                            ></input>
                            <label className={styles.label}>Password</label>
                            <input
                                type="password"
                                placeholder="Password"
                                minLength="6"
                                onChange={(e) => setUserSignUpData({...userSignUpData, password: e.target.value})}
                                value={userSignUpData.password}
                                required
                            ></input>
                            <div style={{display: 'flex', flexDirection: 'row-reverse', color: '#9C5EFA'}}>
                                <a className={styles.label}><Link href="/user/login">Login?</Link></a>
                            </div>
                            <button style={{marginTop: '15px', marginBottom: '12px'}}>Sign up</button>
                        </form>
                    </div>
                </div>
        </main>
    )
}