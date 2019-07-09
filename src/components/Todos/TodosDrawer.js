import React from "react"
import { CSSTransition } from "react-transition-group"
import { FaRegEnvelope, FaPrint } from "react-icons/fa"

const listsMenuStyles = {
	position: "absolute",
	right: "-15px",
	top: "85px",
	width: "250px",
	height: "150px",
	zIndex: "800",
	backgroundColor: "#9DAFA1"
}

export default function TodosDrawer(props) {
	return (
		<div>
			<CSSTransition
				in={props.showListMenu}
				timeout={1000}
				classNames={{
					enter: "TodosEnter",
					enterActive: "TodosOpen",
					enterDone: "TodosOpen",
					exitActive: "TodosClose",
					exitDone: "TodosClose"
				}}
				mountOnEnter
				unmountOnExit
			>
				<div id="lists-menu" style={listsMenuStyles}>
					<ul className="p-0 text-light" style={{ listStyle: "none" }}>
						<li className="nav-item">
							<button className="text-light d-flex align-items-center link w-100">
								<FaRegEnvelope className="m-2" size={"1.3rem"} />
								<span>Email List</span>
							</button>
						</li>
						<li className="nav-item">
							<button className="text-light d-flex align-items-center link w-100">
								<FaRegEnvelope className="m-2" size={"1.3rem"} />
								<span>Email Selected To-do List</span>
							</button>
						</li>
						<li className="nav-item">
							<button className="text-light d-flex align-items-center link w-100">
								<FaPrint className="m-2" size={"1.3rem"} />
								<span>Print List</span>
							</button>
						</li>
						<li className="nav-item">
							<button className="text-light d-flex align-items-center link w-100">
								<FaPrint className="m-2" size={"1.3rem"} />
								<span>Print Selected To-do</span>
							</button>
						</li>
					</ul>
				</div>
			</CSSTransition>
		</div>
	)
}
