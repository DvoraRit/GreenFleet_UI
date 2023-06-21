import React, { useState, useEffect, useCallback } from 'react';
import addHeaderIcon from '../../../assets/icons/add_circle_notActive.svg';
import activeAddHeader from '../../../assets/icons/add_circle.svg';
import {
	chosenHeaderModal,
	_draggedTrip,
	_mannedOrders,
	_recentlyAssignedOrders,
    _cancelAssignedOrders,
    _openFilerByCarSize,
    _isHeaderSelectReqModal,
    _resourceBankStoreRender
} from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import Text from '../../../constants/textConstans';
import HeaderTablePicker from '../../../containers/Planning/PlanningBody/Tasks/HeaderTablePicker/HeaderTablePicker';
import RequirementRow from './RequirementRow';
import { useStores } from 'stores/index';
import close from '../../../assets/icons/close-tab.png';
import './RightSide.scss';
import { toJS } from 'mobx';
import ResourceBankService from '../../../services/ResourceBankService'
import SearchOrdersInModal from './SearchOrdersInModal';
import AssingedOrders from './AssingedOrders';
import ConnectOrders from '../../ConnectOrders/ConnectOrders'
import ConvertTripToOrder from '../../../handler/ConverTripToOrder'
import { ResizableBox } from 'react-resizable';
import Loading from '../../../components/Loading/Loading';

