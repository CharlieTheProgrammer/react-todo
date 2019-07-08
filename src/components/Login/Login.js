import React from "react"
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"
import { FirebaseContext } from "../../services/Firebase/firebase"

const Login = props => {
	return (
		<div className="flexCenterAll flex-column flex-grow-1">
			<FirebaseContext.Consumer>
				{context => <StyledFirebaseAuth uiConfig={context.uiConfig} firebaseAuth={context.auth} />}
			</FirebaseContext.Consumer>
		</div>
	) 
}

export default Login
