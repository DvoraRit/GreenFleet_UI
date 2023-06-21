import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';

import Select from '../SimpleSelect/SimpleSelect';
import DatePicker from '../SimpleDateTimePicker/SimpleDateTimePicker';
import Switch from '../Switch/Switch';

import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import './OrdersTimingTable.scss';

import moment from 'moment';
import AddIcon from '@mui/icons-material/Add';

const DATE = {
	key: 'end_date',
	label: 'תאריך',
};
const AMOUNT = {
	key: 'amount',
	label: 'כמות',
};

const initialValueTiming = {
	day_of_week: 1,
	start_hour: new Date(),
	end_hour: new Date(),
	start_date: new Date(),
	finish_by: 'date',
	end_date: new Date(),
	action: {
		value: 'i',
		action: () => {},
	},
};

const initialValueSingle = {
	start_hour: new Date(),
	end_hour: new Date(),
	start_date: new Date(),
	end_date: new Date(),
	action: {
		value: 'i',
		action: () => {},
	},
};

function OrdersTimingTable({
	onChange,
	initialValues,
	name,
	value: formikValue,
}) {
	const [endBy, setEndBy] = useState({ ...DATE });

	const COLUMNS_TIMING = [
		{ name: 'day_of_week', label: 'יום בשבוע', order: 1 },
		{ name: 'start_hour', label: 'שעת התייצבות', order: 2 },
		{ name: 'end_hour', label: 'שעת שחרור', order: 3 },
		{ name: 'start_date', label: 'תאריך התחלה', order: 4 },
		{ name: 'finish_by', label: 'סיום לפי', order: 5 },
		{ name: endBy.key, label: 'תאריך / כמות', order: 6 },
		{ name: 'action', label: '', order: 7 },
	];
	const COLUMNS_SINGLE = [
		{ name: 'start_hour', label: 'שעת התייצבות', order: 2 },
		{ name: 'end_hour', label: 'שעת שחרור', order: 3 },
		{ name: 'start_date', label: 'תאריך התחלה', order: 4 },
		{ name: 'end_date', label: 'תאריך שחרור', order: 6 },
		{ name: 'action', label: '', order: 7 },
	];

	const { t } = useTranslation();

	// let value = !!formikValue?.length
	// 	? [...formikValue]
	// 	: [{ ...initialValueTiming }];
	const [newOrderLine, setNewOrderLine] = useState({ ...initialValueTiming });
	const [state, setState] = useState([...formikValue]);

	const [isTiming, setIsTiming] = useState(true);
	const [selectedColumns, setSelectedColumns] = useState(
		isTiming ? [...COLUMNS_TIMING] : [...COLUMNS_SINGLE],
	);
	const [stateTiming, setStateTiming] = useState([{ ...initialValueTiming }]);
	const [stateSingle, setStateSingle] = useState([{ ...initialValueSingle }]);
	const [selectedState, setSelectedState] = useState(
		isTiming ? [...stateTiming] : [...stateSingle],
	);

	const toggleTimingView = () => {
		let _isTiming = isTiming;
		setIsTiming(!isTiming);
		if (_isTiming) {
			setSelectedColumns([...COLUMNS_SINGLE]);
			setSelectedState([...stateSingle]);
			onChange([...stateSingle]);
		} else {
			setSelectedColumns([...COLUMNS_TIMING]);
			setSelectedState([...stateTiming]);
			onChange([...stateTiming]);
		}
	};

	// useEffect(() => {
	// 	toggleTimingView();
	// }, [isTiming]);

	useEffect(() => {
		if (isTiming) {
			onChange(stateTiming);
			setSelectedState([...stateTiming]);
		}
	}, [stateTiming]);

	useEffect(() => {
		if (!isTiming) {
			onChange(stateSingle);
			setSelectedState([...stateSingle]);
		}
	}, [stateSingle]);

	useEffect(() => {
		if (!formikValue?.length) {
			if (isTiming) {
				// onChange([{ ...initialValueTiming }]);
			} else {
				// onChange([{ ...initialValueSingle }]);
			}
		} else if (formikValue?.[0]?.day_of_week) {
			setIsTiming(true);
			setStateTiming([
				...formikValue.map((val) => ({
					...val,
					start_hour: val?.start_date,
					end_hour: val?.end_date,
				})),
			]);
			// setEndBy({ ...DATE });
		} else {
			setIsTiming(false);
			setStateSingle([
				...formikValue.map((val) => ({
					...val,
					start_hour: val?.start_date,
					end_hour: val?.end_date,
				})),
			]);
			// setEndBy({ ...AMOUNT });
		}
	}, []);

	// useEffect(() => {
	// 	setState((state) =>
	// 		state.map((row) => {
	// 			if (row.end_by === 'date') {
	// 				return {
	// 					day: row.day,
	// 					start_time: row.start_time,
	// 					end_time: row.end_time,
	// 					start_date: row.start_date,
	// 					end_by: 'date',
	// 					end_date: row?.end_date ? row.end_date : new Date(),
	// 				};
	// 			}else{

	//       }
	// 		}),
	// 	);
	// }, [state]);

	const matchComponentToCell = (name, finish_by) => {
		switch (name) {
			case 'day_of_week':
				return Select;
			case 'start_hour':
				return DatePicker;
			case 'end_hour':
				return DatePicker;
			case 'start_date':
				return DatePicker;

			case 'end_date':
				return finish_by === 'date' || !isTiming ? DatePicker : Select;

			case 'finish_by':
				return Select;
			case 'action':
				return RemoveCircleIcon;
			default:
				return null;
		}
	};

	const getPropsByComponent = (name, finish_by) => {
		switch (name) {
			case 'day_of_week':
				return {
					options: [
						{ value: 1, label: 'א׳' },
						{ value: 2, label: 'ב׳' },
						{ value: 3, label: 'ג׳' },
						{ value: 4, label: 'ד׳' },
						{ value: 5, label: 'ה׳' },
						{ value: 6, label: 'ו׳' },
						{ value: 7, label: 'ש׳' },
					],
				};
			case 'start_hour':
				return {
					format: 'time',
				};
			case 'end_hour':
				return {
					format: 'time',
				};
			case 'start_date':
				return {
					format: 'date',
				};
			case 'end_date':
				if (finish_by === 'date' || !isTiming) {
					return {
						format: 'date',
					};
				} else {
					return {
						options: [
							...Array(100)
								.fill(100)
								.map((_, i) => ({ value: i + 1, label: i + 1 })),
						],
					};
				}
			case 'finish_by':
				return {
					options: [
						{ value: 'date', label: 'תאריך' },
						{ value: 'amount', label: 'כמות' },
					],
				};
			default:
				return null;
		}
	};

	const handleRemoveLine = (index) => {
		if (isTiming) {
			let newRows = [...stateTiming];
			newRows.splice(index, 1);
			setStateTiming(newRows);
		} else {
			let newRows = [...stateSingle];
			newRows.splice(index, 1);
			setStateSingle(newRows);
		}
	};

	const handleAddNewRow = () => {
		if (isTiming) {
			setStateTiming((stateTiming) => [
				...stateTiming,
				{ ...initialValueTiming },
			]);
		} else {
			setStateSingle((stateSingle) => [
				...stateSingle,
				{ ...initialValueSingle },
			]);
		}
	};


	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<div style={{ minWidth: '100%', top: 0 }}>
				<Switch label='מחזוריות' onChange={toggleTimingView} value={isTiming} />
			</div>

			<Grid
				container
				spacing={{ md: 0 }}
				columns={{ md: isTiming ? 14 : 10 }}
				className='grid-orders-timing-table'
			>
				{selectedColumns.map((col, index) => (
					<Grid item md={2} key={index}>
						<div className='header-text'>{col.label}</div>
					</Grid>
				))}
				<div className='table-content-wrapper'>
					{selectedState.map((orderObj, index) => {
						return (
							<div>
								<div className='row-content'>
									{Object.entries(orderObj ?? {})
										.sort(([keyA], [keyB]) => {
											let orderA = selectedColumns.find(
												(col) => col.name === keyA,
											)?.order;
											let orderB = selectedColumns.find(
												(col) => col.name === keyB,
											)?.order;
											return parseInt(orderA) - parseInt(orderB);
										})
										.filter(([objKey]) => objKey !== 'id')
										.map(([key, orderCellData], i) => {
											let Component = matchComponentToCell(
												key,
												orderObj['finish_by'],
											);
											let props = getPropsByComponent(
												key,
												orderObj['finish_by'],
											);
											props = {
												...props,
												value: orderObj[key],
												onChange: (event) => {
													let newState = isTiming
														? [...stateTiming]
														: [...stateSingle];
													let newStateObj = {
														...newState[index],
													};
													newStateObj[key] = event;
													newState[index] = newStateObj;
													isTiming
														? setStateTiming([...newState])
														: setStateSingle([...newState]);
													// setState([...newState]);
													setNewOrderLine((state) => ({
														...state,
														[key]: event,
													}));
													// onChange(newValue);
												},
											};

											return (
												<Grid
													item
													md={2}
													className='grid-row-wrapper'
													key={key}
												>
													<div className='table-item-container'>
														<div className='table-item-cell'>
															{key !== 'action' ? (
																<div className='table-item-cell-content-container'>
																	<Component name={key} {...props} />
																</div>
															) : index === 0 ? (
																<div className='icon-container'></div>
															) : (
																<div
																	className='icon-container'
																	onClick={() => handleRemoveLine(index)}
																>
																	<RemoveCircleIcon />
																</div>
															)}
														</div>
													</div>
												</Grid>
											);
										})}
								</div>
							</div>
						);
					})}
				</div>
				<div className='add-new-row-container' onClick={handleAddNewRow}>
					<div className='icon-container'>
						<AddIcon sx={{ color: '#2EC4B6' }} size={14} />
					</div>
					<div className='text-container'>הוסף עיתוי</div>
				</div>
			</Grid>
		</div>
	);
}

export default OrdersTimingTable;
