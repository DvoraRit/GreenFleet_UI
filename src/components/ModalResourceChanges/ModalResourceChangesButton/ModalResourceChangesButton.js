import React from 'react';
import './ModalResourceChangesButton.scss';
import Spinner from 'components/Spinner/Spinner';

const ModalResourceChangesButton = ({ action, dirty, loading }) => {
	return loading ? (
		<Spinner />
	) : (
		<div
			className={dirty ? 'modal-btn' : 'modal-btn-disabled'}
			onClick={dirty ? action : () => {}}
		>
			<div>שמור שינויים</div>
		</div>
	);
};

export default ModalResourceChangesButton;
