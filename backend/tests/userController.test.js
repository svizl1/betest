/**********************************************************************************************
*                                                                                             *
*          Make sure to uncomment the exports at bottom of server.js when testing             *
*       When done testing, comment out the exports due to how vercel handles serverless       *
*                                                                                             *
**********************************************************************************************/ 

const request = require('supertest');
const bcrypt = require("bcrypt");
const {app, server } = require('../server');
const User = require('../models/User');

const jwt = require('jsonwebtoken');

// Mocking 2FA verification for testing purposes
jest.mock('speakeasy', () => ({
  totp: {
    verify: () => true // Always returns true for testing
  }
}));

async function deleteUserByUsername(username) {
    try {
      const deletedUser = await User.findOneAndDelete({ username });
      if (!deletedUser) {
        //console.log(`User with username ${username} not found`);
        return null;
      }
      //console.log(`User with username ${username} deleted successfully`);
      return deletedUser;
    } catch (error) {
      //console.error(`Error deleting user with username ${username}:`, error);
    }
  }

describe('User Controller', () => {
   
    let userId;


    afterAll(async () => {
        try {
          await Promise.all([
            deleteUserByUsername('testuser'),
            deleteUserByUsername('testuser3'),
            deleteUserByUsername('testuser4')
          ]);
          console.log('All users deleted successfully');
          
          // Close the server
          await new Promise((resolve, reject) => {
            server.close((error) => {
              if (error) {
                console.error('Error closing server:', error);
                reject(error);
              } else {
                console.log('Server closed successfully');
                resolve();
              }
            });
          });
        } catch (error) {
          console.error('Error during cleanup:', error);
          throw error; // Rethrow the error to mark the test suite as failed
        }
      }, 10000);
    

    //------------------------------------------------------------------
    //                                Test 1
    //------------------------------------------------------------------
    it('should create a new user with valid information', async () => {
    const newUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'pAssword1111',
    };

    // Send a POST request to user creation endpoint
    const response = await request(app)
    .post('/api/users')
    .send(newUser);

    // verify the account is created in mongoDB
    expect(response.status).toBe(201);

    // verify that the created account details match the submitted information
    const createdUser = await User.findOne({ email: newUser.email });
    expect(createdUser).toBeTruthy();
    expect(createdUser.username).toBe(newUser.username);
    expect(createdUser.email).toBe(newUser.email);
    
    // Verify that the password is securely hashed
    const isPasswordValid = await bcrypt.compare(newUser.password, createdUser.password);
    expect(isPasswordValid).toBe(true);

    userId = response.body.user;
    });





    //------------------------------------------------------------------
    //                                Test 2
    //------------------------------------------------------------------
    it('should return an error for invalid or incomplete user information', async () => {
        const invalidUser = {
          username: 'testuser2',
          email: '',
          password: 'pAssword2222',
        };
    
        // Send a POST request with incomplete user information
        const response = await request(app)
          .post('/api/users')
          .send(invalidUser);
    
        // Verify that appropriate error messages are returned in the response body
        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Username, email, and password are required');
      });
    
      



    //------------------------------------------------------------------
    //                                Test 3
    //------------------------------------------------------------------
    it('should return an error for existing username', async () => {
        
        const newUser = {
            username: 'testuser3',
            email: 'test3@example.com',
            password: 'pAssword1111',
        };
    
        // Send a POST request to user creation endpoint
        await request(app)
        .post('/api/users')
        .send(newUser);
        
        
        
        const diffUser = {
            username: 'testuser3',
            email: 'DIFF@example.com',
            password: 'pAssword1111',
        };

    // Send a POST request with an existing username
    const response = await request(app)
        .post('/api/users')
        .send(diffUser);

    // Verify that the response status is 400 (Bad Request)
    expect(response.status).toBe(400);
    // Check that the response body contains an error message indicating that the username is already taken
    expect(response.body.message).toBe('Username is already taken');
    });

    
    
    
    
    //------------------------------------------------------------------
    //                                Test 4
    //------------------------------------------------------------------
    it('should return an error if email is already taken', async () => {
        
        const newUser = {
            username: 'testuser4',
            email: 'test4@example.com',
            password: 'pAssword1111',
        };
    
        // Send a POST request to user creation endpoint
        await request(app)
        .post('/api/users')
        .send(newUser);
        
        
        
        
        // Create a user with a specific email
        const diffUser = {
            username: 'DIFF',
            email: 'test4@example.com',
            password: 'pAssword1111',
        };

        // Send a POST request to create the user
        const response = await request(app)
            .post('/api/users')
            .send(diffUser);

        // Verify that the response status is 400 (Bad Request)
        expect(response.status).toBe(400);

        // Check that the response body contains an error message indicating that the email is already taken
        expect(response.body.message).toBe('Email is already registered');
    });


    //------------------------------------------------------------------
    //                                Test 5
    //------------------------------------------------------------------
    it('should return an error for usernames containing symbols', async () => {
      const newUser = {
          username: 'test$user',
          email: 'test5@example.com',
          password: 'pAssword1111',
      };

      // Send a POST request with a username containing symbols
      const response = await request(app)
          .post('/api/users')
          .send(newUser);

      // Verify that the response status is 400 (Bad Request)
      expect(response.status).toBe(400);

      // Check that the response body contains an error message indicating that the username cannot contain symbols
      expect(response.body.message).toBe('Username cannot contain symbols');
    });

  //------------------------------------------------------------------
  //                                Test 6
  //------------------------------------------------------------------
  it('should return an error for emails containing symbols', async () => {
    const newUser = {
        username: 'testuser6',
        email: 'test[]@example.com',
        password: 'pAssword1111',
    };

    // Send a POST request with an email containing symbols
    const response = await request(app)
        .post('/api/users')
        .send(newUser);

    // Verify that the response status is 400 (Bad Request)
    expect(response.status).toBe(400);

    // Check that the response body contains an error message indicating that the email format is invalid
    expect(response.body.message).toBe('Invalid email format');
  });


 //------------------------------------------------------------------
 //                                Test 7
 //------------------------------------------------------------------
 it('should login a user with valid credentials and a correct 2FA token', async () => {
  // Assuming 'testuser' with a predefined password 'pAssword1111' exists

  // Generate a 2FA token for the test user
  // In a real scenario, replace the following line with actual token generation logic
  const token = generate2FAToken('testuser');

  const response = await request(app)
      .post('/api/login') // Adjust this to your actual login endpoint
      .send({
          username: 'testuser',
          password: 'pAssword1111',
          token: token // Send the 2FA token along with login credentials
      });

  // Verify the login was successful and a token was received
  expect(response.status).toBe(200);
  expect(response.body).toHaveProperty('token');
});

});