import React, { useEffect, useState } from 'react';
import Arrow from '../../assets/icons/reqArrow.png';
import './reqModal.scss';
import files from '../../assets/icons/file_copy.svg';
import Text from 'constants/textConstans';
import { useStores } from 'stores/index';
import { _mannedOrders, _recentlyAssignedOrders, 
	_openFilerByCarSize, _isHeaderSelectReqModal, 
	_cancelAssignedOrders, _resourceBankStoreRender,
	_numOfResultsOfRequirementsModal
} from 'recoil/atoms';
import { useRecoilState } from 'recoil';

function RequirementsHeader({ setopenReq }) {
	const { resourceBankStore } = useStores();
	const [reqCounter, setreqCounter] = useState(resourceBankStore.openOrders.length);
	const [mannedOrders,setMannedOrders]=useRecoilState(_mannedOrders);
	const [recentlyAssignedOrders,setRecentlyAssignedOrders]=useRecoilState(_recentlyAssignedOrders);
	const [openFilerByCarSize, setOpenFilerByCarSize] = useRecoilState(_openFilerByCarSize);
	const [isHeaderSelectReqModal, setIsHeaderSelectReqModal] = useRecoilState(_isHeaderSelectReqModal);
	const [cancelAssignedOrders, setcancelAssignedOrders] = useRecoilState(_cancelAssignedOrders);
	const [numOfResultsOfRequirementsModal, setNumOfResultsOfRequirementsModal] = useRecoilState(_numOfResultsOfRequirementsModal);
	const [resourceBankStoreRender, setResourceBankStoreRender] = useRecoilState(
		_resourceBankStoreRender,
	);

	const closeOpenModals = () =>{
		setIsHeaderSelectReqModal(false);
		setOpenFilerByCarSize(false);
	
	}


		const closeModal = () => {
			setopenReq(false)
			setMannedOrders([])
			setRecentlyAssignedOrders({resource_bank_id:0, newTrips:[]})
			setcancelAssignedOrders({resource_bank_id: 0,newTrips: [] });
			
			if(mannedOrders?.length > 0){
				setResourceBankStoreRender((state) => state + 1);
			}

		}
	useEffect(() => {
		let timer = setTimeout(()=>{
			setreqCounter(
				resourceBankStore.openOrders.length
			);
		},1000)
		return () => {
			clearTimeout(timer);
		  }; 
	}, [mannedOrders.length, resourceBankStore.openOrders.length]);

	useEffect(() => {

	}, [numOfResultsOfRequirementsModal])
	
	return (
		<>
			<div className='modal-wrapper' onClick={()=>closeOpenModals()}>
				<span>
					<img src={files} alt='' className='file-copy-icon' style={{top:reqCounter > 0? 9:0}}/>
					{
						reqCounter > 0 &&
						<div className='red-circle-modal'>
							<div className='num-of-orders-text-modal'>{reqCounter}</div>
						</div>
					}
				</span>
				<div className='text-wrapper'>
					<div className='text-title'>{Text.requirements}</div>
					{
						numOfResultsOfRequirementsModal > -1 ?
						<div className='text-subtitle'>
							{`נמצאו ${numOfResultsOfRequirementsModal} מתוך ${reqCounter} דרישות`}
						</div>
						:
						<div className='text-subtitle'>
							{Text.total} {reqCounter} {Text.staffing_requirements}
						</div>
					}
				</div>
				<img
					src={Arrow}
					alt=''
					className='arrow-icon'
					onClick={() => closeModal()}
				/>
			</div>
		</>
	);
}

export default RequirementsHeader;
