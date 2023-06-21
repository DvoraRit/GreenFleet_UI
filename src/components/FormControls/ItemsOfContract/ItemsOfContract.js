import React, { useState,useEffect } from 'react';
import { useTranslation } from 'react-i18next';
// import { Select } from 'components/FormControls';
import Select from '../LinesTable/LinesTableComponents/Select/Select';
import Input from '../LinesTable/LinesTableComponents/Input/Input';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddIcon from '@mui/icons-material/Add';
import './ItemsOfContract.scss';
import TableDataService from '../../../services/TableDataService';
import {_selectedCurrencySymbol} from '../../../recoil/atoms';
import { useRecoilState } from 'recoil';
import currencies from '../../../constants/currencies.json';

function ItemsOfContract({ onChange, initialValues }) {
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
	const [deleted, setDeleted] = useState([])

	const [lines, setLines] = useState([
		{
			contracts_exstra_id:{label:"contracts_exstra_id",value:null, width:"0%"},
			num_of_extra: { label: 'num_of_extra', value: 1, width: '5%' },
			price_list_id: { label: 'price_list_id', value: '',text:'', width: '45%' },
			balance: { label: 'balance', value: '', width: '45%' },
		},
	]);
	useEffect(() => {

		if(initialValues && initialValues.items?.length > 0){
			let newLines =  [];
			initialValues?.items?.forEach(element => {
				let obj =JSON.parse(JSON.stringify(lines[0]));
				  Object.values(obj).forEach(item=>{
					  if(item.label==="price_list_id"){
						  item.text = element.price_list_name;
						  item.value = element.price_list_id;
					  }
					  if(item.label==="balance"){
						  //get currency symbol
						  let sybmol = currencies[element.currency]?.symbol;
						  item.value = element[item.label] + " " + sybmol;
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
      let table_name="price_list";
	  let LIMIT=1000;
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
				setPricesListNames(tableData.rows);
				setLoadingOptions(false);
			
		}
    })();
  }, [])



	const printLables = () => {
		return Object.values(lines[0]).filter(x=>x.label!=="contracts_exstra_id").map((line) => (
			<div
				className='lable-text'
				key={line.label}
				style={{ width: line.width }}
			>
				{t(`entity_form.Contracts_exstra.table_lable.${line.label}`)}
			</div>
		));
	};

	const creatNewLine = () => {
		let newLine = {
			num_of_extra: { label: 'num_of_extra', value: lines.length + 1, width: '5%' },
			price_list_id: { label: 'price_list_id', value: '', width: '45%' },
			balance: { label: 'balance', value: '', width: '45%' },
		};
		setLines([...lines, newLine]);
	};

	const setFieldValue = (index, field, value) => {
		let newLines = [...lines];
		//find index of line to change
		let indexToChange = Object.values(newLines).findIndex(
			(line) => line.num_of_extra.value === index,
		);
		if(field==="price_list_id"){
			//find id of price list by name
			let price_list_id = pricesListNames.find(item  => item?.price_list_name === value);
			//set currency of price list
			let symbol = currencies[price_list_id.currency].symbol;
			setSelectedCurrencySymbol({index:index, symbol:symbol});
			//insert price list id to value
			newLines[indexToChange][field].value = parseInt( price_list_id.id);
		}
		//change value of field
		else{
			newLines[indexToChange][field].value = value;

		}
		//let indexToChange = Object.values(newLines).findIndex(line => line.field === value);
		setLines(newLines);
		onChange({lines:newLines});
	};

	const removeLine = (index) => {
		let newLines = [...lines];
		let indexToRemove = Object.values(newLines).findIndex(
			(line) => line.num_of_extra.value === index,
		);
		//remove line from array
		newLines = newLines
			.slice(0, indexToRemove)
			.concat(newLines.slice(indexToRemove + 1));
		setLines(newLines);
		if(lines[indexToRemove].contracts_exstra_id.value){
			setDeleted([...deleted,lines[indexToRemove].contracts_exstra_id.value]);
			onChange({lines:[...newLines], deleted:[...deleted,lines[indexToRemove].contracts_exstra_id.value]});
		}
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
						{line.num_of_extra.value}
					</div>


					<Select
						width={'45%'}
						table_name={'Contracts_extra'}
						label={line.price_list_id.text===""?'בחר מחירון':line.price_list_id.text}
						field_name={'price_list_id'}
						index={line.num_of_extra.value}
						options={pricesListNames.map(item => item.price_list_name)}
						setFieldValue={setFieldValue}
            			needTranslate={false}
						useAutocomplete={true}
					/>

					<Input
						width={'45%'}
						label={line.balance.value===""?'יתרה' : line.balance.value}
						field_name={'balance'}
						table_name={'Contracts_extra'}
						index={line.num_of_extra.value}
						setFieldValue={setFieldValue}
						isLastInRow={true}
						addSymbol={"cost"}
						symbolOfPriceListSelected={selectedCurrencySymbol}
					/>
					<RemoveCircleIcon
						fontSize='small'
						onClick={() => removeLine(line.num_of_extra.value)}
						style={{
							marginTop: 10,
							cursor: 'pointer',
							visibility: line.num_of_extra.value === 1 ? 'hidden' : 'visible',
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

export default ItemsOfContract;
