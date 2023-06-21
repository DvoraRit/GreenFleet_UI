import React from 'react';

import CheckboxControl from '@mui/material/Checkbox';
import { makeStyles } from '@mui/styles';
import './Checkbox.scss';

const useStyles = makeStyles({
	formControl: {
		fontFamily: 'Rubik cursive !important',
		color: 'rgba(0,0,0,0.6) !important',
		fontSize: '14px !important',
	},
	box: {
		marginLeft: '0px !important',
		marginRight: '0px !important',
	},
	checkbox: {
		color: '#2EC4B6 !important',
		height: '10.5px !important',
		width: '10.5px !important',
		marginLeft: 5,
		marginRight: 5,
	},
});

function Checkbox({
	onChange,
	value,
	name,
	label,
	color = 'primary',
	size = 'medium',
}) {
	const classes = useStyles();

	return (
		<div className='checkbox-form-control'>
			<div className='checkbox-item'>
				<CheckboxControl
					onChange={(e, v) => onChange(v)}
					color={color}
					size={size}
					className={classes.checkbox}
					checked={value}
					name={name}
					label={label}
				/>
				{label && <p style={{"whiteSpace":"pre"}}> {label}</p>}
			</div>
		</div>
	);
}

export default Checkbox;
