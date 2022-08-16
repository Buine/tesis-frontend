import { BehaviorSubject } from 'rxjs';
import LogInService from './logInService';
import SignUpService from './signUpService';

const userSubject = new BehaviorSubject(typeof window !== 'undefined' && JSON.parse(localStorage.getItem("User")))

const userService = {
    user: userSubject.asObservable(),
    get userValue () { return userSubject.value },
    logIn,
    logOut,
    signUp
}

async function logIn(userLoginData) {
    let response = await LogInService(userLoginData)
    let userData = await response.json()
    if (response.status < 400) {
        userSubject.next(userData)
        localStorage.setItem("Authorization", response.headers.get("Authorization"))
        localStorage.setItem("User", JSON.stringify(userData))
    } else {
        return {res: null, err: userData}
    }
    return {res: userData, err: null}
}

async function signUp (userSignUpData) {
    let response = await SignUpService(userSignUpData)
    let userData = await response.json()
    if (response.status >= 400) {
        return {res: null, err: userData}
    }
    return {res: userData, err: null}
}

function logOut()  {
    userSubject.next(null)
    localStorage.removeItem("Authorization")
    localStorage.removeItem("User")
}


export default userService
