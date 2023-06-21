import React from 'react';
import { useTranslation } from 'react-i18next';
import './ActiveStatus.scss';

function ActiveStatus({ isActive, status="" }) {
	const { t } = useTranslation();

	return (
		<>
		{
			status === ""
			?
			<div className={isActive ? 'active-wrapper' : 'not-active-wrapper'}>
				<div className={isActive ? 'active-text' : 'not-active-text'}>
					{t(`isActive.${isActive}`)}
				</div>
			</div>
			:
			<div className={`status-wrapper ${status}`}>
				<div className={`status-text ${status}`}>
					{t(`isActive.${status}`)}
				</div>
			</div>
		}
		</>
	);
}

export default ActiveStatus;
