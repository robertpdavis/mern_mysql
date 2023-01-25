import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { QUERY_USER } from '../utils/queries';
import { UPDATE_USER, UPDATE_PASSWORD } from '../utils/mutations';
import ProfileForm from '../components/Forms/ProfileForm';
import UpdatePassForm from '../components/Forms/UpdatePassForm';
import Alert from '../components/Alert';
import Auth from '../utils/auth';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';

const Profile = () => {
  const handleError = useErrorHandler();
  let navigate = useNavigate();

  //State to control the alert banner
  const [alertState, setAlertState] = useState({ show: false });
  //Update user mutation
  const [updateUser, { loading: loadingU }] = useMutation(UPDATE_USER,
    {
      refetchQueries: [
        'getUser'
      ],
    });

  const [updatePassword, { loading: loadingP }] = useMutation(UPDATE_PASSWORD);

  //Get the logged in user details
  let id = '';
  if (Auth.loggedIn()) {
    const user = Auth.getProfile();
    id = user.data.id;
  }

  //Get id from API call example ------------------------------
  const params = useParams();
  if (params.id > 0) id = parseInt(params.id);


  //Get the user data
  const { loading: loadingQ, data: dataQ } = useQuery(QUERY_USER,
    {
      variables: { id },
    });

  //Go to login page if not logged in
  if (!Auth.loggedIn()) { navigate("login") };

  //Set initial form data to pass to password form
  const passData = {
    password: '',
    newpassword: '',
    confirmpass: '',
  };

  //Initial form button settings
  let profBtnSettings =
    [
      {
        type: 'submit',
        name: 'saveprofile',
        title: 'Save',
        class: 'btn btn-sm btn-success me-3',
        state: 'disabled'
      }
    ];
  let passBtnSettings =
    [
      {
        type: 'submit',
        name: 'savepassword',
        title: 'Save',
        class: 'btn btn-sm btn-success me-3',
        state: 'disabled'
      }
    ];

  //Submit form handler
  const handleFrmBtnClick = async ({ event, formState }) => {
    event.preventDefault();
    const action = event.target.name;
    let response = '';

    try {
      switch (action) {
        case 'profile':
          response = await updateUser({
            variables: { id, ...formState },
          });

          if (response.data.updateUser && response.data.updateUser.status === true) {
            //Update success
            setAlertState({ variant: 'success', message: response.data.updateUser.msg });
          } else {
            //Update failure
            setAlertState({ variant: 'danger', message: response.data.updateUser.msg });
          }
          break;

        case 'password':
          response = await updatePassword({
            variables: { id, ...formState },
          });

          if (response.data.updatePassword && response.data.updatePassword.status === true) {
            //Update success
            setAlertState({ variant: 'success', message: response.data.updatePassword.msg });
          } else {
            //Update failure
            setAlertState({ variant: 'danger', message: response.data.updatePassword.msg });
          }
          break;

        default:
          break;
      }

    } catch (e) {
      //Catch app errors
      handleError(e)
    }
  };

  //Handle alert bar exit
  const handleAlertClick = async (option) => {
    setAlertState({ show: false });
  };

  const ErrorFallback = ({ error, resetErrorBoundary }) => {
    //General app error notification content
    return (
      <main>
        <section className="container my-2">
          <div className="page-header">
            My Profile
          </div>
          <div className="fade alert alert-danger show">
            <div>
              Sorry, something went wrong. If error pesists, please contact support.
            </div>
            <button onClick={resetErrorBoundary}>Try again</button>
          </div>
        </section>
      </main >
    )
  }

  const errorHandler = (error, { componentStack: string }) => {
    console.log('Client errors', error.clientErrors)
    console.log('API errors', error.graphQLErrors)
    // TO DO - Do something with the error
    // E.g. log to an error logging client here
  }
  if (loadingQ || loadingU || loadingP) {
    return <div>Loading...</div>;
  }

  const userData = { ...dataQ?.getUser || {} };

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
      <main>
        <section className="container my-2">
          <div className="page-header">
            My Profile
          </div>
          <div className="row">
            <Alert alertState={alertState} handleAlertClick={handleAlertClick} />
          </div>
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="sub-header">
                My Details
              </div>
              <ProfileForm formData={userData} btnSettings={profBtnSettings} handleFrmBtnClick={handleFrmBtnClick} setAlertState={setAlertState} formType='update' validate={true} />
            </div>
            <div className="col-12 col-lg-6">
              <div className="sub-header">
                Update Password
              </div>
              <UpdatePassForm formData={passData} btnSettings={passBtnSettings} handleFrmBtnClick={handleFrmBtnClick} setAlertState={setAlertState} formType='update' validate={true} />
            </div>
          </div>
        </section>
      </main >
    </ErrorBoundary>
  );
};

export default Profile;
