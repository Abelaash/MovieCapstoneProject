import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [likedMovies, setLikedMovies] = useState([]);
  return (
    <UserContext.Provider value={{ 
      userId, setUserId,
      likedMovies, setLikedMovies
      }}>
      {children}
    </UserContext.Provider>
  );
};
