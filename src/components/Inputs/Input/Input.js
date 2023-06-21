import React from 'react';

const Input = ({ id, value, onChange, onBlur, type = 'text', ...rest }) => {
	return (
		<input
			className='input'
			id={id}
			value={value}
			onChange={onChange}
			onBlur={onBlur}
			type={type}
			{...rest}
		/>
	);
};

export default Input;
