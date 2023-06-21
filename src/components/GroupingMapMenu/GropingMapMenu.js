import React, { useState } from 'react';
import MenuGroup from './view_quilt_24.svg';
import activeMenu from './view_quilt_24@active.svg';
import iconArrowLeft from '../../containers/Control/MainContainer/Map/images/popUpIcons/icon-arrow-left.png';
import GroupingRecordes from './GroupingRecordes';
import tuggleModal from '../../handler/tuggleModals.js';
import {
	textDir,
	setTuggleModels,
	defaultCenterMap,
	defaultCenterMapIsChanged,
	centerMap,
	_showInbox,
} from '../../recoil/atoms';
import { useRecoilState } from 'recoil';
import { textInGroupingMenu } from '../../constants/textConstans';

import './GropingMapMenu.scss';

const GroupingMapMenu = (props) => {
	const [openModalRecords, setOpenModalRecords] = useState(null);
	const [textDirection] = useRecoilState(textDir);
	const [defaultCenterMapChanged, setDefaultCenterMapChanged] = useRecoilState(
		defaultCenterMapIsChanged,
	);
	const [tuggle, setTuggle] = useRecoilState(setTuggleModels);
	const [click, setClick] = useState(0);
	const [inboxDialog, setInboxDialog] = useRecoilState(_showInbox);

	const handleClick = (modal) => {
		tuggleModal(modal, tuggle, setTuggle);
		setClick(click + 1);
		setOpenModalRecords(null);
		if (click === 1) {
			setDefaultCenterMapChanged(true);
		}
		if (click === 2) {
			setClick(1);
			setDefaultCenterMapChanged(false);
		}
	};

	const handleClose = () => {};

	const openOptions = (type, modal) => {
		if (type === openModalRecords) {
			setOpenModalRecords(null);
			setTuggle((prev) => {
				return { ...prev, [modal]: !tuggle.GroupingRecordes };
			});
		} else {
			setOpenModalRecords(type);
			setTuggle((prev) => {
				return { ...prev, [modal]: !tuggle.GroupingRecordes };
			});
		}
	};

	return (
		<>
			<div className='grouping-map-menu' id='grouping-map-menu'>
				{ !inboxDialog &&(
					<div
						className={
							tuggle.GroupingMapMenu === true ? 'iconMenuActive' : 'iconMenu'
						}
					>
						<img
							src={tuggle.GroupingMapMenu === true ? activeMenu : MenuGroup}
							onClick={() => handleClick('GroupingMapMenu')}
							className='iconMenuGroup'
							alt='GroupingMapMenu'
						/>
					</div>
				)}
				{tuggle.GroupingMapMenu === true && (
					<div
						className='Wrapper_grouping-map'
						onClose={handleClose}
						style={{
							position: 'absolute',
							top: '4rem',
							display: 'flex',
							padding: 0,
							flexFlow: 'column',
							justifyContent: 'space-evenly',
							boxShadow: '0 2px 25px 0 rgba(192,200,217,0.6)',
						}}
					>
						<div
							className='rowWrapperMap'
							onClick={() => openOptions('mapItems', 'GroupingRecordes')}
						>
							<div className='subTitleGroup'>{textInGroupingMenu.mapItems}</div>
							<img
								src={iconArrowLeft}
								className='arrowUpPopMoreInfo'
								alt='iconArrowLeft'
								target={textDirection}
							/>
						</div>

						<div
							className='rowWrapperMap'
							onClick={() => openOptions('status', 'GroupingRecordes')}
						>
							<div className='subTitleGroup'>{textInGroupingMenu.status}</div>
							<img
								src={iconArrowLeft}
								className='arrowUpPopMoreInfo'
								alt='iconArrowLeft'
								target={textDirection}
							/>
						</div>
					</div>
				)}

				{openModalRecords && tuggle.GroupingMapMenu === true && (
					<GroupingRecordes data={openModalRecords} />
				)}
			</div>
		</>
	);
};
export default GroupingMapMenu;
