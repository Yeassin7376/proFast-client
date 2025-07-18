import React, { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';
import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebase.init';

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true)

  const createUser = (email, password) =>{
    setLoading(true)
    return createUserWithEmailAndPassword(auth, email, password)
  }

  const signIn = (email, password) =>{
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = () =>{
    setLoading(true);
    return signInWithPopup(auth, googleProvider)
  }

  const logout = () =>{
    return signOut(auth);
  }

  useEffect( ()=>{
    const unsubscribe = onAuthStateChanged(auth, currentUser =>{
      setUser(currentUser);
      setLoading(false)
      // console.log('user in on auth state', currentUser)
    })

    return () =>{
      unsubscribe();
    }
  }, [])

  const authInfo = {
    user,
    loading,
    createUser,
    signIn ,
    signInWithGoogle,
    logout
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
