import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import { CREATE_USER } from '../utils/mutations';
import SignUpForm from '../components/Forms/SignUpForm';
import Alert from '../components/Alert';
import Auth from '../utils/auth';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';

const Signup = () => {

  let loggedIn = false;
  const handleError = useErrorHandler();

  //Set initial form data to pass to form
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmpass: '',
    firstname: '',
    lastname: '',
  });

  //Initial button toolbar settings
  let btnSettings =
    [
      {
        type: 'submit',
        name: 'submit',
        title: 'Submit',
        class: 'btn btn-sm btn-success me-3',
        state: 'disabled'
      }
    ]

  //State to control the alert banner
  const [alertState, setAlertState] = useState({ show: false });

  const [createUser, { loading: loadingM }] = useMutation(CREATE_USER);

  //Submit form handler
  const handleFrmBtnClick = async ({ event, formState }) => {
    event.preventDefault();
    const action = event.target.name;
    let response = '';

    try {
      switch (action) {
        case 'signup':
          response = await createUser({
            variables: { ...formState },
          });

          if (response.data.createUser) {
            if (response.data.createUser.status === true) {
              Auth.login(response.data.createUser.token);
              loggedIn = true;
            } else {
              //Create failure
              setAlertState({ variant: 'danger', message: response.data.createUser.msg });
              setFormData({ ...formState });
            }
          }
          break;

        default:
          break;
      }

    } catch (e) {
      //Catch app errors
      handleError(e);
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
            Create Account
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

  if (loadingM) {
    return <div>Loading...</div>;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
      <main>
        <section className="container my-2">
          <div className="page-header">
            Create Account
          </div>
          <div className="row">
            <Alert alertState={alertState} handleAlertClick={handleAlertClick} />
          </div>
          <div className="row">
            <div className="col-12 col-lg-6">
              {loggedIn ? (
                <p>
                  Success! You may now head{' '}
                  <Link to="/">back to the homepage.</Link>
                </p>
              ) : (
                <SignUpForm formData={formData} btnSettings={btnSettings} handleFrmBtnClick={handleFrmBtnClick} setAlertState={setAlertState} formType='create' validate={true} />
              )}
              <div className="col-12 col-lg-6">
              </div>
            </div>
          </div>
        </section>
      </main >
    </ErrorBoundary>

  );
};

export default Signup;
