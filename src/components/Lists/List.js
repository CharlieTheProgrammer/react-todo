import React from 'react'
import { FaList } from "react-icons/fa"

export default function List(props) {
    return (
        <div className="input-group mx-auto d-flex">
            <div className="input-group-prepend">
                <button className="btn" disabled>
                    <FaList size={".75rem"} />
                </button>
            </div>
            <div
                contentEditable
                suppressContentEditableWarning
                type="text"
                className="col-10 my-1 d-flex align-self-center"
                onBlur={e => props.editListName(props.list.id, e.target.innerText)}
            >{props.list.name}</div>
        </div>
    )
}
