import React from "react"
import { FaList } from "react-icons/fa"
import { navigate } from "@reach/router"

const Home = (props) => {
	return (
		<section className="d-flex flex-column align-items-center">
			<FaList size="50px" />
			<h2>YATOP (Yet Another To Do App)</h2>
			<p className="lead">
				Keep track of all your stuff in <strong>Y</strong>et <strong>A</strong>nother <strong>T</strong>o <strong>D</strong>
				o <strong>A</strong>pp.
			</p>
			<button className="btn btn-lg btn-primary px-5" onClick={() => navigate('/login')}>
				Sign In
			</button>
		</section>
	)
}

export default Home
