import React, {useEffect, useState} from 'react'
import './RequirementName.scss'
import check from '../../../assets/icons/check_circle.svg'
import check_true from '../../../assets/icons/check_circle_true.svg';
import { _inputValueFromSearchOrdersReqModal } from 'recoil/atoms';
import { useRecoilState,  } from 'recoil';
function RequirementName({data, selectedRow, color, newWidth}) {
    const [width, setWidth] = useState(150)
	const [ordersinputValueFromSearch, setOrdersInputValueFromSearch] = useRecoilState(_inputValueFromSearchOrdersReqModal);

    useEffect(()=>{
        if(newWidth?.column==="nameOfTrip"){
            setWidth(newWidth.width)
        }
    },[newWidth])

    function getHighlightedText(text) {
		// Split on highlight term and include term into parts, ignore case
		if (ordersinputValueFromSearch && text) {
			let highlight = ordersinputValueFromSearch.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
			highlight = highlight.replace(/[\\$&]/g, '');
			return (
				<span>
					{' '}
					{parts.map((part, i) => (
						<span
							key={i}
							style={
								part.toLowerCase() === highlight.toLowerCase()
									? { fontWeight: 'bold' }
									: {}
							}
						>
							{part}
						</span>
					))}{' '}
				</span>
			);
		} else {
			return text;
		}
	}

    return (
        <div className='requirement-name-wrapper'
        style={{width: width}}
        //mon_order_number ? 130 :150}}
        draggable={false}
        >
            {
                data.common_order_number && 
                <div className='dot-in-requirement-name'>

                </div>
            }
            <div className='color-rectangle' 
            style={{backgroundColor:`${color}`}}
            >
            </div>

            <img src={selectedRow ? check_true : check} alt="check" className='check-icon'  draggable={false}/>

            <div className="name-text">{getHighlightedText(data.trip_name)}</div>
        </div>
    )
}

export default RequirementName
