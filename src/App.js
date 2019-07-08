import React, { Component } from "react"
import "./App.css"


import FirebaseContext from "./services/Firebase/context";

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

	static contextType = FirebaseContext

	componentDidMount = () => {
		this.context.auth.onAuthStateChanged(async user => {
			if (this.context.auth.currentUser) {
				await navigate("/workspace")
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

				this.context.todos(currentUser.uid).onSnapshot(snapShot => {
					let data = snapShot.data()
					let todos = []
					if (data) {
						for (let key in data) {
							todos.push(data[key])
						}
						this.setState({ todos, areTodosLoaded: true })
					} else {
						this.setState({ areTodosLoaded: true })
					}
				})

				this.context.lists(currentUser.uid).onSnapshot(async snapShot => {
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
					} else {
						let list = await this.addList("My List")
						list.isSelected = true
						this.context.lists(currentUser.uid).set({ [list.id]: list }, { merge: true })
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
		this.context.todos(this.state.user.uid).set(
			{
				[todoId]: todo[0]
			},
			{ merge: true }
		)
	}

	editTodoDescription = (todoId, description) => {
		let todo = this.state.todos.filter(todo => (todo.id === todoId ? todo : false))
		todo[0].description = description

		this.context.todos(this.state.user.uid).set(
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

		this.context.todos(this.state.user.uid).set(
			{
				[todo.id]: todo
			},
			{ merge: true }
		)
	}

	migrationTransferSelectedListFromUserToListsCollection = async (user, lists) => {
		let userCollGrpRef = this.context.db.collectionGroup("users").where('uid', '==', `${user.uid}`)
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
			await this.context.lists(this.state.user.uid).set(jsonLists, { merge: true })

			// Update user
			await this.context.user(this.state.user.uid).update({ selectedList: this.context.deleteField() })
		}
		return
	}

	deleteTodo = todoId => {
		this.context.todos(this.state.user.uid).update({
			[todoId]: this.context.deleteField()
		})
	}

	logOut = async () => {
		await navigate("/")
		await this.context.auth.signOut()
		this.setState({
			user: null,
			todos: [],
			lists: []
		})
	}

	editListName = (listId, listName) => {
		let list = this.state.lists.filter(list => (list.id === listId ? list : false))
		list[0].name = listName

		this.context.lists(this.state.user.uid).set(
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

		await this.context.lists(this.state.user.uid).set(
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
			this.context.lists(this.state.user.uid).update({
				[listId]: this.context.deleteField()
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
		this.context.lists(this.state.user.uid).set(jsonLists, { merge: true })
	}

	render() {
		return (
			<Layout user={this.state.user} logOut={this.logOut} state={this.state}>
				<Router className="d-flex flex-column flex-grow-1">
					<Home path="/" />
					<Login path="/login" />
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
