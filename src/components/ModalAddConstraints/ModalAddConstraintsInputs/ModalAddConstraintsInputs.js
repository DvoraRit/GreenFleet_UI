import './ModalAddConstraintsInputs.scss';
import React, { useState, useEffect } from 'react';
import InputSelect from 'components/InputSelect/InputSelect';
import Stack from '@mui/material/Stack';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import CarDriverService from 'services/planning/CarDriverService';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { FIELDS, VALIDATIONS } from './ConstraintsInputValidators';
import TimePicker from '@mui/lab/TimePicker';
import DatePicker from '@mui/lab/DatePicker';
import ModalResourceChangesHeader from 'components/ModalResourceChanges/ModalResourceChangesHeader/ModalResourceChangesHeader';
import { Controller, useForm } from 'react-hook-form';
import { useObserver, observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useStores } from 'stores/index';
import { toJS } from 'mobx';
import moment from 'moment';
import { yupResolver } from '@hookform/resolvers/yup';
import './ModalAddConstraintsInputs.scss';

const ModalAddConstraintsInputs = ({ toggle }) => {
	const { t } = useTranslation();

	const [until, setUntil] = useState([]);
	const [StartDate, setStartDate] = useState(new Date());
	const [StartTime, setStartTime] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [repeat, setRepeat] = useState('');
	const [repeatOptions, setRepeatOptions] = useState([]);
	const [repeatUtilOptions, setRepeatUtilOptions] = useState([]);
	const [noteToDriver, setDriverNote] = useState('');
	const [allDrivers, setAllDrivers] = useState([]);
	const [driver, setDriver] = useState('');
	const [numberOfShow, setNumberOfShow] = useState(0);
	const [dateEndShow, setDateEndShow] = useState(new Date());
	const {
		carDriverStore,
		resourceBankStore,
		chaperonesStore,
		constraintStore,
	} = useStores();

	useEffect(async () => {
		await CarDriverService.getAllFromView()
			.then((res) => {
				if (res.status === 200) {
					pickAllDrivers(res.data);
					// pickAllCars(res.data);
				}
			})
			.catch((error) => console.error('error get car and drivers', error));

		handleOptionsInRepeat();

		// getAllTravelTypes();
		// getChaperones();
		// getCustomers();
	}, []);

	const pickAllDrivers = (data) => {
		const _drivers = [];
		data.forEach((element) => {
			if (
				element.driver_first_name !== null &&
				element.driver_last_name !== null
			) {
				_drivers.push({
					driver_id: element.driver_id,
					driver_first_name: element.driver_first_name,
					driver_last_name: element.driver_last_name,
					user_phone: element.driver_phone_number,
					driver_nick_name: element.driver_nick_name,
				});
			}
		});

		const names = _drivers.map((d) => d.driver_id);

		const uniqueDrivers = _drivers?.filter(
			({ driver_id }, index) => !names.includes(driver_id, index + 1),
		);

		setAllDrivers(uniqueDrivers);
	};

	const handleChangeDriver = (event) => {
		setDriver(event.target.value);
	};

	const handleChangeDriverNote = (event) => {
		setDriverNote(event.target.value);
	};

	const handleChangeUntil = (event) => {
		setUntil(event.target.value);
	};
	const handleChangeNumberOfShow = (event) => {
		setNumberOfShow(event.target.value);
	};
	const handleChangeEndShowDate = (newValue) => {
		setDateEndShow(newValue);
	};

	const handleChangeEndTime = (newValue) => {
		setEndTime(newValue);
	};

	const handleChangeStartTime = (newValue) => {
		setStartTime(newValue);
	};

	const handleChangeRepeat = (event) => {
		setRepeat(event.target.value);
	};
	const handleOptionsInRepeat = () => {
		let optionsRepeat = [
			{ key: 'none', name: t(`constraint.repeat_none`) },
			{ key: 'every week', name: t(`constraint.repeat_every week`) },
			{ key: 'week', name: t(`constraint.repeat_week`) },
			{ key: 'month', name: t(`constraint.repeat_month`) },
			{ key: 'year', name: t(`constraint.repeat_year"`) },
			{ key: 'half', name: t(`constraint.repeat_half`) },
			{ key: 'quarter', name: t(`constraint.repeat_quarter`) },
		];

		setRepeatOptions(optionsRepeat);
		let UtilOptions = [
			{ key: 'none', name: t(`constraint.repeat_none`) },
			{ key: 'date', name: t(`constraint.repeat_by_date`) },
			{ key: 'number', name: t(`constraint.repeat_dy_number`) },
		];

		setRepeatUtilOptions(UtilOptions);
	};

	const handleChangeStartDate = (newValue) => {
		setStartDate(newValue);
	};

	const handleChangeEndDate = (newValue) => {
		setEndDate(newValue);
	};

	const {
		register,
		handleSubmit,
		formState: { errors },
		control,
		getValues,
		watch,
		setValue,
	} = useForm({
		resolver: yupResolver(VALIDATIONS),
		mode: 'onChange',
		defaultValues: {
			driver: {},
			endTime: '',
			endDate: '',
			beginningTime: '',
			beginningDate: '',
			internalNote: '',
			comment_for_for_planner: '',
			repeatOptions: '',
			repeat_until: '',
		},
	});

	useEffect(() => {
		Object.keys(FIELDS).map((field) => register(FIELDS[field]));
	}, [register]);

	const handleSubmitCheck = (formData) => {
		let momentBeginningDate = moment(formData.beginningDate).format(
			'DD.MM.YYYY',
		);
		let momentBeginningTime = moment(formData.beginningTime).format('HH:mm');

		let momentEndDate = moment(formData.endDate).format('DD.MM.YYYY');
		let momentEndTime = moment(formData.endTime).format('HH:mm');

		const startDateAndTime = moment(
			momentBeginningDate + ' ' + momentBeginningTime,
			'DD/MM/YYYY HH:mm',
		);

		const endDateAndTime = moment(
			momentEndDate + ' ' + momentEndTime,
			'DD/MM/YYYY HH:mm',
		);

		const formattedStartDateAndTime =
			startDateAndTime.format('YYYY-MM-DD HH:mm');

		const formattedEndDateAndTime = endDateAndTime.format(
			'YYYY-MM-DD HH:mm:ss',
		);

		const payload = {
			...(formData.driver.driver_id && {
				user_phone: formData.driver.phone_number,
				nick_name: formData.driver.driver_nick_name,
			}),
			issue_type: 'constraint',
			start_date: momentBeginningDate,
			end_date: momentEndDate,
			start_time: momentBeginningTime,
			end_time: momentEndTime,
			comment: formData.internalNote,
			repete_every: formData.repeatOptions,
		};
		try {
			let res = constraintStore.addIssues({ data: { ...payload } });
			if (!!res?.length) {
				setTimeout(() => {
					window.location.reload();
					toggle('');
				}, 2000);
			}
		} catch (e) {
			console.error('e.message', e.message);
		}
	};

	return (
		<div className='modal-resource-change-fields-container-hr'>
			<div className='ModalResourceChanges-top' style={{ direction: 'ltr' }}>
				<ModalResourceChangesHeader toggle={toggle} tripName={'אילוץ חדש'} />
			</div>
			<form
				noValidate
				autoComplete='off'
				onSubmit={handleSubmit((d) => handleSubmitCheck(d))}
			>
				<div className='form-controls'>
					<div className='order-title'>פרטי אירוע</div>
					<div className='row'>
						<div className='move_left'>
							<Controller
								control={control}
								name='beginningDate'
								render={({ field: { onChange, value } }) => (
									<>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<DatePicker
												label='תאריך התחלה'
												inputFormat='dd/MM/yyyy'
												onChange={onChange}
												value={value}
												renderInput={(params) => (
													<TextField
														{...params}
														variant='standard'
														InputLabelProps={{ style: { right: 0 } }}
													/>
												)}
											/>
										</LocalizationProvider>

										<p className='field-error'>
											{errors?.beginningDate?.message ?? ''}&nbsp;
										</p>
									</>
								)}
							/>
						</div>

						{/* beginning time */}
						<div>
							<Controller
								control={control}
								name='beginningTime'
								render={({ field: { onChange, value } }) => (
									<>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<TimePicker
												label='שעת התחלה'
												ampm={false}
												value={value}
												onChange={onChange}
												renderInput={(params) => (
													<TextField
														{...params}
														variant='standard'
														InputLabelProps={{ style: { right: 0 } }}
													/>
												)}
											/>
										</LocalizationProvider>

										<p className='field-error'>
											{errors?.beginningTime?.message ?? ''}&nbsp;
										</p>
									</>
								)}
							/>
						</div>
					</div>

					<div className='row'>
						{/* end date */}
						<div className='move_left'>
							<Controller
								control={control}
								name='endDate'
								render={({ field: { onChange, value } }) => (
									<>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<DatePicker
												label='תאריך סיום'
												inputFormat='dd/MM/yyyy'
												value={value}
												minDate={watch('beginningDate')}
												onChange={onChange}
												renderInput={(params) => (
													<TextField
														{...params}
														variant='standard'
														InputLabelProps={{ style: { right: 0 } }}
													/>
												)}
											/>
										</LocalizationProvider>

										<p className='field-error'>
											{errors?.endDate?.message ?? ''}&nbsp;
										</p>
									</>
								)}
							/>
						</div>
						{/* end time */}
						<div>
							<Controller
								control={control}
								name='endTime'
								render={({ field: { onChange, value } }) => (
									<>
										<LocalizationProvider dateAdapter={AdapterDateFns}>
											<TimePicker
												label='שעת סיום'
												ampm={false}
												value={value}
												onChange={onChange}
												renderInput={(params) => (
													<TextField
														{...params}
														variant='standard'
														InputLabelProps={{ style: { right: 0 } }}
													/>
												)}
											/>
										</LocalizationProvider>

										<p className='field-error'>
											{errors?.endTime?.message ?? ''}&nbsp;
										</p>
									</>
								)}
							/>
						</div>
					</div>

					{/* driver */}
					<div className='row'>
						<Controller
							control={control}
							name='driver'
							render={({ field: { onChange } }) => (
								<>
									<TextField
										id='driver'
										dir='rtl'
										select
										label='נהג'
										sx={{ width: '240px' }}
										// value={`${value.driver_first_name} ARE ${value.driver_last_name}`}
										onChange={onChange}
										variant='standard'
										inputProps={{ style: { fontSize: 14 } }}
										InputLabelProps={{ style: { right: 0 } }}
									>
										{allDrivers.map((d, index) => (
											<MenuItem key={index} value={d}>
												{d.driver_first_name} {d.driver_last_name}
											</MenuItem>
										))}
									</TextField>
								</>
							)}
						/>
					</div>
					<div className='row'>
						{/* note to driver */}
						<div style={{ marginTop: '20px' }}>
							{/* internal note */}

							<Controller
								control={control}
								name='internalNote'
								render={({ field: { onChange, value } }) => (
									<>
										<TextField
											id='internalNote'
											label='הערה פנימית'
											variant='standard'
											sx={{ width: '460px' }}
											inputProps={{ style: { fontSize: 14 } }}
											InputLabelProps={{ style: { left: 0, right: 0 } }}
											onChange={onChange}
											value={value}
										/>
									</>
								)}
							/>
						</div>
					</div>

					<div className='remarks'>
						{/* Remarks */}
						<p className='order-title'> פרטי תבנית </p>
						<div className='row'>
							<div className='text-name'> תבנית מחזורית</div>
							<div className='move_left'>
								<Controller
									control={control}
									name='travelType'
									render={({ field: { onChange, value } }) => (
										<>
											<TextField
												id='repeatOptions'
												dir='rtl'
												select
												// defaultValue={[]}
												label=' תבנית מחזורית'
												// value={value}
												sx={{ width: '240px' }}
												onChange={onChange}
												variant='standard'
												inputProps={{ style: { fontSize: 14 } }}
												InputLabelProps={{ style: { right: 0 } }}
											>
												{repeatOptions?.map((t, index) => (
													<MenuItem key={index} value={t}>
														<p>
															<span
																style={{
																	backgroundColor: `${t.color}`,
																	width: '15px',
																	height: '15px',
																	display: 'inline-block',
																}}
															></span>
															<span style={{ marginRight: '10px' }}>
																{t.name}
															</span>
														</p>
													</MenuItem>
												))}
											</TextField>
										</>
									)}
								/>
							</div>
							<div className='text-name'> עד</div>
							<Controller
								control={control}
								name='travelType'
								render={({ field: { onChange, value } }) => (
									<>
										<TextField
											id='repeat_until'
											dir='rtl'
											select
											// defaultValue={[]}
											label=' עד'
											// value={value}
											sx={{ width: '240px' }}
											onChange={onChange}
											variant='standard'
											inputProps={{ style: { fontSize: 14 } }}
											InputLabelProps={{ style: { right: 0 } }}
										>
											{repeatUtilOptions?.map((t, index) => (
												<MenuItem key={index} value={t}>
													<p>
														<span
															style={{
																backgroundColor: `${t.color}`,
																width: '15px',
																height: '15px',
																display: 'inline-block',
															}}
														></span>
														<span style={{ marginRight: '10px' }}>
															{t.name}
														</span>
													</p>
												</MenuItem>
											))}
										</TextField>
									</>
								)}
							/>
						</div>
						{/* <div className='row'>
							{until === 'כמות' && (
								<InputSelect
									key={'12_3$'}
									labelId={`numberOfShows-label`}
									// id={field}
									className={`select`}
									value={numberOfShow}
									// value={values[field]?.value?.toString() ?? ''}
									label={'כמות מופעים'}
									onChange={(e) => {
										handleChangeNumberOfShow(e);
									}}
									// field={field.name}
									options={Array.from(Array(16).keys())}
									style={{ minWidth: '95%' }}
								/>
							)}

							{until === 'תאריך' && (
								<DesktopDatePicker
									label={'תאריך סיום'}
									inputFormat='dd/MM/yyyy'
									value={dateEndShow}
									style={{ minWidth: '50%' }}
									onChange={handleChangeEndShowDate}
									renderInput={(params) => (
										<TextField {...params} variant='standard' />
									)}
								/>
							)}
						</div> */}
					</div>
					<div className='submit-wrapper'>
						{/* create a ride */}
						<Button
							variant='contained'
							color='success'
							// onClick={handleSubmit}
							type='submit'
							sx={{
								width: '120px',
								fontSize: '14px',
								backgroundColor: '#2EC4B6',
							}}
						>
							שליחה
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default observer(ModalAddConstraintsInputs);
