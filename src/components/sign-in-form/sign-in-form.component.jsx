import { useState, useContext } from "react";
import {signInWithGooglePopup, signInAuthUserWithEmailAndPassword, createUserDocumentFromAuth } from "../../utils/firebase/firebase.utils";
import FormInput from '../form-input/form-input.component';
import Button from "../button/button.component";
import { UserContext } from "../../contexts/user.context";

import './sign-in-form.styles.scss';


const defaultFormFields = {
    email: '',
    password: ''
}

const SignInForm = () => {
    const [formFields, setFormFields] = useState(defaultFormFields);
    const { email, password } = formFields;

    const { setCurrentUser } = useContext(UserContext);

    const resetFormFields = () => {
        setFormFields(defaultFormFields);
    }

    const signInGoogleUser = async () => {
        const { user } = await signInWithGooglePopup();
        await createUserDocumentFromAuth(user);
        setCurrentUser(user);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        //confirm passwords match.
        //Then see if we authenticated user.
        //Then create user document.

        if(password == null || password === ""){
            alert('Password is required.');
            return;
        } 
        if(password && email){
            try{
                const {user} = await signInAuthUserWithEmailAndPassword(email, password);
                setCurrentUser(user);
                resetFormFields();

            } catch(error){
                switch(error.code){
                    case 'auth/wrong-password': 
                        alert('Incorrect password for email.');
                        break;
                    case 'auth/user-not-found':
                        alert('No user found.');
                        break;
                    default: 
                        console.error(error);
                }
            }
        } else {
            alert('Email is required.');
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormFields({...formFields, [name]: value});
    };

    console.log('render');
    return (
        
        <div className="sign-in-container">
            <h2>I already have an account</h2>
            <span>Sign in with your email and password</span>
            <form onSubmit={(event) => {
                handleSubmit(event);
            }}>
                
                <FormInput 
                    label="Email" 
                    type='email' 
                    required 
                    onChange={handleChange}
                    name="email" 
                    value-={email} 
                    />
                <FormInput 
                    label="Password" 
                    type='password' 
                    required 
                    onChange={handleChange} 
                    name="password" 
                    value-={password} 
                />
                <div className="buttons-container">
                    <Button type='submit'>Sign In</Button>
                    <Button type='button' buttonType='google' onClick={signInGoogleUser}>Google Sign In</Button>
                </div>
            </form>
        </div>
    )
}

export default SignInForm;