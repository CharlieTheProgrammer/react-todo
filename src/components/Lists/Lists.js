import React, { Component } from "react"
import FirebaseContext from "../../services/Firebase/context"
import { v1 as uuid } from "uuid"
import AddList from "./AddList"
import List from "./List"
import Loading from "../Loading/Loading"
import { CSSTransition } from "react-transition-group"
import "./Lists.css"
import { IoIosMenu, IoIosClose, IoIosSearch } from "react-icons/io"
const listsStyles = {
	backgroundColor: "#FAF9F8"
}

const imgStyle = {
	borderRadius: "35px",
	width: "40px",
	height: "40px"
}

export default class Lists extends Component {
	state = {
		lists: [],
		displayListOnMobile: false,
		areListsLoaded: false,
		isSearchBarFocused: false,
		listNavClasses: ["px-0"]
	}

	static contextType = FirebaseContext

	componentDidMount() {
		this.setState({ areListsLoaded: false })
		this.handleWindowResize() // Running this at mount to initialize isMobileScreen
		window.addEventListener("resize", this.handleWindowResize)

		this.offSnapshot = this.context.lists(this.props.uid).onSnapshot(async snapShot => {
			let data = snapShot.data()
			let lists = []
			if (data && Object.keys(data).length > 0) {
				for (let key in data) {
					lists.push(data[key])
					if (data[key].isSelected) {
						this.props.shareSelectedList(data[key])
					}
				}
				this.setState({ lists, areListsLoaded: true })
			} else {
				let list = await this.addList("My List")
				list.isSelected = true
				this.context.lists(this.props.uid).set({ [list.id]: list }, { merge: true })
			}
		})
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.handleWindowResize)
		this.offSnapshot()
	}

	editListName = (listId, listName) => {
		let list = this.state.lists.filter(list => (list.id === listId ? list : false))
		list[0].name = listName

		this.context.lists(this.props.uid).set(
			{
				[listId]: list[0]
			},
			{ merge: true }
		)
	}

	addList = async listName => {
		if (listName === "") {
			return
		}

		let list = {
			id: uuid(),
			name: listName,
			isSelected: false
		}

		await this.context.lists(this.props.uid).set({ [list.id]: list }, { merge: true })
		return list
	}

	deleteList = listId => {
		if (this.state.lists.length === 1) {
			window.alert("You must have at least one todo list.")
			return
		}
		let doDeleteList = window.confirm("Are you sure you want to delete this list? \n\nThis action cannot be undone.")

		if (doDeleteList) {
			this.context.lists(this.props.uid).update({
				[listId]: this.context.deleteField()
			})
		}
		return
	}

	changeSelectedList = selectedListId => {
		const { lists } = this.state
		// Update the lists to mark a new one as isSelected
		let updatedLists = lists.map(list => {
			list.id === selectedListId ? (list.isSelected = true) : (list.isSelected = false)
			return list
		})

		// convert array to json object
		let jsonLists = {}
		updatedLists.forEach(list => (jsonLists[list.id] = list))

		// Update firebase DB
		this.context.lists(this.props.uid).set(jsonLists, { merge: true })
	}

	toggleDisplayListOnMobileScreen = () => {
		this.setState({
			displayListOnMobile: !this.state.displayListOnMobile
		})
	}

	handleWindowResize = () => {
		// This is BS4 XS breakpoint
		if (window.innerWidth > 576) {
			this.setState({ displayListOnMobile: true })
		} else {
			let updatedClasses = this.state.listNavClasses.map(listNavclass => listNavclass !== "collapsed")
			this.setState({ displayListOnMobile: false, listNavClasses: updatedClasses })
		}
	}

	toggleSearchBarFocus = () => {
		if (this.state.isSearchBarFocused) {
			this.searchInput.blur()
		} else {
			this.searchInput.focus()
		}
		this.setState({ isSearchBarFocused: !this.state.isSearchBarFocused })
	}

	toggleListNavCollapse = () => {
		let isListNavCollapsed = this.state.listNavClasses.includes("collapsed")

		if (isListNavCollapsed) {
			let updatedClasses = this.state.listNavClasses.map(listNavclass => listNavclass !== "collapsed")
			this.setState({ listNavClasses: updatedClasses })
		} else {
			let updatedClasses = this.state.listNavClasses.slice(0)
			updatedClasses.push("collapsed")
			this.setState({ listNavClasses: updatedClasses })
		}
	}

	SearchBar = () => {
		const {isSearchBarFocused} =  this.state

		return (
			<section className="d-flex justify-content-between align-items-center">
				<div className="ml-2 mr-1 pointerOnHover">
					<IoIosMenu size={"2rem"} className="d-none d-sm-block" onClick={() => this.toggleListNavCollapse()} />
					<IoIosMenu size={"2rem"} className="d-sm-none" onClick={() => this.toggleDisplayListOnMobileScreen()} />
				</div>
				<div className="lists-nav-searchbar w-100 px-2">
					<input type="text" className="w-100" name="search" id="search" ref={search => (this.searchInput = search)} />
				</div>
				<div className="lists-nav-searchbar-focustoggle mx-1 pointerOnHover">
					{isSearchBarFocused ? (
						<IoIosClose size={"2rem"} onClick={() => this.toggleSearchBarFocus()} />
					) : (
						<IoIosSearch size={"2rem"} onClick={() => this.toggleSearchBarFocus()} />
					)}
				</div>
			</section>
		)
	}

	UserToolBar = () => {
		const { displayName, photoURL } = this.props.user

		return (
			<section className=" d-flex align-items-center mt-1 ml-1 mb-2">
				{photoURL && <img src={photoURL} alt="You" className="mx-1" style={imgStyle} />}
				<p className="lists-nav-displayname m-0 pl-2">{displayName}</p>
			</section>
		)
	}

	render() {
		const { areListsLoaded, lists, listNavClasses, displayListOnMobile } = this.state

		return (
			<div id="lists-nav" className={listNavClasses.join(" ")} style={listsStyles}>
				<CSSTransition
					in={areListsLoaded}
					timeout={1000}
					classNames={{
						enter: "ListsEnter",
						enterActive: "ListsOpen",
						enterDone: "ListsOpen"
					}}
					unmountOnExit
					mountOnEnter
				>
					<div>
						{this.SearchBar()}
						{this.UserToolBar()}
						<CSSTransition
							in={displayListOnMobile}
							timeout={1000}
							classNames={{
								enter: "ListsEnter",
								enterActive: "ListsOpen",
								enterDone: "ListsOpen",
								exitActive: "ListsClose",
								exitDone: "ListsClose"
							}}
							unmountOnExit
							mountOnEnter
						>
							<div>
								<div className="lists-nav-lists">
									{lists.length > 0 &&
										lists.map(list => {
											return (
												<List
													list={list}
													editListName={this.editListName}
													deleteList={this.deleteList}
													key={list.id}
													changeSelectedList={this.changeSelectedList}
												/>
											)
										})}
									<AddList addList={this.addList} />
								</div>
							</div>
						</CSSTransition>
					</div>
				</CSSTransition>
				{!areListsLoaded && <Loading size={"lg"} />}
			</div>
		)
	}
}
