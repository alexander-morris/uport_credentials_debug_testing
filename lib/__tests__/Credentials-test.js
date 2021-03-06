'use strict';

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _Credentials = require('../Credentials');

var _Credentials2 = _interopRequireDefault(_Credentials);

var _didJwt = require('did-jwt');

var _mockdate = require('mockdate');

var _mockdate2 = _interopRequireDefault(_mockdate);

var _didResolver = require('did-resolver');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mockdate2.default.set(1485321133 * 1000);

var privateKey = '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3';
var signer = (0, _didJwt.SimpleSigner)(privateKey);
var address = '0xbc3ae59bc76f894822622cdef7a2018dbe353840';
var did = 'did:ethr:' + address;
var mnid = '2nQtiQG6Cgm1GYTBaaKAgr76uY7iSexUkqX';

var claim = { sub: '0x112233', claim: { email: 'bingbangbung@email.com' }, exp: 1485321133 + 1 };

var uport = new _Credentials2.default({ privateKey: privateKey, did: did });
var uport2 = new _Credentials2.default({});

function mockresolver(profile) {
  var _this = this;

  (0, _didResolver.registerMethod)('ethr', function () {
    var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(id, parsed) {
      var doc;
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              doc = {
                '@context': 'https://w3id.org/did/v1',
                id: id,
                publicKey: [{
                  id: id + '#owner',
                  type: 'Secp256k1VerificationKey2018',
                  owner: id,
                  ethereumAddress: parsed.id
                }],
                authentication: [{
                  type: 'Secp256k1SignatureAuthentication2018',
                  publicKey: id + '#owner'
                }]
              };

              if (profile) {
                doc.uportProfile = profile;
              }
              return _context.abrupt('return', doc);

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }));

    return function (_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }());
}

describe('configuration', function () {

  describe('sets did', function () {
    describe('`did` configured', function () {
      expect(new _Credentials2.default({ did: did }).did).toEqual(did);
    });

    describe('ethereum `address` configured', function () {
      expect(new _Credentials2.default({ address: address }).did).toEqual(did);
    });

    describe('`privateKey` configured', function () {
      expect(new _Credentials2.default({ privateKey: privateKey }).did).toEqual(did);
    });

    describe('mnid `address` configured', function () {
      expect(new _Credentials2.default({ address: mnid }).did).toEqual('did:uport:' + mnid);
    });
  });

  describe('sets signer', function () {
    describe('always uses signer if passed in', function () {
      var signer = (0, _didJwt.SimpleSigner)(privateKey);
      expect(new _Credentials2.default({ signer: signer, privateKey: privateKey }).signer).toEqual(signer);
    });

    describe('sets signer if privateKey is passed in', function () {
      expect(new _Credentials2.default({ privateKey: privateKey }).signer).toBeDefined();
    });
  });

  describe('configNetworks', function () {
    it('should accept a valid network setting', function () {
      var networks = { '0x94365e3b': { rpcUrl: 'https://private.chain/rpc', registry: '0x3b2631d8e15b145fd2bf99fc5f98346aecdc394c' } };
      var credentials = new _Credentials2.default({ networks: networks });
      // What is the opposite of toThrow()??
      expect(true).toBeTruthy();
    });

    it('should require a registry address', function () {
      var networks = { '0x94365e3b': { rpcUrl: 'https://private.chain/rpc' } };
      expect(function () {
        return new _Credentials2.default({ networks: networks });
      }).toThrowErrorMatchingSnapshot();
    });

    it('should require a rpcUrl', function () {
      var networks = { '0x94365e3b': { registry: '0x3b2631d8e15b145fd2bf99fc5f98346aecdc394c' } };
      expect(function () {
        return new _Credentials2.default({ networks: networks });
      }).toThrowErrorMatchingSnapshot();
    });

    it('if networks key is passed in it must contain configuration object', function () {
      var networks = { '0x94365e3b': 'hey' };
      expect(function () {
        return new _Credentials2.default({ networks: networks });
      }).toThrowErrorMatchingSnapshot();
    });
  });
});

