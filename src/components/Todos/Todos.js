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
    const {todos} = props
    const {selectedList} = props.user

    let filteredTodos = todos.filter(todo => todo.listId === selectedList)

    return (
        <div className="card bg-light col-12 col-sm-8 col-md-8 mx-auto">
            <h1>Today</h1>
            <TodoLead todos={filteredTodos}></TodoLead>
            <div className="card-body">
                <h5 className="card-title">Tasks</h5>
                <hr />
                <TodoAddItem addTodo={props.addTodo} />
                <div className="card-body">
                    {
                        filteredTodos.length > 0 && (
                            filteredTodos.map(todo => {
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
