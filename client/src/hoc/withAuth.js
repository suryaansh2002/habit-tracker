// client/hoc/withAuth.js

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { auth } from '../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';

const withAuth = (WrappedComponent) => {
  return (props) => {
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            setUser(user);
          } else {
            router.push('/');
          }
        });
      }
    }, [router]);

    if (!user) {
      return null; // or a loading spinner
    }

    return <WrappedComponent {...props} user={user} />;
  };
};

export default withAuth;
