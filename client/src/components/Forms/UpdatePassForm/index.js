import React, { useState, useEffect } from 'react';
import { validateFormField, isDeepEqual } from '../../../utils/helpers';

const UpdatePassForm = (props) => {

  const [formErrors, setFormErrors] = useState(null);

  const formType = props.formType;
  const formData = props.formData;
  const btnSettings = props.btnSettings
  const validate = props.validate;

  const handleFrmBtnClick = props.handleFrmBtnClick;

  //Set initial form state
  const [formState, setFormState] = useState({ ...formData });

  // Set the inital button status
  const [buttonState, setBtnState] = useState(btnSettings);

  //Update form state when input data changes
  useEffect(() => {
    setFormState(formData)
  }, [formData]);

  //Update form state when input data changes
  useEffect(() => {
    setBtnState(btnSettings)
  }, [btnSettings]);

  //Update form state based on form input changes
  const handleChange = async (event) => {
    if (formType !== 'read') {
      const { name, value, type } = event.target;
      if (validate === true) {
        //Validate form and save errors in state
        const result = validateFormField(name, value, type);
        if (!result.status) {
          setFormErrors({
            ...formErrors,
            [name]: result.msg,
          });
        } else {
          const newformErrors = ({ ...formErrors })
          delete newformErrors[name];
          setFormErrors(newformErrors);
        }
      }
      //Update form state
      setFormState({
        ...formState,
        [name]: value,
      });
      //Update button state
      if (buttonState[0].state === 'disabled') {
        buttonState[0].state = 'enabled';
        setBtnState(buttonState);
      }
    }
  };

  const handleSubmit = async (event) => {
    if (formType !== 'read') {
      event.preventDefault();
      //Check if any form errors
      let errorMsg = '';
      if (formErrors && Object.keys(formErrors).length !== 0) {
        errorMsg = "Entry error: "
        for (const [key, value] of Object.entries(formErrors)) {
          errorMsg = errorMsg + value + ' ';
        }
        props.setAlertState({ variant: 'danger', message: errorMsg });
        return;
      }

      //Check if passwords match
      if (formState.newpassword !== formState.confirmpass) {
        props.setAlertState({ variant: 'danger', message: 'Passwords do not match.' });
        return;
      }

      //Check if any changes have been made to form
      if (formType === 'update' && isDeepEqual(formData, formState)) {
        props.setAlertState({ variant: 'warning', message: 'No changes made to save' });
        return;
      }
      //Update form
      handleFrmBtnClick({ event, formState });
    }
  };

  return (
    <section className="container">
      <form name="password" onSubmit={handleSubmit}>
        <div className="col-auto mb-3">
          <label className="form-label" htmlFor="password" title="Password">Current Password</label>
          <input className="form-control w-75" type="password" id="password" name="password" placeholder="Password" value={formState.password} size="60" required readOnly={formType === 'read' ? true : false} onChange={handleChange} />
        </div>
        <div className="col-auto mb-3">
          <label className="form-label" htmlFor="newpassword" title="New Password">New Password</label>
          <input className="form-control w-75" type="password" id="newpassword" name="newpassword" placeholder="New Password" value={formState.newpassword} size="60" required readOnly={formType === 'read' ? true : false} onChange={handleChange} />
        </div>
        <div className="col-auto mb-3">
          <label className="form-label" htmlFor="confirmpass" title="Confirm Password">Confirm Password</label>
          <input className="form-control w-75" type="password" id="confirmpass" name="confirmpass" placeholder="Confirm password" value={formState.confirmpass} size="60" required readOnly={formType === 'read' ? true : false} onChange={handleChange} />
        </div>
        {buttonState.map((button, i) => {
          if (button.type === 'submit') {
            return <button key={i} type="submit" className={button.class + ' ' + button.state + ' me-3 mb-3 mb-lg-0 toolbar-btn'} name={button.name}>{button.title}</button>
          } else {
            return <button key={i} type={button.type} className={button.class + ' ' + button.state + ' me-3 mb-3 mb-lg-0 toolbar-btn'} name={button.name} onClick={handleSubmit}>{button.title}</button>
          }
        })}
      </form>
    </section>
  );
};

export default UpdatePassForm;
