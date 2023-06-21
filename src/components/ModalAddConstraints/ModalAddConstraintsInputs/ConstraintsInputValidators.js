import * as Yup from 'yup';

export const FIELDS = {
	BEGINNING_DATE: 'beginningDate',
	BEGINNING_TIME: 'beginningTime',
	END_DATE: 'endDate',
	END_TIME: 'endTime',
	DRIVER: 'driver',
	COMMENT_FOR_DRIVER: 'comment_for_driver',
    COMMENT_FOR_PLANNER: 'comment_for_planner',
	REPETE_EVERY: 'repeatOptions',
	REPETE_UNTIL: 'repeat_until',



}
const required = 'זהו שדה חובה';

export const VALIDATIONS = Yup.object().shape({
	[FIELDS.BEGINNING_DATE]: Yup.string().required(required).nullable(),
	[FIELDS.BEGINNING_TIME]: Yup.string().required(required).nullable(),
	[FIELDS.END_DATE]: Yup.string().required(required).nullable(),
	[FIELDS.END_TIME]: Yup.string().required(required).nullable(),
	// [FIELDS.CHAPERON]: Yup.object().when('driver', {
	// 	is: true,
	// 	then: (element) => element.required(required),
	// 	otherwise: (element) => element.notRequired(),
	// }),
});
