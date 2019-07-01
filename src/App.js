import React, { Component } from "react"
import "./App.css"
import firebase from "./services/Firebase/firebase"
import firebaseUiConfig from "./services/Firebase/firebaseUiConf"
import db from './services/Firebase/firestore'

import { Router, navigate } from "@reach/router"
import { v1 as uuid } from "uuid"

import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import Todos from "./components/Todos/Todos.js"
import Layout from "./components/Layout/Layout"

class App extends Component {
	state = {
		todos: [],
		user: false
	}

	componentDidMount = () => {
		firebase.auth().onAuthStateChanged(user => {
			if (firebase.auth().currentUser) {
				let u = firebase.auth().currentUser
				var currentUser = {
					displayName: u.displayName,
					email: u.email,
					photoURL: u.photoURL,
					uid: u.uid
				}
				this.setState({ user: currentUser })

				let ref = db.collection('todos').doc(`${this.state.user.uid}`)
				ref.onSnapshot(snapShot => {
					let data = snapShot.data()
					let todos = []
					if (data) {
						for (let key in data) {
							todos.push(data[key])
						}
						this.setState({ todos })
					}
				})

				navigate("/todos")
			}
		})
	}

	toggleTodoCompletion = (evt, todoId) => {
		let todo = this.state.todos.filter(todo => {
			if (todo.id === todoId) {
				return todo
			}
		})
		todo[0].done = !todo[0].done
		let ref = db.collection('todos').doc(`${this.state.user.uid}`)
		ref.set({
			[todoId]: todo[0]
		}, { merge: true })
	}

	editTodoDescription = (todoId, description) => {
		let todo = this.state.todos.filter(todo => {
			if (todo.id === todoId) {
				return todo
			}
		})
		todo[0].description = description

		let ref = db.collection('todos').doc(`${this.state.user.uid}`)
		ref.set({
			[todoId]: todo[0]
		}, { merge: true })
	}

	addTodo = description => {
		let todo = {
			id: uuid(),
			description,
			done: false
		}
		let updatedTodos = [...this.state.todos]
		updatedTodos.push(todo)

		let ref = db.collection('todos').doc(`${this.state.user.uid}`)
		ref.set({
			[todo.id]: todo
		}, { merge: true })
	}

	deleteTodo = todoId => {
		let ref = db.collection('todos').doc(`${this.state.user.uid}`)
		ref.update({
			[todoId]: firebase.firestore.FieldValue.delete()
		})
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
					<Todos
						path="/todos"
						todos={this.state.todos}
						toggleTodoCompletion={this.toggleTodoCompletion}
						editTodoDescription={this.editTodoDescription}
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
