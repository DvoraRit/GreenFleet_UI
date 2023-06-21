import ReactCodeInput from 'react-code-input';
import React from 'react';
import codeInputStyle from './CodeInputStyle';

const CodeInput = React.forwardRef(({
	name,
	value,
	onChange,
	onBlur,
	type = 'number',
	placeholder = '*',
	fields = 4,
	setFieldValue,
	error,
	...rest
}, ref) => {
	const onCodeChange = (val) => {
		if (setFieldValue) {
			setFieldValue(name, val);
		}
		if (onChange) {
			onChange(val);
		}
	};

	return (
		<ReactCodeInput
			className={error ? 'error' : ''}
			name={name}
			value={value}
			onChange={onCodeChange}
			onBlur={onBlur}
			type={type}
			placeholder={placeholder}
			fields={fields}
			ref={ref}
			{...codeInputStyle}
			{...rest}
		/>
	);
});

export default CodeInput;
