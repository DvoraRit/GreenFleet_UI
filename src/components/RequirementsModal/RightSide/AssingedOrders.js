import React, {useState, useEffect} from 'react';
import './AssingedOrders.scss'
import arrow_full_black from'../../../assets/icons/arrow_full_black.svg'
import {_mannedOrders,} from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import RequirementRow from './RequirementRow';

function AssingedOrders({setselectedRows,selectedRows, setScrollHeight, setI, selectedFromKeybord}) {
    const [open, setOpen] = useState(false);
    const [mannedOrders,setMannedOrders]=useRecoilState(_mannedOrders);
    const [height, setHeight] = useState(52)

    const hendleClickArrow = () =>{
        let isOpen = open
        setOpen(!open)
        isOpen = !isOpen
        if(isOpen){
            setHeight(52+(42*mannedOrders.length));
            setScrollHeight(window.innerHeight-350-(mannedOrders.length*42))
        }
        else{
            setHeight(52)
            setScrollHeight(window.innerHeight-350)
        }
    }
useEffect(()=>{
    if(open){
        setHeight(52+(50*mannedOrders.length));
        setScrollHeight(window.innerHeight-340-(mannedOrders.length*55))
    }
    else{
        setHeight(52)
        setScrollHeight(window.innerHeight-340)
       
    }
},[mannedOrders])
  return (

  <div className='assinged-orders-style' style={{height:height}}>
      <div className='top-line'></div>
      <div className='title-recently-assinged-orders-wrapper' style={{height:52}}>
          <img src={arrow_full_black} className='arrow-black-icon' style={{transform:open ? "rotate(180deg)" : "none" }} 
            onClick={()=>hendleClickArrow()} alt="arrow_full_black"/>
          <div className='title-recently-assinged-orders-text'>דרישות שאוישו לאחרונה</div>
      </div>
      
      {
        open &&
      <div style={{height:42*mannedOrders.length}}>
      {mannedOrders?.map((row) => (
                            <RequirementRow
                                data={row}
                                key={row.id}
                                setselectedRows={setselectedRows}
                                selectedRows={selectedRows}
                                mannedOrder = {true}
                                setI={setI}
                                selectedFromKeybord={false}
                            />
                        ))}
        </div>
      }
    </div>
  )
}

export default AssingedOrders;
