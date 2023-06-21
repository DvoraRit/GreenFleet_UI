import * as React from 'react';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';

import './SubmitButton.scss';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function BasicButtons({
	loadingPosition = 'start',
	variant = 'contained',
	label,
	disabled,
	action = () => {},
	loading,
	labelStyle,
	buttonStyle,
	canEdit=true,
}) {
	const theme = createTheme({
		palette: {
			success: {
				main: '#2EC4B6',
			},
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<Stack spacing={2} direction='row' className='submit-button-container'>
				{(
					<LoadingButton
						disabled={disabled ||!canEdit}
						variant={variant}
						onClick={action}
						// sx={{ backgroundColor: color }}
						className='submit-button'
						color='success'
						loadingPosition={loadingPosition}
						loading={loading}
						sx={{ ...buttonStyle }}
					>
						<span className='submit-button-label' style={{ ...labelStyle }}>
							{label}
						</span>
					</LoadingButton>
				)}
			</Stack>
		</ThemeProvider>
	);
}
