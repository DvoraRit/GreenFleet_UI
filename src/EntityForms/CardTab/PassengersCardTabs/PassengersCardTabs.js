import React, { useState, useEffect } from 'react';
import { makeStyles } from '@mui/styles';
import CloseIcon from '@mui/icons-material/Close';
import { Autocomplete, TextField, Chip } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useStores } from 'stores/index';
import { toJS } from 'mobx';
import CardTab from 'components/EntityForms/CardTab/CardTab';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { openTabInformationRightSideModal } from 'recoil/atoms';
import RightDialog from 'components/RightDialog/RightDialog';
import '../CardTab.scss';

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

const PassengersCardTabs = ({ passengersData }) => {
	const classes = useStyles();
	const { t } = useTranslation();
	const [rightDialog, setRightDialog] = React.useState(false);
	const [itemDetails, setItemDetails] = React.useState({ ...passengersData });

	const toggleRightDialog = () => {
		setRightDialog((state) => !state);
	};
	const handleOpenDialog = (item) => {
		setItemDetails({
			original: { ...item },
			values: { first_name: `${item.first_name}  ${item.last_name}` },
		});
		toggleRightDialog();

	}


	const [passengersInformation, setPassengersInformation] = useState(passengersData );

	const getResourcesFromSearch = (input, event) => {
		if (input === '' || !input) {
			setPassengersInformation(passengersData )

		} else {
			const result = passengersInformation?.filter((text) =>
				text.first_name.includes(input) ||text.last_name.includes(input),
			);
			setPassengersInformation(result);
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
						<SearchIcon style={{ right: -20, position: 'absolute' }} />
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
			<div style={{ marginTop: 10 }}>
				{passengersInformation?.map((item, index) => (
					<div className='passengersInformationCard'>
						<div className='card-tab-wrapper-info'>
							<div className='card_info_number'>{index+1}</div>
							<div className='card_info'>
								<div className='card_info_title'>{item.first_name} {item.last_name}</div>
								<div className='card_info_subTitle'>{item.passenger_type}</div>
							</div>
						</div>

						<div
							className='showMoreInformation'
							onClick={()=>handleOpenDialog(item)}
						>
							{t(`showMoreInformation`)}
						</div>
					</div>
				))}
			</div>
			<RightDialog
				isOpen={rightDialog}
				toggle={() => {
					toggleRightDialog();
				}}
				selectedEntityData={itemDetails}
				table_name={'passengers'}
				goBack={true}
				middle_modal_width={'60vw'}
			/>
		</div>
	);
};

export default PassengersCardTabs;
