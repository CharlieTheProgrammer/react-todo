import React from "react"
import { FaSquare, FaCheckSquare, FaCheck, FaTrash } from "react-icons/fa"
import AddTodoItem from './TodoAdd'

const TodoItem = props => {
    const { todo } = props

	const strikeThrough = {
		textDecoration: "line-through"
    }

    let descriptionHtml = (todo.done ?
        <span contentEditable="true" style={strikeThrough}>{todo.description}</span> :
        <span contentEditable="true">{todo.description}</span>
        )

    return (
        <ul className="list-group list-group-horizontal my-2">
        <li className="list-group-item w-100">
            <input className="mr-2" type="checkbox" name="" id="" onChange={ evt => props.toggleTodoCompletion(evt, todo.id)}/>
            {descriptionHtml}
        </li>
        <li
            className="list-group-item border"
            title="Delete Todo Item"
            style={{
                cursor: "pointer"
            }}
            onClick={() => props.deleteTodo(todo.id)}
        >
            <FaTrash className="text-danger" />
        </li>
    </ul>
    )
}

const Todo = (props) => {
	return (
		<div className="card bg-light col-12 col-md-8 col-lg-6 mx-auto">
			<div className="card-body">
				<h5 className="card-title">Tasks</h5>
				<hr />
                <AddTodoItem addTodo={props.addTodo} />
				<div className="card-body">
                    {
                        props.todos.length > 0 && (
                            props.todos.map(todo => {
                                return (
                                    <TodoItem
                                    todo={todo}
                                    toggleTodoCompletion={props.toggleTodoCompletion}
                                    deleteTodo={props.deleteTodo}
                                    key={todo.id}
                                    ></TodoItem>
                            )})
                        )
                    }
				</div>
			</div>
		</div>
	)
}

export default Todo
