import React, { useState, useRef, useEffect } from 'react';
import './ModalResourceChanges.scss';
import ModalResourceChangesHeader from './ModalResourceChangesHeader/ModalResourceChangesHeader';
import ModalResourceChangesInputs from './ModalResourceChangesInputs/ModalResourceChangesInputs';
import ModalResourceChangesButton from './ModalResourceChangesButton/ModalResourceChangesButton';
import { Formik, ErrorMessage, Form } from 'formik';
import { useStores } from 'stores/index';
import { toJS } from 'mobx';
import ResourcesService from 'services/ResourcesService';
import { useObserver } from 'mobx-react';
import usePostPublishUpdate from '../../services/hooks/usePostPublishUpdate';
import { toast } from 'react-toastify';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme } from '@mui/material/styles';
import ResourceBankService from 'services/ResourceBankService';
import moment from 'moment';
import { useRecoilState } from 'recoil';
import { _resourceBankStoreRender } from 'recoil/atoms';
import { CatchingPokemonSharp } from '@mui/icons-material';

// import { ChaperonesService } from 'services/planning/ChaperonesService';
// import { PlanningServices } from 'services/planning/PlanningService';
// import { CarDriverService } from 'services/planning/CarDriverService';

const ModalResourceChanges = ({ toggle, tripDetails = {}, toggleDialog }) => {
	const {
		driver_id = '',
		driver_first_name = '',
		driver_last_name = '',
		car_number = '',
		// vehicle_id: car_id,
		chaperone_id: chaperon_id = '',
		chaperone_nick_name: chaperon_name = '',
		order_type_id: type_id = '',
		type_name = '',
		// order_type_id,
		// total_vehicles = '',
		num_of_passengers = '',
		trip_name = '',
		color,
		order_id,
		has_publish,
		planning_id,
	} = tripDetails;

	const { carDriverStore, resourceBankStore, chaperonesStore, taskStore } =
		useStores();

	const [loading, setLoading] = useState(false);
	const [ready, setReady] = useState(true);
	const formikRef = useRef();
	const [tripTypes, setTripTypes] = useState([]);
	const [resourcesBank, setResourcesBank] = useState([]);
	const [resourceBankStoreRender, setResourceBankStoreRender] = useRecoilState(
		_resourceBankStoreRender,
	);
	const [car_id, setCar_id] = useState(
		tripDetails?.vehicle_id ? tripDetails?.vehicle_id : tripDetails?.car_id,
	);
	const [state, dispatch] = usePostPublishUpdate(has_publish);

	const formikProps = {
		initialValues: {
			drivers: driver_id
				? {
						value: driver_id,
						label: `${driver_first_name} ${driver_last_name}`,
				  }
				: {
						value: '',
						label: `לא אויש`,
				  },
			vehicles: car_id
				? { value: car_id, label: car_number }
				: {
						value: '',
						label: `לא אויש`,
				  },
			chaperones: chaperon_id
				? { value: chaperon_id, label: chaperon_name }
				: {
						value: '',
						label: `לא אויש`,
				  },
			trip_types: type_id
				? { value: type_id, label: type_name, color: color }
				: {
						value: '',
						label: `לא אויש`,
				  },
			// total_vehicles: { value: total_vehicles, label: total_vehicles },
			num_of_passengers: num_of_passengers
				? { value: num_of_passengers, label: num_of_passengers.toString() }
				: {
						value: '',
						label: `לא אויש`,
				  },
		},
		// validate: (v) => ,
		onSubmit: async (values, { resetForm }) => {
			setLoading(true);
			let body = {
				planning_id,
			};

			//check if we changed chaperone driver


			if (
				values?.drivers?.value !== driver_id ||
				// values.vehicles.value !== car_id || //no need to check vehicle for publishing
				(values?.chaperones?.value !== chaperon_id &&
					!!values?.chaperones?.value &&
					!!chaperon_id)
			) {
				//if yes we will check if trip is published
				if (!!dispatch) {
					// debugger;
					//check if we need new resource bank id
					// if (!values?.drivers?.resource_id || !values?.vehicles?.resource_id) {
					if (!values?.drivers?.resource_id) {
						//not need resourceBankId
						try {
							await dispatch({
								type: 'addDriverToMultipleTrips',
								payload: {
									vehicle_id: values?.vehicles?.value,
									driver_id: values?.drivers?.value,
									planning_id: [planning_id],
								},
							});
						} catch (e) {
							console.error('e', e);
						}
						//dispatch update driver
						// await dispatch({
						// 	type: 'addDriverToTrip',
						// 	payload: {
						// 		order_id,
						// 		planning_id,
						// 		resource_bank_id: values?.drivers?.resource_id,
						// 	},
						// });
					} else {
						//if we need new resource bank id
						try {
							await dispatch({
								type: 'addDriverToMultipleTrips',
								payload: {
									// order_id,
									// planning_id,
									planning_id: [planning_id],

									resource_bank_id: values?.drivers?.resource_id,
								},
							});
						} catch (e) {
							console.error('e', e);
						}
					}

					if (
						values?.chaperones?.value !== chaperon_id &&
						!!chaperon_id &&
						values?.chaperones?.value
					) {
						try {
							await dispatch({
								type: 'addChaperonToTrip',
								payload: {
									order_id,
									planning_id,
									resource_bank_id: values?.chaperones?.resource_id,
								},
							});
						} catch (e) {
							console.error('e', e);
						}
					}
				} else {
					//check if need new resource_bank_id
					if (!values?.drivers?.resource_id || !values?.vehicles?.resource_id) {
						body.driver_id = values?.drivers?.value;
						body.vehicle_id = values?.vehicles?.value;

						// CarDriverService.insertResourceBank({
						// 	vehicle_id: values?.vehicles?.value,
						// 	driver_id: values?.drivers?.value,
						// 	planning_id,
						// });
					} else {
						//just update resource bank id
						body.resourceBankId = values?.drivers?.resource_id;

						// CarDriverService.updatePlanningResourceBankId({
						// 	new_resource_bank_id: values?.drivers?.resource_id,
						// 	planning_id,
						// });
					}

					//trip not published we will just update the new values (separately)
					//if chaperones changed
					if (chaperon_id !== values?.chaperones?.value) {
						body.chaperone_id = values?.chaperones?.value;
						// ChaperonesService.updateChaperoneInTrip(values?.chaperones?.value);
					}
					//if numOfPassengers changed
					if (num_of_passengers !== values.num_of_passengers?.value) {
						body.passengers = values.num_of_passengers?.value;
						body.order_id = order_id;
						// PlanningServices.updatePassengersNumber({
						// 	num_of_passengers: values?.num_of_passengers?.value,
						// 	planning_id,
						// });
					}
					//if type changed
					if (type_id !== values?.trip_types?.value) {
						body.type_id = values.trip_types?.value;
						body.order_id = order_id;
						// PlanningServices.updateTripType({
						// 	trip_types: values?.trip_types?.value,
						// 	planning_id,
						// });
					}
				}
			} else {
				//driver vehicle and chaperone didnt changed
				//if chaperones changed
				if (values.vehicles.value !== car_id) {
					if (!values?.drivers?.resource_id || !values?.vehicles?.resource_id) {
						body.driver_id = values?.drivers?.value;
						body.vehicle_id = values?.vehicles?.value;
					} else {
						//just update resource bank id
						body.resourceBankId = values?.drivers?.resource_id;
					}
				}

				if (chaperon_id !== values?.chaperones?.value) {
					body.chaperone_id = values?.chaperones?.value;
					// ChaperonesService.updateChaperoneInTrip(values?.chaperones?.value);
				}
				//if numOfPassengers changed
				if (num_of_passengers !== values.num_of_passengers?.value) {
					body.passengers = values.num_of_passengers?.value;
					body.order_id = order_id;
					// PlanningServices.updatePassengersNumber({
					// 	num_of_passengers: values?.num_of_passengers?.value,
					// 	planning_id,
					// });
				}
				//if type changed
				if (type_id !== values?.trip_types?.value) {
					body.type_id = values.trip_types?.value;
					body.order_id = order_id;
					// PlanningServices.updateTripType({
					// 	trip_types: values?.trip_types?.value,
					// 	planning_id,
					// });
				}
			}
			if (Object.keys(body)?.length > 1) {
				let response = await ResourcesService.updateResource({ ...body });

				if (response) {
					let userZones = localStorage.getItem('zones')?.split(',');
					let date = moment().format('YYYY-MM-DD');

					let v_tasks = await ResourceBankService.getAllTasks(userZones, date);
					resourceBankStore.setResourceBank(v_tasks);
					setResourceBankStoreRender((state) => state + 1);
					toggleDialog();
					toast.success('שונה בהצלחה', {
						position: toast.POSITION.BOTTOM_LEFT,
					});
				} else {
					toast.error('נסה שוב', { position: toast.POSITION.BOTTOM_LEFT });
				}
			} else {
				let userZones = localStorage.getItem('zones')?.split(',');
				let date = moment().format('YYYY-MM-DD');

				let v_tasks = await ResourceBankService.getAllTasks(userZones, date);
				resourceBankStore.setResourceBank(v_tasks);
				setResourceBankStoreRender((state) => state + 1);
				toggleDialog();
				toast.success('שונה בהצלחה', {
					position: toast.POSITION.BOTTOM_LEFT,
				});
			}
			setLoading(false);
		},
	};

	useEffect(() => {
		(async () => {
			let tripTypesArr = await resourceBankStore.types;
			let resourcesBankList = await carDriverStore.resourceBankList;
			setTripTypes([...toJS(tripTypesArr)]);
			setResourcesBank([...toJS(resourcesBankList)]);
		})();
	}, []);

	const cacheRtl = createCache({
		key: 'muirtl',
		stylisPlugins: [prefixer, rtlPlugin],
	});

	const theme = createTheme({
		direction: 'rtl',
	});

	return useObserver(() => (
		<CacheProvider value={cacheRtl}>
			<div
				className='ModalResourceChanges-main'
				style={{
					backgroundColor: '#fff',
					height: 470,
					width: 560,
					position: 'absolute',
					top: '50%',
					left: '50%',
					transform: 'translate(-50%, -50%)',
				}}
			>
				<Formik {...formikProps} innerRef={formikRef}>
					{({ values, handleSubmit, setFieldValue }) => (
						<>
							<div className='ModalResourceChanges-top'>
								<ModalResourceChangesHeader
									toggle={toggle}
									tripName={trip_name}
									type_color={color}
								/>
							</div>
							<div className='ModalResourceChanges-middle'>
								{' '}
								{ready && (
									<ModalResourceChangesInputs
										values={values}
										formikRef={formikRef}
										type_name={type_name}
										color={color}
										tripTypes={tripTypes}
										resourcesBank={resourcesBank}
										sub_constractor_name={tripDetails.sub_constractor_name}
										sub_constractor_id={tripDetails.sub_constractor_id}
									/>
								)}
							</div>
							<div className='ModalResourceChanges-below'>
								{' '}
								<ModalResourceChangesButton
									action={handleSubmit}
									dirty={formikRef?.current?.dirty}
									loading={loading}
								/>
							</div>
						</>
					)}
				</Formik>
			</div>
		</CacheProvider>
	));
};

export default ModalResourceChanges;
