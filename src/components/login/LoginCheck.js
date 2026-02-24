import { useEffect, useRef, useState } from "react";
import { getAuth, signOut } from "firebase/auth";
import LoginFirebase from "./LoginFirebase";
import { getDatabase, ref, get, set, onValue, off, serverTimestamp } from "firebase/database";
import { useFirebase } from "../FirebaseContext";
import { navigate } from "gatsby";

function getDeviceId() {
  const key = "deviceId";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function newSessionId() {
  const sid = crypto.randomUUID();
  localStorage.setItem("sessionId", sid);
  return sid;
}

function getSessionId() {
  return localStorage.getItem("sessionId");
}

const LoginCheck = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [authenticatedUser, setAuthenticatedUser] = useState(null);

  const firebaseApp = useFirebase();
  const sessionCleanupRef = useRef(null);

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const db = getDatabase(firebaseApp);

    const cleanupSessionListener = () => {
      if (sessionCleanupRef.current) {
        sessionCleanupRef.current();
        sessionCleanupRef.current = null;
      }
    };

    const authUnsubscribe = auth.onAuthStateChanged(async (user) => {
      cleanupSessionListener();

      if (!user) {
        setAuthenticatedUser(null);
        setHasPermission(false);
        setLoading(false);
        localStorage.removeItem("sessionId");
        return;
      }

      setAuthenticatedUser(user);
      localStorage.setItem("email", user.email);

      try {
        // 1) Permisos (tu lógica actual)
        const usersRef = ref(db, "users/" + user.uid);
        const snap = await get(usersRef);
        const role = snap.exists() ? snap.val().role : null;
        setHasPermission(Boolean(snap.exists() && role !== "user"));

        // 2) Marcar ESTA sesión como activa
        const mySessionId = newSessionId();
        const deviceId = getDeviceId();

        const activeRef = ref(db, `users/${user.uid}/activeSession`);
        await set(activeRef, {
          sessionId: mySessionId,
          deviceId,
          updatedAt: serverTimestamp(), // ✅ timestamp del servidor RTDB
          // si tu SDK no lo soporta, cambiá por: Date.now()
        });

        // 3) Escuchar cambios: si activeSessionId cambia -> logout
        onValue(activeRef, async (s) => {
          const active = s.val();
          const current = getSessionId();

          if (!active?.sessionId || !current) return;

          if (active.sessionId !== current) {
            cleanupSessionListener();
            localStorage.removeItem("sessionId");
            await signOut(auth);
            navigate("/session-replaced");
          }
        });

        // Cleanup real para RTDB
        sessionCleanupRef.current = () => off(activeRef);

        setLoading(false);
      } catch (err) {
        console.error("Error en LoginCheck:", err);
        setLoading(false);
      }
    });

    return () => {
      authUnsubscribe();
      cleanupSessionListener();
    };
  }, [firebaseApp]);

  const noPermissionInfo = Boolean(authenticatedUser && !hasPermission);

  return (
    <>
      {(authenticatedUser && hasPermission) || loading ? (
        children
      ) : (
        <LoginFirebase noPermissionInfo={noPermissionInfo} />
      )}
    </>
  );
};

export default LoginCheck;