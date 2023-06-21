import React from 'react'
import './ChaperonDisplayAlert.scss'
import { useTranslation } from 'react-i18next';
import {
  _chaperonDisplayOn
} from 'recoil/atoms.js';
import { useRecoilState } from 'recoil';
function ChaperonDisplayAlert() {
  const [chaperonDisplayOn, setChaperonDisplayOn] = useRecoilState(_chaperonDisplayOn);

  const { t } = useTranslation();
  const backToDriversDisplay = () =>{
    localStorage.setItem('chaperon_display_on', false);
    setChaperonDisplayOn(false)
  }
  return (
    <div className='rectangle-alert-wrapper'>
      <div className='main-tetx-attention'>{t('SettingsPicker.attention_chperon_display')}</div>
      <div className='go-bak-text' onClick={()=>backToDriversDisplay()}>{t('SettingsPicker.back_to_drivers_display')}</div>
    </div>
  )
}

export default ChaperonDisplayAlert