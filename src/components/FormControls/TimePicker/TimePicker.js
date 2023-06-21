import * as React from 'react';

import TextField from '../Input/Input';

import AdapterDateFns from '@mui/lab/AdapterDateFns';
import TimePicker from '@mui/lab/TimePicker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function BasicTimePicker({ value, onChange, label }) {

	const getTimezoneOffset = (value) => value.getTimezoneOffset() * 60000;

	const makeLocalAppearUTC = (value) => {
		const dateTime = new Date(value);
		const utcFromLocal = new Date(
			dateTime.getTime() + getTimezoneOffset(dateTime),
		);
		return utcFromLocal;
	};

	const localToUTC = (dateTime) => {
		const utcFromLocal = new Date(
			dateTime.getTime() - getTimezoneOffset(dateTime),
		);
		return utcFromLocal;
	};

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<TimePicker
				sx={{
					backgroundColor: 'yellow',
					borderWidth: 0,
				}}
				style={{
					backgroundColor: 'yellow',
					borderWidth: 0,
				}}
				ampm={false}
				ampmInClock={false}
				// variant='standard'
				label={label}
				value={makeLocalAppearUTC(value)}
				onChange={(newValue) => {
					onChange(localToUTC(newValue));
				}}
				renderInput={(params) => {
					return <TextField {...params} variant='standard' />;
				}}
			/>
		</LocalizationProvider>
	);
}
