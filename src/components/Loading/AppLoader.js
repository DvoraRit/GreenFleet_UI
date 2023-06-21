import CircularProgress from '@mui/material/CircularProgress';
import React from 'react';
// import './AppLoader.scss';

const AppLoader = () => {
  return (
    <div className="app-loader-wrapper">
      <CircularProgress className='spinner' />
    </div>
  )
}

export default AppLoader
