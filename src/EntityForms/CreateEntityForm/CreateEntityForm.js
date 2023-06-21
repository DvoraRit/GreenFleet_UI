import { Formik } from 'formik';
import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import TableDataService from 'services/TableDataService';
import * as Yup from 'yup';
import { Submit } from '../../FormControls';
import ModalWrapper from '../../Modal/Modal';
import MapComponent from '../../FormControls/MapComponent/MapComponent';
import { formInitialValues } from '../config/config';
import {
	constraintsExtraFieldsOfTable,
	priceExtraFieldsOfTable,
} from './create_entity_form_config';
import ActionButton from 'containers/Planning/Dialog/DialogWrapper/components/ActionButtons';
import currencies from '../../../constants/currencies.json';
import {
	formatOptionForSelect,
	getFormComponent,
	getOptionsForSelect,
	orderFormBySections,
} from '../config/helpers';
import './CreateEntityForm.scss';
import { transformForCreate, createPriceList, createContract } from './helpers';
import { toast } from 'react-toastify';
import moment from 'moment';
import {
	_selectedCurrencySymbol,
	_pricesListForContract,
} from '../../../recoil/atoms';
import { useRecoilState } from 'recoil';
import { style } from '@mui/system';
import AreYouSureModal from 'components/AreYouSureModal/AreYouSureModal';