describe('createIdentity()', function () {
  it('creates Identity', function () {
    var _Credentials$createId = _Credentials2.default.createIdentity(),
        did = _Credentials$createId.did,
        privateKey = _Credentials$createId.privateKey;

    expect(did).toMatch(/^did:ethr:0x[0-9a-fA-F]{40}$/);
    expect(privateKey).toMatch(/^[0-9a-fA-F]{64}$/);
  });
});

describe('signJWT', function () {
  describe('uport method', function () {
    it('uses ES256K algorithm with address = mnid', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      var credentials, jwt, _decodeJWT, header;

      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              credentials = new _Credentials2.default({ address: mnid, privateKey: privateKey });
              _context2.next = 3;
              return credentials.signJWT({ hello: 1 });

            case 3:
              jwt = _context2.sent;
              _decodeJWT = (0, _didJwt.decodeJWT)(jwt), header = _decodeJWT.header;

              expect(header.alg).toEqual('ES256K');

            case 6:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    })));

    it('uses ES256K with did = mnid', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      var credentials, jwt, _decodeJWT2, header;

      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              credentials = new _Credentials2.default({ did: mnid, privateKey: privateKey });
              _context3.next = 3;
              return credentials.signJWT({ hello: 1 });

            case 3:
              jwt = _context3.sent;
              _decodeJWT2 = (0, _didJwt.decodeJWT)(jwt), header = _decodeJWT2.header;

              expect(header.alg).toEqual('ES256K');

            case 6:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    })));

    it('uses ES256K with did = did:uport:mnid', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      var credentials, jwt, _decodeJWT3, header;

      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              credentials = new _Credentials2.default({ did: 'did:uport:' + mnid, privateKey: privateKey });
              _context4.next = 3;
              return credentials.signJWT({ hello: 1 });

            case 3:
              jwt = _context4.sent;
              _decodeJWT3 = (0, _didJwt.decodeJWT)(jwt), header = _decodeJWT3.header;

              expect(header.alg).toEqual('ES256K');

            case 6:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, undefined);
    })));
  });

  describe('ethr method', function () {
    it('uses ES256K-R algorithm', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      var credentials, jwt, _decodeJWT4, header;

      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              credentials = new _Credentials2.default({ did: did, privateKey: privateKey });
              _context5.next = 3;
              return credentials.signJWT({ hello: 1 });

            case 3:
              jwt = _context5.sent;
              _decodeJWT4 = (0, _didJwt.decodeJWT)(jwt), header = _decodeJWT4.header;

              expect(header.alg).toEqual('ES256K-R');

            case 6:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, undefined);
    })));
  });
});

