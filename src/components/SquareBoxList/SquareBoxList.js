import React from 'react';
import { useTranslation } from 'react-i18next';
import './SquareBoxList.scss';


const SquareBoxList = (dataForItem,tab_name,dataForTabs,key) => {

	const { t } = useTranslation();

	return (
		<>
        {!!dataForItem.dataForItem.value &&
			<div className='CardForTabListStyle-container'>
            <div className='list-group-square'>
            <div className='list-group-square-text'>{ t(`right_dialog.tabs.${dataForItem.tab_name}.${dataForItem.dataForItem.key}`)}</div>

			</div>
		</div>
       } 
		</>
	);
};



export default SquareBoxList;
