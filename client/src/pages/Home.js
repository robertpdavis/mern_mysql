import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import Auth from '../utils/auth';
import { QUERY_USER } from '../utils/queries';

const Home = () => {

  let navigate = useNavigate();

  let id = ''
  if (Auth.loggedIn()) {
    const user = Auth.getProfile();
    id = user.data.id;
  }

  const { loading: loadingU, data: dataU } = useQuery(QUERY_USER,
    {
      variables: { id },
    });

  const userData = dataU?.user || {};

  if (!Auth.loggedIn()) { navigate("login") };


  if (loadingU) {
    return <div>Loading...</div>;
  }
  return (
    <main>
      <section className="container my-2">

        <div className="page-header">
          Home
        </div>

        <div className="sub-header dashboard">
          Sub Header
        </div>

      </section>
    </main>
  );
};

export default Home;
