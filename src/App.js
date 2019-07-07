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
		selectedList: [],
		user: false,
		areTodosLoaded: false,
		areListsLoaded: false
	}

	componentDidMount = () => {
		firebase.auth().onAuthStateChanged(async user => {
			if (firebase.auth().currentUser) {
				await navigate("/workspace")
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
					let data = snapShot.data()
					let todos = []
					if (data) {
						for (let key in data) {
							todos.push(data[key])
						}
						this.setState({ todos, areTodosLoaded: true })
					}
				})

				let listsRef = db.collection("lists").doc(`${currentUser.uid}`)
				listsRef.onSnapshot(async snapShot => {
					let data = snapShot.data()
					let lists = []
					if (data && Object.keys(data).length > 0) {
						for (let key in data) {
							lists.push(data[key])
							if (data[key].isSelected) {
								this.setState({ selectedList: data[key] })
							}
						}
						this.setState({ lists, areListsLoaded: true }, () =>
							this.migrationTransferSelectedListFromUserToListsCollection(currentUser, lists))
					} else if (data && Object.keys(data).length === 0) {
						let list = await this.addList("My List")
						list.isSelected = true
						listsRef.set({ [list.id]: list }, { merge: true })
					}
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
		const{ selectedList} = this.state
		let todo = {
			id: uuid(),
			description,
			done: false,
			listId: selectedList.id
		}

		let ref = db.collection("todos").doc(`${this.state.user.uid}`)
		ref.set(
			{
				[todo.id]: todo
			},
			{ merge: true }
		)
	}

	migrationTransferSelectedListFromUserToListsCollection = async (user, lists) => {
		let userCollGrpRef = db.collectionGroup("users").where('uid', '==', `${user.uid}`)
		user = await userCollGrpRef.get()
		user = user.docs[0].data()

		if (user.hasOwnProperty('selectedList')) {
			const { selectedList } = user
			let updatedLists = lists.map(list => {
				list.id === selectedList ? list.isSelected = true : list.isSelected = false
				return list
			})

			let jsonLists = {}
			updatedLists.forEach(list => jsonLists[list.id] = list)

			// Update lists - using await because I definitely want to make sure this
			// succeeds before next step, which deletes the migration trigger (selectedList on User).
			let listsRef = db.collection("lists").doc(`${user.uid}`)
			await listsRef.set(jsonLists, { merge: true })

			// Update user
			let usersRef = db.collection("users").doc(`${user.uid}`)
			await usersRef.update({ selectedList: firebase.firestore.FieldValue.delete() })
		}
		return
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
			name: listName,
			isSelected: false
		}

		let ref = db.collection("lists").doc(`${this.state.user.uid}`)
		await ref.set(
			{
				[list.id]: list
			},
			{ merge: true }
		)
		return list
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
		const { lists } = this.state
		// Update the lists to mark a new one as isSelected
		let updatedLists = lists.map(list => {
			list.id === selectedListId ? list.isSelected = true : list.isSelected = false
			return list
		})

		// convert array to json object
		let jsonLists = {}
		updatedLists.forEach(list => jsonLists[list.id] = list)
		// Update selectedList to newly selected list
		this.setState({ selectedList: jsonLists[selectedListId] })

		// Update firebase DB
		let ref = db.collection("lists").doc(`${this.state.user.uid}`)
		ref.set(jsonLists, { merge: true })
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

						selectedList={this.state.selectedList}
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
