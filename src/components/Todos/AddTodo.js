import React, { Component } from "react"
import { FaPlus } from "react-icons/fa"

export default class TodoAdd extends Component {
	state = {
		description: ""
	}

	onChangeDescription = evt => {
		this.setState({ description: evt.target.value })
	}

	onKeyDown = evt => {
		if (evt.key === "Enter") {
			this.onSubmit(this.state.description)
		}
	}

	onSubmit = () => {
		this.props.addTodo(this.state.description)
		this.setState({ description: "" })
	}

	render() {
		return (
			<section className="my-2">
				<div className="input-group mx-auto">
					<input
						type="text"
						className="form-control"
						id="task"
						placeholder="New Task"
						onChange={e => this.onChangeDescription(e)}
						onKeyDown={e => this.onKeyDown(e)}
						value={this.state.description}
					/>
					<div className="input-group-append">
						<button className="btn btn-primary" onClick={() => this.onSubmit()}>
							<FaPlus />
						</button>
					</div>
				</div>
			</section>
		)
	}
}
