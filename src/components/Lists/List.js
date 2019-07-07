import React from "react"
import { FaList, FaTrashAlt } from "react-icons/fa"

const selectedListStyle = {
	backgroundColor: "#C9E5FD"
}
// On single-click, select list
// On double-click set contentEditable.
// On blur, disable contenEditable and edit list name
export default function List(props) {
	return (
		<div className="mx-auto d-flex flex-row" style={props.list.isSelected ? selectedListStyle : null}>
			<div
				className="d-flex align-items-center"
				onClick={e => props.changeSelectedList(e, props.list.id)}
				title="Select list"
			>
				<button className="btn" disabled>
					<FaList size={".75rem"} />
				</button>
			</div>
			<div
				title="Edit list name"
				contentEditable
				suppressContentEditableWarning
				type="text"
				className="my-1 d-flex align-self-center flex-grow-1 p-0"
				onBlur={e => props.editListName(props.list.id, e.target.innerText)}
			>
				{props.list.name}
			</div>
			<button className="btn text-danger" onClick={e => props.deleteList(props.list.id)} title="Delete list">
				<FaTrashAlt size={".75rem"} />
			</button>
		</div>
	)
}
