import React from 'react';
import './ModalFooter.scss';

function ModalFooter({ action, label }) {
	return (
		<div className='modal-btn'>
			<div onClick={action}>{label}</div>
		</div>
	);
}

export default ModalFooter;
