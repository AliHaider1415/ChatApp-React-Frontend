import { useContext, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function PrivateRoute({ Component }) {
  const { auth_token } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (auth_token !== null) {
      setLoading(false);
    }
  }, [auth_token]);

  // Render loading indicator until auth_token state is updated
  if (loading) {
    return <div>Loading...</div>;
  }

  // If auth_token is available, render the protected component, else redirect to the sign_in page
  return auth_token ? <Component /> : <Navigate to="/sign_in" />;
}
