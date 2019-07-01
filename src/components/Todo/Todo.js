import React from "react"
import TodoAddItem from './TodoAddItem'
import TodoItem from './TodoItem'

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
                <TodoAddItem addTodo={props.addTodo} />
                <div className="card-body">
                    {
                        props.todos.length > 0 && (
                            props.todos.map(todo => {
                                return (
                                    <TodoItem
                                        todo={todo}
                                        toggleTodoCompletion={props.toggleTodoCompletion}
                                        editTodoDescription={props.editTodoDescription}
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
