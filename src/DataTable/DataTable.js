import React, { useEffect } from 'react';
import {
	useTable,
	// useSortBy,
	usePagination,
	useBlockLayout,
	useResizeColumns,
	// useFlexLayout,
} from 'react-table';

import Spinner from '../Spinner/Spinner';
import './DataTable.scss';
import * as helpers from './helpers';
import { useStores } from 'stores';
import NoResultsForDataTable from './components/NoResultsForDataTable';
import TableHeader from './TableHeader';
// import makeData from './makeData';

import MaUTable from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import ArrowDropDownTwoToneIcon from '@mui/icons-material/ArrowDropDownTwoTone';
import ArrowDropUpTwoToneIcon from '@mui/icons-material/ArrowDropUpTwoTone';

import { _entitiesHeaderFilters,openTabInformationRightSideModal } from 'recoil/atoms';
import { useRecoilState } from 'recoil';
import RightDialogTabInformation from 'components/RightDialog/components/RightDialogInfoTabs';

import RightDialog from 'components/RightDialog/RightDialog';

// const SPECIAL_FIELDS = ['addIcon']

const EditableCell = ({
	value: initialValue,
	row: { index },
	column: { id },
	updateMyData, // This is a custom function that we supplied to our table instance
}) => {
	// We need to keep and update the state of the cell normally
	const [value, setValue] = React.useState(initialValue);

	const onChange = (e) => {
		setValue(e.target.value);
	};

	// We'll only update the external data when the input is blurred
	const onBlur = () => {
		updateMyData(index, id, value);
	};

	// If the initialValue is changed external, sync it up with our state
	React.useEffect(() => {
		setValue(initialValue);
	}, [initialValue]);

	//we will recieve a props for which component to use for editing / or a check for non editable cell
	// return <input value={value} onChange={onChange} onBlur={onBlur} />;
	return <span>{value}</span>;
};

// Set our editable cell renderer as the default Cell renderer

