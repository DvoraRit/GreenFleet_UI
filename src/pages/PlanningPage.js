import React from 'react';
import SideMenu from 'containers/SideMenu/SideMenu';
import Planning from 'containers/Planning/Planning';
import setCurrentPath from '../handler/setCurrentPath'
import './pages.scss';

const PlanningPage = () => {

	setCurrentPath(window.location.pathname.toString())
	return (
		<div className='pageStylePlanning'>
			<div className='sideMenu'>
				<SideMenu isActive={"planning"} />
			</div>
			<div className='mainMenu'>
				<Planning />
			</div>
		</div>
	);
};

export default PlanningPage;