describe('createDisclosureRequest()', function () {
  var createAndVerify = function () {
    var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var jwt;
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return uport.createDisclosureRequest(params);

            case 2:
              jwt = _context6.sent;
              _context6.next = 5;
              return (0, _didJwt.verifyJWT)(jwt);

            case 5:
              return _context6.abrupt('return', _context6.sent);

            case 6:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, this);
    }));

    return function createAndVerify() {
      return _ref6.apply(this, arguments);
    };
  }();

  beforeAll(function () {
    return mockresolver();
  });

  it('creates a valid JWT for a request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
    var response;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return createAndVerify({ requested: ['name', 'phone'] });

          case 2:
            response = _context7.sent;
            return _context7.abrupt('return', expect(response).toMatchSnapshot());

          case 4:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  })));

  it('has correct payload in JWT for a plain request for public details', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
    var response;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return createAndVerify();

          case 2:
            response = _context8.sent;
            return _context8.abrupt('return', expect(response).toMatchSnapshot());

          case 4:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  })));

  it('has correct payload in JWT requesting a specific networkId', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
    var response;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            _context9.next = 2;
            return createAndVerify({ networkId: '0x4' });

          case 2:
            response = _context9.sent;
            return _context9.abrupt('return', expect(response).toMatchSnapshot());

          case 4:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  })));

  it('has correct payload in JWT requesting a specific networkId', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
    var response;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            _context10.next = 2;
            return createAndVerify({ networkId: '0x4' });

          case 2:
            response = _context10.sent;
            return _context10.abrupt('return', expect(response).toMatchSnapshot());

          case 4:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  })));

  var _loop = function _loop(accountType) {
    it('has correct payload in JWT requesting accountType of ' + accountType, (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee18() {
      var response;
      return _regenerator2.default.wrap(function _callee18$(_context18) {
        while (1) {
          switch (_context18.prev = _context18.next) {
            case 0:
              _context18.next = 2;
              return createAndVerify({ accountType: accountType });

            case 2:
              response = _context18.sent;
              return _context18.abrupt('return', expect(response).toMatchSnapshot());

            case 4:
            case 'end':
              return _context18.stop();
          }
        }
      }, _callee18, undefined);
    })));
  };

  var _arr = ['general', 'segregated', 'keypair', 'none'];
  for (var _i = 0; _i < _arr.length; _i++) {
    var accountType = _arr[_i];
    _loop(accountType);
  }

  it('has correct payload in JWT requesting unsupported accountType', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee11() {
    return _regenerator2.default.wrap(function _callee11$(_context11) {
      while (1) {
        switch (_context11.prev = _context11.next) {
          case 0:
            expect(createAndVerify({ accountType: 'gold' })).rejects.toMatchSnapshot();

          case 1:
          case 'end':
            return _context11.stop();
        }
      }
    }, _callee11, undefined);
  })));

  it('ignores unsupported request parameters', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee12() {
    var response;
    return _regenerator2.default.wrap(function _callee12$(_context12) {
      while (1) {
        switch (_context12.prev = _context12.next) {
          case 0:
            _context12.next = 2;
            return createAndVerify({ signing: true, sellSoul: true });

          case 2:
            response = _context12.sent;
            return _context12.abrupt('return', expect(response).toMatchSnapshot());

          case 4:
          case 'end':
            return _context12.stop();
        }
      }
    }, _callee12, undefined);
  })));

  it('includes vc in payload', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee13() {
    return _regenerator2.default.wrap(function _callee13$(_context13) {
      while (1) {
        switch (_context13.prev = _context13.next) {
          case 0:
            expect(createAndVerify({ vc: ['woop'] })).toMatchSnapshot();

          case 1:
          case 'end':
            return _context13.stop();
        }
      }
    }, _callee13, undefined);
  })));

  it('has correct payload in JWT for a request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee14() {
    var response;
    return _regenerator2.default.wrap(function _callee14$(_context14) {
      while (1) {
        switch (_context14.prev = _context14.next) {
          case 0:
            _context14.next = 2;
            return createAndVerify({ requested: ['name', 'phone'] });

          case 2:
            response = _context14.sent;
            return _context14.abrupt('return', expect(response).toMatchSnapshot());

          case 4:
          case 'end':
            return _context14.stop();
        }
      }
    }, _callee14, undefined);
  })));

  it('has correct payload in JWT for a request asking for verified credentials', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee15() {
    var response;
    return _regenerator2.default.wrap(function _callee15$(_context15) {
      while (1) {
        switch (_context15.prev = _context15.next) {
          case 0:
            _context15.next = 2;
            return createAndVerify({ requested: ['name', 'phone'], verified: ['name'] });

          case 2:
            response = _context15.sent;
            return _context15.abrupt('return', expect(response).toMatchSnapshot());

          case 4:
          case 'end':
            return _context15.stop();
        }
      }
    }, _callee15, undefined);
  })));

  it('has correct payload in JWT for a request with callbackUrl', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee16() {
    var response;
    return _regenerator2.default.wrap(function _callee16$(_context16) {
      while (1) {
        switch (_context16.prev = _context16.next) {
          case 0:
            _context16.next = 2;
            return createAndVerify({ requested: ['name', 'phone'], callbackUrl: 'https://myserver.com' });

          case 2:
            response = _context16.sent;
            return _context16.abrupt('return', expect(response).toMatchSnapshot());

          case 4:
          case 'end':
            return _context16.stop();
        }
      }
    }, _callee16, undefined);
  })));

  it('has correct payload in JWT for a request for push notifications', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee17() {
    var response;
    return _regenerator2.default.wrap(function _callee17$(_context17) {
      while (1) {
        switch (_context17.prev = _context17.next) {
          case 0:
            _context17.next = 2;
            return createAndVerify({ requested: ['name', 'phone'], notifications: true });

          case 2:
            response = _context17.sent;
            return _context17.abrupt('return', expect(response).toMatchSnapshot());

          case 4:
          case 'end':
            return _context17.stop();
        }
      }
    }, _callee17, undefined);
  })));
});

