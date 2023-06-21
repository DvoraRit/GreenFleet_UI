import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
	text: {
		fontFamily: 'Rubik cursive !important',
		color: 'rgba(0,0,0,0.87) !important',
		width: '115px !important',
    	textAlign: 'right !important',
		overflow: 'hidden !important',
		textOverflow: 'ellipsis !important',
		whiteSpace: 'nowrap !important'
	},
	checkbox:{
		marginRight:'-12px !important',
		color: '#00e6ac !important',
	}
  });


export default function Zone({
	value,
	handleZoneChange,
	userChosenZones,
	...rest
}) {
	// let isChosen = userChosenZones?.includes(value);
	let isChosen = userChosenZones?.includes(value);
	//let isChosen = localStorage.getItem('CHOSEN_ZONES')?.includes(value)||userChosenZones?.includes(value);
	const classes = useStyles();
	return (
		<div className='zone-wrapper' {...rest}>
			<FormControlLabel
				//key={input.action}
				label={value}
				className={classes.text}
				// className={'zone-text'}
				control={
					<Checkbox
						onChange={() => handleZoneChange(value)}
						name={value}
						color='primary'
						size='small'
						className={classes.checkbox}
						checked={isChosen}
					/>
				}
			/>
		</div>
	);
}
