import React, { useState, useEffect,useCallback  } from 'react';
import ResourceInModal from './ResourceInModal';
import './LeftSide.scss';
import carIcon from '../../../assets/icons/minibusIconRecords.svg';
import busIconSelected from '../../../assets/icons/busIconSelected.svg';
import ResourcesFilltering from './ResourcesFilltering';
import ScheduleHeader from '../../../containers/Planning/PlanningBody/ScheduleTop/ScheduleHeader/ScheduleHeader';
import Text from '../../../constants/textConstans';
import { useRecoilState } from 'recoil';
import {
	_timeArray,
	_mannedOrders,
	_recentlyAssignedOrders,
	_driversPlanning,
	_carSizeSelected,
	_cancelAssignedOrders,
	_openFilerByCarSize,
	_isHeaderSelectReqModal,
	_numOfResultsOfResourcesRequirementsModal
} from '../../../recoil/atoms';
import { useStores } from 'stores/index';
import MarkingTripTime from './MarkingTripTime';
import getAvailableDrivers from '../../../handler/getAvailableDrivers';
import getQualifiedDrivers from '../../../handler/getQualifiedDrivers';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import FilterByCarSizeModal from './FilterByCarSizeModal';
import SearchResourceInModal from './SearchResourceInModal';
import AppLoader from '../../../components/Loading/AppLoader';

