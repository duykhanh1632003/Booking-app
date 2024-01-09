import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        if (!user) {
          const response = await axios.get('/profile');
          // Assuming the user information is present in response.data
            setUser(response.data);
            console.log(response)
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile(); // Invoke the function to fetch user profile

  }, [user]); // Depend on 'user' so that useEffect runs only when 'user' changes

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
}
