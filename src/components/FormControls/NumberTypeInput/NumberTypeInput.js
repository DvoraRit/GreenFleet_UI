import React from 'react';
import TextField from '@mui/material/TextField';

import { create } from 'jss';
import { StylesProvider, jssPreset } from '@mui/styles';
import rtl from 'jss-rtl';
import { styled } from '@mui/material/styles';

const CssTextField = styled(TextField)({
	'& label.Mui-focused': {
		color: '#2EC4B6',
	},
	'& .MuiInput-underline:after': {
		borderBottomColor: '#2EC4B6',
	},
	'& .MuiOutlinedInput-root': {
		'& fieldset': {
			borderColor: '#2EC4B6',
		},
		'&:hover fieldset': {
			borderColor: '#2EC4B6',
		},
		'&.Mui-focused fieldset': {
			borderColor: '#2EC4B6',
		},
	},
});

export default function NumberTypeInput({
	value,
	name,
	onChange,
	label,
	input,
	width,
	type,
	...params
}) {
	const jss = create({
		plugins: [...jssPreset().plugins, rtl()],
	});

	return (
		<StylesProvider jss={jss}>
			<CssTextField
				id={name}
				label={label}
				variant='standard'
				value={value}
				type='number'
				rtl={true}
				onChange={onChange}
				InputLabelProps={{
					shrink: true,
				}}
				{...params}
				sx={{
					textAlign: 'right',
					// backgroundColor: 'orange',
					// width: '20%',
					...(width
						? { maxWidth: '100%', minWidth: '100%' }
						: { width: '90%' }),
				}}
			/>
		</StylesProvider>
	);
}
// <TextField
//   id="filled-number"
//   label="Number"
//   type="number"
//   InputLabelProps={{
//     shrink: true,
//   }}
//   variant="filled"
// />
