import React from 'react';
import './PriceListDetailsRightDialog.scss';

function PriceListDetailsRightDialog({items}) {

  return (
      items?.length > 0 ?
        items?.map((item)=>
        {
            return(
                <div className='balance-and-used-container'>
                    <div 
                        className='balance-details-container'
                    >
                        <div className='price-details-text'>
                            {`מחירון: ${item.price_list_name}`}
                        </div>
                        <div className='dot'></div>
                        <div className='price-details-text'>
                            {`יתרה: ${item.balance}`}
                        </div>
                    </div>

                    <div className='price-details-text'>
                         {`נוצלו: יחושב בהמשך`}
                         {/* {`נוצלו: ${item.balance}`} */}
                    </div>
                </div>
            ); 
        })
      :
      <div></div>
    // <div>PriceListDetailsRightDialog</div>
  )
}

export default PriceListDetailsRightDialog