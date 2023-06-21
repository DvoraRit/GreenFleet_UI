import React from 'react';
import Menu from '@mui/material/Menu';

// const IndeterminateCheckbox = forwardRef(({ indeterminate, ...rest }, ref) => {
// 	const defaultRef = useRef();
// 	const resolvedRef = ref || defaultRef;


// 	useEffect(() => {
// 		resolvedRef.current.indeterminate = indeterminate;
// 	}, [resolvedRef, indeterminate]);

// 	return <input type='checkbox' ref={resolvedRef} {...rest} />;
// });

function ColumnsPopUpState({
	getToggleHideAllColumnsProps,
	column,
	allColumns,
	open,
	alwaysVisibleColumns,
	...rest
}) {

	return (
		<Menu
			{...{ ...rest, open }}
			// className='choose-resource-window-container'
			PaperProps={{
				style: {
					display: 'flex',
					justifyContent: 'flex-end',
					width: 250,
					borderRadius: 8,
					// direction: 'rtl'
				},
			}}
		>
			{/* <div>
				<IndeterminateCheckbox {...getToggleHideAllColumnsProps()} /> Toggle All
			</div> */}
			{allColumns
				.filter(({ id }) => !alwaysVisibleColumns.includes(id))
				.map((column) => (
					<div
						key={column.id}
						style={{
							display: 'flex',
							justifyContent: 'flex-start',
							width: '100%',
						}}
					>
						<label>
							<input type='checkbox' {...column.getToggleHiddenProps()} />{' '}
							{column.Header}
						</label>
					</div>
				))}
			<br />
		</Menu>
	);
}

export default ColumnsPopUpState;
