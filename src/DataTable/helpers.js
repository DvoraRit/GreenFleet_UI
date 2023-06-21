import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

import ColumnsPopUpState from './components/ColumnsPopUpState';
import OptionsPopUpState from './components/OptionsPopUpState';
import PricesListContract from './components/PricesListContract';
import ContactName from './components/ContactName';
import IsValueExistIcon from 'components/IsValuesExistIcon/IsValueExistIcon';
import currencies from '../../constants/currencies.json';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { toJS } from 'mobx';

import Large from 'assets/icons/car_icons/large.svg';
import Medium from 'assets/icons/car_icons/md.svg';
import Small from 'assets/icons/car_icons/sm.svg';
import ActiveStatus from 'components/ActiveStatus/ActiveStatus';
import TableDataService from 'services/TableDataService';
//classification_icons
import Bronze from 'assets/icons/classification_bronze.svg';
import Silver from 'assets/icons/classification_silver.svg';
import Gold from 'assets/icons/classification_gold.svg';
import language_codes from 'constants/listOfLanguages.json';

//currency_icons
// import NIS from 'assets/icons/currency_nis.svg';
// import Dollar from 'assets/icons/currency_dollar.svg';
// import EuroIcon from '@mui/icons-material/Euro';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';

export const renderClassification = (classification) => {
	const assets = {
		Bronze,
		Silver,
		Gold,
	};

	return assets[classification];
};

export const renderIconSize = (iconSize) => {
	const assets = {
		Small,
		Medium,
		Large,
	};

	return assets[iconSize];
};

export const getAvatarColors = () => {
	let colors = {
		primary: ['#2EC4B6', 'rgba(46,196,182,0.07)'],
		secondary: ['#6F85FF', 'rgba(111,133,255,0.07)'],
		natural: ['#43496A', 'rgba(67,73,106,0.07)'],
	};

	return colors.primary;
};

export const stringAvatar = (name) => {
	let [color, bgOverly] = getAvatarColors();
	return {
		sx: {
			bgcolor: bgOverly,
			color: color,
			fontSize: 12,
			border: `1px solid ${color}`,
			height: 26,
			width: 26,
		},
		children: `${name?.split(' ')[0][0]}${name?.split(' ')?.[1]?.[0]}`,
	};
};

export const getHighlightedText = (text = '', highlight = '') => {
	// Split text on highlight term, include term itself into parts, ignore case

	try {
		if (!!text?.split()) {
			const parts = text?.split(new RegExp(`(${highlight})`, 'gi'));
			return (
				<span>
					{parts?.map((part) =>
						part?.toLowerCase() === highlight?.toLowerCase() ? (
							<b>{part}</b>
						) : (
							part
						),
					)}
				</span>
			);
		} else {
			return <span>{text}</span>;
		}
	} catch (e) {
		console.error(e.message);
	}
};

export const formatHeader = ({
	column,
	canHideColumns,
	allColumns,
	getToggleHideAllColumnsProps,
	alwaysVisibleColumns,
	headerTextStyle,
}) => {
	// console.error(column?.canSort);//true

	try {
		switch (column?.render('Header')) {
			// switch ('addIcon') {
			case 'addIcon':
				return (
					<PopupState variant='popover' popupId='demo-popup-menu'>
						{(popupState) => {
							return (
								<p
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<span {...bindTrigger(popupState)}>
										<AddCircleOutlinedIcon />
									</span>
									<ColumnsPopUpState
										{...bindMenu(popupState)}
										{...{
											allColumns,
											getToggleHideAllColumnsProps,
											column,
											alwaysVisibleColumns,
										}}
									/>
								</p>
							);
						}}
					</PopupState>
				);

			case 'blank':
			case 'long':
				return '';
			default:
				return (
					<span className='header-text' style={headerTextStyle}>
						{column?.render('Header')}
					</span>
				);
		}
	} catch (e) {
		console.error(e?.message);
	}
};

