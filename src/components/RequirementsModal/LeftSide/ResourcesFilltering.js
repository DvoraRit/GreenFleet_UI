import React from 'react'
import Text from '../../../constants/textConstans';
import Checkbox from '@mui/material/Checkbox';
import './LeftSide.scss';
import { makeStyles  } from '@mui/styles';
import { useEffect } from 'react';
import { _openFilerByCarSize, _isHeaderSelectReqModal,_numOfResultsOfResourcesRequirementsModal } from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import { useTranslation } from 'react-i18next';
const useStyles = makeStyles({
    checkbox: {
     height:'14px !important',
     width:'14px !important',
     color:'#00e6ac !important',
     transform: "scale(0.7)",
    }
  });

function ResourcesFilltering({setselected, selected, numOfAllResources}) {
    const {t} = useTranslation();
    const classes = useStyles();
	const [openFilerByCarSize, setOpenFilerByCarSize] = useRecoilState(_openFilerByCarSize);
	const [isHeaderSelectReqModal, setIsHeaderSelectReqModal] = useRecoilState(_isHeaderSelectReqModal);
    const [numOfResultsOfResourcesRequirementsModal, setNumOfResultsOfResourcesRequirementsModal] = useRecoilState(_numOfResultsOfResourcesRequirementsModal);


    const handleSuitableChange = (model) => {
        setselected((prev) => {
            return {...prev,[model]: !selected.qualified  };
        });
        setIsHeaderSelectReqModal(false);
		setOpenFilerByCarSize(false)
    }
    const handleAvailableChange = (model) => {
        setselected((prev) => {
            return {...prev,[model]: !selected.available };
        });
        setIsHeaderSelectReqModal(false);
		setOpenFilerByCarSize(false)
    }
    const handleSubConstractorsChange = (model) => {
        setselected((prev) => {
            return {...prev,[model]: !selected.subConstractors};
        });
        setIsHeaderSelectReqModal(false);
		setOpenFilerByCarSize(false)
    }
    useEffect(()=>{
        localStorage.setItem('filterSelectedModal', JSON.stringify(selected));
    },[selected])
    useEffect(() => {

    }, [numOfResultsOfResourcesRequirementsModal])
    
    return (
        <div className='resource-filtering'>
            <div style={{display:"flex"}}>
                {
                    numOfResultsOfResourcesRequirementsModal > -1 ?
                    <div className='text-resources'>
                        {`נמצאו ${numOfResultsOfResourcesRequirementsModal} מתוך ${numOfAllResources} משאבים` }
                    </div>
                    :
                    <div className='text-resources'>
                         {`סה"כ ${numOfAllResources} ${Text.resources}`}
                    </div>
                }
            </div>
            <div className='all-checkbox-and-text-wrapper'>
                <div className='checkbox-and-text-wrapper'>
                    <Checkbox
                        onChange={() => handleSuitableChange("qualified")}
                        name={t('qualified')}
                        color='primary'
                        size='small'
                        className={classes.checkbox}
                        checked={selected.qualified}
                    />
                    <div className='text-fillter'>{t('qualified')}</div>
                </div>
                <div className='checkbox-and-text-wrapper'>
                <Checkbox
                        onChange={() => handleAvailableChange("available")}
                        name={t('available')}
                        color='primary'
                        size='small'
                        className={classes.checkbox}
                        checked={selected.available}
                    />
                <div className='text-fillter'>{t('available')}</div>
                </div>
                <div className='checkbox-and-text-wrapper'>
                    <Checkbox
                            onChange={() => handleSubConstractorsChange("subConstractors")}
                            name={t('subConstractors')}
                            color='primary'
                            size='small'
                            className={classes.checkbox}
                            checked={selected.subConstractors}
                        />
                    <div className='text-fillter'>{t('subConstractors')}</div>
                </div>
            </div>
        </div>
    )
}

export default ResourcesFilltering
