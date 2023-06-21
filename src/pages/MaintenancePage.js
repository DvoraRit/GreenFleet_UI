import React, { useRef } from 'react';
import SideMenu from 'containers/SideMenu/SideMenu';
import Maintenance from 'containers/Maintenance/Maintenance';

import './pages.scss';

const MaintenancePage = () => {
	const paginationRef = useRef();

	return (
		<div className='pageStylePlanning'>
			<div className='sideMenu'>
				<SideMenu isActive={'maintenance'} />
			</div>
			<div
				className='mainMenu'
				style={{ overflowY: 'auto' }}
				ref={paginationRef}
			>
				<Maintenance paginationRef={paginationRef} />
			</div>
		</div>
	);
};

export default MaintenancePage;
