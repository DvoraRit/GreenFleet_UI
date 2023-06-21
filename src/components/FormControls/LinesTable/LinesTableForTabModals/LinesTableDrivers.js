import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// import { Select } from 'components/FormControls';
import Select from '../LinesTableComponents/Select/Select';
import Input from '../LinesTableComponents/Input/Input';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';
import '../../ItemsOfContract/ItemsOfContract.scss';
function LinesTableDrivers({ onChange }) {
	const { t } = useTranslation();
	const [lines, setLines] = useState([
		{
			number: { label: 'number', value: 1, width: '5%' },
			license_number: { label: 'license_number', value: '', width: '45%' },
			license_expiration: { label: 'license_expiration', value: '', width: '45%' },
		},
	]);
	const license_number_options = [
		"A","B","C","D"
	];
	const [numOfLines, setNumOfLines] = useState(1);

	const printLables = () => {
		return Object.values(lines[0]).map((line) => (
			<div
				className='lable-text'
				key={line.label}
				style={{ width: line.width }}
			>
				{t(`entity_form.drivers_extra.table_lable.${line.label}`)}
			</div>
		));
	};

	const creatNewLine = () => {
		setNumOfLines(numOfLines + 1);
		let newLine = {
			number: { label: 'number', value: numOfLines + 1, width: '5%' },
			license_number: { label: 'license_number', value: '', width: '45%' },
			license_expiration: { label: 'license_expiration', value: '', width: '45%' },
		};
		setLines([...lines, newLine]);
	};

	const setFieldValue = (index, field, value) => {
		let newLines = [...lines];
		//find index of line to change
		let indexToChange = Object.values(newLines).findIndex(
			(line) => line.number.value === index,
		);
		if (field === 'price_list_id') {
			//find id of price list by name
			let price_list_id = pricesListNames.find(
				(item) => item?.price_list_name === value,
			);
			//set currency of price list
			let symbol = currencies[price_list_id.currency].symbol;
			setSelectedCurrencySymbol({ index: index, symbol: symbol });
			//insert price list id to value
			newLines[indexToChange][field].value = parseInt(price_list_id.id);
		}
		//change value of field
		else {
			newLines[indexToChange][field].value = value;
		}
		//let indexToChange = Object.values(newLines).findIndex(line => line.field === value);
		setLines(newLines);
		onChange(newLines);
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
	};

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				marginTop: 10,
				width: '100%',
			}}
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
						width={'30%'}
						table_name={'drivers'}
						label={'דרגת רישיון'}
						field_name={'license_number'}
						index={line.number.value}
						options={license_number_options}
						setFieldValue={setFieldValue}
						useAutocomplete={true}
					/>

					<Input
						width={'45%'}
						label={'מועד קבלת רישיון '}
						field_name={'license_expiration'}
						table_name={'drivers'}
						index={line.number.value}
						setFieldValue={setFieldValue}
					/>
					<RemoveCircleIcon
						fontSize='small'
						onClick={() => removeLine(line.number.value)}
						style={{
							marginTop: 10,
							cursor: 'pointer',
							visibility: line.number.value === 1 ? 'hidden' : 'visible',
						}}
					/>
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
	);
}

export default LinesTableDrivers;
