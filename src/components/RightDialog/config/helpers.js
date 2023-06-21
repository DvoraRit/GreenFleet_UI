import '../RightDialog.scss';
import CardTab from 'components/EntityForms/CardTab/CardTab';
import CardExtentionForPriceList from 'components/EntityForms/CardTab/CardExtentionForPriceList';
import PriceListCard from 'components/EntityForms/CardTab/PriceListCard';
import ContractCardForPriceList from 'components/EntityForms/CardTab/ContractCardForPriceList';
import CardDocumentTab from 'components/EntityForms/CardTab/CardDocumentTab';
import ConnectionsCardForCustomer from 'components/EntityForms/CardTab/ConnectionsCardForCustomer';
import CardForTabListStyle from 'components/EntityForms/CardTab/CardForTabListStyle/CardForTabListStyle';
import PassengersCardTabs from 'components/EntityForms/CardTab/PassengersCardTabs/PassengersCardTabs';
import { toJS } from 'mobx';
import moment from 'moment';
import {
	tabs_helper_capabilities,
	tabs_helper_expenses,
	tabs_helpers_equipment,
	tabs_helpers_document,
	tabs_helper_driver_capability,
	tabs_helper_driver_availability,
	tabs_helper_chaperone_capability,
	tabs_helper_constraints,
} from './tabs_helpers';
import SquareBoxList from 'components/SquareBoxList/SquareBoxList';
import CustomersList from 'containers/Entitis/ContainerConstraints/ContainerConstraintsList';
import PriceListDetailsRightDialog from '../components/PriceListDetailsRightDialog';
import ResourcesForSubContractors from 'components/EntityForms/CardTab/ResourcesForSubContractors'
export const renderItems = ({
	selectedEntity,
	dataList,
	tabList,
	dataForTabs,
	extraDataForTabs,
	detailsObject,
	moreDataForTabs,
	constraintsForTable,
	specialValueForModal,
	file,
}) => {
	switch (tabList[selectedEntity]) {
		case 'contracts':
			return dataForTabs?.contracts?.map((contract) => (
				<ContractCardForPriceList data={contract} />
			));
		case 'resources':
			let driversOfSubContractors = [];
			let vehiclesOfSubContractors = [];

			extraDataForTabs?.drivers?.forEach((element) => {
				let obj = {
					title: `${element.nick_name}`,
					subTitle: [
						{
							key: 'is_active',
							value: element.is_active,
							valueTranslation: true,
							showOnlyValue: true,
						},
						{
							key: 'phone_number',
							value: element.phone_number,
							showOnlyValue: true,

						},
						{
							key: 'car_number',
							value: element.car_number,
							showOnlyValue: true,
							addIcon: true,
						},
					],
				};
				driversOfSubContractors.push(obj);
			});
			extraDataForTabs?.vehicles?.forEach((element) => {
				let obj = {
					title: `${element.car_number}`,
					subTitle: [
						{
							key: 'is_active',
							value: element.is_active,
							valueTranslation: true,
							showOnlyValue: true,
						},
					],
				};
				vehiclesOfSubContractors.push(obj);
			});

			return (
				<ResourcesForSubContractors vehiclesOfSubContractors={vehiclesOfSubContractors} driversOfSubContractors={driversOfSubContractors} dataForTabs={extraDataForTabs} />
			
			);
		case 'contacts':
			let contacts = [];
			dataForTabs?.contact?.map((contact, index) => {
				//if(contact.contact_person ){
				contacts.push({
					title: `${contact.first_name} ${contact.last_name}`,
					number: index + 1,
					id: contact.contact_id,
					subTitle: [{ key: 'role', value: contact.role }],
				});
				//}
			});

			if (contacts?.length > 0) {
				return contacts?.map(
					(item, index) =>
						item.id && (
							<CardTab
								item={item}
								dataForTabs={dataForTabs[index]}
								details={dataForTabs.contact?.[index]}
								isNumbered={true}
								key={item.id}
							/>
						),
				);
			} else {
				return <div>אין אנשי קשר לחוזה זה</div>;
			}
		case 'price_list':
			if (dataForTabs?.pricesList?.length > 0) {
				return dataForTabs?.pricesList?.map((item, index) => (
					<PriceListCard item={item} key={item.price_list_id} />
				));
			} else {
				return <div>אין מחירונים לחוזה זה</div>;
			}
		case 'capabilities':
			let capabilities = tabs_helper_capabilities(dataForTabs);
			let extraVehicles = [...capabilities];

			dataForTabs?._extraVehicles
				?.filter((x) => parseInt(detailsObject?.id) === parseInt(x.vehicle_id))
				.forEach((element) => {
					let obj = {
						title: ' התקנות',
						subTitle: [
							{
								key: 'system_type',
								value: element.system_type,
								valueTranslation: true,
							},
							{
								key: 'system_name',
								value: element.system_name,
							},
							{
								key: 'system_finishing',
								value: element.system_finishing,
							},
						],
					};
					extraVehicles.push(obj);
				});

			return extraVehicles?.map((item, index) => (
				<CardTab item={item} dataForTabs={dataForTabs} key={index} />
			));

		case 'expenses':
			return <div>{`יושלם בהמשך`}</div>;
		case 'equipment':
			return <div>{`יושלם בהמשך`}</div>;
		case 'documents':
			// let documents = tabs_helpers_document(extraDataForTabs);
			let documents=[];
			if(!!file){
				file?.forEach((element) => {
					let obj = {
						title: element.file_origin_name,
					    Id: element.Id,
						subTitle: [
							{
								key: 'file_type',
								value: element.file_type,
							},
							{
								key: 'upload_at',
								value: moment.utc(element.upload_at).format('DD/MM/YYYY'),
							},
						],
					};
					documents.push(obj);
				});
			return documents.map((item, index) => (
				<CardDocumentTab
					item={item}
					dataForTabs={file}
					key={index}
				/>
			));

			}

		case 'security':
			return <div>{`יושלם בהמשך`}</div>;

		case 'lines':
			let lines = [];
			dataForTabs?._lines
				?.filter(
					(x) =>
						x.items_or_extra === 'item' &&
						detailsObject?.id === x.price_list_id,
				)
				.forEach((element) => {
					let obj = {
						title: element.line_name,
						number: element.number,
						subTitle: [
							{ key: 'tab', value: element.tab },
							{
								key: 'treshold_alert_type',
								value: element.treshold_alert_type,
							},
							{
								key: 'treshold_alert_limit',
								value: element.treshold_alert_limit,
							},
							{ key: 'driver_price', value: element.driver_price },
						],
					};
					lines.push(obj);
				});

			return lines?.map((item, index) => (
				<CardTab
					item={item}
					dataForTabs={dataForTabs}
					key={index}
					isNumbered={true}
				/>
			));
		case 'exstas':
			return dataForTabs?.extras.map((item, index) => (
				<CardExtentionForPriceList
					item={item}
					dataForTabs={dataForTabs}
					key={index}
					isNumbered={true}
				/>
			));
		case 'history':
			return <div>{`יושלם בהמשך`}</div>;
		case 'driver_capability':
			let driver_capability = tabs_helper_driver_capability(detailsObject);
			let tab_name = 'driver_capability';
			let driverCapabilitySquareBox = [
				{ key: 'wearing_glasses', value: detailsObject?.wearing_glasses },
				{ key: 'weapons_license', value: detailsObject?.weapons_license },
				{ key: 'school_visa', value: detailsObject?.school_visa },
			];
			return (
				<>
					{driver_capability?.map((dataForItem, index) => (
						<CardForTabListStyle
							key={index}
							dataForItem={dataForItem}
							tab_name={tab_name}
							dataForTabs={detailsObject}
						/>
					))}
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							marginTop: 10,
						}}
					>
						{driverCapabilitySquareBox?.map((dataForItem, index) => (
							<SquareBoxList
								dataForItem={dataForItem}
								tab_name={tab_name}
								dataForTabs={detailsObject}
								key={index}
							/>
						))}
					</div>
				</>
			);
		case 'chaperone_capability':
			let chaperone_capability =
				tabs_helper_chaperone_capability(detailsObject);
			let tab_name_to = 'chaperone_capability';
			return (
				<>
					{chaperone_capability?.map((dataForItem, index) => (
						<CardForTabListStyle
							key={index}
							dataForItem={dataForItem}
							tab_name={tab_name_to}
							dataForTabs={detailsObject}
						/>
					))}
				</>
			);
		case 'chaperone_availability':
			let chaperone_availability =
				tabs_helper_driver_availability(detailsObject);
			let tabName = 'chaperone_availability';
			let chaperoneAvailabilitySquareBox = [
				{ key: 'work_at_weekend', value: detailsObject?.work_at_weekend },
				{
					key: 'work_day_before_weekend',
					value: detailsObject?.work_day_before_rest_day,
				},
			];

			return (
				<>
					{chaperone_availability?.map((dataForItem, i) => (
						<CardForTabListStyle
							key={i}
							dataForItem={dataForItem}
							tab_name={tabName}
							dataForTabs={detailsObject}
						/>
					))}
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							marginTop: 10,
						}}
					>
						{chaperoneAvailabilitySquareBox?.map((dataForItem, index) => (
							<SquareBoxList
								dataForItem={dataForItem}
								tab_name={tabName}
								dataForTabs={detailsObject}
								key={index}
							/>
						))}
					</div>
				</>
			);

		case 'driver_availability':
			let driver_availability = tabs_helper_driver_availability(detailsObject);
			let driverAvailabilitySquareBox = [
				{ key: 'can_sleep_outside', value: detailsObject?.can_sleep_outside },
				{ key: 'work_at_weekend', value: detailsObject?.work_at_weekend },
				{
					key: 'work_day_before_weekend',
					value: detailsObject?.work_day_before_rest_day,
				},
			];

			let tab = 'driver_availability';
			return (
				<>
					{driver_availability?.map((dataForItem, i) => (
						<CardForTabListStyle
							key={i}
							dataForItem={dataForItem}
							tab_name={tab}
							dataForTabs={detailsObject}
						/>
					))}
					<div
						style={{
							display: 'flex',
							justifyContent: 'flex-end',
							marginTop: 10,
						}}
					>
						{driverAvailabilitySquareBox?.map((dataForItem, index) => (
							<SquareBoxList
								dataForItem={dataForItem}
								tab_name={tab}
								dataForTabs={detailsObject}
								key={index}
							/>
						))}
					</div>
				</>
			);

		case 'driver_connection':
			let connection = [];
			extraDataForTabs.length > 0 &&
				extraDataForTabs.forEach((element, index) => {
					let obj = {
						title: `${element.contact_phone}`,
						number: index + 1,
						id: element.id,
						subTitle: [
							{
								key: 'contact_name',
								value: element.contact_name,
							},
							{ key: 'contact_relation', value: element.contact_relation },
						],
					};
					connection.push(obj);
				});
			let detailsConnection = { ...extraDataForTabs };
			return connection.map((item, i) => (
				<CardTab
					item={item}
					dataForTabs={extraDataForTabs[i]}
					details={detailsConnection}
					key={i}
					isNumbered={true}
					canEditAndDelete={true}
					table_name={'driver_contacts'}
					nameOfTab={'driver_connection'}
				/>
			));
		case 'chaperone_connection':
			let chaperone_connection = [];
			extraDataForTabs.length > 0 &&
				extraDataForTabs.forEach((element, index) => {
					let obj = {
						title: `${element.contact_phone}`,
						id: element.id,
						number: index + 1,
						subTitle: [
							{
								key: 'contact_name',
								value: element.contact_name,
							},
							{ key: 'contact_relation', value: element.contact_relation },
						],
					};
					chaperone_connection.push(obj);
				});
			let details = { ...extraDataForTabs };
			return chaperone_connection.map((item, i) => (
				<CardTab
					item={item}
					dataForTabs={extraDataForTabs[i]}
					details={details}
					key={i}
					isNumbered={true}
					canEditAndDelete={true}
					table_name={'chaperone_contacts'}
					nameOfTab={'chaperone_connection'}
				/>
			));
		// chaperone_connection
		case 'driver_equipment':
			return <div>{`יושלם בהמשך`}</div>;

		case 'driver_training':
			return <div>{`יושלם בהמשך`}</div>;
		case 'driver_documents':
			return <div>{`יושלם בהמשך`}</div>;
		case 'driver_security':
			return <div>{`יושלם בהמשך`}</div>;
		case 'driver_history':
			return <div>{`יושלם בהמשך`}</div>;

		case 'contracts':
			return <div>{`יושלם בהמשך`}</div>;

		case 'constraints':
			return (
				<CustomersList detailsObject={detailsObject} entity_name='customers' />
			);
		case 'sub_constractors_constraints':
			return (
				<CustomersList
					detailsObject={detailsObject}
					entity_name='sub_constructors'
				/>
			);

		case 'customers_contacts':
			return moreDataForTabs?.map((item, index) => (
				<ConnectionsCardForCustomer
					item={item}
					key={index}
					specialValueForModal={specialValueForModal}
				/>
			));

		case 'passengers':
			return <PassengersCardTabs passengersData={extraDataForTabs} />;
		case 'holidays':
			return <div>{`יושלם בהמשך`}</div>;

		default:
			return dataList.map((item) => <div>{`${item} default`}</div>);
	}
};

