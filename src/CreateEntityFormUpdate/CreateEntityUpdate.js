import React, { useState, useRef, useMemo } from 'react';
import './CreateEntityUpdate.scss';

import * as Yup from 'yup';
import { Formik, ErrorMessage, Form } from 'formik';
import { formInitialValues } from './config/config';
import {
	getFormComponent,
	getOptionsForSelect,
	formatOptionForSelect,
	orderFormBySections,
} from './config/helpers';

import { Submit } from '../FormControls';

import { useTranslation } from 'react-i18next';

import ModalWrapper from '../Modal/Modal';

function CreateEntityUpdate({ isOpen, toggle, table_name, tab_name }) {
	const { t } = useTranslation();
	const [loading, setLoading] = useState(false);

	let fields = JSON.parse(localStorage.getItem('fields_of_table'));

	fields = fields.filter(
		({
			table_name: tableName,
			middle_modal_order,
			middle_modal_section_index,
			modal_index: modal_index,
		}) =>
			table_name === tableName &&
			modal_index === modal_index &&
			!!middle_modal_order &&
			!!middle_modal_section_index,
	);

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

	let sections = useMemo(() => orderFormBySections(fields), [fields]);

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
		initialValues: Object.values(sections)
			.reduce((total, v) => [...total, ...v], [])
			.reduce(
				(values, { component, field_name }) => ({
					...values,
					[field_name]: formInitialValues[component],
				}),
				{},
			),
		// validate: (v) => ,
		// validationSchema: EntitySchema,//TODO:fix validation schema
		onSubmit: async (values, { resetForm }) => {
			setLoading(true);
			//TODO:API for submitting
			await setTimeout(() => {
				alert('submitted');
				setLoading(false);
			}, 2000);
		},
	};

	const formikRef = useRef();

	return (
		<ModalWrapper
			isOpen={isOpen}
			toggle={toggle}
			title={
				tab_name
					? t(`right_dialog.tabs.${tab_name}.title_modal`)
					: t(`create_entity_form.${table_name}.title`)
			}
		>
			<div className='create-entity-container'>
				{/* <StylesProvider jss={jss}> */}
				<Formik {...formikProps} innerRef={formikRef}>
					{({ values, handleSubmit, setFieldValue }) => {
						return (
							<>
								{Object.entries(sections)?.map(([key, fieldsArr]) => (
									<div className={`section-wrapper ${table_name}-${key}`}>
										<p className='section-title'>
											{t(`create_entity_form.${table_name}.${key.toString()}`)}
										</p>
										{/* section wrapper */}
										{fieldsArr.map(
											({
												field_name,
												label,
												modal_index,
												component,
												drop_list_values,
												drop_list_Header,
												max_length,
												validation,
												middle_modal_section_index,
												middle_modal_order,
												data_source,
												is_required,

											}) => {
												let FormComponent = getFormComponent(component);
												let formProps = {
													value: values[field_name],
													name: field_name,
													onChange: (e) => {
														switch (component) {
															case 'select':
																setFieldValue(field_name, e);
																break;
															case 'SelectCheckbox':
																	// let y = [];
																	// e.forEach((selected) => {
																	// 	if (!!selected.value) {
																	// 		y.push({
																	// 			label: selected.value,
																	// 			value: selected.value,
																	// 		});
																	// 	}
																	// });
																	// setFieldValue(field_name, y);
																	setFieldValue(field_name,[...values[field_name],e]);
																	break;
															case 'switch':
																setFieldValue(field_name, e);
																break;
															case 'date-time-picker':
																break;
															case 'image':
																setFieldValue(field_name, e);
																break;
															case 'DocumentPicker':
																setFieldValue(field_name, e);
																break;
															case 'Checkbox':
																setFieldValue(field_name, e);
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
														value: values[field_name],
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
													

													// ...props,
												};

												return (
													<div className={`form-field-container ${field_name}`}>
														<FormComponent
															{...formProps}
															label={t(
																`create_entity_form.${table_name}.${label}`,
															)}
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
												: t(`create_entity_form.${table_name}.actions.create`)
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

export default CreateEntityUpdate;
