import React, { Component } from "react"
import "./App.css"
import firebase from "./services/Firebase/firebase"
import firebaseUiConfig from "./services/Firebase/firebaseUiConf"
import db from "./services/Firebase/firestore"

import { Router, navigate } from "@reach/router"
import { v1 as uuid } from "uuid"

import Home from "./components/Home/Home"
import Login from "./components/Login/Login"
import Layout from "./components/Layout/Layout"
import Workspace from "./components/Workspace/Workspace"

class App extends Component {
	state = {
		todos: [],
		lists: [],
		user: false,
		areTodosLoaded: false,
		areListsLoaded: false
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

				let usersRef = db.collection("users").doc(`${currentUser.uid}`)
				usersRef.onSnapshot(snapShot => {
					let data = snapShot.data()
					this.setState({ user: data })
				})
				usersRef.set(currentUser, { merge: true })

				let todosRef = db.collection("todos").doc(`${currentUser.uid}`)
				todosRef.onSnapshot(snapShot => {
					this.setState({ areTodosLoaded: true })
					let data = snapShot.data()
					let todos = []
					if (data) {
						for (let key in data) {
							todos.push(data[key])
						}
						this.setState({ todos })
					}
				})

				let listsRef = db.collection("lists").doc(`${currentUser.uid}`)
				listsRef.onSnapshot(async snapShot => {
					this.setState({ areListsLoaded: true })
					let data = snapShot.data()
					let lists = []
					if (data && Object.keys(data).length > 0) {
						for (let key in data) {
							lists.push(data[key])
						}
						this.setState({ lists })
					} else if (data && Object.keys(data).length === 0) {
						await this.addList("My List")
						let listId = this.state.lists[0].id
						usersRef.set({ selectedList: listId }, { merge: true })
					}
					navigate("/workspace")
				})
			} else {
				this.setState({
					areListsLoaded: false,
					areTodosLoaded: false,
				})
			}
		})
	}

	toggleTodoCompletion = (evt, todoId) => {
		let todo = this.state.todos.filter(todo => (todo.id === todoId ? todo : false))
		todo[0].done = !todo[0].done
		let ref = db.collection("todos").doc(`${this.state.user.uid}`)
		ref.set(
			{
				[todoId]: todo[0]
			},
			{ merge: true }
		)
	}

	editTodoDescription = (todoId, description) => {
		let todo = this.state.todos.filter(todo => (todo.id === todoId ? todo : false))
		todo[0].description = description

		let ref = db.collection("todos").doc(`${this.state.user.uid}`)
		ref.set(
			{
				[todoId]: todo[0]
			},
			{ merge: true }
		)
	}

	addTodo = description => {
		const listId = this.state.user.selectedList
		let todo = {
			id: uuid(),
			description,
			done: false,
			listId
		}

		let ref = db.collection("todos").doc(`${this.state.user.uid}`)
		ref.set(
			{
				[todo.id]: todo
			},
			{ merge: true }
		)
	}

	deleteTodo = todoId => {
		let ref = db.collection("todos").doc(`${this.state.user.uid}`)
		ref.update({
			[todoId]: firebase.firestore.FieldValue.delete()
		})
	}

	logOut = async () => {
		await navigate("/")
		await firebase.auth().signOut()
		this.setState({
			user: null,
			todos: [],
			lists: []
		})
	}

	editListName = (listId, listName) => {
		let list = this.state.lists.filter(list => (list.id === listId ? list : false))
		list[0].name = listName

		let ref = db.collection("lists").doc(`${this.state.user.uid}`)
		ref.set(
			{
				[listId]: list[0]
			},
			{ merge: true }
		)
	}

	addList = async listName => {
		if (listName === "") {
			return
		}

		let list = {
			id: uuid(),
			name: listName
		}

		let ref = db.collection("lists").doc(`${this.state.user.uid}`)
		await ref.set(
			{
				[list.id]: list
			},
			{ merge: true }
		)
	}

	deleteList = listId => {
		if (this.state.lists.length === 1) {
			window.alert("You must have at least one todo list.")
			return
		}
		let doDeleteList = window.confirm("Are you sure you want to delete this list? \n\nThis action cannot be undone.")

		if (doDeleteList) {
			let ref = db.collection("lists").doc(`${this.state.user.uid}`)
			ref.update({
				[listId]: firebase.firestore.FieldValue.delete()
			})
		}
		return
	}

	changeSelectedList = (evt, selectedListId) => {
		evt.preventDefault()
		let ref = db.collection("users").doc(`${this.state.user.uid}`)
		ref.set({
			selectedList: selectedListId
		}, { merge: true })
	}

	render() {
		return (
			<Layout user={this.state.user} logOut={this.logOut} state={this.state}>
				<Router className="d-flex flex-column flex-grow-1">
					<Home path="/" />
					<Login path="/login" firebaseUiConfig={firebaseUiConfig} firebaseAuth={firebase.auth} />
					<Workspace
						path="/workspace"
						todos={this.state.todos}
						toggleTodoCompletion={this.toggleTodoCompletion}
						editTodoDescription={this.editTodoDescription}
						deleteTodo={this.deleteTodo}
						addTodo={this.addTodo}
						user={this.state.user}

						lists={this.state.lists}
						addList={this.addList}
						editListName={this.editListName}
						deleteList={this.deleteList}
						changeSelectedList={this.changeSelectedList}
						areListsLoaded={this.state.areListsLoaded}
						areTodosLoaded={this.state.areTodosLoaded}
					/>
				</Router>
			</Layout>
		)
	}
}

export default App
