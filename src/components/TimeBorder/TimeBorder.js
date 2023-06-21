import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
	_cellWidth,
	_cellWidthOfModal,
	sortingDataOfTasks,
	_dataOfTasks,
    _timeArray,
	heightOfScroll
} from 'recoil/atoms';
import './TimeBorder.scss'

const TimeBorder = ({ index, time ,styleIn}) => {
 
    const [cellWidth, setCellWidth] = useRecoilState(_cellWidth);
    const [timeArray, setTimeArray] = useRecoilState(_timeArray);

	let isHalfSize = (time === '01:00') & (timeArray.length === 12);
	let columnNum = index + 1;
	const widthOfCellForModal =
		timeArray.length === 12 ? 120 : timeArray.length === 24 ? 60 : 30;
 
 
 return (
        <span
        className='dash-row-left-test'
        style={{
            right:
                styleIn === 'modal'
                    ? isHalfSize
                        ? 60
                        : `${widthOfCellForModal * (columnNum - 1) + 60}px`
                    : isHalfSize
                    ? `${cellWidth / 2 }px`
                    : timeArray.length === 12
                    ? `${cellWidth * (columnNum - 1) + (cellWidth / 2)}px`
                    : `${`${cellWidth * columnNum}px`}`,
                height:"100%",
            // height:styleIn ==='modal' ?`${heightForModal}px`  : `${heightScroll}px`,
            zIndex: 'unset',
        }}
    >

    </span>
 )
};

export default TimeBorder;