describe('LEGACY createDisclosureRequest()', function () {
  var createAndVerify = function () {
    var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee19() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var jwt;
      return _regenerator2.default.wrap(function _callee19$(_context19) {
        while (1) {
          switch (_context19.prev = _context19.next) {
            case 0:
              _context19.next = 2;
              return uport.createDisclosureRequest(params);

            case 2:
              jwt = _context19.sent;
              _context19.next = 5;
              return (0, _didJwt.verifyJWT)(jwt);

            case 5:
              return _context19.abrupt('return', _context19.sent);

            case 6:
            case 'end':
              return _context19.stop();
          }
        }
      }, _callee19, this);
    }));

    return function createAndVerify() {
      return _ref19.apply(this, arguments);
    };
  }();

  beforeAll(function () {
    return mockresolver();
  });

  it('creates a valid JWT for a request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee20() {
    var response;
    return _regenerator2.default.wrap(function _callee20$(_context20) {
      while (1) {
        switch (_context20.prev = _context20.next) {
          case 0:
            _context20.next = 2;
            return createAndVerify({ requested: ['name', 'phone'] });

          case 2:
            response = _context20.sent;
            return _context20.abrupt('return', expect(response).toMatchSnapshot());

          case 4:
          case 'end':
            return _context20.stop();
        }
      }
    }, _callee20, undefined);
  })));
});

describe('disclose()', function () {
  var createAndVerify = function () {
    var _ref21 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee21() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var jwt;
      return _regenerator2.default.wrap(function _callee21$(_context21) {
        while (1) {
          switch (_context21.prev = _context21.next) {
            case 0:
              _context21.next = 2;
              return uport.createDisclosureResponse(params);

            case 2:
              jwt = _context21.sent;
              _context21.next = 5;
              return (0, _didJwt.verifyJWT)(jwt, { audience: did });

            case 5:
              return _context21.abrupt('return', _context21.sent);

            case 6:
            case 'end':
              return _context21.stop();
          }
        }
      }, _callee21, this);
    }));

    return function createAndVerify() {
      return _ref21.apply(this, arguments);
    };
  }();

  beforeAll(function () {
    return mockresolver();
  });


  it('creates a valid JWT for a disclosure', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee22() {
    var response;
    return _regenerator2.default.wrap(function _callee22$(_context22) {
      while (1) {
        switch (_context22.prev = _context22.next) {
          case 0:
            _context22.next = 2;
            return createAndVerify({ own: { name: 'Bob' } });

          case 2:
            response = _context22.sent;
            return _context22.abrupt('return', expect(response).toMatchSnapshot());

          case 4:
          case 'end':
            return _context22.stop();
        }
      }
    }, _callee22, undefined);
  })));

  it('creates a valid JWT for a disclosure', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee23() {
    var req, response;
    return _regenerator2.default.wrap(function _callee23$(_context23) {
      while (1) {
        switch (_context23.prev = _context23.next) {
          case 0:
            _context23.next = 2;
            return uport.createDisclosureRequest();

          case 2:
            req = _context23.sent;
            _context23.next = 5;
            return createAndVerify({ req: req });

          case 5:
            response = _context23.sent;
            return _context23.abrupt('return', expect(response).toMatchSnapshot());

          case 7:
          case 'end':
            return _context23.stop();
        }
      }
    }, _callee23, undefined);
  })));
});

