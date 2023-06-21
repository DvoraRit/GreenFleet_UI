import React, { useState, useEffect, useCallback } from 'react';
import { chosenHeaderModal, _recentlyAssignedOrders, _openFilerByCarSize,
	 _isHeaderSelectReqModal,
	 _inputValueFromSearchOrdersReqModal } from 'recoil/atoms';
import { useRecoilState,  } from 'recoil';
import RequirementName from './RequirementName';
import errIcon from '../../../assets/icons/Alert.svg';
import { useStores } from 'stores/index';
import { toJS } from 'mobx';
import ReactTooltip from 'react-tooltip';


function RequirementRow({ data, 
	setselectedRows, selectedRows, 
	selectedFromKeybord, setI,index,
	newWidth, 
	mannedOrder= false }) {
	// eslint-disable-next-line
	const [ordersinputValueFromSearch, setOrdersInputValueFromSearch] = useRecoilState(_inputValueFromSearchOrdersReqModal);
	const [showHeader, setshowHeader] = useRecoilState(chosenHeaderModal);
	const [selectedRow, setselectedRow] = useState(false);
	const [color, setColor] = useState();
	const [startTimeWidth, setStartTimeWidth] = useState(70);
	const [endTimeWidth, setEndTimeWidth] = useState(70);
	const [fromWidth, setFromWidth] = useState(100);
	const [toWidth, setToWidth] = useState(100);
	const [customerNameWidth, setCustomerNameWidth] = useState(108);
	const [numOfPassengersWidth, setNumOfPassengersWidth] = useState(104);
	const [commensWidth, setCommensWidth] = useState(25);
	const { resourceBankStore } = useStores();
	const [openFilerByCarSize, setOpenFilerByCarSize] = useRecoilState(_openFilerByCarSize);
	//const [mannedOrders,setMannedOrders]=useRecoilState(_mannedOrders);
	const [recentlyAssignedOrders,setRecentlyAssignedOrders]=useRecoilState(_recentlyAssignedOrders);
	const [isHeaderSelectReqModal, setIsHeaderSelectReqModal] = useRecoilState(_isHeaderSelectReqModal);
	const [columsWidth, setCulumsWidth] = useState({startTime:70, endTime:70, from:100, to:100,numOfPassengers:104, customerName:108, commens:25 })
	
	
	const handleClick = (e) => {
		let rows=[];
		if (recentlyAssignedOrders.newTrips.length > 0){//reset selected rows after assing orders
			rows = []
			rows.push(data)
			setRecentlyAssignedOrders({resource_bank_id:0, newTrips:[]})
		}
		if (e.ctrlKey){//if cntrl - add to selected
			rows = [...selectedRows];
			rows.push(data);
		}
		else{//reset selected to data
			if(selectedRow && selectedRows.length===1)//remove from selectedRows
			{
				let rest = selectedRows.filter((x) => x.id !== data.id)
				rows=rest;
			}else{
				rows = [];
				rows.push(data);
			}
		}
		setselectedRows(rows);
	};

	function onDragStart(event) {
		setI(-1)
		event.dataTransfer.setData('text/plain', event.target.id);
		event.dataTransfer.dropEffect = 'move';
	}

	useEffect(() => {
		if(data?.color){
			setColor(data?.color)
		}
		else{
			let type = toJS(resourceBankStore.types.find(x=>x.id===data.type_id));
			if(type!==-1){
				setColor(type?.color)
			}

		}
		let selectedIds = selectedRows?.map(x=>x.id);
		setselectedRow(selectedFromKeybord ? selectedFromKeybord : selectedIds.includes(data.id));
		//setselectedRow(selectedFromKeybord)
		// eslint-disable-next-line
	}, []);

	useEffect(()=>{
		setselectedRow(selectedFromKeybord)
	},[selectedFromKeybord])

	useEffect(()=>{
	if(newWidth){
		switch(newWidth?.column){
			case 'startTime':
					setStartTimeWidth(newWidth.width);
				break
			case'endTime':
				setEndTimeWidth(newWidth.width);
				break;
			case'from':
					setFromWidth(newWidth.width);
				break;
			case'to':
					setToWidth(newWidth.width);
				break;
			case'numOfPassengers':
					setNumOfPassengersWidth(newWidth.width);
				break;
			case'customerName':
				setCustomerNameWidth(newWidth.width);
				break;
			case'commens':
				setCommensWidth(newWidth.width);
				break;
			default:return
		}
	}
		
		
	},[newWidth] )

	useEffect(() => {
		let selectedIds = selectedRows?.map(x=>x.id);
		let selected = selectedIds.includes(data.id)
		setselectedRow(selectedFromKeybord ? selectedFromKeybord : selectedIds.includes(data.id));
		if(selected && selectedRows.length===1)
		{
			setI(index)
		}
	}, [selectedRows])

	function getHighlightedText(text) {
		// Split on highlight term and include term into parts, ignore case
		if (ordersinputValueFromSearch && text) {
			let highlight = ordersinputValueFromSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
			highlight = highlight.replace(/[\\$&]/g, '');
			return (
				<span>
					{' '}
					{parts.map((part, i) => (
						<span
							key={i}
							style={
								part.toLowerCase() === highlight.toLowerCase()
									? { fontWeight: 'bold' }
									: {}
							}
						>
							{part}
						</span>
					))}{' '}
				</span>
			);
		} else {
			return text;
		}
	}
	

	return (
		<div
			className={`row-container-modal-${selectedFromKeybord || selectedRow}`}
			onClick={(e)=>handleClick(e)}
			draggable={!mannedOrder && selectedRow}//if this order is manned, cant be dragged again
			onDragStart={(e) => onDragStart(e)}
			id={`draggable${data.id}`}
		>
			{showHeader.nameOfTrip && data && (
				<RequirementName data={data} selectedRow={selectedFromKeybord || selectedRow} color={color}  newWidth={newWidth}/>
			)}
			{showHeader.startTime && data && (
				<div className='row-nextTub' style={{ width: startTimeWidth }} draggable={false}>
					{data.start && data.start.slice(11, 16)}
				</div>
			)}
			{showHeader.endTime && data && (
				<div className='row-nextTub' style={{ width: endTimeWidth }} draggable={false}>
					{data.end && data.end.slice(11, 16)}
				</div>
			)}
			{showHeader.from && data && (
				<div className='row-nextTub' style={{ width: fromWidth}} draggable={false} >
					{getHighlightedText(data.from)}
				</div>
			)}
			{showHeader.to && data && (
				<div className='row-nextTub' style={{ width: toWidth }} draggable={false}>
					{getHighlightedText(data.to)}
				</div>
			)}
			{showHeader.numOfPassengers && data && (
				<div className='row-nextTub' style={{width: numOfPassengersWidth }} draggable={false}>
					{data.passengers && data.passengers}
				</div>
			)}

			{showHeader.customerName && data && (
				<div className='row-nextTub' style={{ width: customerNameWidth }} draggable={false}>
					{getHighlightedText(data.customer_name)}
				</div>
			)}

			{showHeader.commens && data && (
				<div className='row-nextTub' style={{ width:commensWidth }} >
					{data.comment && (
						<img src={errIcon} className='errIcon' alt='errIcon' data-tip data-for={`comment-orderid=${data.id}`}  draggable={false}/>
					)}
				</div>
			)}

			<ReactTooltip 
                        id={`comment-orderid=${data.id}`} 
                        place="left" 
                        effect="float" 
                        >
                            <div>{data.comment} </div>      
                                
                        </ReactTooltip>
		</div>
	);
}

export default RequirementRow;
