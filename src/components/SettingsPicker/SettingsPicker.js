import React, {useEffect, useState} from 'react'
import './SettingsPicker.scss'
import { useTranslation } from 'react-i18next';
import CheckIcon from "@mui/icons-material/Check";
import { _chaperonDisplayOn, setTuggleModels,chosenHeaderTable, rightInTableMode, tableMode } from 'recoil/atoms';
import { useRecoilState} from 'recoil';
import tuggleModal from 'handler/tuggleModals';

function SettingsPicker({openSettings, setOpenSettings}) {
    const { t } = useTranslation();
    const [chaperonDisplayOn, setChaperonDisplayOn] = useRecoilState(_chaperonDisplayOn);
    const [mouseEnter, setmouseEnter] = useState(false);
    const [headerToShow, setHeaderToShow] = useRecoilState(chosenHeaderTable);
    const [rightpx, setRightPx] = useRecoilState(rightInTableMode);
	const [tableNav, setTableNav] = useRecoilState(tableMode);

    const selectSetting = (selectedDisplay) =>{
        if(selectedDisplay==="chaperon_display")
        {
            setChaperonDisplayOn(true)
            localStorage.setItem('chaperon_display_on', true);
        }
        else
        {
            localStorage.setItem('chaperon_display_on', false);
            setChaperonDisplayOn(false)
        }
        setOpenSettings(false)
    }

    useEffect(()=>{
    },[tableNav,rightpx])

  return (
      <>
        <div
        className='row-wrapper-setting-picker'
         onMouseEnter={() => setmouseEnter("drivers_display")}
         onMouseLeave={() => setmouseEnter(false)}
         style={{backgroundColor: mouseEnter==="drivers_display"? "rgba(0,0,0,0.04)" : "white"}}>
            <div className='text-wrapper-setting-picker' onClick={()=>selectSetting("drivers_display")}>
                <div className='setting-picker-text'>{t('SettingsPicker.change_display_for_driver')}</div>
                <div className='sub-text-setting-picker'>{t('SettingsPicker.not_approve_constrains')}</div>
            </div>
            {
                !chaperonDisplayOn &&
                <CheckIcon
                    color="primary"
                    style={{ height: "14px", width: "14px", alignSelf: "flex-end",  marginBottom: '18px' }}
            />
            }
        </div>
        <div className='line-divider'></div>
        <div
         className='row-wrapper-setting-picker'
         onMouseEnter={() => setmouseEnter("chaperon_display")}
         onMouseLeave={() => setmouseEnter(false)}
         style={{backgroundColor: mouseEnter==="chaperon_display"? "rgba(0,0,0,0.04)" : "white"}}>
            <div className='text-wrapper-setting-picker' onClick={()=>selectSetting("chaperon_display")}>
                <div className='setting-picker-text'>{t('SettingsPicker.change_display_for_chaperon')}</div>
                <div className='sub-text-setting-picker'>{t('SettingsPicker.not_approve_constrains')}</div>
            </div>
            {
                chaperonDisplayOn &&
                <CheckIcon
                    color="primary"
                    style={{ height: "15px", width: "15px", alignSelf: "flex-end" , marginBottom: '18px'}}
                />
            }
        </div>
    </>
  )
}

export default SettingsPicker