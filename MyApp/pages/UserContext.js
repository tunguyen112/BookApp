import {useState, createContext } from 'react';

const UserContext = createContext();

const UserContextProvider = ({ children }) => {
    const [user,setuser]=useState({id:"",mail:"",username:""});
    const [carts,setCarts]=useState([])

    return (
      <UserContext.Provider value={{ user,setuser,carts,setCarts }}>
        {children}
      </UserContext.Provider>
    );
  };
export  {UserContext ,UserContextProvider}