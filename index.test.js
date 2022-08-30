const solusApi = require('./index');

const uuid = require('uuid');

describe('index.js', () => {
  test('Check createSessionAuth', async () => {

    const solus = new solusApi({
      AppID: process.env.SOLUS_APP_ID,
      PackageName: process.env.SOLUS_PACKAGE_NAME,
      TemplateID: process.env.SOLUS_TEMPLATE_ID,
      DeviceID: process.env.SOLUS_DEVICE_ID
    });

    const result = await solus.createSessionAuth();

    console.log(result);
    
    expect(uuid.validate(result)).toBe(true);

  });

  test('Check loginCheck when logged out', async () => {

    const solus = new solusApi({
      AppID: process.env.SOLUS_APP_ID,
      PackageName: process.env.SOLUS_PACKAGE_NAME,
      TemplateID: process.env.SOLUS_TEMPLATE_ID,
      DeviceID: uuid.v4()
    });

    const sessionId = await solus.createSessionAuth();

    const result = await solus.loginCheck(sessionId);

    console.log(result);

    expect(result).toHaveProperty('status', 'success');
    expect(result).toHaveProperty('statusmessage', '');
    expect(result).toHaveProperty('Detail', null);
    expect(result).toHaveProperty('Detail2', null);

 });

  test('Check login', async () => {

    const deviceId = uuid.v4();

    const solus = new solusApi({
      AppID: process.env.SOLUS_APP_ID,
      PackageName: process.env.SOLUS_PACKAGE_NAME,
      TemplateID: process.env.SOLUS_TEMPLATE_ID,
      DeviceID: deviceId
    });

    const sessionId = await solus.createSessionAuth();

    const account = {
      borrower_number: process.env.SOLUS_TEST_ACCOUNT_BORROWER_NUMBER,
      pin: process.env.SOLUS_TEST_ACCOUNT_PIN
    };

    const result = await solus.login(sessionId, account);

    console.log(result);

    expect(result).toHaveProperty('status', 'success');
    expect(result.Detail.length).toBe(1);
    expect(result.Detail[0]).toHaveProperty('AuthToken');
    expect(result.Detail[0]).toHaveProperty('UserID', process.env.SOLUS_TEST_ACCOUNT_BORROWER_NUMBER);

  });

  test('Check loginCheck when logged in', async () => {

    const deviceId = uuid.v4();

    const solus = new solusApi({
      AppID: process.env.SOLUS_APP_ID,
      PackageName: process.env.SOLUS_PACKAGE_NAME,
      TemplateID: process.env.SOLUS_TEMPLATE_ID,
      DeviceID: deviceId
    });

    const sessionId = await solus.createSessionAuth();

    const account = {
      borrower_number: process.env.SOLUS_TEST_ACCOUNT_BORROWER_NUMBER,
      pin: process.env.SOLUS_TEST_ACCOUNT_PIN
    };

    await solus.login(sessionId, account);

    const result = await solus.loginCheck(sessionId);

    console.log(result);

    expect(result).toHaveProperty('status', 'success');
    expect(result.Detail.length).toBe(1);
    expect(result.Detail[0]).toHaveProperty('AuthToken');
    expect(result.Detail[0]).toHaveProperty('UserID', process.env.SOLUS_TEST_ACCOUNT_BORROWER_NUMBER);

  });

  test('Check loansGet', async () => {

    const deviceId = uuid.v4();

    const solus = new solusApi({
      AppID: process.env.SOLUS_APP_ID,
      PackageName: process.env.SOLUS_PACKAGE_NAME,
      TemplateID: process.env.SOLUS_TEMPLATE_ID,
      DeviceID: deviceId
    });

    const sessionId = await solus.createSessionAuth();

    const account = {
      borrower_number: process.env.SOLUS_TEST_ACCOUNT_BORROWER_NUMBER,
      pin: process.env.SOLUS_TEST_ACCOUNT_PIN
    };

    await solus.login(sessionId, account);

    result = await solus.loansGet(sessionId, account);
    
    console.log(result);

    expect(result).toEqual(expect.any(Array));

    if (result.length) {
      expect(result[0]).toHaveProperty('recordID');
      expect(result[0]).toHaveProperty('loanID');
      expect(result[0]).toHaveProperty('itemID');
    }
    
  });

  // this errors but it used to record the response
  test('Check loanRenew invalid loanId', async () => {

    const deviceId = uuid.v4();

    const solus = new solusApi({
      AppID: process.env.SOLUS_APP_ID,
      PackageName: process.env.SOLUS_PACKAGE_NAME,
      TemplateID: process.env.SOLUS_TEMPLATE_ID,
      DeviceID: deviceId
    });

    const sessionId = await solus.createSessionAuth();

    const account = {
      borrower_number: process.env.SOLUS_TEST_ACCOUNT_BORROWER_NUMBER,
      pin: process.env.SOLUS_TEST_ACCOUNT_PIN
    };

    await solus.login(sessionId, account);

    const loanId = '0';

    result = await solus.loanRenew(sessionId, account, loanId);

    console.log(result);

    // this returns a generic error
    expect(result).toHaveProperty('status', 'error');
    expect(result).toHaveProperty('statusmessage', 'An error occurred whilst connecting to the server');
    expect(result).toHaveProperty('Detail', null);
    expect(result).toHaveProperty('Detail2', null);
  });

  test('Check loanRenew', async () => {

    const deviceId = uuid.v4();

    const solus = new solusApi({
      AppID: process.env.SOLUS_APP_ID,
      PackageName: process.env.SOLUS_PACKAGE_NAME,
      TemplateID: process.env.SOLUS_TEMPLATE_ID,
      DeviceID: deviceId
    });

    const sessionId = await solus.createSessionAuth();

    const account = {
      borrower_number: process.env.SOLUS_TEST_ACCOUNT_BORROWER_NUMBER,
      pin: process.env.SOLUS_TEST_ACCOUNT_PIN
    };

    await solus.login(sessionId, account);

    const loanId = process.env.SOLUS_TEST_ACCOUNT_PIN;

    result = await solus.loanRenew(sessionId, account, loanId);

    console.log(result);

    // this returns a generic error
    expect(result).toHaveProperty('status', 'error');
    expect(result).toHaveProperty('statusmessage', 'An error occurred whilst connecting to the server');
    expect(result).toHaveProperty('Detail', null);
    expect(result).toHaveProperty('Detail2', null);
  });

});