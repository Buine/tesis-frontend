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

function logIn(userLoginData) {
    return LogInService(userLoginData).then(response => {
        if (response.ok) {
            response.json().then(userData => {
                userSubject.next(userData)
                localStorage.setItem("Authorization", response.headers.get("Authorization"))
                localStorage.setItem("User", JSON.stringify(userData))
            })
        }
    })
}

function signUp (userSignUpData) {
    return SignUpService(userSignUpData)
}

function logOut()  {
    userSubject.next(null)
    localStorage.removeItem("Authorization")
    localStorage.removeItem("User")
}


export default userService
