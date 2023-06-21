import React, { forwardRef, useState, useRef } from 'react';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { registerLocale } from 'react-datepicker';
import he from 'date-fns/locale/he';
import moment from 'moment';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import './SimpleDatePicker.scss';

function SimpleDateTimePicker({
	value = new Date(),
	format,
	onChange,
	name,
	dateFormat = 'MMMM d, yyyy h:mm aa',
}) {
	registerLocale('he', he);
	const dateRef = useRef();

	const ExampleCustomTimeInput = ({ date, value, onChange }) => (
		<input
			// value={value}
			onChange={(e) => onChange(e.target.value)}
			style={{ border: 'solid 1px pink' }}
		/>
	);

	const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
		let formatByType = format === 'date' ? 'DD/MM/YY' : 'HH:mm';
		return (
			<div
				style={{
					backgroundColor: 'transparent',
					width: '100%',
					height: '40px',
					display: 'flex',
					justifyContent: 'space-between',
					alignItems: 'center',
				}}
			>
				<button
					style={{
						backgroundColor: 'transparent',
						width: '100%',
						height: '40px',
						display: 'flex',
						justifyContent: 'space-between',
						alignItems: 'center',
					}}
					className='example-custom-input'
					onClick={onClick}
					ref={ref}
				>
					<span
						style={{
							color: 'rgba(0,0,0,0.87)',
							fontFamily: 'Rubik',
							fontSize: '12px',
							letterSpacing: '0.4px',
							lineHeight: '16px',
							textAlign: 'right',
						}}
					>
						{moment(value).format(formatByType)}
					</span>
					<ArrowDropDownIcon
						sx={{ fontSize: '16px', letterSpacing: '0.4px' }}
					/>
				</button>
			</div>
		);
	});

	// const cacheRtl = createCache({
	// 	key: 'muirtl',
	// 	stylisPlugins: [prefixer, rtlPlugin],
	// });

	const [startDate, setStartDate] = useState(new Date());

	return (
		<DatePicker
			ref={dateRef}
			showTimeSelect={format === 'date' ? false : true}
			showTimeSelectOnly={format === 'date' ? false : true}
			name={name}
			selected={value}
			dateFormat={dateFormat}
			timeFormat='HH:mm'
			// onChange={(e)=>onChange(moment(e).format('YYYY-MM-DD'))}
			onChange={onChange}
			customInput={<ExampleCustomInput />}
			{...(format === 'time' && {
				renderCustomHeader: () => <></>,
			})}
			customTimeInput={<ExampleCustomTimeInput />}
		/>
	);
}

export default SimpleDateTimePicker;
