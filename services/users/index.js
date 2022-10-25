import { BehaviorSubject } from 'rxjs';
import validateRequest from '../../utils/validateRequest';
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
    return await validateRequest(response, (userData) => {
        userSubject.next(userData)
        localStorage.setItem("Authorization", response.headers.get("Authorization"))
        localStorage.setItem("User", JSON.stringify(userData))
    })
}

async function signUp (userSignUpData) {
    let response = await SignUpService(userSignUpData)
    return await validateRequest(response)
}

function logOut()  {
    userSubject.next(null)
    localStorage.removeItem("Authorization")
    localStorage.removeItem("User")
}


export default userService
