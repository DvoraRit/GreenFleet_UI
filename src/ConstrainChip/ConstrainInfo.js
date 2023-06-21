import React from 'react'
import {useTranslation} from 'react-i18next';
function ConstrainInfo({constrain, right}) {
  const {t} = useTranslation();

    return (
    <div className='constrain-info'
   >
        <div className='constrain-info-title'>
        {constrain?.description ?
            <div> {constrain?.description}</div>
            :
            t('constraint.missing_constrain_name')
        }
        </div>
        <div className='constrain-sub-container'>
            {constrain?.comment && (
                <div className='constrain-info-sub-title'>
                    {`${t('constraint.comment')}: ${constrain?.comment}`}
                </div>
            )}
            <div className='dot'></div>

            <div className='constrain-info-sub-title'>
            {constrain?.approved_status ? 
                <div>{t('constraint.approved')}</div>
                :
                <div>{t('constraint.not_yet_approved')}</div>
            }
            </div>
            
        </div>
    </div>
  )
}

export default ConstrainInfo