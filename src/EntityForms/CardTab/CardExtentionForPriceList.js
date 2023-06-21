import React from 'react';
import { useTranslation } from 'react-i18next';

import './CardTab.scss';

const CardExtentionForPriceList = ({ item,isNumbered =false }) => {
	const { t } = useTranslation();
    const _item = {...item,subTitle:[
        {
            key: 'selected_value_type',
            value: t(`entity_form.price_extra.select.${item.selected_value_type}`),
            needTranslate: true,
        },
        { key: 'extention_value', value: item.extention_value },
    ]}

	return (
		<div className='card-tab-wrapper'>
			{
				isNumbered && <div className='card_info_number'>{_item.number}</div>
			}

			<div className='card_info'>
				<div className='card_info_title'>{t(`entity_form.price_extra.select.${item.extention_type}`)} - {t(`entity_form.price_extra.select.${item.extension}`)} </div>
				<div className='card_info_subTitles'>
					{_item.subTitle.map((sub) => {
						return (
							<>
								<div className='card_info_subTitle'>
									{t(`CardTabEntity.${sub.key}`)} {sub.value}{' '}
								</div>
								<div className='dot'></div>
							</>
						);
					})}
				</div>
			</div>
		</div>
	);
};

export default CardExtentionForPriceList;
