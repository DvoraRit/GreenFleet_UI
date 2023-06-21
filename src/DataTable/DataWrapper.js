import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import CreateEntityForm from 'components/EntityForms/CreateEntityForm/CreateEntityForm';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import InfiniteScroll from 'react-infinite-scroller';
import { useRecoilState } from 'recoil';
import { _entitiesHeaderFilters, getAllCustomers } from 'recoil/atoms';
import TableDataService from 'services/TableDataService';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { extraFieldsOfTable } from './config';
import DataTable from './DataTable';
import NoResultsForDataTable from './components/NoResultsForDataTable';
import Spinner from '../../components/Spinner/Spinner';

//header icons

const LIMIT = 30;

function DataWrapper({
	table_name,
	showMap,
	patchTitle,
	canHideColumns,
	headerTextStyle,
	dataTextStyle,
	headerIcon,
	paginationRef,
	middle_modal_width,
	padding,
	specialWidthForModal,
	canEdit,
	isAdmin
}) {
	const [data, setData] = useState([]);
	const [skipPageReset, setSkipPageReset] = useState(false);
	const [columns, setColumns] = useState([]);
	const [selectedRow, setSelectedRow] = useState({});
	const [sortBy, setSortBy] = useState({ field: 'id', desc: false });
	const [exhusted, setExhusted] = useState(false);
	const [createEntity, setCreateEntity] = useState(false);
	const [loading, setLoading] = useState(false);
	const [page, setPage] = useState(1);
	const [manualPagination, setManualPagination] = useState(0);

	const [searchFilter] = useRecoilState(_entitiesHeaderFilters);
	const [totalLength, setTotalLength] = useState(LIMIT);
	const [isLoading, setIsLoading] = useState(false);
	const [rightDialog, setRightDialog] = React.useState(false);
	const toggleCreateEntityModal = () => {
		if (canEdit) {
			setCreateEntity((state) => !state);
		}
	};

	const selectTableRow = (row) => {
		switch (table_name) {
			//dont open right dialog on click row
				case "vehicles_type":
				case "zones":
				case "trip_type":
				case "all_stations":
				
				break;
		
			default://open
				setSelectedRow({ ...row });
				setRightDialog(!rightDialog);
				break;
		}
		
	};

	const sortTableBy = (field) => {

		setSortBy((state) => {
			if (state.field === field) {
				return {
					...state,
					desc: !state?.desc,
				};
			} else {
				return {
					field: field,
					desc: false,
				};
			}
		});
	};

	const { t } = useTranslation();

	const setTableColumns = useCallback(async () => {
		let fields;
		//check if we have fields in local storage
		fields = JSON.parse(localStorage.getItem('fields_of_table'));
		if (!fields) {
			fields = await TableDataService.getAllFields();
			if (Array.isArray(fields)) {
				fields = [...fields, ...extraFieldsOfTable];
			}
		}

		if (!columns?.length) {
			setColumns([
				{
					Header: table_name,
					columns: [
						...fields
							.filter(
								({ is_active, table_name: tableName, show_in_client }) =>
									// visibleColumns.includes(field_name) &&
									!!is_active && table_name === tableName && !!show_in_client,
							)
							.sort((b, a) => a.column_order - b.column_order)
							.map((field) => ({
								...field,
								Header: field?.customLabel
									? field.customLabel
									: t(`data_table.headers.${field?.label}`),
								accessor: field?.field_name,
								id: field?.field_name,
								width: parseInt(field?.column_width),
							})),
					],
				},
			]);
		}
	}, []);

	const getEntityData = async () => {
		if (!isLoading) {
			let tableData;
			let dataFilter={}
			switch (table_name) {
				//only admin can see not active data
				case "price_list":
					dataFilter = !isAdmin ?{
						_column: 'status',
						_value: 1,
						_sign: '=',
					} : {}
		
					break;
				case "contracts":
					dataFilter = !isAdmin ?{
						_column: 'status',
						_value: "0",
						_sign: '!=',
					} : {}
				break;
				case "drivers":
					dataFilter = !isAdmin ?{
						_column: 'is_active',
						_value: "0",
						_sign: '!=',
					} : {}
				break;
				default:
					break;
			}
			tableData = await TableDataService.getTableData({
				LIMIT,
				page: page - 1,
				sortBy,
				searchFilter: searchFilter?.text,
				table_name,
				dataFilter
			});
			if (
				tableData.total &&
				parseInt(tableData.total) !== parseInt(totalLength)
			) {
				setTotalLength(tableData.total);
			}
			let currentLength = 0;
			if (Array.isArray(tableData?.rows)) {
				// let activeData = tableData.rows.filter((row) => row.is_active === 1);
				// if(table_name==='customers'){
				// 	setAllCustomers(tableData.rows)
				// }
				if (
					// table_name === 'customers' ||
					// table_name === 'drivers' ||
					// table_name === 'chaperones' ||
					// table_name === 'vehicles'
					false
				) {
					// if (manualPagination === page) {
					// setData((state) =>
					// 	state.length >= totalLength - (LIMIT + 1 * page)
					// 		? [...state, ...activeData]
					// 		: [...state],
					// );
					// setPage((state) => state + 1);
					// setManualPagination((state) => state + 1);
					// }
				} else {
					// if (manualPagination === page) {
					setData((state) => {
						if (tableData.rows.length + (page - 1) * LIMIT <= state?.length) {
							return [...state];
						} else {
							return [...state, ...tableData.rows];
						}
					});

					currentLength = data.length + tableData.rows.length;
					if (currentLength >= tableData.rows.length + (page - 1) * LIMIT) {
						setPage((state) => state + 1);
					}
				}

				if (currentLength >= tableData.total) {
					// no more results
					setExhusted(true);
				}
			}
			setIsLoading(false);
		}
	};

	useEffect(() => {
		let ab = new AbortController();
		setTableColumns();
		return () => {
			ab.abort();
		};
	}, []);

	useEffect(() => {
		let ab = new AbortController();

		setPage(1);
		setData([]);
		setExhusted(false);
		// getMoreRecords();
		return () => {
			ab.abort();
		};
	}, [sortBy, searchFilter]);

	const getMoreRecords = async () => {
		if (!isLoading) {
			setIsLoading(true);
			getEntityData();
			if (!exhusted) {
			}
		}
	};

	// We need to keep the table from resetting the pageIndex when we
	// Update data. So we can keep track of that flag with a ref.

	// When our cell renderer calls updateMyData, we'll use
	// the rowIndex, columnId and new value to update the
	// original data
	const updateMyData = (rowIndex, columnId, value) => {
		// We also turn on the flag to not reset the page
		setSkipPageReset(true);
		setData((old) =>
			old.map((row, index) => {
				if (index === rowIndex) {
					return {
						...old[rowIndex],
						[columnId]: value,
					};
				}
				return row;
			}),
		);
	};

	const updateRowData = (rowId, columnsData) => {
		//find the row
		const row = data.find((row) => row.id === rowId);
		//update the row
		Object.keys(columnsData).forEach((key) => {
			row[key] = columnsData[key];
		});
		//update the data
		let newData = [...data];
		newData[rowId] = row;
		setData(newData);
		//update the selected row values
		let newSelectedRowValues = { ...selectedRow.values };
		Object.keys(newSelectedRowValues).forEach((key) => {
			newSelectedRowValues[key] = row[key];
		});
		setSelectedRow({ ...selectedRow, values: newSelectedRowValues });
	};

	// After data changes, we turn the flag back off
	// so that if data actually changes when we're not
	// editing it, the page is reset
	// React.useEffect(() => {
	// 	setSkipPageReset(false);
	// }, [data]);

	const cacheRtl = createCache({
		key: 'muirtl',
		stylisPlugins: [prefixer, rtlPlugin],
	});

	const dataForTable = useMemo(() => data, [data]);
	const columnsForTable = useMemo(() => columns, [columns]);

	return loading ? (
		<Spinner />
	) : (
		<CacheProvider value={cacheRtl}>
			<CreateEntityForm
				isOpen={createEntity}
				toggle={toggleCreateEntityModal}
				table_name={table_name}
				showMap={showMap}
				middle_modal_width={middle_modal_width}
				padding={padding}
				allData={data}
				isAdmin={isAdmin}
			/>

			<InfiniteScroll
				pageStart={1}
				loadMore={getMoreRecords}
				hasMore={!exhusted}
				loader={<h4>Loading...</h4>}
				endMessage={
					<p style={{ textAlign: 'center' }}>
						<b>Yay! You have seen it all</b>
					</p>
				}
				useWindow={false}
				getScrollParent={() => paginationRef?.current}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'center',
					}}
				>
					{/* {!data.length && exhusted ? (
						<NoResultsForDataTable />
					) : ( */}
					<DataTable
						{...{
							columns: columnsForTable,
							data: dataForTable,
							updateMyData,
							skipPageReset,
							table_name,
							patchTitle,
							setRightDialog,
							canHideColumns,
							headerTextStyle,
							dataTextStyle,
							selectedRow,
							selectTableRow,
							sortBy,
							sortTableBy,
							rightDialog,
							toggleCreateEntityModal,
							headerIcon,
							getMoreRecords,
							loading,
							middle_modal_width,
							padding,
							specialWidthForModal,
							updateRowData,
							canEdit,
							isAdmin,
						}}
					/>
				</div>
			</InfiniteScroll>
		</CacheProvider>
	);
}

export default DataWrapper;
