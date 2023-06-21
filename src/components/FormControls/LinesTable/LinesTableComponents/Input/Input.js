import React, {useState,useEffect} from 'react';
import { useTranslation } from 'react-i18next';
import './Input.scss';
import {_selectedCurrencySymbol} from '../../../../../recoil/atoms';
import { useRecoilState } from 'recoil';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { relative } from 'path';
export default function Input({ 
	label,
	width,index, setFieldValue,
	field_name,
	table_name,
	addSymbol = false,
	symbolOfPriceListSelected,
	arrowIcon = false,
	tuggle,
	aoutocomplete = false,
	isLastInRow=false, clearLablelOnClick = true }) {
	const { t } = useTranslation();
	const [lableOnInput, setLable] = useState(label);
	const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useRecoilState(_selectedCurrencySymbol);

	useEffect(() => {
		if(addSymbol==="cost"){
			if(symbolOfPriceListSelected?.index===index){
				setLable(`${lableOnInput}${selectedCurrencySymbol}`);
			}else{
				let newText = label + selectedCurrencySymbol;
				setLable(newText);
			}
		}
		else{
			setLable(label);
		}
	}, [label])

	useEffect(() => {
		
		if(addSymbol==="cost"){
			let newText = label + selectedCurrencySymbol;
			setLable(newText);
		}
		else if(addSymbol==="percent"){
			let newText = label + "%";
			setLable(newText);
		}
	}, [addSymbol])
	

	useEffect(() => {
		if(addSymbol==="cost" && symbolOfPriceListSelected===undefined){
			setLable(`${label}${selectedCurrencySymbol}`)
		}
	}, [selectedCurrencySymbol])
	
	useEffect(() => {

		if(addSymbol==="cost" && symbolOfPriceListSelected?.index===index)
		{
			setLable(`${label}${symbolOfPriceListSelected.symbol}`)
		}
	}, [symbolOfPriceListSelected])
	
	

	const handleClickInInput = (e) => {
		if(aoutocomplete){
			tuggle()
		}
		e.target.select()
	}

	const handleChange = (e) => {
		if(addSymbol==="cost"){
			if(symbolOfPriceListSelected?.index===index)
			{
				let newText = e.target.value.replace(/[^0-9 ]/g, "") + symbolOfPriceListSelected.symbol;
				setLable(newText);
				setFieldValue(index, field_name, e.target.value.replace(/[^a-zA-Z0-9א-ת ]/g, ""));

			}
			else{
				let newText = e.target.value.replace(/[^0-9 ]/g, "") + selectedCurrencySymbol;
				setLable(newText);
				setFieldValue(index, field_name, e.target.value.replace(/[^a-zA-Z0-9א-ת ]/g, ""));

			}
		}
		else if(addSymbol==="percent"){
			let newText = e.target.value.replace(/[^0-9 ]/g, "") + "%";
			setLable(newText);
			setFieldValue(index, field_name, e.target.value.replace(/[^a-zA-Z0-9א-ת ]/g, ""));

		}
		else{
			setLable(e.target.value);
			setFieldValue(index, field_name, e.target.value);
		}
	}
  return (
	  <div style={{position:"relative", width:width? width :"100%"}}>
		<input 
			//className='lable-text' 
			className={isLastInRow ? "last-input-text":"input-text"}
			style={{width :"100%"}}
			onClick={(e)=>handleClickInInput(e)}
			onChange={handleChange}
			type="text"
			value={lableOnInput}
			>
			</input>
			{arrowIcon && <ArrowDropUpIcon fontSize='small' sx={{transform:'rotate(180deg)', position:"absolute", right:"5px",top:"8px"}}/>}
	  </div>
	);
}
