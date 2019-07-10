import React from "react"
import { CSSTransition } from "react-transition-group"

const listsDrawerStyles = {
	position: "absolute",
	left: "8px",
	top: "85px",
	width: "225px",
	height: "242px",
	zIndex: "800",
	backgroundColor: "#FFF",
	boxShadow: '0 2px 2px 0 rgba(0,0,0,0.14), 0 3px 1px -2px rgba(0,0,0,0.12), 0 1px 5px 0 rgba(0,0,0,0.2)'
}

export default function ListsDrawer(props) {
	return (
		<div>
			<CSSTransition
				in={props.showListsDrawer}
				timeout={1000}
				classNames={{
					enter: "ListsEnter",
					enterActive: "ListsOpen",
					enterDone: "ListsOpen",
					exitActive: "ListsClose",
					exitDone: "ListsClose"
				}}
				mountOnEnter
				unmountOnExit
			>
				<div id="lists-menu" style={listsDrawerStyles}>
					<ul className="p-0" style={{ listStyle: "none" }}>
						<li>
							<button className="btn-list-drawer text-left px-3 py-2 w-100">
								<span>Account Settings</span>
							</button>
						</li>
						<li>
							<button className="btn-list-drawer text-left px-3 py-2 w-100">
								<span>Change Background</span>
							</button>
						</li>
						<li>
							<button className="btn-list-drawer text-left px-3 py-2 w-100">
								<span>Restore deleted lists</span>
							</button>
						</li>
						<hr className="my-0"/>
						<li>
							<button className="btn-list-drawer text-left px-3 py-2 w-100">
								<span>Love Wunderlist?</span>
							</button>
						</li>
						<hr className="my-0"/>
						<li>
							<button className="btn-list-drawer text-left px-3 py-2 w-100">
								<span>Email address</span>
							</button>
						</li>
						<li>
							<button className="btn-list-drawer text-left px-3 py-2 w-100" onClick={() => props.logOut()}>
								<span>Sign Out</span>
							</button>
						</li>
					</ul>
				</div>
			</CSSTransition>
		</div>
	)
}
