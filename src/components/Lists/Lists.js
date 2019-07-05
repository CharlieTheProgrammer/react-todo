import React, { Component } from "react"
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
		displayList: true
	}

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
		this.handleWindowResize() // Running this at mount to initialize displayList
		window.addEventListener("resize", this.handleWindowResize)
	}

	componentWillUnmount() {
		window.removeEventListener("resize", this.handleWindowResize)
	}

	render() {
		const { areListsLoaded } = this.props
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
							<img src={this.props.user.photoURL} alt="" width="40px" height="40px" style={imgStyle} />
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
								{this.props.lists.length > 0 &&
									this.props.lists.map(list => {
										return (
											<List
												list={list}
												editListName={this.props.editListName}
												deleteList={this.props.deleteList}
												key={list.id}
												changeSelectedList={this.props.changeSelectedList}
												selectedList={this.props.user.selectedList}
											/>
										)
									})}
								<AddList addList={this.props.addList} />
							</div>
						</CSSTransition>
					</div>
				</CSSTransition>
				{!areListsLoaded && <Loading size={"lg"} />}
			</div>
		)
	}
}
