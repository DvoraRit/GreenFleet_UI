import React, { useRef } from 'react';
import './pages.scss';
import SideMenu from 'containers/SideMenu/SideMenu';
import Entities from 'containers/Entitis/Entitis';
function EntitiesPage() {
	const paginationRef = useRef();

	return (
		<div
			className='pageStyle'
			style={{ display: 'flex', flexDirection: 'row-reverse' }}
		>
			<div className='sideMenu'>
				<SideMenu isActive={'entities'} />
			</div>
			<div
				className='mainMenu'
				style={{ overflowY: 'auto' }}
				ref={paginationRef}
			>
				<Entities paginationRef={paginationRef} />
			</div>
		</div>
	);
}

export default EntitiesPage;
