import React, { Component } from "react"
import Todos from "../Todos/Todos"
import Lists from "../Lists/Lists"

export default class Workspace extends Component {
	state = {
		selectedList: {},
		searchTerm: ''
	}

	shareSelectedList = (selectedList) => {
		this.setState({ selectedList })
	}

	updateSearchTerm = (searchTerm) => {
		this.setState({searchTerm})
	}

	render() {
		return (
			<div className="d-flex flex-column flex-sm-row flex-grow-1 overflow-hidden">
				<Lists {...this.props} shareSelectedList={this.shareSelectedList} updateSearchTerm={this.updateSearchTerm} />
				<Todos {...this.props} selectedList={this.state.selectedList} searchTerm={this.state.searchTerm} />
			</div>
		)
	}
}
