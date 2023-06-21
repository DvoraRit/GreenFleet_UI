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
import './Select.scss';

const LIMIT = 1000;
const sortBy = 'id';

const filter = createFilterOptions();

export default function FormSelect({
	value,
	name,
	onChange,
	formatOptions = formatOptionForSelect,
	label,
	placeholder,
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
	is_required,
	updateForm,
	sub_constractor_name, //for trips sold to sub_constractor,
	sub_constractor_id,
}) {
	//TODO: async select option.
	//check if i get options array
	//if yes - present the options
	//if not - call get options method.
	//the method will get the field_name as table_name and will send an api request to fetch data
	const [asyncOptions, setAsyncOptions] = useState([]);
	const [loadingOptions, setLoadingOptions] = useState(false);
	const [searchFilter, setSearchFilter] = useState('');
	const [selectedValues, setSelectedValues] = useState([]);
	const { t } = useTranslation();

	function debounce(func, timeout = 300) {
		let timer;
		return (...args) => {
			clearTimeout(timer);
			timer = setTimeout(() => {
				func.apply(this, args);
			}, timeout);
		};
	}

	const handleFilterChange = (e, v) => {
		if (v?.target?.value === '') {
			onChange({ label: '', value: '' });
		}
		setSearchFilter(e?.target?.value);
		if (name === 'filterHeaderText') {
			onChange(e?.target?.value);
		}
	};
	let optionsArray = [];

	const formatSelectValueToShow = (v) => {
		if (multi) {
			let values = v
				?.map((item) => {
					return item.value;
				})
				.join(',');
			//setSelectedValues(values)
			return values;
		} else {
			return { label: v?.label, value: v?.value };
		}
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
								sub_constractor_id,
								sub_constractor_name,
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
								sub_constractor_id,
								sub_constractor_name,
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
		getOptionLabel: (option) => formatOptionsLabel(option, name, options) ?? '',
		renderOption: (props, option) =>
			formatOptions(
				props,
				option,
				name,
				onChange,
				formatSelectValueToShow(value),
			),
		// ...(creatable && {
		filterOptions: (options, params) => {
			const filtered = filter(options, params);

			const { inputValue } = params;
			// Suggest the creation of a new value
			const isExisting = options.some((option) => inputValue === option?.label);
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
			return option?.value === value?.value || value?.value === '' || '';
		},
		multiple: multi,
		// }),
	};

	useEffect(() => {
		if (!!value?.value && !value.label && updateForm) {
			let lbl = asyncOptions.find((opt) => opt.value === value.value);
			if (!!lbl) {
				onChange({ label: lbl.label, value: value.value });
			}
		}
	}, [value, asyncOptions]);

	const printMultiValuesSelected = (v) => {
		let values = formatSelectValueToShow(value);
		return <div className='selected_values_to_show'>{values}</div>;
	};

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
			label={label}
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
							placeholder={placeholder}
							label={label}
							isHeader={isHeader}
							onChange={(v) => debounce(() => handleFilterChange(v))}
							is_required={is_required}
							// sx={{ ...inputStyle }}
							underline={false}
							InputProps={{
								// dir: 'rtl',
								sx: {
									direction: 'ltr',
									// backgroundColor:'red',
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
			renderTags={(value, getTagProps) => {
				return printMultiValuesSelected();
			}}
		/>
	);
}
