'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _elliptic = require('elliptic');

var _didJwt = require('did-jwt');

var _Digest = require('did-jwt/lib/Digest');

var _uportDidResolver = require('uport-did-resolver');

var _uportDidResolver2 = _interopRequireDefault(_uportDidResolver);

var _muportDidResolver = require('muport-did-resolver');

var _muportDidResolver2 = _interopRequireDefault(_muportDidResolver);

var _ethrDidResolver = require('ethr-did-resolver');

var _ethrDidResolver2 = _interopRequireDefault(_ethrDidResolver);

var _httpsDidResolver = require('https-did-resolver');

var _httpsDidResolver2 = _interopRequireDefault(_httpsDidResolver);

var _uportLite = require('uport-lite');

var _uportLite2 = _interopRequireDefault(_uportLite);

var _mnid = require('mnid');

var _Contract = require('./Contract.js');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var secp256k1 = new _elliptic.ec('secp256k1');

var Types = {
  DISCLOSURE_REQUEST: 'shareReq',
  DISCLOSURE_RESPONSE: 'shareResp',
  TYPED_DATA_SIGNATURE_REQUEST: 'eip712Req',
  VERIFICATION_SIGNATURE_REQUEST: 'verReq',
  ETH_TX_REQUEST: 'ethtx'

  /**
   * The Credentials class allows you to easily create the signed payloads used in uPort including
   * credentials and signed mobile app requests (ex. selective disclosure requests
   * for private data). It also provides signature verification over signed payloads.
   */

};
var Credentials = function () {
  /**
   * Instantiates a new uPort Credentials object
   *
   * The following example is just for testing purposes. *You should never store a private key in source code.*
   *
   * @example
   * import { Credentials } from 'uport-credentials'
   * const credentials = new Credentials({
   *   privateKey: '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3'
   * })
   *
   * The above example derives the public key used to generate the did, so only a private key is needed.
   * Generating a public key from a private key is slow. It is recommended to configure the `did` option as well.
   *
   * @example
   * import { Credentials } from 'uport-credentials'
   * const credentials = new Credentials({
   *   did: 'did:ethr:0xbc3ae59bc76f894822622cdef7a2018dbe353840',
   *   privateKey: '74894f8853f90e6e3d6dfdd343eb0eb70cca06e552ed8af80adadcc573b35da3'
   * })
   *
   * It is recommended to store the address and private key in environment variables for your server application
   *
   * @example
   * import { Credentials, SimpleSigner } from 'uport-credentials'
   * const credentials = new Credentials({
   *   did: process.env.APPLICATION_DID,
   *   signer: SimpleSigner(process.env.PRIVATE_KEY)
   * })
   *
   * Instead of a private key you can pass in a [Signer Functions](https://github.com/uport-project/did-jwt#signer-functions) to
   * present UX or call a HSM.
   *
   * @example
   * import { Credentials } from 'uport-credentials'
   *
   * function mySigner (data) {
   *   return new Promise((resolve, reject) => {
   *     const signature = /// sign it
   *     resolve(signature)
   *   })
   * }
   *
   * const credentials = new Credentials({
   *   did: process.env.APPLICATION_DID,
   *   signer: mySigner
   * })
   *
   * @param       {Object}            [settings]               optional setttings
   * @param       {DID}               [settings.did]           Application [DID](https://w3c-ccg.github.io/did-spec/#decentralized-identifiers-dids) (unique identifier) for your application
   * @param       {String}            [settings.privateKey]    A hex encoded 32 byte private key
   * @param       {SimpleSigner}      [settings.signer]        a signer object, see [Signer Functions](https://github.com/uport-project/did-jwt#signer-functions)
   * @param       {Object}            [settings.ethrConfig]    Configuration object for ethr did resolver. See [ethr-did-resolver](https://github.com/uport-project/ethr-did-resolver)
   * @param       {Object}            [settings.muportConfig]  Configuration object for muport did resolver. See [muport-did-resolver](https://github.com/uport-project/muport-did-resolver)
   * @param       {Address}           [settings.address]       DEPRECATED your uPort address (may be the address of your application's uPort identity)
   * @param       {Object}            [settings.networks]      DEPRECATED networks config object, ie. {  '0x94365e3b': { rpcUrl: 'https://private.chain/rpc', address: '0x0101.... }}
   * @param       {UportLite}         [settings.registry]      DEPRECATED a registry object from UportLite
   * @return      {Credentials}                                self
   */
  function Credentials() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        did = _ref.did,
        address = _ref.address,
        privateKey = _ref.privateKey,
        signer = _ref.signer,
        networks = _ref.networks,
        registry = _ref.registry,
        ethrConfig = _ref.ethrConfig,
        muportConfig = _ref.muportConfig;

    (0, _classCallCheck3.default)(this, Credentials);

    if (signer) {
      this.signer = signer;
    } else if (privateKey) {
      this.signer = (0, _didJwt.SimpleSigner)(privateKey);
    }

    if (did) {
      this.did = did;
    } else if (address) {
      if ((0, _mnid.isMNID)(address)) {
        this.did = 'did:uport:' + address;
      }
      if (address.match('^0x[0-9a-fA-F]{40}$')) {
        this.did = 'did:ethr:' + address;
      }
    } else if (privateKey) {
      var kp = secp256k1.keyFromPrivate(privateKey);
      var _address = (0, _Digest.toEthereumAddress)(kp.getPublic('hex'));
      this.did = 'did:ethr:' + _address;
    }

    this.signJWT = function (payload, expiresIn) {
      return (0, _didJwt.createJWT)(payload, {
        issuer: _this.did,
        signer: _this.signer,
        alg: _this.did.match('^did:uport:') || (0, _mnid.isMNID)(_this.did) ? 'ES256K' : 'ES256K-R',
        expiresIn: expiresIn
      });
    };

    (0, _uportDidResolver2.default)(registry || (0, _uportLite2.default)({ networks: networks ? configNetworks(networks) : {} }));
    (0, _ethrDidResolver2.default)(ethrConfig || {});
    (0, _muportDidResolver2.default)(muportConfig || {});
    (0, _httpsDidResolver2.default)();
  }

  /**
   * Generate a DID and private key, effectively creating a new identity that can sign and verify data
   *
   * @example
   * const {did, privateKey} = Credentials.createIdentity()
   * const credentials = new Credentials({did, privateKey, ...})
   *
   * @returns {Object} keypair
   *           - {String} keypair.did         An ethr-did string for the new identity
   *           - {String} keypair.privateKey  The identity's private key, as a string
   */


  (0, _createClass3.default)(Credentials, [{
    key: 'createDisclosureRequest',


    /**
     *  Creates a [Selective Disclosure Request JWT](https://github.com/uport-project/specs/blob/develop/messages/sharereq.md)
     *
     *  @example
     *  const req = { requested: ['name', 'country'],
     *                callbackUrl: 'https://myserver.com',
     *                notifications: true }
     *  credentials.createDisclosureRequest(req).then(jwt => {
     *      ...
     *  })
     *
     *  @param    {Object}             [params={}]           request params object
     *  @param    {Array}              params.requested      an array of attributes for which you are requesting credentials to be shared for
     *  @param    {Array}              params.verified       an array of attributes for which you are requesting verified credentials to be shared for
     *  @param    {Boolean}            params.notifications  boolean if you want to request the ability to send push notifications
     *  @param    {String}             params.callbackUrl    the url which you want to receive the response of this request
     *  @param    {String}             params.networkId      network id of Ethereum chain of identity eg. 0x4 for rinkeby
     *  @param    {String[]}           params.vc             An array of JWTs about the requester, signed by 3rd parties
     *  @param    {String}             params.accountType    Ethereum account type: "general", "segregated", "keypair", or "none"
     *  @param    {Number}             expiresIn             Seconds until expiry
     *  @return   {Promise<Object, Error>}                   a promise which resolves with a signed JSON Web Token or rejects with an error
     */
    value: function createDisclosureRequest() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var expiresIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 600;

      var payload = {};
      if (params.requested) payload.requested = params.requested;
      if (params.verified) payload.verified = params.verified;
      if (params.notifications) payload.permissions = ['notifications'];
      if (params.callbackUrl) payload.callback = params.callbackUrl;
      if (params.network_id) payload.net = params.network_id;
      if (params.vc) payload.vc = params.vc;
      if (params.exp) payload.exp = params.exp;

      if (params.accountType) {
        if (['general', 'segregated', 'keypair', 'none'].indexOf(params.accountType) >= 0) {
          payload.act = params.accountType;
        } else {
          return _promise2.default.reject(new Error('Unsupported accountType ' + params.accountType));
        }
      }

      return this.signJWT((0, _extends3.default)({}, payload, { type: Types.DISCLOSURE_REQUEST }), params.exp ? undefined : expiresIn);
    }

    /**
     *  Create a credential (a signed JSON Web Token)
     *
     *  @example
     *  credentials.createVerification({
     *   sub: '5A8bRWU3F7j3REx3vkJ...', // uPort address of user, likely a MNID
     *   exp: <future timestamp>,
     *   claim: { name: 'John Smith' }
     *  }).then( credential => {
     *   ...
     *  })
     *
     * @param    {Object}            [credential]           a unsigned claim object
     * @param    {String}            credential.sub         subject of credential (a valid DID)
     * @param    {String}            credential.claim       claim about subject single key value or key mapping to object with multiple values (ie { address: {street: ..., zip: ..., country: ...}})
     * @param    {String}            credential.exp         time at which this claim expires and is no longer valid (seconds since epoch)
     * @return   {Promise<Object, Error>}                   a promise which resolves with a credential (JWT) or rejects with an error
     */

  }, {
    key: 'createVerification',
    value: function createVerification(_ref2) {
      var sub = _ref2.sub,
          claim = _ref2.claim,
          exp = _ref2.exp,
          vc = _ref2.vc;

      return this.signJWT({ sub: sub, claim: claim, exp: exp, vc: vc });
    }

    /**
     *  Creates a request a for a DID to [sign a verification](https://github.com/uport-project/specs/blob/develop/messages/verificationreq.md)
     *
     *  @example
     *  const unsignedClaim = {
     *    claim: {
     *      "Citizen of city X": {
     *        "Allowed to vote": true,
     *        "Document": "QmZZBBKPS2NWc6PMZbUk9zUHCo1SHKzQPPX4ndfwaYzmPW"
     *      }
     *    },
     *    sub: "2oTvBxSGseWFqhstsEHgmCBi762FbcigK5u"
     *  }
     *  const aud = '0x123...'
     *  const sub = '0x456...'
     *  const callbackUrl = 'https://my.cool.site/handleTheResponse'
     *  credentials.createVerificationSignatureRequest(unsignedClaim, {aud, sub, callbackUrl}).then(jwt => {
     *    // ...
     *  })
     *
     * @param    {Object}      unsignedClaim       Unsigned claim object which you want the user to attest
     * @param    {Object}      [opts]
     * @param    {String}      [opts.aud]          The DID of the identity you want to sign the attestation
     * @param    {String}      [opts.sub]          The DID which the unsigned claim is about
     * @param    {String}      [opts.riss]         The DID of the identity you want to sign the Verified Claim
     * @param    {String}      [opts.callbackUrl]  The url to receive the response of this request
     * @param    {Object[]}    [opts.vc]           An array of JWTs about the requester, signed by 3rd parties
     * @returns  {Promise<Object, Error>}          A promise which resolves with a signed JSON Web Token or rejects with an error
     */

  }, {
    key: 'createVerificationSignatureRequest',
    value: function createVerificationSignatureRequest(unsignedClaim) {
      var _ref3 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          aud = _ref3.aud,
          sub = _ref3.sub,
          riss = _ref3.riss,
          callbackUrl = _ref3.callbackUrl,
          vc = _ref3.vc;

      return this.signJWT({
        unsignedClaim: unsignedClaim,
        sub: sub,
        riss: riss,
        aud: aud,
        vc: vc,
        callback: callbackUrl,
        type: Types.VERIFICATION_SIGNATURE_REQUEST
      });
    }

    /**
     * Create a JWT requesting a signature on a piece of structured/typed data conforming to
     * the ERC712 specification
     * @example
     * // A ERC712 Greeting Structure
     * const data = {
     *   types: {
     *     EIP712Domain: [
     *       {name: 'name', type: 'string'},
     *       {name: 'version', type: 'string'},
     *       {name: 'chainId', type: 'uint256'},
     *       {name: 'verifyingContract', type: 'address'},
     *       {name: 'salt', type: 'bytes32'}
     *     ],
     *     Greeting: [
     *       {name: 'text', type: 'string'},
     *       {name: 'subject', type: 'string'},
     *     ]
     *   },
     *   domain: {
     *     name: 'My dapp',
     *     version: '1.0',
     *     chainId: 1,
     *     verifyingContract: '0xdeadbeef',
     *     salt: '0x999999999910101010101010'
     *   },
     *   primaryType: 'Greeting',
     *   message: {
     *     text: 'Hello',
     *     subject: 'World'
     *   }
     * }
     * const sub = 'did:ethr:0xbeef1234' // Who the claim is "about"
     * const aud = 'did:ethr:0xbeef4567' // Who you are asking to sign the claim
     * const callbackUrl = 'https://my.cool.site/handleTheResponse'
     * const signRequestJWT = credentials.createTypedDataSignatureRequest(data, {sub, aud, callbackUrl})
     * // Send the JWT to a client
     * // ...
     *
     * @param {Object} typedData              the ERC712 data to sign
     * @param {Object} opts                   additional options for the jwt
     *   @param {String} opts.sub             the subject of the JWT (arbitrary)
     *   @param {String} opts.aud             the did of the identity you want to sign the typed data
     *   @param {String} opts.callbackUrl     callback URL to handle the response
     * @returns {Promise<Object, Error>}      a promise which resolves to a signed JWT or rejects with an error
     */

  }, {
    key: 'createTypedDataSignatureRequest',
    value: function createTypedDataSignatureRequest(typedData) {
      var _ref4 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          sub = _ref4.sub,
          aud = _ref4.aud,
          callbackUrl = _ref4.callbackUrl;

      // TODO: Check if the typedData is a valid ERC712 ?
      return this.signJWT({
        typedData: typedData,
        sub: sub,
        aud: aud,
        callback: callbackUrl,
        type: Types.TYPED_DATA_SIGNATURE_REQUEST
      });
    }

    /**
     *  Given a transaction object, similarly defined as the web3 transaction object,
     *  it creates a JWT transaction request and appends addtional request options.
     *
     *  @example
     *  const txObject = {
     *    to: '0xc3245e75d3ecd1e81a9bfb6558b6dafe71e9f347',
     *    value: '0.1',
     *    fn: "setStatus(string 'hello', bytes32 '0xc3245e75d3ecd1e81a9bfb6558b6dafe71e9f347')",
     *  }
     *  connect.createTxRequest(txObject, {callbackUrl: 'http://mycb.domain'}).then(jwt => {
     *    ...
     *  })
     *
     *  @param    {Object}    txObj               A web3 style transaction object
     *  @param    {Object}    [opts]
     *  @param    {String}    [opts.callbackUrl]  The url to receive the response of this request
     *  @param    {String}    [opts.exp]          Time at which this request expires and is no longer valid (seconds since epoch)
     *  @param    {String}    [opts.networkId]    Network ID for which this transaction request is for
     *  @param    {String}    [opts.label]
     *  @return   {String}                        a transaction request jwt
     */

  }, {
    key: 'createTxRequest',
    value: function createTxRequest(txObj) {
      var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
          callbackUrl = _ref5.callbackUrl,
          _ref5$exp = _ref5.exp,
          exp = _ref5$exp === undefined ? 600 : _ref5$exp,
          networkId = _ref5.networkId,
          label = _ref5.label;

      var payload = {};
      if (callbackUrl) payload.callback = callbackUrl;
      if (networkId) payload.net = networkId;
      if (label) payload.label = label;
      return this.signJWT((0, _extends3.default)({}, payload, txObj, { type: Types.ETH_TX_REQUEST }), exp);
    }

    /**
     * Creates a [Selective Disclosure Response JWT](https://github.com/uport-project/specs/blob/develop/messages/shareresp.md).
     *
     * This can either be used to share information about the signing identity or as the response to a
     * [Selective Disclosure Flow](https://github.com/uport-project/specs/blob/develop/flows/selectivedisclosure.md),
     * where it can be used to authenticate the identity.
     *
     *  @example
     *  credentials.createDisclosureResponse({own: {name: 'Lourdes Valentina Gomez'}}).then(jwt => {
     *      ...
     *  })
     *
     *  @param    {Object}             [payload={}]           request params object
     *  @param    {JWT}                payload.req            A selective disclosure Request JWT if this is returned as part of an authentication flow
     *  @param    {Object}             payload.own            An object of self attested claims about the signer (eg. name etc)
     *  @param    {Array}              payload.verified       An array of attestation JWT's to include
     *  @param    {MNID}               payload.nad            An ethereum address encoded as an [MNID](https://github.com/uport-project/mnid)
     *  @param    {Array}              payload.capabilities   An array of capability JWT's to include
     *  @return   {Promise<Object, Error>}                    a promise which resolves with a signed JSON Web Token or rejects with an error
     */

  }, {
    key: 'createDisclosureResponse',
    value: function () {
      var _ref6 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
        var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
        var expiresIn = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 600;
        var verified;
        return _regenerator2.default.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!payload.req) {
                  _context.next = 5;
                  break;
                }

                _context.next = 3;
                return (0, _didJwt.verifyJWT)(payload.req);

              case 3:
                verified = _context.sent;

                if (verified.issuer) {
                  payload.aud = verified.issuer;
                }

              case 5:
                return _context.abrupt('return', this.signJWT((0, _extends3.default)({}, payload, { type: Types.DISCLOSURE_RESPONSE }), expiresIn));

              case 6:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function createDisclosureResponse() {
        return _ref6.apply(this, arguments);
      }

      return createDisclosureResponse;
    }()

    /**
     * Parse a selective disclosure response, and verify signatures on each signed claim ("verification") included.
     *
     * @param     {Object}             response       A selective disclosure response payload, with associated did doc
     * @param     {Object}             response.payload   A selective disclosure response payload, with associated did doc
     * @param     {Object}             response.doc
     */

  }, {
    key: 'processDisclosurePayload',
    value: function () {
      var _ref8 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(_ref7) {
        var _this2 = this;

        var doc = _ref7.doc,
            payload = _ref7.payload;
        var credentials, verified;
        return _regenerator2.default.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                credentials = (0, _extends3.default)({}, doc.uportProfile || {}, payload.own || {}, payload.capabilities && payload.capabilities.length === 1 ? { pushToken: payload.capabilities[0] } : {}, {
                  did: payload.iss,
                  boxPub: payload.boxPub
                });

                if (payload.nad) {
                  credentials.mnid = payload.nad;
                  credentials.address = (0, _mnid.decode)(payload.nad).address;
                }
                if (payload.dad) {
                  credentials.deviceKey = payload.dad;
                }

                if (!payload.verified) {
                  _context2.next = 10;
                  break;
                }

                _context2.next = 6;
                return _promise2.default.all(payload.verified.map(function (token) {
                  return (0, _didJwt.verifyJWT)(token, { audience: _this2.did });
                }));

              case 6:
                verified = _context2.sent;
                return _context2.abrupt('return', (0, _extends3.default)({}, credentials, {
                  verified: verified.map(function (v) {
                    return (0, _extends3.default)({}, v.payload, { jwt: v.jwt });
                  })
                }));

              case 10:
                return _context2.abrupt('return', credentials);

              case 11:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      function processDisclosurePayload(_x9) {
        return _ref8.apply(this, arguments);
      }

      return processDisclosurePayload;
    }()

    /**
     *  Authenticates [Selective Disclosure Response JWT](https://github.com/uport-project/specs/blob/develop/messages/shareresp.md) from uPort
     *  client as part of the [Selective Disclosure Flow](https://github.com/uport-project/specs/blob/develop/flows/selectivedisclosure.md).
     *
     *  It Verifies and parses the given response token and verifies the challenge response flow.
     *
     *  @example
     *  const resToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJyZXF1Z....'
     *  credentials.authenticateDisclosureResponse(resToken).then(res => {
     *      const credentials = res.verified
     *      const name =  res.name
     *      ...
     *  })
     *
     *  @param    {String}                  token                 a response token
     *  @param    {String}                  [callbackUrl=null]    callbackUrl
     *  @return   {Promise<Object, Error>}                        a promise which resolves with a parsed response or rejects with an error.
     */

  }, {
    key: 'authenticateDisclosureResponse',
    value: function () {
      
      var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(token) {
        var callbackUrl = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

        var _ref10, payload, doc, challenge;

        return _regenerator2.default.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                _context3.next = 2;
                return (0, _didJwt.verifyJWT)(token, {
                  audience: this.did,
                  callbackUrl: callbackUrl,
                  auth: true
                });

              case 2:
                _ref10 = _context3.sent;
                payload = _ref10.payload;
                doc = _ref10.doc;

                if (!payload.req) {
                  _context3.next = 20;
                  break;
                }

                _context3.next = 8;
                return (0, _didJwt.verifyJWT)(payload.req);

              case 8:
                challenge = _context3.sent;

                if (!(challenge.payload.iss !== this.did)) {
                  _context3.next = 13;
                  break;
                }

                throw new Error('Challenge issuer does not match current identity: ' + challenge.payload.iss + ' !== ' + this.did);

              case 13:
                if (!(challenge.payload.type !== Types.DISCLOSURE_REQUEST)) {
                  _context3.next = 17;
                  break;
                }

                throw new Error('Challenge payload type invalid: ' + challenge.payload.type);

              case 17:
                return _context3.abrupt('return', this.processDisclosurePayload({ payload: payload, doc: doc }));

              case 18:
                _context3.next = 21;
                break;

              case 20:
                throw new Error('Challenge was not included in response');

              case 21:
              case 'end':
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function authenticateDisclosureResponse(_x11) {
        return _ref9.apply(this, arguments);
      }

      return authenticateDisclosureResponse;
    }()

    /**
     *  Verify and return profile from a [Selective Disclosure Response JWT](https://github.com/uport-project/specs/blob/develop/messages/shareresp.md).
     *
     * The main difference between this and `authenticateDisclosureResponse()` is that it does not verify the challenge.
     * This can be used to verify user profiles that have been shared through other methods such as QR codes and messages.
     *
     *  @example
     *  const resToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJFUzI1NksifQ.eyJyZXF1Z....'
     *  credentials.verifyDisclosure(resToken).then(profile => {
     *      const credentials = profile.verified
     *      const name =  profile.name
     *      ...
     *  })
     *
     *  @param    {String}                  token                 a response token
     *  @return   {Promise<Object, Error>}                        a promise which resolves with a parsed response or rejects with an error.
     */

  }, {
    key: 'verifyDisclosure',
    value: function () {
      var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(token) {
        var _ref12, payload, doc;

        return _regenerator2.default.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _context4.next = 2;
                return (0, _didJwt.verifyJWT)(token, { audience: this.did });

              case 2:
                _ref12 = _context4.sent;
                payload = _ref12.payload;
                doc = _ref12.doc;
                return _context4.abrupt('return', this.processDisclosurePayload({ payload: payload, doc: doc }));

              case 6:
              case 'end':
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function verifyDisclosure(_x12) {
        return _ref11.apply(this, arguments);
      }

      return verifyDisclosure;
    }()

    /**
     *  Builds and returns a contract object which can be used to interact with
     *  a given contract. Similar to web3.eth.contract but with promises. Once specifying .at(address)
     *  you can call the contract functions with this object. Each call will create a request.
     *
     *  @param    {Object}       abi          contract ABI
     *  @return   {Object}                    contract object
     */

  }, {
    key: 'contract',
    value: function contract(abi) {
      var _this3 = this;

      var txObjHandler = function txObjHandler(txObj, opts) {
        if (txObj.function) txObj.fn = txObj.function;
        delete txObj['function'];
        return _this3.createTxRequest(txObj, opts);
      };
      return (0, _Contract.ContractFactory)(txObjHandler.bind(this))(abi);
    }
  }], [{
    key: 'createIdentity',
    value: function createIdentity() {
      var kp = secp256k1.genKeyPair();
      var publicKey = kp.getPublic('hex');
      var privateKey = kp.getPrivate('hex');
      var address = (0, _Digest.toEthereumAddress)(publicKey);
      var did = 'did:ethr:' + address;
      return { did: did, privateKey: privateKey };
    }
  }]);
  return Credentials;
}();

var configNetworks = function configNetworks(nets) {
  (0, _keys2.default)(nets).forEach(function (key) {
    var net = nets[key];
    if ((typeof net === 'undefined' ? 'undefined' : (0, _typeof3.default)(net)) === 'object') {
      ;['registry', 'rpcUrl'].forEach(function (key) {
        if (!net.hasOwnProperty(key)) throw new Error('Malformed network config object, object must have \'' + key + '\' key specified.');
      });
    } else {
      throw new Error('Network configuration object required');
    }
  });
  return nets;
};

exports.default = Credentials;