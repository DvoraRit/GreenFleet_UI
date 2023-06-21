import React from 'react';
import './ToastBody.scss';

const ToastBody = ({ title }) => {
	return (
		<div>
			<div>{title}</div>
			{/* <div
				onClick={() => cancleAssignedOrders()}
				className='cancel-button-toast'
			>
				{t('requirementsModal.cancel')}
			</div> */}
		</div>
	);
};

export default ToastBody;
