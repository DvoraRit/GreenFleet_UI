import * as React from 'react';
// import addHeaderIcon from '../images/add_circle_notActive.svg';
// import activeAddHeader from '../images/add_circle.svg';
import { DataGrid, useGridApiRef ,gridVisibleRowCountSelector} from '@mui/x-data-grid';

import { makeStyles } from '@mui/styles';

const TableComponent = ({ columns, rows, handleModal, isModalOpen }) => {
	const apiRef = useGridApiRef();

	const handleScroll = (event) => {
		const { scrollTop, scrollLeft } = event.currentTarget;
		//scrollPosition.current.top = scrollTop;
		//scrollPosition.current.left = scrollLeft;
	};

	const useStyles = makeStyles((theme) => ({
		dataGrid: {
			direction: 'rtl',
		},
	}));

	const classes = useStyles();

	return (
		<div style={{ height: 800 }}>
			<DataGrid
				apiRef={apiRef}
				rows={rows}
				columns={columns}
				// pageSize={15}
				// rowsPerPageOptions={[15, 25, 50]}
				onCellClick={(params, event) => {
					handleModal(params.row);
					event.defaultMuiPrevented = true;
				}}
				className={classes.dataGrid}
				sx={{
					'& .MuiDataGrid-columnSeparator': {
						display: 'none',
					},
				}}
			/>
		</div>
	);
};

export default TableComponent;
