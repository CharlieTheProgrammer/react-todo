import React from "react"
import TodoAddItem from "./AddTodo"
import TodoItem from "./TodoItem"
import Loading from "../Loading/Loading"
import { CSSTransition } from "react-transition-group"
import './Todos.css'

const todosStyle = {
	backgroundColor: "#B8C0AB"
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

const Todo = props => {
	const { todos, areTodosLoaded, selectedList } = props
	let filteredTodos = todos.filter(todo => todo.listId === selectedList.id)

	return (
		<div className="d-flex flex-column col-sm-8 col-md-8 col-lg-9 mx-auto flex-grow-1" style={todosStyle}>
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
					<h1 className="text-secondary my-2">{props.selectedList.name || (<Loading></Loading>)}</h1>
					<TodoLead todos={filteredTodos} />
					<div className="card-body">
						<TodoAddItem addTodo={props.addTodo} />
						<hr />
						<h5 className="card-title">Tasks</h5>
						<div className="card-body pt-2">
							{filteredTodos.length > 0 &&
								filteredTodos.map(todo => {
									return (
										<TodoItem
											todo={todo}
											toggleTodoCompletion={props.toggleTodoCompletion}
											editTodoDescription={props.editTodoDescription}
											deleteTodo={props.deleteTodo}
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

export default Todo