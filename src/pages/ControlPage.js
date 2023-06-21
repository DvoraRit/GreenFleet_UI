import React from 'react';
import SideMenu from 'containers/SideMenu/SideMenu';
import Control from 'containers/Control/Control';
import './pages.scss';
import setCurrentPath from '../handler/setCurrentPath'

const ControlPage = () => {
	setCurrentPath(window.location.pathname.toString())
	return (
		<div
			className='pageStyle'
			style={{ display: 'flex', flexDirection: 'row-reverse' }}
		>
			<div className='sideMenu'>
				<SideMenu isActive={'control'} />
			</div>
			<div className='mainMenu'>
				<Control />
			</div>
		</div>
	);
};

export default ControlPage;
