import { createContext, useContext } from 'react';
import { useState } from 'react';

const AuthContext = createContext();
const ProfileContext = createContext();

export function AuthWrapper({ children }) {
  let [user, setUser] = useState(null)

  return (
    <AuthContext.Provider value={{user, setUser}}>
      {children}
    </AuthContext.Provider>
  );
}

export function ProfileWrapper({ children }) {
  let [profile, setProfile] = useState(null)

  return (
    <ProfileContext.Provider value={{profile, setProfile}}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}

export function useProfileContext() {
  return useContext(ProfileContext);
}