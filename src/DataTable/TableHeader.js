import React from 'react';
import { useTranslation } from 'react-i18next';
import { Submit } from 'components/FormControls';

function TableHeader({
	table_name,
	Icon,
	actionButtonLabel = 'צור',
	actionButtonAction,
	canEdit,
}) {
	const { t } = useTranslation();
	return (
		<div
			style={{
				display: 'flex',
				justifyContent: 'flex-between',
				alignItems: 'center',
				direction: 'rtl',
				margin: '20px 0 15px 0',
				padding: '0px 0px 0px 0px',
			}}
		>
			<div
				style={{
					width: '10%',
					display: 'flex',
					alignItems: 'center',
					// justifyContent: 'space-between',
				}}
			>
				<span>
					<Icon />
				</span>
				<span
					style={{
						marginRight: 5,
						color: 'rgba(0,0,0,0.87)',
						fontFamily: 'Rubik',
						fontSize: 16,
						letterSpacing: 0.5,
						// lineHeight: 28,
						textAlign: 'right',
						marginBottom: 6,
						whiteSpace: 'pre'
						
					}}
				>
					{t(`data_table.title.${table_name}`)}
				</span>
			</div>
			<div
				style={{
					// width: '70%',
					flex: 1,
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'flex-end',
				}}
			>
				<Submit
					disabled={!canEdit}
					loading={false}
					label={actionButtonLabel}
					action={actionButtonAction}
					buttonStyle={{ margin: 2 }}
				/>
			</div>
		</div>
	);
}

export default TableHeader;
