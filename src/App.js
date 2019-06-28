import React, { Component } from "react"
import "./App.css"
import firebase from "./services/Firebase/firebase"
import firebaseUiConfig from "./services/Firebase/firebaseUiConf"
import { Router, navigate } from "@reach/router"
import { v1 as uuid } from "uuid"

import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import Todo from "./components/Todo/Todo.js"
import Layout from "./components/Layout/Layout"

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
			<Layout user={this.state.user} logOut={this.logOut}>
				<Router className="d-flex flex-column flex-grow-1">
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
			</Layout>
		)
	}
}

export default App
