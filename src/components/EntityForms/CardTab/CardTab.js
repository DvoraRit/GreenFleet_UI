import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import RightDialog from 'components/RightDialog/RightDialog';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import TableDataService from 'services/TableDataService';
import UpdateEntityTabs from 'components/EntityForms/UpdateEntityForm/UpdateTabsModal/UpdateEntityTabModal';
import './CardTab.scss';

const CardTab = ({
	item,
	dataForTabs,
	key,
	details,
	isNumbered = false,
	functionOnClick,
	canEditAndDelete,
	table_name,
	nameOfTab,
	
}) => {
	const { t } = useTranslation();
	const [rightDialog, setRightDialog] = React.useState(false);
	const [itemDetails, setItemDetails] = React.useState({ ...item });
	const [updateEntityTabsModal, setUpdateEntityTabsModal] =React.useState(false);


	const toggleRightDialog = () => {
		setItemDetails({
			original: { ...details },
			values: { contact_name: item.title },
		});
		setRightDialog((state) => !state);
	};
	const checkDetails = () => {
		setRightDialog(false);

	}
	const handleOpenEditModal = () => {
		setUpdateEntityTabsModal((state) => !state);
		setRightDialog(false);
	};
	const deleteRowAction = async () => {
		if (dataForTabs?.id && table_name) {
			let id=dataForTabs?.id;
			const result = await TableDataService.deleteEntity({
				table_name,
				id,
			});
			return result;
		}
		return null;
	};
	return (
		<>
			<div
				className={
					canEditAndDelete ? 'card-tab-wrapper-actions-btn' : 'card-tab-wrapper'
				}
				onClick={canEditAndDelete ? checkDetails : toggleRightDialog}
			>
				{canEditAndDelete && (
					<div className='action-icons'>
						<EditOutlinedIcon
							className='action-icon'
							sx={{
								height: 23,
								width: 23,
								// color: 'rgba(0,0,0,0.6)',
								cursor: 'pointer',
							}}
							onClick={() => setUpdateEntityTabsModal(!updateEntityTabsModal)}
						/>
						<DeleteOutlineOutlinedIcon
							onClick={() => deleteRowAction()}
							sx={{
								height: 23,
								width: 23,
								// color: 'rgba(0,0,0,0.6)',
								cursor: 'pointer',
							}}
						/>
					</div>
				)}
				<div className='card-tab-wrapper-info'>
					{isNumbered && <div className='card_info_number'>{item.number}</div>}
					<div className='card_info'>
						<div className='card_info_title'>{item.title} </div>
						<div className='card_info_subTitles'>
							{item.subTitle.map((sub) => {

								return (
									<>
										<div className='card_info_subTitle'>
											{!sub.showOnlyValue&&<span>{t(`CardTabEntity.${sub.key}`)}</span>}
											<span> {sub.valueTranslation?t(`CardTabEntity.${sub.value}`):sub.value}{' '}</span>
										</div>
										<div className='dot'></div>
									</>
								);
							})}
						</div>
					</div>
				</div>
			</div>

			{rightDialog &&
			<RightDialog
				isOpen={rightDialog}
				toggle={() => {
					toggleRightDialog();
				}}
				selectedEntityData={itemDetails}
				table_name={'contacts'}
				goBack={true}
				//patchTitle={patchTitle}
				middle_modal_width={'60vw'}
				// padding={padding}
				//specialWidthForModal={specialWidthForModal}
			/>}
			{updateEntityTabsModal && (
				<UpdateEntityTabs
					isOpen={updateEntityTabsModal}
					toggle={handleOpenEditModal}
					initialValues={dataForTabs || {}}
					table_name={table_name}
					tab_name={nameOfTab}
					extraDataForTabs={itemDetails}
					padding={12}
				/>
			)}
		</>
	);
};

export default CardTab;
