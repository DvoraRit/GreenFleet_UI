import { Formik } from 'formik';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TableDataService from 'services/TableDataService';
import * as Yup from 'yup';
import { Submit } from '../../../FormControls';
import ModalWrapper from '../../../Modal/Modal';
import { formInitialValues } from '../../config/config';
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
	createPriceList,
} from '../../CreateEntityForm/helpers';
import { toast } from 'react-toastify';
import { useStores } from 'stores';
import moment from 'moment';


function CreateTabsModal({
	isOpen,
	toggle,
	table_name,
	tab_name,
	specialValueForModal,
	showMap,
	middle_modal_width,
	padding

}) {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const { dataTableStore } = useStores();
	const [sections, setSections] = useState([]);

	useEffect(() => {
		if (!!tab_name) {
			let fieldForTabsModal = getDataForUpdateModals(tab_name);

			let sectionsFilter = orderFormBySections(fieldForTabsModal);
			setSections(sectionsFilter);
			setData(fieldForTabsModal);
		}
	}, [tab_name]);

	// const EntitySchema = Yup.object().shape({
	// 	//creating the validation schema for the form
	// 	...Object.values(fields).reduce(
	// 		(total, v) =>
	// 			!!v.form_field_order
	// 				? { ...total, [v.field_name]: v.validation }
	// 				: total,
	// 		{},
	// 	),
	// });
	let sectionsForFormField = useMemo(() => sections, [data]);

	/*
  		initialValues: Object.values(sections).reduce(
			(total, v) =>
				!!v.form_field_order
					? { ...total, [v.field_name]: v.field.initValue }
					: total,
			[],
		),
    */
	const formikProps = {
		initialValues: Object.values(sectionsForFormField)
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
			switch (table_name) {
				case 'drivers':
					if (!!tab_name!=='documents') {
					let resDrivers = await TableDataService.addEntity({
						data: transformForCreate(values),
						table_name: 'drivers',
					});

					if (resDrivers?.success) {
						toast.success(resDrivers.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
						resetForm();
					} else {
						toast.error(resDrivers.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
					}
				}else{
					let resDoc = await TableDataService.addEntity({
						data: transformForCreate(values),
						table_name: 'documents',
					});
					if (resDoc?.success) {
						toast.success(resDoc.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
						resetForm();
					} else {
						toast.error(resDoc.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
					}
				}
					toggle()


					break;					
				case 'driver_contacts':
					if (tab_name === 'driver_connection') {
						 let resDrivers = await TableDataService.addEntity({
							data: transformForCreate({
								...values,
								driver_id: specialValueForModal,
							}),
							table_name: 'driver_contacts',
						});
                        if (resDrivers?.success) {
                            toast.success(resDrivers.data.message, {
                                position: toast.POSITION.BOTTOM_LEFT,
                            });
                            resetForm();
                        } else {
                            toast.error(resDrivers.data.message, {
                                position: toast.POSITION.BOTTOM_LEFT,
                            });
                        }
						toggle()

                    }
				case 'passengers':
						if (tab_name === 'passengers') {
							 let resDrivers = await TableDataService.addEntity({
								data: transformForCreate({
									...values,
									customer_id_connection: specialValueForModal,
								}),
								table_name: 'passengers',
							});
							if (resDrivers?.success) {
								toast.success(resDrivers.data.message, {
									position: toast.POSITION.BOTTOM_LEFT,
								});
								resetForm();
							} else {
								toast.error(resDrivers.data.message, {
									position: toast.POSITION.BOTTOM_LEFT,
								});
							}
							toggle()
	
						}
						break;

					case 'resources':
							setLoading(true);

							let newDriver = {
								nick_name: values.nick_name,
								phone_number: values.phone_number,
								car_number: values.car_number,
								sub_constractor_id: specialValueForModal[0],
								scopes:specialValueForModal[1]

							};
	
							await TableDataService.addEntity({
								data: newDriver,
								table_name: 'drivers',
							});
							let newVehicle={
								car_number: values.car_number,
								driver_fname: values.nick_name,
								driver_mobile2: values.phone_number,
								sub_constractor_id: specialValueForModal[0],
								scope:specialValueForModal[1]
								
							};
							await TableDataService.addEntity({
									data: newVehicle,
									table_name: 'vehicles',
								});
							setLoading(false);
							resetForm();
					

							toggle()
						break;
				case 'customers_contacts':
							if (tab_name === 'customers_contacts') {
								 let resContacts = await TableDataService.addContactsForCustomer({
									data: {
										customerId: specialValueForModal,
										contactId: values.contact_id.value,
										contactType: parseInt(values.contact_type.value),
										entityName: 'customers',
									},
								
								});
								if (!!resContacts) {
									toast.success(resContacts.data.message, {
										position: toast.POSITION.BOTTOM_LEFT,
									});
									resetForm();
									toggle()

								} else {
									toast.error(resContacts.data.message, {
										position: toast.POSITION.BOTTOM_LEFT,
									});
								}
								toggle()
		
							}
                        break;
                case 'chaperone_contacts':
                            if (tab_name === 'chaperone_connection') {    
                                 let resDrivers = await TableDataService.addEntity({
                                    data: transformForCreate({
                                        ...values,
                                        chaperone_id: specialValueForModal,
                                    }),
                                    table_name: 'chaperone_contacts',
                                });
								toggle()

                                if (resDrivers?.success) {
                                    toast.success(resDrivers.data.message, {
                                        position: toast.POSITION.BOTTOM_LEFT,
                                    });
                                    resetForm();
                                } else {
                                    toast.error(resDrivers.data.message, {
                                        position: toast.POSITION.BOTTOM_LEFT,
                                    });
                                }
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
						toast.error(res.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
					}
					break;
			}
			setLoading(false);
			toggle()
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
					: t(`entity_form.${table_name}.create_title`)
			}
			padding={padding}
		>
			<div className='create-entity-container'>
				{/* <StylesProvider jss={jss}> */}
				<Formik {...formikProps} innerRef={formikRef}>
					{({ values, handleSubmit, setFieldValue }) => {
						return (
							<>

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
												is_required,

											}) => {
												let FormComponent = getFormComponent(component);
												let formProps = {
													value: values[field_name],is_required,
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
															case 'switch':
																setFieldValue(field_name, e);
																break;
															case 'DatePicker':
																setFieldValue(field_name, moment.utc(e).format('YYYY-MM-DD HH:mm:ss'));
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
															case 'linesTable':
																setFieldValue(field_name, e);
																break;
															case 'LinesTableDrivers':
																setFieldValue(field_name, e);
																break;
															case 'extrasTable':
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
														multi:true,
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
													...(field_name === 'comment' && { multiline: true }),
                                                    ...(component === 'DocumentPicker' && { IdInEntity:specialValueForModal ,table_name:table_name, tab_name:tab_name}),
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
							</>
						);
					}}
				</Formik>
			</div>
		</ModalWrapper>
	);
}

export default CreateTabsModal;
