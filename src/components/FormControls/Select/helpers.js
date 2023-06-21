// import { renderClassification } from '../../DataTable/helpers';
import currencies from 'constants/currencies.json';
import language_codes from 'constants/listOfLanguages.json';
import './Select.scss';
export const formatOptionsArray = ({
	optionsArray,
	table_name,
	sub_constractor_id,
	sub_constractor_name,
}) => {
	switch (table_name) {
		// case 'rounds':
		// 	return [...optionsArray.map((round) => ({ value: round, label: round }))];
		case 'customers':
			return [
				...optionsArray.map(({ pk, name, classification, address, image }) => ({
					label: name,
					value: pk,
					class: classification,
					address,
					image,
				})),
			];
		case 'vehicles':
			if (sub_constractor_id && sub_constractor_name) {
				//if we have sub constractor id - filter drivers by sub constractor
				let vehiclesOfSubConstractor = optionsArray
					.filter(
						({ sub_constractor_id: vehicle_sub_constractor_id }) =>
							vehicle_sub_constractor_id === sub_constractor_id,
					)
					.map(({ id, car_number }) => ({
						label: car_number,
						value: id,
						sub_constractor_name: sub_constractor_name,
						// nick_name,
					}));
				let vehiclesWithoutSubConstractor = optionsArray
					.filter(({ sub_constractor_id }) => !sub_constractor_id)
					.map(({ id, car_number }) => ({
						label: car_number,
						value: id,
					}));
				return [...vehiclesOfSubConstractor, ...vehiclesWithoutSubConstractor];
			} else {
				return [
					...optionsArray
						.filter((x) => !x.sub_constractor_id)
						.map(({ id, car_number }) => ({
							label: car_number,
							value: id,
						})),
				];
			}
		case 'chaperones':
			return [
				...optionsArray.map(({ id, nick_name, pk }) => ({
					label: nick_name,
					value: pk,
					nick_name,
				})),
			];
		case 'drivers':
			if (sub_constractor_id && sub_constractor_name) {
				//if we have sub constractor id - filter drivers by sub constractor
				let driversOfSubConstractor = optionsArray
					.filter(
						({ sub_constractor_id: driver_sub_constractor_id }) =>
							driver_sub_constractor_id === sub_constractor_id,
					)
					.map(({ id, nick_name }) => ({
						label: nick_name,
						value: id,
						sub_constractor_name: sub_constractor_name,
						// nick_name,
					}));
				let driversWithoutSubConstractor = optionsArray
					.filter(
						({ sub_constractor_id: driver_sub_constractor_id }) =>
							driver_sub_constractor_id !== sub_constractor_id,
					)
					.map(({ id, nick_name }) => ({
						label: nick_name,
						value: id,
					}));
				return [...driversOfSubConstractor, ...driversWithoutSubConstractor];
			} else {
				return [
					//add sub constractor id
					...optionsArray
						.filter((x) => !x.sub_constractor_id)
						.map(({ id, nick_name }) => ({
							label: nick_name,
							value: id,
							// nick_name,
						})),
				];
			}
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
				...optionsArray
					.filter(({ items_or_extra }) => items_or_extra === 'item')
					.map(({ id, line_name }) => ({
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
						value: pk,
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

//controll the selected value's label presented
export const formatOptionsLabel = (option, field_name, options) => {
	switch (field_name) {
		case 'filterHeaderText':
			return option?.label ?? '';
		case 'contact_person':
			if (option === '') return option;
			if (typeof option === 'object') return option.label;
			else {
				//find the contact person in options
				const contact_person = options.find(({ value }) => value === option);
				return contact_person?.label;
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
		default:
			return option?.label;
	}
};
