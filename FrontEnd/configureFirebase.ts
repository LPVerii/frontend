import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import getConfig from 'next/config';


const { publicRuntimeConfig } = getConfig();
const apiKey = publicRuntimeConfig.API_KEY;
const authDomain = publicRuntimeConfig.AUTH_DOMAIN;
const projectId = publicRuntimeConfig.PROJECT_ID;
const storageBucket = publicRuntimeConfig.STORAGE_BUCKET;
const messagingSenderId = publicRuntimeConfig.MESSAGING_SENDER_ID;
const appId = publicRuntimeConfig.APP_ID;

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

if (!getApps().length) {
  initializeApp(firebaseConfig);
}
let auth = getAuth();


export { auth };
