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
        e.preventDefault()
        return userService
        .logIn(userLoginData).then(() => {
            router.push("/")
        }).catch(err => console.error(err))
    }

    return (
        <div style={{
            //width: '501.41px', 
            //height: '405.65px'
    
            // width: 501.41px;
            // height: 405.65px;
            // border-radius: 15px;
            // border-style: inset;
            // border-width: 1.5px;
            // border-color: black;
            // margin: 10px;
            // display: flex;
            // flex-direction: column;
            // justify-content: center;
            // align-items: center;
        }}>
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