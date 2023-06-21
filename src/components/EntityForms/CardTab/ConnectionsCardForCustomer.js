import React, { useEffect, useState } from 'react';
import DescriptionSharpIcon from '@mui/icons-material/DescriptionSharp';
import { useTranslation } from 'react-i18next';
import { useRecoilState } from 'recoil';
import { getAllCustomers } from 'recoil/atoms';
import TableDataService from 'services/TableDataService';

function ConnectionsCardForCustomer({ item, specialValueForModal }) {
	const [rightDialog, setRightDialog] = useState(false);
	const [priceListDetails, setPriceListDetails] = useState({ ...item });
	const [connectedCustomerData, setConnectedCustomerData] = useState({
		...item,
	});
	const [allCustomers, setAllCustomers] = useRecoilState(getAllCustomers);

	const { t } = useTranslation();
	const typeOtConnections = {
		1: t(`connectionFather`),
		2: t(`connectionBrother`),
		3: t(`connectionSon`),
	};

	const toggleRightDialog = () => {
		setRightDialog((state) => !state);
	};
	const removeConnection = () => {

		const result = TableDataService.deleteContactsForCustomer({
			customerId: 2,
			contactId: specialValueForModal,
			entityName: 'customers',
		});
		if (!!result) {
			return result;
		} else {
			return null;
		}
	};

	const handleClick = () => {
	};
	return (
		<>
			<div className='price-list-card-wrapper' onClick={handleClick}>
				{!!connectedCustomerData?.customer_icon ? (
					<img
						src={connectedCustomerData?.customer_icon}
						style={{ maxHeight: 45 }}
						alt='customer_icon'
					/>
				) : (
					<div className='oval-gray-bg'>
						<DescriptionSharpIcon color='action' fontSize='small' />
					</div>
				)}
				<div className='price-details-wrapper'>
					<div className='price-name-text'>{connectedCustomerData?.name}</div>
					<div className='num-of-items-in-priceList'>
						{typeOtConnections[item?.contact_type]}
					</div>
					{parseInt(connectedCustomerData?.is_active) === 1 ? (
						<div className='price-status-active'>פעיל</div>
					) : (
						<div className='price-status-not-active'>לא פעיל</div>
					)}

					{connectedCustomerData?.account_id && (
						<div className='num-of-items-in-priceList'>
							{connectedCustomerData?.account_id}
						</div>
					)}
				</div>
				<div className='remove-Connection' onClick={() => removeConnection()}>
					<div>{t(`removeConnection`)}</div>
				</div>
			</div>
		</>
	);
}

export default ConnectionsCardForCustomer;
