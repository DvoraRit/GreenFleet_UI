import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import Select from '../LinesTable/LinesTableComponents/Select/Select';
import Input from '../LinesTable/LinesTableComponents/Input/Input';
//import Select from 'react-select'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';
import ExtentionsTypes from 'constants/ExtensionsTypes.json';

import { _selectedCurrencySymbol } from 'recoil/atoms';
import { useRecoilState } from 'recoil';

import './EditOrdersPriceExtrasTable.scss';

function EditOrdersPriceExtrasTable({ onChange, value, initialValues }) {
	const { t } = useTranslation();
	const [extentionOptions, setExtentionOptions] = useState([]);
	const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useRecoilState(
		_selectedCurrencySymbol,
	);
	const [symbolToAdd, setSymbolToAdd] = useState('');
	const [deleted, setDeleted] = useState([]);

	const [lines, setLines] = useState([...value?.lines]);
	const [numOfLines, setNumOfLines] = useState(1);





	useEffect(() => {
		if (lines && lines?.length > 0) {
			lines?.forEach((element) => {
				let obj = JSON.parse(JSON.stringify(lines[0]));
				Object.values(obj).forEach((item) => {
					item.value = element[item.label]?.value;


					if (element['extention_type'] !== '') {
						setExtentionOptions(
							ExtentionsTypes[element?.extention_type?.value],
						);
					}
					if (element['selected_value_type'] !== '') {
						setSymbolToAdd(element['selected_value_type']);
					}
				});
				// newLines.push(obj);
			});
			//   debugger
			// setLines(newLines);
		}
	}, [lines]);

	// useEffect(() => {

	// }, [lines]);

	const extention_type_options = Object.keys(ExtentionsTypes);
	const selected_value_type_options = ['percent', 'cost'];

	const printLables = () => {
		if (lines.length > 0) {
			return Object.values(lines[0])
				.filter((x) => x.label !== 'id')
				.map((line) => (
					<div
						className='lable-text'
						key={line.label}
						style={{ width: `${line.width}` }}
					>
						{t(`entity_form.price_extra.table_lable.${line.label}`)}
					</div>
				));
		}
	};

	const creatNewLine = () => {
		setNumOfLines(lines.length + 1);
		let newLine = JSON.parse(JSON.stringify(lines[0]));
		Object.values(newLine).forEach((item) => {
			item.value = '';
		});
		newLine.number.value = lines.length + 1;
		setLines([...lines, newLine]);
	};

	const removeLine = (index) => {
		let newLines = [...lines];
		let indexToRemove = Object.values(newLines).findIndex(
			(line) => line.number.value === index,
		);
		//remove line from array
		newLines = newLines
			.slice(0, indexToRemove)
			.concat(newLines.slice(indexToRemove + 1));
		//setNumOfLines(numOfLines-1);
		setLines(newLines);
		if (lines[indexToRemove].id.value) {
			setDeleted([...deleted, lines[indexToRemove].id.value]);
			onChange({
				lines: [...newLines],
				deleted: [...deleted, lines[indexToRemove].id.value],
			});
		}
	};

	const setFieldValue = (index, field, value) => {
		let newLines = [...lines];
		//find index of line to change
		let indexToChange = Object.values(newLines).findIndex(
			(line) => line.number.value === index,
		);
		//change value of field
		newLines[indexToChange][field].value = value;
		//let indexToChange = Object.values(newLines).findIndex(line => line.field === value);
		setLines(newLines);
		onChange({ lines: newLines, deleted: deleted });
		if (field === 'extention_type') {
			setExtentionOptions(ExtentionsTypes[value]);
		}
		if (field === 'selected_value_type') {
			setSymbolToAdd(value);
		}
	};

	const getLabel = (line, field_name) => {
		if (line[field_name].value !== null) {
			return line[field_name].value;
		} else {
			return t(`entity_form.price_extra.table_lable.${line[field_name].label}`);
		}
	};

	return (
		<>
			{/* lables */}

			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					marginTop: 10,
					width: '100%',
					flex: 1,
				}}
				className='price_controller-wrapper'
			>
				<div className='lables-wrapper'>{printLables()}</div>

				{Object.values(lines).map((line, index) => (
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
							{line.number.value}
						</div>
						<Select
							label={
								line.extention_type.value
									? t(
											`entity_form.price_extra.select.${line.extention_type.value}`,
									  )
									: t(
											`entity_form.price_extra.select.${line.extention_type.label}`,
									  )
							}
							table_name={'price_extra'}
							field_name={'extention_type'}
							index={line.number.value}
							options={extention_type_options}
							setFieldValue={setFieldValue}
							width={'18%'}
						/>
						{/* extension */}
						<Select
							label={
								line.extension?.value
									? t(`entity_form.price_extra.select.${line.extension?.value}`)
									: t(`entity_form.price_extra.select.${line.extension?.label}`)
							}
							index={line.number.value}
							table_name={'price_extra'}
							field_name={'extension'}
							options={extentionOptions}
							selectedOption={line.extension?.value}
							setFieldValue={setFieldValue}
							disabled={extentionOptions?.length === 0}
							width={'20%'}
						/>
						{/* selected_value_type_options */}
						<Select
							label={
								line.selected_value_type?.value
									? t(
											`entity_form.price_extra.select.${line.selected_value_type?.value}`,
									  )
									: t(
											`entity_form.price_extra.select.${line.selected_value_type?.label}`,
									  )
							}
							index={line.number.value}
							table_name={'price_extra'}
							field_name={'selected_value_type'}
							options={selected_value_type_options}
							setFieldValue={setFieldValue}
							width={'20%'}
						/>
						{/* extention_value */}
						<Input
							label={getLabel(line, 'extention_value')}
							index={line.number.value}
							setFieldValue={setFieldValue}
							field_name={'extention_value'}
							table_name={'price_extra'}
							width={'35%'}
							isLastInRow={true}
							addSymbol={symbolToAdd}
						/>

						{line.number.value > 1 && (
							<RemoveCircleIcon
								fontSize='small'
								onClick={() => removeLine(line.number.value)}
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
					<div>הוסף פריט</div>
				</div>
			</div>
		</>
	);
}

export default EditOrdersPriceExtrasTable;
