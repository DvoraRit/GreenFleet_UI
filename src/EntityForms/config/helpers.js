import {
	Input,
	Select,
	Switch,
	FilePicker,
	DocumentPicker,
	Checkbox,
	LinesTable,
	ExtrasTable,
	DatePicker,
	Vehicles_capabilities_linesTable,
	InputNumber,
	ItemsOfContract,
	LinesTableDrivers,
	ConstraintsTable,
	SelectCheckbox,
	OrdersPriceExtrasTable,
	SimpleDocsPicker,
	TimePicker,
	// Expenses_receiver_linesTable,
} from '../../FormControls';
import Box from '@mui/material/Box';
import NoDataToShowHelper from './NoDataToShowHelper';
import currencies from '../../../constants/currencies.json';
import language_codes from '../../../constants/listOfLanguages.json';
import { renderClassification, renderIconSize } from '../../DataTable/helpers';
import TableDataService from 'services/TableDataService';
import { constraintsExtraFieldsOfTable } from '../CreateEntityForm/create_entity_form_config';
import { toJS } from 'mobx';
import moment from 'moment';

export const getFormComponent = (type) => {
	switch (type) {
		case 'input':
			return Input;
		case 'inputNumber':
			return InputNumber;
		case 'select':
			return Select;
		case 'SelectCheckbox':
			return SelectCheckbox;
		case 'multiple_select':
			return Select;
		case 'switch':
			return Switch;
		case 'filePicker':
			return FilePicker;
		case 'linesTable':
			return LinesTable;
		case 'LinesTableDrivers':
			return LinesTableDrivers;
		case 'Vehicles_capabilities_linesTable':
			return Vehicles_capabilities_linesTable;
		//this table will be made after vehicles_maintenance
		case 'expenses_receiver_linesTable':
		// return Expenses_receiver_linesTable;
		case 'extrasTable':
			return ExtrasTable;
		case 'noDataYet':
			return NoDataToShowHelper;
			case 'simpleDocsPicker':
				return SimpleDocsPicker;
		case 'DocumentPicker':
			return DocumentPicker;
		case 'Checkbox':
			return Checkbox;
		case 'DatePicker':
			return DatePicker;
		case 'itemsOfContract':
			return ItemsOfContract;
		case 'constraints_table':
			return ConstraintsTable;
		case 'timePicker':
				return TimePicker;
    case 'ordersPriceExtrasTable':
      return OrdersPriceExtrasTable;
		default:
			return Input;
	}
};
export const getDataForUpdateModals = (tab_name) => {
	let data = [];
	switch (tab_name) {
		case 'constraints':
		case 'sub_constractors_constraints': {
			return constraintsExtraFieldsOfTable;
		}
		case 'uploadPassengersDocument': {
			data=[
				{
					//שם נהג
					table_name: 'passengers',
					field_name: 'import passengers',
					label: 'nick_name',
					is_active: 1,
					component: 'filePicker',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '',
				}
			]
			return data;
		}

		case 'resources': {
			data = [
				{
					//שם נהג
					table_name: 'drivers',
					field_name: 'nick_name',
					label: 'nick_name',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '',
				},
				//טלפון

				{
					table_name: 'drivers',
					field_name: 'phone_number',
					label: 'phone_number',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 2,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					is_required: 1,
					middle_modal_column_width: '',
				},
				//מספר רכב
				{
					table_name: 'vehicles',
					field_name: 'car_number',
					label: 'car_number',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 3,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					is_required: 1,
					middle_modal_column_width: '',
				},
			];
			return data;
		}
		case 'contacts': {
			let fields = JSON.parse(localStorage.getItem('fields_of_table'));
			let table_name = 'contacts';
			fields = fields.filter(
				({
					table_name: table_name,
					middle_modal_order,
					middle_modal_section_index,
				}) =>
					table_name === 'contacts' &&
					!!middle_modal_order &&
					!!middle_modal_section_index,
			);
			data = [...fields];
			return data;
		}
		case 'customers_contracts': {
			let fields = JSON.parse(localStorage.getItem('fields_of_table'));
			let table_name = 'contacts';
			fields = fields.filter(
				({
					table_name: table_name,
					middle_modal_order,
					middle_modal_section_index,
				}) =>
					table_name === 'contacts' &&
					!!middle_modal_order &&
					!!middle_modal_section_index,
			);
			data = [...fields];
			return data;
		}
		case 'passengers': {
			let fields = JSON.parse(localStorage.getItem('fields_of_table'));
			let table_name = 'passengers';
			fields = fields.filter(
				({
					table_name: table_name,
					middle_modal_order,
					middle_modal_section_index,
				}) =>
					table_name === 'passengers' &&
					!!middle_modal_order &&
					!!middle_modal_section_index,
			);
			data = [...fields];
			return data;
		}
		case 'customers_contacts': {
			let fields = JSON.parse(localStorage.getItem('fields_of_table'));
			let table_name = 'customers_contacts';
			fields = fields.filter(
				({
					table_name: table_name,
					middle_modal_order,
					middle_modal_section_index,
				}) =>
					table_name === 'customers_contacts' &&
					!!middle_modal_order &&
					!!middle_modal_section_index,
			);
			data = [...fields];
			return data;
		}
		case 'chaperone_connection':
			data = [
				{
					table_name: 'chaperone_connection',
					field_name: 'contact_name',
					label: 'contact_name',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '',
				},
				// דגם

				{
					table_name: 'chaperone_connection',
					field_name: 'contact_phone',
					label: 'contact_phone',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 2,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '',
				},
				{
					table_name: 'chaperone_connection',
					field_name: 'contact_relation',
					label: 'contact_relation',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 3,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '',
				},
			];
			return data;
		case 'driver_connection':
			data = [
				{
					table_name: 'driver_connection',
					field_name: 'contact_name',
					label: 'contact_name',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '',
				},
				// דגם

				{
					table_name: 'driver_connection',
					field_name: 'contact_phone',
					label: 'contact_phone',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 2,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '',
				},
				{
					table_name: 'driver_connection',
					field_name: 'contact_relation',
					label: 'contact_relation',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 3,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '',
				},
			];
			return data;

		case 'driver_capability':
			data = [
				// יצרן

				{
					table_name: 'drivers',
					field_name: 'license_number',
					label: 'license_number',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 5,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '33%',
				},
				// דגם

				{
					table_name: 'drivers',
					field_name: 'license_expiration',
					label: 'license_expiration',
					is_active: 1,
					component: 'DatePicker',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 5,
					middle_modal_order: 2,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '33%',
				},
				{
					table_name: 'drivers',
					field_name: 'languages',
					label: 'languages',
					is_active: 1,
					component:'multiple_select', 
					drop_list_values: '',
					drop_list_Header: 'בחר שפה',
					middle_modal_section_index: 5,
					middle_modal_order: 3,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '33%',
				},
				{
					table_name: 'drivers',
					field_name: 'religion',
					label: 'religion',
					is_active: 1,
					component: 'select',
					drop_list_values: 'muslim,christian,jew',
					drop_list_Header: 'דת',
					middle_modal_section_index: 5,
					middle_modal_order: 4,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '33%',
				},
				{
					table_name: 'drivers',
					field_name: 'gender',
					label: 'gender',
					is_active: 1,
					component: 'select',
					drop_list_values: 'M,F',
					drop_list_Header: 'מגדר',
					middle_modal_section_index: 5,
					middle_modal_order: 5,
					max_length: 60,
					validation: '',
					data_source: '',
					is_required: 1,
					can_edit: 1,
					middle_modal_column_width: '33%',
				},
				{
					table_name: 'drivers',
					field_name: 'capabilities',
					label: 'capabilities',
					is_active: 1,
					component: 'SelectCheckbox',
					drop_list_values: 'הסעת תלמידים,משקפיים,סיווג, אקדח',
					drop_list_Header: '',
					middle_modal_section_index: 5,
					middle_modal_order: 6,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '33%',
				},
				{
					table_name: 'drivers',
					field_name: 'license_type',
					label: 'license_type',
					is_active: 1,
					component: 'LinesTableDrivers',
					drop_list_values: ' ',
					drop_list_Header: '',
					middle_modal_section_index: 6,
					middle_modal_order: 7,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '100%',
				},
			];
			return data;

		case 'chaperone_capability':
			data = [
				// יצרן
				{
					table_name: 'chaperones',
					field_name: 'language',
					label: 'language',
					is_active: 1,
					component: 'multiple_select',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '',
				},
				{
					table_name: 'chaperones',
					field_name: 'religion',
					label: 'religion',
					is_active: 1,
					component: 'select',
					drop_list_values: 'muslim,christian,jew',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 2,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					is_required: 1,
					middle_modal_column_width: '',
				},
				{
					table_name: 'drivers',
					field_name: 'gender',
					label: 'gender',
					is_active: 1,
					component: 'select',
					drop_list_values: 'M,F',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 3,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					is_required: 1,
					middle_modal_column_width: '',
				},
			];
			return data;
		case 'driver_availability':
			data = [
				{
					table_name: 'drivers',
					field_name: 'rest_day',
					label: 'rest_day',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 4,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},

				{
					table_name: 'drivers',
					field_name: 'contract_type',
					label: 'contract_type',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 4,
					middle_modal_order: 2,
					max_length: 60,
					validation: '',
					data_source: '',
					is_required: 1,
					can_edit: 1,
				},
				{
					table_name: 'drivers',
					field_name: 'work_at_weekend',
					label: 'work_at_weekend',
					is_active: 1,
					component: 'Checkbox',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 4,
					middle_modal_order: 3,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '100%',
				},
				{
					table_name: 'drivers',
					field_name: 'can_sleep_outside',
					label: 'can_sleep_outside',
					is_active: 1,
					component: 'Checkbox',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 4,
					middle_modal_order: 4,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '100%',
				},
				{
					table_name: 'drivers',
					field_name: 'work_day_before_rest_day',
					label: 'work_day_before_rest_day',
					is_active: 1,
					component: 'Checkbox',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 4,
					middle_modal_order: 5,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '100%',
				},
			];
			return data;

		case 'chaperone_availability':
			data = [
				{
					table_name: 'chaperones',
					field_name: 'rest_day',
					label: 'rest_day',
					is_active: 1,
					component: 'input',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					is_required: 1,
				},

				{
					table_name: 'chaperones',
					field_name: 'contract_type',
					label: 'contract_type',
					is_active: 1,
					component: 'input',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 2,
					max_length: 60,
					validation: '',
					data_source: '',
					is_required: 1,
					can_edit: 1,
				},
				// {
				// 	table_name: 'chaperones',
				// 	field_name: 'work_at_weekend',
				// 	label: 'work_at_weekend',
				// 	is_active: 1,
				// 	component: 'Checkbox',
				// 	drop_list_values: '',
				// 	drop_list_Header: '',
				// 	middle_modal_section_index: 1,
				// 	middle_modal_order: 3,
				// 	max_length: 60,
				// 	validation: '',
				// 	data_source: '',
				// 	can_edit: 1,
				// 	middle_modal_column_width: '100%',
				// },
				{
					table_name: 'chaperones',
					field_name: 'is_working_at_rest_day',
					label: 'is_working_at_rest_day',
					is_active: 1,
					component: 'Checkbox',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 3,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '100%',
				},
				{
					table_name: 'chaperones',
					field_name: 'is_working_day_before_rest_day',
					label: 'is_working_day_before_rest_day',
					is_active: 1,
					component: 'Checkbox',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 4,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
					middle_modal_column_width: '100%',
				},
			];
			return data;
		case 'capabilities':
			data = [
				// יצרן

				{
					table_name: 'vehicles',
					field_name: 'brand',
					label: 'brand',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				// דגם

				{
					table_name: 'vehicles',
					field_name: 'model',
					label: 'model',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 2,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//קוד דגם
				{
					table_name: 'vehicles',
					field_name: 'model_code',
					label: 'model_code',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 3,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				// מועד יצור

				{
					table_name: 'vehicles',
					field_name: 'manufacture_year',
					label: 'manufacture_year',
					is_active: 1,
					component: 'DatePicker',
					drop_list_values: 'קטן, בינוני, גדול',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 4,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				// מספר שילדה

				{
					table_name: 'vehicles',
					field_name: 'frame_number',
					label: 'frame_number',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 5,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				// מספר מנוע

				{
					table_name: 'vehicles',
					field_name: 'engine_number',
					label: 'engine_number',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 6,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//  גודל צמיג

				{
					table_name: 'vehicles',
					field_name: 'wheel_size',
					label: 'wheel_size',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 7,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},

				//  תאריך רכישה

				{
					table_name: 'vehicles',
					field_name: 'date_of_purchase',
					label: 'date_of_purchase',
					is_active: 1,
					component: 'DatePicker',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 8,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},

				//  תאריך מכירה

				{
					table_name: 'vehicles',
					field_name: 'date_of_sale',
					label: 'date_of_sale',
					is_active: 1,
					component: 'DatePicker',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 9,
					max_length: 60,
					validation: '',
					can_edit: 1,
					data_source: '',
				},
				//   גימור
				{
					table_name: 'vehicles',
					field_name: 'system_finishing',
					label: 'system_finishing',
					is_active: 1,
					component: 'select',
					drop_list_values: '1,2,3,4,5 ',
					drop_list_Header: '',
					middle_modal_section_index: 1,
					middle_modal_order: 10,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//2 מקומות ישיבה
				{
					table_name: 'vehicles',
					field_name: 'seats',
					label: 'seats',
					is_active: 1,
					component: 'inputNumber',
					drop_list_values: ' ',
					drop_list_Header: '',
					middle_modal_section_index: 2,
					middle_modal_order: 11,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//2 מקומות עמידה

				{
					table_name: 'vehicles',
					field_name: 'seats_standing',
					label: 'seats_standing',
					is_active: 1,
					component: 'inputNumber',
					drop_list_values: ' ',
					drop_list_Header: '',
					middle_modal_section_index: 2,
					middle_modal_order: 12,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//2  הסעת תלמידים

				{
					table_name: 'vehicles',
					field_name: 'fit_pupils',
					label: 'fit_pupils',
					is_active: 1,
					component: 'Checkbox',
					drop_list_values: ' ',
					drop_list_Header: '',
					middle_modal_section_index: 2,
					middle_modal_order: 13,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//2  נגישות לנכים

				{
					table_name: 'vehicles',
					field_name: 'fit_disabled',
					label: 'fit_disabled',
					is_active: 1,
					component: 'Checkbox',
					drop_list_values: ' ',
					drop_list_Header: '',
					middle_modal_section_index: 2,
					middle_modal_order: 14,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				}, //2  הסעת חיילים

				{
					table_name: 'vehicles',
					field_name: 'fit_soldiers',
					label: 'fit_soldiers',
					is_active: 1,
					component: 'Checkbox',
					drop_list_values: ' ',
					drop_list_Header: '',
					middle_modal_section_index: 2,
					middle_modal_order: 15,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				}, //2  תיירות

				{
					table_name: 'vehicles',
					field_name: 'fit_turism',
					label: 'fit_turism',
					is_active: 1,
					component: 'Checkbox',
					drop_list_values: ' ',
					drop_list_Header: '',
					middle_modal_section_index: 2,
					middle_modal_order: 16,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				{
					table_name: 'vehicles',
					field_name: 'system_type',
					label: 'system_type',
					is_active: 1,
					component: 'Vehicles_capabilities_linesTable',
					drop_list_values: ' ',
					drop_list_Header: '',
					middle_modal_section_index: 2,
					middle_modal_order: 17,
					max_length: 60,
					validation: '',
					data_source: '',
					middle_modal_column_width: '100%',
					can_edit: 1,
				},
			];
			//להכניס אחר כך חלק ב וחלק ג-הטבלה
			//vehicles_capabilities_linesTable

			return data;
		case 'expenses':
			data = [
				// מד אוץ

				{
					table_name: 'vehicles_extra',
					field_name: 'odometer',
					label: 'odometer',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 3,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				// מועד מד אוץ

				{
					table_name: 'vehicles_extra',
					field_name: 'odometer_date',
					label: 'odometer_date',
					is_active: 1,
					component: 'DatePicker',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 3,
					middle_modal_order: 2,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				// תאריך לטיפול הבא-תאריך
				{
					table_name: 'vehicles_extra',
					field_name: 'next_treatment_date',
					label: 'next_treatment_date',
					is_active: 1,
					component: 'DatePicker',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 3,
					middle_modal_order: 3,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//  קילומטרז לטיפול הבא

				{
					table_name: 'vehicles_extra',
					field_name: 'next_treatment_distance',
					label: 'next_treatment_distance',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 3,
					middle_modal_order: 4,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				// באחזקה-רדיו סוג

				{
					table_name: 'vehicles_extra',
					field_name: 'in_maintenance',
					label: 'in_maintenance',
					is_active: 1,
					component: 'switch',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 3,
					middle_modal_order: 5,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//		//this table will be made after vehicles_maintenance

				//expenses_reciver_linesTable
				{
					table_name: 'vehicles_extra',
					field_name: 'expenses_date',
					label: 'system_type',
					is_active: 1,
					component: 'noDataYet',
					drop_list_values: ' ',
					drop_list_Header: '',
					middle_modal_section_index: 3,
					middle_modal_order: 17,
					max_length: 60,
					validation: '',
					data_source: '',
					middle_modal_column_width: '100%',
					can_edit: 1,
				},
			];
			return data;
		//   טבלה ב-פריטים ,שם,כמות,מחיר, מחיר עבודה
		case 'equipment':
			data = [
				//  פריט
				{
					table_name: 'vehicles_extra',
					field_name: 'expenses',
					label: 'expenses',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 4,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//  כמות

				{
					table_name: 'vehicles_extra',
					field_name: 'expenses_count',
					label: 'expenses_count',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 4,
					middle_modal_order: 2,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//   מועד ביצוע
				{
					table_name: 'vehicles_extra',
					field_name: 'expenses_date',
					label: 'expenses_date',
					is_active: 1,
					component: 'DatePicker',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 5,
					middle_modal_order: 3,
					max_length: 60,
					validation: '',
					can_edit: 1,
					data_source: '',
				},
				//    נהג

				{
					table_name: 'vehicles_extra',
					field_name: 'expenses_driver_name',
					label: 'expenses_driver_name',
					is_active: 1,
					component: 'select',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 5,
					middle_modal_order: 4,
					max_length: 60,
					validation: '',
					data_source: 'drivers',
					can_edit: 1,
				},
				// מועד ביצוע

				{
					table_name: 'vehicles_extra',
					field_name: 'expenses_date_2',
					label: 'expenses_date_2',
					is_active: 1,
					component: 'DatePicker',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 6,
					middle_modal_order: 5,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				// מקבל

				{
					table_name: 'vehicles_extra',
					field_name: 'expenses_reciver_name',
					label: 'expenses_reciver_name',
					is_active: 1,
					component: 'select',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 6,
					middle_modal_order: 6,
					max_length: 60,
					validation: '',
					data_source: 'drivers',
					can_edit: 1,
				},
			];

			return data;
		case 'documents':
			data = [
				//  פריט
				{
					table_name: 'documents',
					field_name: 'description',
					label: 'file_type',
					is_active: 1,
					component: '',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 7,
					middle_modal_order: 1,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//  כמות

				{
					table_name: 'documents',
					field_name: 'upload_at',
					label: 'upload_at',
					is_active: 1,
					component: 'DatePicker',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 7,
					middle_modal_order: 2,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
				//   מועד ביצוע
				{
					table_name: 'documents',
					field_name: 'file_path',
					label: 'file_path',
					is_active: 1,
					component: 'DocumentPicker',
					drop_list_values: '',
					drop_list_Header: '',
					middle_modal_section_index: 7,
					middle_modal_order: 3,
					max_length: 60,
					validation: '',
					data_source: '',
					can_edit: 1,
				},
			];

			return data;

		default:
			return data;
	}
};

export const getOptionsForSelect = ({
	field_name,
	table_name,
	drop_list_values,
	rowData,
}) => {
	let options = [];
	try {
		options = drop_list_values?.split(',');
	} catch (e) {
		console.error(e);
	}

	if (Array.isArray(options)) {
		switch (field_name) {
			case 'contact_person':
				if (Array.isArray(rowData?.contact)) {
					return [
						...rowData?.contact.map((person) => ({
							label: `${person.first_name} ${person.last_name}`,
							value: person.contact_id,
						})),
					];
				}
			case 'contact_type':
				let contactType = [];
				options.forEach((option) => {
					if (option === '3') {
						contactType.push({ label: 'בן', value: option });
					}
					if (option === '2') {
						contactType.push({ label: 'אח', value: option });
					}
					if (option === '1') {
						contactType.push({ label: 'אב ', value: option });
					}
				});
				return contactType;
				break;
				case 'repete_every':
					//none,every week,week,month,year,half,quarter
					let repeat_every = [];
					options.forEach((option) => {
						if (option === 'none') {
							repeat_every.push({ label: 'ללא', value: option });
						}
						if (option === 'every week') {
							repeat_every.push({ label: 'כל שבוע', value: option });
						}
						if (option === 'week') {
							repeat_every.push({ label: 'שבוע ', value: option });
						}
						if (option === 'month') {
							repeat_every.push({ label: 'חודש ', value: option });
						}
						if (option === 'year') {
							repeat_every.push({ label: 'שנה ', value: option });
						}
						if (option === 'half') {
							repeat_every.push({ label: 'חציון ', value: option });
						}
						if (option === 'quarter') {
							repeat_every.push({ label: 'רבעון ', value: option });
						}
					});
					return repeat_every;
					break;
					case 'description':
						let description = [];
						options.forEach((option) => {
							if (option === 'repeat_by_date') {
								description.push({ label: 'תאריך', value: option });
							}
							if (option === 'repeat_dy_number ') {
								description.push({ label: 'כמות ', value: option });
							}
						});
						return description;
						break;
					case 'orders':
						case 'planning':
						case 'control':
						case 'hr':
						case 'safety':
						case 'entities':
						case 'show_percent':
						case 'show_cost':
						case 'users':
						case 'orders':
						case 'maintenance':
					let permissions = [];
					options.forEach((option) => {
						if (option === '3') {
							permissions.push({ label: 'מלא', value: parseFloat(option) });
						}
						if (option === '2') {
							permissions.push({ label: 'חלקי', value: parseFloat(option) });
						}
						if (option === '1') {
							permissions.push({ label: 'צפיה בלבד ', value: parseFloat(option) });
						}
						if (option === '0') {
							permissions.push({ label: 'ללא ', value: parseFloat(option) });
						}
					});
					return permissions;

			case 'classification':
				return [...options.map((option) => ({ label: option, value: option }))];
			// case 'customer_id':
			// 	return [...options.map((option) => ({ label: option, value: option }))];

			case 'system_finishing':
				return [...options.map((option) => ({ label: option, value: option }))];
			case 'travel_management_system':
				return [...options.map((option) => ({ label: option, value: option }))];
			case 'gender':
				//man,female,else
				let gender_result = [];
				options.forEach((option) => {
					if (option === 'M') {
						gender_result.push({ label: 'זכר', value: option });
					}
					if (option === 'F') {
						gender_result.push({ label: 'נקבה ', value: option });
					}
					if (option === 'else') {
						gender_result.push({ label: 'אחר ', value: option });
					}
				});
				return gender_result;
			case 'religion':
				let religion_result = [];
				options.forEach((option) => {
					if (option === 'muslim') {
						religion_result.push({ label: 'מוסלמי', value: option });
					}
					if (option === 'christian') {
						religion_result.push({ label: 'נוצרי ', value: option });
					}
					if (option === 'jew') {
						religion_result.push({ label: 'יהודי ', value: option });
					}
				});
				return religion_result;
			case 'icon_size':
				let icon_size_result = [];
				options.forEach((option) => {
					if (option === 'Small') {
						icon_size_result.push({ label: 'קטן', value: option });
					}
					if (option === 'Medium') {
						icon_size_result.push({ label: 'בינוני ', value: option });
					}
					if (option === 'Large') {
						icon_size_result.push({ label: 'גדול ', value: option });
					}
				});
				return icon_size_result;
			case 'currency':
				return [
					...Object.values(currencies).map((option) => ({
						label: option.he_name,
						value: option.short_name,
					})),
				];
			case 'capabilities':
				return [...options.map((option) => ({ label: option, value: option }))];

			case 'language':
				return [
					...Object.values(language_codes).map((option) => ({
						label: option.nativeName,
						value: option.name,
					})),
				];
			case 'languages':
				return [
					...Object.values(language_codes).map((option) => ({
						label: option.nativeName,
						value: option.name,
					})),
				];

			case 'status':
				let status_result = [];
				options.forEach((option) => {
					if (option === '1') {
						status_result.push({ label: 'פעיל', value: option });
					}
					if (option === '0') {
						status_result.push({ label: 'לא פעיל', value: option });
					}
					if (option === '2') {
						status_result.push({ label: 'טיוטה', value: option });
					}
					if (option === '3') {
						status_result.push({ label: 'הצעת מחיר', value: option });
					}
					if (option === '4') {
						status_result.push({ label: 'הסתיים', value: option });
					}
				});
				return status_result;
			case 'contact_type':
				let contact_type = [];
				options.forEach((option) => {
					if (option === '3') {
						contact_type.push({ label: 'בן', value: option });
					}
					if (option === '2') {
						contact_type.push({ label: 'אח', value: option });
					}
					if (option === '1') {
						contact_type.push({ label: 'אב ', value: option });
					}
				});
				return contact_type;

				case 'orders':
					case 'planning':
					case 'control':
					case 'hr':
					case 'safety':
					case 'entities':
					case 'show_percent':
					case 'show_cost':
					case 'users':
					case 'orders':
					case 'maintenance':
				let permissionsUserRole = [];
				options.forEach((option) => {
					if (option === '3') {
						permissionsUserRole.push({ label: 'מלא', value: parseFloat(option) });
					}
					if (option === '2') {
						permissionsUserRole.push({ label: 'חלקי', value: parseFloat(option) });
					}
					if (option === '1') {
						permissionsUserRole.push({ label: 'צפיה בלבד ', value: parseFloat(option) });
					}
					if (option === '0') {
						permissionsUserRole.push({ label: 'ללא ', value: parseFloat(option) });
					}
				});
				return permissionsUserRole;
			case 'is_active':
				let option_result = [];
				options.forEach((option) => {
					if (option === '1') {
						option_result.push({ label: 'פעיל', value: option });
					}
					if (option === '0') {
						option_result.push({ label: 'לא פעיל', value: option });
					}
				});
				return option_result;
			case 'available':
				let available = [];
				options.forEach((option) => {
					if (option === '1') {
						available.push({ label: 'פעיל', value: option });
					}
					if (option === '0') {
						available.push({ label: 'לא פעיל', value: option });
					}
				});
				return available;
			case 'type':
				let type_result = [];
				options.forEach((option) => {
					if (option === 'lines') {
						type_result.push({ label: 'קווים', value: option });
					}
					if (option === 'destinations') {
						type_result.push({ label: 'יעדים', value: option });
					}
					if (option === 'type') {
						type_result.push({ label: 'סוגי נסיעה', value: option });
					}
				});
				return type_result;
			case 'vat':
				let vate_result = [];
				options.forEach((option) => {
					if (option === '1') {
						vate_result.push({ label: 'כולל', value: option });
					}
					if (option === '0') {
						vate_result.push({ label: 'לא כולל', value: option });
					}
				});
				return vate_result;
			default:
				return [];
		}
	} else {
		return [];
	}
};

export const formatOptionForSelect = (props, option, name,onChange, selectedValues) => {

	switch (name) {
		case 'zones':
			let checked = false;
			if (!!selectedValues){
				let selectedArray = selectedValues.split(',');
				checked =selectedArray.includes(option.value);
			}
			return(
				<Box component='li' {...props}>
					<Checkbox label={option?.label} value={checked} size={"small"} onChange={onChange}/>           
				</Box>
				)
		case 'zone':
		case 'cartype_name':
			let is_checked = false;
			if (!!selectedValues){
				let selectedArray = selectedValues.split(',');
				is_checked =selectedArray.includes(option.value);
			}
			return(
				<Box component='li' {...props}>
					<Checkbox label={`${option?.label} (${option?.count})` } value={is_checked} size={"small"} 
					onChange={()=>onChange(option?.label,name, option?.value)}/>           
				</Box>
				)
		case 'classification':
			let Icon = renderClassification(option.label);
			return (
				<Box
					component='li'
					sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
					{...props}
				>
					<img loading='lazy' width='20' src={Icon} alt='' />
				</Box>
			);
		case 'currency':
		case 'religion':
			return (
				<Box component='li' {...props}>
					<span>{option.label}</span>
				</Box>
			);
		// case 'languages':
		case 'travel_management_system':
		case 'type':
		case 'vat:':
			return (
				<Box component='li' {...props}>
					<span>{option?.title ?? option?.label}</span>
				</Box>
			);
			break;

		case 'status':
			return (
				<Box component='li' {...props}>
					<span>{option.label}</span>
				</Box>
			);
			break;

		case 'available':
			return (
				<Box component='li' {...props}>
					<span>{option.label}</span>
				</Box>
			);
			break;

		case 'icon_size':
			let iconCarSize = renderIconSize(option.value);
			return (
				<Box
					component='li'
					sx={{
						justifyContent: 'center',
						display: 'flex',
						alignItems: 'center',
					}}
					{...props}
				>
					<div
						style={{
							color: 'rgba(0,0,0,0.87)',
							fontFamily: 'Rubik',
							fontSize: '18px',
						}}
					>
						{option.label}
					</div>
					<img loading='lazy' width='15' src={iconCarSize} alt='' />
				</Box>
			);
		case 'drivers':
		case 'vehicles':
			if(option.sub_constractor_name){
				return (
					<Box component='li' {...props}>
						<span>{option.label}</span>
						<div style={{border:"1px solid rgba(0,0,0,0.5)",
							borderRadius: "50px",
							height:"1px",
							marginRight: "0.3rem",
							marginLeft: "0.3rem"}}></div>
						<div style={{
							color: "#2EC4B6",
							fontSize: "14px"
						}}>{option.sub_constractor_name}</div>
					</Box>
				);
			}
			else{
				return (
					<Box component='li' {...props}>
						<span>{option.label}</span>
					</Box>
				);
			}
			default:
			return (
				<Box component='li' {...props}>
					<span>{option?.title ?? option?.label}</span>
				</Box>
			);
	}
};

export const orderFormBySections = (fields) => {
	//function is accepting an array of obj from fields_of_table and returns an obj with section number as key and array of fields from obj type fields_of_table as value
	return fields
		.sort((a, b) => a?.middle_modal_order - b?.middle_modal_order)
		.reduce((total, current) => {
			const {
				field_name,
				label,
				component,
				drop_list_values,
				drop_list_Header,
				max_length,
				validation,
				middle_modal_section_index,
				middle_modal_order,
				data_source,
				...rest
			} = current;

			if (!!total?.[current?.middle_modal_section_index]) {
				return {
					...total,
					[current?.middle_modal_section_index]: [
						...total[current?.middle_modal_section_index],
						{
							field_name,
							label,
							component,
							drop_list_values,
							drop_list_Header,
							max_length,
							validation,
							middle_modal_section_index,
							middle_modal_order,
							data_source,
							...rest,
						},
					],
				};
			} else if (!!current?.middle_modal_section_index) {
				return {
					...total,
					[current?.middle_modal_section_index]: [
						{
							field_name,
							label,
							component,
							drop_list_values,
							drop_list_Header,
							max_length,
							validation,
							middle_modal_section_index,
							middle_modal_order,
							data_source,
							...rest,
						},
					],
				};
			} else {
				console.error('how did this happened');
				return {};
			}
		}, {});
};

const getEntityLabelById = async (name, id) => {
	switch (name) {
		case 'classification':
			let res = await TableDataService.getLabeLById({ table_name: name, id });
			return 'abvd';
		default:
			return id;
	}
};

function base64toBlob(base64Data, contentType) {
	contentType = contentType || '';
	var sliceSize = 1024;
	var byteCharacters = atob(base64Data);
	var bytesLength = byteCharacters.length;
	var slicesCount = Math.ceil(bytesLength / sliceSize);
	var byteArrays = new Array(slicesCount);

	for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
		var begin = sliceIndex * sliceSize;
		var end = Math.min(begin + sliceSize, bytesLength);

		var bytes = new Array(end - begin);
		for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
			bytes[i] = byteCharacters[offset].charCodeAt(0);
		}
		byteArrays[sliceIndex] = new Uint8Array(bytes);
	}
	return new Blob(byteArrays, { type: contentType });
}

function getBase64(file) {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result);
		reader.onerror = (error) => reject(error);
	});
}

function urltoFile(url, filename, mimeType) {
	mimeType = mimeType || (url.match(/^data:([^;]+);/) || '')[1];
	return fetch(url)
		.then(function (res) {
			return res.arrayBuffer();
		})
		.then(function (buf) {
			return new File([buf], filename, { type: mimeType });
		});
}

export const transformForUpdate = (
	values,
	dataTableStore,
	contactPeopleOfContract,
) => {
	let transformedValues = { ...values };
	let zones = toJS(dataTableStore?.getScopeLabel(values['scope'])) ?? '';
	// let religion =values['religion'];

	Object.entries(values).forEach(([key, value]) => {
		switch (key) {
			case 'latitude':
				transformedValues[key] = `${value},${values.longitude}` ?? '' 
				break;
			case 'classification':
				transformedValues[key] = {
					value: value ?? '',
					label: value ?? '',
				};
				break;
			case 'religion':
				transformedValues[key] = {
					value: value ?? '',
					label: value ?? '',
				};
				break;
			case 'gender':
				transformedValues[key] = {
					value: value ?? '',
					label: value ?? '',
				};
				break;

			case 'scope':
				transformedValues[key] = {
					value: value ?? '',
					label: value ? zones : '',
				};
				break;
			case 'scopes':
				transformedValues[key] = {
					value: value ?? '',
					label: value ? zones : '',
				};
				break;
			case 'car_type_name':
				transformedValues[key] = {
					value: value ?? '',
					label: value ?? '',
				};
				break;
			case 'image':
				transformedValues[key] = { base64: value };
				break;
			case 'customer_icon':
				transformedValues[key] = !!value ? { base64: value } : {};
				break;
			case 'language':
				transformedValues[key] = transformedValues[key] = {
					value: value ?? '',
					label: value ?? '',
				};
			// case 'languages':
			// 	transformedValues[key] = {
			// 		value: value ?? '',
			// 		label: value ?? '',
			// 	};
			// 	break;
			case 'customer_id':
				transformedValues[key] = {
					value: value ?? '',
					label: value ?? '',
				};
				break;
			case 'license_expiration':
				transformedValues[key] = {
					value: moment.utc(value).format('YYYY-MM-DD HH:mm:ss') ?? '',
				};
				break;
			case 'birth_date':
				transformedValues[key] = {
					value: moment.utc(value).format('YYYY-MM-DD') ?? '',
				};
				break;
			case 'contact_person':
				const contact_person = values.contact?.find(
					(x) => x.contact_id === value,
				);
				if (contact_person) {
					transformedValues[key] = {
						value: value,
						label: `${contact_person.first_name} ${contact_person.last_name}`,
					};
					//transformedValues[key] = `${contact_person.first_name} ${contact_person.last_name}`;
					break;
				}
			case 'status':
				switch (value) {
					case '0':
						transformedValues[key] = {
							value: value,
							label: 'לא פעיל',
						};
						break;
					case '1':
						transformedValues[key] = {
							value: value,
							label: 'פעיל',
						};
						break;
					case '2':
						transformedValues[key] = {
							value: value,
							label: 'טיוטה',
						};
						break;
					case '3':
						transformedValues[key] = {
							value: value,
							label: 'הצעת מחיר',
						};
						break;
					case '4':
						transformedValues[key] = {
							value: value,
							label: 'הסתיים',
						};
						break;
					default:
						transformedValues[key] = value ?? '';
						break;
				}
				break;
			case 'currency':
				transformedValues[key] = {
					value: value ?? '',
					label: currencies[value]?.he_name,
				};
				break;
			case 'vat':
				switch (value) {
					case 1:
						transformedValues[key] = {
							value: value ?? '',
							label: 'כולל',
						};
						break;
					case 2:
						transformedValues[key] = {
							value: value ?? '',
							label: 'לא כולל',
						};
						break;
					default:
						break;
				}
				break;
			case 'type':
				switch (value) {
					case 'lines':
						transformedValues[key] = {
							value: value ?? '',
							label: 'קווים',
						};
						break;
					case 'destinations':
						transformedValues[key] = {
							value: value ?? '',
							label: 'יעדים',
						};
						break;
					case 'type':
						transformedValues[key] = {
							value: value ?? '',
							label: 'סוג נסיעה',
						};
						break;
					default:
						return '';
				}
				break;
			default:
				transformedValues[key] = value ?? '';
				break;
		}
	});
	return { ...transformedValues };
};
