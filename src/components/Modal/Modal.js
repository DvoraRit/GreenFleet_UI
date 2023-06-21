import React from 'react';
import Header from './components/Header';
import './Modal.scss';
import ReactModal from 'react-modal';

function Modal({
	toggle,
	children,
	isOpen,
	title,
	middle_modal_width,
	modalContentStyle = { padding: '10 15px' },
	padding,
	paddingBottom,
	specialWidthForModal,
	HeaderComponent,
	overrideStyles,
	className,
}) {
	return (
		<ReactModal
			isOpen={isOpen}
			toggle={toggle}
			className={`generic-modal-component ${className}`}
			overlayClassName='generic-overly-modal'
			onRequestClose={toggle}
			ariaHideApp={false}

			style={{
				content: {
					...(middle_modal_width
						? { width: middle_modal_width }
						: specialWidthForModal
						? { width: specialWidthForModal }
						: {}),
					...(padding
						? { padding: padding }
						: paddingBottom
						? { paddingBottom: paddingBottom }
						: {}),
				},
			}}
		>
			{HeaderComponent ? (
				<HeaderComponent />
			) : (
				<Header title={title} toggle={toggle} />
			)}
			{children}
		</ReactModal>
	);
}

export default Modal;
