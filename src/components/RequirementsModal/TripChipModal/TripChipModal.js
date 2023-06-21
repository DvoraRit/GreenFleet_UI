import React, { useEffect, useState } from 'react';
import { _draggedTrip, _mannedOrders, _timeArray } from '../../../recoil/atoms';
import { useObserver } from 'mobx-react';
import { useRecoilState } from 'recoil';
import { useStores } from 'stores/index';
import './TripChipModal.scss';
import ReactTooltip from 'react-tooltip';
import TripChipModalToolTip from './TripChipModalToolTip';
import calculatWidthByTime from 'handler/calculatWidthByTime';

function TripChipModal({
	trip,
	resource_bank_id,
	resource,
	isLastTripBeforeOrder = false,
	distanceFromOrder = false,
}) {
	const [mannedOrders, setMannedOrders] = useRecoilState(_mannedOrders);
	const [draggedTrip, setDraggedTrip] = useRecoilState(_draggedTrip);
	const [widthCalculation, setWidthCalculation] = useState(false);
	const [hoverInfo, setHoverInfo] = useState(true);
	const [positionOfChip, setPositionOfChip] = useState(8);
	const [hightOfChip, setHightOfChip] = useState(42);
	const [right, setRight] = useState(0);
	const [timeArray, setTimeArray] = useRecoilState(_timeArray);
	//const calculatedHeight = hightOfChip ? hightOfChip : '42';
	const justAdded = trip.justAdded
		? trip.justAdded
		: mannedOrders.findIndex((x) => x.id === trip.order_id) !== -1;
	const maxHeightTripChip = 42;

	function onDragStart(event, type) {
		setHoverInfo(!hoverInfo);

		setDraggedTrip({ ...trip, dragged_resource_bank_id: resource_bank_id });
		event.dataTransfer.setData('text/plain', event.target.id);
		event.dataTransfer.dropEffect = 'move';
		if (event.key === 'Escape') return; // ESC = 27
	}

	useEffect(() => {
		if (trip.justAdded) {
			let width = calculatWidthByTime(trip.trip_start, trip.trip_end);
			if (timeArray.length === 96) {
				setWidthCalculation(width * 4);
			} else if (timeArray.length === 48) {
				setWidthCalculation(width * 2);
			} else {
				setWidthCalculation(width);
			}
			let minutsFrom00 = calculatWidthByTime('00:00', trip.trip_start);
			if (timeArray.length === 96) {
				setRight(minutsFrom00 * 4);
			} else if (timeArray.length === 48) {
				setRight(minutsFrom00 * 2);
			} else {
				setRight(minutsFrom00);
			}
			if(trip?.is_over_lapping === 1){
				if(trip?.total_over_lap_rows > 3){
					setHightOfChip((maxHeightTripChip / trip?.total_over_lap_rows) - 1);
					setPositionOfChip(((trip?.line_to_drow / trip?.total_over_lap_rows) * maxHeightTripChip) + 6)
				}
				else{
					setHightOfChip((maxHeightTripChip / trip?.total_over_lap_rows) - 5);
					setPositionOfChip(((trip?.line_to_drow / trip?.total_over_lap_rows) * maxHeightTripChip) - 10)
				}
			}
			//calculate position of chip
			
		} else {
			let width;
			if(new Date(trip.trip_end).getDate() !== new Date().getDate()){
				width = calculatWidthByTime(trip.trip_start, "23:59");
				setWidthCalculation(width);
			}
			else{
				width = trip?.minutes_from_start;
				if (timeArray.length === 96) {
					setWidthCalculation(width * 4);
				} else if (timeArray.length === 48) {
					setWidthCalculation(width * 2);
				} else {
					setWidthCalculation(width);
				}

			}
			let minutsFrom00 = trip?.minutes_from_midnight;
			if (timeArray.length === 96) {
				setRight(minutsFrom00 * 4);
			} else if (timeArray.length === 48) {
				setRight(minutsFrom00 * 2);
			} else {
				setRight(minutsFrom00);
			}
			//calculate hight of chip 
			if(trip?.is_over_lapping === 1){
				if(trip?.total_over_lap_rows > 3){
					setHightOfChip((maxHeightTripChip / trip?.total_over_lap_rows) - 1)
				}
				else{
					setHightOfChip((maxHeightTripChip / trip?.total_over_lap_rows) - 5)
				}
			}
			//calculate position of chip
			if(trip?.is_over_lapping === 1){
				if(trip?.total_over_lap_rows > 3){
					setPositionOfChip(((trip?.line_to_drow / trip?.total_over_lap_rows) * maxHeightTripChip) + 6)
				}
				else{
					setPositionOfChip(((trip?.line_to_drow / trip?.total_over_lap_rows) * maxHeightTripChip) - 10)
				}
			}

		}
	}, []);

	return useObserver(
		() =>
			trip && (
				<>
					<span
						id={`draggableTripChip${trip.order_id}`}
						draggable={justAdded}
						onDragStart={(e) => onDragStart(e)}
						className='no-opacity-background-chip-in-modal'
						style={{
							right: `${right}px`,
							top: `${positionOfChip}px`,
							height: `${hightOfChip}px`,
							width: `${parseInt(widthCalculation)}px`,
						}}
					>
						<span
							className='background-chip-in-modal'
							style={{
								width: `${parseInt(widthCalculation)}px`,
								backgroundColor: trip.color ? trip.color : '#b5e0f7',
								opacity: !justAdded ? 0.5 : 1,
								height: `${hightOfChip}px`,
								zIndex: 99999999,
							}}
							data-tip
							data-for={`tripToolTip${trip.order_id}`}
						>
							{trip.justAdded && (
								<div className='new-drive-text-in-chip'
									style={{paddingTop:trip.is_over_lapping?0:10}}
								>{trip.trip_name}</div>
							)}
						</span>
					</span>
					{isLastTripBeforeOrder && distanceFromOrder > 0 && (
						<>
							<div
								style={{
									width: (distanceFromOrder/80)*60,//(distance / average speed of drive) * 60 min 
									right: `${right + parseInt(widthCalculation) - 1}px`,
									maxWidth: `${1438 - right - parseInt(widthCalculation)}px`,
								}}
								className='red-sing-for-last-trip-befor-order'
							></div>
							<div
								className='finish-reg-sing-for-last-trip-befor-order'
								style={{
									right:
										right + parseInt(widthCalculation) + ((distanceFromOrder/80)*60) >
										1437
											? 1437
											: `${
													right + parseInt(widthCalculation) +((distanceFromOrder/80)*60)
											  }px`,
								}}
							></div>
						</>
					)}

					<ReactTooltip
						id={`tripToolTip${trip.order_id}`}
						place='top'
						effect='solid'
						bodyMode={true}
						backgroundColor='#fff'
						border={true}
						aria-haspopup='true'
						className='tooltip-of-trip-in-modal'
					>
						<TripChipModalToolTip data={trip} resource={resource} />
					</ReactTooltip>
				</>
			),
	);
}

export default TripChipModal;
