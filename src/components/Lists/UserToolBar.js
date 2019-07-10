import React from "react"
import ListsDrawer from "./ListsDrawer";
import { IoIosMenu, IoIosClose, IoIosSearch } from "react-icons/io"

const imgStyle = {
	borderRadius: "35px",
	width: "40px",
	height: "40px"
}

let searchInput = {}

export default function UserToolBar(props) {
	const { displayName, photoURL } = props.user

	return (
		<>
			<section className="d-flex my-2 justify-content-between align-items-center">
				<div className="ml-2 mr-1 pointerOnHover">
					<IoIosMenu size={"2rem"} className="d-none d-sm-block" onClick={() => props.toggleListNavCollapse()} />
					<IoIosMenu size={"2rem"} className="d-sm-none" onClick={() => props.toggleDisplayListOnMobileScreen()} />
				</div>
				<div className="lists-nav-searchbar w-100 px-2">
					<input type="text" className="w-100 bg-transparent border-0" name="search" id="search" ref={search => (searchInput = search)} />
				</div>
				<div className="lists-nav-searchbar-focustoggle mx-1 pointerOnHover">
					{props.isSearchBarFocused ? (
						<IoIosClose size={"2rem"} onClick={() => props.toggleSearchBarFocus(searchInput)} />
					) : (
							<IoIosSearch size={"2rem"} onClick={() => props.toggleSearchBarFocus(searchInput)} />
						)}
				</div>
			</section>
			<section className=" d-flex align-items-center mt-1 ml-1 mb-2">
				{photoURL && <img src={photoURL} alt="You" className="mx-1" style={imgStyle} />}
				<p className="lists-nav-displayname m-0 pl-2 pointerOnHover" onClick={() => props.toggleListsDrawer()}>{displayName}</p>
			</section>
			<ListsDrawer showListsDrawer={props.showListsDrawer} logOut={props.logOut}></ListsDrawer>
		</>
	)
}
