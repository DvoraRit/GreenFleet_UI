import React from 'react';
import { useTranslation } from 'react-i18next';
import pdfIcon from './utils/imagesForTabs/picture_pdf.svg';
import delete_outline from './utils/imagesForTabs/delete_outline.svg';

import './CardTab.scss';

const CardDocumentTab = ({ item, dataForTabs }) => {
	const { t } = useTranslation();
	let delateDocument = async () => {
		let newData={
			document_type:"",
			document_path:"",
			document_date:"",
			document_name:"",
		};
			await TableDataService.updateEntity({
			data: newData,
			table_name: 'vehicles_extra',
			id: item.Id,
			});

	}

	return (
		<div
			className='card_info_document'
		>
			<div className='card_info_document_row'>
				<div className='card_info_img_document'>
					<img src={pdfIcon} alt='pdfIcon' />
				</div>
				<div className='card_info_main'>
					<div className='card_info_title'>{item.title} </div>
					<div className='card_info_document_subTitles'>
						{item.subTitle.map((sub) => {
							return (
								<>
									<div className='card_info_subTitle'>
										{t(`CardTabEntity.${sub.key}`)}: {sub.value}{' '}
									</div>
									<div className='dot'></div>
								</>
							);
						})}
					</div>
				</div>
			</div>
			<div className='card_info_delete_img_document'>
				<img src={delete_outline} alt='delete_outline'  onClick={delateDocument}/>
			</div>
	
		</div>
		
	);
};

export default CardDocumentTab;
