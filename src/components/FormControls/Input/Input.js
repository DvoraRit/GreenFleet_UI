import React from 'react';
import TextField from '@mui/material/TextField';
import TextFieldHeader from '@mui/material/TextField';

import { create } from 'jss';
import { StylesProvider, jssPreset } from '@mui/styles';
import rtl from 'jss-rtl';
import { styled } from '@mui/material/styles';
import AccountCircle from '@mui/icons-material/AccountCircle';
import InputAdornment from '@mui/material/InputAdornment';
import LocationSearchingIcon from '@mui/icons-material/LocationSearching';

const CssTextField = styled(TextField)({
	'MuiInput-input MuiInputBase-input': {},
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
const CssTextFieldHeader = styled(TextFieldHeader)({
	'& label': {
		paddingLeft: '45px',
	},
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

export default function FormInput({
	value,
	name,
	onChange,
	label,
	input,
	width,
	icon_data,
	labelStyle,
	isHeader,
	disabled,
	is_required,
	...params
}) {
	const jss = create({
		plugins: [...jssPreset().plugins, rtl()],
	});

	const iconsObj = {
		location: LocationSearchingIcon,
	};

	let Icon;
	if (icon_data) {
		Icon = iconsObj[icon_data];
	}

	return (
		<StylesProvider jss={jss}>
			{!!isHeader ? (
				<CssTextFieldHeader
					InputProps={
						icon_data && {
							startAdornment: (
								<InputAdornment
									position='end'
									sx={{
										display: 'flex',
										justifyContent: 'flex-end',
										paddingRight: '15px',
										flex: 1,
										minWidth: '100%',
										alignItems: 'center',
										minHeight: '100%',
									}}
								>
									<Icon sx={{ fontSize: 16 }} />
								</InputAdornment>
							),
						}
					}
					disabled={disabled}
					id={name}
					label={label}
					variant='standard'
					value={value || ""}
					rtl={true}
					right
					onChange={onChange}
					{...params}
					sx={{
						textAlign: 'right',
						// width: '20%',
						...(width
							? { maxWidth: '100%', minWidth: '100%' }
							: { width: '100%' }),
					}}
				/>
			) : (
				<CssTextField
					InputProps={
						icon_data && {
							startAdornment: (
								<InputAdornment
									position='end'
									sx={
										{
											// display: 'flex',
											// justifyContent: 'flex-end',
											// paddingRight: '15px',
											// flex: 1,
											// minWidth: '100%',
											// alignItems: 'center',
											// minHeight: '100%',
										}
									}
								>
									<Icon sx={{ fontSize: 16 }} />
								</InputAdornment>
							),
						}
					}
					id={name}
					label={label}
					variant='standard'
					value={value}
					rtl={true}
					right
					onChange={onChange}
					required={is_required===1}
					{...params}
					sx={{
						textAlign: 'right',
						// backgroundColor: 'orange',
						// width: '20%',
						...(width
							? { maxWidth: '100%', minWidth: '100%' }
							: { width: '100%' }),
					}}
				/>
			)}
		</StylesProvider>
	);
}
