// import Draggable from 'react-draggable';
import { withStyles } from '@material-ui/styles';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import closeDialog from 'assets/icons/dialogClose.png';
import UpdateEntityForm from 'components/EntityForms/UpdateEntityForm/UpdateEntityForm';
import { useObserver } from 'mobx-react';
import React, { useState,useEffect } from 'react';
import Modal from 'react-modal';
import { ResizableBox } from 'react-resizable';
import TableDataService from 'services/TableDataService';
import Spinner from 'components/Spinner/Spinner';
import EntityDetailsSection from '../components/EntityDetails';
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
// import EntityTabs from './components/EntityTabs';
import { entityTitleField } from '../config/config';
import {_pricesListForContract,_contactPeopleOfContract} from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import '../RightDialog.scss';

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

const deleteRowAction = async ({ id, table_name }) => {
	if (id && table_name) {
		const result = await TableDataService.deleteEntity({
			id,
			table_name,
		});
		return result;
	}
	return null;
};
const goBack = () => {
	toggle();
};

function RightDialogTabInformation(props) {
	const { selectedEntityData, toggle, table_name,middle_modal_width,padding,specialWidthForModal } = props;

	const titleKey = entityTitleField[table_name];
	const [updateEntity, setUpdateEntity] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [rowData,setRowData] = useState(selectedEntityData?.original);
	const [pricesListForContract, setPricesList] = useRecoilState(_pricesListForContract);
	const [contactPeopleOfContract, setContactPeopleOfContract] = useRecoilState(_contactPeopleOfContract);
	const toggleUpdateEntityModal = () => {
		setUpdateEntity((state) => !state);
	};

	const rowData1 = selectedEntityData?.original;

	const deleteRow = () => {
		setDeleteLoading(true);
		deleteRowAction({ table_name, id: rowData?.id }).then(() => {
			setDeleteLoading(false);
		});
	};

	useEffect(() => {
		switch (table_name) {
		  case 'price_list':
			  TableDataService.getTableData({
				  LIMIT:200,
				  page:0,
				  table_name:"price_extra"
			  }).then((res) => {
				  if (!!res) {
					  if (Array.isArray(res?.rows) && selectedEntityData?.original!==undefined) {
						  let extraPriceList = res?.rows.filter(item=>parseInt(item.price_list_id)===parseInt(selectedEntityData?.original?.id));
							let newRowData=selectedEntityData?.original;
							newRowData["_lines"] = extraPriceList;
							setRowData(newRowData);
					  }
				  }
			  })
			  .catch((error) => console.error('error get price_extra table', error));
			  break;
			case 'contracts':
				if (!!pricesListForContract && selectedEntityData?.original!==undefined) {
					let extraContactData = contactPeopleOfContract?.filter(item=>parseInt(item.contract_id)===parseInt(selectedEntityData?.original?.id));
					let extraPriceListData = pricesListForContract?.filter(item=>parseInt(item.contract_id)===parseInt(selectedEntityData?.original?.id));
					setRowData({pricesList:extraPriceListData, contact:extraContactData});
						
				}
		  default:
			  return;
		}
	  }, [rowData1])

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
					width={600}
					className={props.classes.resizable}
				>
					<div className='main-wrapper'>
						<div className='resize-icon-container'>
							<MenuIcon className='resize-icon' />
						</div>
						<div className='content-container'>
							<div className='header-row'>
							{props.goBack?
								<ArrowBackSharpIcon sx={{cursor:'pointer'}} onClick={goBack}/>
								:
									<img
										src={closeDialog}
										className='dialog-close'
										alt=''
										onClick={toggle}
									/>

								}
							</div>
							<div className='title-row'>
								<p style={{display: 'flex'}}>
								{props.patchTitle	&& <span>	<props.patchTitle /></span>}
									{selectedEntityData?.values?.[titleKey]}</p>
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
							</div>

							<div className='entity-details'>
								<EntityDetailsSection
									detailsObject={selectedEntityData?.original}
									table_name={table_name}
								/>
								{/* <EntityTabs
									{...{ table_name }}
									detailsObject={selectedEntityData?.original}
									middle_modal_width={middle_modal_width}
									rowData = {rowData || {}}
									padding={padding}
									specialWidthForModal={specialWidthForModal}

								/> */}
							</div>
						</div>
					</div>
				</ResizableBox>
			</Modal>
		</div>
	));
}

export default withStyles(styles)(RightDialogTabInformation);
