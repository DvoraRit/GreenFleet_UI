import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Grid from '@mui/material/Grid';
import AddIcon from '@mui/icons-material/Add';
import './EditConstraintsTable.scss';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
// import Select from '../SimpleSelect/SimpleSelect';
import Select from '../MiniSelect/MiniSelect';
import { useStores } from 'stores';
import { toJS } from 'mobx';
// const COLUMNS_CONSTRAINTS = [
// 	{ name: 'num', label: 'ספ׳', order: 1, width: 2 },
// 	{ name: 'constraint_type', label: 'סוג אילוץ', order: 2, width: 5 },
// 	{ name: 'constraint', label: 'אילוץ', order: 3, width: 5 },
// 	{ name: 'description', label: 'פירוט', order: 4, width: 3 },
// 	{ name: 'action', label: 'פעולות', order: 5, width: 2 },
// ];

// const initialValueConstraints = {
// 	num: 1,
// 	constraint_type: 'סוג',
// 	constraint: 'שם',
// 	description: 'פירוט',
// 	action: {
// 		value: 'i',
// 		action: () => {},
// 	},
// };

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

function EditConstraintsTable({
	value: formikValue = [],
	onChange,
	setDeleted,
}) {

	const { t } = useTranslation();
	const { constraintsStore } = useStores();

	const testingCons = toJS(constraintsStore.constraints);

	const constraint_types = [
		{ label: 'סוג אילוץ', value: '' },
		...toJS(constraintsStore.updateConstraintTypesList(testingCons)),
	];

	const entity_constraints = {
		null: [{ value: '', label: 'אילוץ' }],
		...toJS(
			constraintsStore.updateConstraintsPerTypeList(
				testingCons,
				constraint_types,
			),
		),
	};

	const constraint_details = {
		null: [{ label: 'פירוט', value: '' }],
		...toJS(
			constraintsStore.updateConstraintDetail(testingCons, entity_constraints),
		),
	};

	const [constraints, setConstraints] = useState(
		[...formikValue],
		// formatInitialValue(),
		// : [
		// 		{
		// 			id: { label: 'id', value: null, width: '0%' },
		// 			number: { label: 'number', value: 1, width: '5%', label: 'num' },
		// 			constraint_type: {
		// 				label: 'constraint_type',
		// 				value: { label: 'סוג אילוץ', value: '' },
		// 				width: '25%',
		// 			},
		// 			constraint: {
		// 				label: 'constraint',
		// 				value: entity_constraints['null'][0],
		// 				width: '25%',
		// 			},
		// 			details: {
		// 				label: 'details',
		// 				value: [{ value: '', label: 'פירוט' }],
		// 				width: '40%',
		// 			},
		// 		},
		//   ],
	);

	const [numOfLines, setNumOfLines] = useState(1);

	const creatNewLine = () => {
		setConstraints((state) => [
			...state,
			{
				...initValue,
				number: { ...initValue.number, value: state.length + 1 },
			},
		]);
	};

	const removeLine = (number) => {
		//we check if that line exists in the db (by checking id)
		let index = constraints.findIndex((c) => c?.number?.value === number);

		if (!!constraints[index]?.id?.value) {
			setDeleted((deleted) => [...deleted, constraints[index]?.id?.value]);
		}

		let copyState = [...constraints];
		copyState.splice(index, 1);
		setConstraints(
			copyState.map((state, i) => ({
				...state,
				number: { ...state.number, value: i + 1 },
			})),
		);
	};

	const setFieldValue = (index, field, value, label) => {
		let stateCopy = [...constraints];

		if (field === 'constraint_type') {
			stateCopy[index] = {
				...stateCopy[index],
				[field]: {
					...stateCopy[index][field],
					value: {
						value,
						label: getLabel(field, index, value),
					},
				},
			};

			stateCopy[index] = {
				...stateCopy[index],
				constraint: {
					...stateCopy[index].constraint,
					value: entity_constraints[value][0],
					// label: getLabel('constraint', index, value),
				},
			};

			if (
				!!constraint_details[stateCopy[index]?.constraint?.value?.value]?.length
			) {
				stateCopy[index] = {
					...stateCopy[index],
					['details']: {
						...stateCopy[index]['details'],
						value: [
							constraint_details[stateCopy[index]?.constraint?.value?.value][0],
						],
					},
				};
			} else {
				stateCopy[index] = {
					...stateCopy[index],
					['details']: {
						...stateCopy[index]['details'],
						value: [...constraint_details['null']],
					},
				};
			}
		} else if (field === 'details') {
			stateCopy[index] = {
				...stateCopy[index],
				[field]: {
					...stateCopy[index][field],
					value: [
						{
							value,
							label: getLabel(field, index, value),
						},
					],
				},
			};
		} else if (field === 'constraint') {
			stateCopy[index] = {
				...stateCopy[index],
				[field]: {
					...stateCopy[index][field],
					value: {
						value,
						label: getLabel(field, index, value),
					},
				},
			};

			if (
				!!constraint_details[stateCopy[index]?.constraint?.value?.value]?.length
			) {
				stateCopy[index] = {
					...stateCopy[index],
					['details']: {
						...stateCopy[index]['details'],
						value: [
							constraint_details[stateCopy[index]?.constraint?.value?.value][0],
						],
					},
				};
			} else {
				stateCopy[index] = {
					...stateCopy[index],
					['details']: {
						...stateCopy[index]['details'],
						value: [...constraint_details['null']],
					},
				};
			}
		}
		setConstraints(stateCopy);
	};

	useEffect(() => {
		onChange(constraints);
	}, [constraints]);

	const getLabel = (field_name, index, value) => {
		switch (field_name) {
			case 'constraint_type':
				return constraint_types?.find((con_t) => con_t?.value === value)?.label;
			case 'constraint':
				return entity_constraints?.[
					constraints?.[index]?.constraint_type?.value?.value
				].find((obj) => obj.value === value)?.label;
			case 'details':
				return (
					constraint_details?.[
						constraints?.[index]?.constraint?.value?.value
					].find((obj) => obj.value === value)?.label ?? ''
				);

			default:
				return '';
		}
	};

	const printLables = () => {
		if (constraints.length > 0) {
			return Object.values(constraints[0])
				.filter((x) => x.label !== 'id')
				.map((con) => (
					<div
						className='lable-text'
						key={con.label}
						style={{ width: `${con.width}` }}
					>
						{t(`entity_form.constraints.table_label.${con?.label}`)}
					</div>
				));
		}
	};

	return (
		<>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: 10,
					width: '100%',
				}}
			>
				<div className='lables-wrapper'>{printLables()}</div>

				{constraints.map((constraint, index) => (
					<div
						className='row-data-wrapper'
						style={{ display: 'flex', flexDirection: 'row' }}
						key={index}
					>
						{/* number of line */}
						<div
							//className='lable-text'
							className='line-number-wrapper'
							style={{ width: '5%' }}
						>
							{constraint?.number?.value}
						</div>

						<Select
							index={index}
							field_name='constraint_type'
							table_name='orders_constraints_type'
							// setFieldValue={onChange}
							width={constraints[index]?.constraint_type?.width}
							disabled={false}
							needTranslate={false}
							useAutocomplete={false}
							options={[
								...constraint_types.map(({ label, value }) => ({
									label: t(label),

									value,
								})),
							]}
							value={constraints[index]?.constraint_type?.value?.value}
							setFieldValue={setFieldValue}
							hasError={constraints[index]?.constraint_type?.error}
							selectedOptionLabel={t(
								constraints[index]?.constraint_type?.value?.label,
							)}
						/>

						<Select
							options={
								Array.isArray(
									entity_constraints?.[
										constraints?.[index]?.constraint_type?.value?.value
									],
								)
									? [
											...entity_constraints?.[
												constraints?.[index]?.constraint_type?.value?.value
											]?.map(({ label, value }) => ({
												label: t(label),

												value,
											})),
									  ]
									: [{ value: '', label: 'אילוץ' }]
							}
							index={index}
							field_name='constraint'
							table_name='orders_constraints'
							setFieldValue={setFieldValue}
							width={constraints[index]?.constraint?.width}
							disabled={false}
							needTranslate={false}
							useAutocomplete={false}
							value={constraints[index]?.constraint?.value?.value}
							hasError={constraints[index]?.constraint?.error}
							selectedOptionLabel={t(
								constraints[index]?.constraint?.value?.label,
							)}
						/>
						<Select
							options={constraint_details?.[
								constraints[index]?.constraint?.value?.value
							]
								?.map(({ label, value }) => ({
									label: t(label),
									value,
								}))
								.filter((val) => val.value !== 'null')}
							index={index}
							field_name='details'
							table_name='orders_constraints'
							setFieldValue={setFieldValue}
							width={constraints[index]?.details?.width}
							needTranslate={false}
							useAutocomplete={false}
							value={constraints[index]?.details?.value?.value}
							disabled={
								!constraint_details?.[
									constraints[index]?.constraint?.value?.value
								]?.filter((val) => val.value !== 'null')?.length
							}
							hasError={constraints[index]?.details?.error}
							selectedOptionLabel={t(
								constraints[index]?.details?.value?.[0]?.label,
							)}
						/>
						{constraint?.number?.value > 1 && (
							<RemoveCircleIcon
								fontSize='small'
								onClick={() => removeLine(constraint?.number?.value)}
								style={{ marginTop: 10, cursor: 'pointer' }}
							/>
						)}
					</div>
				))}

				<div className='add-button-wrapper' onClick={creatNewLine}>
					<AddIcon
						fontSize='small'
						sx={{ color: '#2EC4B6', marginLeft: '5px' }}
					/>
					<div>הוסף אילוץ</div>
				</div>
			</div>
		</>
	);
}

export default EditConstraintsTable;
