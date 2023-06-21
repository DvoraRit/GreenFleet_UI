import React, { useEffect, useState } from 'react';
import GB from '../../assets/icons/bgWhiteRequirements.png';
import files from '../../assets/icons/file_copy.svg';
import NewDrive from '../../assets/icons/NewDrive.png';
import Requirement from '../../assets/icons/Requirement.png';
import './RequirementsBtn.scss';
import { useStores } from 'stores/index';

export default function RequirementsBtn({
	className,
	openModal,
	rightpx,
	clickedButton,
}) {
	const { resourceBankStore } = useStores();
	const [numOfOpenOrders, setNumOfOpenOrders] = useState(resourceBankStore.openOrders.length);
	const handleClick = (btn) => {
		clickedButton(btn);
	};

	useEffect(() => {
		setNumOfOpenOrders(resourceBankStore.openOrders.length)
	},[]);
	
	useEffect(() => {
		setNumOfOpenOrders(resourceBankStore.openOrders.length)
	},[resourceBankStore.openOrders.length]);

	return (
		<div className='req-btns-wrapper' style={{opacity: resourceBankStore.isPastDate ? 0.7 : 1,
			pointerEvents: resourceBankStore.isPastDate ? 'none':'all'}}>

			<div
				className={`${className}`}
				style={{
					right: className === 'btn-wrapper' ? `${rightpx}px` : '150px',
					zIndex: openModal ? 0 : 100,
				}}
				onClick={() => handleClick('open-modal')}
			>
				<img src={Requirement} alt='filesIcon' className='fileCopy' />
				{
					numOfOpenOrders > 0 && !resourceBankStore.isPastDate &&
					<div className='red-circle'>
						<div className='num-of-orders-text'>
							{numOfOpenOrders}
						</div>
					</div>
				}
			</div>

			<div className='btn-wrapper' onClick={() => handleClick('add-order')}
			style={{zIndex: openModal ? 0 : 100,right: className === 'btn-wrapper' ? `${rightpx+70}px` : '150px' }}>
				{/* <img src={GB} alt='bgWhiteRequirements' /> */}
				<img src={NewDrive} alt='Add order' className='adding-icon' />
			</div>
		</div>
	);
}
