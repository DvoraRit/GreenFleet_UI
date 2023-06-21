import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import LabelOutlinedIcon from '@mui/icons-material/LabelOutlined';
import ROUTES from 'constants/routes';
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { useStores } from 'stores';
// import Text from '../../constants/textConstans';
import { chosenScopes, setTuggleModels,more_info_open_in_trip, textDir } from '../../recoil/atoms.js';
import './UserDetails.scss';
import ZonesPicker from './ZonesPicker';
import { useTranslation } from 'react-i18next';

function UserDetails() {

	const { t } = useTranslation();
	const { authenticationStore, resourceStore } = useStores();
	const [tuggle, setTuggle] = useRecoilState(setTuggleModels);
	// eslint-disable-next-line
	const [openModalInTrip, setopenModalInTrip] = useRecoilState(more_info_open_in_trip);
	// eslint-disable-next-line
	const [currentUser, setcurrentUser] = useState(authenticationStore.user);
	const history = useHistory();
	// eslint-disable-next-line
	const [userChosenScopesuserChosenScopes, setchoosenScopesOuserChosenScopes] =
		useRecoilState(chosenScopes);
		const [textDirection, setTextDirection] = useRecoilState(textDir);

	let userChosenZones = localStorage.getItem('CHOSEN_ZONES')?  localStorage.getItem('CHOSEN_ZONES').split(",").sort() : resourceStore.userZones?.sort();

	const handleClickOnZones = (modal) => {
		setTuggle((prev) => {
			return { ...prev, [modal]: !tuggle.openUserZones};
		});
	};

	const onLogout = () => {
		// setTuggle(false);
		const openModals=Object.keys(tuggle);
		openModals.forEach(element=>{
		setTuggle((prev) => {
			return { [element]: false };
		});
		setopenModalInTrip(false)
	})
		authenticationStore.logout();
		history.push(ROUTES.LOGIN);
	};

	useEffect(() => {
		setopenModalInTrip(false)
	}, [])

	return (
		<div className='user-details-wrapper' style={{direction:textDirection}}>
			<div className='personal-details'>
				<div className='user-name'>
					{currentUser?.first_name && currentUser?.last_name ? (
						<>
							{currentUser?.first_name} {currentUser?.last_name}
						</>
					) : (
						<>{t('welcome')}</>
					)}
				</div>
				{
					currentUser?.user_name && 
					<div className='user-phone-number'>
					{`${currentUser?.user_name?.slice(3)}  ${currentUser?.user_name?.slice(0,3)}`}
					{'+'}
				</div>
				}
				
			</div>

			<div className='line'></div>

			<div
				className='chose-scopes'
				onClick={() => handleClickOnZones('openUserZones')}
			>
				<LabelOutlinedIcon color='disabled' />
				<div className='scops-text'>{t('scopes')}</div>

				<div className='choosen-scopes-wrapper'>
					<div className='choosen-scopes-text'>
						{userChosenZones?.join(', ')}
					</div>
				</div>
				<ArrowBackIosNewIcon color='action' className='arrow-to-scope' />
			</div>

			<div className='line'></div>

			<div className='log-out' onClick={onLogout}>
				<ExitToAppIcon color='disabled'  />
				<div className='logout-text'>{t('logout')}</div>
			</div>

			{tuggle.openUserZones === true && (
				<div className='choose-zones-tooltip'>
					<ZonesPicker
						setchoosenScopesOnUserDetails={setchoosenScopesOuserChosenScopes}
					/>
				</div>
			)}
		</div>
	);
}

export default UserDetails;
