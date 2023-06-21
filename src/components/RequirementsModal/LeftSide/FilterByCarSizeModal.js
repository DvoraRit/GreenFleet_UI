import React, {useState} from 'react';
import './FilterByCarSizeModal.scss'
import taxiIconNoBG from '../../../assets/icons/taxiIconNoBG.svg'
import minibusIconNoBG from '../../../assets/icons/minibusIconNoBG.svg'
import busIconNoBG from '../../../assets/icons/busIconNoBG.svg'
import clear_all from '../../../assets/icons/clear_all.png'
import CarSizeSelect from './CarSizeSelect'
function FilterByCarSizeModal() {
   


  return <div className='filter-car-size-wrapper'>
      <CarSizeSelect icon ={clear_all} name="clear_all"/>
      <CarSizeSelect icon ={busIconNoBG} name="large"/>
      <CarSizeSelect icon ={minibusIconNoBG} name="medium"/>
      <CarSizeSelect icon ={taxiIconNoBG} name="small"/>
  </div>;
}

export default FilterByCarSizeModal;
