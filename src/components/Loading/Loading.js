import React from 'react'

export default function Loading(props) {
	const {size} = props
	let sizeClass = ''
	switch (size) {
		case 'sm' : sizeClass = 'spinner-grow-sm'; break;
		case 'md' : sizeClass = 'spinner-grow-md'; break;
		case 'lg' : sizeClass = 'spinner-grow-lg'; break;
		default: return '';
	}

	const classes = [
		"spinner-grow",
		size ? `${sizeClass}` : ''

	]
	return (
		<div className="flexCenterAll fillRemainingHeight">
			<div className={classes.join(' ')} role="status">
				<span className="sr-only">Loading...</span>
			</div>
		</div>
	)
}

