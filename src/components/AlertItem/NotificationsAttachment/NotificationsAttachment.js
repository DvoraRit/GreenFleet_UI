import React, { useState, useEffect } from 'react';
import {
	textDir,
	centerMap,
	zoomMap,
	setTuggleModels,
	notificationsOptions,
	openAlertApproveModal,
	more_info_open_in_trip,
} from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import iconArrowLeft from 'containers/Control/MainContainer/Map/images/popUpIcons/icon-arrow-left.png';
import { useTranslation } from 'react-i18next';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TimelineIcon from '@mui/icons-material/Timeline';
import EmojiFlagsIcon from '@mui/icons-material/EmojiFlags';
import AccessAlarmIcon from '@mui/icons-material/AccessAlarm';
import { useStores } from 'stores';
import { toJS } from 'mobx';
import { toast } from 'react-toastify';
import SubmitAlertModal from '../SubmitAlertModal/SubmitAlertModal';
import './NotificationsAttachment.scss';

const NotificationsAttachment = ({
	alertData,
	index,
	setmouseEnter,
	mouseEnter,
	handleAttachment,
}) => {
	const [textDirection, setTextDirection] = useRecoilState(textDir);
	const [tuggle, setTuggle] = useRecoilState(setTuggleModels);
	const { resourceStore, tripAlertStore, authenticationStore } = useStores();
	const [currentUser, setCurrentUser] = useState(authenticationStore.user);
	const [showNotificationsOptions, setShowNotificationsOptions] =
		useRecoilState(notificationsOptions);
	const [openNotificationsApproveModal, setOpenNotificationsApproveModal] =
		useRecoilState(openAlertApproveModal);
	const [loading, setLoading] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	const [openSubmitModal, setOpenSubmitModal] = useState('');
	// const [openRemoveModal, setOpenRemoveModal] = useState(false);

	const { t } = useTranslation();
	const notificationsConfirmation = async () => {
		setOpenSubmitModal('confirmationAlert');
		setOpenNotificationsApproveModal(true);
	};
	const rejectAlert = async () => {
		setOpenSubmitModal('rejectAlert');
		setOpenNotificationsApproveModal(true);
	};
	const setUserInCharge = async () => {
		let alertId = alertData?.id;
		let userName = `${currentUser?.first_name} ${currentUser?.last_name}`;
		let req = await tripAlertStore.setUserInCharge({
			alertId: alertId,
			userId: currentUser.user_name,
			userName: userName,
			index,
		});
		if (!!req) {
			console.log('req', req);
			toast.success(`הוגדרת אחראי על ${alertData.trip_name}`, {
				position: toast.POSITION.BOTTOM_LEFT,
			});
		} else {
			console.log('AlertErr', req);
			toast.success(`הוגדרת אחראי על ${alertData.trip_name}`, {
				position: toast.POSITION.BOTTOM_LEFT,
			});
		}
		setShowNotificationsOptions('');
	};
	const setSnooze = async (snoozeTime) => {
		let alertId = alertData?.id;
		let req = await tripAlertStore.setSnooze({
			alertId: alertId,
			snoozeTime: snoozeTime,
			index: index,
		});
		if (req) {
			console.log('req', req);
			// toast.success(`הוגדרת אחראי על ${alertData.trip_name}`, {
			// 	position: toast.POSITION.BOTTOM_LEFT,
			// });
		} else {
			console.log('AlertErr', req);
			// toast.error("מחיקת ההתראה לא התבצעה", {
			// 	position: toast.POSITION.BOTTOM_LEFT,
			// });
		}
		setShowNotificationsOptions('');
	};

	return (
		<div
			className={`popUppMoreInfoMain${textDirection}`}
			style={{
				position: 'absolute',
				left: '50%',
				// top: "20%",
				height: 'revert',
			}}
		>
			<div
				className='rowWrapperConfirmation'
				target={mouseEnter.toString()}
				onMouseEnter={() => setmouseEnter('Confirmation')}
				onMouseLeave={() => setmouseEnter('false')}
				onClick={notificationsConfirmation}
			>
				<div className='iconTextWrapper'>
					<CheckCircleOutlineIcon className='imagesInPopUp' color='disabled' />
					<div className='subTitle'>{t('textInPopUp.alert_confirmation')}</div>
				</div>
			</div>

			<div
				className='rowWrapperCancelAlert'
				target={mouseEnter.toString()}
				onMouseEnter={() => setmouseEnter('CancelAlert')}
				onMouseLeave={() => setmouseEnter('false')}
				onClick={rejectAlert}
			>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<RemoveCircleOutlineIcon className='imagesInPopUp' color='disabled' />
					<div className='subTitle'>{t('textInPopUp.cancel_alert')}</div>
				</div>
			</div>

			<div
				className='rowWrapperPresentingEffect'
				target={mouseEnter.toString()}
				onMouseEnter={() => setmouseEnter('PresentingEffect')}
				onMouseLeave={() => setmouseEnter('false')}
			>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<TimelineIcon className='imagesInPopUp' color='disabled' />
					<div className='subTitle'>{t('textInPopUp.presenting_effect')}</div>
				</div>
			</div>
			<div
				className='rowWrapperDefineMeAsResponsible'
				target={mouseEnter.toString()}
				onMouseEnter={() => setmouseEnter('DefineMeAsResponsible')}
				onMouseLeave={() => setmouseEnter('false')}
				onClick={setUserInCharge}
			>
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<EmojiFlagsIcon className='imagesInPopUp' color='disabled' />
					{/* <NotificationsIcon className='imagesInPopUp' alt='Connection' color="disabled"/> */}
					<div className='subTitle'>
						{t('textInPopUp.Define_me_as_responsible')}
					</div>
				</div>
			</div>
			<div
				className='rowWrapperReminder'
				style={{
					display: 'flex',
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
				target={mouseEnter.toString()}
				onMouseEnter={() => setmouseEnter('Reminder')}
				onMouseLeave={() => setmouseEnter('false')}
				onClick={() => setOpenModal(!openModal)}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'row',
						alignItems: 'center',
					}}
				>
					<AccessAlarmIcon
						className='imagesInPopUp'
						alt='AccessAlarmIcon'
						color='disabled'
					/>
					<div className='subTitle'>{t('textInPopUp.reminder')}</div>
				</div>
				<img
					src={iconArrowLeft}
					className='arrowUpPopMoreInfo'
					alt='iconArrowLeft'
					target={textDirection}
				/>
			</div>
			{(tuggle.notificationsReminder === true || openModal) && (
				<div className='notificationsReminderModal'>
					<div className='subTitleLarge' onClick={() => setSnooze(2)}>
						{t('textInPopUp.twoMin')}
					</div>
					<div className='subTitleLarge' onClick={() => setSnooze(5)}>
						{t('textInPopUp.fiveMin')}
					</div>
					<div className='subTitleLarge' onClick={() => setSnooze(10)}>
						{' '}
						{t('textInPopUp.tenMin')}{' '}
					</div>
				</div>
			)}
			{openSubmitModal && openNotificationsApproveModal && (
				<SubmitAlertModal
					isOpen={openSubmitModal}
					toggle={() => setOpenSubmitModal('')}
					type={openSubmitModal}
					alertData={alertData}
					index={index}
				/>
			)}
		</div>
	);
};

export default NotificationsAttachment;
