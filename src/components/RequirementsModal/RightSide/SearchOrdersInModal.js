import React, {useState} from 'react';
import { Autocomplete, TextField } from '@mui/material';
import search from '../../../assets/icons/search.svg';
import './RightSide.scss'
import {
	_openFilerByCarSize,_isHeaderSelectReqModal,_numOfResultsOfRequirementsModal,_inputValueFromSearchOrdersReqModal
} from '../../../recoil/atoms';
import { useRecoilState } from 'recoil';

function SearchOrdersInModal({orders, setOrders, setSearchValues, allOrders}) {

    const [openFilerByCarSize, setOpenFilerByCarSize] = useRecoilState(_openFilerByCarSize);
	const [isHeaderSelectReqModal, setIsHeaderSelectReqModal] = useRecoilState(_isHeaderSelectReqModal);
	const [showPopUpIcon, setShowPopUpIcon] = useState(true);
    const [numOfResultsOfRequirementsModal, setNumOfResultsOfRequirementsModal] = useRecoilState(_numOfResultsOfRequirementsModal);
    const [ordersinputValueFromSearch, setOrdersInputValueFromSearch] = useRecoilState(_inputValueFromSearchOrdersReqModal);
    const closeOpenModals = () =>{
		setIsHeaderSelectReqModal(false);
		setOpenFilerByCarSize(false)
	}

    const getOrdersFromSearch = (input) =>{
        if (input === "" || !input) {
            setShowPopUpIcon(true);
            setOrdersInputValueFromSearch("")
            setNumOfResultsOfRequirementsModal(-1);//reset num of results found
            setOrders(allOrders.slice(0,50))
            let timer = setTimeout(()=>{
             let i=50
             for(i ; i <= allOrders.length; i=i+50){
                setOrders(allOrders.slice(0,i))
             }
             if(i!==allOrders.length){            
                setOrders(allOrders.slice(0,allOrders.length))
             }
            },1000)
            return () => {
                clearTimeout(timer);
              }; 
        }
        else{
            setShowPopUpIcon(false)
            const result = allOrders?.filter(order => (
                order.trip_name?.includes(input) || order.from?.includes(input) || order.to?.includes(input) || order.customer_name?.includes(input)
            )) 
            setNumOfResultsOfRequirementsModal(result.length);
            setOrdersInputValueFromSearch(input)
            setOrders(result)
        }
    }


  return <div
  className="search-right">
      <Autocomplete
            multiple
            freeSolo
            id='filter-in-modal'
            filterSelectedOptions
            options={[]}
            selectOnFocus={true}
            forcePopupIcon={true}
            className="search-right"
            popupIcon={showPopUpIcon && <img src={search} className='search-icon-right'
             style={{transform:"none !important", marginLeft:'-25px !important'}} alt='' />}
            size='small'
            renderInput={(params) => (
                <TextField
                onClick={()=>closeOpenModals()}
                    {...params}
                    label='חפש דרישה, שעת נסיעה, מוצא, יעד ועוד'
                />
            )}
            onInputChange={(event)=>{
                getOrdersFromSearch(event.target.value);
            }}

            renderTags={(value, getTagProps) => {
              return;  
            }}
        />
  </div>;
}

export default SearchOrdersInModal;
