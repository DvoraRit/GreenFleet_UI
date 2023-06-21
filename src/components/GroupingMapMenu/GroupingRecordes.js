import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
// import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
// import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import { useRecoilState } from 'recoil';
import { setGrouping, setGroupingRecordes } from '../../recoil/atoms.js';
import './GropingMapMenu.scss';
import {
	textInPopUpGroupingMapItems,
	textInPopUpGroupingRecordes,
	textInPopUpGroupingStatus,
} from '../../constants/textConstans';
import { ControlLayers } from '../controlLayers/controlLayers';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
	formControl: {
		fontFamily: 'Rubik cursive !important',
		color: 'rgba(0,0,0,0.87) !important',
		fontSize: '14px !important',
	},
	box:{
		// marginTop:'10px !important',
		// marginBottom:'10px !important',
		color: 'rgba(0,0,0,0.87)',
		fontFamily: 'Rubik',
		fontSize:'14px',
		letterSpacing: '0.25px',
		lineHeight: '20px',
		textAlign: 'right',
		width: 'inherit !important',
		marginLeft: '0px !important',
		marginRight: '0px !important',
	},
	checkbox: {
		color: '#00e6ac !important',
	},
});

const GroupingRecordes = ({ data, chosenLayers }) => {
	const classes = useStyles();
	const [chosenFromLayers, setChosenFromLayers] =
		useRecoilState(setGroupingRecordes);
	const [layersChange, setLayersChange] = useRecoilState(setGrouping);
	const positionOfModal =
		data === 'mapItems' ? '4rem' : '10rem';

	const handleSelectedItem = (e) => {
		setLayersChange((prev) => {
			return { ...prev, [e.target.name]: e.target.checked };
		});
	};

	const handleChange = (e, showInMap) => {
		setLayersChange((prev) => {
			return { ...prev, [e.target.name]: e.target.checked };
		});
	};
	useEffect(() => {
		localStorage.setItem('Layers', JSON.stringify(layersChange));
	}, [layersChange]);

	return (
		<Box
			sx={{
				width: '12rem',
				color: 'black',
				position: 'absolute',
				backgroundColor: '#FFFFFF',
				top: positionOfModal,
				right: '14.7rem',
				padding: 0,
			}}
		>
			<FormControl
				sx={{ m: 3 }}
				component='fieldset'
				variant='standard'
				className={classes.box}
			>
				{data === 'mapItems' && (
					<FormGroup>
						{textInPopUpGroupingMapItems.map((input) => {
							return (
								<FormControlLabel
									className={'formControl'}
									key={input.action}
									label={input.text}
									control={
										<Checkbox
											onChange={(e) => handleChange(e, input.action)}
											name={input.action}
											color='primary'
											className={classes.checkbox}
											checked={layersChange[input.action]}
										/>
									}
								/>
							);
						})}
					</FormGroup>
				)}
				{data === 'status' && (
					<FormGroup>
						{textInPopUpGroupingStatus.map((input) => {
							return (
								<FormControlLabel
									className={'formControl'}
									key={input.action}
									label={input.text}
									control={
										<Checkbox
											onChange={(e) => handleChange(e, input.action)}
											name={input.action}
											color='primary'
											className={classes.checkbox}
											checked={layersChange[input.action]}
										/>
									}
								/>
							);
						})}
					</FormGroup>
				)}
			</FormControl>
		</Box>
	);
};

export default GroupingRecordes;
