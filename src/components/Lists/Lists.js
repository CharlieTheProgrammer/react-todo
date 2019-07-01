import React from "react"
import AddList from './AddList'
import List from './List'

export default function Lists(props) {
	return (
		<div className="col-4 border py-5 px-0">
			{
				props.lists.length > 0 && (
					props.lists.map(list => {
						return (
							<List
								list={list}
								editListName={props.editListName}
								key={list.id}
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