export const formatData = ({
	cell,
	row,
	dataTextStyle,
	searchFilter,
	dataTableStore,
	middle_modal_width
}) => {
	try {
		if (cell?.column?.customLabel && typeof cell?.value === 'number') {
			return <IsValueExistIcon value={cell?.value} />;
		}
		
		switch (cell?.column?.id) {
			case 'latitude':
				return (<span className='data-text' style={{ ...dataTextStyle }}>
						{`${cell.value}, ${cell.row.values.longitude}`}
					</span>)
				
			case 'icon_size':
				switch (cell?.value) {
					case 'Large':
						return (
							<img
								src={Large}
								alt='vehicles_icon_large'
								style={{ height: 19, width: 19 }}
							/>
						);
					case 'Small':
						return (
							<img
								src={Small}
								alt='vehicles_icon_Sm'
								style={{ height: 19, width: 19 }}
							/>
						);
					case 'Medium':
						return (
							<img
								src={Medium}
								alt='vehicles_icon_Md'
								style={{ height: 19, width: 19 }}
							/>
						);
					default:
						return '';
				}
			case 'addIcon':
				return (
					<PopupState variant='popover' popupId='demo-popup-menu'>
						{(popupState) => {
							return (
								<p
									style={{
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
									}}
								>
									<span {...bindTrigger(popupState)}>
										<MoreHorizIcon
											sx={{
												...(!!bindMenu(popupState)?.open && {
													color: '#2EC4B6',
												}),
												cursor: 'pointer',
											}}
										/>
									</span>
									<OptionsPopUpState 
									{...bindMenu(popupState)} 
									{...{cell, middle_modal_width, row}} />
								</p>
							);
						}}
					</PopupState>
				);

			case 'blank':
			case 'longitude':
				return '';
			case `classification`:
				const Icon = renderClassification(cell?.value);
				return (
					<img src={Icon} alt='Bronze' style={{ height: 19, width: 19 }} />
				);

			case 'size':
				switch (cell?.value) {
					case 'Large':
						return <div>גדול</div>;
					case 'Small':
						return <div>קטן</div>;
					case 'Medium':
						return <div>בינוני</div>;
					default:
						return 'לא ידוע';
				}

			case 'image':
				if (cell?.value) {
					return <img src={cell.value} style={{ maxHeight: 45 }} alt='' />;
				} else {
					return <AccountBoxRoundedIcon />;
				}
			case 'customer_icon':
        console.log('cell.value',cell.value)
				if (cell?.value) {
					return <img src={cell.value} style={{ maxHeight: 45 }} alt='' />;
				} else {
					return <AccountBoxRoundedIcon />;
				}
			case 'poc_name':
				return (
					<p
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							alignItems: 'center',
							width: '100%',
						}}
					>
						<span style={{ marginRight: 10 }}> {cell?.value} </span>
						<Avatar size='small' {...stringAvatar(cell.value)} />
					</p>
				);
			case 'orders':
			case 'planning':
			case 'control':
			case 'hr':
			case 'safety':
			case 'entities':
			case 'show_percent':
			case 'show_cost':
			case 'users':
			case 'orders':
			case 'maintenance':

				switch (cell?.value) {
					case 3:
						return ' מלא';
					case 2:
						return ' חלקי';
					case 1:
						return 'צפיה בלבד';

					case 0:
						return 'ללא';

					default:
						return 'לא ידוע';
				}
			case 'available':
				switch (cell?.value) {
					case 1:
						return <ActiveStatus isActive={true} />;

					case 0:
						return <ActiveStatus isActive={false} />;

					default:
						return 'לא ידוע';
				}

			case 'scope':
			case 'scopes':
				let zones = toJS(dataTableStore?.getScopeLabel(cell?.value)) ?? '';
				return zones;
			case 'car_type_name':
				let car_type = toJS(dataTableStore?.getCarTypeLabel(cell?.value)) ?? '';
				return car_type;

			case 'is_active':
				switch (cell?.value) {
					case 1:
						return <ActiveStatus isActive={true} />;

					case 0:
						return <ActiveStatus isActive={false} />;

					default:
						return 'לא ידוע';
				}

			case 'status':
				switch (parseInt(cell?.value)) {
					case 1:
						return <ActiveStatus isActive={true} />;
					case 0:
						return <ActiveStatus isActive={false} />;
					case 2:
						return <ActiveStatus isActive={false} status={'draft'} />;
					case 3:
						return <ActiveStatus isActive={false} status={'bid'} />;
					case 4:
						return <ActiveStatus isActive={false} status={'ended'} />;

					default:
						return 'לא ידוע';
				}
			case 'extras':
				return (
					<div
						style={{
							fontFamily: 'Rubik',
							color: 'rgba(0,0,0,0.87)',
							direction: 'rtl',
						}}
					>
						{`${cell?.value} תוספות`}
					</div>
				);
			case '_lines':
				return (
					<div
						style={{
							fontFamily: 'Rubik',
							color: 'rgba(0,0,0,0.87)',
							direction: 'rtl',
						}}
					>
						{`${cell?.value} פריטים`}
					</div>
				);
			case 'vat':
				switch (cell?.value) {
					case 1:
						return 'כולל';
					case 0:
						return 'לא כולל';
					default:
						return 'לא ידוע';
				}
			case 'currency':
				let label = currencies[cell?.value].he_name;
				return (
					<span className='data-text' style={{ ...dataTextStyle }}>
						{label}
					</span>
				);
			case 'language':
				let language = language_codes[cell?.value].nativeName;
				return (
					<span className='data-text' style={{ ...dataTextStyle }}>
						{language}
					</span>
				);
			case 'languages':
				let languages = language_codes[cell?.value].nativeName;
				return (
					<span className='data-text' style={{ ...dataTextStyle }}>
						{languages}
					</span>
				);
			case 'type': {
				switch (cell?.value) {
					case 'lines':
						return 'קווים';
					case 'destinations':
						return 'יעדים';
					case 'type':
						return 'סוג נסיעה';
					default:
						return 'לא ידוע';
				}
			}
			case 'items': {
				return <PricesListContract dataTextStyle={dataTextStyle} row={row} />;
			}
			case 'contact_person': {
				return <ContactName row={row} />;
			}

			default:
				return (
					<span className='data-text' style={{ ...dataTextStyle }}>
						{cell.render('Cell')}
					</span>
				);
		}
	} catch (e) {
		console.error('e', e);
	}
};