describe('createVerificationSignatureRequest()', function () {
  it('creates a valid JWT for a request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee24() {
    var jwt;
    return _regenerator2.default.wrap(function _callee24$(_context24) {
      while (1) {
        switch (_context24.prev = _context24.next) {
          case 0:
            _context24.next = 2;
            return uport.createVerificationSignatureRequest({ claim: { test: { prop1: 1, prop2: 2 } } }, { sub: 'did:uport:223ab45' });

          case 2:
            jwt = _context24.sent;
            _context24.t0 = expect;
            _context24.next = 6;
            return (0, _didJwt.verifyJWT)(jwt, { audience: did });

          case 6:
            _context24.t1 = _context24.sent;
            return _context24.abrupt('return', (0, _context24.t0)(_context24.t1).toMatchSnapshot());

          case 8:
          case 'end':
            return _context24.stop();
        }
      }
    }, _callee24, undefined);
  })));
});

describe('createTypedDataSignatureRequest()', function () {
  var typedData = {
    types: {
      EIP712Domain: [{ name: 'name', type: 'string' }, { name: 'version', type: 'string' }, { name: 'chainId', type: 'uint256' }, { name: 'verifyingContract', type: 'address' }, { name: 'salt', type: 'bytes32' }],
      Greeting: [{ name: 'text', type: 'string' }, { name: 'subject', type: 'string' }]
    },
    domain: {
      name: 'My dapp',
      version: '1.0',
      chainId: 1,
      verifyingContract: '0xdeadbeef',
      salt: '0x999999999910101010101010'
    },
    primaryType: 'Greeting',
    message: {
      text: 'Hello',
      subject: 'World'
    }
  };

  it('creates a valid JWT for a typed data request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee25() {
    var jwt;
    return _regenerator2.default.wrap(function _callee25$(_context25) {
      while (1) {
        switch (_context25.prev = _context25.next) {
          case 0:
            _context25.next = 2;
            return uport.createTypedDataSignatureRequest(typedData, { aud: 'did:ethr:deadbeef', sub: 'did:ethr:deadbeef' });

          case 2:
            jwt = _context25.sent;

            expect(jwt).toMatchSnapshot();

          case 4:
          case 'end':
            return _context25.stop();
        }
      }
    }, _callee25, undefined);
  })));
});

describe('createVerification()', function () {
  beforeAll(function () {
    return mockresolver();
  });
  it('has correct payload in JWT for an attestation', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee27() {
    return _regenerator2.default.wrap(function _callee27$(_context27) {
      while (1) {
        switch (_context27.prev = _context27.next) {
          case 0:
            return _context27.abrupt('return', uport.createVerification({ sub: 'did:uport:223ab45', claim: { email: 'bingbangbung@email.com' }, exp: 1485321133 + 1 }).then(function () {
              var _ref27 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee26(jwt) {
                var decoded;
                return _regenerator2.default.wrap(function _callee26$(_context26) {
                  while (1) {
                    switch (_context26.prev = _context26.next) {
                      case 0:
                        _context26.next = 2;
                        return (0, _didJwt.verifyJWT)(jwt);

                      case 2:
                        decoded = _context26.sent;
                        return _context26.abrupt('return', expect(decoded).toMatchSnapshot());

                      case 4:
                      case 'end':
                        return _context26.stop();
                    }
                  }
                }, _callee26, undefined);
              }));

              return function (_x6) {
                return _ref27.apply(this, arguments);
              };
            }()));

          case 1:
          case 'end':
            return _context27.stop();
        }
      }
    }, _callee27, undefined);
  })));
});

