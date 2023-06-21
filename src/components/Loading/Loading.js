import React from 'react'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './Loading.scss'

function Loading () {

    return (
        <div 
        className="wrapper"
        >
          <Box sx={{ display: 'flex' }}>
            <CircularProgress />
         </Box>
        </div>
    )
}

export default Loading
