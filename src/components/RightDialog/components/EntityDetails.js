import React from 'react';

import { useTranslation } from 'react-i18next';
import Hr from 'components/HorizontalLine/HorizontalLine';
import { useStores } from 'stores';
import {toJS} from 'mobx';


import { formatValue } from '../config/helpers';

function EntityDetails({ detailsObject = {}, table_name }) {
	const { t } = useTranslation();
	const {dataTableStore}= useStores();

	//TODO: if there is image to entity show it.
	//TODO: if there is a badge and image to entity - show together


	let fields = JSON.parse(localStorage.getItem('fields_of_table'));

	let detailKeysArr = fields
		?.filter(
			({ side_modal_section, table_name: tableName }) =>
				!!side_modal_section && table_name === tableName,
		)
		.map(({ field_name }) => field_name);


	let topSection = fields
		?.filter(
			({ side_modal_section, table_name: tableName }) =>
				side_modal_section === 1 && table_name === tableName,
		)
		.map(({ field_name }) => field_name);

	let middleSection = fields
		?.filter(
			({ side_modal_section, table_name: tableName }) =>
				side_modal_section === 2 && table_name === tableName,
		)
		.map(({ field_name }) => field_name);

	let bottomSection = fields
		?.filter(
			({ side_modal_section, table_name: tableName }) =>
				side_modal_section === 3 && table_name === tableName,
		)
		.map(({ field_name }) => field_name);

	// let topSection =

	return (
		<div className='details-container'>
			{/* top section */}

			<p className='details-subtitle'>
				{t(`right_dialog.sub_titles.${table_name}`)}
			</p>

			{!!topSection && (
				<div className='details-line-container first'>
					{topSection
						// ?.filter(
						// 	(name) => key === 'side_modal_section' && value === 1,
						// )
						?.map((field) => {
							return (
								<div className={`details-line ${field}`} key={field} >
									<div className='details-key'>
										{t(`right_dialog.${table_name}.keys.${field}`)}
									</div>
									<div className={`details-value ${field}`}>
										{formatValue({ key: field, value: detailsObject[field] },dataTableStore)}
									</div>
								</div>
							);
						})}
						<br/>
					<Hr />

				</div>
			)}

			{/* middle section */}
			{!!middleSection && (
				<div className='details-line-container middle'>
					{middleSection
						// ?.filter(
						// 	(name) => key === 'side_modal_section' && value === 1,
						// )
						?.map((field) => {
							return (
								<div className='details-line' key={field}>
									<div className='details-key'>
										{t(`right_dialog.${table_name}.keys.${field}`)}
									</div>
									<div className='details-value'>
										{formatValue({ key: field, value: detailsObject[field] },dataTableStore)}
									</div>
								</div>
							);
						})}
					<br/>
					<Hr />
				</div>

			)}

			{/* bottom section */}
			{!!bottomSection?.length && (
				<div className='details-line-container last'>
					{bottomSection
						// ?.filter(
						// 	(name) => key === 'side_modal_section' && value === 1,
						// )
						?.map((field) => {
							if (field === 'comment') {
								return (
									<div className='details-box' key={field}>
										<div className='details-key'>
											{t(`right_dialog.${table_name}.keys.${field}`)}
										</div>
										<div className='details-value'>
											{formatValue({ key: field, value: detailsObject[field]  })}
										</div>
									</div>
								);
							} else {
								return (
									<div className='details-line' key={field}>
										<div className='details-key'>
											{t(`right_dialog.${table_name}.keys.${field}`)}
										</div>
										<div className='details-value'>
											{formatValue({ key: field, value: detailsObject[field]},dataTableStore)}
										</div>
									</div>
								);
							}
						})}
				</div>
			)}

			{/* {!!detailsObject?.comment && !bottomSection?.find('comment') && (
				<div className='comment-row'>
          <div className='details-key'>
          </div>
          <div className='details-value'>
          {detailsObject?.comment}

          </div>
          </div>
			)} */}
		</div>
	);
}

export default EntityDetails;
