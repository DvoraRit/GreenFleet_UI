import React, {useState} from 'react';
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from 'react-i18next';
import {_carSizeSelected} from '../../../recoil/atoms'
import {useRecoilState} from 'recoil';
function CarSizeSelect({icon, name}) {

    const { t } = useTranslation();
    const [mouseEnter, setmouseEnter] = useState(false);
    const [carSizeSelected, setCarSizeSelected] = useRecoilState(_carSizeSelected);
    const handleClick = () => {
        localStorage.setItem('carSizeSelectedInModal',name);
        if(name === "clear_all"){
            setCarSizeSelected("")
        }else{
            setCarSizeSelected(name)
        }
    }
  return <div className='row-wrapper-filter-car-type'
    target={mouseEnter.toString()}
    onMouseEnter={() => setmouseEnter(true)}
    onMouseLeave={() => setmouseEnter(false)}
    onClick={() => handleClick()}>
       <img src={icon} alt = {`${icon}`} className='car-icon-style-filter-car'/>
       <div className='text-car-size-filter'>{t(`car_size.${name}`)}</div>
      {
          (carSizeSelected === name || localStorage.getItem('carSizeSelectedInModal') ===name) &&
          <CheckIcon
           //color="primary"
           style={{ height: "14px", width: "14px", alignSelf: "flex-end",  color:"#2EC4B6" }}
       />
      } 
 </div>
}

export default CarSizeSelect;
