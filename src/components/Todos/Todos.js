import React from "react"
import TodoAddItem from './AddTodo'
import TodoItem from './TodoItem'

const todosStyle ={
    backgroundColor: '#B8C0AB'
}

const TodoLead = (props) => {
    const todosLength = props.todos.length
    return (
        <small className="text-secondary text-light">
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
        <div
            className="d-flex flex-column col-12 col-sm-8 col-md-8 col-lg-9 mx-auto"
            style={todosStyle}
            >
            <h1 className="text-secondary">List name</h1>
            <TodoLead todos={filteredTodos}></TodoLead>
            <div className="card-body">
                <TodoAddItem addTodo={props.addTodo} />
                <hr />
                <h5 className="card-title">Tasks</h5>
                <div className="card-body pt-2">
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
