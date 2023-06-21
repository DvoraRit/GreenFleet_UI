import * as React from 'react';
import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import TextField from '@mui/material/TextField';


import SelectUnstyled, {
	selectUnstyledClasses,
} from '@mui/base/SelectUnstyled';
import OptionUnstyled, {
	optionUnstyledClasses,
} from '@mui/base/OptionUnstyled';
import PopperUnstyled from '@mui/base/PopperUnstyled';
import { styled } from '@mui/material/styles';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
			background: 'red',
		},
	},
};

export default function BasicSelect({
	options = [],
	value=[],
	name,
	onChange = () => {},
	style = {},
	multi,
}) {

	return (
		<Box sx={{ ...style }}>
			<FormControl fullWidth>
				<CustomSelect
					id={name}
					value={value}
					onChange={onChange}
					multiple={multi}
					{...(multi && {
						renderValue: (selected) => (
							<span className='select-value'>
								{value?.map((subVal) => subVal?.label)?.toString()}
							</span>
						),
						MenuProps,
					})}
				>
					{options.map(({ value: v, label: l }) =>
						multi ? (
							<StyledOption
								value={v}
								sx={{
									display: 'flex',
									flexDirection: 'row',
									align: 'center',
									fontSize: '12px',
								}}
							>
								<Checkbox
									sx={{ '& .MuiSvgIcon-root': { fontSize: 14 } }}
									checked={value?.find(
										({ label, value, selected }) => value === v,
									)}
								/>
								<ListItemText
									primary={l}
									sx={{ '& .MuiListItemText-root': { fontSize: 10 , fontFamily: 'Rubik'} }}
								/>
							</StyledOption>
						) : (
							<StyledOption value={v}>{l}</StyledOption>
						),
					)}
				</CustomSelect>
			</FormControl>
		</Box>
	);
}

const blue = {
	100: '#DAECFF',
	200: '#99CCF3',
	400: '#3399FF',
	500: '#007FFF',
	600: '#0072E5',
	900: '#003A75',
};

const grey = {
	100: '#E7EBF0',
	200: '#E0E3E7',
	300: '#CDD2D7',
	400: '#B2BAC2',
	500: '#A0AAB4',
	600: '#6F7E8C',
	700: '#3E5060',
	800: '#2D3843',
	900: '#1A2027',
};

const StyledButton = styled('button')(
	({ theme }) => `
  box-sizing: border-box;
  background: transparent;
  height: 40px;
  text-align: left;
  line-height: 1.5;

  &.${selectUnstyledClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === 'dark' ? blue[600] : blue[100]};
  }

  &.${selectUnstyledClasses.expanded} {
    &::after {
      content: '▴';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }
  `,
);

const StyledListbox = styled('ul')(
	({ theme }) => `
  box-sizing: border-box;
  background: #fff;
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[800] : grey[300]};
  border-radius: 0.75em;
  color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  overflow: auto;
  max-height: 8em;
  outline: 0px;

  z-index: 50;
  `,
);

const StyledOption = styled(OptionUnstyled)(
	({ theme }) => `
  list-style: none;
  padding: 8px;
  font-size: 12px;

  cursor: default;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.selected} {
    color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    background-color: rgba(46,196,182,0.6);
  }

  &.${optionUnstyledClasses.highlighted} {
    color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    background-color: rgba(46,196,182,0.6);
  }

  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    color: ${theme.palette.mode === 'dark' ? blue[900] : blue[100]};
    background-color: #2EC4B6;
  }

  &.${optionUnstyledClasses.disabled} {
    color: ${theme.palette.mode === 'dark' ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionUnstyledClasses.disabled}) {
    background-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[100]};
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
  }
  `,
);

const StyledPopper = styled(PopperUnstyled)`
	z-index: 1;
`;

function CustomSelect(props) {
	const components = {
		Root: StyledButton,
		Listbox: StyledListbox,
		Popper: StyledPopper,
		...props.components,
	};

	return <SelectUnstyled {...props} components={components} />;
}
