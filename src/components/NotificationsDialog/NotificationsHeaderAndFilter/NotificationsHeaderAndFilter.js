import React, { useState } from 'react';
import './NotificationsHeaderAndFilter.scss';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { _selectedNotificationsFilter,notificationsModal } from 'recoil/atoms';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import NotificationsFilterSelect from '../NotificationsFilterSelect/NotificationsFilterSelect';
import NotificationsIcon from '@mui/icons-material/Notifications';


const NotificationsHeaderAndFilter = ({numberOfNotifications ,numberOfNotificationsInTreatment ,numberOfNotificationsNotInTreatment}) => {
	const { t } = useTranslation();
	const [
		nameOfSelectedNotificationsFilter,
		setNameOfSelectedNotificationsFilter,
	] = useRecoilState(_selectedNotificationsFilter);
	const [openNotificationsModal, setOpenNotificationsModal] =
	useRecoilState(notificationsModal);
	const [openOptions, setOpenOptions] = useState(false);

	const handleOpenOptions = () => {
		setOpenOptions(!openOptions);
	};

	return (
		<div className='notifications-header-and-filter'>
			<div className='notifications-header-wrapper'>
				<div className='notifications-header'>
					<div className='notifications-header-icon'>
						<div className='red-circle-notificationsDialog'>
							<div className='num-of-notificationsDialog-text'>
								{numberOfNotifications}
							</div>
						</div>
						<NotificationsIcon />
					</div>
					<div className='notifications-header-titles'>
						<div className='notifications-header-title'>
							{t(`notifications`)}
						</div>
						<div className='notifications-header-subtitle'>
							<div>
								{numberOfNotificationsInTreatment} {t(`InTreatment`)}
							</div>
							<div className='dot'></div>
							<div>
								{numberOfNotificationsNotInTreatment} {t(`NotInTreatment`)}
							</div>
						</div>
					</div>
				</div>
				<div
					className='closeModalIcon'
					onClick={() => setOpenNotificationsModal(false)}
				>
					<ArrowDropUpIcon />
				</div>
			</div>
			<div className='notifications-filter-wrapper'>
				<div
					onClick={() => handleOpenOptions()}
					className='notifications-filter-selected-drop-list'
				>
					{t('notifications_filter.display') +
						': ' +
						t(`notifications_filter.${nameOfSelectedNotificationsFilter}`)}
					<ArrowDropUpIcon
						fontSize='small'
						sx={{ transform: 'rotate(180deg)' }}
					/>
				</div>
				{openOptions && (
					<ClickAwayListener onClickAway={handleOpenOptions}>
						<div className='filter-options-wrapper' style={{ zIndex: 99 }}>
							<NotificationsFilterSelect
								value={'urgency'}
								text={'urgency'}
								setOpenOptions={setOpenOptions}
								setNameOfSelectedNotificationsFilter={
									setNameOfSelectedNotificationsFilter
								}
								nameOfSelectedNotificationsFilter={
									nameOfSelectedNotificationsFilter
								}
							/>
							<NotificationsFilterSelect
								value={'status'}
								text={'status'}
								setOpenOptions={setOpenOptions}
								setNameOfSelectedNotificationsFilter={
									setNameOfSelectedNotificationsFilter
								}
								nameOfSelectedNotificationsFilter={
									nameOfSelectedNotificationsFilter
								}
							/>
							<NotificationsFilterSelect
								value={'timeInNotifications'}
								text={'timeInNotifications'}
								setOpenOptions={setOpenOptions}
								setNameOfSelectedNotificationsFilter={
									setNameOfSelectedNotificationsFilter
								}
								nameOfSelectedNotificationsFilter={
									nameOfSelectedNotificationsFilter
								}
							/>
						</div>
					</ClickAwayListener>
				)}
			</div>
		</div>
	);
};

export default NotificationsHeaderAndFilter;