function Table({
	columns = [],
	data = [],
	updateMyData,
	skipPageReset,
	loading,
	table_name,
	patchTitle,
	// useControlledState,
	canHideColumns,
	alwaysVisibleColumns = ['addIcon'],
	headerTextStyle,
	dataTextStyle,
	selectedRow,
	selectTableRow,
	sortBy,
	sortTableBy,
	actionButtonLabel,
	headerIcon,
	toggleCreateEntityModal,
	middle_modal_width,
	padding,
	specialWidthForModal,
	updateRowData,
	canEdit,
	isAdmin,
	setRightDialog,
	rightDialog
	// getMoreRecords,
}) {
	//TODO: RTL support

	//TODO: helper function to render edit components
	//TODO: special columns cannot be sorted! (enter to function)

	//this properties should come from config

	const [searchFilter] = useRecoilState(_entitiesHeaderFilters);
	const { dataTableStore } = useStores();

	const defaultColumn = React.useMemo(
		() => ({
			minWidth: 30,
			width: 150,
			maxWidth: 900,
			Cell: EditableCell,
		}),
		[],
	);


	const toggleRightDialog = () => {
		setRightDialog(true);
	};
	const closeRightDialog = () => {
		setRightDialog(false);
	}
	const [openTabInformation, setOpenTabInformation] = useRecoilState(openTabInformationRightSideModal);


	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		rows,
		prepareRow,
		allColumns,
		getToggleHideAllColumnsProps,
		state,
		columns: columnsState,
	} = useTable(
		{
			columns,
			data,
			defaultColumn,
			autoResetPage: !skipPageReset,
			updateMyData,
		},
		useBlockLayout,
		useResizeColumns,
		usePagination,
	);

	useEffect(() => {
		let preferences = [...JSON.parse(localStorage.getItem('fields_of_table'))];
		let oldPreferences = localStorage.getItem('fields_of_table');

		let widthObj = columnsState?.[0]?.columns?.reduce((prev, col) => {
			return {
				...prev,
				[col?.field_name]: col?.width,
			};
		}, {});

		preferences = preferences.map((field) => {
			if (field.table_name === table_name) {
				if (
					!!field?.column_width &&
					!!widthObj?.[field?.field_name] &&
					parseInt(field?.column_width) !== widthObj?.[field?.field_name]
				) {
					return {
						...field,
						column_width: widthObj?.[field?.field_name].toString(),
					};
				} else {
					return {
						...field,
					};
				}
			} else {
				return {
					...field,
				};
			}
		});

		preferences = JSON.stringify(preferences);

		if (preferences !== oldPreferences) {
			// alert('none')
			localStorage.setItem('fields_of_table', preferences);
		}
	}, [state]); //eslint-disable-line

	useEffect(() => {
		switch (table_name) {
			//unable open right dialog on click row
			case "vehicles_type":
			case "zones":
			case "trip_type":
			case "all_stations":
				setRightDialog(false);
			break;
		
			default:
				if (!!Object.keys(selectedRow)?.length) {
					toggleRightDialog();
				}
				break;	
		}
	//selectedRow.id so that right modal wont closewhem update row
	}, [selectedRow.id]); //eslint-disable-line

	return loading ||
		!table_name ||
		//!data?.length ||
		//!columns?.length ||
		table_name !== columns?.[0]?.Header ? (
		<Spinner />
	) : (
		<>
			<RightDialog
				isOpen={rightDialog}
				toggle={() => {
					if (rightDialog) {
						selectTableRow({});
					}
					toggleRightDialog();
				}}
				closeRightDialog={closeRightDialog}
				selectedEntityData={selectedRow}
				table_name={table_name}
				patchTitle={patchTitle}
				middle_modal_width={middle_modal_width}
				padding={padding}
				specialWidthForModal={specialWidthForModal}
				updateRowData={updateRowData}
				canEdit={canEdit}
				isAdmin={isAdmin}
			/> 

			<MaUTable
				{...getTableProps()}
				className='table'
				sx={{
					direction: 'rtl',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					// alignSelf: 'center',
					justifyContent: 'center',
					// borderWidth: '5px',
					// borderColor: 'red',
					// borderStyle: 'solid',
					// flex: 1,
					// alignSelf: 'stretch',

					// width: '100vw',
				}}
			>
				
				<TableHead
					sx={{
						direction: 'rtl',
						borderWidth: '0 !important',
						// alignSelf: 'stretch',
						// flex: 1,

						// minWidth: '100vw',
						// maxWidth: '100vw',
					}}
				>
					{headerGroups?.filter(item=>!item.user_hide).map((headerGroup) => {
						return (
							<TableRow
								{...headerGroup.getHeaderGroupProps()}
								className='tr'
								sx={{
									direction: 'rtl',
									flex: 1,
									alignSelf: 'stretch',
									borderWidth: '0 !important',
								}}
							>
								{headerGroup?.headers?.map((column) => (
									// Add the sorting props to control sorting. For this example
									// we can add them into the header props
									<TableCell
										className='th'
										{...column?.getHeaderProps()}
										// sx={{ direction: 'rtl', textAlign: 'center' }}
										sx={{
											textAlign: 'center',
											width: '100%',
											cursor: 'pointer',
											display: 'flex',
											alignItems: 'center',
											borderWidth: '0 !important',
											margin: '0 5px',
										}}
										onClick={() => sortTableBy(column?.field_name)}
									>
										{/* {column.render('Header')} */}
										{table_name === column?.render('Header') && (
											<TableHeader
												table_name={table_name}
												Icon={headerIcon}
												actionButtonLabel={actionButtonLabel}
												actionButtonAction={toggleCreateEntityModal}
												canEdit={canEdit}
											/>
										)}

										{table_name !== column?.render('Header') &&
											!!column?.render('Header') &&
											helpers.formatHeader({
												getToggleHideAllColumnsProps,
												allColumns,
												column,
												canHideColumns,
												alwaysVisibleColumns,
												headerTextStyle,
											})}

										{/* Use column.getResizerProps to hook up the events correctly */}
										<div
											{...column.getResizerProps()}
											className={`resizer ${
												column.isResizing ? 'isResizing' : ''
											}`}
										/>

										{/* Add a sort direction indicator */}
										<span>
											{!!column?.can_sort ? (
												!!(sortBy.field === column?.field_name) ? (
													!!sortBy.desc ? (
														<ArrowDropDownTwoToneIcon
															style={{ height: 14, width: 14 }}
														/>
													) : (
														<ArrowDropUpTwoToneIcon
															style={{ height: 14, width: 14 }}
														/>
													)
												) : (
													''
												)
											) : (
												''
											)}
										</span>
									</TableCell>
								))}
							</TableRow>
						);
					})}
				</TableHead>


			{
				!data.length? (
					<NoResultsForDataTable />
				) :
				(
					<TableBody {...getTableBodyProps()}>
					{rows?.map((row, i) => {
						prepareRow(row);
						return (
							<TableRow
								{...row?.getRowProps()}
								className='tr'
								sx={{
									direction: 'rtl',
									textAlign: 'center',
									flex: 1,
									alignSelf: 'stretch',
									cursor: 'pointer',
									backgroundColor:
										selectedRow?.id === row?.id
											? 'rgba(192,200,217,0.17)'
											: 'transparent',
								}}
							>
								{row?.cells?.map((cell) => {
									return (
										<TableCell
											{...cell.getCellProps()}
											className={`td ${cell?.column?.id}`}
											sx={{
												direction: 'rtl',
												textAlign: 'center',
												margin: '0 5px',
												// flex: 1,
												// alignSelf: 'stretch',
											}}
											onClick={() => {
												selectTableRow(
													{...row}
												);
											}}
										>
											{!!cell?.render &&
												helpers.formatData({
													cell,
													row,
													dataTextStyle,
													searchFilter,
													dataTableStore,
													middle_modal_width
												})}
										</TableCell>
									);
								})}
							</TableRow>
						);
					})}
				</TableBody>
				)
			}
				
			</MaUTable>
			<br />
			{/* <div>Showing the first 20 results of {rows.length} rows</div> */}
			{/* <pre>{JSON.stringify(state, null, 2)}</pre> */}
		</>
	);
}

export default Table;
