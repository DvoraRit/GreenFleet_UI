import React, { useState, useRef, useEffect } from 'react';
import './ModalAddConstraints.scss';
import ModalAddConstraintsInputs from './ModalAddConstraintsInputs/ModalAddConstraintsInputs';
import ModalResourceChangesHeader from 'components/ModalResourceChanges/ModalResourceChangesHeader/ModalResourceChangesHeader';
import ModalResourceChangesButton from 'components/ModalResourceChanges/ModalResourceChangesButton/ModalResourceChangesButton';
import Map from 'containers/Planning/Dialog/DialogWrapper/components/SideMap';
import { Formik, ErrorMessage, Form } from 'formik';
import { useObserver, observer } from 'mobx-react';
import ActionButton from 'containers/Planning/Dialog/DialogWrapper/components/ActionButtons';
import { useStores } from 'stores/index';
import { toJS } from 'mobx';
import moment from 'moment';

const ModalAddConstraints = ({ toggle, tripDetails = {}, component }) => {
	const {
		user_role = '',
		day_at_week = '',
		start_date = '',
		start_time = '',
		end_day = '',
		end_time = '',
		nick_name = '',
		trip_name = '',
		created_by = '',
		user_phone = '',
		repete_every = '',
		driver_id = '',
		day = '',
		driver_first_name = '',
		comment = '',
		is_active = 1,
		order_id,
		planning_id,
	} = tripDetails;

	const {
		carDriverStore,
		resourceBankStore,
		chaperonesStore,
		constraintStore,
	} = useStores();
	// const formSchema = Yup.object().shape({
	// 	start_date: Yup.string()
	// 	  // .length(9, `${strings('errors.invalidPhone')}`)
	// 	  .min(9, strings('errors.phone_too_short'))
	// 	  .max(14, strings('errors.phone_too_long'))
	// 	  .required(`${strings('errors.required')}`),
	//   });

	const [loading, setLoading] = useState(false);
	const [ready, setReady] = useState(false);

	const formikRef = useRef();
	const [options, setOptions] = useState({
		driver_first_name: [],
		chaperon: [],
	});
	const [resourceBank, setResourceBank] = useState(null);

	return  (
		<div className={'ModalResourceChanges-main'}>
			<>
				<div className='ModalResourceChanges-top'>
					<ModalResourceChangesHeader toggle={toggle} tripName={'אילוץ חדש'} />
				</div>
				<div
					className='ModalResourceChanges-middle'
					style={{ marginTop: '1rem' }}
				>
					{' '}
					<ModalAddConstraintsInputs />
				</div>
			</>
		</div>
	);
};

export default observer(ModalAddConstraints);
