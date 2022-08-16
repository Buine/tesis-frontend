import { useRouter } from "next/router"
import { useState } from "react"
import userService from "../../services/users"

export default function SignUp() {
    const router = useRouter();

    const [userSignUpData, setUserSignUpData] = useState({name: '', email: '', password: ''})
    const isAuthenticated = userService.userValue

    if (isAuthenticated) {
        router.push("/")
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        return userService
        .signUp(userSignUpData).then(() => {
            router.push("/user/login")
        }).catch(err => console.error(err))
    }

    return (
        !isAuthenticated && 
        <div>
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Name"
                    onChange={(e) => setUserSignUpData({name: e.target.value, email: userSignUpData.email, password: userSignUpData.password})}
                    value={userSignUpData.name}
                ></input>
                <input
                    placeholder="Email"
                    onChange={(e) => setUserSignUpData({name: userSignUpData.name, email: e.target.value, password: userSignUpData.password})}
                    value={userSignUpData.email}
                ></input>
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setUserSignUpData({name: userSignUpData.name, email: userSignUpData.email, password: e.target.value})}
                    value={userSignUpData.password}
                ></input>
                <button>Sign up</button>
            </form>
        </div>
    )
}