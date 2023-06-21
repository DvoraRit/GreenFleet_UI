import React from 'react';
import link_off from '../../assets/icons/link_off.svg';
import './LinkOff.scss';
import OrdersService from '../../services/planning/OrdersService';
import { _disconnectOrdersFromLink, _updatedConnectedOrders, _countersOfCommenOrders} from '../../recoil/atoms'
import { useRecoilState } from 'recoil';
import { useStores } from 'stores/index';
import { toJS } from 'mobx';

function LinkOff({
	id1,
	id2,
	commonOrderNumber,
}) {
	const [disconnectOrdersFromLink, setDisconnectOrdersFromLink] = useRecoilState(_disconnectOrdersFromLink);
	const [updatedConnectedOrders, setUpdatedConnectedOrders] = useRecoilState(_updatedConnectedOrders);
	const [countersOfCommenOrders, setCountersOfCommenOrders] = useRecoilState(_countersOfCommenOrders);
	const { resourceBankStore } = useStores();
	
	function arrays_equal(a,b) { return !!a && !!b && !(a<b || b<a); }

	const disconnectOrders = () => {
		try {
			let ids=[id1, id2];
			let indexToRemove = countersOfCommenOrders.findIndex(x=>arrays_equal(x[1],ids))
	
		OrdersService.disconnectOrders(ids).then((res)=>{
			setCountersOfCommenOrders(
				countersOfCommenOrders.slice(0,indexToRemove).concat(countersOfCommenOrders.slice(indexToRemove+1))
				);
				setUpdatedConnectedOrders(!updatedConnectedOrders)
				setDisconnectOrdersFromLink(!disconnectOrdersFromLink)
		})
			// OrdersService.disconnectOrders(ids).then((res)=>{
			// 	setCountersOfCommenOrders(
			// 		countersOfCommenOrders.filter(
			// 			(x) => x[0] !== commonOrderNumber,
			// 		)
			// 		);
			// 		setUpdatedConnectedOrders(!updatedConnectedOrders)
			// 		setDisconnectOrdersFromLink(!disconnectOrdersFromLink)
			// })
			//update data in store
			let indexInStore1 = resourceBankStore.resourceBank.findIndex(x=>x.order_id===id1)
			let indexInStore2 = resourceBankStore.resourceBank.findIndex(x=>x.order_id===id2)
			let newData=toJS(resourceBankStore.resourceBank)
			newData[indexInStore1].commonOrderNumber = null;
			newData[indexInStore2].commonOrderNumber = null;
			resourceBankStore.setResourceBank(newData)
		} catch (e) {
			console.error(`disconnect orders ${id1} & ${id2} faild`, e);
		}
	};
	return (
		<div className='link-off-no-opacity-bg' onClick={() => disconnectOrders()}>
			<div id='Link-off-connected-orders' className='link-off-bg'>
				<img src={link_off} alt='link_off' />
			</div>
		</div>
	);
}

export default LinkOff;