export const formatValue = ({ key, value }, dataTableStore) => {
	switch (key) {
		case 'scope':
		case 'scopes':
			let zones = toJS(dataTableStore?.getScopeLabel(value)) ?? '';
			return zones;
		case 'car_type_name':
			let car_type =
				toJS(dataTableStore?.getCarTypeLabel(parseInt(value))) ?? '';
			return car_type;
		case 'status':
			switch (parseInt(value)) {
				case 1:
					return <span style={{ color: '#2EC4B6' }}>פעיל</span>;
					break;
				case 0:
					return <span style={{ color: 'red' }}>לא פעיל</span>;
				case 2:
					return <span style={{ color: '#0000FE' }}>טיוטה </span>;
				case 3:
					return <span style={{ color: '#FF8F00' }}>הצעת מחיר </span>;
				case 4:
					return <span style={{ color: 'rgba(0,0,0,0.6)' }}>הסתיים </span>;
				default:
					break;
			}
		case 'available':
			if (parseInt(value) === 1) {
				return <span style={{ color: '#2EC4B6' }}>פעיל</span>;
			} else {
				return <span style={{ color: 'red' }}>לא פעיל</span>;
			}
		case 'is_active':
			if (parseInt(value) === 1) {
				return <span style={{ color: '#2EC4B6' }}>פעיל</span>;
			} else {
				return <span style={{ color: 'red' }}>לא פעיל</span>;
			}
		case 'vat':
			if (parseInt(value) === 1) {
				return <span>כולל</span>;
			} else {
				return <span>לא כולל</span>;
			}
		case 'type': {
			switch (value) {
				case 'lines':
					return 'קווים';
				case 'destinations':
					return 'יעדים';
				case 'type':
					return 'סוג נסיעה';
				default:
					return 'לא ידוע';
			}
		}
		case 'items': {
			return <PriceListDetailsRightDialog items={value} />;
		}
		default:
			return <span className='value-text'>{value}</span>;
	}
};
export const renderDataForTabs = ({
	selectedEntity,
	dataList,
	tabList,
	dataForTabs,
}) => {
	let information;
	switch (tabList[selectedEntity]) {
		case 'capabilities':
			information = [
				{
					title: 'מידע טכני',
					subTitle: [
						{ key: 'brand', value: dataForTabs?.brand },
						{ key: 'model', value: dataForTabs?.model },
					],
				},
				{
					title: ' יכולות',
					subTitle: [
						{ key: 'seats', value: dataForTabs?.seats },
						{ key: 'seats_standing', value: dataForTabs?.seats_standing },
						{ key: 'car_type_name', value: dataForTabs?.car_type_name },
					],
				},
				// {
				// 	title: ' התקנות',
				// 	subTitle: [
				// 		{ key: 'system_type', value: 1 },
				// 		{ key: 'system_name', value:2},
				// 		{ key: 'system_finishing', value:3 },
				// 	],
				// },
			];

			return information;
		case 'expenses':
			information = [
				{
					title: 'אחזקה',
					subTitle: [
						{ key: 'brand', value: dataForTabs.brand },
						{ key: 'model', value: dataForTabs.model },
					],
				},
				{
					title: 'הוצאות',
					subTitle: [
						{ key: 'seats', value: dataForTabs.seats },
						{ key: 'seats_standing', value: dataForTabs.seats_standing },
						{ key: 'car_type_name', value: dataForTabs.car_type_name },
					],
				},
			];
			return information;
		case 'equipment':
			information = [
				{
					title: ` ${dataForTabs.expenses} שם הפריט`,
					//'expenses'
					subTitle: [
						{ key: 'expenses_count', value: dataForTabs.expenses_count },
						{ key: 'expenses_date', value: dataForTabs.expenses_date },
						{
							key: 'expenses_driver_name',
							value: dataForTabs.expenses_driver_name,
						},
						{ key: 'expenses_date_2', value: dataForTabs.expenses_date_2 },
						{
							key: 'expenses_reciver_name',
							value: dataForTabs.expenses_reciver_name,
						},
					],
				},
				//כמות ,ביקורת אחרונה ,נהג,החזרה,מקבל
			];
			return information;

		case 'documents':
			// information = [
			// 	{
			// 		title: ` ${dataForTabs.brand} שם המסמך`,
			// 		//'expenses'
			// 		subTitle: [
			// 			{ key: 'expenses_count', value: dataForTabs.expenses_count },
			// 			{ key: 'expenses_date', value: dataForTabs.expenses_date },
			// 			{
			// 				key: 'expenses_driver_name',
			// 				value: dataForTabs.expenses_driver_name,
			// 			},
			// 			{ key: 'expenses_date_2', value: dataForTabs.expenses_date_2 },
			// 			{
			// 				key: 'expenses_reciver_name',
			// 				value: dataForTabs.expenses_reciver_name,
			// 			},
			// 		],
			// 	},
			// ];
			return [];
		default:
			return dataList.map((item) => <div>{`${item} default`}</div>);
	}
};
