import { Formik } from 'formik';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import TableDataService from 'services/TableDataService';
import { Submit } from '../../FormControls';
import ModalWrapper from '../../Modal/Modal';
import {
	formatOptionForSelect,
	getFormComponent,
	getOptionsForSelect,
	orderFormBySections,
	transformForUpdate,
} from '../config/helpers';
import { createPriceList,createContract } from '../CreateEntityForm/helpers';
import './UpdateEntityForm.scss';
import { useStores } from 'stores';
import { transformForCreate } from '../CreateEntityForm/helpers';
import {_selectedCurrencySymbol, _contactPeopleOfContract,_pricesListForContract} from '../../../recoil/atoms';
import { useRecoilState } from 'recoil';
import currencies from '../../../constants/currencies.json';
import MapComponent from '../../FormControls/MapComponent/MapComponent';
import moment from 'moment';

function UpdateEntityForm({
	initialValues,
	isOpen,
	toggle,
	table_name,
	tab_name,
	middle_modal_width,
	rowData,
	setRowData,
	updateRowData,
	isAdmin,
	showMap = false
}) {

	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);
	const { dataTableStore } = useStores();
	const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useRecoilState(_selectedCurrencySymbol);
	const [contactPeopleOfContract, setContactPeopleOfContract] = useRecoilState(_contactPeopleOfContract);
	const [pricesListForContract, setPricesList] = useRecoilState(_pricesListForContract);
	let fields = JSON.parse(localStorage.getItem('fields_of_table'));
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

	let sections = useMemo(() => orderFormBySections(fields), [fields]);

	// 	initialValues: Object.values(sections).reduce(
	// 	(total, v) =>
	// 		!!v.form_field_order
	// 			? { ...total, [v.field_name]: v.field.initValue }
	// 			: total,
	// 	[],
	// ),

	const formikProps = {
		initialValues: transformForUpdate(rowData? rowData :initialValues, dataTableStore, contactPeopleOfContract),
		// validate: (v) => ,
		// validationSchema: EntitySchema,// TODO: fix validation schema
		onSubmit: async (values, { resetForm }) => {
			setLoading(true);
			switch (table_name) {
				case 'price_list':
					let data = createPriceList(values);
					await TableDataService.addPriceList({
						data: data,
					});
					toggle();
					let newDataRow = {...data};
					newDataRow._lines = data._lines.filter(x=>x.items_or_extra==="item");
					newDataRow.extras = data._lines.filter(x=>x.items_or_extra==="extra");
					setRowData({...newDataRow});
					data._lines = newDataRow._lines.length;
					data.extras=newDataRow.extras.length;
					updateRowData(data.id, {...data});

					break;

					case 'vehicles':
					let newVehicleUpdate = {
						car_number: values.car_number,
						car_type_name: values.car_type_name.label,
						vehicle_type:values.car_type_name.value,
						comment: values.comment,
						icon_size: values.icon_size.value,
						is_active: values.is_active,
						scope: values.scope.value,
					};
					let updateVehicles =await TableDataService.updateEntity({
						data: newVehicleUpdate,
						table_name: table_name,
						id: initialValues.id,
					});

					if (updateVehicles?.success) {
						toast.success(updateVehicles.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
						resetForm();
					} else {
						setLoading(false);
						toast.error(updateVehicles.data.message, {
							position: toast.POSITION.BOTTOM_LEFT,
						});
					}
					toggle();
					break;
				
				case 'contracts':
					//update contract here
					let data2 = createContract(values);
					await TableDataService.addOrUpdateContract({
						data: data2,
					});
					//update prices list details after update contract
					let allPricesList = await TableDataService.getContractsPriceListDetails();
					if (Array.isArray(allPricesList)) {
						setPricesList(allPricesList);
						let extraPriceListData = allPricesList?.filter(
							(item) =>
							parseInt(item.contract_id) ===
							parseInt(initialValues?.id),
							);
							data2["items"] = extraPriceListData;
							let updated = {...data2, contact:rowData.contact, pricesList:extraPriceListData}
							setRowData(updated);//for update right dialog
							updateRowData(data2.id, updated);//for update table 
						}
					toggle();
					break;
				default:
					let newData = transformForCreate(values);
					await TableDataService.updateEntity({
						data: newData,
						table_name: table_name,
						id: initialValues.id,
					});
					setRowData(newData);
					updateRowData(newData.id, newData);
					toggle()
					break;
			}
			setLoading(false);
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
					: t(`entity_form.${table_name}.update_title`)
			}
			// modalContentStyle={{ padding: '4px 15px 5px 5px' }}
		>
			<div className='update-entity-container'>
				{/* <StylesProvider jss={jss}> */}
				<Formik {...formikProps} innerRef={formikRef}>
					{({ values, handleSubmit, setFieldValue }) => {
				
						return (
							<>
								{showMap && (
										<div style={{maxWidth:middle_modal_width}}>
											{' '}
											<MapComponent
												setFieldValue={setFieldValue}
												table_name={table_name}
												lat={initialValues.latitude}
												lng={initialValues.longitude}
											/>{' '}
											{/* <ActionButton create_driver={true} /> */}
										</div>
									)}
								<div style={{margin: '24px'}}>
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
													// drop_list_Header,
													// max_length,
													// validation,
													// middle_modal_section_index,
													// middle_modal_order,
													middle_modal_column_width,
													data_source,
													icon_data,
													// middle_modal_column_width,
													customLabel,
													is_required,
												}) => {
													let FormComponent = getFormComponent(component);
													let formProps = {
														value: values[field_name],is_required,icon_data,
														name: field_name,
														width: middle_modal_column_width,
														onChange: (e) => {
															switch (component) {
																case 'select':
																	setFieldValue(field_name, e);
																	if(field_name==="currency"){
																		//fing the currency simbol
																		let simbol = currencies[e.value].symbol;
																		setSelectedCurrencySymbol(simbol);
																	}
																	break;
																case 'SelectCheckbox':
																		setFieldValue(field_name, e);
																		break;
																case 'switch':
																	setFieldValue(field_name, e);
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
																	console.error(e);
																case 'linesTable':
																	if(e.deleted)
																	{values.deleted = e.deleted;}
																	setFieldValue(field_name, [...e.lines]);
																	break;
																case 'DatePicker':
																		setFieldValue(
																			field_name,
																			moment.utc(e).format('YYYY-MM-DD HH:mm:ss'),
																		);
																		break;
																case 'LinesTableDrivers':
																	setFieldValue(field_name, e);
																	break;
																case 'extrasTable':
																	if(e.deleted)
																	{values.deleted = e.deleted;}
																	setFieldValue(field_name, [...e.lines]);
																	break;
																case 'itemsOfContract':
																	if(e.deleted)
																	{values.deleted = e.deleted;}
																	setFieldValue(field_name, [...e.lines]);
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
																rowData //for contact_person in contract table
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
															multi:true,
															formatOptions: formatOptionForSelect,
															data_source,
															is_required,
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
														...(component === 'switch' && {
															field_name:field_name,
														}),
														...(field_name === 'is_active' && {
															isAdmin: isAdmin,
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
																	t(`entity_form.${table_name}.${label}`)
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
											marginTop: 20,
										}}
									>
										<Submit
											label={
												tab_name
													? t(`right_dialog.tabs.${tab_name}.actions.update`)
													: t(`entity_form.${table_name}.actions.update`)
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

export default UpdateEntityForm;
