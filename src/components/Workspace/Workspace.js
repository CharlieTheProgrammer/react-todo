import React from "react"
import Todos from "../Todos/Todos"
import Lists from "../Lists/Lists"

const imgStyle = {
	borderRadius: "10px"
}

export default function Workspace(props) {
	return (
		<div className="d-flex flex-wrap">
			<section className="col-12 d-flex justify-content-between align-content-center mb-5">
				<h2 className="m-0 p-0">Welcome {props.user.displayName}</h2>
				<img src={props.user.photoURL} alt="" width="40px" height="40px" style={imgStyle} />
			</section>

			<Lists {...props} />
			<Todos {...props} />
		</div>
	)
}
