import React from 'react'
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import './CardTab.scss'
function ContractCardForPriceList({data}) {

    const getStatus = () => {
        switch (data.status) {
            case "1":
                return <div className={`contract-status-text active`}>פעיל</div>
            case "0":
                return <div className={`contract-status-text not-active`}>לא פעיל</div>
            case "2":
                return <div className={`contract-status-text draft`}>טיוטה</div>
            case "3":
                return <div className={`contract-status-text bid`}>הצעת מחיר</div>
            case "4":
                return <div className={`contract-status-text finish`}>הסתיים</div>
            }
    }
  return (
     <div className='price-list-card-wrapper'>
      <div className='oval-gray-bg'>
        <DescriptionSharpIcon color="action"  fontSize="small"/>
      </div>
      <div className='contract-details-wrapper'>
        <div className='price-name-text'>{data?.contract_name}</div>
        <div style={{display:"flex",flexDirection:'row-reverse'}}>
            {
            getStatus()
            }
            <div className='dot'></div>
        <div className='contract-cosde-in-priceList'>{`קוד: ${data?.contract_id}`}</div>
        </div>
      </div>
    </div>
  )
}

export default ContractCardForPriceList