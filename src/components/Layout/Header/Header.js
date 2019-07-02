import React from "react"
import {navigate} from '@reach/router'

const Header = (props) => {
	return (
		<div className="d-flex justify-content-between px-2">
			<h1 className="text-secondary pb-1 pt-2 text-center ml-2">
                <a href="/">YATOP</a>
            </h1>
			{props.user && (
				<button className="btn btn-primary my-3" onClick={() => props.logOut()}>
					Log out
				</button>
			)}
		</div>
	)
}

export default Header
