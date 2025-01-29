import { expect } from 'chai';
import { authMiddleware } from '../middleware/is-auth.js';
// const { expect } = require('chai');
// const authMiddleware = require('../middleware/is-auth');

// use describe to group tests together
describe('Auth middleware', function () {
  it('should throw an error if no auth header is present', function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      'Not authenticated.'
    );
  });

  it('should throw an error if auth header is only one string', function () {
    const req = {
      get: function (headerName) {
        return 'abc';
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should throw an error if token cannot be verified', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer abc';
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it('should yield a userId after decoding the token', function () {
    const req = {
      get: function (headerName) {
        return 'Bearer tokenxyzabc';
      },
    };
    authMiddleware(req, {}, () => {});
    expect(req).to.have.property('userId');
  });
});
