import React from 'react';
import mapBgSrc from 'assets/images/mapBg.png';

const MapBackground = ({ ...props }) => {
	return (
		<div className='map-bg-container'>
			<img src={mapBgSrc} alt='mapBg' className='map-bg' {...props}></img>
		</div>
	);
};

export default MapBackground;
