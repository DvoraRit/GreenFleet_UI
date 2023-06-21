import React, { useRef } from 'react';
import './pages.scss';
import SideMenu from 'containers/SideMenu/SideMenu';
import Orders from 'containers/Orders/Orders';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

function OrdersPage() {
	const pagRef = useRef();

	const table_name = 'orders_containers';
	return (
		<div className='pageStylePlanning'>
			<div className='sideMenu'>
				<SideMenu isActive={'orders'} />
			</div>
			<div className='mainMenu' style={{ overflowY: 'auto' }} ref={pagRef}>
				<Orders
					table_name={table_name}
					headerIcon={AssignmentIndIcon}
					paginationRef={pagRef}
				/>
			</div>
		</div>
	);
}

export default OrdersPage;