function RightSideModal({setselectedRows, selectedRows, setwidthOfRightSide ,openReq}) {
    const { resourceBankStore } = useStores();
    const [isHeaderSelectReqModal, setIsHeaderSelectReqModal] = useRecoilState(_isHeaderSelectReqModal);

    const [searchValues, setSearchValues] = useState(false);
    const [draggedTrip, setDraggedTrip] = useRecoilState(_draggedTrip);
    const [mannedOrders,setMannedOrders]=useRecoilState(_mannedOrders);
    // eslint-disable-next-line
    const [showHeader, setshowHeader] = useRecoilState(chosenHeaderModal);
	const [cancelAssignedOrders, setcancelAssignedOrders] = useRecoilState(_cancelAssignedOrders);
    const [orders, setOrders] = useState(toJS(resourceBankStore.openOrders))
    const [ordersToShow, setOrdersToShow] = useState([])
    const [totalRight, settotalRight] = useState(0)
    const [i, setI] = useState(-1);
    const [countersOfCommenOrders, setCountersOfCommenOrders] = useState({});
    const [recentlyAssignedOrders,setRecentlyAssignedOrders]=useRecoilState(_recentlyAssignedOrders);
    const [resourceBankStoreRender, setResourceBankStoreRender] = useRecoilState(_resourceBankStoreRender);
    const [height, setScrollHeight] = useState(window.innerHeight-280)
    const [loading, setLoading] = useState(false);
    const [width, setWidth] = useState({column:"", width:0});
    const [positionSelectHeaders, setPositionSelectHeaders] = useState(0);
	const [openFilerByCarSize, setOpenFilerByCarSize] = useRecoilState(_openFilerByCarSize);
    const [columns, setColumns] = useState([
        {
            field_name: 'nameOfTrip',
            width: 151,
            maxWidth:300,
            show: showHeader['nameOfTrip'],
            order: 1,
        },
        {
            field_name: 'startTime',
            width: 70,
            maxWidth:150,
            show: showHeader['startTime'],
            order: 2,
        },
        {
            field_name: 'endTime',
            width: 70,
            maxWidth:150,
            show: showHeader['endTime'],
            order: 3,
        },
        {
            field_name: 'from',
            width: 100,
            maxWidth:200,
            show: showHeader['from'],
            order: 4,
        },
        {
            field_name: 'to',
            width: 100,
            maxWidth:200,
            show: showHeader['to'],
            order: 5,
        },
        {
            field_name: 'numOfPassengers',
            width: 104,
            maxWidth:200,
            show: showHeader['numOfPassengers'],
            order: 6,
        },
        {
            field_name: 'customerName',
            width: 108,
            maxWidth:200,
            show: showHeader['customerName'],
            order: 7,
        },
        {
            field_name: 'commens',
            width: 25,
            maxWidth:40,
            show: showHeader['commens'],
            order: 8,
        },
    ]);

    document.onkeydown = checkKey;
    function checkKey (e){
        if(selectedRows.length <2){
            e = e || window.event;
            if (e.keyCode == '38') {
                if(i===0){
                    setI(ordersToShow.length-1)
                }
                else{
                    setI(i-1)
                }
            }
            else if (e.keyCode == '40') {
                if(i!==ordersToShow.length-1){
                    setI(i+1)
                }
                else{
                    setI(0)  
                }
            }
        }
       
    }

    const closeModals = () =>{
        setOpenFilerByCarSize(false);
        setIsHeaderSelectReqModal(false);
    }
    useEffect(()=>{
        if(i>=0){   
           // resourceBankStore.getFirstStationForOrder(ordersToShow[i]?.id)
            let selected = []
            selected.push(toJS(ordersToShow[i]))
            setselectedRows(selected)
        }
    },[i])

    const handleHeaderSelect = (e) => {
        setPositionSelectHeaders(e.clientX);
        setIsHeaderSelectReqModal(!isHeaderSelectReqModal);
        setOpenFilerByCarSize(false)
    };
    

	function onDragOver(event) {
		event.preventDefault();
        event.stopPropagation();
	}

    function onDrop(event) {
        if(draggedTrip){
            let convertToOrder = ConvertTripToOrder(draggedTrip)
            let body = {
                order_id:convertToOrder?.id
            }
            resourceBankStore.removeOrderFromPlanning(body).then((res)=>{
                setcancelAssignedOrders({ resource_bank_id: draggedTrip.dragged_resource_bank_id,newTrips: [draggedTrip] });
                setDraggedTrip(false)
            })
            event.dataTransfer.clearData();
            //remove from mannedOrders
            let indexToRemove = mannedOrders.findIndex(x=>x.id===convertToOrder.id)
            setMannedOrders(mannedOrders.slice(0,indexToRemove).concat(mannedOrders.slice(indexToRemove+1)))
            setselectedRows([])
        }
        else{
            event.dataTransfer.clearData();
        }
    }

    useEffect(()=>{     
            let newArray = [...orders];
			recentlyAssignedOrders?.newTrips?.forEach((element) => {
				let indexToRemove = newArray.findIndex(
					(x) => x.id === element.order_id,
				);
                if(indexToRemove>-1){
                    newArray = newArray
                        .slice(0, indexToRemove)
                        .concat(newArray.slice(indexToRemove + 1));
                }
			});
            if(newArray?.length > -1){
                setOrdersToShow(newArray);
                setOrders(newArray)
                resourceBankStore.setOpenOrders(newArray)
            }
    },[recentlyAssignedOrders])

    useEffect(()=>{     
        let newOrders = [...orders];
        cancelAssignedOrders?.newTrips?.forEach(item=>{
            let convertToOrder = ConvertTripToOrder(item)
            let body = {
                order_id:convertToOrder?.id
            }
            resourceBankStore.removeOrderFromPlanning(body).then((res)=>{
              
            })
           newOrders.push(convertToOrder);
        })
        if(newOrders?.length > -1){
            setOrdersToShow(newOrders)
            setOrders(newOrders)
           resourceBankStore.setOpenOrders(newOrders)
        }
        setselectedRows([])
    },[cancelAssignedOrders])

	useEffect(() => {
		let totalW = 0;
		let all_columns = columns;
		let selected_columns = Object.keys(showHeader).filter((x) => showHeader[x]);
		selected_columns?.forEach((item) => {
			let width_int = all_columns.find((c) => c.field_name === item).width;
			totalW = totalW + width_int;
		});

        //set show filed for each column 
        all_columns.forEach((c) => {
            c.show = selected_columns.includes(c.field_name);
        });
        setColumns(all_columns);
		settotalRight(totalW);
        if(totalW < 170){
            setwidthOfRightSide(140);
            setPositionSelectHeaders(window.innerWidth-140-120);

        }
        else{
            setwidthOfRightSide(totalW);
            setPositionSelectHeaders(window.innerWidth-totalW-120);
        }
	}, [showHeader]);

    const showOrders = useCallback((_orders)=>{
        let allOrders = _orders ? _orders : orders
        if(allOrders.length > 50){
            setOrdersToShow(allOrders.slice(0,50))
        }
        else{
            setOrdersToShow(allOrders);
            return;
        }
        let timer = setTimeout(()=>{
         let i=50
         for(i ; i <= allOrders.length; i=i+50){
             setOrdersToShow(allOrders.slice(0,i))
         }
         if(i!==allOrders.length){    //add the rest of the orders  //      
             setOrdersToShow(allOrders.slice(0,allOrders.length))
         }
        },1000)
 
        return () => {
         clearTimeout(timer);
       }; 
    },[orders])


    useEffect(()=>{
        showOrders();
        countNumOfConnectedOrders();
    },[])

    const countNumOfConnectedOrders = () =>{
        let mapOfCounters = new Map()
        ordersToShow?.forEach(order=>{
            if(!mapOfCounters.has(order.common_order_number) && order.common_order_number){
                let countCommenOrders = ordersToShow.filter(x=>x.common_order_number===order.common_order_number).length;
                let key = order.common_order_number;
                let value = countCommenOrders
                mapOfCounters.set(key, value)
            }
        })

        let mapToArray = Array.from(mapOfCounters.entries())
        setCountersOfCommenOrders(mapToArray);
    }

    const topOfLink = (common_order_number)=>{
        //get common_order_number and return the index of first order with that common_order_number
        let index = ordersToShow.findIndex(x=>x.common_order_number===common_order_number)
        return index * 42 + 21
    }

    const heightOfLink = (counter) =>{
        return ((counter-1) * 42)
    }

    useEffect( async() => {
        setLoading(true);
     let _orders = await resourceBankStore.getOpenOrders();
     setOrders(toJS(resourceBankStore.openOrders));
     showOrders(_orders);
     setLoading(false)
    }, [resourceBankStoreRender])
    
    return (
			<div className='right-side-wrapper'
           >
				<SearchOrdersInModal orders={ordersToShow} setOrders={setOrdersToShow} setSearchValues={setSearchValues} allOrders={toJS(resourceBankStore.openOrders)}/>
				<div className='table-wrapper'>
					<div
                     draggable={false}
						style={{
							display: 'flex',
							flexDirection: 'row-reverse',
							justifyContent: 'flex-end',
                            
						}}
					    >
						{columns
							.filter((x) => x.show)
							.sort((a, b) => (b.order > a.order ? 1 : -1))
							.reverse()
							.map((col, index) => (
                                <ResizableBox 
                                resizeHandles={col.field_name==="commens"? ['n'] : ['w']}
                                onResize={(event,{element, size, handle})=>{
                                    closeModals();
                                    setWidth({ column:col.field_name, width:size.width});
                                    //calculate total width
                                    let totalW = 0;
                                    let selected_columns = columns.filter((x) => x.show)
                                    selected_columns?.forEach((item) => {
                                        if(item.field_name!==col.field_name){
                                            totalW = totalW +  item.width;
                                        }                                       
                                    });
                                    let allW = totalW + size.width;
                                    setwidthOfRightSide(allW);
                                }}
                                onResizeStop={(event,{element, size, handle})=>{
                                    //set width column
                                    let new_columns = [...columns]
										new_columns.forEach((item) => {
											if(item.field_name === col.field_name && !isNaN(size.width)){
												item.width = size.width
											}
										})
									setColumns(new_columns);
                                }}
                                width={col.width}
                                height={22}
                                axis={col.field_name==="commens" ? "none" : "x"}
                                key={index}
                                minConstraints={[51, 20]}
                                maxConstraints={[col.maxWidth, 20]}
                               >
                                <div 
                                className='header-text-box'
                                 >
                                    <span
                                    className='header-text'
                                   >
                                        {Text.translateHeadersModal[col.field_name]}
                                    </span>
                                </div>
                                </ResizableBox>
							))}
					</div>
                    <div>
                        <img
                            src={!isHeaderSelectReqModal ? addHeaderIcon : activeAddHeader}
                            className='add-header-icon'
                            onClick={(e) => handleHeaderSelect(e)}
                            alt=''
                        />
                    </div>
                        {isHeaderSelectReqModal && (
                            <div className='open-header-picker' style={{ left: positionSelectHeaders-312 }}>
                                <HeaderTablePicker
                                    columns={columns}
                                    componentUse='modal'
                                    //leftPosition={positionSelectHeaders-312}
                                />
                                <img
                                    src={close}
                                    onClick={handleHeaderSelect}
                                    className='close-tab'
                                    alt='close-icon'
                                />
                            </div>
				        )}
                </div>

                    <div className='all-requirmnts-wrapper' 
                    onDragOver={(e) => onDragOver(e)}
                    onDrop={(e) => onDrop(e)}
                    style={{height:height }}>
                        <div
                            id='left-scroll-bar-req'
                            className='left-scroll-bar-req'
                            >
                            {
                                countersOfCommenOrders.length > 0 && 
                                    countersOfCommenOrders?.map((counter, index)=>(
                                    
                                        counter[1] > 1 &&
                                        <ConnectOrders height={heightOfLink(counter[1])} top={topOfLink(counter[0])} right={10} key={index}/>
                                    ))
                            }
                            <div style={{flexDirection:"column"}}>
                                {
                                
                                loading ? (
                                    <Loading />
                                ) : (
                                    ordersToShow?.map((row, index) => (
                                    <RequirementRow
                                        data={toJS(row)}
                                        key={row.id}
                                        setselectedRows={setselectedRows}
                                        selectedRows={selectedRows}
                                        selectedFromKeybord={i===index &&row.id===ordersToShow[i].id}
                                        setI = {setI}
                                        index = {index}
                                        newWidth={width}
                                    />
                            )))}
                            </div>
                        </div>
                    </div>
                {
                    mannedOrders.length > 0 &&
                    <AssingedOrders 
                    setselectedRows={setselectedRows}
                    selectedRows={selectedRows}
                    setScrollHeight={setScrollHeight}
                    setI={setI}
                    selectedFromKeybord={false}/>
                }

		    </div>
    )
}


export default RightSideModal;
