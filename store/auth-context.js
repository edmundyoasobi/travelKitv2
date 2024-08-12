import {createContext, useState} from 'react';
export const AuthContext = createContext({
    //it will help the autocompletion
    token : '',
    userUUID: '',
    isAuthenticted: false,
    authenticate: () => {},
    logout: () => {}
});

function AuthContextProvider({children}){

    const [authToken, setAuthToken] = useState('');
    const [userUUID, setUserUUID] = useState('');
    const value = {
        token: authToken,
        userUUID: userUUID,
        isAuthenticated: !!authToken,
        authenticate: (token,userId) => {setAuthToken(token)   ; setUserUUID(userId)},

        logout: () => setAuthToken(null)
    };
    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
}

export default AuthContextProvider;