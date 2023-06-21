import React from 'react';
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import RightDialog from 'components/RightDialog/RightDialog';

function PriceListCard({item}) {
  const [rightDialog, setRightDialog] = React.useState(false);
  const [priceListDetails, setPriceListDetails] = React.useState({...item});
  const toggleRightDialog = () => {
		setRightDialog((state) => !state);
	};

  const handleClick = () => {
    setPriceListDetails({original:{...item,id:item.price_list_id}, values:{price_list_name:item.price_list_name}});
    toggleRightDialog();
  };
  return (
    <>
    <div className='price-list-card-wrapper' onClick={handleClick}>
      <div className='oval-gray-bg'>
        <DescriptionSharpIcon color="action"  fontSize="small"/>
      </div>
      <div className='price-details-wrapper'>
        <div className='price-name-text'>{item?.price_list_name}</div>
        {
          parseInt(item?.status)===1?
        <div className='price-status-active'>פעיל</div>
        :
        <div className='price-status-not-active'>לא פעיל</div>
        }
      <div className='num-of-items-in-priceList'>{`פריטים במחירון: ${item?._lines}`}</div>
      </div>
    </div>

    <RightDialog
    isOpen={rightDialog}
    toggle={() => {
      toggleRightDialog();
    }}
    selectedEntityData={priceListDetails}
    table_name={"price_list"}
    goBack={true}
    //patchTitle={patchTitle}
   middle_modal_width={"60vw"}
   // padding={padding}
    //specialWidthForModal={specialWidthForModal}
    />
    </>
  )
}

export default PriceListCard