import { useRouter } from "next/router"
import { useState } from "react"
import userService from "../../services/users"

export default function Login() {
    const router = useRouter();

    const [userLoginData, setUserLoginData] = useState({email: '', password: ''})
    const isAuthenticated = userService.userValue

    if (isAuthenticated) {
        router.push("/")
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        return userService
        .logIn(userLoginData).then((response) => {
            if (!response.err) {
                router.push("/")
            } else {
                alert(JSON.stringify(response.err))
                console.error(response.err)
            }
        })
    }

    return (
        <div>
            <h1>Log in</h1>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Email"
                    onChange={(e) => setUserLoginData({email: e.target.value, password: userLoginData.password})}
                    value={userLoginData.email}
                ></input>
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setUserLoginData({email: userLoginData.email, password: e.target.value})}
                    value={userLoginData.password}
                ></input>
                <button>Login</button>
            </form>
        </div>
    )
}