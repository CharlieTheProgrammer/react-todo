import React from "react"
import { FaCopyright } from "react-icons/fa"

const footerStyle = {
	backgroundColor: "#F2F2F2"
}

const Footer = props => {
	return (
		<div className="text-center lead py-2" style={footerStyle}>
			<small>
				<FaCopyright /> Charlie The Programmer {new Date().getFullYear()}
			</small>
		</div>
	)
}

export default Footer
