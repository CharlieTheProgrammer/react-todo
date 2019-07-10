import React from "react"


const Header = (props) => {
	return (
		<div className="d-flex justify-content-between px-2">
			<h1 className="text-secondary pb-1 pt-2 text-center ml-2">
                <a href="/" className="brand-style" >Wunderlist</a>
            </h1>
		</div>
	)
}

export default Header
