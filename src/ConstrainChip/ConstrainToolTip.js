import React from 'react';
import { useTranslation } from 'react-i18next';

function ConstrainToolTip({ data }) {
	const { t } = useTranslation();
	return (
		<>
			{data.description ? (
				<div className='constrain-title'>
					{`${t('constraint.constraint')}-${data.description}`}
				</div>
			) : (
				t('constraint.missing_constrain_name')
			)}

			<div
				className={
					data.approved
						? 'constrain-sub-title-approved'
						: 'constrain-sub-title-not-approved'
				}
			>
				{data.approved
					? t('constraint.approved')
					: t('constraint.not_yet_approved')}
			</div>
			<div className='constraint-data-wrapper'>
				<div className='fiels-name-constraint-data'>
					{' '}
					{t('constraint.time')}
				</div>
				<div className='fiels-value-constraint-data'>{`${data.end_time?.slice(
					0,
					-3,
				)} - ${data.start_time?.slice(0, -3)}`}</div>
			</div>
			<div className='constraint-data-wrapper'>
				<div className='fiels-name-constraint-data'>
					{' '}
					{t('constraint.repete_every')}
				</div>
				<div className='fiels-value-constraint-data'>{data.repete_every}</div>
			</div>
			<div className='constraint-data-wrapper'>
				<div className='fiels-name-constraint-data'>
					{' '}
					{t('constraint.end_date')}
				</div>
				<div className='fiels-value-constraint-data'>{data.end_date}</div>
			</div>
			<div className='constraint-data-wrapper'>
				<div className='fiels-name-constraint-data'>
					{' '}
					{t('constraint.comment')}
				</div>
				<div className='fiels-value-constraint-data'>{data.comment}</div>
			</div>
		</>
	);
}

export default ConstrainToolTip;
