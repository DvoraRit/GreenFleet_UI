import './ModalResourceChangesInputs.scss';
import React from 'react';
import InputSelect from 'components/InputSelect/InputSelect';
import { Select } from 'components/FormControls';
import { useTranslation } from 'react-i18next';

const ModalResourceChangesInputs = ({
	formikRef,
	values,
	tripTypes,
	color,
	resourcesBank,
	sub_constractor_name,
	sub_constractor_id
}) => {
	const fields = [
		'drivers',
		'trip_types',
		'vehicles',
		'num_of_passengers',
		'chaperones',
	];

	const { t } = useTranslation();

	const formatSelectOptions = (field, options = []) => {
		switch (field) {
			case 'drivers':
				return [];
			case 'trip_types':
				return tripTypes.map(({ color, id, name }) => ({
					value: id,
					label: `${name}`,
					color: color,
				}));
			case 'num_of_passengers':
				let passengers = [];
				for (let i = 0; i < 60; i++) {
					passengers.push({ label: (i + 1).toString(), value: i + 1 });
				}
				return passengers;
			default:
				return [{ value: '', label: 'אין אפשרויות להצגה' }];
		}
	};

	const handleFieldChange = ({ value, field, label, color }) => {
		switch (field) {
			case 'drivers':
				//first we find drivers resources bank id.
				let resourceBankId = resourcesBank.find(
					({ driver_id }) => driver_id === value,
				);

				//assign it to as our value for driver
				formikRef?.current?.setFieldValue(field, {
					value: value,
					label: label,
					resource_id: resourceBankId?.resource_bank_id,
				});

				//if resource has a vehicle will assign it too
				if (!!resourceBankId?.vehicle_id) {
					formikRef?.current?.setFieldValue('vehicles', {
						value: resourceBankId?.vehicle_id,
						label: resourceBankId?.car_number,
						resource_id: resourceBankId?.resource_bank_id,
					});
				} else {
					formikRef?.current?.setFieldValue('vehicles', {
						value: '',
						label: 'לא אויש',
						resource_id: null,
					});
				}
				break;
			case 'vehicles':
				//check if driver is selected
				if (!!values?.drivers?.value) {
					//check if we have resource_bank_id for the driver and vehicle
					let resourceBankId = resourcesBank.find(
						({ driver_id, vehicle_id }) =>
							vehicle_id === value && driver_id === values?.drivers?.value,
					);
					if (!!resourceBankId) {
						//if we have a match we will update both fields with the resource_bank_id field
						formikRef?.current?.setFieldValue('drivers', {
							value: resourceBankId?.driver_id,
							label: resourceBankId?.driver_nick_name,
							resource_id: resourceBankId?.resource_bank_id,
						});

						formikRef?.current?.setFieldValue('vehicles', {
							value: value,
							label: label,
							resource_id: resourceBankId?.resource_bank_id,
						});
					} else {
						//if we don't have a match we will update only the vehicle field && reset driver resource bank
						formikRef?.current?.setFieldValue('vehicles', {
							value: value,
							label: label,
							resource_id: null,
						});
						formikRef?.current?.setFieldValue('drivers', {
							value: values?.drivers?.value,
							label: values?.drivers?.label,
							resource_id: null,
						});
					}
				} else {
					//if not we will just update vehicle and reset resource_bank id from driver
					formikRef?.current?.setFieldValue('vehicles', {
						value: value,
						label: label,
						resource_id: null,
					});
					formikRef?.current?.setFieldValue('drivers', {
						value: values?.drivers?.value,
						label: values?.drivers?.label,
						resource_id: null,
					});
				}
				break;
			case 'trip_types':
				formikRef?.current?.setFieldValue(field, {
					value: value,
					label: label,
					color: color,
				});
				break;
			case 'chaperones':
				formikRef?.current?.setFieldValue(field, {
					value: value,
					label: label,
				});
				break;
			case 'num_of_passengers':
				formikRef?.current?.setFieldValue(field, {
					value: value,
					label: `${value}`,
				});
				break;
			default:
				break;
		}
	};

	return (
		<div className='modal-resource-change-fields-container'>
			{fields?.map((field) => {
				return (
					<div
						key={field}
						className='field-container'
						style={{ marginTop: '1.5rem' }}
					>
						<Select
							key={field}
							labelId={`${field}-label`}
							// id={field}
							name={field}
							value={values[field]}
							defaultValue={values[field]}
							label={t(`forms.drive.${field}`)}
							onChange={(e) => {
								handleFieldChange({
									value: e?.value,
									label: e?.label,
									color: e?.color,
									field,
								});
							}}
							field={field}
							options={formatSelectOptions(field)}
							sub_constractor_name={sub_constractor_name}//for trips sold for sub_constractor
							sub_constractor_id={sub_constractor_id}
							// style={{ minWidth: '95%' }}
							data_source={
								field === 'drivers' ||
								field === 'chaperones' ||
								field === 'vehicles'
									? field
									: null
							}
						/>
					</div>
				);
			})}
		</div>
	);
};

export default ModalResourceChangesInputs;
