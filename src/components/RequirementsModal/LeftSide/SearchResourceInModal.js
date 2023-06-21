import React from 'react';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, TextField, Chip } from '@mui/material';
import search from '../../../assets/icons/search.svg';
import ConvertOrderToTrip from '../../../handler/ConvertOrderToTrip';
import { useStores } from 'stores/index';
import { toJS } from 'mobx';
import {
	_mannedOrders,
	_recentlyAssignedOrders,
	_openFilerByCarSize,
	_isHeaderSelectReqModal,
	_driversPlanning,
	_numOfResultsOfResourcesRequirementsModal
} from '../../../recoil/atoms';
import { useRecoilState } from 'recoil';


const useStyles = makeStyles({
	searchLeft: {
		height: '30px !important',
		margin: '9px !important',
		backgroundColor: 'white !important',
		width: '154px !important',

		'.Mui-focused':{
			
			 right: '90px !important'
		}
	},
});

function SearchResourceInModal({ rows, setRows, allResources, selectedRows }) {
	const classes = useStyles();
	const { resourceBankStore } = useStores();
	const [mannedOrders, setMannedOrders] = useRecoilState(_mannedOrders);
	const [openFilerByCarSize, setOpenFilerByCarSize] = useRecoilState(_openFilerByCarSize);
	const [numOfResultsOfResourcesRequirementsModal, setNumOfResultsOfResourcesRequirementsModal] = useRecoilState(_numOfResultsOfResourcesRequirementsModal);
	const [isHeaderSelectReqModal, setIsHeaderSelectReqModal] = useRecoilState(_isHeaderSelectReqModal);
	const [recentlyAssignedOrders, setRecentlyAssignedOrders] = useRecoilState(
		_recentlyAssignedOrders,
	);
	const [driversPlanning, setDriversPlanning] =
	useRecoilState(_driversPlanning);

	const getResourcesFromSearch = (input, event) => {
		//let firstName = ""
		if (input === '' || !input) {
			setRows(allResources);
			setNumOfResultsOfResourcesRequirementsModal(-1)
		} else {
			
			if (input?.includes(' ')) {
				let array = input.split(' ');
				const result = allResources.filter(
					(resource) =>
						(resource.resourceData?.driver_first_name?.startsWith(array[0]) &&
							resource.resourceData?.driver_last_name?.startsWith(array[1])) ||
						(resource.resourceData?.driver_last_name?.startsWith(array[0]) &&
							resource.resourceData?.driver_first_name?.startsWith(array[1])),
				);
				if(result?.length > 0 ){
					if(document.getElementById(
						`row-wrapper-${result[0]?.resourceData.resource_bank_id}`,
					) && document.getElementById(
						`card-wrapper-resource-${result[0]?.resourceData.resource_bank_id}`,
					))
					{
						document.getElementById(
							`row-wrapper-${result[0]?.resourceData.resource_bank_id}`,
						).style.backgroundColor = '#f0eded';
						document.getElementById(
							`card-wrapper-resource-${result[0]?.resourceData.resource_bank_id}`,
						).style.backgroundColor = '#f0eded';

					}
				}
				setNumOfResultsOfResourcesRequirementsModal(result.length)
				setRows(result);
			} else {
				const result = allResources.filter(
					(resource) =>
					resource.resourceData.driver_nick_name?.startsWith(input) ||
						resource.resourceData.driver_first_name?.startsWith(input) ||
						resource.resourceData.driver_last_name?.startsWith(input) ||
						resource.resourceData.sub_constractor_name?.startsWith(input) //for sub constractors
				);
				if(result?.length > 0 ){
					if(document.getElementById(
						`row-wrapper-${result[0]?.resourceData.resource_bank_id}`,
					) && document.getElementById(
						`card-wrapper-resource-${result[0]?.resourceData.resource_bank_id}`,
					))
					{
						document.getElementById(
							`row-wrapper-${result[0]?.resourceData.resource_bank_id}`,
						).style.backgroundColor = '#f0eded';
						document.getElementById(
							`card-wrapper-resource-${result[0]?.resourceData.resource_bank_id}`,
						).style.backgroundColor = '#f0eded';

					}
				}
				setNumOfResultsOfResourcesRequirementsModal(result.length)
				setRows(result);
				if(event.keyCode === 13){
					addSelectedRowsToResource(result[0])
				}
			}
		}
	};

	const addSelectedRowsToResource = (resource) =>{

		let assignedOrders = [...mannedOrders];
		let recentlyAssigned = [];

		selectedRows?.forEach((element) => {
			if (element.id) {
				let obj = ConvertOrderToTrip(element,toJS(resourceBankStore.types));
				//add the dragged elemrnt to drivers trips
				let body={};
				if (resource.resourceData.resource_bank_id) {
					body = {
						order_id: obj.order_id,
						resource_bank_id: resource.resourceData.resource_bank_id,
					};
					if(resource.resourceData.sub_constractor_id){
						body = {...body, sub_constractor_id: resource.sub_constractor_id}
					}
					resourceBankStore.addPlanning({ data: { ...body } });
				}
				recentlyAssigned.push(obj);
				assignedOrders.push({...element,resource_bank_id: resource.resourceData.resource_bank_id,  isMannnedOrder:true});

				addTripToDriversPlanning([obj], resource)
			}
		})
		setMannedOrders(assignedOrders);
		setRecentlyAssignedOrders({
			resource_bank_id: resource.resourceData.resource_bank_id,
			newTrips: [...recentlyAssigned],
		});
	}

	const addTripToDriversPlanning = (newTrips, resource) =>{
		//add trip to drivers trips on driversPlanning
		let resourceBank = driversPlanning.findIndex(x=>x.resourceData.resource_bank_id===resource.resourceData.resource_bank_id)
		let newData = [...driversPlanning]
		let trips = [...driversPlanning[resourceBank].trips]
		newTrips.forEach(item=>{
			trips.push({...item, justAdded:true})
			newData[resourceBank] = {resourceData:{...newData[resourceBank].resourceData},
			trips:[...trips]}
		})
		setDriversPlanning(newData)
		resourceBankStore.setDriversPlanning(newData)
	}

	const closeOpenModals = () =>{
		setIsHeaderSelectReqModal(false);
		setOpenFilerByCarSize(false);
	}
	

	return (
		<div className='search-resources-left-modal'>
			<Autocomplete
				
				multiple
				freeSolo
				//getOptionDisabled={option => true}
				id='filter-in-modal'
				// filterSelectedOptions
				className={classes.searchLeft}
				options={[]}
				selectOnFocus={true}
				forcePopupIcon={true}
				popupIcon={<img src={search} className='search-icon-left' alt='' />}
				size='small'
				renderInput={(params) => 
					<TextField 
					onClick={()=>closeOpenModals()} 
					  {...params} label='חפש משאב' />}
				renderTags={(value, getTagProps) => {
					return;  
				  }}
				onInputChange={(event) => {
					getResourcesFromSearch(event.target.value, event);
				}}
			/>
		</div>
	);
}

export default SearchResourceInModal;
