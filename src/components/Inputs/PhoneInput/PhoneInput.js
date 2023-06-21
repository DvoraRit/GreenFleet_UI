import ReactPhoneInput from 'react-phone-input-2';
import React from 'react';
import 'react-phone-input-2/lib/style.css';

const PhoneInput = ({
	name,
	value,
	onChange,
	onBlur,
	setFieldValue,
	error,
	...rest
}) => {
	const onPhoneChange = (val) => {
		setFieldValue(name, val);
		if (onChange) {
			onChange(val);
		}
	};

	return (
		<ReactPhoneInput
			inputClass={error ? 'error' : ''}
			buttonClass={error ? 'error' : ''}
			country={'il'}
			name={name}
			value={value}
			onChange={onPhoneChange}
			onBlur={onBlur}
			enableSearch
			countryCodeEditable={false}
			inputProps={{
				name: name,
				...rest,
			}}
			{...rest}
		/>
	);
};

export default PhoneInput;
