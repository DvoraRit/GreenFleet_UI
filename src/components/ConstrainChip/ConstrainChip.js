import React, {useEffect,useState} from 'react';
import './ConstrainChip.scss'
import calculatWidthByTime from '../../handler/calculatWidthByTime';
import not_approved_constrain_icon from '../../assets/icons/not_approved_constrain_icon.svg'
import approved_constrain_icon from '../../assets/icons/approved_constrain_icon.svg'
import {
    _pxForMinute,tableMode, _driverTaskDialoog
} from '../../recoil/atoms';
import { useRecoilState } from 'recoil';
import ReactTooltip from 'react-tooltip';
import ConstrainToolTip from './ConstrainToolTip';
import ConstrainInfo from './ConstrainInfo'
import repeat_every_icon from '../../assets/icons/repeat_every_icon.png'
import GradientOverly from 'assets/images/gradient-overly.png';
import { useStores } from 'stores/index';
import { toJS } from 'mobx';

function ConstrainChip({constrain, setSelectedTripForDialog,styleInModal=false }) {
  const [widthCalculation, setWidthCalculation] = useState(false);
  const [right, setRight] = useState(0);
  const [pxForMinute, setPxForMinute] = useRecoilState(_pxForMinute);
	const [tableNav, setTableNav] = useRecoilState(tableMode);
  const { resourceBankStore } = useStores();
  const [driverTaskDialoog, setDriverTaskDialoog] = useRecoilState(_driverTaskDialoog);
  const _constrain = tableNav!=="ganttMode" ? constrain[0] : constrain
  
  const handleModal = (type) => {
    if (!styleInModal) {
      let dataForGant = toJS(resourceBankStore.dataForGant);
      if(_constrain.user_type==="chaperone"){
        let allDetails = dataForGant.find(x=>x.resourceData.chaperone_phone_number===_constrain.user_phone)
        setDriverTaskDialoog(!driverTaskDialoog);
          setSelectedTripForDialog({
            ...allDetails
          });

        }
        else{
          let allDetails = dataForGant.find(x=>x.resourceData.driver_phone_number===_constrain.user_phone)
          setDriverTaskDialoog(!driverTaskDialoog);
          setSelectedTripForDialog({
            ...allDetails
          });
        }
    }	
  };

  useEffect(()=>{    
    let dataStart = _constrain.time?.slice(0,-3);
    let dataEnd = _constrain.end_time?.slice(0,-3);
    let width = calculatWidthByTime(dataStart, dataEnd);
    setWidthCalculation(width * pxForMinute );
    let minutsFrom00 = calculatWidthByTime('00:00', dataStart);
    setRight(minutsFrom00 * pxForMinute);
},[pxForMinute])

  useEffect(()=>{
    let dataStart = _constrain.time?.slice(0,-3);
    let dataEnd = _constrain.end_time?.slice(0,-3);
    let width = calculatWidthByTime(dataStart, dataEnd);
    setWidthCalculation(width * pxForMinute );
    let minutsFrom00 = calculatWidthByTime('00:00', dataStart);
    setRight(minutsFrom00 * pxForMinute);
},[])

  return (

    <>
    <div className='right-line-red-constrain' 
        style={{backgroundColor:constrain.approved ? "#2EC4B6" : "rgba(255,82,82,0.6)", right:`${right-1}px`}}>
    </div>

      <div className='bg-constrain-chip'
        style={{ right:`${right}px`, width:`${widthCalculation}px`,
        backgroundImage:`url(${GradientOverly})`}}
        data-tip
        data-for={`constrainToolTip${constrain.id}`}
        onClick={()=>handleModal()}
        >
          <img src={repeat_every_icon} alt="repeat_every_icon"/>
      </div>

      <img src={constrain.approved ?approved_constrain_icon : not_approved_constrain_icon} 
      style={{position :'absolute', right:`${right-9}px`,top: "23px", 
      borderRadius: '15px' }} alt="not_approved_constrain_icon"/>

{(tableNav !== 'ganttExtraMode') && (
      <ReactTooltip
            id={`constrainToolTip${constrain.id}`}
            place='top'
            effect='solid'
            bodyMode={true}
            backgroundColor='#fff'
            border={true}
            aria-haspopup='true'
            className='tooltip-of-constrain'
            >
            <ConstrainToolTip
                data={constrain}
                type = "modal"
            />
        </ReactTooltip>)}

        {tableNav === 'ganttExtraMode' && (
								<div
									style={{
										position: 'absolute',
										top: '9px',
										width: 'fit-content',
										marginRight: `1rem`,
                    right:`${right +15}px`
									}}
								>
									<ConstrainInfo constrain={constrain} right={right+widthCalculation} />
								</div>
				)}
    </>
  )

}

export default ConstrainChip;
