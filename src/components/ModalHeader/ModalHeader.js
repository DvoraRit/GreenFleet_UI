import React from 'react';
import modalClose from 'containers/Planning/PlanningBody/Tasks/images/modalClose.png';
import './ModalHeader.scss';

function ModalHeader({ toggle, children , style}) {
	return (
		<div className='modalResourceChangesHeader-main' style={{...style}}>
			{children}
			{toggle && (
				<img
					src={modalClose}
					alt='close'
					className='modalResourceChangesHeader-icon'
					onClick={toggle}
				/>
			)}
		</div>
	);
}

export default ModalHeader;
