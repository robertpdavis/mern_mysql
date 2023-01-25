import React, { useState, useEffect } from 'react';
import { validateFormField } from '../../../utils/helpers';
import { Link } from 'react-router-dom';

const LoginForm = (props) => {

  const [formErrors, setFormErrors] = useState(null);

  const formType = props.formType;
  const formData = props.formData;
  const btnSettings = props.btnSettings;
  const validate = props.validate;

  const handleFrmBtnClick = props.handleFrmBtnClick;

  //Set initial form state
  const [formState, setFormState] = useState({ ...formData });

  // Set the button status first and subsequent renders
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
      //Handle submit
      handleFrmBtnClick({ event, formState });
    }
  };

  return (
    <section className="container">
      <form name="login" onSubmit={handleSubmit}>
        <div className="col-auto mb-3">
          <label className="form-label" htmlFor="username" title="Username">Username</label>
          <input className="form-control w-75" type="username" id="username" name="username" placeholder="Username" value={formState.username} size="30" required readOnly={formType === 'read' ? true : false} onChange={handleChange} />
        </div>

        <div className="col-auto mb-3">
          <label className="form-label" htmlFor="password" title="Password">Password</label>
          <input className="form-control w-75" type="password" id="password" name="password" placeholder="Password" value={formState.password} size="60" required readOnly={formType === 'read' ? true : false} onChange={handleChange} />
        </div>
        {buttonState.map((button, i) => {
          if (button.type === 'submit') {
            return <button key={i} type="submit" className={button.class + ' ' + button.state + ' me-3 mb-3 mb-lg-0 toolbar-btn'} name={button.name}>{button.title}</button>
          } else {
            return <button key={i} type={button.type} className={button.class + ' ' + button.state + ' me-3 mb-3 mb-lg-0 toolbar-btn'} name={button.name} onClick={handleSubmit}>{button.title}</button>
          }
        })}
        <div>
          <p>Don't have an account? Click <Link to="/signup"> here </Link> to signup and trial for 30 days free!</p>
        </div>
      </form>
    </section>
  );
};

export default LoginForm;
