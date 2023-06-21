import {
	Input,
	Select,
	Switch,
	FilePicker,
	Checkbox,
	DatePicker,
	SelectCheckbox,
	SimpleDocsPicker,
	TimePicker,
	InputNumber,
} from '../../FormControls';
import Box from '@mui/material/Box';

import { renderClassification, renderIconSize } from '../../DataTable/helpers';

export const getFormComponent = (type) => {
	switch (type) {
		case 'input':
			return Input;
		case 'inputNumber':
				return InputNumber;
		case 'select':
			return Select;
		case 'SelectCheckbox':
			return	SelectCheckbox;
		case 'switch':
			return Switch;
		case 'filePicker':
			return FilePicker;
		case 'Checkbox':
			return Checkbox;
		case 'DatePicker':
				return DatePicker;
		case 'DocumentPicker':
			return DocumentPicker;
		case 'simpleDocsPicker':
				return SimpleDocsPicker;
		case 'timePicker':
					return TimePicker;
		default:
			return Input;
	}
};

export const getOptionsForSelect = ({
	field_name,
	table_name,
	drop_list_values,
}) => {
	let options = [];
	try {
		options = drop_list_values?.split(',');
	} catch (e) {
		console.error(e);
	}
	// if (!!drop_list_values) {
	// options = JSON.parse(drop_list_values);
	// }

	if (Array.isArray(options)) {
		switch (field_name) {
			case 'classification':
				return [...options.map((option) => ({ label: option, value: option }))];
			case 'icon_size':
				return [...options.map((option) => ({ label: option, value: option }))];
			case 'religion':
				return [...options.map((option) => ({ label: option, value: option }))];
			default:
				return [];
		}
	} else {
		return [];
	}
};

export const formatOptionForSelect = (props, option, name) => {
	switch (name) {
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
		case 'icon_size':
			let iconCarSize = renderIconSize(option.label);
			return (
				<Box
					component='li'
					sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
					{...props}
				>
					<div> {option.label}</div>
					<img loading='lazy' width='20' src={iconCarSize} alt='' />
				</Box>
			);
		default:
			return (
				<Box component='li' {...props}>
					{option?.title ?? option?.label}
				</Box>
			);
	}
};

export const orderFormBySections = (fields) => {
	//function is accepting an array of obj from fields_of_table and returns an obj with section number as key and array of fields from obj type fields_of_table as value

	return fields.reduce((total, current) => {
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
			modal_index,
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
						modal_index,
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
						modal_index,
					},
				],
			};
		} else {
			console.error('how did this happened');
			return {};
		}
	}, {});
};
