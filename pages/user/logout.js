import { useRouter } from "next/router"
import userService from "../../services/users"

export default function LogOut() {
    const router = useRouter()
    const isAuthenticated = userService.userValue

    if (isAuthenticated) {
        userService.logOut()
    }

    router.push("/user/login")

    return null
}