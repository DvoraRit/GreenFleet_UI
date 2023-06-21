import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import CheckIcon from '@mui/icons-material/Check';
import { useStores } from 'stores/index';
import {
	_timeFilter,
	_timeArray,
	_resourceBankStoreRender,
	_chosenDate,
} from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import ResourceBankService from 'services/ResourceBankService';
import './NotificationsFilterSelect.scss';

function NotificationsFilterSelect({
	value,
	text,
	setOpenOptions,
	setNameOfSelectedNotificationsFilter,
	nameOfSelectedNotificationsFilter,
}) {
	const { t } = useTranslation();
	const { resourceBankStore, constraintStore,tripAlertStore } = useStores();
	const [mouseEnter, setmouseEnter] = useState(false);
	let transformFilterText={
		urgency:"URGENCY",
		status:"SEVERITY",
		timeInNotifications:"TIME_CREATED"
	}

	const handleSelectedFilter = async () => {
		setOpenOptions(false);
		setNameOfSelectedNotificationsFilter(text);
		tripAlertStore.changeSortingOrder(transformFilterText[text])

	};

	return (
		<div
			className='row-wrapper-time-select'
			onClick={() => handleSelectedFilter()}
			target={mouseEnter.toString()}
			onMouseEnter={() => setmouseEnter(true)}
			onMouseLeave={() => setmouseEnter(false)}
		>
			<div className='text-time-filter'>
				{t(`notifications_filter.${text}`)}
			</div>
			{nameOfSelectedNotificationsFilter === value && (
				<CheckIcon
					//color="primary"
					style={{
						height: '14px',
						width: '14px',
						alignSelf: 'flex-end',
						color: '#2EC4B6',
					}}
				/>
			)}
		</div>
	);
}

export default NotificationsFilterSelect;
