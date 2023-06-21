import React, { useState, useEffect } from 'react';
import './NotificationsDialog.scss';
import { useRecoilState } from 'recoil';
import { notificationsModal ,openAlertApproveModal } from 'recoil/atoms';
import NotificationsHeaderAndFilter from './NotificationsHeaderAndFilter/NotificationsHeaderAndFilter';
import AlertItem from '../AlertItem/AlertItem';
import { useTranslation } from 'react-i18next';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { useStores } from 'stores';
import { toJS } from 'mobx';


const NotificationsDialog = () => {
	const { tripAlertStore ,authenticationStore } = useStores();
	const [openNotificationsModal, setOpenNotificationsModal] =
		useRecoilState(notificationsModal);
		const [openNotificationsApproveModal, setOpenNotificationsApproveModal] =
		useRecoilState(openAlertApproveModal);
	const [showNotificationsInTreatment, setShowNotificationsInTreatment] =
		useState(true);
	const [showNotificationsNotInTreatment, setShowNotificationsNotInTreatment] =
		useState(true);
	const [currentUser, setCurrentUser] = useState(authenticationStore.user);

let numberOfNotificationsInTreatment=toJS(tripAlertStore.alerts).filter((alert)=>(alert.user_in_charge_of===currentUser.user_name))
let numberOfNotificationsNotInTreatment=toJS(tripAlertStore.alerts).filter((alert)=>(alert.user_in_charge_of!==currentUser.user_name ||!alert.user_in_charge_of)).sort()


	const { t } = useTranslation();
	function createKey(location) {
        return location.resource_id + location.car_number
    }


	return (
		<div className='NotificationsDialog-wrapper' style={openNotificationsApproveModal? {zIndex:10}:{zIndex:999}} >
			<div className='NotificationsDialog-header'>
				<NotificationsHeaderAndFilter
					 numberOfNotifications={tripAlertStore.alerts.length}
					 numberOfNotificationsInTreatment={numberOfNotificationsInTreatment.length}
					 numberOfNotificationsNotInTreatment={numberOfNotificationsNotInTreatment.length}
					
				/>
			</div>
			<div div className='NotificationsDialog-in-treatment'>
				<div className='NotificationsDialog-body-title'>
					<div> {t(`notificationsInTreatment`)}</div>
					<div
						onClick={() =>
							setShowNotificationsInTreatment(!showNotificationsInTreatment)
						}
					>
						{showNotificationsInTreatment ? (
							<ArrowDropUpIcon />
						) : (
							<ArrowDropDownIcon />
						)}
					</div>
				</div>
				<div className='NotificationsDialog-in-treatment-alertItems'>
				{showNotificationsInTreatment &&
				numberOfNotificationsInTreatment.map((alert,index) => (
					<AlertItem
						key={createKey(alert)}
						alertData={alert}
						index={index}
						hasUserInCharge={alert.user_in_charge_of}
					/>
					))
				}
				</div>
			</div>

			<div div className='NotificationsDialog-not-in-treatment'>
				<div className='NotificationsDialog-body-title'>
					<div> {t(`notificationsNotInTreatment`)}</div>
					<div
						onClick={() =>
							setShowNotificationsNotInTreatment(
								!showNotificationsNotInTreatment,
							)
						}
					>
						{showNotificationsNotInTreatment ? (
							<ArrowDropUpIcon />
						) : (
							<ArrowDropDownIcon />
						)}
					</div>
				</div>
				<div className='NotificationsDialog-not-in-treatment-alertItems'>

				{showNotificationsNotInTreatment &&
				numberOfNotificationsNotInTreatment.map((alert ,index) => (
		
					<AlertItem
						key={createKey(alert)}
						alertData={alert}
						index={index}
						hasUserInCharge={alert.user_in_charge_of}

					/>
					))
				}
			</div>
			</div>
		</div>
	);
};

export default NotificationsDialog;
