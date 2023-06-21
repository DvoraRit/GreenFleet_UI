import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

function SelectOption({
	value,
	text,
	index,
	field_name,
	table_name,
	setOpenOptions,
	// setSelectedOption,
	setFieldValue,
}) {
	const [mouseEnter, setmouseEnter] = useState(false);
	const { t } = useTranslation();

	const handleSelectOption = async () => {
		// alert('test')
		setOpenOptions(false);
		// setSelectedOption(text);
		setFieldValue(index, field_name, value?.value, value?.label);
	};

	return (
		<div
			className='row-wrapper-select-option'
			onClick={() => handleSelectOption()}
			target={mouseEnter.toString()}
			onMouseEnter={() => setmouseEnter(true)}
			onMouseLeave={() => setmouseEnter(false)}
		>
			<div className='text-time-filter'>{text}</div>
		</div>
	);
}

export default SelectOption;
