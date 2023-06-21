export const orderContainerStatusesObj = {
	1: { key: 'not_active', value: 1, label: 'לא פעיל', color: '#ff5252' },
	2: { key: 'active', value: 2, label: 'פעיל', color: '#2ec4b6' },
	3: { key: 'draft', value: 3, label: 'טיוטה', color: 'rgba(0, 0, 0, 0.6)' },
	4: {
		key: 'finished',
		value: 4,
		label: 'הסתיים',
		color: 'rgba(0, 0, 0, 0.6)',
	},
};
export const orderStatusesObj = {
	0: { key: 'null', value: 0, label: 'לא ידוע' },
	1: { key: 'future', value: 1, label: 'עתידי' },
	2: { key: 'active', value: 2, label: 'בביצוע' },
	3: { key: 'draft', value: 3, label: 'מאויש' },
	4: { key: 'finished', value: 4, label: 'הסתיים' },
	5: { key: 'not_active', value: 5, label: 'לא פעיל' },
};

export const contractsStatusesObj = {
	0: { value: 'not active', label: 'לא פעיל' },
	1: { value: 'active', label: 'פעיל' },
	2: { value: 'draft', label: 'טיוטה' },
	3: { value: 'bid', label: 'הצעת מחיר' },
	4: { value: 'ended', label: 'הסתיים' },
};

export const ordersDebriefsStatusesObj = {
	1: { key: 'not_related', value: 1, label: 'לא משוייך' },
	2: { key: 'pending', value: 2, label: 'ממתין' },
	3: { key: 'updated', value: 3, label: 'מעודכן' },
	4: { key: 'approved', value: 4, label: 'מאושר' },
	5: { key: 'invoiced', value: 5, label: 'הופקה חשבונית' },
	6: { key: 'paid', value: 6, label: 'שולם' },
	7: { key: 'not_active', value: 7, label: 'לא פעיל' },
};

export const tripAlertsSeverity = {
	1: {
		key: 'low',
		value: 1,
		label: 'קל',
		color: 'red',
		background: 'rgba(255,82,82,0.17)',
	},
	2: {
		key: 'medium',
		value: 2,
		label: 'בינוני',
		color: '#FF8F00',
		background: 'rgba(238,189,38,0.17)',
	},
	3: {
		key: 'high',
		value: 3,
		label: 'חמור',
		color: '#1634D9',
		background: 'rgba(65,134,255,0.17)',
	},
};

export const tripAlertsTypes = {
	1: { key: 'late', value: 1, label: 'איחור' },
	2: { key: 'notStopAtStation', value: 2, label: 'אי-מעבר תחנה' },
};
