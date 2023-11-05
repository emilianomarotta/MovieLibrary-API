const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const {
  registerUser,
  getUsers,
  emptyFields,
  isValidPassword,
  isValidEmail,
  userAlreadyExist,
  encryptPassword,
  addUser,
} = require('../controllers/userController');
const usersFilePath = path.join(__dirname, '../data/users.txt');

describe('User Controller', () => {
  beforeEach(() => {
    const emptyUsers = [];
    fs.writeFileSync(usersFilePath, JSON.stringify(emptyUsers, null, 2));
  });

  describe('registerUser', () => {
    test('registerUser - Usuario registrado con éxito', async () => {
      const req = {
        body: {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          password: 'Test123!'
        }
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };

      await registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(201);

      expect(res.json).toHaveBeenCalledWith({
        message: 'Usuario registrado con éxito.',
        user: 'test@example.com'
      });
    });

    test('registerUser - Faltan datos obligatorios', () => {
      const req = {
        body: {}
      };

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };

      registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Faltan datos obligatorios.' });
    });

    test('registerUser - Debería devolver un error si el correo electrónico no es válido', () => {
      const req = {
        body: {
          email: 'invalid-email',
          firstName: 'Test',
          lastName: 'User',
          password: 'Test123!'
        }
      };

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };

      registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Ingrese mail válido.' });
    });

    test('registerUser - Debería devolver un error si la contraseña no es válida', () => {
      const req = {
        body: {
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
          password: 'invalid-password'
        }
      };

      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };

      registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'La constraseña debe tener un mínimo de 8 caracteres.'
          + ' Debe contener al menos 1 número, 1 mayúscula y 1 caracter especial'
      });
    });

    test('Debería devolver un error si el usuario ya está registrado', async () => {
      const req = {
        body: {
          email: 'existing-user@example.com',
          firstName: 'Existing',
          lastName: 'User',
          password: 'ValidPass1!'
        }
      };
      const res = {
        status: jest.fn(() => res),
        json: jest.fn()
      };
      await registerUser(req, res);
      await registerUser(req, res);
      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith({ message: 'El usuario ya está registrado.' });
    });
  });


  describe('isValidEmail', () => {
    test('debería retornar true para un email válido', () => {
      const validEmail = 'test@example.com';
      expect(isValidEmail(validEmail)).toBe(true);
    });

    test('debería retornar false para un email no válido', () => {
      const invalidEmail = 'invalid-email';
      expect(isValidEmail(invalidEmail)).toBe(false);
    });
  });

  describe('isValidPassword', () => {
    test('debería retornar true para una contraseña válida', () => {
      const validPassword = 'Test123!';
      expect(isValidPassword(validPassword)).toBe(true);
    });

    test('debería retornar false para una contraseña no válida', () => {
      const invalidPassword = 'password';
      expect(isValidPassword(invalidPassword)).toBe(false);
    });
  });

  describe('userAlreadyExist', () => {
    const users = [
      { email: 'user1@example.com' },
      { email: 'user2@example.com' },
    ];

    test('debería retornar true si el usuario ya existe', () => {
      const existingEmail = 'user1@example.com';
      expect(userAlreadyExist(users, existingEmail)).toBe(true);
    });

    test('debería retornar false si el usuario no existe', () => {
      const nonExistingEmail = 'newuser@example.com';
      expect(userAlreadyExist(users, nonExistingEmail)).toBe(false);
    });
  });

  describe('encryptPassword', () => {
    test('debería generar un hash y verificar si luego de encriptar, coincide con la contraseña', async () => {
      const user = { password: 'password123' };
      const password = 'password123';
      await encryptPassword(user);
      expect(bcrypt.compareSync(password, user.password)).toBe(true);
    });

    test('debería generar un hash y verificar si luego de encriptar, no coincide con la contraseña', async () => {
      const user = { password: 'password123' };
      const password = 'password123fg';
      await encryptPassword(user);
      expect(bcrypt.compareSync(password, user.password)).toBe(false);
    });
  });

  describe('emptyFields', () => {
    test('debería devolver true si algún campo está vacío', () => {
      const data = {
        field1: 'Valor no vacío',
        field2: '',
        field3: 'Otro valor no vacío',
      };
      const fields = ['field1', 'field2', 'field3'];

      expect(emptyFields(data, fields)).toBe(true);
    });

    test('debería devolver false si todos los campos tienen valores', () => {
      const data = {
        field1: 'Valor no vacío',
        field2: 'Otro valor no vacío',
      };
      const fields = ['field1', 'field2'];

      expect(emptyFields(data, fields)).toBe(false);
    });

    test('debería devolver false si no se proporcionan campos', () => {
      const data = {
        field1: 'Valor no vacío',
      };
      const fields = [];

      expect(emptyFields(data, fields)).toBe(false);
    });

  });



});