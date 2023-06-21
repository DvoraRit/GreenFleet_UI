import React from 'react';
import './ConnectOrders.scss'

function ConnectOrders({height, top, right}) {
  return <div className='connect-line' 
    style={{height:height, top:top, right:right}}></div>;
}

export default ConnectOrders;
