import React, { useState, useEffect } from 'react';
import '../CardTab.scss';
import { useTranslation } from 'react-i18next';
import language_codes from 'constants/listOfLanguages.json';

const CardForTabListStyle = (dataForItem, tab_name, dataForTabs) => {
	const { t } = useTranslation();
	const [valueForList, seValueForList] = useState('');

	const returnValue = () => {
		if (dataForItem.dataForItem?.needTranslate) {
			return t(`right_dialog.tabs.${dataForItem.tab_name}.${dataForItem.dataForItem?.value}`)
		} else {
			if (dataForItem.dataForItem?.isLanguage && !!dataForItem.dataForItem?.value) {
				let findLanguage = Object.values(language_codes).filter(
					(option) => option.name === dataForItem.dataForItem?.value,
				)[0]?.nativeName;
				return findLanguage ;
			} else {
				return dataForItem.dataForItem?.value;
			}
		}

	};

	return (
		<>
			<div className='CardForTabListStyle-container'>
				<div className='list-group'>
					<div className='list-group-text-bold'>{returnValue()}</div>
					<div className='list-group-text'>
						{t(
							`right_dialog.tabs.${dataForItem.tab_name}.${dataForItem.dataForItem?.key}`,
						)}
					</div>
				</div>
			</div>
		</>
	);
};

export default CardForTabListStyle;
