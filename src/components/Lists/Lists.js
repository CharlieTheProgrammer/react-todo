import React from "react"
import AddList from './AddList'
import List from './List'

export default function Lists(props) {
	return (
		<div className="col-12 col-sm-4 col-md-4 col-lg-3 py-5 px-0">
			{
				props.lists.length > 0 && (
					props.lists.map(list => {
						return (
							<List
								list={list}
								editListName={props.editListName}
								deleteList={props.deleteList}
								key={list.id}
								changeSelectedList={props.changeSelectedList}
								selectedList={props.user.selectedList}
							></List>
						)
					})
				)
			}
			<AddList
				addList={props.addList}
			></AddList>
		</div>
	)
}
