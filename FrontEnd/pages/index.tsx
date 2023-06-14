import type { NextPage } from 'next'
import { useContext, useState } from 'react'
import Dashboard from './Dashboard'
import Login from './auth/login'
import { AuthContext } from '../AuthContext'
import * as authorization from 'firebase/auth'
import { auth } from '../configureFirebase'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home: NextPage = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);


  const sharedData = (email: any, password: any) => {
    setIsLoading(true);
    authorization.signInWithEmailAndPassword(auth, email, password).then(() => {
      setIsLoading(false);
    })
      .catch((error: any) => {
        toast.error(error.code);
        console.error(error.code, error.message);
        setIsLoading(false);
      });
  }

  const sharedData2 = (email: any) => {
    authorization.sendPasswordResetEmail(auth, email).then(() => {
      toast.success('Email sent');
    }).catch((error: any) => {
      toast.error(error.code);
      console.error(error.code, error.message);
    });
  };

  const screenContainerStyle = {
    transition: 'opacity 1s ease-in-out',
    opacity: isLoading ? 0 : 1,
    overflow: 'hidden',
    height: '100vh',
  };

  const logoStyle = {
    display: isLoading ? 'block' : 'none',
  }


  return (
    <div style={screenContainerStyle}>
      <ToastContainer />
      <div className="w-[797px] h-[205px] animate-bounce absolute bg-center bg-[url('../resource/IMG/logoType.png')] bg-no-repeat  bg-cover top-[calc(45%_-_50px)] left-[calc(30%_-_50px)] overflow-hidden" style={logoStyle} ></div>
      {!!user ? <Dashboard user={user} /> : <Login sharedData={sharedData} shareData2={sharedData2} />}
    </div>
  );
}

export default Home
