import React from 'react';
import ReactModal from 'react-modal';
import './AreYouSureModal.scss';
import closeDialog from 'assets/icons/dialogClose.png';
import { PrimaryButton } from '../PrimaryButton/PrimaryButton';
import SecondaryButton from '../SecondaryButton/SecondaryButton';

function AreYouSureModal({
	isOpen,
	toggle,
	approveText,
	rejectText,
	approveAction,
	rejectAction,
	title,
	body,
	variant,
}) {
	return (
		<ReactModal
			isOpen={!!isOpen}
			toggle={toggle}
			className='modal-are-you-sure'
			overlayClassName='overlay-are-you-sure'
			ariaHideApp={false}
		>
			<div className='are-you-sure-modal-container'>
				<div className='d-tasks-map-close-icon' onClick={toggle}>
					<img src={closeDialog} className='dialog-close' alt='' />
				</div>
				<p className='modal-title'>{title}</p>
				<p className='modal-body'>{body}</p>
				<div className='actions-container'>
					<PrimaryButton
						style={{
							height: 36,
							width: '49%',
							backgroundColor: variant === 'reject' ? '#FB4659' : '#2ec4b6',
						}}
						onClick={approveAction}
					>
						{approveText}
					</PrimaryButton>

					<SecondaryButton
						style={{
							height: 36,
							width: '49%',
							color: variant === 'reject' ? '#FB4659' : '#2ec4b6',
							borderColor: variant === 'reject' ? '#FB4659' : '#2ec4b6',
						}}
						onClick={rejectAction}
					>
						{rejectText}
					</SecondaryButton>
				</div>
			</div>
		</ReactModal>
	);
}

export default AreYouSureModal;
