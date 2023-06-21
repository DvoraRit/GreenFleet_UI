import React, {useState} from 'react';
import Menu from '@mui/material/Menu';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useTranslation } from 'react-i18next';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import './OptionsPopUpState.scss';
import UpdateEntityForm from 'components/EntityForms/UpdateEntityForm/UpdateEntityForm';
import './NoResultsForDataTable.scss';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

function ColumnsPopUpState({open,...rest}) {
	const { t } = useTranslation();
	const [updateEntity, setUpdateEntity] = useState(false);
	const handleUpdate = () =>{
		setUpdateEntity((state) => !state);
	}
	
const menuForPointOfInterest = () =>{
	return (
		<>
		<div className='row-wrapper-OptionsPopUpState' onClick={handleUpdate}>
					<EditOutlinedIcon fontSize='small'/>
					<div>{t('data_table.ColumnsPopUpState.update')}</div>
				</div>
				<div className='row-wrapper-OptionsPopUpState'>
					<DeleteOutlineOutlinedIcon  fontSize='small'/>
					<div>{t('data_table.ColumnsPopUpState.delete')}</div>
				</div>
		</>	
	)
}

const other = () => {
	return (
		<>
		<div className='action-row'>
				<RemoveRedEyeIcon />
				<div className='textAddIcon'>{t(`textAddIcon.safety_drivers`)}</div>
			</div>
			<div className='action-row'>
				<CheckCircleOutlineIcon />
				<div className='textAddIcon'>{t(`textAddIcon.safety_planning`)}</div>
			</div>
		</>
		
	)
}

const getMenu = () => {
	switch (rest.cell.column?.table_name) {
		case "all_stations":
			return menuForPointOfInterest()
			break;
	
		default:
			return other();
			break;
	}
}
return (
		<>
		<Menu
			{...{ ...rest, open }}
			// className='choose-resource-window-container'
			PaperProps={{
				style: {
					display: 'flex',
					justifyContent: 'flex-end',
					width: 250,
					borderRadius: 8,
					
				},//
			}}
		>

			{
				getMenu()
			}
		</Menu>

		<UpdateEntityForm
			isOpen={updateEntity}
			toggle={handleUpdate}
			table_name={rest.cell.column?.table_name}
			initialValues={rest.row?.original || {}}
			middle_modal_width={'48vw'}
			rowData={rest.row?.original}
			setRowData={{}}
			updateRowData={{}}
			showMap = {true}
			//isAdmin={isAdmin}
		/>
		</>
	);
}

export default ColumnsPopUpState;
