import React, { useState, useRef, useMemo } from 'react';
import './SubmitAlertModal.scss';

import * as Yup from 'yup';
import { Formik, ErrorMessage, Form } from 'formik';

import { Submit, Input } from '../../FormControls';

import { useTranslation } from 'react-i18next';

import ModalWrapper from '../../Modal/Modal';
import { toast } from 'react-toastify';
import { useStores } from 'stores';

function SubmitAlertModal({ isOpen, toggle, type, alertData ,index }) {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [message, setMessage] = useState('');
	const { resourceStore, tripAlertStore, authenticationStore } = useStores();

	const formikProps = {
		initialValues: {
			alert_message: '',
		},

		onSubmit: async (values, { resetForm }) => {
			setLoading(true);
			let alertId = alertData?.id;

			if (type !== 'rejectAlert') {
				let req = await tripAlertStore.approveAlert({
					alertId: alertId,
					message: message,
					index: index,
				});
				if (!!req) {
					// console.log('Alert', req);
					toast.success('ההתראה אושרה', {
						position: toast.POSITION.BOTTOM_LEFT,
					});
					setLoading(false);
					toggle();
				} else {
					// console.log('AlertErr', req);
					toast.success('ההתראה אושרה', {
						position: toast.POSITION.BOTTOM_LEFT,
					});
					setLoading(false);
					toggle();
				}
			} else {
				let req = await tripAlertStore.rejectAlert({
					alertId: alertId,
					message: message,
					index: index,
				});
				if (!!req) {
					// console.log('Alert', req);
					toast.success('ההתראה נמחקה', {
						position: toast.POSITION.BOTTOM_LEFT,
					});
					setLoading(false);
					toggle();
				} else {
					// console.log('AlertErr', req);
					toast.success('ההתראה נמחקה', {
						position: toast.POSITION.BOTTOM_LEFT,
					});
					setLoading(false);
					toggle();
				}
			}

		},
	};

	const formikRef = useRef();

	return (
		<ModalWrapper
			isOpen={isOpen}
			toggle={toggle}
			title={type === 'rejectAlert' ? t(`rejectAlert`) : t(`confirmationAlert`)}
		>
			<div className='create-entity-container' style={{ padding: 10 }}>
				{/* <StylesProvider jss={jss}> */}
				<Formik {...formikProps} innerRef={formikRef}>
					{({ values, handleSubmit, setFieldValue }) => {
						let formProps = {
							value: '',
							is_required: 1,
							name: 'alert_message',
							onChange: (e) => {
								setFieldValue('alert_message', e.target.value);
								setMessage(e.target.value);
							},
						};
						return (
							<>
								<div
									className={`form-field-container`}
									style={{
										minWidth: '48%',
										maxWidth: 244,
										width: '100%',
									}}
								>
									<Input
										{...formProps}
										label={
											type === 'rejectAlert'
												? t(`rejectAlertRes`)
												: t(`confirmationAlertRes`)
										}
										value={message}
										disabled={loading}
									/>
								</div>
								<>
									<div
										style={{
											display: 'flex',
											justifyContent: 'flex-end',
											marginTop: 20,
										}}
									>
										<Submit
											label={t(`save`)}
											action={handleSubmit}
											loading={loading}
										/>
									</div>
								</>
							</>
						);
					}}
				</Formik>
			</div>
		</ModalWrapper>
	);
}

export default SubmitAlertModal;
