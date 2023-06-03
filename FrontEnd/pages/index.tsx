import type { NextPage } from 'next'
import { useContext, useState } from 'react'
import Dashboard from './Dashboard'
import Login from './auth/login'
import { AuthContext } from '../AuthContext'
import * as authorization from 'firebase/auth'
import { auth } from '../configureFirebase'

const Home: NextPage = () => {
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  const sharedData = (email: any, password: any) => {
    setIsLoading(true);
    authorization.signInWithEmailAndPassword(auth, email, password).then(() => {
      setIsLoading(false);
    })
      .catch((error: any) => {
        console.error(error)
        setIsLoading(false);
      });
  }

  const screenContainerStyle = {
    transition: 'opacity 1s ease-in-out',
    opacity: isLoading ? 0 : 1,
    overflow: 'hidden',
  };

  const logoStyle = {
    display: isLoading ? 'block' : 'none',
  }


  return (
    <div style={screenContainerStyle}>
      <div className="w-[797px] h-[205px] animate-bounce absolute bg-center bg-[url('../resource/IMG/logoType.png')] bg-no-repeat  bg-cover top-[calc(45%_-_50px)] left-[calc(30%_-_50px)] overflow-hidden" style={logoStyle} ></div>
      {!!user ? <Dashboard user={user} /> : <Login sharedData={sharedData} />}
    </div>
  );
}

export default Home
