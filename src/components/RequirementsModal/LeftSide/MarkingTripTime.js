import React, {useState, useEffect} from 'react'
import calculatWidthByTime from 'handler/calculatWidthByTime'
import { useRecoilState } from 'recoil';
import {
	_timeArray,
} from '../../../recoil/atoms';
import moment from 'moment'
function MarkingTripTime({startTime, endTime, color, timeType, selectedRows,setselectedRows,mannedOrders,  setMannedOrders}) {
    const [width, setwidth] = useState()
    const [startPosition, setstartPosition] = useState();
    const [timeArray, setTimeArray] = useRecoilState(_timeArray);

    useEffect(() => {
        let maxWidthOfRow = timeArray.length === 12 ? 120 * timeArray.length : 60 * timeArray.length;
        let _startPosition = calculatWidthByTime("00:00",startTime)
        if(timeType==="halfHour"){
         _startPosition = _startPosition*2
        }
        else if(timeType==="quarter"){
         _startPosition = _startPosition*4
        }

        let _width;
        //if endTime is not today, then set width to length of row
        if(moment.utc(endTime).format('l') !== moment(startTime).format('l')){
            _width = maxWidthOfRow - _startPosition;
        }
        else{
            _width = calculatWidthByTime(startTime,endTime)
            
           if(timeType==="halfHour"){
            _width = _width*2
           }
           else if(timeType==="quarter"){
            _width = _width*4
           }
        }
        if(_width===0){
            _width=2
        }
        setwidth(_width)
        setstartPosition(_startPosition)
    }, [])
    return (
        <>
            <div
            style={{width:`${width}px`, backgroundColor:color? `${color}` :'rgb(181, 224, 247)', height:'5px', position:'absolute', 
            right:`${startPosition +207}px`}}
            >
            </div>

            <div
            className='blue-bg-on-trips'
            style={{
                top:"5px",
                width:`${width}px`,
                right:`${startPosition +207}px`,
            }}>
            </div>
            </>
    )
}

export default MarkingTripTime
