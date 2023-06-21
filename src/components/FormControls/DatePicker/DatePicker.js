import DatePicker from '@mui/lab/DatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';

import { create } from 'jss';
import { StylesProvider, jssPreset } from '@mui/styles';
// import { Button, MenuItem, TextField } from '@mui/material';
import TextField from '../Input/Input';

import rtl from 'jss-rtl';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import moment from 'moment';


export default function DatePickerComponent({
	value,
	name,
	onChange,
	label,
	input,
	width,
	...params
}) {
	const jss = create({
		plugins: [...jssPreset().plugins, rtl()],
	});
	const { t } = useTranslation();


	return (
		// <StylesProvider jss={jss}>
			<LocalizationProvider dateAdapter={AdapterDateFns}>
				<DatePicker
                	id={name}
					label={t(`entity_form.datePicker.${name}`)}
					inputFormat='dd/MM/yyyy'
					onChange={onChange}
					value={value}
					renderInput={(params) => (
						<TextField
							{...params}
							variant='standard'
							InputLabelProps={{ style: { right: 0 } }}
						/>
					)}
				/>
			</LocalizationProvider>
		// </StylesProvider>
	);
}
