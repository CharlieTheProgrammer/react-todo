import React, { Component } from "react"
import "./App.css"
import Todo from "./components/Todo/Todo.js"

import { Router, navigate } from "@reach/router"
import { v1 as uuid } from "uuid"

class App extends Component {
	state = {
		todos: []
	}

	todoLead = () => {
		const todosLength = this.state.todos.length
		return (
			<small className="text-secondary">
				You have {todosLength > 1 || todosLength === 0 ? todosLength + " tasks " : todosLength + " task "}
				today.
			</small>
		)
	}

	toggleTodoCompletion = (evt, todoId) => {
		let updatedTodos = this.state.todos.map(todo => {
			if (todo.id === todoId) {
				todo.done = evt.target.checked
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

	render() {
		return (
			<div className="App">
				<h1 className="App-title bg-dark text-light pb-3 pt-2 text-center">To Do</h1>
				<div className="container">
					<header className="mb-3">
						<h1>Today</h1>
						{this.todoLead()}
					</header>
					<section>
						<Todo
							todos={this.state.todos}
							toggleTodoCompletion={this.toggleTodoCompletion}
							deleteTodo={this.deleteTodo}
							addTodo={this.addTodo}
						/>
					</section>
				</div>
			</div>
		)
	}
}

export default App
