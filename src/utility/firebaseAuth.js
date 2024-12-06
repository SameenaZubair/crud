import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword} from "firebase/auth";
import {app} from "../firebase/firebaseConfig"

//initialising firebase authentication
const auth = getAuth(app)

//signup function
export const SignUp = async (email, password) => {
    try{
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        return userCredential.user  //it returns user details
    } catch (error){
        throw error.message        //it returns errror message
    }
};

//Login function
export const Login = async(email, password) =>{
    try{
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        return userCredential.user  //returns user details
    }catch(error){
        throw error.message    //returns error message
    }
}