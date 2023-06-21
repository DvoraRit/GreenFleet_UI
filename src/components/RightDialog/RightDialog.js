// import Draggable from 'react-draggable';
import { withStyles } from '@material-ui/styles';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import closeDialog from 'assets/icons/dialogClose.png';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import UpdateEntityForm from 'components/EntityForms/UpdateEntityForm/UpdateEntityForm';
import { useObserver } from 'mobx-react';
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { ResizableBox } from 'react-resizable';
import TableDataService from 'services/TableDataService';
import Spinner from '../Spinner/Spinner';
import EntityDetailsSection from './components/EntityDetails';
import EntityTabs from './components/EntityTabs';
import { entityTitleField } from './config/config';
import {
	_pricesListForContract,
	_contactPeopleOfContract,
	_selectedCurrencySymbol,
	_OpenTableName,
} from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import currencies from 'constants/currencies.json';
import { useTranslation } from 'react-i18next';
import DocumentsService from 'services/DocumentsService';

import './RightDialog.scss';

const styles = (theme) => ({
	resizable: {
		position: 'relative',
		height: '100vh',
		// backgroundColor: 'red',

		'& .react-resizable-handle': {
			//this is the icon styling for resize
			position: 'absolute',
			width: 35,
			height: 20,
			top: '50%',
			right: -17,
			opacity: 0,
			padding: '0 3px 3px 0',
			'box-sizing': 'border-box',
			cursor: 'col-resize',
		},
	},
});

