import React, { Component } from "react"
import { v1 as uuid } from "uuid"
import { FirebaseContext } from '../../services/Firebase/firebase'
import TodoAddItem from "./AddTodo"
import TodoItem from "./TodoItem"
import Loading from "../Loading/Loading"
import { CSSTransition } from "react-transition-group"
import './Todos.css'
import image from '../../assets/img/eiffel.jpg'

const todosBackground = {
	backgroundColor: "#FFF",
	backgroundImage: `url(${image})`,
	backgroundSize: 'cover',
	backgroundRepeat: 'no-repeat',
	backgroundPosition: 'center top'
}


const TodoLead = props => {
	const todosLength = props.todos.length
	return (
		<small className="text-secondary text-light">
			You have {todosLength > 1 || todosLength === 0 ? todosLength + " tasks " : todosLength + " task "}
			today.
		</small>
	)
}

export default class Todos extends Component {
	state = {
		todos: [],
		areTodosLoaded: false,
	}

	static contextType = FirebaseContext

	componentDidMount() {
		this.offSnapshot = this.context.todos(this.props.uid).onSnapshot(snapShot => {
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
	}

	componentWillUnmount() {
		this.offSnapshot()
	}

	toggleTodoCompletion = (evt, todoId) => {
		let todo = this.state.todos.filter(todo => (todo.id === todoId ? todo : false))
		todo[0].done = !todo[0].done
		this.context.todos(this.props.uid).set(
			{
				[todoId]: todo[0]
			},
			{ merge: true }
		)
	}

	editTodoDescription = (todoId, description) => {
		let todo = this.state.todos.filter(todo => (todo.id === todoId ? todo : false))
		todo[0].description = description

		this.context.todos(this.props.uid).set(
			{
				[todoId]: todo[0]
			},
			{ merge: true }
		)
	}

	addTodo = description => {
		const { selectedList } = this.props
		let todo = {
			id: uuid(),
			description,
			done: false,
			listId: selectedList.id
		}

		this.context.todos(this.props.uid).set(
			{
				[todo.id]: todo
			},
			{ merge: true }
		)
	}

	deleteTodo = todoId => {
		this.context.todos(this.props.uid).update({
			[todoId]: this.context.deleteField()
		})
	}

	render() {
		const { selectedList } = this.props
		const { todos, areTodosLoaded } = this.state
		let filteredTodos = todos.filter(todo => todo.listId === selectedList.id)
		return (
			<div className="d-flex flex-column px-3 mx-auto flex-grow-1" style={{...todosBackground, width: '100%'}}>
				<CSSTransition
					in={areTodosLoaded && !!selectedList}
					timeout={1000}
					classNames={{
						enter: "TodosEnter",
						enterActive: "TodosOpen",
						enterDone: "TodosOpen"
					}}
					unmountOnExit
					mountOnEnter
				>
					<div>
						<h2 className="text-light my-2">{selectedList.name || (<Loading></Loading>)}</h2>
						<TodoLead todos={filteredTodos} />
						<div className="card-body">
							<TodoAddItem addTodo={this.addTodo} />
							<hr />
							<h5 className="card-title">Tasks</h5>
							<div className="card-body pt-2">
								{filteredTodos.length > 0 &&
									filteredTodos.map(todo => {
										return (
											<TodoItem
												todo={todo}
												toggleTodoCompletion={this.toggleTodoCompletion}
												editTodoDescription={this.editTodoDescription}
												deleteTodo={this.deleteTodo}
												key={todo.id}
											/>
										)
									})}
							</div>
						</div>
					</div>
				</CSSTransition>
				{(!areTodosLoaded || !selectedList) && <Loading size={"lg"} />}
			</div>
		)
	}
}