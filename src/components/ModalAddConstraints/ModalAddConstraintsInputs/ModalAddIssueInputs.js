import './ModalAddConstraintsInputs.scss';
import React, { useState ,useEffect} from 'react';
import InputSelect from 'components/InputSelect/InputSelect';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import MenuItem from '@mui/material/MenuItem';
import TimePicker from '@mui/lab/TimePicker';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import Button from '@mui/material/Button';
import { useObserver, observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import { useStores } from 'stores/index';
import { toJS } from 'mobx';
import moment from 'moment';
import ResourceBankService from 'services/ResourceBankService';
import closeDialog from 'assets/icons/dialogClose.png';



// import * as Yup from 'yup';

const ModalAddIssuesInputs = ({ formikRef, values, options ,toggle}) => {
	const [value, setValue] = useState(new Date());
	const { t } = useTranslation();
	const [until, setUntil] = useState([]);
	const [StartDate, setStartDate] = useState(new Date());
	const [StartTime, setStartTime] = useState(new Date());
	const [endTime, setEndTime] = useState(new Date());
	const [endDate, setEndDate] = useState(new Date());
	const [allTripsName, setAllTripsName] = useState([]);
	const [user, setUser] = useState('');
	const [currentTrip, setCurrentTrip] = useState('');
	const [noteToDriver, setDriverNote] = useState('');
	const [allDrivers, setAllDrivers] = useState([]);
	const [driver, setDriver] = useState('');
	const [lat, setlat] = useState('');

	const [allUsers, setAllUsers] = useState([]);
	const {
		carDriverStore,
		resourceBankStore,
		chaperonesStore,
		constraintStore,
	} = useStores();
	useEffect(() => {
		(async () => {
			setTimeout(() => {
				let drivers = toJS(carDriverStore.carDriverList);
				setAllDrivers(drivers);
				// let chaperones = toJS(chaperonesStore.chaperonesList)
			}, 5000);
		})();
	}, [carDriverStore.carDriverList]);
	useEffect(() => {
		(async () => {
			setTimeout(() => {
				let usersFomStore=toJS(constraintStore.userNames)
				setAllUsers(usersFomStore);
				// let chaperones = toJS(chaperonesStore.chaperonesList)
			}, 5000);
		})();
	}, [carDriverStore.carDriverList]);
	useEffect(() => {
		(async () => {
			if(StartDate&& driver.id>0){
				setTimeout(() => {
					ResourceBankService.getAllTasksForDriver().then((res)=>{
						setAllTripsName(res)
					})
					// let chaperones = toJS(chaperonesStore.chaperonesList)
				}, 5000);
			}

		})();
	}, [carDriverStore.carDriverList]);

	const handleChangeDriver = (event) => {
		setDriver(event.target.value);
	};


	const handleChangeUser = (newValue) => {
		setUser(newValue);
	};

	const handleChangeUntil = (event) => {
		setUntil(event.target.value);
	};

	const handleChangeEndTime = (newValue) => {
		setEndTime(newValue);
	};

	const handleChangeStartTime = (newValue) => {
		setStartTime(newValue);
	};

	const handleChangeCurrentTrip = (newValue) => {
		setCurrentTrip(newValue);
	};

	const handleChangeStartDate = (newValue) => {
		setStartDate(newValue);
	};


	const handleChangeDriverNote = (event) => {
		setDriverNote(event.target.value);
	};
	const handleLocation = (event) => {
		setlat(event.target.value);
	};
	const handleSubmit = async () => {
		let newObj = {
			issue_type:"discipline",
			user_phone:user.phone_numer,
			user_type:user.user_role,
			nick_name:driver?.driver_nick_name,
			start_date:moment(StartDate).format('YYYY-MM-DD'),
			start_time:moment(StartTime).format('HH:mm:ss'),
			user_role:user.user_role,
			trip_name:currentTrip?.trip_name,
			order_id:currentTrip?.order_id,
			planning_id:currentTrip?.planning_id,
			created_by:user.first_name+" "+user.last_name,
			is_active:1,
			comment:noteToDriver,
			company_id:user.company_id
		}
		
		try {
			let res = await constraintStore.addIssues({ data: { ...newObj } });
			if (!!res?.length) {
			}
		} catch (e) {
			console.error('e.message', e.message);
		}
	};

	
	return (
		<div className='order-wrapper'>
			<div className='order-header'>
				<div className='order-title'>נסיעה חדשה</div>
				<div className='order-close-btn' onClick={toggle}>
					<img src={closeDialog} className='close-icon' alt='close-icon' />
				</div>
			</div>
		{/* <div className='modal-resource-change-fields-container-hr'> */}
			<LocalizationProvider dateAdapter={AdapterDateFns}>
			<div className='form-controls'>
					<div className='row'>
						{/*  Start date */}

						<DesktopDatePicker
							label={'תאריך דיווח'}
							sx={{ width: '100px' }}
							inputFormat='dd/MM/yyyy'
							value={StartDate}
							style={{ minWidth: '50%' }}
							onChange={handleChangeStartDate}
							renderInput={(params) => (
								<TextField {...params} variant='standard' />
							)}
						/>
						{/*  Start time */}
                      <div style={{ width: '2rem'}}></div>
						<TimePicker
							sx={{ width: '100px' }}
							label={'זמן דיווח '}
							value={StartTime}
							style={{ minWidth: '50%' }}
							renderInput={(params) => (
								<TextField {...params} variant='standard' />
							)}
							onChange={handleChangeStartTime}
						/>
					</div>

					{/* driver */}

					<div className='row'>
						<TextField
							id='driver'
							select
							label='אירוע משמעת עבור'
							value={driver}
							sx={{ width: '240px' }}
							onChange={handleChangeDriver}
							variant='standard'
							inputProps={{ style: { fontSize: 14 } }}
							InputLabelProps={{ style: { right: 0 } }}
						>
							{allDrivers?.map((d, index) => (
								<MenuItem key={index} value={d}>
									{d.driver_first_name} {d.driver_last_name}
								</MenuItem>
							))}
						</TextField>
						<TextField
							// error
							id='note-to-driver'
							label='שם המזין '
							variant='standard'
							sx={{ width: '200px' }}
							inputProps={{ style: { fontSize: 14 } }}
							InputLabelProps={{ style: { right: 0 } }}
							onChange={handleChangeUser}
							value={user}
						>
								{allUsers?.map((d, index) => (
								<MenuItem key={index} value={d}>
									{d.driver_first_name}
								</MenuItem>
							))}
						</TextField>
					</div>

					{/* <div className='remarks'> */}
						{/* Remarks */}
						<div className='row'>
						<TextField
							// error
							id='note-to-driver'
							label='נסיעה נוכחית  '
							variant='standard'
							sx={{ width: '200px' }}
							inputProps={{ style: { fontSize: 14 } }}
							InputLabelProps={{ style: { right: 0 } }}
							onChange={handleChangeCurrentTrip}
							value={currentTrip.trip_name}
						>
								{allTripsName?.map((d, index) => (
								<MenuItem key={index} value={d}>
									{d.trip_name}
								</MenuItem>
							))}
						</TextField>
						<TextField
							// error
							id='lat-lng'
							label='נקודת ציון '
							variant='standard'
							sx={{ width: '200px' }}
							inputProps={{ style: { fontSize: 14 } }}
							InputLabelProps={{ style: { right: 0 } }}
							onChange={handleLocation}
							value={lat}
						/>
						</div>
	<div className='row'>
						<TextField
							// error
							id='note-to-driver'
							label='הערה '
							variant='standard'
							sx={{ width: '250px' }}
							inputProps={{ style: { fontSize: 14 } }}
							InputLabelProps={{ style: { right: 0 } }}
							onChange={handleChangeDriverNote}
							value={noteToDriver}
						/>

							
						</div>
					</div>
					<div className='row'>
					<div className='submit-wrapper'>
						{/* create a ride */}
						<Button
							variant='contained'
							color='success'
							onClick={handleSubmit}
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
	
			</LocalizationProvider>
		</div>
	);
};

export default observer(ModalAddIssuesInputs);
