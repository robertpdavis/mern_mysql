import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { QUERY_USERS } from '../utils/queries';
import { DELETE_USER } from '../utils/mutations';
import ButtonToolbar from '../components/ButtonToolbar';
import UserTable from '../components/Tables/UserTable';
import Alert from '../components/Alert';
import BSModal from '../components/BSModal';
import Auth from '../utils/auth';
import { ErrorBoundary, useErrorHandler } from 'react-error-boundary';

const Users = () => {
  const handleError = useErrorHandler();
  let navigate = useNavigate();

  // State to hold pagination state
  const [pageState, setPageState] = useState({ pageIndex: 0, pageSize: 10 })

  // State to control the alert banner
  const [alertState, setAlertState] = useState({ show: false });

  // State to control modal
  const [modalState, setModalState] = useState({ show: false });

  // Get the logged in user details
  let id = '';
  if (Auth.loggedIn()) {
    const user = Auth.getProfile();
    id = user.data.id;
  }

  // Get the user data
  const { loading: loadingQ, data: dataQ } = useQuery(QUERY_USERS, {
    variables: { pageIndex: pageState.pageIndex, pageSize: pageState.pageSize },
  });

  const [deleteUser, { loading: loadingM }] = useMutation(DELETE_USER,
    {
      refetchQueries: [
        'getUsers'
      ],
    });

  // Go to login page if not logged in
  if (!Auth.loggedIn()) { navigate("login") };

  // Initial button toolbar settings
  let btnSettings =
    [
      {
        type: 'button',
        name: 'select',
        title: 'User Details',
        class: 'btn btn-sm btn-success me-3',
        state: 'enabled'
      },
      {
        type: 'button',
        name: 'delete',
        title: 'Delete User',
        class: 'btn btn-sm btn-danger me-3',
        state: 'enabled'
      }
    ]

  // Set the initial button status
  const [buttonState, setBtnState] = useState(btnSettings);

  // Function to capture the selected table id (can't be useState as causes child table component render)
  let tblSelection = '';
  const setTblSelection = async (selection) => {
    tblSelection = selection;
  }

  // Toolbar button handler
  const handleTbBtnClick = async ({ event }) => {
    event.preventDefault();
    const action = event.target.name;
    let response = '';

    try {
      switch (action) {
        case 'select':
          // Check if only 1 item has been selected
          if (tblSelection.length > 1) {
            setAlertState({ variant: 'warning', message: 'Select only 1 item from the list' });
            return
          }
          // Get the user link from the selection
          if (tblSelection.length === 1) {
            const link = "/user/" + tblSelection[0].original.id;
            navigate(link);
          } else {
            setAlertState({ variant: 'warning', message: 'Select an item from the list' });
          }
          break;

        case 'delete':
        case 'deleteOk':
          // Check if only 1 item has been selected
          if (tblSelection.length > 1) {
            setAlertState({ variant: 'warning', message: 'Select only 1 item from the list' });
            return
          }

          //Get the system Id to copy
          if (tblSelection.length === 1) {
            if (action === 'delete') {
              const newState = {
                title: 'Warning',
                description: 'Are you sure you wish to delete this user?',
                buttons: [
                  {
                    variant: 'danger',
                    name: 'deleteOk',
                    title: 'Ok'
                  },
                  {
                    variant: 'secondary',
                    name: 'cancel',
                    title: 'Cancel'
                  }
                ],
                show: true,
                data: tblSelection // Pass through any data if needed
              }
              //Update modal state
              setModalState(newState);
            }
            // Ok to deleet user
            if (action === 'deleteOk') {
              const id = tblSelection[0].original.id
              response = await deleteUser({
                variables: { id },
              });

              if (response.data.deleteUser && response.data.deleteUser.status === true) {
                // Delete success
                setAlertState({ variant: 'success', message: response.data.deleteUser.msg });
              } else {
                // Delete failure
                setAlertState({ variant: 'danger', message: response.data.deleteUser.msg });
              }
            }
          } else {
            setAlertState({ variant: 'warning', message: 'Select an item from the list' });
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

  //Handle modal btn click
  const handleModalClick = async ({ event, data }) => {
    event.preventDefault();
    const action = event.target.name;

    if (action === 'cancel') { setModalState({ show: false }) };

    if (action === 'deleteOk') {
      setModalState({ show: false });
      tblSelection = data;
      handleTbBtnClick({ event });
    }
  };


  const ErrorFallback = ({ error, resetErrorBoundary }) => {
    //General app error notification content
    return (
      <main>
        <section className="container my-2">
          <div className="page-header">
            Users Table
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
  if (loadingQ || loadingM) {
    return <div>Loading...</div>;
  }

  const userData = dataQ?.getUsers || {};

  const tableData = userData.users;
  const pageCount = Math.ceil(userData.count / pageState.pageSize);

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onError={errorHandler}>
      <main>
        <section className="container my-2">
          <div className="page-header">
            User Table
          </div>
          <div className="row">
            <Alert alertState={alertState} handleAlertClick={handleAlertClick} />
          </div>
          <div className="col-6">
            <ButtonToolbar buttonState={buttonState} handleTbBtnClick={handleTbBtnClick} />
          </div>
          <div className="row">
            <div className="col-12 col-lg-6">
              <div className="sub-header">
                Users
              </div>
              <UserTable tableData={tableData} pageCount={pageCount} pageState={pageState} setTblSelection={setTblSelection} setAlertState={setAlertState} setPageState={setPageState} paginationType='server' />
              <div className="col-12 col-lg-6">
              </div>
            </div>
          </div>
        </section>
      </main >
      <BSModal modalState={modalState} handleModalClick={handleModalClick} />
    </ErrorBoundary>
  );
};

export default Users;
