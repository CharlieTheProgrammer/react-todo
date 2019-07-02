import React from "react"
import AddList from "./AddList"
import List from "./List"

const listsStyles = {
	backgroundColor: "#FAF9F8"
}

const imgStyle = {
	borderRadius: "35px"
}

export default function Lists(props) {
	return (
		<div className="col-12 col-sm-4 col-md-4 col-lg-3 px-0" style={listsStyles}>
			<section className=" d-flex align-items-center mt-1 ml-1 mb-2">
				<img src={props.user.photoURL} alt="" width="40px" height="40px" style={imgStyle} />
				<p className="m-0 pl-2">{props.user.displayName}</p>
			</section>
			{props.lists.length > 0 &&
				props.lists.map(list => {
					return (
						<List
							list={list}
							editListName={props.editListName}
							deleteList={props.deleteList}
							key={list.id}
							changeSelectedList={props.changeSelectedList}
							selectedList={props.user.selectedList}
						/>
					)
				})}
			<AddList addList={props.addList} />
		</div>
	)
}
