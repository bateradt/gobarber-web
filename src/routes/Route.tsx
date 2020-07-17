import React from 'react';
import { RouteProps, Route as ReactDOMRoute, Redirect } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RoutePropsExtended extends RouteProps {
  isPrivate?: boolean;
  component: React.ComponentType;
}

const Route: React.FC<RoutePropsExtended> = ({ isPrivate = false, component: Component, ...restParams }) => {
  const { user } = useAuth();

  return (
    <ReactDOMRoute
      {...restParams}
      render={({ location }) => {
        return isPrivate === !!user ? (
          <Component />
        ) : (
            <Redirect to={{ pathname: isPrivate ? '/' : '/dashboard', state: { from: location } }} />
          );
      }}
    />
  );

};

export default Route;