function RightDialog(props) {
	const {
		selectedEntityData,
		toggle,
		table_name,
		middle_modal_width,
		padding,
		specialWidthForModal,
		updateRowData,
		patchTitle,
		canEdit,
		isAdmin,
		closeRightDialog
	} = props;
	const titleKey = entityTitleField[table_name];
	const [updateEntity, setUpdateEntity] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [extraDataForTabs, setExtraDataForTabs] = useState([]);
	const originalRowData = selectedEntityData?.original;
	const [rowData, setRowData] = useState(originalRowData);
	const [pricesListForContract, setPricesList] = useRecoilState(
		_pricesListForContract,
	);
	const [file, setFile] = useState({});
	const [contactPeopleOfContract, setContactPeopleOfContract] = useRecoilState(
		_contactPeopleOfContract,
	);
	const [openTableName, setOpenTableName] = useRecoilState(_OpenTableName);

	const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useRecoilState(
		_selectedCurrencySymbol,
	);
	const { t } = useTranslation();
	const [dialogWidth, setDialogWidth] = useState(
		parseInt(localStorage.getItem('RightDialogWidth')) || 600,
	);
	const toggleUpdateEntityModal = () => {
			setUpdateEntity((state) => !state);
	};
	const deleteRowAction = async ({ id, table_name }) => {
		if (id && table_name) {
			const result = await TableDataService.updateEntity({
				data: { is_active: 0 },
				table_name: table_name,
				id: originalRowData.id,
			});
			return result;
		}
		return null;
	};
	const getFileDetails = async (tableName ,entityId) => {
		const doc = await DocumentsService.getDocumentByEntityName(tableName ,entityId);
		if (!!doc) {
			setFile(doc);
		}
	};
	// useEffect(() => {
	// 	getFileDetails(selectedEntityData?.original?.id);

	// 	return () => {
	// 		setFile({});
	// 	};
	// }, []);
	const checkDeletePossible = async () => {
		switch (table_name) {
			case 'price_list':
				if (selectedEntityData?.original?.id) {
					let res = await TableDataService.getContractsDataForPriceList(
						selectedEntityData?.original?.id,
					);
					if (res.length > 0) {
						alert(t('right_dialog.price_list.alerts.cant_delete'));
						return false;
					} else {
						return true;
					}
				}
				//if rowData has contracts - cant delete
				break;

			default:
				return true;
				break;
		}
	};
	const deleteRow = async () => {
		setDeleteLoading(true);
		let canDelete = await checkDeletePossible();
		if (canDelete) {
			deleteRowAction({ table_name, id: originalRowData?.id }).then(() => {
				setDeleteLoading(false);
			});
			location.reload();
		} else {
			setDeleteLoading(false);
		}
	};

	const goBack = () => {
		toggle();
	};
	useEffect(() => {
		switch (table_name) {
			case 'price_list':
				//set selectedCurrencySymbol to selected currency symbol from price list
				let symbol = currencies[selectedEntityData?.original?.currency]?.symbol;
				setSelectedCurrencySymbol(symbol ?? '');
				//get price_extra details for selected price list
				let newRowData = {};
				TableDataService.getTableData({
					LIMIT: 200,
					page: 0,
					table_name: 'price_extra',
				})
					.then((res) => {
						if (!!res) {
							if (
								Array.isArray(res?.rows) &&
								selectedEntityData?.original !== undefined
							) {
								let extraPriceList = res?.rows?.filter(
									(item) =>
										parseInt(item.price_list_id) ===
										parseInt(selectedEntityData?.original?.id),
								);
								newRowData = selectedEntityData?.original;
								newRowData['_lines'] = extraPriceList.filter(
									(x) => x.items_or_extra === 'item',
								);
								newRowData['extras'] = extraPriceList.filter(
									(x) => x.items_or_extra === 'extra',
								);
								setRowData(newRowData);
							}
						}
					})
					.catch((error) =>
						console.error('error get price_extra table', error),
					);
				break;
			case 'vehicles':
					getFileDetails("vehicles",selectedEntityData?.original?.id);
					//get vehicles_extra details  
					let newRowDataVehicles={};
						TableDataService.getTableData({
							LIMIT: 200,
							page: 0,
							table_name: 'vehicles_extra',
						})
							.then((res) => {
								if (!!res) {
									if (
										Array.isArray(res?.rows) &&
										selectedEntityData?.original !== undefined
									) {
										let extraVehicles = res?.rows?.filter(
											(item) =>
												parseInt(item.vehicle_id) ===
												parseInt(selectedEntityData?.original?.id),
										);
										newRowDataVehicles = selectedEntityData?.original;
										newRowDataVehicles['_extraVehicles'] = extraVehicles;
										setRowData(newRowDataVehicles);
									}
								}
							})
							.catch((error) => console.error('error get price_extra table', error));
						break;
			case 'contracts':
				if (
					!!pricesListForContract &&
					selectedEntityData?.original !== undefined
				) {
					let extraContactData = contactPeopleOfContract?.filter(
						(item) =>
							parseInt(item.contract_id) ===
							parseInt(selectedEntityData?.original?.id),
					);
					let extraPriceListData = pricesListForContract?.filter(
						(item) =>
							parseInt(item.contract_id) ===
							parseInt(selectedEntityData?.original?.id),
					);
					selectedEntityData.original.items = [...extraPriceListData]; //for update
					setRowData({
						...selectedEntityData.original,
						pricesList: extraPriceListData,
						contact: extraContactData,
					}); //data for tabs
				}
				break;
				case 'chaperones':
					getFileDetails("chaperones",originalRowData?.id);
					break;

			case 'drivers':
				getFileDetails("drivers",originalRowData?.id);
				TableDataService.getTableData({
					LIMIT: 200,
					page: 0,
					sortBy: 'menu_key',
					//searchFilter:detailsObject.car_id,
					table_name: 'driver_contacts',
				})
					.then((res) => {
						if (!!res) {
							if (Array.isArray(res?.rows)) {
								const dataForDriver = res?.rows.filter(
									(driver) => driver.driver_id === originalRowData.id,
								);
								setExtraDataForTabs(dataForDriver);
							}
						}
					})
					.catch((error) =>
						console.error('error get drivers extra table', error),
					);
			case 'contracts':
				if (
					!!pricesListForContract &&
					selectedEntityData?.original !== undefined
				) {
					let extraContactData = contactPeopleOfContract?.filter(
						(item) =>
							parseInt(item.contract_id) ===
							parseInt(selectedEntityData?.original?.id),
					);
					let extraPriceListData = pricesListForContract?.filter(
						(item) =>
							parseInt(item.contract_id) ===
							parseInt(selectedEntityData?.original?.id),
					);
					selectedEntityData.original.items = [...extraPriceListData]; //for update
					setRowData({
						...selectedEntityData.original,
						pricesList: extraPriceListData,
						contact: extraContactData,
					}); //data for tabs
				}
				break;
			default:
				return setRowData(originalRowData);
		}
	}, [originalRowData,props.isOpen]);

	const handleResizeModal = (event, { element, size, handle }) => {
		var intFrameWidth = self.innerWidth;

		if (size.width > intFrameWidth) {
			setDialogWidth(intFrameWidth);
			localStorage.setItem('RightDialogWidth', intFrameWidth);
		} else if (size.width < 250) {
			setDialogWidth(250);
			localStorage.setItem('RightDialogWidth', 250);
		} else {
			setDialogWidth(size.width);
			localStorage.setItem('RightDialogWidth', size.width);
		}
	};

	return useObserver(() => (
		<div id='dialog-wrapper'>
			{/* THIS IS TEMPORARY LIKE THE REST OF THE LOADINGS */}
			{deleteLoading && <Spinner />}
			<UpdateEntityForm
				isOpen={updateEntity}
				toggle={toggleUpdateEntityModal}
				table_name={table_name}
				initialValues={selectedEntityData?.original || {}}
				middle_modal_width={middle_modal_width}
				rowData={rowData}
				setRowData={setRowData}
				updateRowData={updateRowData}
				isAdmin={isAdmin}

			/>
			<Modal
				isOpen={props.isOpen}
				contentLabel='Minimal Modal Example'
				className={`right-dialog-modal`}
				overlayClassName='right-dialog-overly'
				ariaHideApp={false}
			>
				<ResizableBox
					height={'100vh'}
					width={dialogWidth}
					className={props.classes.resizable}
					onResize={handleResizeModal}
				>
					<div className='main-wrapper'>
						<div className='resize-icon-container'>
							<MenuIcon className='resize-icon' />
						</div>
						<div
							className='content-container'
							style={{ maxWidth: dialogWidth }}
						>
							<div className='header-row'>
								{props.goBack ? (
									<ArrowBackSharpIcon
										sx={{ cursor: 'pointer' }}
										onClick={goBack}
									/>
								) : (
									<img
										src={closeDialog}
										className='dialog-close'
										alt=''
										onClick={closeRightDialog}
									/>
								)}
							</div>
							<div className='title-row'>
								<p style={{ display: 'flex' }}>
									{props.patchTitle	&& <span>	<props.patchTitle /></span>}
									{selectedEntityData?.values?.[titleKey]}
								</p>
								{canEdit?
								<div className='action-icons'>
									<EditOutlinedIcon
										className='action-icon'
										onClick={toggleUpdateEntityModal}
									/>
									<ContentCopyOutlinedIcon className='action-icon' />
									<DeleteOutlineOutlinedIcon
										onClick={deleteRow}
										sx={{
											height: 23,
											width: 23,
											color: 'rgba(0,0,0,0.6)',
											cursor: 'pointer',
										}}
									/>
								</div>
								:
								<div className='action-icons'>
								<EditOutlinedIcon color='disabled'/>
								<ContentCopyOutlinedIcon color='disabled' />
								<DeleteOutlineOutlinedIcon color='disabled'/>
							</div>

                             }
							</div>

							<div className='entity-details'>
								<EntityDetailsSection
									detailsObject={rowData}
									//detailsObject={selectedEntityData?.original}
									table_name={table_name}
								/>
								<EntityTabs
									{...{ table_name }}
									detailsObject={rowData}
									middle_modal_width={middle_modal_width}
									rowData={rowData || {}}
									setRowData={setRowData}
									padding={padding}
									specialWidthForModal={specialWidthForModal}
									extraDataForTabs={extraDataForTabs}
									setExtraDataForTabs={setExtraDataForTabs}
									file={file}
								/>
							</div>
						</div>
					</div>
				</ResizableBox>
			</Modal>
		</div>
	));
}

export default withStyles(styles)(RightDialog);
