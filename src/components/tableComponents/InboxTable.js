import * as React from 'react';
import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { useTranslation } from 'react-i18next';
import TableSortLabel from '@mui/material/TableSortLabel';
import moment from 'moment';
import TripEventsService from '../../services/TripEventsService';
import { _tripEventTypes } from '../../recoil/atoms';
import { useRecoilState } from 'recoil';
import AttachFileIcon from '@mui/icons-material/AttachFile';


import './InboxTable.scss';

function createData(name, code, population, size) {
	const density = population / size;
	return { name, code, population, size, density };
}

const TableComponent = ({
	columns,
	rows,
	handleModal,
	isModalOpen,
	setSelectedEvent,
	loader,
	listInnerRef,
}) => {
	const [page, setPage] = React.useState(0);
	const { t } = useTranslation();
	const [rowsPerPage, setRowsPerPage] = React.useState(10000);
	const [isHeaderSelect, setIsHeaderSelect] = React.useState(false);
	const [selectedTripForDialog, setSelectedTripForDialog] =
		React.useState(null);
	const [order, setOrder] = React.useState('time_start');
	const [orderBy, setOrderBy] = React.useState('type');
	const [selected, setSelected] = React.useState([]);
	const [dense, setDense] = React.useState(false);
	const [eventTypes, setEventTypes] = useRecoilState(_tripEventTypes);

	const handleRequestSort = (event, property) => {
		const istime_start = orderBy === property && order === 'time_start';
		setOrder(istime_start ? 'desc' : 'time_start');
		setOrderBy(property);
	};



	const handleClick = (row) => {
		setSelectedEvent(row);
		handleModal();
	};

	// Avoid a layout jump when reaching the last page with empty rows.

	const createSortHandler = (property) => (event) => {
		handleRequestSort(event, property);
	};

	useEffect(() => {
		(async () => {
			let types = await TripEventsService.getTripEventTypes();
			if (!!types?.length) {
				let obj = {};
				types.forEach((type) => {
					obj = {
						...obj,
						[type.type]: {
							label: t(`event_types.${type.type}`),
							value: type.type,
						},
					};
				});
				setEventTypes({ ...obj });
			}
		})();
	}, []);


	return (
		<div sx={{ dir: 'rtl' }} className='inbox-container'>
			{!!Object.keys(eventTypes)?.length && (
				<Paper sx={{ width: '100%', overflow: 'hidden', dir: 'rtl' }}>
					<TableContainer>
						<Table style={{ zIndex: 0 }} stickyHeader aria-label='sticky table'>
							{!isModalOpen && (
								<TableHead>
									<TableRow>
										{columns.reverse().map((column) => (
											<TableCell
												key={column.id}
												align={column.align}
												style={{
													zIndex: 0,
													minWidth: column.minWidth,
												}}
												sortDirection={orderBy === column.id ? order : false}
											>
												<TableSortLabel
													active={orderBy === column.id}
													direction={
														orderBy === column.id ? order : 'time_start'
													}
													onClick={createSortHandler(column.id)}
												>
													{column.label}
													{/* {orderBy === headCell.id ? (
												<Box component='span' sx={visuallyHidden}>
													{order === 'desc'
														? 'sorted descending'
														: 'sorted time_startending'}
												</Box>
											) : null} */}
												</TableSortLabel>
												{/* // {column.label} */}
											</TableCell>
										))}
										{/* <img
									src={!isHeaderSelect ? addHeaderIcon : activeAddHeader}
									className='addHeaderIconHr'
									onClick={(e) => handleCheckedRow()}
									alt='addHeaderIcon'
								/> */}
									</TableRow>
								</TableHead>
							)}
							<TableBody>
								{rows.map((row) => {

									return (
										<TableRow
											hover
											tabIndex={-1}
											key={row.id}
											onClick={() => handleClick(row)}
                                      style={{backgroundColor: !!row?.has_read ? '#FFF' : '#FBFBFC'}}
										>
											{columns.map((column) => {
												let value = row[column.id];

												switch (column.id) {
													case 'reported_time':
														value = moment(row[column.id]).format(
															'YYYY-MM-DD HH:mm',
														);
														break;
													case 'coordinates':
														value = `${row?.lat}, ${row?.long}`;
														break;
													case 'images':
														value = !!row?.images?.length ? <AttachFileIcon /> : '';
														break;
													case 'event_type':
														if (eventTypes?.[row?.[column?.id]]?.value) {
															value = (
																<>
																	<img
																		src={require(`../../assets/icons/${
																			eventTypes[row[column.id]]?.value
																		}-event.svg`)}
																		style={{
																			height: 18,
																			width: 18,
																			margin: '0 0px 0 4px',
																		}}
																		alt='event icon'
																	/>
																	<span>
																		{eventTypes[row[column.id]]?.label}
																	</span>
																</>
															);
														} else {
															value = <></>;
														}
														break;
													default:
														value = row[column.id];
												}
												return (
													<TableCell
														key={column.id}
														align={column.align}
														style={{
															borderLeft: '1px solid rgba(192,200,217,0.38)',
															maxWidth: column?.maxWidth,
                              fontWeight: !!row?.has_read ? 100 : 800
														}}
													>
														{/* {column.format && typeof value === 'number'
															? column.format(value)
                            : valueTranslation} */}
														<p
															style={{
																textOverflow: 'ellipsis',
																wordWrap: 'breakWord',
																overflow: 'hidden',
																whiteSpace: 'nowrap',
																maxHeight: '3.6em',
																lineHeight: '1.8em',
																maxWidth: column?.maxWidth,
																display: 'flex',
																justifyContent: 'flex-start',
																alignItems: 'center',
																flexDirection: 'row-reverse',
															}}
														>
															{value}
														</p>
													</TableCell>
												);
											})}
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
			)}
		</div>
	);
};

export default TableComponent;
