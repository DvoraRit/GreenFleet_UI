import React from 'react';
import './ModalResourceChangesHeader.scss';
import modalClose from 'containers/Planning/PlanningBody/Tasks/images/modalClose.png';

const ModalResourceChangesHeader = ({ toggle, tripName, type_color }) => {


	return (
		<div className='modalResourceChangesHeader-main'>
			<div className='modalResourceChangesHeader-title'>
			{tripName!=="אילוץ חדש"&&	<div
					className='modalResourceChangesHeader-line'
					style={type_color ? { backgroundColor: type_color } : {}}
				></div>
			}
				<div className='headerModal-title'>{tripName}</div>
			</div>
			<img
				src={modalClose}
				alt='close'
				className='modalResourceChangesHeader-icon'
				onClick={toggle}
			/>
		</div>
	);
};

export default ModalResourceChangesHeader;
