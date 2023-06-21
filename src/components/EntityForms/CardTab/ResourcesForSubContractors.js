import React, { useState, useEffect } from 'react';
import CardTab from './CardTab';
import { makeStyles } from '@mui/styles';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { Autocomplete, TextField, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTranslation } from 'react-i18next';

const useStyles = makeStyles({
	searchTab: {
		height: '40px !important',
		margin: '15px !important',
		backgroundColor: 'white !important',
		width: '66% !important',

		'.Mui-focused': {
			right: '90px !important',
		},
	},
});
const ResourcesForSubContractors = ({
	driversOfSubContractors,
	vehiclesOfSubContractors,
	dataForTabs,
}) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const [showDriver, setShowDriver] = useState(false);
	const [showVehicles, setShowVehicles] = useState(false);
	const [driversDetails, setDriversDetails] = useState(driversOfSubContractors,);
	const [vehiclesDetails, setVehiclesDetails] = useState(vehiclesOfSubContractors);

	const getResourcesFromSearch = (input, event) => {
		if (input === '' || !input) {
			setDriversDetails(driversOfSubContractors);
			setVehiclesDetails(vehiclesOfSubContractors);
		} else {
			const result = driversDetails?.filter(
				(text) =>text.title.includes(input)
			);
			setDriversDetails(result);

			const vehiclesResult = vehiclesDetails?.filter((text) =>
				text.title.includes(input),
			);
			setVehiclesDetails(vehiclesResult);
		}
	};

	return (
		<div style={{ display: 'flex', flexDirection: 'column' }}>
			<div className='search-resources-modal' style={{ direction: 'rtl' }}>
				<Autocomplete
					multiple
					freeSolo
					id='filter-in-modal'
					className={classes.searchTab}
					options={[]}
					selectOnFocus={true}
					forcePopupIcon={true}
					popupIcon={
						<SearchIcon />
					}
					size='small'
					renderInput={(params) => <TextField {...params} label=' סנן' />}
					renderTags={(value, getTagProps) => {
						return;
					}}
					onInputChange={(event) => {
						getResourcesFromSearch(event.target.value, event);
					}}
				/>
			</div>
			<div
				style={{
					fontFamily: 'Rubik',
					fontSize: 14,
					direction: 'rtl',
					display: 'flex',
					marginTop: 10,
				}}
				onClick={() => setShowDriver(!showDriver)}
			>
				{`${driversDetails?.length}  נהגים`}
				<ArrowDropDownIcon />
			</div>
			{showDriver &&
				driversDetails?.map((item, index) => (
					<CardTab
						item={item}
						dataForTabs={{...dataForTabs.drivers[index],resource_bank:[...dataForTabs.resource_bank]}}
						key={index}
						isNumbered={true}
						canEditAndDelete={true}
						table_name={'drivers'}
						nameOfTab={'resources'}
					/>
				))}
			<br />
			<div
				style={{
					fontFamily: 'Rubik',
					fontSize: 14,
					direction: 'rtl',
					display: 'flex',
				}}
				onClick={() => setShowVehicles(!showVehicles)}
			>
				{`${vehiclesDetails?.length} רכבים`}
				<ArrowDropDownIcon />
			</div>
			{showVehicles &&
				vehiclesDetails?.map((item, index) => (
					<CardTab
						item={item}
						dataForTabs={{...dataForTabs.drivers[index],resource_bank:[...dataForTabs.resource_bank]}}
						key={index}
						isNumbered={true}
						canEditAndDelete={true}
						table_name={'vehicles'}
						nameOfTab={'resources'}
					/>
				))}
		</div>
	);
};

export default ResourcesForSubContractors;
