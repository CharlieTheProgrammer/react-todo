import React from 'react'
import { FaList, FaTrashAlt } from "react-icons/fa"

const selectedListStyle = {
    backgroundColor: "#C9E5FD"
}
// On single-click, select list
// On double-click set contentEditable.
// On blur, disable contenEditable and edit list name
export default function List(props) {
    return (
        <div
            className="input-group mx-auto d-flex flex-row"
            style={props.selectedList === props.list.id?
                selectedListStyle: null}
            >
            <div className="input-group-prepend" onClick={e => props.changeSelectedList(e, props.list.id)}>
                <button className="btn" disabled>
                    <FaList size={".75rem"} />
                </button>
            </div>
            <div
                contentEditable
                suppressContentEditableWarning
                type="text"
                className="col-8 col-lg-9 col-xl-10 my-1 d-flex align-self-center p-0"
                onBlur={e => props.editListName(props.list.id, e.target.innerText)}
            >{props.list.name}
            </div>
            <div className="input-group-append">
                <button className="btn text-danger" onClick={e => props.deleteList(props.list.id)}>
                    <FaTrashAlt size={".75rem"} />
                </button>
            </div>
        </div>
    )
}
