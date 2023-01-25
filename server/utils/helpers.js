import { User } from '../models/index.js';

export const validateFormField = (name, value, type) => {

  let status = false;
  let msg = '';

  const option = type + '-' + name;

  switch (option) {
    case 'email-email':
      const emailRe = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (emailRe.test(String(value).toLowerCase())) {
        status = true;
        msg = '';
      } else {
        msg = 'Email error. Check email and try again.';
      }
      break;
    case 'password-password':
      const pwordRe = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (value.match(pwordRe)) {
        status = true;
        msg = '';
      } else {
        msg = 'Password error. Minimum eight characters, at least one uppercase letter, one lowercase letter and one number.'
      }
      break;
    case 'text-username':
      const unameRe = /^[0-9a-zA-Z]+$/;
      if (unameRe.test(String(value).toLowerCase())) {
        status = true;
        msg = '';
      } else {
        msg = 'Username error. Can only be letters and numbers.'
      }
      break;

    default:
      status = true;
      break;
  }

  return ({ status, msg });
}

export const checkEmail = async (email) => {
  //Check email and check if not already registered
  let status = '';
  let msg = '';
  const checkEmail = validateFormField('email', email, 'email');
  if (checkEmail.status === true) {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });
    if (user) {
      status = false;
      msg = "Email address already registered."
      return ({ status, msg });
    } else {
      status = true;
      msg = '';
      return ({ status, msg });
    }
  } else {
    status = false;
    msg = checkEmail.msg;
    return ({ status, msg });
  }
}

export const checkUsername = async (username) => {
  //Check username and check if not already registered
  let status = '';
  let msg = '';
  const checkUname = validateFormField('username', username, 'text');
  if (checkUname.status === true) {
    const user = await User.findOne({
      where: {
        username: username,
      },
    });
    if (user) {
      status = false;
      msg = "Username not available."
      return ({ status, msg });
    } else {
      status = true;
      msg = '';
      return ({ status, msg });
    }
  } else {
    status = false;
    msg = checkUname.msg
    return ({ status, msg });
  }
}

export const isDeepEqual = (object1, object2) => {

  const objKeys1 = Object.keys(object1);
  const objKeys2 = Object.keys(object2);

  if (objKeys1.length !== objKeys2.length) return false;

  for (var key of objKeys1) {
    const value1 = object1[key];
    const value2 = object2[key];

    const isObjects = isObject(value1) && isObject(value2);

    if ((isObjects && !isDeepEqual(value1, value2)) ||
      (!isObjects && value1 !== value2)
    ) {
      return false;
    }
  }
  return true;
};

const isObject = (object) => {
  return object != null && typeof object === "object";
};
