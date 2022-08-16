import { useRouter } from "next/router"
import { useState } from "react"
import userService from "../../services/users"

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
        .signUp(userSignUpData).then((response) => {
            if (!response.err) {
                router.push("/user/login")
            } else {
                console.error(response.err)
                alert(JSON.stringify(response.err))
            }
        })
    }

    return (
        !isAuthenticated && 
        <div>
            <h1>Sign up</h1>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="First name"
                    onChange={(e) => setUserSignUpData({first_name: e.target.value, last_name:userSignUpData.last_name, email: userSignUpData.email, password: userSignUpData.password})}
                    value={userSignUpData.first_name}
                ></input>
                <input
                    placeholder="Last name"
                    onChange={(e) => setUserSignUpData({first_name:userSignUpData.first_name, last_name: e.target.value, email: userSignUpData.email, password: userSignUpData.password})}
                    value={userSignUpData.last_name}
                ></input>
                <input
                    placeholder="Email"
                    onChange={(e) => setUserSignUpData({first_name:userSignUpData.first_name, last_name:userSignUpData.last_name, email: e.target.value, password: userSignUpData.password})}
                    value={userSignUpData.email}
                ></input>
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setUserSignUpData({first_name:userSignUpData.first_name, last_name:userSignUpData.last_name, email: userSignUpData.email, password: e.target.value})}
                    value={userSignUpData.password}
                ></input>
                <button>Sign up</button>
            </form>
        </div>
    )
}