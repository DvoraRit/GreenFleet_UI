import Box from '@mui/material/Box';
import PropTypes from 'prop-types';

export const entityTabs = {
	customers: [
		'contracts',
		'constraints',
		'customers_contacts',
		'passengers',
		'holidays',
	],
	sub_constractors: [
		'contracts',
		'sub_constractors_constraints',
		'resources',
	],
	vehicles: [
		'capabilities',
		'expenses',
		'equipment',
		'documents',
		'security',
		// 'treatments',
		'history',
	],
	drivers: [
		'driver_connection',
		'driver_capability',
		'driver_availability',
		'driver_training',
		'driver_equipment',
		'documents',
		'driver_security',
		'driver_history',
	],
	chaperones: [
		'chaperone_connection',
		'chaperone_capability',
		'chaperone_availability',
		'driver_training',
		'driver_equipment',
		'documents',
		'driver_security',
		'driver_history',
	],

	price_list: ['lines', 'exstas', 'contracts'],
	contracts: ['price_list', 'contacts'],
};

export const entityTitleField = {
	customers: 'name',
	vehicles: 'car_number',
	price_list: 'price_list_name',
	contacts: 'contact_name',
	drivers: 'nick_name',
	chaperones: 'nick_name',
	orders_containers: 'order_container_name',
	sub_constractors: 'name',
	passengers:"first_name",
	contracts: 'contract_name',
};

export function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`full-width-tabpanel-${index}`}
			aria-labelledby={`full-width-tab-${index}`}
			{...other}
		>
			{value === index && <Box sx={{ p: 3 }}>{children}</Box>}
		</div>
	);
}

TabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

export function a11yProps(index) {
	return {
		id: `full-width-tab-${index}`,
		'aria-controls': `full-width-tabpanel-${index}`,
	};
}
