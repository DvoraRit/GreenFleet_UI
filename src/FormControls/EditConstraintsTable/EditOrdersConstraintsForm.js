import { CreateEntityForm } from 'components/EntityForms/CreateEntityForm/CreateEntityForm';
import { Formik } from 'formik';
import React, { useMemo, useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Submit } from '..';
import ModalWrapper from '../../Modal/Modal';
import { formInitialValues } from 'components/EntityForms/config/config';
import {
	constraintsExtraFieldsOfTable,
	priceExtraFieldsOfTable,
} from 'components/EntityForms/CreateEntityForm/create_entity_form_config';
import ActionButton from 'containers/Planning/Dialog/DialogWrapper/components/ActionButtons';
import {
	formatOptionForSelect,
	getFormComponent,
	getOptionsForSelect,
	orderFormBySections,
} from 'components/EntityForms/config/helpers';
import 'components/EntityForms/CreateEntityForm/CreateEntityForm.scss';
import {
	transformForCreate,
	createPriceList,
	createContract,
} from 'components/EntityForms/CreateEntityForm/helpers';
// import { toast } from 'react-toastify';
import moment from 'moment';
import { _selectedCurrencySymbol, _pricesListForContract } from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import { style } from '@mui/system';
import AreYouSureModal from 'components/AreYouSureModal/AreYouSureModal';
import { useStores } from 'stores';
import ConstraintsService from 'services/ConstraintService';
import { toast } from 'react-toastify';

function EditOrdersConstraintsForm({
	isOpen,
	toggle,
	table_name,
	tab_name,
	showMap,
	middle_modal_width,
	padding,
	allData,
	parent_id,
	entity_id,
	entity_name,
	reRender,
	initialValue,
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

	const { constraintsStore } = useStores();
	const [errors, setErrors] = useState({});
	const [deleted, setDeleted] = useState([]);
	const [updated, setUpdated] = useState([]);
	const [created, setCreated] = useState([]);
	// const [updated]

	const toggleAreYouSure = (variant) => {
		setAreYouSure(variant);
	};

	const formikRef = useRef();

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

	const initValue = {
		id: { label: 'id', value: null, width: '0%' },
		number: { label: 'number', value: 1, width: '5%', label: 'num' },
		constraint_type: {
			label: 'constraint_type',
			value: { label: 'סוג אילוץ', value: '' },
			width: '25%',
		},
		constraint: {
			label: 'constraint',
			value: '',
			width: '25%',
		},
		details: {
			label: 'details',
			value: [{ value: '', label: 'פירוט' }],
			width: '40%',
		},
	};

	const formatInitialValue = () => {
		let copy = { ...initialValue };
		let final = [];

		if (!!Object.keys(initialValue ?? {})?.length) {
			Object.entries(initialValue).forEach(([type, constraintsArray]) => {
				constraintsArray.forEach((con) => {
					final.push({
						id: { label: 'id', value: con?.id, width: '0%' },
						number: {
							label: 'number',
							value: final.length + 1,
							width: '5%',
							label: 'num',
						},
						constraint_type: {
							label: 'constraint_type',
							value: {
								label: 'constraints.constraints.' + type,
								value: type,
							},
							width: '25%',
						},
						constraint: {
							label: 'constraint',
							width: '25%',
							value: {
								label: 'constraints.constraints.' + con?.label,
								value: con?.label,
							},
						},
						details: {
							label: 'details',
							width: '40%',
							value: [
								{
									label: !!con?.value
										? `constraints.constraints.${con?.label}_${con?.value}`
										: '',
									value: con?.value,
								},
							],
						},
					});
				});
			});
			return final;
		} else {
			return [{ ...initValue }];
		}
	};

	// useEffect(() => {
	// 	formikRef.setFieldValue('');
	// }, [initialValue]);

	const formikProps = {
		initialValues: { constraint_for_entity: formatInitialValue() },
		validate: (values) => {},

		// validationSchema: EntitySchema,//TODO:fix validation schema
		onSubmit: async (values, { resetForm }) => {
			//we will send to server 3 arrays
			//first array 'deleted' is with id's that we want to remove.
			//second array 'updated' is with id's that we want to update.
			//third array 'created' is with id's that we want to create.

			//TODO: format body
			//TODO: TEST
			const { constraint_for_entity } = values;
			setLoading(true);
			let deletedIds = deleted;
			let updated = constraint_for_entity
				?.filter((o) => !!o.id?.value)
				.map((orderConstrain) => ({
					id_from_entity: entity_id,
					constraint_id: constraintsStore.getConstraintId(
						orderConstrain?.constraint_type?.value?.value,
						orderConstrain?.constraint?.value?.value,
						orderConstrain?.details?.value?.[0]?.value,
					),
					entity_name: entity_name,
					parent_container_id: parent_id,
					id: orderConstrain?.id?.value,
				}));
			let created = constraint_for_entity
				?.filter((o) => !o.id?.value)
				.map((orderConstrain) => {
					return {
						id_from_entity: entity_id,
						constraint_id: constraintsStore.getConstraintId(
							orderConstrain?.constraint_type?.value?.value,
							orderConstrain?.constraint?.value?.value,
							orderConstrain?.details?.value?.[0]?.value,
						),
						entity_name: entity_name,
						parent_container_id: parent_id,
					};
				});

			// setLoading(true);
			let responseFromServer = null;
			try {
				responseFromServer = await ConstraintsService.updateOrderConstraints({
					created,
					updated,
					deleted,
				});

				if (responseFromServer?.success) {
					toast.success('אילוצים עודכנו בהצלחה', {
						position: toast.POSITION.BOTTOM_LEFT,
					});
					setDeleted([]);

					resetForm();
					reRender();
					toggle();
				} else {
					toast.error(' שגיאה בעדכון אילוצים', {
						position: toast.POSITION.BOTTOM_LEFT,
					});
				}
			} catch (e) {
				console.error(e);
				toast.error(' שגיאה בעדכון אילוצים', {
					position: toast.POSITION.BOTTOM_LEFT,
				});
			} finally {
				setLoading(false);
			}
		},
	};

	useEffect(() => {
		const ab = new AbortController();
		return () => {
			ab.abort();
			setLoading(false);
		};
	}, []);

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
														middle_modal_column_width,
														customLabel,
														icon_data,
														is_required,
													}) => {
														let FormComponent = getFormComponent(component);
														let formProps = {
															value: values[field_name],
															icon_data,
															errors,
															setDeleted,
															name: field_name,
															width: middle_modal_column_width,
															onChange: (e) => {
																switch (component) {
																	case 'constraints_table':
																		setFieldValue(field_name, e);
																		break;
																	case 'extrasTable':
																		setFieldValue(field_name, e);
																		break;
																	default:
																		// for input
																		setFieldValue(field_name, e.target.value);
																		break;
																}
															},
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

export default EditOrdersConstraintsForm;
