import React, { useState, useEffect } from 'react';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { styled, useTheme } from '@mui/material/styles';
import UpdateEntityTabs from 'components/EntityForms/UpdateEntityForm/UpdateTabsModal/UpdateEntityTabModal';
import AppBar from '@mui/material/AppBar';
import '../RightDialog.scss';
import TableDataService from 'services/TableDataService';
import { entityTabs, TabPanel, a11yProps } from '../config/config';
import { useTranslation } from 'react-i18next';
import SwipeableViews from 'react-swipeable-views';
import { renderItems } from '../config/helpers';
import UpdateEntityForm from 'components/EntityForms/UpdateEntityForm/UpdateEntityForm';
import CreateTabsModal from 'components/EntityForms/UpdateEntityForm/CreateTabsModal/CreateTabsModal';
import { useRecoilState } from 'recoil';
import { _OpenTableName } from '../../../recoil/atoms';
export default function EntityTabs({
	table_name,
	detailsObject,
	middle_modal_width,
	rowData,
	setRowData,
	padding,
	specialWidthForModal,
	extraDataForTabs,
	setExtraDataForTabs,
	file,
}) {
	const [selectedEntity, setValue] = useState(0);
	const [dataList, setDataList] = useState(['a', 'b', 'c', 'd']);
	const [createEntityModalTabs, setCreateEntityModalTabs] = useState(false);
	const [updateEntityTabsModal, setUpdateEntityTabsModal] = useState(false);
	const [nameOfTab, setNameOfTab] = useState('');
	const [specialValueForModal, setSpecialValueForModal] = useState('');
	const [dataForTabs, setDataForTabs] = useState([]);
	const [moreDataForTabs, setMoreDataForTabs] = useState([]);
	const [constraintsForTable, setConstraintsForTable] = useState([]);
	const [updateEntity, setUpdateEntity] = useState(false);
	const [tableNameForTabs, setTableNameForTabs] = useState(table_name);
	const [openTableName, setOpenTableName] = useRecoilState(_OpenTableName);
	useEffect(() => {
		switch (table_name) {
			case 'vehicles':
				setTableNameForTabs('vehicles');
				setDataForTabs(detailsObject);
				setExtraDataForTabs({ ...rowData });
				break;
			case 'price_list':
				//get contracts data for price list
				if (rowData?.id) {
					TableDataService.getContractsDataForPriceList(rowData?.id)
						.then((res) => {
							setDataForTabs({ ...rowData, contracts: [...res] });
						})
						.catch((error) =>
							console.error('error get contracts data for price list', error),
						);
				}
				if (rowData?._lines) {
					setDataForTabs({ ...rowData });
				}
				break;
			case 'contracts':
				if (rowData) {
					setDataForTabs(rowData);
				}
				break;

			case 'chaperones':
				setTableNameForTabs('chaperones');

				TableDataService.getTableData({
					LIMIT: 200,
					page: 0,
					sortBy: 'menu_key',
					//searchFilter:detailsObject.car_id,
					table_name: 'chaperone_contacts',
				})
					.then((res) => {
						if (!!res) {
							if (Array.isArray(res?.rows)) {
								const dataForChaperone = res?.rows.filter(
									(chaperone) => chaperone.chaperone_id === detailsObject.id,
								);

								setExtraDataForTabs(dataForChaperone);
							}
						}
					})
					.catch((error) =>
						console.error('error get price_extra table', error),
					);
				break;

			case 'drivers':
				setTableNameForTabs('drivers');
				break;

			case 'sub_constractors':
				TableDataService.getResourceOfSubConstractor(detailsObject.id)
					.then((res) => {
						setExtraDataForTabs(res);
					})
					.catch((error) =>
						console.error('error get sub_constractors resourses', error),
					);
				break;

			case 'customers':
				setTableNameForTabs('customers');
				TableDataService.getTableData({
					LIMIT: 200,
					page: 0,
					sortBy: 'menu_key',
					//searchFilter:detailsObject.car_id,
					table_name: 'passengers',
				})
					.then((res) => {
						if (!!res) {
							if (Array.isArray(res?.rows)) {
								const dataForCustomer = res?.rows.filter(
									(customer) =>
										customer.customer_id_connection === detailsObject.id,
								);
								setExtraDataForTabs(dataForCustomer);
							}
						}
					})
					.catch((error) => console.error('error get passengers table', error));
				setTableNameForTabs('customers');
				detailsObject?.pk &&
					TableDataService.getContactsForTable({
						pk: detailsObject?.pk,
						table_name: 'customers',
					})
						.then((res) => {
							if (!!res) {
								setMoreDataForTabs(res);
								setConstraintsForTable(res);
							}
						})
						.catch((error) =>
							console.error('error get passengers table', error),
						);
			default:
				setDataForTabs([]);
				setExtraDataForTabs([]);
				setMoreDataForTabs([]);
		}
	}, [table_name, rowData]);

	const tabList = entityTabs[table_name];

	const theme = useTheme();
	const { t } = useTranslation();

	const toggleUpdateEntityModal = () => {
		setUpdateEntity((state) => !state);
	};

	const handleOpenEditModal = (e, tabName) => {
		switch (tabName) {
			case 'uploadPassengersDocument':
				setTableNameForTabs('uploadPassengersDocument');
				setCreateEntityModalTabs((state) => !state);
				setNameOfTab('uploadPassengersDocument');
				break;
			case 'contracts':
				setOpenTableName('contracts');
				break;
			case 'price_list':
				//go to price list table
				setOpenTableName('price_list');
				break;
			case 'lines':
			case 'exstas':
				toggleUpdateEntityModal();
				break;
			case 'driver_connection':
				setTableNameForTabs('driver_contacts');
				setNameOfTab(tabName);
				setCreateEntityModalTabs((state) => !state);
				setSpecialValueForModal(detailsObject.id);
				break;
			case 'resources':
				setTableNameForTabs('resources');
				setNameOfTab(tabName);
				setCreateEntityModalTabs((state) => !state);
				setSpecialValueForModal([detailsObject.id, detailsObject.scopes]);
				break;
			case 'driver_availability':
				setTableNameForTabs('drivers');
				setUpdateEntityTabsModal((state) => !state);
				setNameOfTab(tabName);
				break;
			case 'driver_capability':
				setTableNameForTabs('drivers');
				setUpdateEntityTabsModal((state) => !state);
				setNameOfTab(tabName);
				break;
			case 'constraints':
				setTableNameForTabs('customers');
				setUpdateEntityTabsModal((state) => !state);
				setNameOfTab(tabName);
				break;
			case 'passengers':
				setTableNameForTabs('passengers');
				setCreateEntityModalTabs((state) => !state);
				setNameOfTab(tabName);
				setSpecialValueForModal(detailsObject?.id);
				break;
			case 'documents':
				setCreateEntityModalTabs((state) => !state);
				setNameOfTab(tabName);
				setSpecialValueForModal(detailsObject.id);
				break;
			case 'customers_contacts':
				setTableNameForTabs('customers_contacts');
				setCreateEntityModalTabs((state) => !state);
				setNameOfTab(tabName);
				setSpecialValueForModal(detailsObject.pk);
				break;
			case 'chaperone_connection':
				setTableNameForTabs('chaperone_contacts');
				setNameOfTab(tabName);
				setCreateEntityModalTabs((state) => !state);
				setSpecialValueForModal(detailsObject.id);
				break;
			case 'chaperone_availability':
				setTableNameForTabs('chaperones');
				setUpdateEntityTabsModal((state) => !state);
				setNameOfTab(tabName);
				break;
			case 'chaperone_capability':
				setTableNameForTabs('chaperones');
				setUpdateEntityTabsModal((state) => !state);
				setNameOfTab(tabName);
				break;
			default:
				setNameOfTab(tabName);
				setUpdateEntityTabsModal((state) => !state);

				break;
		}
	};

	const handleChange = (event, newValue) => {
		setValue(newValue);
	};

	const handleChangeIndex = (newValue) => {
		setValue(newValue);
	};

	return (
		<>
			<Box sx={{ width: '100%' }}>
				<AppBar
					position='static'
					sx={{ backgroundColor: 'white', boxShadow: 'none', width: '100%' }}
				>
					<AntTabs
						value={selectedEntity}
						onChange={handleChange}
						variant='fullWidth'
						aria-label='full width tabs example'
					>
						{tabList?.map((tab_name, i) => (
							<AntTab
								label={t(`right_dialog.tabs.${tab_name}.name`).toLowerCase()}
								{...a11yProps(tab_name)}
							/>
						))}
					</AntTabs>
				</AppBar>

				<SwipeableViews
					axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
					index={selectedEntity}
					onChangeIndex={handleChangeIndex}
					style={{ backgroundColor: 'rgba(192,200,217,0.17)' }}
				>
					{tabList?.map((tab_name, i) => {
						return (
							<TabPanel value={tab_name} index={tab_name} dir={theme.direction}>
								<div className='edit_item_wrapper'>
									<div
										className='edit_item'
										id={tab_name}
										onClick={(e) => handleOpenEditModal(e, tab_name)}
									>
										{' '}
										{t(`right_dialog.tabs.${tab_name}.edit_tab`)}
									</div>
									{tab_name === 'passengers' && (
										<div
											className='edit_item'
											id={tab_name}
											onClick={(e) =>
												handleOpenEditModal(e, 'uploadPassengersDocument')
											}
										>
											{t(`right_dialog.tabs.${tab_name}.extra_edit_tab`)}{' '}
										</div>
									)}
								</div>
								<Box
									sx={{
										minHeight: '100%',
										flex: 1,
										//backgroundColor: 'rgba(192,200,217,0.17)',
									}}
								>
									{renderItems({
										selectedEntity,
										dataList,
										tabList,
										dataForTabs,
										extraDataForTabs,
										detailsObject,
										moreDataForTabs,
										constraintsForTable,
										specialValueForModal,
										file,
									})}
								</Box>
							</TabPanel>
						);
					})}
				</SwipeableViews>
			</Box>
			{nameOfTab && updateEntityTabsModal && (
				<UpdateEntityTabs
					isOpen={updateEntityTabsModal}
					toggle={handleOpenEditModal}
					initialValues={detailsObject || {}}
					setRowData={setRowData}
					table_name={tableNameForTabs}
					tab_name={nameOfTab}
					extraDataForTabs={extraDataForTabs}
					padding={padding}
					specialWidthForModal={specialWidthForModal}
				/>
			)}
			{createEntityModalTabs && nameOfTab && (
				<CreateTabsModal
					isOpen={createEntityModalTabs}
					toggle={handleOpenEditModal}
					table_name={tableNameForTabs}
					tab_name={nameOfTab}
					specialValueForModal={specialValueForModal}
					padding={padding}
					middle_modal_width={middle_modal_width}
				/>
			)}

			<UpdateEntityForm
				isOpen={updateEntity}
				toggle={toggleUpdateEntityModal}
				table_name={table_name}
				initialValues={detailsObject || {}}
				middle_modal_width={middle_modal_width}
			/>
		</>
	);
}

const AntTabs = styled(Tabs)({
	borderBottom: '3px solid #e8e8e8',
	'& .MuiTabs-indicator': {
		backgroundColor: '#2EC4B6',
		// bottom: -3,
		// zIndex: 10,
	},
});

const AntTab = styled((props) => <Tab disableRipple {...props} />)(
	({ theme }) => ({
		textTransform: 'none',
		minWidth: 0,
		[theme.breakpoints.up('sm')]: {
			minWidth: 0,
		},
		marginRight: theme.spacing(1),
		color: 'rgba(0,0,0,0.6)',
		fontFamily: 'Rubik',
		fontSize: '14px',
		letterSpacing: '0.25px',
		lineHeight: '20px',
		textAlign: 'center',
		'&:hover': {
			color: '#402EC4B6a9ff',
			opacity: 1,
		},
		'&.Mui-selected': {
			color: '#2EC4B6',
			fontWeight: theme.typography.fontWeightMedium,
		},
		'&.Mui-focusVisible': {
			backgroundColor: '#d1eaff',
		},
	}),
);