describe('authenticateDisclosureResponse()', function () {
  var createShareResp = function () {
    var _ref28 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee28() {
      var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var req;
      return _regenerator2.default.wrap(function _callee28$(_context28) {
        while (1) {
          switch (_context28.prev = _context28.next) {
            case 0:
              _context28.next = 2;
              return uport.createDisclosureRequest({ requested: ['name', 'phone'] });

            case 2:
              req = _context28.sent;
              return _context28.abrupt('return', uport.createDisclosureResponse((0, _extends3.default)({}, payload, { req: req })));

            case 4:
            case 'end':
              return _context28.stop();
          }
        }
      }, _callee28, this);
    }));

    return function createShareResp() {
      return _ref28.apply(this, arguments);
    };
  }();

  var createShareRespWithVerifiedCredential = function () {
    var _ref29 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee29() {
      var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var req, attestation;
      return _regenerator2.default.wrap(function _callee29$(_context29) {
        while (1) {
          switch (_context29.prev = _context29.next) {
            case 0:
              _context29.next = 2;
              return uport.createDisclosureRequest({ requested: ['name', 'phone'] });

            case 2:
              req = _context29.sent;
              _context29.next = 5;
              return uport.createVerification(claim);

            case 5:
              attestation = _context29.sent;
              return _context29.abrupt('return', uport.createDisclosureResponse((0, _extends3.default)({}, payload, { verified: [attestation], req: req })));

            case 7:
            case 'end':
              return _context29.stop();
          }
        }
      }, _callee29, this);
    }));

    return function createShareRespWithVerifiedCredential() {
      return _ref29.apply(this, arguments);
    };
  }();

  beforeAll(function () {
    return mockresolver({
      name: 'Super Developer',
      country: 'NI'
    });
  });

  it('returns profile mixing public and private claims', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee30() {
    var jwt, profile;
    return _regenerator2.default.wrap(function _callee30$(_context30) {
      while (1) {
        switch (_context30.prev = _context30.next) {
          case 0:
            _context30.next = 2;
            return createShareResp({ own: { name: 'Davie', phone: '+15555551234' } });

          case 2:
            jwt = _context30.sent;
            _context30.next = 5;
            return uport.authenticateDisclosureResponse(jwt);

          case 5:
            profile = _context30.sent;

            expect(profile).toMatchSnapshot();

          case 7:
          case 'end':
            return _context30.stop();
        }
      }
    }, _callee30, undefined);
  })));

  it('returns profile mixing public and private claims and verified credentials', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee31() {
    var jwt, profile;
    return _regenerator2.default.wrap(function _callee31$(_context31) {
      while (1) {
        switch (_context31.prev = _context31.next) {
          case 0:
            _context31.next = 2;
            return createShareRespWithVerifiedCredential({ own: { name: 'Davie', phone: '+15555551234' } });

          case 2:
            jwt = _context31.sent;
            _context31.next = 5;
            return uport.authenticateDisclosureResponse(jwt);

          case 5:
            profile = _context31.sent;

            expect(profile).toMatchSnapshot();

          case 7:
          case 'end':
            return _context31.stop();
        }
      }
    }, _callee31, undefined);
  })));

  it('returns profile with only public claims', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee32() {
    var jwt, profile;
    return _regenerator2.default.wrap(function _callee32$(_context32) {
      while (1) {
        switch (_context32.prev = _context32.next) {
          case 0:
            _context32.next = 2;
            return createShareResp();

          case 2:
            jwt = _context32.sent;
            _context32.next = 5;
            return uport.authenticateDisclosureResponse(jwt);

          case 5:
            profile = _context32.sent;

            expect(profile).toMatchSnapshot();

          case 7:
          case 'end':
            return _context32.stop();
        }
      }
    }, _callee32, undefined);
  })));

  it('returns profile with private chain network id claims', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee33() {
    var jwt, profile;
    return _regenerator2.default.wrap(function _callee33$(_context33) {
      while (1) {
        switch (_context33.prev = _context33.next) {
          case 0:
            _context33.next = 2;
            return createShareResp({ nad: '34wjsxwvduano7NFC8ujNJnFjbacgYeWA8m' });

          case 2:
            jwt = _context33.sent;
            _context33.next = 5;
            return uport.authenticateDisclosureResponse(jwt);

          case 5:
            profile = _context33.sent;

            expect(profile).toMatchSnapshot();

          case 7:
          case 'end':
            return _context33.stop();
        }
      }
    }, _callee33, undefined);
  })));

  it('returns pushToken if available', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee34() {
    var jwt, profile;
    return _regenerator2.default.wrap(function _callee34$(_context34) {
      while (1) {
        switch (_context34.prev = _context34.next) {
          case 0:
            _context34.next = 2;
            return createShareResp({ capabilities: ['PUSHTOKEN'] });

          case 2:
            jwt = _context34.sent;
            _context34.next = 5;
            return uport.authenticateDisclosureResponse(jwt);

          case 5:
            profile = _context34.sent;

            expect(profile).toMatchSnapshot();

          case 7:
          case 'end':
            return _context34.stop();
        }
      }
    }, _callee34, undefined);
  })));

  it('handles response with missing challenge', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee35() {
    var jwt;
    return _regenerator2.default.wrap(function _callee35$(_context35) {
      while (1) {
        switch (_context35.prev = _context35.next) {
          case 0:
            _context35.next = 2;
            return uport.createDisclosureResponse({ own: { name: 'bob' } });

          case 2:
            jwt = _context35.sent;

            expect(uport.authenticateDisclosureResponse(jwt)).rejects.toMatchSnapshot();

          case 4:
          case 'end':
            return _context35.stop();
        }
      }
    }, _callee35, undefined);
  })));
});

