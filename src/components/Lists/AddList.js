import React, { Component } from "react"
import { FaPlus } from "react-icons/fa"

export default class AddList extends Component {
	state = {
		description: ""
	}

	onChangeDescription = evt => {
		this.setState({ description: evt.target.value })
	}

	onKeyDown = evt => {
		if (evt.key === "Enter") {
			this.props.addList(evt)
			this.setState({
				description: ''
			})
		}
	}

	onBlur = evt => {
		this.props.addList(evt)
		this.setState({
			description: ''
		})
	}

	render() {
		return (
			<div className="input-group mx-auto bg-warning">
				<div className="input-group-prepend">
					<button className="btn" disabled>
						<FaPlus size={".75rem"} />
					</button>
				</div>
				<input
					type="text"
					className="col-10 border-0 bg-transparent"
					id="task"
					placeholder="New List"
					onChange={e => this.onChangeDescription(e)}
					onBlur={e => this.onBlur(e)}
					onKeyDown={e => this.onKeyDown(e)}
					value={this.state.description}
				/>
			</div>
		)
	}
}
