import React, { useState, useEffect } from 'react';
import minibusIcon from '../../../assets/icons/minibusIconRecords.svg';
import privateIcon from '../../../assets/icons/TaxiIconSmall.svg';
import busIcon from '../../../assets/icons/BusIconRecords.svg';
import './ResourceInModal.scss';
import Text from 'constants/textConstans';
import {
	_timeArray,
	_mannedOrders,
	_recentlyAssignedOrders,
	_draggedTrip,
	_driversPlanning,
	_openFilerByCarSize,
	_isHeaderSelectReqModal
} from '../../../recoil/atoms';
import { useRecoilState } from 'recoil';
import { useStores } from 'stores/index';
import { toJS } from 'mobx';
import calculatWidthByTime from 'handler/calculatWidthByTime';
import calculateDistance from 'handler/calculateDistance';
import moment from 'moment';
import { resourceSize } from '../../../constants/resourceSize';
import ConvertOrderToTrip from '../../../handler/ConvertOrderToTrip';
import TripChipModal from '../TripChipModal/TripChipModal';
import MoneySharpIcon from '@mui/icons-material/MoneySharp';
function ResourceInModal({
	driverAndTrips,
	selectedRows,
	setselectedRows,
	setcancelAssignedOrders,
	cancelAssignedOrders,
	time,
}) {
	const is_sub_constractor = driverAndTrips.resourceData?.sub_constractor_name;
	const [resource, setResource] = useState(driverAndTrips.resourceData);
	const [trips, settrips] = useState(
		driverAndTrips.trips.filter((x) => x.order_id),
	);
	const [mouseOver, setmouseOver] = useState(false);
	const [lastTrip, setLastTrip] = useState(false);
	const [rightPosition, setRightPosition] = useState(0);
	const [widthOfOrder, setWidthOfOrder] = useState(0);
	const [distanceFromOrder, setDistanceFromOrder] = useState(0);
	const { resourceBankStore } = useStores();
	const [driversPlanning, setDriversPlanning] =
	useRecoilState(_driversPlanning);
	const [timeArray, setTimeArray] = useRecoilState(_timeArray);
	const [mannedOrders, setMannedOrders] = useRecoilState(_mannedOrders);
	const [openFilerByCarSize, setOpenFilerByCarSize] = useRecoilState(_openFilerByCarSize);
	const [recentlyAssignedOrders, setRecentlyAssignedOrders] = useRecoilState(
		_recentlyAssignedOrders,
	);
	const [draggedTrip, setDraggedTrip] = useRecoilState(_draggedTrip);
	const [isHeaderSelectReqModal, setIsHeaderSelectReqModal] = useRecoilState(_isHeaderSelectReqModal);
	const width_of_row_responsive = {
		width: timeArray.length === 12 ? 120 * timeArray.length + 207 : 60 * timeArray.length + 207,
		backgroundColor: mouseOver ? '#f0eded' : '',
	};

	const handleClickOnRow = () =>{
		setOpenFilerByCarSize(false);
		setIsHeaderSelectReqModal(false);
	}

	const plateNumberConverter = () => {
		let plateNumberFromData = resource.car_number;
		let _plateNumber = '';
		if (plateNumberFromData?.length === 7) {
			_plateNumber =
				plateNumberFromData?.slice(0, 2) +
				'-' +
				plateNumberFromData?.slice(2, 5) +
				'-' +
				plateNumberFromData?.slice(5, 7);
		} else {
			if (plateNumberFromData?.length === 8) {
				_plateNumber =
					plateNumberFromData?.slice(0, 3) +
					'-' +
					plateNumberFromData?.slice(3, 5) +
					'-' +
					plateNumberFromData?.slice(5, 8);
			} else {
				_plateNumber = plateNumberFromData;
			}
		}

		return _plateNumber;
	};

	function onDragOver(event) {
		event.preventDefault();
		let hoverRow = document.getElementById(`row-wrapper-${resource.resource_bank_id}`);
		let hoverCard = document.getElementById(
			`card-wrapper-resource-${resource.resource_bank_id}`,
		);
		hoverRow.style.backgroundColor = '#f0eded';
		hoverCard.style.backgroundColor = '#f0eded';
	}

	function onDragLeave(event) {
		let hoverRow = document.getElementById(`row-wrapper-${resource.resource_bank_id}`);
		let hoverCard = document.getElementById(
			`card-wrapper-resource-${resource.resource_bank_id}`,
		);
		hoverRow.style.backgroundColor = '';
		hoverCard.style.backgroundColor = 'rgba(192,200,217,0.17)';
	}
	function checkOverLapping(params) {
		let counter = 1;
		if(selectedRows.length > 1){
			for(let i = 1; i <selectedRows.length; i++){
				if(moment.utc(selectedRows[i].start).isSame(moment.utc(selectedRows[i-1].start))//start time is same
					|| moment.utc(selectedRows[i].end).isSame(moment.utc(selectedRows[i-1].end))//end time is same
					|| moment.utc(selectedRows[i].start).isBetween(moment.utc(selectedRows[i-1].start), moment.utc(selectedRows[i-1].end))//start time is between
					|| moment.utc(selectedRows[i].end).isBetween(moment.utc(selectedRows[i-1].start), moment.utc(selectedRows[i-1].end))//end time is between
					)
				{
					selectedRows[i-1] = {...selectedRows[i-1], is_over_lapping: 1 , line_to_drow: counter}
					counter++;
					if(i===selectedRows.length-1){
						selectedRows[i] = {...selectedRows[i], is_over_lapping: 1, line_to_drow: counter}
					}
				}
			}
			//add counter to selectedRows
			if(counter > 1){
				selectedRows.forEach((x)=>{
					x.total_over_lap_rows = counter
				})
			}
			return selectedRows;
		}
		else{
			return;
		}
	}

	function onDrop(event) {
		let assignedOrders = [...mannedOrders];
		let recentlyAssigned = [];
		let dataForServer = {
			date:localStorage.getItem('date'),
			resource_bank_id: resource.resource_bank_id,
			new_orders:[...selectedRows]
				}
				//response :all drivers planning for the date - whit overlapping data
		if (draggedTrip) {
			event.preventDefault();
			//setSelectedRows(false)
			if (event.key === 'Escape') return; // ESC = 27
			const id = event.dataTransfer.getData('text');
			const dropzone = event.target;
			const draggableElement = document.getElementById(id);
			dropzone.appendChild(draggableElement);

			if (resource.resource_bank_id) {
				let bodyToRemove = {
					order_id: draggedTrip.order_id,
				};
				resourceBankStore.removeOrderFromPlanning(bodyToRemove);

				addTripToDriversPlanning([draggedTrip])
				let bodyToAdd = {
					order_id: draggedTrip.order_id,
					resource_bank_id: resource.resource_bank_id,
					is_active:1
				};
				resourceBankStore.addPlanning({ data: { ...bodyToAdd } });
					//add trip to drivers trips on driversPlanning
					//addTripToDriversPlanning([draggedTrip])
			}

			event.dataTransfer.clearData();
			setDraggedTrip(false);
			//let convertToOrder = ConvertTripToOrder(draggedTrip);
			recentlyAssigned.push(draggedTrip);
			setRecentlyAssignedOrders({
				resource_bank_id: resource.resource_bank_id,
				newTrips: [...recentlyAssigned],
			});
			//removeTripfromDriversPlanning(draggedTrip)
		} else {
			let listOfTripsConverted = []
			//selectedRows = checkOverLapping();
			selectedRows?.forEach((element) => {
				if (element.id) {
					let elementWithExstaData = {...element,resource_bank_id: resource.resource_bank_id, isMannnedOrder:true }
					let obj = ConvertOrderToTrip(element, toJS(resourceBankStore.types));
					listOfTripsConverted.push(obj);
					let body={};
					if (resource.resource_bank_id) {
						body = {
							order_id: obj.order_id,
							resource_bank_id: resource.resource_bank_id,
							is_active:1
						};
						if(resource.sub_constractor_id){
							body = {...body, sub_constractor_id: resource.sub_constractor_id}
						}
						resourceBankStore.addPlanning({ data: { ...body } });
					}
					//update manned orders
					assignedOrders.push(elementWithExstaData);
					recentlyAssigned.push(obj);
					
				} else {
					console.error(`ERROR! order_id is missing on ${element.trip_name}`);
				}
			});
			//get overlapping data from server
			
			//add trips to drivers trips on driversPlanning
			addTripToDriversPlanning(listOfTripsConverted)
			setMannedOrders(assignedOrders);
			setRecentlyAssignedOrders({
				resource_bank_id: resource.resource_bank_id,
				newTrips: [...recentlyAssigned],
			});
		}

		
		//removeTripfromDriversPlanning(draggedTrip)
		// setTimeout(() => {
        //     setselectedRows([])
		// }, 10000);
		//settrips(allTrips);
		event.dataTransfer.clearData();
	}

	const addTripToDriversPlanning = (newTrips) =>{
		//add trip to drivers trips on driversPlanning
		let resourceBank = driversPlanning.findIndex(x=>x.resourceData.resource_bank_id===resource.resource_bank_id)
		let newData = [...driversPlanning]
		let trips = [...driversPlanning[resourceBank].trips]
		newTrips?.forEach(item=>{
			trips.push({...item, justAdded:true})
			newData[resourceBank] = {resourceData:{...newData[resourceBank].resourceData},
			trips:[...trips]}
		})
		setDriversPlanning(newData)
		resourceBankStore.setDriversPlanning(newData)
	}
	const removeTripfromDriversPlanning = (tripToRemove) =>{
		//remove trip from drivers trips on driversPlanning
		let resourceBank={}
		if(draggedTrip){
			resourceBank =  driversPlanning.findIndex(x=>x.resourceData.resource_bank_id===draggedTrip.dragged_resource_bank_id)
		}
		else{
			resourceBank = driversPlanning.findIndex(x=>x.resourceData.resource_bank_id===resource.resource_bank_id)
		}
		let newData = [...driversPlanning]
		let trips = [...driversPlanning[resourceBank].trips]
		let indexToRemove = trips.findIndex(x=>x.order_id===tripToRemove.order_id)
		trips = trips.slice(0,indexToRemove).concat(trips.slice(indexToRemove+1))
		newData[resourceBank] = {resourceData:{...newData[resourceBank].resourceData},
		trips:[...trips]}
		setDriversPlanning(newData)
		resourceBankStore.setDriversPlanning(newData)
	}

	const getWidthOfOrder = (order) => {
		//show blue BG that indicates the length of the selected order
		let width;
		let maxWidthOfRow = timeArray.length === 12 ? 120 * timeArray.length + 207 : 60 * timeArray.length + 207
		//if endTime is not at the same date as start time, then set width to length of row
		if(moment.utc(order.end).format('l') !== moment(order.start).format('l')){
            width = maxWidthOfRow - getPositionOfOrder(order) -207;
        }
		else{
			width = calculatWidthByTime(order.start, order.end);
			if(timeArray.length === 48){
				width = width*2
			   }
			   else if(timeArray.length === 96){
				width = width*4
			   }

		}
		if(width===0){
            width=2
        }
		return width;
	};
	const getPositionOfOrder = (order) => {
		//show blue BG that indicates the length of the selected order
		let position = calculatWidthByTime('00:00', order.start);
		if(timeArray.length === 48){
			position = position*2
		   }
		   else if(timeArray.length === 96){
			position = position*4
		   }
		   //setRightPosition(position)
		return position;
	};

	const getLastTripBeforeOrder = (order, trips) => {
		trips = trips.sort((a, b) => new Date(b.trip_start) - new Date(a.trip_end));
		for (let i = 0; i < trips.length; i++) {
			//float times of trips[i-1]
			let trip1_start = moment.utc(trips[i].trip_start).format('HH:mm');
			let trip1_end = moment.utc(trips[i].trip_end).format('HH:mm');
			let trip1_start_float = parseFloat(trip1_start?.replace(':', '.'));
			let trip1_end_float = parseFloat(trip1_end?.replace(':', '.'));

			//float times of order
			let order_start = moment.utc(order.start).format('HH:mm');
			let order_start_float = parseFloat(order_start?.replace(':', '.'));

			if (i !== trips.length - 1) {
				//float times of trips[i]
				let trip2_start = moment.utc(trips[i + 1].trip_start).format('HH:mm');
				let trip2_end = moment.utc(trips[i + 1].trip_end).format('HH:mm');
				let trip2_start_float = parseFloat(trip2_start?.replace(':', '.'));

				if (
					trip1_start_float < order_start_float &&
					trip1_end_float < order_start_float &&
					!(trip2_start_float < order_start_float)
				) {
					return trips[i];
				}
			} else {
				if (
					trip1_start_float < order_start_float &&
					trip1_end_float < order_start_float
				) {
					return trips[i];
				}
				return false;
			}
		}
	};

	const getCarIcon = () => {
		let icon = '';
		switch (resource?.icon_size?.toLowerCase()) {
			case resourceSize.large:
				icon = busIcon;
				break;
			case resourceSize.medium:
				icon = minibusIcon;
				break;
			case resourceSize.small:
				icon = privateIcon;
				break;

			default:
				icon = busIcon;
				break;
		}
		return icon;
	};

	useEffect(() => {
		//set the width of the order
		// selectedRows?.forEach((order) => {
		// 	setWidthOfOrder(getWidthOfOrder(order));
		// 	setRightPosition(getPositionOfOrder(order));
		// });
		let timer = setTimeout(() => {
			getDistance();
		}, 1000);
		return () => {
			clearTimeout(timer);
		  }; 
	}, []);

	useEffect(()=>{
		if(recentlyAssignedOrders.resource_bank_id===resource.resource_bank_id){
			let allTrips = [...trips]
			recentlyAssignedOrders.newTrips?.forEach(trip=>{
				allTrips.push({...trip, justAdded:true})
			})
			settrips(allTrips)
		}

	},[recentlyAssignedOrders])

	const getDistance = () => {
		let lastTrip = getLastTripBeforeOrder(selectedRows[0], trips);
		let stations = toJS(resourceBankStore.firstStationForOrder);
		if (
			lastTrip &&
			stations?.length > 0 &&
			lastTrip.last_station_latitude && lastTrip.last_satation_longitude
		) {
			let calc = calculateDistance(
				parseFloat(lastTrip.last_station_latitude),
				parseFloat(lastTrip.last_satation_longitude),
				parseFloat(stations[0]?.lat),
				parseFloat(stations[0]?.long),
			);
			setLastTrip(lastTrip);
			if (calc) {
				setDistanceFromOrder(parseInt(calc));
			}
		}
	};

	useEffect(() => {
		let newTrips = [...trips];
		if (cancelAssignedOrders.resource_bank_id === resource.resource_bank_id) {
			cancelAssignedOrders.newTrips?.forEach((trip) => {
				let indexToRemove = newTrips.findIndex(
					(x) => x.order_id === trip.order_id,
				);
				if(indexToRemove > -1){
					newTrips = newTrips
						.slice(0, indexToRemove)
						.concat(newTrips.slice(indexToRemove + 1));
					if (trip.order_id) {
						let body = {
							order_id: trip.order_id,
						};
						
						resourceBankStore.removeOrderFromPlanning(body);
					}
					removeTripfromDriversPlanning(trip)
				}
			})
			settrips(newTrips);
		}
		
	}, [cancelAssignedOrders]);

	const sub_constractor_data = () => {
		return (
			<>
			<div className='sub_constractor_data'>
				<div className='text'>{`${resource.sub_constractor_name}`}</div>
				<div className='dot-modal'></div>
				<div className='sub-constractor-title'>קבלן משנה</div>
			</div>
			<div className='sub-constractor-price-wrapper'>
				<MoneySharpIcon sx={{color:"#2EC4B6", fontSize:16}}/>
				{
					resource.sub_constractor_price ? 
						resource.sub_constractor_price_type === 'percent' ?
						<div className='text'>{`${resource.sub_constractor_price}%`}</div>
						:
						<div className='text'>{`${resource.sub_constractor_price}`}</div>
					:
					<div className='text'>{`לא הוגדר`}</div>
				}
			</div>
			</>
			)
	}

	const resource_data = (resource) => {
		return (
			<>
			{resource.driver_nick_name ? (
				<div style={{display:"flex",alignItems: "center"}}>
				<div className='text'>{`${resource.driver_nick_name}`}</div>
				{
				is_sub_constractor &&
					<>
						<div className='dot-modal'></div>
						<div className='sub-constractor-title'>קבלן משנה</div>
						</>
				}
				</div>
			) : (
				<div className='text-alert'>{Text.no_driver_staffed}</div>
			)}

			{resource.car_number ? (
				<div className='car-data'>
					<div
						className='text'
						target={(distanceFromOrder > 0).toString()}
					>
						{plateNumberConverter()}
					</div>
					<div className='dot-modal'></div>
					<img src={getCarIcon()} className='car-icon' alt='carIcon' />
					<div className='text'>{resource.car_seats}</div>
				</div>
			) : (
				<div className='text-alert'>{Text.no_car_staffed}</div>
			)}
			{
				

			}
			</>
		)}
	return (
		<>
			<div
				id={`row-wrapper-${resource.resource_bank_id}`}
				className='row-wrapper-resource-im-modal'
				style={width_of_row_responsive}
				onDragOver={(e) => onDragOver(e)}
				onDragLeave={(e) => onDragLeave(e)}
				onDrop={(e) => onDrop(e)}
				onMouseEnter={() => setmouseOver(true)}
				onMouseLeave={() => setmouseOver(false)}
				onClick={()=>handleClickOnRow()}
			>
				<div className='no-opacity-base-resource-card-in-modal'>
					<div
						className='card-wrapper'
						id={`card-wrapper-resource-${resource.resource_bank_id}`}
						onMouseEnter={() => setmouseOver(true)}
						onMouseLeave={() => setmouseOver(false)}
						onDragOver={(e) => onDragOver(e)}
						onDragLeave={(e) => onDragLeave(e)}
						style={{
							backgroundColor: mouseOver ? '#f0eded' : 'rgba(192,200,217,0.17)',
						}}
						>
						{
							is_sub_constractor && !resource.driver_nick_name && !resource.car_number?
							sub_constractor_data()
							:
							resource_data(resource)
						}
						
						{lastTrip && distanceFromOrder > 0 && (
							<div className='text-distance'>
								{`במרחק ${distanceFromOrder} ק"מ`}
							</div>
						)}
					</div>
				</div>

				<div className='trips-of-resource-schedule'>
					{selectedRows?.length > 0 &&
						selectedRows?.map((order, index) => {
							return (
								<div
									className='blue-bg-in-resource-row-modal'
									style={{
										width: getWidthOfOrder(order),
										right: getPositionOfOrder(order),
									}}
									key={index}
								></div>
							);
						})}

					{trips?.map((trip, index) => {
							// let hightOfChip=trip.is_over_lapping === 1
							// ? 42 / trip?.total_over_lap_rows
							// : 42
							// let positionOfChip=trip.is_over_lapping === 1
							// ? (trip?.line_to_drow / trip?.total_over_lap_rows) * 42
							// : 8
						return(
						<TripChipModal
							trip={trip}
							resource_bank_id={resource.resource_bank_id}
							resource={resource}
							isLastTripBeforeOrder={
								lastTrip && lastTrip.order_id === trip.order_id
							}
							// hightOfChip={hightOfChip}
							// positionOfChip={positionOfChip}
							distanceFromOrder={distanceFromOrder}
							key={`${trip.order_id}-${resource.resource_bank_id}`}
						/>
					)})}

					{timeArray.map((item, index) => {
						return (
							<TimeBorder
								index={index}
								time = {time}
								key={index}
							/>
						);
					})}
				</div>
			</div>
		</>
	);
}

function TimeBorder({ index, time }) {
	// eslint-disable-next-line
	const widthOfCell = time==="twoHours" ? 120 : 60
	let isHalfSizeFirst = index === 0 && time ==="twoHours";
	// let isHalfSizeLast = (index===12 && timeType===12)
	let _rightAtTwoHours = isHalfSizeFirst
		? index + (1 * widthOfCell) / 2
		: index * widthOfCell + 60;
	let last_line_in_timeType_hour = index === 23 && time==="twoHours";
	return (
		!last_line_in_timeType_hour && (
			<span
				className='line-in-resource-row-modal'
				style={{
					right:
					time ==="twoHours"
							? `${_rightAtTwoHours}px`
							: `${(index + 1) * widthOfCell}px`,
				}}
			></span>
		)
	);
}

export default ResourceInModal;
