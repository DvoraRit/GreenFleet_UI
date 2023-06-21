import React, { useState, useRef, useEffect } from 'react';
import './ModalAddConstraints.scss';
import ModalAddConstraintsInputs from './ModalAddConstraintsInputs/ModalAddConstraintsInputs';
import ModalResourceChangesHeader from 'components/ModalResourceChanges/ModalResourceChangesHeader/ModalResourceChangesHeader';
import ModalAddIssuesInputs from './ModalAddConstraintsInputs/ModalAddIssueInputs';
import ModalResourceChangesButton from 'components/ModalResourceChanges/ModalResourceChangesButton/ModalResourceChangesButton';
import Map from 'containers/Planning/Dialog/DialogWrapper/components/SideMap';
import { Formik, ErrorMessage, Form } from 'formik';
import { useObserver, observer } from 'mobx-react';
import ActionButton from 'containers/Planning/Dialog/DialogWrapper/components/ActionButtons';
import { useStores } from 'stores/index';
import { useRecoilState } from 'recoil';
import {useTranslation} from 'react-i18next';


import {
	_addIssue
} from 'recoil/atoms';
import { toJS } from 'mobx';
import moment from 'moment';
const ModalAddIssues = ({ toggle, tripDetails = {}, component }) => {
	const { t } = useTranslation();

	const {
		role = '',
		day_at_week = '',
		start_date = '',
		start_time = '',
		end_day = '',
		end_time = '',
		nick_name = '',
		trip_name = '',
		created_by = '',
		user_phone = '',
		repete_every = '',
		driver_id = '',
		driver_first_name = '',
		comment = '',
		description="",
		event_latitude,
		event_longitude,
		is_active = 1,
		order_id,
		planning_id,
	} = tripDetails;
let current_trip ="";
// let current_trip ="";
const [extendedMap, setExtendedMap] = useState(false);


	const {
		carDriverStore,
		resourceBankStore,
		chaperonesStore,
		constraintStore,
		authenticationStore
	} = useStores();
	// const [ObjIssue,setObjIssue] = useRecoilState(_addIssue);
	const [currentUser, setCurrentUser] = useState(authenticationStore.user);
	const [users, setUsers] = useState([]);
	const [driverData, setDriverData] = useState([]);



	// const formSchema = Yup.object().shape({
	// 	start_date: Yup.string()
	// 	  // .length(9, `${strings('errors.invalidPhone')}`)
	// 	  .min(9, strings('errors.phone_too_short'))
	// 	  .max(14, strings('errors.phone_too_long'))
	// 	  .required(`${strings('errors.required')}`),
	//   });

	const [loading, setLoading] = useState(false);
	const [ready, setReady] = useState(false);

	const formikRef = useRef();
	const [options, setOptions] = useState({
		driver_first_name: [],
		current_user: [],
		current_trip: [],
	});
	// const [resourceBank, setResourceBank] = useState(null);
	useEffect(() => {
	let allUsers=constraintStore.getAllUsers();
		setUsers(allUsers)
	let allDrivers=carDriverStore.setCarDriverList();;
		setDriverData(allDrivers)
	}, []);

	const formikProps = {
		// validationSchema:{formSchema},
		initialValues: {
			start_date: start_date
				? {
						value: start_date,
						label: t(`fields.start_date`),
				  }
				: {
						value: '',
						label: `לא אויש`,
				  },
			start_time: start_time
				? { value: start_time, label: start_time }
				: {
						value: '',
						label: `לא אויש`,
				  },

			 driver_first_name: driver_first_name
				? { value: driver_first_name, label: driver_first_name }
				: {
						value: '',
						label: `לא אויש`,
				  },
			current_user: currentUser?.first_name && currentUser?.last_name 
				  ? { value: currentUser?.first_name && currentUser?.last_name, label: currentUser?.first_name && currentUser?.last_name }
				  : {
						  value: '',
						  label: `לא אויש`,
					},
		  
			current_trip:current_trip? { value: current_trip, label: current_trip }
			: {
				value: '',
				label: `יש למלא תאריך דיווח ושם נהג`,
		  },
		  locations: event_latitude&&event_longitude
		  ? { value:event_latitude&&event_longitude, label: event_latitude&&event_longitude }
		  : {
				  value: '',
				  label: `לא אויש`,
			},
			description: { value: description, label: description },
		}
		,
		onSubmit: async (values, { resetForm }) => {
			setLoading(true);
			const { driver_first_name, start_time, current_trip,locations,description } =values;
			
			const newObj={
				issue_type:"discipline",
				start_date :start_date.label,
				start_time : start_time.label,
				end_day : '',
				end_time : '',
				nick_name : driver_first_name.label,
				trip_name : current_trip.label,
				created_by : '',
				user_phone : '',
				repete_every :'',
				driver_id : '',
				driver_first_name : driver_first_name.label,
				comment : '',
				description:description.label,
				event_latitude:locations.label,
				event_longitude:locations.label,
				is_active : 1,
				order_id,
				planning_id,
			}	
	

			try {
				let res = await constraintStore.addIssues({ data: { ...newObj } });
				if (!!res?.length) {
					resetForm();
				}
			} catch (e) {
				console.error('e.message', e.message);
			}
			setLoading(false);
		},
	};

	//const toggleExtendedMap = () => setExtendedMap((state) => !state);


	useEffect(() => {
		setLoading(true);
		(async () => {
			let usersFomStore=toJS(constraintStore.userNames)
			let drivers = toJS(carDriverStore.carDriverList);
			// let chaperones = toJS(chaperonesStore.chaperonesList)

			setOptions({
			driver_first_name: [...drivers?.filter(({ driver_id }) => !!driver_id)],
			current_user: [...usersFomStore],
			current_trip:['aa','bb','ccc']
			});
		})();
		setLoading(false);
	}, [carDriverStore.carDriverList,users,driverData]);
	useEffect(() => {
		// if (!!options?.driver_first_name?.length) {
			setReady(true);
		// }
	}, [options]);

	return useObserver(() => (
		<div className={'ModalAddIssues'}>
			<>
				<div className='ModalIssues-top'>
					<ModalResourceChangesHeader
						toggle={toggle}
						tripName={'אירוע משמעת חדש'}
					/>
				</div>
				{/* <ActionButton toggleExpandMap={toggleExtendedMap} /> */}
				<Map
					{...{
						component:'addIssue',
						stations: [],
						driverLocationHistory: [],
						remainingStations: [],
						driveStatus: 2,
						updatedStations:[]
					}}
				></Map>
			</>
			<Formik {...formikProps} innerRef={formikRef}>
				{({ values, handleSubmit, setFieldValue }) => (
					<>
						{ready && (
							<div className='ModalResourceChanges-middle'>
								{' '}
								<ModalAddIssuesInputs toggle={toggle}/>
							</div>
						)}
						{/* <div className='ModalResourceChanges-below'>
							{' '}
							<ModalResourceChangesButton
								action={formikRef?.current?.submitForm}
								dirty={formikRef?.current?.dirty}
							/>
						</div> */}
					</>
				)}
			</Formik> 
		</div>
	))
};

export default observer(ModalAddIssues);
