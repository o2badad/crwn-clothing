import {
    initializeApp
} from "firebase/app";
import {
    getAuth,
    signInWithRedirect,
    signInWithPopup,
    GoogleAuthProvider
} from 'firebase/auth'

import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpDxsbYmcExjX_3Fqft7v9DLfXwKf07N0",
    authDomain: "crwn-clothing-db-ed122.firebaseapp.com",
    projectId: "crwn-clothing-db-ed122",
    storageBucket: "crwn-clothing-db-ed122.appspot.com",
    messagingSenderId: "534544132117",
    appId: "1:534544132117:web:c837d5fa3afb5dccc9461c"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

const provider = new GoogleAuthProvider();
provider.setCustomParameters({
    prompt: "select_account"
});

export const db = getFirestore();

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export const createUserDocumentFromAuth = async (userAuth) => {
    const userDocRef = doc(db, 'users', userAuth.uid);

    console.log(userDocRef);

    const userSnapshot = await getDoc(userDocRef);

    //if user data exists
    // return userDocRef
    // else
    // create document using userSnapshot.

    if(!userSnapshot.exists()){
        const { displayName, email } = userAuth;
        const createAt = new Date();

        try{
            await setDoc(userDocRef, {
                displayName,
                email,
                createAt
            });
        }
        catch (error){
            console.log('error creating the user', error.message);
        }
    }

    return userDocRef;
}