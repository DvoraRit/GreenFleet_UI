import React, { useRef } from 'react';
import SideMenu from 'containers/SideMenu/SideMenu';
import Hr_Issues from 'containers/HR/HR';


import './pages.scss';

const HRPage = () => {
	const paginationRef = useRef();

	return (
		<div className='pageStylePlanning' >
			<div className='sideMenu'>
				<SideMenu isActive={"HR"} />
			</div>
			<div className='mainMenu'>
				<Hr_Issues paginationRef={paginationRef} />
			</div>
		</div>
	);
};

export default HRPage;