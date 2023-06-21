import React from 'react';
import './ModalComponents.scss';
import modalClose from 'containers/Planning/PlanningBody/Tasks/images/modalClose.png';

const ModalHeader = ({ toggle, title }) => {
	return (
		<div className='generic-modal-header'>
				<div className='header-title'>{title}</div>
			<img
				src={modalClose}
				alt='close'
				className='modal-header-icon'
				onClick={toggle}
			/>
		</div>
	);
};

export default ModalHeader;