function CreateEntityForm({
	isOpen,
	toggle,
	table_name,
	tab_name,
	showMap,
	middle_modal_width,
	padding,
	allData,
	isAdmin,
}) {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useRecoilState(
		_selectedCurrencySymbol,
	);
	let fields = JSON.parse(localStorage.getItem('fields_of_table'));

	fields = [
		...fields,
		...constraintsExtraFieldsOfTable,
		...priceExtraFieldsOfTable,
	];

	const [pricesListForContract, setPricesList] = useRecoilState(
		_pricesListForContract,
	);
	const [areYouSure, setAreYouSure] = useState(false);

	const toggleAreYouSure = (variant) => {
		setAreYouSure(variant);
	};

	fields = fields.filter(
		({
			table_name: tableName,
			middle_modal_order,
			middle_modal_section_index,
		}) =>
			table_name === tableName &&
			!!middle_modal_order &&
			!!middle_modal_section_index,
	);

	let sections = useMemo(() => orderFormBySections(fields), [fields]);

	const formikProps = {
		initialValues: Object.values(sections)
			.reduce((total, v) => [...total, ...v], [])
			.reduce(
				(values, { component, field_name }) => ({
					...values,
					[field_name]: formInitialValues[component],
				}),
				{},
			),
		// validate: (v) =>
		// validationSchema: EntitySchema,//TODO:fix validation schema
		onSubmit: async (values, { resetForm }) => {
			setLoading(true);
			let responseFromServer = null;
			switch (table_name) {
				case 'order_constraints':
					responseFromServer =
						await TableDataService.updateConstraintsForOrder();
					break;

				case 'price_list':
					//TODO dvora api from Gilad
					let req = await TableDataService.addPriceList({
						data: createPriceList(values),
					});
					if (req?.success) {
						toast.success(req.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
						resetForm();
					} else {
						toast.error(req.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
					}
					break;

				case 'contracts':
					let data = createContract(values);
					let req2 = await TableDataService.addOrUpdateContract({
						data: data,
					});
					if (req2?.success) {
						toast.success(req2.data, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
						resetForm();
					} else {
						toast.error(req2.data, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
					}
					//get contracts_extra
					let allPricesList =
						await TableDataService.getContractsPriceListDetails();
					if (Array.isArray(allPricesList)) {
						setPricesList(allPricesList);
					}
					break;

				case 'trip_type':
					//get id of last trip_type
					let lastTripType = allData?.sort((a, b) => a.id - b.id)[
						allData.length - 1
					];
					let new_id = lastTripType?.id + 1;
					values = { ...values, id: new_id };

					let createTripType = await TableDataService.addEntity({
						data: transformForCreate(values),
						table_name: table_name,
					});

					if (createTripType?.success) {
						toast.success(createTripType.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
						resetForm();
					} else {
						setLoading(false);
						toast.error(createTripType.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
					}
					break;
				case 'vehicles':
					let newVehicle = {
						car_number: values.car_number,
						car_type_name: values.car_type_name.label,
						vehicle_type:values.car_type_name.value,
						comment: values.comment,
						icon_size: values.icon_size.value,
						is_active: values.is_active,
						scope: values.scope.value,
					};
					let createVehicles = await TableDataService.addEntity({
						data: newVehicle,
						table_name: table_name,
					});

					if (createVehicles?.success) {
						toast.success(createVehicles.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
						resetForm();
					} else {
						setLoading(false);
						toast.error(createVehicles.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
					}
					break;
				case 'all_stations':
					let longLatArray = values?.latitude.split(',');
					let newPoint = {
						latitude:longLatArray[0],
						longitude:longLatArray[1],
						station_name:values.station_name,
						address:values.address
					}
					let addPoint = await TableDataService.addEntity({
						data: newPoint,
						table_name: table_name,
					});

					if (addPoint?.success) {
						toast.success(addPoint.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
						resetForm();
					} else {
						setLoading(false);
						toast.error(addPoint.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
					}
					break;
					default:
					let res = await TableDataService.addEntity({
						data: transformForCreate(values),
						table_name: table_name,
					});

					if (res?.success) {
						toast.success(res.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
						resetForm();
					} else {
						setLoading(false);
						toast.error(res.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
					}
					break;
			}
			setLoading(false);
			toggle();
		},
	};

	const formikRef = useRef();

	return (
		<ModalWrapper
			isOpen={isOpen}
			toggle={() => toggleAreYouSure('reject')}
			middle_modal_width={middle_modal_width}
			title={
				tab_name
					? t(`right_dialog.tabs.${tab_name}.title_modal`)
					: t(`entity_form.${table_name}.create_title`)
			}
			paddingBottom={padding}
		>
			<>
				<div className='create-entity-container'>
					{/* <StylesProvider jss={jss}> */}
					<Formik {...formikProps} innerRef={formikRef}>
						{({ values, handleSubmit, setFieldValue }) => {
							return (
								<>
									{showMap && (
										<div>
											{' '}
											<MapComponent
												setFieldValue={setFieldValue}
												table_name={table_name}
											/>{' '}
											<ActionButton create_driver={true} />
										</div>
									)}
									<div style={{ margin: 24 }}>
										{Object.entries(sections)?.map(([key, fieldsArr]) => (
											<div className={`section-wrapper ${table_name}-${key}`}>
												{!(
													fieldsArr &&
													fieldsArr[0] &&
													fieldsArr[0].customLabel
												) && (
													<p className='section-title'>
														{t(`entity_form.${table_name}.${key.toString()}`)}
													</p>
												)}
												{/* section wrapper */}
												{fieldsArr.map(
													({
														field_name,
														label,
														component,
														drop_list_values,
														drop_list_Header,
														max_length,
														validation,
														middle_modal_section_index,
														middle_modal_order,
														data_source,
														middle_modal_column_width,
														customLabel,
														icon_data,
														is_required,
													}) => {
														let FormComponent = getFormComponent(component);
														let formProps = {
															value: values[field_name],
															icon_data,
															is_required,
															name: field_name,
															width: middle_modal_column_width,
															onChange: (e) => {
																switch (component) {
																	case 'select':
																		setFieldValue(field_name, e);
																		if (field_name === 'currency') {
																			//fing the currency simbol
																			let simbol = currencies[e.value].symbol;
																			setSelectedCurrencySymbol(simbol);
																		}
																		break;
																	case 'switch':
																		setFieldValue(field_name, e);
																		break;
																	case 'inputNumber':
																		setFieldValue(field_name, e.target.value);
																	case 'DatePicker':
																		setFieldValue(
																			field_name,
																			moment
																				.utc(e)
																				.format('YYYY-MM-DD HH:mm:ss'),
																		);
																		break;
																	case 'date-time-picker':
																		break;
																	case 'filePicker':
																		setFieldValue(field_name, e);
																		break;
																	case 'DocumentPicker':
																		setFieldValue(field_name, e);
																		break;
																	case 'Checkbox':
																		setFieldValue(field_name, e);

																		break;
																	case 'timePicker':
																		setFieldValue(field_name, e);
																		break;
																	case 'linesTable':
																		setFieldValue(field_name, e);
																		break;
																	case 'LinesTableDrivers':
																		setFieldValue(field_name, e);
																		break;
																	case 'extrasTable':
																		setFieldValue(field_name, e);
																		break;
																	case 'itemsOfContract':
																		setFieldValue(field_name, e);
																		break;
																	case 'multiple_select':
																		if (field_name === 'zones') {
																			let z = [];
																			e.forEach((zone) => {
																				if (!!zone.value) {
																					z.push({
																						label: zone.value,
																						value: zone.value,
																					});
																				}
																			});
																			setFieldValue(field_name, z);
																		}
																		break;
																	case 'station_name':
																		setFieldValue(field_name, e);
																	default:
																		// for input
																		setFieldValue(field_name, e.target.value);
																		break;
																}
															},
															...(component === 'select' && {
																options: getOptionsForSelect({
																	field_name,
																	table_name,
																	drop_list_values,
																}),
																formatOptions: formatOptionForSelect,
																data_source,
															}),
															...(component === 'multiple_select' && {
																options: getOptionsForSelect({
																	field_name,
																	table_name,
																	drop_list_values,
																}),
																multi: true,
																formatOptions: formatOptionForSelect,
																data_source,
																is_required,
															}),
															...(field_name === 'comment' && {
																multiline: true,
															}),

															// ...props,
														};

														return (
															<div
																className={`form-field-container ${field_name}`}
																style={
																	middle_modal_column_width
																		? {
																				minWidth: middle_modal_column_width,
																				maxWidth: middle_modal_column_width,
																				//padding: '0 0px 0 0px',
																		  }
																		: {
																				minWidth: '48%',
																				maxWidth: 244,
																				width: '100%',
																		  }
																}
															>
																<FormComponent
																	{...formProps}
																	label={
																		customLabel ||
																		t(`entity_form.${table_name}.${label}`)
																	}
																	disabled={loading}
																/>
															</div>
														);
													},
												)}
											</div>
										))}
										<div
											style={{
												display: 'flex',
												justifyContent: 'flex-end',
												marginTop: 20,
												paddingLeft: `${padding}px`,
											}}
										>
											<Submit
												label={
													tab_name
														? t(`right_dialog.tabs.${tab_name}.actions.create`)
														: t(`entity_form.${table_name}.actions.create`)
												}
												action={handleSubmit}
												loading={loading}
											/>
										</div>
									</div>
								</>
							);
						}}
					</Formik>
				</div>
				<AreYouSureModal
					isOpen={!!areYouSure}
					toggle={() => toggleAreYouSure(null)}
					title={t(`are_you_sure_modal.generic_title`)}
					body={t(`are_you_sure_modal.generic_body`)}
					variant={areYouSure}
					approveText={t(`are_you_sure_modal.yes`)}
					rejectText={t(`are_you_sure_modal.no`)}
					approveAction={() => {
						toggle();
						toggleAreYouSure(null);
					}}
					rejectAction={() => toggleAreYouSure(null)}
				/>
			</>
		</ModalWrapper>
	);
}

export default CreateEntityForm;