function LeftSideModal({
	selectedRows,
	setselectedRows,
	widthOfRightSide,
	//mannedOrders, setMannedOrders
}) {
	const { viewStore } = useStores();
	const [openFilerByCarSize, setOpenFilerByCarSize] = useRecoilState(_openFilerByCarSize);
	const [numOfResultsOfResourcesRequirementsModal, setNumOfResultsOfResourcesRequirementsModal] = useRecoilState(_numOfResultsOfResourcesRequirementsModal);

	const [bottom_scrollbar_style, setbottom_scrollbar_style] = useState({
		height: '100%',
		width: `${window.innerWidth - widthOfRightSide - 240}px`,
		maxWidth: `${window.innerWidth - widthOfRightSide - 240}px`,
	});
	const { t } = useTranslation();
	// eslint-disable-next-line
	const [timeArray, setTimeArray] = useRecoilState(_timeArray);
	// eslint-disable-next-line
	const [driversPlanning, setDriversPlanning] =
		useRecoilState(_driversPlanning);
	const [rows, setRows] = useState([]);
	const [allRowsFiltered, setAllRowsFiltered] = useState([]);
	const [mannedOrders, setMannedOrders] = useRecoilState(_mannedOrders);
	// eslint-disable-next-line
	const [recentlyAssignedOrders, setRecentlyAssignedOrders] = useRecoilState(
		_recentlyAssignedOrders,
	);
	const [cancelAssignedOrders, setcancelAssignedOrders] = useRecoilState(_cancelAssignedOrders);
	const [filterSelected, setFilterSelected] = useState(
		localStorage.getItem('filterSelectedModal')
			? JSON.parse(localStorage.getItem('filterSelectedModal'))
			: { qualified: true, available: true, subConstractors:false },
	);
	const [time, setTime] = useState('');
	const [carSizeSelected, setCarSizeSelected] =
		useRecoilState(_carSizeSelected);
	const [sliceFrom, setSliceFrom] = useState(0);
	const [sliceTo, setSliceTo] = useState(13);
	const [loading, setLoading] = useState(false);
	const [loadingMoreData, setLoadingMoreData] = useState(false);
	const [isHeaderSelectReqModal, setIsHeaderSelectReqModal] = useRecoilState(_isHeaderSelectReqModal);
	var scrollableElement = document.getElementById('bottom-scroll-bar-in-modal');
	const [heightOfScroll, setHeightOfScroll] = useState(scrollableElement?.scrollHeight);
	scrollableElement?.addEventListener('scroll', checkScrollDirection);

	const style_of_row_under_time = {
		width:timeArray.length === 12 ? 120 * timeArray.length : 60 * timeArray.length,
		//width: `${window.innerWidth - widthOfRightSide + 206}px`,
		position: 'relative',
		height: '60px',
		backgroundColor: 'rgba(192,200,217,0.17)',
	};
	const closeOpenModals = () =>{
		setIsHeaderSelectReqModal(false);
		setOpenFilerByCarSize(false)
	}

	const filterByCarSize = () => {
		setOpenFilerByCarSize(!openFilerByCarSize);
		setIsHeaderSelectReqModal(false);
	};

	const ToastBody = () => {
		return (
			<div className='text-wrapper-in-toast'>
				<div className='text-in-toast'>
					{t('requirementsModal.MannedSuccessfully')}
				</div>
				<div
					onClick={() => cancleAssignedOrders()}
					className='cancel-button-toast'
				>
					{t('requirementsModal.cancel')}
				</div>
			</div>
		);
	};

	const cancleAssignedOrders = () => {
		//TODO - update [lanning]
		//remove canceled trips from manned orders
		if (mannedOrders.length > 0) {
			let newArray = [...mannedOrders];
			recentlyAssignedOrders.newTrips.forEach((element) => {
				let indexToRemove = newArray.findIndex(
					(x) => x.id === element.order_id,
				);
				newArray = newArray
					.slice(0, indexToRemove)
					.concat(newArray.slice(indexToRemove + 1));
			});
			setMannedOrders(newArray);
			setcancelAssignedOrders(recentlyAssignedOrders);
		}
	};

	const getRowsToShow = useCallback(() => {
		//setLoading(true)
		//setSliceTo(12)
		let rows = [];
		if (//if all filters true
			filterSelected.available &&
			filterSelected.qualified &&
			selectedRows.length > 0
		) {
			let both = [];
			let _availbleDrivers = getAvailableDrivers(
				selectedRows,
				driversPlanning,
			);
			let qualifiedDrivers = getQualifiedDrivers(
				selectedRows,
				driversPlanning,
			);
			_availbleDrivers.forEach((item) => {
				if (
					qualifiedDrivers.findIndex(
						(q) => q.resourceData.driver_id === item.resourceData.driver_id,
					) !== -1
				) {
					both.push(item);
				}
			});
			rows = both;
		} else if (filterSelected.available && !filterSelected.qualified) {
			let onlyAvailable = getAvailableDrivers(
				selectedRows,
				driversPlanning,
			);
			if(filterSelected.subConstractors){
				rows = onlyAvailable;
			}
			else{
				rows = onlyAvailable.filter((item) => {
					return !item.resourceData.is_sub_constractor;
				});
			}
		} else if (!filterSelected.available && filterSelected.qualified) {
			let onlyQualified = getQualifiedDrivers(
				selectedRows,
				driversPlanning,
			);
			if(filterSelected.subConstractors){
				rows = onlyQualified;
			}
			else{
				rows = onlyQualified.filter((item) => {
					return !item.resourceData.is_sub_constractor;
				});
			}
		} else {
			//if !available & !qualified check sub constractor
			if(filterSelected.subConstractors){
				rows = driversPlanning;
			}
			else{
				rows = driversPlanning.filter((item) => {
					return !item.resourceData.is_sub_constractor;
				});
			}
		}

		if (carSizeSelected.length > 0) {
			return rows.filter(
				(item) =>
					item.resourceData.icon_size?.toLowerCase() === carSizeSelected,
			);
		} else {
			//console.log('get rows', rows.length);
			//setRows(rows);
			return rows;
		}
	},[filterSelected.available,filterSelected.qualified,selectedRows,carSizeSelected]);

	useEffect(() => {
		if (recentlyAssignedOrders.newTrips.length > 0) {
			toast(<ToastBody />, { className: 'toast-wrapper' });
		}
	}, [recentlyAssignedOrders]);

	useEffect(() => {
	if(filterSelected.subConstractors){
		let subC=driversPlanning.filter(x=>x.resourceData.sub_constractor_id)
		setRows(rows.concat(subC));
	}
	else{
		setRows([...rows.filter(x=>!x.resourceData.sub_constractor_id)]);
	}
	}, [filterSelected.subConstractors])
	

	useEffect(() => {
		setLoading(true);
		let rows = getRowsToShow()
		setRows(rows);
		setAllRowsFiltered(rows);
		//setLoading(false)
		let timer = setTimeout(() => setLoading(false), 100);
		setHeightOfScroll((rows.length * 60) + 103)
		return () => {
			clearTimeout(timer);
		  }; 
	}, [filterSelected.available,filterSelected.qualified,carSizeSelected]);
	useEffect(() => {
		setLoading(true);
		let rows = getRowsToShow()
		setRows(rows);
		setNumOfResultsOfResourcesRequirementsModal(-1);//reset results
		setAllRowsFiltered(rows);
		setLoading(false)
		//let timer = setTimeout(() => setLoading(false), 100);
		setHeightOfScroll((rows.length * 60) + 103)
	}, [selectedRows])
	


	useEffect(() => {
		setbottom_scrollbar_style({
			height: '100%',
			width: `${window.innerWidth - widthOfRightSide - 240}px`,
			maxWidth: `${window.innerWidth - widthOfRightSide - 240}px`,
		});
	}, [window.innerWidth, widthOfRightSide]);

	useEffect(() => {
		let timeType = '';
		switch (timeArray.length) {
			case 12:
				timeType = 'twoHours';
				break;
			case 24:
				timeType = 'hour';
				break;
			case 48:
				timeType = 'halfHour';
				break;
			case 96:
				timeType = 'quarter';
				break;

			default:
				timeType = 'twoHours';
				break;
		}
		setTime(timeType);
	}, []);

	

	function checkScrollDirection(event) {
		if (checkScrollDirectionIsUp(event)) {
			if (scrollableElement.scrollTop === 0) {
				setSliceTo(12);
				setSliceFrom(0)
			}
		} else {
			if (
				scrollableElement.scrollTop >=
				scrollableElement.scrollHeight - scrollableElement.clientHeight -50
			) {
				if (sliceTo < rows.length) {
					setLoadingMoreData(true);
					//setSliceFrom(sliceFrom+30)
					//scrollableElement.scrollTop
					setSliceTo(sliceTo + 100);
					let timer = setTimeout(() => setLoadingMoreData(false), 300);
					return () => {
						clearTimeout(timer);
					  }; 
				}
			}
			//setLoading(false);
		}

		function checkScrollDirectionIsUp(event) {
			if (event.wheelDelta) {
				return event.wheelDelta > 0;
			}
			return event.deltaY < 0;
		}
	}

	const showResourcesRow = useCallback(()=>{
		
		return(
			rows?.slice(sliceFrom, sliceTo).map((row, index) => {
				return (
					<ResourceInModal
						driverAndTrips={row}
						key={parseInt(
							`${row.resourceData?.resource_bank_id}${row.trips?.length}`,
						)}
						selectedRows={selectedRows}
						setselectedRows={setselectedRows}
						setcancelAssignedOrders={setcancelAssignedOrders}
						cancelAssignedOrders={cancelAssignedOrders}
						time={time}
					/>
				);
			})

		)
	},[sliceTo,rows])

	return (
		<>
			{selectedRows.length > 0 ? (
				<div
					id='bottom-scroll-bar-in-modal'
					className='bottom-scroll-bar-in-modal'
					style={bottom_scrollbar_style}
					target={time}
				>
					<div
						className='filter-time-wrapper'
						style={{ width: timeArray.length === 12 ? 120 * timeArray.length + 207 : 60 * timeArray.length + 207}}
					>
						<div className='no-opacity-base-filter-time-wrapper'>
							<div className='filter-search-wrapper'>
								<ResourcesFilltering
									setselected={setFilterSelected}
									selected={filterSelected}
									numOfAllResources={allRowsFiltered.length}
								/>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										alignItems: 'center',
									}}
								>
									<SearchResourceInModal
										rows={rows}
										setRows={setRows}
										allResources={allRowsFiltered}
										selectedRows={selectedRows}
									/>
									<img
										src={openFilerByCarSize ? busIconSelected : carIcon}
										className='car-icon-left'
										alt='carIcon'
										onClick={() => filterByCarSize()}
									/>
									{openFilerByCarSize && <FilterByCarSizeModal />}
								</div>
							</div>
						</div>

						<div className='no-opacity-base-time-and-row' onClick={()=>closeOpenModals()}>
							<div className='time-and-row-wrapper'>
								{selectedRows?.map((item, index) => {
									return (
										<MarkingTripTime
											startTime={item.start}
											endTime={item.end}
											color={item.color}
											timeType={time}
											key={item.id}
										/>
									);
								})}
								<div className='time-line-top-modal'>
									<ScheduleHeader
										heightForModal={heightOfScroll}
									/>
								</div>
								<div style={style_of_row_under_time}>
									{timeArray.map((item, index) => {
											return (
												<TimeBorder index={index} time={time} key={index}/>
											);
										})}
								</div>
							</div>
							
						</div>
					</div>

					{loading ? (
						<AppLoader />
					) : (
						<>
						{showResourcesRow()}

							{loadingMoreData && <AppLoader />}
						</>
					)}

					{
						<ToastContainer
							position='bottom-left'
							autoClose={10000}
							hideProgressBar={true}
							newestOnTop={false}
							closeOnClick
							rtl={false}
							closeButton={false}
							pauseOnFocusLoss
							pauseOnHover
							theme='dark'
						></ToastContainer>
					}
				</div>
			) : (
				<div
					className='start-text-wrapper'
					style={{ width: `${viewStore.widthOfBrowser * 0.48}px` }}
				>
					<div className='start-text'>{Text.please_select_requirement}</div>
					<div className='start-text'>{Text.to_show_scedule}</div>
				</div>
			)}
		</>
	);
}

function TimeBorder({index, time}) {
	// eslint-disable-next-line
	let widthOfCell = time==="twoHours" ? 120 : 60
	let isHalfSize = (index===0 && time==="twoHours")
	return (
		<>
		<span
			className='line-in-resource-row-modal'
			target={'underSchedule'}
			style={{
				// right: `${index * cellWidth}px`,
				width: isHalfSize? `${widthOfCell/2}px`:`${widthOfCell}px`
			}}
		></span>
		</>
	);
}

export default LeftSideModal;
