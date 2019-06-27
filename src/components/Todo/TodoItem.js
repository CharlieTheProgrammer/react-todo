import React from "react"
import { FaTrash, FaRegSquare, FaRegCheckSquare } from "react-icons/fa"

const TodoItem = props => {
	const { todo } = props

	const strikeThrough = {
		textDecoration: "line-through"
	}

	let descriptionHtml = todo.done ? (
		<span contentEditable="true" style={strikeThrough} suppressContentEditableWarning="true">
			{todo.description}
		</span>
	) : (
		<span contentEditable="true" suppressContentEditableWarning="true">
			{todo.description}
		</span>
	)

	return (
		<ul className="list-group list-group-horizontal my-2">
			<li className="list-group-item w-100">
				{todo.done ? (
					<FaRegCheckSquare size="1.25rem" className="mr-2" onClick={evt => props.toggleTodoCompletion(evt, todo.id)} />
				) : (
					<FaRegSquare size="1.25rem" className="mr-2" onClick={evt => props.toggleTodoCompletion(evt, todo.id)} />
				)}
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

export default TodoItem
