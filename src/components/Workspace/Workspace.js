import React from "react"
import Todos from "../Todos/Todos"
import Lists from "../Lists/Lists"

export default function Workspace(props) {
	return (
		<div className="d-flex flex-column flex-sm-row flex-grow-1">
			<Lists {...props} />
			<Todos {...props} />
		</div>
	)
}
