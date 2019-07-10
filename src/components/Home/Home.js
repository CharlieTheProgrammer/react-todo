import React from "react"
import { FaCheck } from "react-icons/fa"
import { navigate } from "@reach/router"
import image from '../../assets/img/desktop.jpg'
import './Home.css'

const imgStyle = {
	maxWidth: '896px',
    maxHeight: '581px',
    marginRight: '-400px'
}

const Home = props => {
	return (
		<section className="flexCenterAll flex-column flex-grow-1 overflow-hidden">
			<div className="row w-100">
				<div className="col-6 flexCenterAll flex-column text-center">
					<FaCheck size={'4rem'} className="mb-3 fa-icon" />
					<h1 className="display-4 mb-4">Wunderlist</h1>
					<p className="lead mb-4 w-50">
						Keep track of all your stuff in <strong>Y</strong>et <strong>A</strong>nother <strong>T</strong>o <strong>D</strong>o <strong>A</strong>pp.
					</p>
					<button className="btn btn-lg btn-primary px-5" onClick={() => navigate("/login")}>
						Sign In
					</button>
				</div>
				<div className="col-6">
					<img src={image} alt="" style={imgStyle}/>
				</div>
			</div>
		</section>
	)
}

export default Home
