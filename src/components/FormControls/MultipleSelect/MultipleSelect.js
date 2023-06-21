import React, { useState, useEffect } from 'react';
import Input from '../Input/Input';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TableDataService from 'services/TableDataService';
import { formatOptionsArray, formatOptionsLabel } from './helpers';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import { formatOptionForSelect } from 'components/EntityForms/config/helpers';
import Chip from '@mui/material/Chip';
import SearchIcon from '@mui/icons-material/Search';
import Stack from '@mui/material/Stack';
import './MultipleSelect';

const LIMIT = 1000;
const sortBy = 'id';

const filter = createFilterOptions();

export default function MultipleSelect({
	value,
	name,
	onChange,
	formatOptions = formatOptionForSelect,
	label,
	options = [],
	size = 'medium',
	data_source,
	multi,
	creatable,
	createDialog,
	containerStyle,
	inputStyle,
	isHeader,
	rightIcon,
	width,
	dataFilter,
}) {
	//TODO: async select option.
	//check if i get options array
	//if yes - present the options
	//if not - call get options method.
	//the method will get the field_name as table_name and will send an api request to fetch data

	const [asyncOptions, setAsyncOptions] = useState([]);
	const [loadingOptions, setLoadingOptions] = useState(false);
	const [searchFilter, setSearchFilter] = useState('');

	const { t } = useTranslation();

	const handleFilterChange = (v) => {
		if (v?.target?.value === '') {
			onChange({ label: '', value: '' });
		}
		setSearchFilter(v?.target?.value);
	};

	const formatSelectValueToShow = (v) => {
		return v;
	};

	useEffect(() => {
		setLoadingOptions(true);

		if (!!data_source) {
			// use options for async select
			(async () => {
				let optionsData = {};
				if (data_source !== 'local') {
					optionsData = await TableDataService.getTableData({
						LIMIT,
						page: 0,
						sortBy,
						searchFilter,
						dataFilter,
						table_name: data_source,
					});

					if (Array.isArray(optionsData?.rows)) {
						setAsyncOptions(
							formatOptionsArray({
								optionsArray: [...optionsData.rows],
								table_name: data_source,
							}),
						);
					}
				} else {
					optionsData = {
						rows: JSON.parse(localStorage.getItem(name)),
					};

					if (Array.isArray(optionsData?.rows)) {
						setAsyncOptions(
							formatOptionsArray({
								optionsArray: [...optionsData.rows],
								table_name: name,
							}),
						);
					}
				}
			})();
		}

		setLoadingOptions(false);
	}, [data_source, searchFilter, dataFilter]);

	const defaultProps = {
		options: !!data_source
			? asyncOptions.filter(({ label, value }) => !!label && !!value)
			: options,
		getOptionLabel: (option) => formatOptionsLabel(option, name),
		renderOption: (props, option) => formatOptions(props, option, name),
		// ...(creatable && {
		filterOptions: (options, params) => {
			const filtered = filter(options, params);

			const { inputValue } = params;
			// Suggest the creation of a new value
			const isExisting = options.some((option) => inputValue === option.label);
			if (inputValue !== '' && !isExisting) {
				filtered.push({
					inputValue: inputValue,
					value: inputValue,
					label: inputValue,
					title: `חפש ${inputValue}`,
				});
			}

			return filtered;
		},
		isOptionEqualToValue: (option, value) => {
			return option.value === value.value || value?.value === '';
		},
		multiple: multi,
		// }),
	};

	//TODO: add isOptionEqualToValue to kill warning

	return (
		<Autocomplete
			{...defaultProps}
			value={formatSelectValueToShow(value)}
			id={name}
			name={name}
			disableClearable
			onChange={(e, v) => {
				onChange(v);
			}}
			// label={label}
			sx={{
				flex: 1,
				width: '100%',
				...containerStyle,
				// // backgroundColor: 'yellow',
				// ...(width ? { maxWidth: width, minWidth: width } : { width: '90%' }),
			}}
			// style={{ maxWidth: 100 }}
			variant={''}
			autoComplete
			includeInputInList
			size={size}
			renderInput={(params) => {
				return (
					<div style={{ marginRight: !!rightIcon ? -12 : 0 }}>
						{' '}
						<Input
							{...params}
							label={label}
							isHeader={isHeader}
							onChange={handleFilterChange}
							// sx={{ ...inputStyle }}
							underline={false}
							InputProps={{
								// dir: 'rtl',
								sx: {
									direction: 'ltr',
									...inputStyle,
									// backgroundColor: 'blue',
								},
								// type: 'search',
								// style: {backgroundColor: 'red' , label: {backgroundColor: 'red'}},
								...params.InputProps,
								endAdornment: (
									<React.Fragment>
										{loadingOptions ? (
											<CircularProgress color='inherit' size={20} />
										) : !!rightIcon ? (
											<SearchIcon
												style={{ right: -20, position: 'absolute' }}
											/>
										) : null}
										{params.InputProps.endAdornment}
									</React.Fragment>
								),
							}}
						/>
					</div>
				);
			}}
		/>
	);
}
// import * as React from 'react';
// import { useTheme } from '@mui/material/styles';
// import OutlinedInput from '@mui/material/OutlinedInput';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';

// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;
// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
// };

// const names = [
//   'Oliver Hansen',
//   'Van Henry',
//   'April Tucker',
//   'Ralph Hubbard',
//   'Omar Alexander',
//   'Carlos Abbott',
//   'Miriam Wagner',
//   'Bradley Wilkerson',
//   'Virginia Andrews',
//   'Kelly Snyder',
// ];

// function getStyles(name, personName, theme) {
//   return {
//     fontWeight:
//       personName.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   };
// }

// export default function MultipleSelect() {
//   const theme = useTheme();
//   const [personName, setPersonName] = React.useState([]);

//   const handleChange = (event) => {
//     const {
//       target: { value },
//     } = event;
//     setPersonName(
//       // On autofill we get a stringified value.
//       typeof value === 'string' ? value.split(',') : value,
//     );
//   };

//   return (
//     <div>
//       <FormControl sx={{ m: 1, width: 300 }}>
//         <InputLabel id="demo-multiple-name-label">Name</InputLabel>
//         <Select
//           labelId="demo-multiple-name-label"
//           id="demo-multiple-name"
//           multiple
//           value={personName}
//           onChange={handleChange}
//           input={<OutlinedInput label="Name" />}
//           MenuProps={MenuProps}
//         >
//           {names.map((name) => (
//             <MenuItem
//               key={name}
//               value={name}
//               style={getStyles(name, personName, theme)}
//             >
//               {name}
//             </MenuItem>
//           ))}
//         </Select>
//       </FormControl>
//     </div>
//   );
// }