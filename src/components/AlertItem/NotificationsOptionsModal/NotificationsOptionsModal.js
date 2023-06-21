import React,{useState } from 'react';
import ColorPickerComponent from 'containers/Control/MainContainer/Map/modals/ColorPickerComponent';
// import centerMap from '../images/popUpIcons/centerMap.jpeg';
import colorPicker from 'assets/icons/palette.svg';
import Connection from 'containers/Control/MainContainer/Map/images/popUpIcons/phone_black.svg';

import iconArrowLeft from 'containers/Control/MainContainer/Map/images/popUpIcons/icon-arrow-left.png';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import NotificationsAttachment from '../NotificationsAttachment/NotificationsAttachment'

import {
	textDir,
	centerMap,
	zoomMap,
	setTuggleModels,
	more_info_open_in_trip
} from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import { useStores } from 'stores/index';
import { toJS } from 'mobx';
import { useTranslation } from 'react-i18next';
import Attachment from 'containers/Control/MainContainer/Map/modals/Attachment/Attachment';

const NotificationsOptionsModal = ({ alertData={} ,index,styleIn="details"  }) => {
	// console.log('alertData',alertData)
	const { t } = useTranslation();
	const [mouseEnter, setmouseEnter] = useState(false);
	const [openModal, setOpenModal] = useState(false);
	// eslint-disable-next-line
	const [textDirection, setTextDirection] = useRecoilState(textDir);
	// eslint-disable-next-line
	const [centerMapResorce, setCenterMapResorce] = useRecoilState(centerMap);
	// eslint-disable-next-line
	const [zoomMapResorce, setZoomMapResorce] = useRecoilState(zoomMap);
	const [tuggle, setTuggle] = useRecoilState(setTuggleModels);
	const [openModalInTrip, setopenModalInTrip] = useRecoilState(
		more_info_open_in_trip,
	);
	const { resourceStore } = useStores();
	
	let resourceData = !!alertData?.car_number? toJS(
		resourceStore.resourceList.find((x) => toJS(x.car_number === alertData?.car_number)),
	):[];

	const mapCenterOnClick = () => {
		if (  toJS(resourceData?.lat) &&   toJS(resourceData?.lng)) {
			let selectedLat =  toJS(resourceData?.lat);
			let selectedLng =  toJS(resourceData?.lng);
			setCenterMapResorce({
				lat: parseFloat(selectedLat),
				lng: parseFloat(selectedLng),
			});
			if(zoomMapResorce !==15){
				setZoomMapResorce(15)
			}
			else{
				setZoomMapResorce(zoomMapResorce+1)
			}
		} 
		if(tuggle.attachment){
			setTuggle((prev) => {
					// eslint-disable-next-line
				return { ...prev, ["attachment"]: !tuggle.attachment };
			});
		}
        if(tuggle.notifications){
			setTuggle((prev) => {
					// eslint-disable-next-line
				return { ...prev, ["notifications"]: !tuggle.notifications };
			});
		}
		if(tuggle.colorPicker){
			setTuggle((prev) => {
					// eslint-disable-next-line
				return { ...prev, ["colorPicker"]: !tuggle.colorPicker };
			});
		}
		setTuggle((prev) => {
				// eslint-disable-next-line
			return { ...prev, ["popUpMoreInfo"]: !tuggle.popUpMoreInfo };
		});
		setopenModalInTrip(false);

	};

	const handleColorPicker = (modal) => {
		if(tuggle.attachment){
			setTuggle((prev) => {
					// eslint-disable-next-line
				return { ...prev, ["attachment"]: !tuggle.attachment };
			});
		}
		setTuggle((prev) => {
			return { ...prev, [modal]: !tuggle.colorPicker };
		});
		
	};

	const handleAttachment = (modal) =>{
		if(tuggle.colorPicker){
			setTuggle((prev) => {
					// eslint-disable-next-line
				return { ...prev, ["colorPicker"]: !tuggle.colorPicker };
			});
		}
		setTuggle((prev) => {
			return { ...prev, [modal]: !tuggle.attachment };
		});
	}

	return (
		<>
			<div className={`popUppMoreInfoMain${textDirection}`} style={{position: 'fixed',left:"19%"}}>
				<div
					className='rowWrapperCenterMap'
					target={mouseEnter.toString()}
					onMouseEnter={() => setmouseEnter('CenterMap')}
					// onMouseLeave={()=>setmouseEnter("false")}
					onClick={() =>mapCenterOnClick()}
				>
					<div className='iconTextWrapper'>
						<CenterFocusWeakIcon
							className='imagesInPopUp'
							color='action'
							fontSize='small'
						/>
						 <div className='subTitle'>{t('textInPopUp.centerMap')}</div> 
						{/* <div className='subTitle'>{(!resorceData?.car_number)?t('textInPopUp.centerMapErr'):t('textInPopUp.centerMap')}</div> */}
					</div>
				</div>

				<div
					className='rowWrapperPickColor'
					target={mouseEnter.toString()}
					onMouseEnter={() => setmouseEnter('PickColor')}
					onClick={() => handleColorPicker('colorPicker')}
				>
					<div style={{ display: 'flex', flexDirection: 'row' }}>
						<img
							src={colorPicker}
							className='imagesInPopUp'
							style={{ zIndex: '999' }}
							alt='colorPicker'
						/>
						<div className='subTitle'>{t('textInPopUp.colorMap')}</div>
					</div>
					<div>
						<img
							src={iconArrowLeft}
							className='arrowUpPopMoreInfo'
							alt='iconArrowLeft'
							target={textDirection}
						/>
					</div>
				</div>

				<div
					className='rowWrapperCallDriver'
					target={mouseEnter.toString()}
					onMouseEnter={() => setmouseEnter('CallDriver')}
					onMouseLeave={() => setmouseEnter('false')}
					onClick={()=>handleAttachment("attachment")}
				>
					<div style={{ display: 'flex', flexDirection: 'row' }}  >
						<img src={Connection} className='imagesInPopUp' alt='Connection' />
						<div className='subTitle'>{t('textInPopUp.connection')}</div>
					</div>
					<img
						src={iconArrowLeft}
						className='arrowUpPopMoreInfo'
						alt='iconArrowLeft'
						target={textDirection}
					/>
				</div>
                <div
					className='rowWrapperNotifications'
                    style={{ display: 'flex', flexDirection: 'row' ,justifyContent: "space-around" }} 
					target={mouseEnter.toString()}
					onMouseEnter={() => setmouseEnter('notifications')}
					onMouseLeave={() => setmouseEnter('false')}
					onClick={()=>setOpenModal(!openModal)}
				>
					<div style={{ display: 'flex', flexDirection: 'row' }}  >
                        <NotificationsNoneIcon className='imagesInPopUp' alt='Connection' color="disabled"/>
						<div className='subTitle'>{t('textInPopUp.notifications')}</div>
					</div>
					<img
						src={iconArrowLeft}
						className='arrowUpPopMoreInfo'
						alt='iconArrowLeft'
						target={textDirection}
					/>
				</div>
                
			</div>
			{tuggle.colorPicker === true && (
				<div className='pickColorTrip' style={{position:"fixed" ,left:"10%" ,top:"auto"}} target={styleIn}>
					<ColorPickerComponent data={resourceData} />
				</div>
			)}
			{tuggle.attachment === true && (
				<div className='attachment' style={{position:"fixed" ,left:22 ,top:"auto"}}>
					<Attachment contactDetails={resourceData} />
				</div>
			)}
            	{(tuggle.notifications === true ||openModal) && (
				<div className='notifications'  style={{position:"fixed" ,left:"5%" ,top:"auto"}}>
					<NotificationsAttachment alertData={alertData} index={index}setmouseEnter={setmouseEnter}
					 mouseEnter ={mouseEnter} handleAttachment={handleAttachment}/>
				</div>
			)}

		</>
	);
};


export default NotificationsOptionsModal