describe('verifyDisclosure()', function () {
  beforeAll(function () {
    return mockresolver({
      name: 'Bob Smith',
      country: 'NI'
    });
  });
  it('returns profile mixing public and private claims', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee36() {
    var jwt, profile;
    return _regenerator2.default.wrap(function _callee36$(_context36) {
      while (1) {
        switch (_context36.prev = _context36.next) {
          case 0:
            _context36.next = 2;
            return uport.createDisclosureResponse({ own: { name: 'Davie', phone: '+15555551234' } });

          case 2:
            jwt = _context36.sent;
            _context36.next = 5;
            return uport.verifyDisclosure(jwt);

          case 5:
            profile = _context36.sent;

            expect(profile).toMatchSnapshot();

          case 7:
          case 'end':
            return _context36.stop();
        }
      }
    }, _callee36, undefined);
  })));

  it('returns profile mixing public and private claims and verified credentials', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee37() {
    var attestation, jwt, profile;
    return _regenerator2.default.wrap(function _callee37$(_context37) {
      while (1) {
        switch (_context37.prev = _context37.next) {
          case 0:
            _context37.next = 2;
            return uport.createVerification(claim);

          case 2:
            attestation = _context37.sent;
            _context37.next = 5;
            return uport.createDisclosureResponse({ own: { name: 'Davie', phone: '+15555551234' }, verified: [attestation] });

          case 5:
            jwt = _context37.sent;
            _context37.next = 8;
            return uport.verifyDisclosure(jwt);

          case 8:
            profile = _context37.sent;

            expect(profile).toMatchSnapshot();

          case 10:
          case 'end':
            return _context37.stop();
        }
      }
    }, _callee37, undefined);
  })));

  it('returns profile with only public claims', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee38() {
    var jwt, profile;
    return _regenerator2.default.wrap(function _callee38$(_context38) {
      while (1) {
        switch (_context38.prev = _context38.next) {
          case 0:
            _context38.next = 2;
            return uport.createDisclosureResponse();

          case 2:
            jwt = _context38.sent;
            _context38.next = 5;
            return uport.verifyDisclosure(jwt);

          case 5:
            profile = _context38.sent;

            expect(profile).toMatchSnapshot();

          case 7:
          case 'end':
            return _context38.stop();
        }
      }
    }, _callee38, undefined);
  })));

  it('returns profile with private chain network id claims', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee39() {
    var jwt, profile;
    return _regenerator2.default.wrap(function _callee39$(_context39) {
      while (1) {
        switch (_context39.prev = _context39.next) {
          case 0:
            _context39.next = 2;
            return uport.createDisclosureResponse({ nad: '34wjsxwvduano7NFC8ujNJnFjbacgYeWA8m' });

          case 2:
            jwt = _context39.sent;
            _context39.next = 5;
            return uport.verifyDisclosure(jwt);

          case 5:
            profile = _context39.sent;

            expect(profile).toMatchSnapshot();

          case 7:
          case 'end':
            return _context39.stop();
        }
      }
    }, _callee39, undefined);
  })));

  it('returns pushToken if available', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee40() {
    var jwt, profile;
    return _regenerator2.default.wrap(function _callee40$(_context40) {
      while (1) {
        switch (_context40.prev = _context40.next) {
          case 0:
            _context40.next = 2;
            return uport.createDisclosureResponse({ capabilities: ['PUSHTOKEN'] });

          case 2:
            jwt = _context40.sent;
            _context40.next = 5;
            return uport.verifyDisclosure(jwt);

          case 5:
            profile = _context40.sent;

            expect(profile).toMatchSnapshot();

          case 7:
          case 'end':
            return _context40.stop();
        }
      }
    }, _callee40, undefined);
  })));
});

