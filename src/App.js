import React, { Component } from "react"
import "./App.css"
import firebase from "./services/Firebase/firebase"
import firebaseUiConfig from "./services/Firebase/firebaseUiConf"
import { Router, navigate } from "@reach/router"
import { v1 as uuid } from "uuid"

import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import Todo from "./components/Todo/Todo.js"

class App extends Component {
	state = {
		todos: [],
		user: false
	}

	componentDidMount = () => {
		firebase.auth().onAuthStateChanged(user => {
			console.log(user)
			if (firebase.auth().currentUser) {
				let u = firebase.auth().currentUser
				var currentUser = {
					displayName: u.displayName,
					email: u.email,
					photoURL: u.photoURL,
					uid: u.uid
				}

				this.setState({ user: currentUser })
				navigate("/todos")
			}
		})
	}

	toggleTodoCompletion = (evt, todoId) => {
		let updatedTodos = this.state.todos.map(todo => {
			if (todo.id === todoId) {
				todo.done = !todo.done
			}
			return todo
		})
		this.setState({ todos: updatedTodos })
	}

	addTodo = description => {
		let todo = {
			id: uuid(),
			description,
			done: false
		}
		let updatedTodos = [...this.state.todos]
		updatedTodos.push(todo)
		this.setState({ todos: updatedTodos })
	}

	deleteTodo = todoId => {
		let updatedTodos = this.state.todos.filter(todo => todo.id !== todoId)
		this.setState({ todos: updatedTodos })
	}

	logOut = async () => {
		navigate("/")
		await firebase.auth().signOut()
		this.setState({ user: null })
	}

	render() {
		return (
			<div className="App">
				<div className="d-flex justify-content-between bg-dark mb-5 px-2">
					<h1 className="text-light pb-1 pt-2 text-center ml-2">YATOP</h1>
					{this.state.user && (
						<button className="btn btn-primary my-3" onClick={() => this.logOut()}>
							Log out
						</button>
					)}
				</div>
				<Router className="container">
					<Home path="/" />
					<Login path="/login" firebaseUiConfig={firebaseUiConfig} firebaseAuth={firebase.auth} />
					<Todo
						path="/todos"
						todos={this.state.todos}
						toggleTodoCompletion={this.toggleTodoCompletion}
						deleteTodo={this.deleteTodo}
						addTodo={this.addTodo}
						user={this.state.user}
					/>
				</Router>
			</div>
		)
	}
}

export default App
