import React from "react"
import Todos from "../Todos/Todos"
import Lists from "../Lists/Lists"

const imgStyle = {
	borderRadius: "10px"
}

export default function Workspace(props) {
	return (
		<div className="d-flex flex-wrap flex-grow-1">
			<Lists {...props} />
			<Todos {...props} />
		</div>
	)
}
