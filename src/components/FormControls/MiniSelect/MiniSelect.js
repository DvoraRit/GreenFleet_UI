import React, { useState, useEffect } from 'react';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { useTranslation } from 'react-i18next';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { Formik } from 'formik';

import SelectOption from './SelectOption';
import Input from '../Input/Input';
import './MiniSelect.scss';
export default function Select({
	index,
	label,
	field_name,
	table_name,
	setFieldValue,
	width,
	disabled = false,
	needTranslate = true,
	useAutocomplete = false,
	options = [],
	value,
	hasError,
	// value
	selectedOptionLabel,
}) {
	const [openOptions, setOpenOptions] = useState(false);
	const [selectedOption, setSelectedOption] = useState(
		selectedOptionLabel ? selectedOptionLabel : label,
	);
	const { t } = useTranslation();
	const [filterOptions, setFilterOptions] = useState(options);


	const handleOpenOptions = () => {
		setFilterOptions(options);
		setOpenOptions(!openOptions);
	};

	useEffect(() => {
		//let selected = formatOptionsLabel(label,field_name);

		setSelectedOption(label);
	}, [label]);

	const setinputChange = (index, field_name, value) => {
		//get options from server
		setOpenOptions(true);
		let result = options.filter((item) => item?.startsWith(value));
		setFilterOptions(result);
	};

	const autocomplete = () => {
		return (
			<Input
				width={'100%'}
				label={selectedOption?.label}
				name={field_name}
				table_name={table_name}
				index={index}
				arrowIcon={true}
				tuggle={handleOpenOptions}
				aoutocomplete={true}
				setFieldValue={setinputChange}
				value={selectedOption?.label}
			/>
		);
	};

	return (
		<div
			onClick={() => handleOpenOptions()}
			className={
				useAutocomplete
					? ''
					: disabled
					? 'select-wrapper-disable'
					: 'select-wrapper'
			}
			style={
				hasError
					? {
							border: '1px solid red',
							width: width ? width : '100%',
							height: '35px',
					  }
					: { width: width ? width : '100%', height: '35px' }
			}
		>
			{useAutocomplete ? (
				autocomplete()
			) : (
				<div className='label-wrapper-select'>
					<div className='lablel-text-in-select'>
						{selectedOptionLabel}
						{/* {field_name} */}
					</div>
					<ArrowDropUpIcon
						fontSize='small'
						sx={{ transform: 'rotate(180deg)' }}
					/>
				</div>
			)}

			{openOptions && (
				<ClickAwayListener onClickAway={handleOpenOptions}>
					<div className='options-drop-down-wrapper'>
						{filterOptions.map((option) => {
							return (
								<Formik>
									<SelectOption
										key={index}
										value={option}
										text={
											needTranslate
												? t(`entity_form.${table_name}.select.${option?.value}`)
												: option?.label
										}
										//text={`entity_form.${table_name}.select.${option}`}
										setOpenOptions={setOpenOptions}
										setSelectedOption={setSelectedOption}
										field_name={field_name}
										table_name={table_name}
										index={index}
										setFieldValue={setFieldValue}
									/>
								</Formik>
							);
						})}
					</div>
				</ClickAwayListener>
			)}
		</div>
	);
}
