import React from 'react';
import './TripChipModalToolTip.scss';
function TripChipModalToolTip({ data, resource }) {
	const textTooltip = {
		driver: 'נהג',
		car_number: "מס' רכב",
		chaperone_name: 'מלווה',
		seats: 'נוסעים/רוכבים',
		supplier: 'לקוח',
		type: 'טיפוס נסיעה',
	};

	return (
		<div className='tripChipModalTooltip-main' style={{ position: 'relative' }}>
			<div className='tripChipModalTooltip-header'>
				{/* <div className='tripChipTooltip-title'>{data.order_id}</div> */}
				<div className='tripChipModalTooltip-title'>{data.trip_name}</div>
				{/* <div className='tripChipTooltip-subtitle'>
					{moment.utc(data.trip_start).format('HH:mm') 
					+'end' +
						moment.utc(data.trip_end).format('HH:mm')}
				</div> */}
			</div>
			<div className='tripChipModalTooltip-main-container'>
				<div className='tripChipModalTooltip-sub-container'>
					<div className='tripChipModalTooltip-right-subtitle'>
						{textTooltip.driver}
					</div>
					<div className='tripChipModalTooltip-left-subtitle'>
						{resource?.driver_nick_name}
					</div>
				</div>
				<div className='tripChipModalTooltip-sub-container'>
					<div className='tripChipModalTooltip-right-subtitle'>
						{textTooltip.car_number}
					</div>
					{<div className='tripChipModalTooltip-left-subtitle'>
						{resource?.car_number? resource?.car_number :"ללא מס' רכב"}
					</div>}
				</div>
				{data.chaperon===1 &&
					<div className='tripChipModalTooltip-sub-container'>
						<div className='tripChipModalTooltip-right-subtitle'>
							{textTooltip.chaperone_name}
						</div>
						<div className='tripChipModalTooltip-left-subtitle'>
							לא אויש מלווה
						</div>
					</div>
				}
				<div className='tripChipModalTooltip-sub-container'>
					<div className='tripChipModalTooltip-right-subtitle'>
						{textTooltip.seats}
					</div>
					<div className='tripChipModalTooltip-left-subtitle'>
						{resource.car_seats}
					</div>
				</div>
				<div className='tripChipModalTooltip-sub-container'>
					<div className='tripChipModalTooltip-right-subtitle'>
						{textTooltip.supplier}
					</div>
					<div className='tripChipModalTooltip-left-subtitle'>
						{data.customer_name}
					</div>
				</div>
				<div className='tripChipModalTooltip-sub-container'>
					<div className='tripChipModalTooltip-right-subtitle'>
						{textTooltip.type}
					</div>
					<div className='tripChipModalTooltip-left-subtitle'>
						{data.type_name}
					</div>
				</div>
			</div>
		</div>
	);
}

export default TripChipModalToolTip;
