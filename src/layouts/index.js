import PropTypes from 'prop-types';
// guards
import AuthGuard from '../guards/AuthGuard';
// components
import MainLayout from './main';
import DashboardLayout from './dashboard';
import DevLayout from './dashboard/dev';
import LogoOnlyLayout from './LogoOnlyLayout';

// ----------------------------------------------------------------------

Layout.propTypes = {
	children: PropTypes.node.isRequired,
	variant: PropTypes.oneOf([ 'dashboard', 'main', 'logoOnly' ]),
};

export default function Layout({ variant = 'dashboard', children }) {
	if (variant === 'logoOnly') {
		return <LogoOnlyLayout> {children} </LogoOnlyLayout>;
	}

	if (variant === 'main') {
		return <MainLayout>{children}</MainLayout>;
	}
	if (variant === 'developer') {
		return (
			<AuthGuard>
				<DevLayout> {children} </DevLayout>
			</AuthGuard>
		);
	}
	return (
		<AuthGuard>
			<DashboardLayout> {children} </DashboardLayout>
		</AuthGuard>
	);
}
