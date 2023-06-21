import { Formik } from 'formik';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TableDataService from 'services/TableDataService';
import * as Yup from 'yup';
import { Submit } from '../../../FormControls';
import ModalWrapper from '../../../Modal/Modal';
import { formInitialValues } from '../../config/config';
import {_contactPeopleOfContract} from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import {
	formatOptionForSelect,
	getFormComponent,
	getOptionsForSelect,
	orderFormBySections,
	getDataForUpdateModals,
	transformForUpdate,
} from '../../config/helpers';
import '../UpdateEntityForm.scss';
import {
	transformForCreate,
	createVehiclesTabs,
} from '../../CreateEntityForm/helpers';
import { toast } from 'react-toastify';
import { useStores } from 'stores';
import moment from 'moment';

function UpdateEntityTabs({
	isOpen,
	toggle,
	initialValues,
	table_name,
	tab_name,
	setRowData,
	middle_modal_width,
	extraDataForTabs,
	padding,
	specialWidthForModal,
}) {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [extraData, setExtraData] = useState([]);
	const { dataTableStore } = useStores();
	const [sections, setSections] = useState([]);
	const [table_name_state, setTable_name] = useState(table_name);
	const [contactPeopleOfContract, setContactPeopleOfContract] = useRecoilState(_contactPeopleOfContract);

	useEffect(() => {
		if (!!tab_name) {
			let fieldForTabsModal = getDataForUpdateModals(tab_name);

			let sectionsFilter = orderFormBySections(fieldForTabsModal);
			setSections(sectionsFilter);
			setData(fieldForTabsModal);
			if (tab_name === 'contacts') {
				setTable_name('contacts');
			}
			if (tab_name === 'resources') {
				setTable_name('resources');
			}
		}
	}, [tab_name]);

	let fields = JSON.parse(localStorage.getItem('fields_of_table'));

	const EntitySchema = Yup.object().shape({
		//creating the validation schema for the form
		...Object.values(fields).reduce(
			(total, v) =>
				!!v.form_field_order
					? { ...total, [v.field_name]: v.validation }
					: total,
			{},
		),
	});

	let sectionsForFormField = useMemo(() => sections, [data]);

	const formikProps = {
		initialValues: transformForUpdate(initialValues, dataTableStore),
		// validate: (v) => ,
		// validationSchema: EntitySchema,// TODO: fix validation schema
		onSubmit: async (values, { resetForm }) => {
			switch (table_name_state) {
		
				case 'contacts':
					let valuesForContacts = {
						first_name: values.first_name,
						last_name: values.last_name,
						email: values.email,
						phone_number: values.phone_number,
						contract_id: values.id,
						role: values.role,
					};
					let data = { ...transformForCreate(valuesForContacts) };
					await TableDataService.addEntity({
						data: data,
						table_name: 'contracts_contacts',
					});
					//add to the store
					let contactPeople = await  TableDataService.getContractsWithContacts()
					if (Array.isArray(contactPeople)) {
						setContactPeopleOfContract(contactPeople);
						const contact_person = contactPeople?.filter(x => x.contract_id === values.id);
						let newRowData = { ...initialValues};
						newRowData.contact = contact_person;				
						setRowData(newRowData);

					}
					setLoading(false);
					toggle();
					break;

				case 'vehicles':
					let dataExtra = createVehiclesTabs(extraData, initialValues.id);
					await TableDataService.updateEntity({
						data: transformForCreate(values),
						table_name: 'vehicles',
						id: initialValues.id,
					});

					dataExtra.map(async (item) => {
						await TableDataService.addEntity({
							data: transformForCreate(item),
							table_name: 'vehicles_extra',
						});
					});
					break;
					case 'resources':
							setLoading(true);
							
							let newDriver = {
								nick_name: values.nick_name,
								phone_number: values.phone_number,
								sub_constractor_id: values.sub_constractor_id,
								car_number: values.car_number,


							};
							let newVehicle={
								car_number: values.car_number,
								driver_fname: values.nick_name,
								driver_mobile2: values.phone_number,
								driver_id:values.id,
								sub_constractor_id: values.sub_constractor_id,
							};
							let checkCar=(resource)=>{ return resource.vehicle_id===values.id&&!!resource.driver_id}
							let checkDriver=(resource)=>{ return resource.driver_id===values.id&&!!resource.vehicle_id}
							const result = initialValues?.resource_bank?.filter((resource) =>resource.driver_id===values.id&&!!resource.vehicle_id
							);
				
							if(result){
								await TableDataService.updateEntity({
								data: newDriver,
								table_name: 'drivers',
								id: result[0].driver_id,

							})
								await TableDataService.updateEntity({
									data: newVehicle,
									table_name: 'vehicles',
									id: result[0].vehicle_id,

								});
								setLoading(false);		
								toggle();
			

							}else{

								// await TableDataService.updateEntity({
								// 	data: newDriver,
								// 	table_name: 'drivers',
								// 	id: values.id,
	
								// })
								setLoading(false);
								toggle();
					


							}
						break;

				default:
					setLoading(true);
					await TableDataService.updateEntity({
						data: transformForCreate(values),
						table_name: table_name,
						id: initialValues.id,
					});
					setLoading(false);
					toggle();
					break;
			}
		},
	};

	const formikRef = useRef();

	return (
		<ModalWrapper
			isOpen={isOpen}
			toggle={toggle}
			middle_modal_width={middle_modal_width}
			title={
				tab_name
					? t(`right_dialog.tabs.${tab_name}.title_modal`)
					: t(`entity_form.${table_name_state}.create_title`)
			}
			padding={padding}
			specialWidthForModal={
				tab_name === 'driver_capability' ? specialWidthForModal : ''
			}
		>
			<div className='create-entity-container'>
				{/* <StylesProvider jss={jss}> */}
				<Formik {...formikProps} innerRef={formikRef}>
					{({ values, handleSubmit, setFieldValue }) => {
						return (
							<>
								<div style={{ margin: 24 }}>
									{Object.entries(sections)?.map(([key, fieldsArr]) => (
										<div
											className={`section-wrapper ${table_name_state}-${key}`}
										>
											{!(
												fieldsArr &&
												fieldsArr[0] &&
												fieldsArr[0].customLabel
											) && (
												<p className='section-title'>
													{t(
														`entity_form.${table_name_state}.${key.toString()}`,
													)}
												</p>
											)}
											{/* { section wrapper */}
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
													is_required,
												}) => {
													let FormComponent = getFormComponent(component);
													let formProps = {
														value: values[field_name],
														name: field_name,
														width: middle_modal_column_width,
														onChange: (e) => {
															switch (component) {
																case 'select':
																	setFieldValue(field_name, e);
																	break;
																case 'SelectCheckbox':
																		setFieldValue(field_name, e);
																		break;
																case 'multiple_select':
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
																	break;
																case 'switch':
																	setFieldValue(field_name, e);
																	break;
																case 'Vehicles_capabilities_linesTable':
																	setExtraData(e);
																	break;
																case 'LinesTableDrivers':
																	setFieldValue(field_name, e);
																	setExtraData(e);
																	break;
																case 'date-time-picker':
																	break;
																case 'filePicker':
																	setFieldValue(field_name, e);
																	break;
																case 'DocumentPicker':
																	setFieldValue(field_name, e);
																	break;
																case 'DocumentPicker':
																	setFieldValue(field_name, e);
																	break;
																case 'DatePicker':
																	setFieldValue(
																		field_name,
																		moment.utc(e).format('YYYY-MM-DD HH:mm:ss'),
																	);
																	break;
																	case 'constraints_table':
																		setFieldValue(field_name, e);
																case 'Checkbox':
																	setFieldValue(field_name, e);
																	break;
																default:
																	// for input
																	setFieldValue(field_name, e.target.value);
																	break;
															}
														},
														// ...(component === 'Vehicles_capabilities_linesTable') && {
														// extraData,
														//  setExtraData,
														// },

														...(component === 'select' && {
															options: getOptionsForSelect({
																field_name,
																table_name_state,
																drop_list_values,
															}),
															formatOptions: formatOptionForSelect,
															data_source,
															is_required,
														}),
														...(component === 'multiple_select' && {
															options: getOptionsForSelect({
																field_name,
																table_name,
																drop_list_values,
															}),
															multi: true,
															is_required,

															formatOptions: formatOptionForSelect,
															data_source,
														}),
														...(component === 'SelectCheckbox' && {
															options: getOptionsForSelect({
																field_name,
																table_name,
																drop_list_values,
															}),
															multi:true,
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
																			padding: '0 1px 0 1px',
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
																	t(`entity_form.${table_name_state}.${label}`)
																}
																disabled={loading}
																initialValues={initialValues}

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
											marginTop: 70,
										}}
									>
										<Submit
											label={
												tab_name
													? t(`right_dialog.tabs.${tab_name}.actions.create`)
													: t(`entity_form.${table_name_state}.actions.create`)
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
		</ModalWrapper>
	);
}

export default UpdateEntityTabs;
