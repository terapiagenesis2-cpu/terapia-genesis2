import React, { createContext, useContext } from "react";
import { initializeApp, getApps } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyAEwgR9D1dyYHeAn2BQryHm-IuipfgBCrs",
  authDomain: "terapia-genesis.firebaseapp.com",
  projectId: "terapia-genesis",
  storageBucket: "terapia-genesis.appspot.com",
  messagingSenderId: "937946542554",
  appId: "1:937946542554:web:98a501ed67031108f490e3",
  measurementId: "G-SG8Q78JFK7",
  databaseURL: "https://terapia-genesis-default-rtdb.firebaseio.com/",
};

const FirebaseContext = createContext(null);

function getFirebaseApp() {
  // evita doble inicialización (Gatsby SSR)
  if (getApps().length > 0) return getApps()[0];
  return initializeApp(firebaseConfig);
}

export const FirebaseProvider = ({ children }) => {
  const app = getFirebaseApp();

  return (
    <FirebaseContext.Provider value={app}>
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => useContext(FirebaseContext);