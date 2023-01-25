import { User } from '../models/index.js';
import { AuthenticationError } from 'apollo-server-express';
import { signToken } from '../utils/auth.js';
import { checkEmail, checkUsername, validateFormField } from '../utils/helpers.js';
export default {
  Query: {
    getUser: async (parent, args, context) => {
      try {
        if (context.user) {
          return await User.findOne({
            where: {
              id: args.id,
            },
          });
        }
        throw new AuthenticationError('Authentication error.');
      } catch (e) {
        console.log(e);
        throw (e);
      }
    },

    getUsers: async (parent, { pageIndex, pageSize }, context) => {
      try {
        if (context.user) {

          let offset = 0
          let limit = 10

          if (pageIndex >= 0 && pageSize >= 0) {
            offset = pageIndex * pageSize;
            limit = pageSize;
          }

          const response = await User.findAndCountAll({
            limit,
            offset
          });

          const users = response.rows;
          const count = response.count;
          return ({ users, count });
        }
        throw new AuthenticationError('Authentication error.');
      } catch (e) {
        console.log(e);
        throw (e);
      }
    }

  },

  Mutation: {
    createUser: async (parent, { username, email, password, firstname, lastname }) => {
      try {
        let token = '';
        let user = '';
        let status = '';
        let msg = '';
        let result = '';
        // Check inputs are not empty
        if (username === '' || email === '' || password === '' || firstname === '' || lastname === '') {
          status = false;
          msg = 'Missing inputs. Check all required fields are entered.'
          token = '';
          user = '';
          return ({ token, user, status, msg });
        }
        // Validate email and check if not already registered
        result = await checkEmail(email);
        if (result.status === false) {
          status = false;
          msg = result.msg;
          token = '';
          user = '';
          return ({ token, user, status, msg });
        }

        // Validate username and check if not already registered
        result = await checkUsername(username);
        if (result.status === false) {
          status = false;
          msg = result.msg;
          token = '';
          user = '';
          return ({ token, user, status, msg });
        }

        // Validate passwprd
        if (password !== '') {
          result = validateFormField('password', password, 'password')
          if (result.status === false) {
            status = false;
            msg = result.msg;
            token = '';
            user = '';
            return ({ token, user, status, msg });
          }
        }

        // If here, all good so attempt to create user
        user = await User.create({ username, email, password, firstname, lastname });
        token = signToken(user);
        status = true;
        msg = 'User created.';
        return { token, user, status, msg };
      } catch (e) {
        console.log(e);
        throw (e);
      }
    },

    loginUser: async (parent, { username, password }) => {
      try {
        let status = '';
        let msg = '';

        const user = await User.findOne({
          where: {
            username: username,
          },
        });

        if (!user) {
          throw new AuthenticationError('Username or password error');
        }

        const validPassword = user.checkPassword(password);
        if (!validPassword) {
          throw new AuthenticationError('Username or password error');
        }

        status = true;
        msg = 'Login success.';

        const token = signToken(user);
        return { token, user, status, msg };

      } catch (e) {
        console.log(e);
        throw (e);
      }
    },

    updateUser: async (parent, { id, username, email, firstname, lastname }, context) => {
      try {
        if (context.user) {
          let status = '';
          let msg = '';
          let result = '';

          //Get users current details
          const user = await User.findOne({
            where: {
              id: id,
            },
          });

          if (!user) {
            status = false;
            msg = 'API error. If error persists, contact support'
            return ({ status, msg });
          }

          // Validate email and check if not already registered
          if (user.email !== email) {
            result = await checkEmail(email);
            if (result.status === false) {
              status = false;
              msg = result.msg;
              return ({ status, msg });
            }
          }

          // Validate username and check if not already registered
          if (user.username !== username) {
            result = await checkUsername(username);
            if (result.status === false) {
              status = false;
              msg = result.msg;
              return ({ status, msg });
            }
          }

          // If here, all good so attempt to update user
          const response = await User.update(
            { username, email, firstname, lastname },
            {
              where: {
                id: id,
              }
            },
          )

          if (response[0] > 0) {
            status = true;
            msg = 'User update Success'
          } else if (response[0] === 0) {
            status = false;
            msg = 'User was not updated.'
          } else {
            status = false;
            msg = 'User uddate failed.'
          }

          return { status, msg };

        } else {
          throw new AuthenticationError('Authentication error.');
        }
      } catch (e) {
        console.log(e);
        throw (e);
      }
    },

    deleteUser: async (parent, { id }, context) => {
      try {
        if (context.user) {
          let status = '';
          let msg = '';

          //Get users current details
          const user = await User.findOne({
            where: {
              id: id,
            },
          });

          if (!user) {
            status = false;
            msg = 'User does not exist.'
            return ({ status, msg });
          }

          // If here, all good so attempt to delete user
          const response = await User.destroy(
            {
              where: {
                id: id,
              }
            },
          )

          if (response > 0) {
            status = true;
            msg = 'User id:' + id + ' deleted';
          } else if (response === 0) {
            status = false;
            msg = 'User was not deleted.'
          } else {
            status = false;
            msg = 'User delete failed.'
          }

          return { status, msg };

        } else {
          throw new AuthenticationError('Authentication error.');
        }
      } catch (e) {
        console.log(e);
        throw (e);
      }
    },

    updatePassword: async (parent, { password, newpassword }, context) => {
      try {
        if (context.user) {
          let status = '';
          let msg = '';
          let result = '';

          const userId = context.user.id

          //Get user details
          const user = await User.findOne({
            where: {
              id: userId,
            },
          });

          // Check current password
          const validPassword = user.checkPassword(password);
          if (!validPassword) {
            throw new AuthenticationError('Current password error');
          }

          // Validate password
          if (password !== '') {
            result = validateFormField('password', password, 'password')
            if (result.status === false) {
              status = false;
              msg = result.msg;
              return ({ status, msg });
            }
          }

          // If here, all good so attempt to update user
          const response = await User.update(
            { password: newpassword },
            {
              where: {
                id: userId,
              }
            },
          )

          if (response[0] > 0) {
            status = true;
            msg = 'Password update Success'
          } else if (response[0] === 0) {
            status = false;
            msg = 'Password was not updated.'
          } else {
            status = false;
            msg = 'Password uddate failed.'
          }

          return { status, msg };

        } else {
          throw new AuthenticationError('Authentication error.');
        }

      } catch (e) {
        console.log(e);
        throw (e);
      }
    },
  },
};