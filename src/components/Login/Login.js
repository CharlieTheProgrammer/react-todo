import React from 'react'
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"

const Login = (props) => {
    return (
        <div>
            <StyledFirebaseAuth uiConfig={props.firebaseUiConfig} firebaseAuth={props.firebaseAuth()} />
        </div>
    )
}

export default Login
