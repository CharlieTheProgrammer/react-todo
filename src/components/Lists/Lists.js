import React, { Component } from "react"
import FirebaseContext from "../../services/Firebase/context"
import { v1 as uuid } from "uuid"
import AddList from "./AddList"
import List from "./List"
import Loading from "../Loading/Loading"
import { CSSTransition } from "react-transition-group"
import "./Lists.css"
import { IoIosMenu } from "react-icons/io"
const listsStyles = {
	backgroundColor: "#FAF9F8"
}

const imgStyle = {
	borderRadius: "35px"
}

export default class Lists extends Component {
	state = {
		lists: [],
		displayList: true,
		areListsLoaded: false
	}

	static contextType = FirebaseContext

	toggleDisplayList = () => {
		this.setState({
			displayList: !this.state.displayList
		})
	}

	handleWindowResize = () => {
		// This is BS4 XS breakpoint
		if (window.innerWidth > 576) {
			this.setState({ displayList: true })
		} else {
			this.setState({ displayList: false })
		}
	}

	componentDidMount() {
		this.setState({ areListsLoaded: false })
		this.handleWindowResize() // Running this at mount to initialize displayList
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

	render() {
		const { areListsLoaded, lists } = this.state
		return (
			<div className="col-sm-4 col-md-4 col-lg-3 px-0" style={listsStyles}>
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
						<section className=" d-flex align-items-center mt-1 ml-1 mb-2">
							{this.props.user.photoURL && (
								<img src={this.props.user.photoURL} alt="" width="40px" height="40px" style={imgStyle} />
							)}
							<p className="m-0 pl-2">{this.props.user.displayName}</p>
							<IoIosMenu size={"2rem"} className="d-sm-none ml-auto mr-2" onClick={() => this.toggleDisplayList()} />
						</section>
						<CSSTransition
							in={this.state.displayList}
							timeout={800}
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
						</CSSTransition>
					</div>
				</CSSTransition>
				{!areListsLoaded && <Loading size={"lg"} />}
			</div>
		)
	}
}
