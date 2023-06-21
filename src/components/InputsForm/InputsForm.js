import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { makeStyles } from '@mui/styles';
import './input.scss';


export default function InputsForm({ label, options }) {
    const useStyles = makeStyles({
        formControl: {
            fontFamily: 'Rubik cursive !important',
            color: 'rgba(0,0,0,0.87) !important',
            fontSize:'14px !important',
        },
        box:{
            marginTop:'90px !important',
            marginBottom:'10px !important',
            width: '150px !important',
        }
      });
	return (
		<Box sx={{ minWidth: 190 }}>
			<FormControl >
				<InputLabel variant='standard' htmlFor='uncontrolled-native'>
					{label}
				</InputLabel>
				<NativeSelect
					defaultValue={30}
					inputProps={{
						name: 'age',
						id: 'uncontrolled-native',
					}}
				>
					{options.map((r) => (
						<option value={r.value}>{r.value}</option>
					))}
				</NativeSelect>
			</FormControl>
		</Box>
	);
}
