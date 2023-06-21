import React, {useEffect, useState} from 'react'
import RequirementsHeader from './RequirementsHeader'
import RightSideModal from './RightSide/RightSideModal'
import LeftSideModal from './LeftSide/LeftSideModal'
import './reqModal.scss'
import Responsive from 'constants/Responsive';
import { useScreenClass } from 'react-grid-system';
import { useStores } from 'stores/index';
import {_mannedOrders,_driversPlanning} from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import { toJS } from 'mobx';

function RequirementsModal({setopenReq,openReq}) {
    const [selectedRows, setselectedRows] = useState([]);
    const [mannedOrders,setMannedOrders]=useRecoilState(_mannedOrders);
    const [widthOfRightSide, setwidthOfRightSide] = useState(0)
    const [height, setheight] = useState(window.innerHeight-204)
    const {resourceBankStore } = useStores();
    const [driversPlanning, setDriversPlanning] = useRecoilState(_driversPlanning);
    //resourceBankStore.getDriversPlanning()
    useEffect(() => {
        setheight(window.innerHeight-185)
    }, [window.innerHeight]);

    useEffect(()=>{
     
        // let dataForModal = (toJS(resourceBankStore.dataForGant))
        let dataForModal = (toJS(resourceBankStore.drivers_planning))
    
        setDriversPlanning(dataForModal);
        setMannedOrders([])
        setselectedRows([])
    },[])
    
    return (
        <div style={{   flexDirection:'column',
            height:'-webkit-fill-available'}}>
            <RequirementsHeader setopenReq = {setopenReq}/>
            <div className='right-and-left-wrapper' style={{height:`${height}px`}}>
                <div style={{textAlign: '-webkit-right'}}>
                    <LeftSideModal selectedRows={selectedRows} setselectedRows={setselectedRows} openReq={openReq}
                    mannedOrders={mannedOrders} setMannedOrders={setMannedOrders} widthOfRightSide={widthOfRightSide}
                    />
                </div>
                <div 
                    style={{justifyContent: 'flex-end', display:'flex'}}
                    >
                    <RightSideModal setselectedRows={setselectedRows} selectedRows={selectedRows} openReq={openReq}
                     mannedOrders={mannedOrders} setMannedOrders={setMannedOrders} setwidthOfRightSide={setwidthOfRightSide}/>
                </div>
            </div>
        </div>
    )
}

export default RequirementsModal;
