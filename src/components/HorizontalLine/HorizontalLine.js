import React from 'react';

function HorizontalLine({ style }) {
	return (
		<div
			style={{
				minHeight: 1,
				minWidth: '100%',
				backgroundColor: 'rgba(192,200,217,0.38)',
				...style,
			}}
		/>
	);
}

export default HorizontalLine;
