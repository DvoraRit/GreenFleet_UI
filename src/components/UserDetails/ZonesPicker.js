import React, { useEffect, useState } from 'react';
import { useStores } from '../../stores/index';
// import {getZones} from '../../services/userService';
import Zone from './Zone';
import {toJS} from 'mobx'
import './ZonesPicker.scss';
import { useRecoilState } from 'recoil';
import  {_resourceBankStoreRender} from '../../recoil/atoms';

export default function ZonesPicker({ setchoosenScopesOnUserDetails }) {
	const [userZones, setUserZones] = useState([]); //the zones client selected - for converting string from localstorage to array
	const [resourceBankStoreRender, setResourceBankStoreRender] = useRecoilState(_resourceBankStoreRender);
	const { resourceStore,resourceBankStore } = useStores();
	const [userChosenZones, setUserChosenZones] = useState([]); //the zones client selected - for converting string from localstorage to array
	useEffect(() => {
		// getZones();
		let zones = localStorage.getItem('zones');
		let zonesList = zones?.split(',');
		
		if(localStorage.getItem('CHOSEN_ZONES')?.length>-1)
		{
			if(localStorage.getItem('CHOSEN_ZONES')?.length>0){
				setUserChosenZones(localStorage.getItem('CHOSEN_ZONES').split(","))
			}
			else{
				setUserChosenZones([])
			}
		}
		else{
			setUserChosenZones(toJS(resourceStore.userZones))
		}
		setUserZones(zonesList);
	}, []);

	const handleZoneChange = (zone) => {
		let newChosenZones =[...userChosenZones];
		if (userChosenZones?.includes(zone)) {
			let indexToRemove = userChosenZones.indexOf(zone);
			newChosenZones = userChosenZones
				.slice(0, indexToRemove)
				.concat(userChosenZones.slice(indexToRemove + 1));
		} else {
			newChosenZones.push(zone);
		}
		
		setUserChosenZones(newChosenZones);
		resourceStore.setUserZones(newChosenZones);
		localStorage.setItem('CHOSEN_ZONES', newChosenZones);
		if(window.location.pathname === '/planning'){
			//resourceBankStore.getTableResourcesBankList();
			setResourceBankStoreRender((state) => state + 1);

		}
		else if (window.location.pathname === '/') {
			resourceStore.setAllResourcesFromServiceNew(); 
		}
		setchoosenScopesOnUserDetails(newChosenZones);
	};

	return (
		<div className='zones-picker-wrapper'>
			{userZones?.map((zone, index) => {
				return (
					<Zone
						key={`${zone}_${index}`}
						value={zone}
						handleZoneChange={handleZoneChange}
						userChosenZones={userChosenZones}
					/>
				);
			})}
		</div>
	);
}
