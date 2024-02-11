import { createContext, useContext, useRef, useState } from "react";
const StateContext = createContext({
    user: null,
    token: null,
    setUser: () => {},
    setToken: () => {}
})

// eslint-disable-next-line react/prop-types
export const ContextProvider =({children}) => {
    const [user, _setUser] = useState(localStorage.getItem('user'));
    const [token, _setToken] = useState(localStorage.getItem('ACCESS_TOKEN'));
    const [sidebar, setSidebar] = useState(false);
    const [count, setCount] = useState(0);
    const toast = useRef(null)
    const setToken = (token) =>{
        _setToken(token)
        if(token) {
            localStorage.setItem('ACCESS_TOKEN', token);
        }else{
            localStorage.removeItem('ACCESS_TOKEN');
        }
    }
    const setUser = (user) =>{
        _setUser(user)
        if(user) {
            localStorage.setItem('user', user);
        }else{
            localStorage.removeItem('user');
        }
    }

    return(
        <StateContext.Provider value={{
            user,
            token,
            toast,
            sidebar,
            count,
            setUser,
            setToken,
            setSidebar,
            setCount,
        }}>
            {children}
        </StateContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useStateContext = () => useContext(StateContext)
