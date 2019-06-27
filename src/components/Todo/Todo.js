import React from "react"
import { FaSquare, FaCheckSquare, FaTrash, FaRegSquare, FaRegCheckSquare } from "react-icons/fa"
import AddTodoItem from './TodoAdd'
import { navigate, redirectTo } from "@reach/router/lib/history";

const TodoItem = props => {
    const { todo } = props

    const strikeThrough = {
        textDecoration: "line-through"
    }

    let descriptionHtml = (todo.done ?
        <span contentEditable="true" style={strikeThrough} suppressContentEditableWarning="true" >{todo.description}</span> :
        <span contentEditable="true" suppressContentEditableWarning="true" >{todo.description}</span>
    )

    return (
        <ul className="list-group list-group-horizontal my-2">
            <li className="list-group-item w-100">
                <input className="mr-2" type="checkbox" name="" id="" onChange={evt => props.toggleTodoCompletion(evt, todo.id)} />
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
                <FaRegCheckSquare></FaRegCheckSquare>
                <FaRegSquare></FaRegSquare>
            </li>
        </ul>
    )
}

const TodoLead = (props) => {
    const todosLength = props.todos.length
    return (
        <small className="text-secondary">
            You have {todosLength > 1 || todosLength === 0 ? todosLength + " tasks " : todosLength + " task "}
            today.
        </small>
    )
}
const imgStyle = {
    borderRadius: "10px"
}

const Todo = (props) => {
    return (
        <div className="card bg-light col-12 col-md-8 col-lg-6 mx-auto">
            <section className="d-flex justify-content-between align-content-center">
                <h2 className="m-0 p-0">Welcome {props.user.displayName}</h2>
                <img src={props.user.photoURL} alt="" width="50px" height="50px" style={imgStyle} />
            </section>
            <h1>Today</h1>
            <TodoLead todos={props.todos}></TodoLead>
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
                                )
                            })
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Todo
