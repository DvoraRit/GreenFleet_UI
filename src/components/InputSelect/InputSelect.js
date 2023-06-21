import React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import './InputSelect.scss';
import { useTranslation } from 'react-i18next';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { prefixer } from 'stylis';

function InputSelect({
	options,
	field,
	style,
	defaultValue,
	// width,
	...inputProps
}) {
	const cacheRtl = createCache({
		key: 'muirtl',
		stylisPlugins: [prefixer, rtlPlugin],
	});

	const theme = createTheme({
		direction: 'rtl',
	});


	const { t } = useTranslation();

	return (
		<CacheProvider value={cacheRtl}>
			<Box sx={{ m: 1, minWidth: 160, ...style }}>
				<FormControl variant='standard' sx={{ m: 1, minWidth: 80, ...style }}>
					<InputLabel
						id='demo-simple-select-autowidth-label'
						sx={{
							direction: 'rtl',
							textAlign: 'right',
							minWidth: '90%',
							padding: '0 15px 0 0px',
						}}
					>
						{t(`fields.${field}`)}
					</InputLabel>
					<Select
						defaultValue={defaultValue?.toString()}
						{...{ ...inputProps }}
						labelId='demo-simple-select-autowidth'
						id='demo-simple-select-autowidth'
						autoWidth
						sx={{
							direction: 'rtl',
							display: 'flex',
							justifyContent: 'flex-start',
							// textAlign: 'right',
							// backgroundColor: 'yellow'
						}}
					>
						{options.map((option) => {
							return (
								<MenuItem
									key={option}
									value={option?.value}
									sx={{
										direction: 'rtl',
										width: '100%',
									}}
								>
									<div className='option-container'>
										{option?.color && (
											<div
												className='color-container'
												style={{ backgroundColor: option?.color }}
											></div>
										)}
										{option?.label}
									</div>
								</MenuItem>
							);
						})}
					</Select>
				</FormControl>
			</Box>
		</CacheProvider>
	);
}

export default InputSelect;
