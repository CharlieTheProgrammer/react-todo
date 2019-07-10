import React from "react"
import Header from "./Header/Header"
import Footer from './Footer/Footer'

const Layout = props => {
	return (
		<div className="content d-flex flex-column fillRemainingHeight">
			{window.location.pathname.indexOf('workspace') < 0 ?
				<div className="navigation">
					<Header user={props.user} logOut={props.logOut} />
				</div>
				: null
			}
			<div className="main d-flex flex-column flex-grow-1">{props.children}</div>
			<div className="footer">
                <Footer></Footer>
            </div>
		</div>
	)
}

export default Layout
