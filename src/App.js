import React, { Component } from "react"
import "./App.css"
import FirebaseContext from "./services/Firebase/context";
import { Router, navigate } from "@reach/router"

import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import Layout from "./components/Layout/Layout"
import Workspace from "./components/Workspace/Workspace"

class App extends Component {
	state = {
		user: false,
	}

	static contextType = FirebaseContext

	componentDidMount = () => {
		this.context.auth.onAuthStateChanged(async user => {
			if (this.context.auth.currentUser) {
				let u = this.context.auth.currentUser
				var currentUser = {
					displayName: u.displayName,
					email: u.email,
					photoURL: u.photoURL,
					uid: u.uid
				}

				this.context.user(currentUser.uid).onSnapshot(snapShot => {
					let data = snapShot.data()
					this.setState({ user: data })
				})
				this.context.user(currentUser.uid).set(currentUser, { merge: true })
			} else {
				this.setState({
					user: false
		})
	}
		})
	}

	render() {
		return (
			<Layout user={this.state.user} state={this.state}>
				<Router className="d-flex flex-column flex-grow-1">
					<Home path="/" />
					<Login path="/login" />
					<Workspace
						path="/workspace/:uid"
						user={this.state.user}
					/>
				</Router>
			</Layout>
		)
	}
}

export default App
