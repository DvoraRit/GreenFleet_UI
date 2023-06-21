// import { renderClassification } from '../../DataTable/helpers';
import currencies from 'constants/currencies.json';
import language_codes from 'constants/listOfLanguages.json';

export const formatOptionsArray = ({ optionsArray, table_name }) => {
	switch (table_name) {
		case 'customers':
			return [
				...optionsArray.map(({ pk, name }) => ({ label: name, value: pk })),
			];
		case 'vehicles':
			return [
				...optionsArray.map(({ id, car_number }) => ({
					label: car_number,
					value: id,
				})),
			];
		case 'chaperones':
			return [
				...optionsArray.map(({ pk, nick_name }) => ({
					label: nick_name,
					value: pk,
					nick_name,
				})),
			];
		case 'drivers':
			return [
				...optionsArray.map(({ id, nick_name }) => ({
					label: nick_name,
					value: id,

					// nick_name,
				})),
			];
		case 'zones':
			return [
				...optionsArray.map(({ id, zone }) => ({
					label: zone,
					value: zone,

					// nick_name,
				})),
			];
		case 'scopes':
			return [
				...optionsArray.map(({ id, zone }) => ({
					label: zone,
					value: zone,

					// nick_name,
				})),
			];
		case 'scope':
			return [
				...optionsArray.map(({ id, zone }) => ({
					label: zone,
					value: zone,

					// nick_name,
				})),
			];
		case 'car_type_name':
			return [
				...optionsArray.map(({ id, type_name }) => ({
					label: type_name,
					value: type_name,
				})),
			];
		case 'contracts':
			return [
				...optionsArray.map(({ id, contract_name }) => ({
					label: contract_name,
					value: id,

					// nick_name,
				})),
			];
		case 'price_list':
			return [
				...optionsArray.map(({ id, price_list_name }) => ({
					label: price_list_name,
					value: id,

					// nick_name,
				})),
			];
		case 'price_extra':
			return [
				...optionsArray.map(({ id, line_name }) => ({
					label: line_name,
					value: id,

					// nick_name,
				})),
			];
		case 'type_id':
			return [
				...optionsArray.map(({ id, color, name }) => ({
					label: name,
					value: id,
					color: color,

					// nick_name,
				})),
			];
		case 'vehicles_type':
			return [
				...optionsArray
					.filter(({ name }) => !!name.trim())
					.map(({ id, pk, name }) => ({
						label: name,
						value: name,
					})),
			];
		case 'vehicles_type_name':
			return [
				...optionsArray
					.filter(({ name }) => !!name.trim())
					.map(({ id, pk, name }) => ({
						label: name,
						value: name,
					})),
			];

		default:
			return [];
	}
};

export const formatOptionsLabel = (option, field_name) => {
	switch (field_name) {
		case 'status':
			if (typeof option === 'object') return option.label;
			else {
				switch (option) {
					case '0':
						return 'לא פעיל';
					case '1':
						return 'פעיל';
					case '2':
						return 'טיוטה';
					case '3':
						return 'הצעת מחיר';
					case '4':
						return 'הסתיים';
					default:
						return '';
				}
			}
		case 'language':
			if (typeof option === 'object') return option.label;
			else {
				return language_codes[option]?.nativeName;
			}
		case 'languages':
			if (typeof option === 'object') return option.label;
			else {
				return language_codes[option]?.nativeName;
			}
		case 'available':
			if (typeof option === 'object') return option.label;
			else {
				switch (option) {
					case '0':
						return 'לא פעיל';
					case '1':
						return 'פעיל';

					default:
						return '';
				}
			}
		// case 'type':
		// 	if (typeof option === 'object') return option.label;
		// 	else {
		// 		switch (option) {
		// 			case '0':
		// 				return 'לא פעיל';
		// 			case '1':
		// 				return 'פעיל';

		// 			default:
		// 				return '';
		// 		}
		// 	}
		case 'type':
			if (typeof option === 'object') return option.label;
			else {
				switch (option) {
					case 'lines':
						return 'קווים';
					case 'destinations':
						return 'יעדים';
					case 'type':
						return 'סוג נסיעה';
					default:
						return '';
				}
			}

		case 'currency':
			if (typeof option === 'object') return option.label;
			else {
				return currencies[option]?.he_name;
			}
		case 'vat':
			if (typeof option === 'object') return option.label;
			else {
				switch (option) {
					case 1:
						return 'כולל';
					case 0:
						return 'לא כולל';

					default:
						return '';
				}
			}
		// case 'type_id':
		// 	return option?.label + '123';
		default:
			return option?.label;
	}
};
