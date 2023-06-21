import React, { useState, useEffect } from 'react';
import './AlertItem.scss';
import { useRecoilState } from 'recoil';
import { notificationsOptions } from 'recoil/atoms';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import NotificationsOptionsModal from './NotificationsOptionsModal/NotificationsOptionsModal';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { tripAlertsTypes, tripAlertsSeverity } from 'constants/statuses';

const AlertItem = ({ alertData, index,hasUserInCharge }) => {
	const [showNotificationsOptions, setShowNotificationsOptions] =
		useRecoilState(notificationsOptions);
	const [isMouseEnter, setIsMouseEnter] = useState(false);


	const { t } = useTranslation();
	const handleOpenOptions = () => {
		if (showNotificationsOptions !== alertData.id) {
			setShowNotificationsOptions(alertData.id);
		} else {
			setShowNotificationsOptions('');
		}
	};
	return (
		<div
			className={isMouseEnter?'alertItem-wrapper-withShadow':'alertItem-wrapper'}
			style={{
				backgroundColor:hasUserInCharge? tripAlertsSeverity[alertData?.severity].background:"#fff",
				
			}}
			onMouseEnter={() => setIsMouseEnter(true)}
			onMouseLeave={() => setIsMouseEnter(false)}
		>
			<div className='alertItem-status-header'>
				<div
					className='alertItem-status-header-title'
					style={{ color: tripAlertsSeverity[alertData?.severity].color }}
				>
					{`${t(`alertType.${alertData?.alert_type}`)} ( % ${
						alertData?.alert_percent
					})`}
				</div>
				<div
					className='alertItem-status-MoreHoriz-icon'
					onClick={() => handleOpenOptions()}
				>
					<MoreHorizIcon />
				</div>
			</div>

			<div className='alertItem-information'>
				<div className='alertItem-information-title'>
					{alertData?.trip_name}
				</div>
				<div className='alertItem-information-subtitle'>
					{' '}
					{`${alertData?.driver_name} , ${alertData?.car_number?alertData?.car_number:""} `}{' '}
				</div>
				{!!alertData?.user_in_charge_of_name && (
					<div className='alertItem-information-responsibly'>
						{' '}
						{alertData?.user_explain
							? `${alertData?.user_in_charge_of_name} - ${alertData?.user_explain} `
							: `${alertData?.user_in_charge_of}`}{' '}
					</div>
				)}
			</div>
			<div className='alertItem-information-footer'>
				<div className='alertItem-information-footer-text'>
					{alertData?.alert_message}
				</div>
				<div className='alertItem-information-footer-time'>
					{moment(alertData?.created).format('HH:mm')}
				</div>
			</div>
			{showNotificationsOptions === alertData.id && (
				<NotificationsOptionsModal alertData={alertData} index={index} />
			)}
		</div>
	);
};

export default AlertItem;
