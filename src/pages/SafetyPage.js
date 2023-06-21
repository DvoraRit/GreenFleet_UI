import React,{ useRef} from 'react';
import './pages.scss';
import SideMenu from 'containers/SideMenu/SideMenu';
import Safety from 'containers/Safety/Safety';



function SafetyPage() {
	const paginationRef = useRef();

	return (
		<div className='pageStylePlanning'>
			<div className='sideMenu'>
				<SideMenu isActive={'safety'} />
			</div>

			<div
				className='mainMenu'
				style={{ overflowY: 'auto' }}
				ref={paginationRef}
			>
				<Safety paginationRef={paginationRef} />
			</div>
		</div>
	);
}

export default SafetyPage;
