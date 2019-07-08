import React, { Component } from "react"
import Todos from "../Todos/Todos"
import Lists from "../Lists/Lists"

export default class Workspace extends Component {
	state = {
		selectedList: {}
	}

	shareSelectedList = (selectedList) => {
		this.setState({ selectedList })
	}

	render() {
		return (
			<div className="d-flex flex-column flex-sm-row flex-grow-1">
				<Lists {...this.props} shareSelectedList={this.shareSelectedList} />
				<Todos {...this.props} selectedList={this.state.selectedList} />
			</div>
		)
	}
}
