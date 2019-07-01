import React from "react"
import TodoAddItem from './AddTodo'
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

const Todo = (props) => {
    return (
        <div className="card bg-light col-12 col-sm-8 col-md-8 mx-auto">
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