describe('txRequest()', function () {
  beforeAll(function () {
    return mockresolver();
  });

  var abi = [{ "constant": false, "inputs": [{ "name": "status", "type": "string" }], "name": "updateStatus", "outputs": [], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "addr", "type": "address" }], "name": "getStatus", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }];
  var address = '0x70A804cCE17149deB6030039798701a38667ca3B';
  var statusContract = uport.contract(abi).at(address);

  it('creates a valid JWT for a request', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee41() {
    var jwt, verified;
    return _regenerator2.default.wrap(function _callee41$(_context41) {
      while (1) {
        switch (_context41.prev = _context41.next) {
          case 0:
            _context41.next = 2;
            return statusContract.updateStatus('hello');

          case 2:
            jwt = _context41.sent;
            _context41.next = 5;
            return (0, _didJwt.verifyJWT)(jwt);

          case 5:
            verified = _context41.sent;

            expect(verified.payload).toMatchSnapshot();

          case 7:
          case 'end':
            return _context41.stop();
        }
      }
    }, _callee41, undefined);
  })));

  it('encodes readable function calls including given args in function key of jwt', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee42() {
    var jwt, verified;
    return _regenerator2.default.wrap(function _callee42$(_context42) {
      while (1) {
        switch (_context42.prev = _context42.next) {
          case 0:
            _context42.next = 2;
            return statusContract.updateStatus('hello');

          case 2:
            jwt = _context42.sent;
            _context42.next = 5;
            return (0, _didJwt.verifyJWT)(jwt);

          case 5:
            verified = _context42.sent;

            expect(verified.payload.fn).toEqual('updateStatus(string "hello")');

          case 7:
          case 'end':
            return _context42.stop();
        }
      }
    }, _callee42, undefined);
  })));

  it('adds to key as contract address to jwt', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee43() {
    var jwt, verified;
    return _regenerator2.default.wrap(function _callee43$(_context43) {
      while (1) {
        switch (_context43.prev = _context43.next) {
          case 0:
            _context43.next = 2;
            return statusContract.updateStatus('hello');

          case 2:
            jwt = _context43.sent;
            _context43.next = 5;
            return (0, _didJwt.verifyJWT)(jwt);

          case 5:
            verified = _context43.sent;

            expect(verified.payload.to).toEqual(address);

          case 7:
          case 'end':
            return _context43.stop();
        }
      }
    }, _callee43, undefined);
  })));

  it('adds additional request options passed to jwt', (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee44() {
    var networkId, callbackUrl, jwt, verified;
    return _regenerator2.default.wrap(function _callee44$(_context44) {
      while (1) {
        switch (_context44.prev = _context44.next) {
          case 0:
            networkId = '0x4';
            callbackUrl = 'mydomain';
            _context44.next = 4;
            return statusContract.updateStatus('hello', { networkId: networkId, callbackUrl: callbackUrl });

          case 4:
            jwt = _context44.sent;
            _context44.next = 7;
            return (0, _didJwt.verifyJWT)(jwt);

          case 7:
            verified = _context44.sent;

            expect(verified.payload.net).toEqual(networkId);
            expect(verified.payload.callback).toEqual(callbackUrl);

          case 10:
          case 'end':
            return _context44.stop();
        }
      }
    }, _callee44, undefined);
  })));
});