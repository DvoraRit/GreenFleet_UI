import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { Select } from 'components/FormControls';
import Select from '../LinesTableComponents/Select/Select';
import Input from '../LinesTableComponents/Input/Input';
import Switch from '../../Switch/Switch';
//import Select from 'react-select'
import '../LinesTable.scss';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';
import { Formik } from 'formik';

function Vehicles_capabilities_linesTable({ onChange, initialValues }) {
	const { t } = useTranslation();
	const [pricesListNames, setPricesListNames] = useState([]);
	const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState({});
	const [loadingOptions, setLoadingOptions] = useState(false);
	const [options, setOptions] = useState([]);
	const [page, setPage] = useState(0);
	const [exhusted, setExhusted] = useState(false);
	const [searchFilter, setSearchFilter] = useState('');
	const divRef = React.useRef();
	const [anchorEl, setAnchorEl] = useState(null);

	const [lines, setLines] = useState([
		{
			number: { label: 'number', value: 1, width: '10%' },
			system_type: { label: 'system_type', value: 'null', width: '30%' },
			system_name: { label: 'system_name', value: '', width: '30%' },
			system_code: { label: 'system_code', value: "", width: '30%' },
		},
	]);
	const [numOfLines, setNumOfLines] = useState(1);
	const system_type_options = [
		'Protection',
		'terminal',
		'photography',
		'Partitions',
		'belts',
		'elevator',
		'safety',
		'WiFi',
		'Ticketing',
	];

	useEffect(() => {

		if(initialValues && initialValues._extraVehicles?.length > 0){
			let newLines =  [];
			initialValues?._extraVehicles?.forEach(element => {
				let obj =JSON.parse(JSON.stringify(lines[0]));
				  Object.values(obj).forEach((item,index)=>{
					  if(item.label==="number"){
						  item.text = index+1;
						  item.value = index+1;
					  }
					  else{
						  item.value=element[item.label];
					  }
				  });
				newLines.push(obj);
			});
		  setLines(newLines);
		}

	}, [initialValues])

	useEffect(() => {
		//get all prices list names for options select
		setLoadingOptions(true);
		(async () => {
			let table_name = 'vehicles_extra';
			let LIMIT = 1000;
			let tableData = await TableDataService.getTableData({
				LIMIT,
				page: 0,
				//sortBy,
				//searchFilter: searchFilter?.text,
				table_name,
			});
			if (Array.isArray(tableData?.rows)) {
				//set price list names to names and ids
				//setPricesListNames(tableData.rows.map(({ name, }) => name));
				setPricesListNames([]);
				// setLoadingOptions(false);
			}
		})();
	}, []);

	const printLables = () => {
		return Object.values(lines[0]).map((line) => (
			<div
				className='lable-text'
				key={line.label}
				style={{ width: line.width }}
			>
				{t(`entity_form.vehicles_extra.table_lable.${line.label}`)}
			</div>
		));
	};

	const creatNewLine = () => {
		setNumOfLines(numOfLines + 1);
		let newLine = {
			number: { label: 'number', value: numOfLines + 1, width: '10%' },
			system_type: { label: 'system_type', value: '', width: '30%' },
			system_name: { label: 'system_name', value: '', width: '30%' },
			system_code: { label: 'system_code', value: '', width: '30%' },
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
			<div className='title-wrapper'> התקנות {numOfLines - 1} </div>
			<br />
			<div className='lables-wrapper'>{printLables()}</div>

			{Object.values(lines).map((line, index) => (
				<div
					className='row-data-wrapper'
					style={{ display: 'flex', flexDirection: 'row' }}
					key={index}
				>
					{/* number of line */}
					<div className='line-number-wrapper' style={{ width: '5%' }}>
						{line.number.value}
					</div>

					<Select
						width={'30%'}
						label={line.system_type.value ? t(`entity_form.vehicles_extra.select.${line.system_type.value}`) : 'סוג מערכת '}
						table_name={'vehicles_extra'}
						field_name={'system_type'}
						index={line.number.value}
						options={system_type_options}
						setFieldValue={setFieldValue}
						useAutocomplete={true}
					/>

					<Input
						width={'30%'}
						field_name={'system_name'}
						label={line.system_name.value ? line.system_name.value : 'שם מערכת'}
						table_name={'vehicles_extra'}
						index={line.number.value}
						setFieldValue={setFieldValue}
						isLastInRow={true}
					/>
					<Input
						width={'30%'}
						field_name={'system_code'}
						label={line.system_code.value ? line.system_name.value : 'קוד מערכת '}
						table_name={'vehicles_extra'}
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

export default Vehicles_capabilities_linesTable;
