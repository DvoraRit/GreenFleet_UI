import React from 'react';
import './ChangeTripAlert.scss';
import { useTranslation } from 'react-i18next';
import { _selectedTripChip } from 'recoil/atoms.js';
import { useRecoilState } from 'recoil';
import { useStores } from 'stores/index';

function ChangeTripAlert() {
	const [selectedTripChip, setSelectedTripChip] =
		useRecoilState(_selectedTripChip);
	const { resourceBankStore, taskStore } = useStores();


	const textIfTripNotPublished = () => {
		return (
			<div>
				<span>{t('alertsWhenRecourseChange.trip_to')}</span>
				<span>{t('alertsWhenRecourseChange.type_driver')}</span>
				<span>{t('alertsWhenRecourseChange.updated_and_overlapping')}</span>
			</div>
		);
	};
	const textIfTripHasPublished = () => {
		return (
			<div>
				<span>{t('alertsWhenRecourseChange.trip_to')}</span>
				<span>{t('alertsWhenRecourseChange.type_driver')}</span>
				<span>
					{t('alertsWhenRecourseChange.updated_and_needs_publishing')}
				</span>
			</div>
		);
	};

	const { t } = useTranslation();

	return (
		<div className='rectangle-alert-wrapper'>
			<div className='main-tetx-attention'>
				{selectedTripChip.has_publish !== 1
					? textIfTripNotPublished
					: textIfTripHasPublished}

				{textIfTripNotPublished}
			</div>
			{/* <div className='main-tetx-attention'>{resourceBankStore.messageAfterChangeResource}</div> */}
			<div className='go-bak-text'>
				{t('SettingsPicker.back_to_drivers_display')}
			</div>
		</div>
	);
}

export default ChangeTripAlert;
