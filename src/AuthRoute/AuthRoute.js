import ROUTES from 'constants/routes';
import React, { useEffect, useState } from 'react';
import { Route, useHistory } from 'react-router-dom';
import { useStores } from 'stores';
import AppLoader from 'components/Loading/AppLoader';

const AuthRoute = ({ children, ...props }) => {
	const { authenticationStore } = useStores();
	const [isLoading, setIsLoading] = useState(false);
	const history = useHistory();

	useEffect(
		async () => {
		try {
			if(localStorage.getItem('current_path') === '/login'){
				setIsLoading(true);
			}
			const result = await authenticationStore.loginWithToken();
			if (!result) {
				history.push(ROUTES.LOGIN);
			}
		} catch (err) {
			console.error(err);
			history.push(ROUTES.LOGIN);
		}
		setIsLoading(false);
	}, []);

	return (<>
		{isLoading && <AppLoader />}
		<Route {...props}>{children}</Route>
	</>);
};

export default AuthRoute;
