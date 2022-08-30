module.exports = class Solus {

  constructor(options) {
    this.solusUrl = 'https://m.solus.co.uk/v4';

    const requiredOptions = ['AppID', 'PackageName', 'TemplateID', 'DeviceID'];

    // error if required options not provided
    for (var option in requiredOptions) {
      if (!(requiredOptions[option] in options)) {
        throw new Error(requiredOptions[option] + ' key not provided in options');
      }
    }

    // Set default options for Solus session
    // currently hardcoded to iPad settings
    this.sessionOptions = {
      Recursive: false,
      AppVersion: "2020.2",
      Lat: 0,
      Lng: 0,
      NetworkType: "WiFi",
      NetworkRate: 1050,
      PlatType: "iOS",
      PlatVer: "12.5.5",
      PlatModel: "iPad4,1",
      ScreenW: 768,
      ScreenH: 1024,
      ScreenAW: 1024,
      ScreenAH: 768,
      DPR: 2,
      DName: "iPad",
      Locale: "en-GB",
      AppBuild: "2020.2.100",
      AuthToken: null
    };

    for (var attrname in options) {
      this.sessionOptions[attrname] = options[attrname];
    }
    
    // Set suitable user agent to allow access
    this.axiosOptions = {
      headers: {
        'User-Agent': 'Libraries/2020.2.100 CFNetwork/978.0.7 Darwin/18.7.0'
      }
    };
  }
  
  async loanRenew(sessionId, account, loanId) {

    const axios = require('axios');

    const response = await axios.post(this.solusUrl + '/Cat.asmx/LoanRenew', {
      AppID: this.sessionOptions.AppID,
      TemplateID: this.sessionOptions.TemplateID,
      SessionID: sessionId,
      DeviceID: this.sessionOptions.DeviceID,
      Locale: this.sessionOptions.Locale,
      UserID: account.borrower_number,
      Request: {
        LoanID: loanId,
        UserID: account.borrower_number,
        Source: 'ILSWS',
        PromptAcknowledged: '' // empty string from app
      }
    }, this.axiosOptions);

    return response.data.d;

  }

  async loansGet(sessionId, account) {

    const axios = require('axios');

    const response = await axios.post(this.solusUrl + '/Cat.asmx/LoansGet', {
      AppID: this.sessionOptions.AppID,
      TemplateID: this.sessionOptions.TemplateID,
      SessionID: sessionId,
      DeviceID: this.sessionOptions.DeviceID,
      Locale: this.sessionOptions.Locale,
      UserID: account.borrower_number,
      Request: {
        UserID: account.borrower_number,
      }
    }, this.axiosOptions);

    if (response.data.d.status == 'error') {
      throw response.data.d.statusmessage;
    }
    return response.data.d.Detail;

  }

  async loginCheck(sessionId, account) {

    const axios = require('axios');

    var options = this.sessionOptions;

    // TODO: handle errors with try catch

    const response = await axios.post(this.solusUrl + '/Cat.asmx/LoginCheck', {
      AppID: this.sessionOptions.AppID,
      TemplateID: this.sessionOptions.TemplateID,
      SessionID: sessionId,
      DeviceID: this.sessionOptions.DeviceID,
      Locale: this.sessionOptions.Locale,
      UserID: '',
      Request: {}
    }, this.axiosOptions);

    // TODO: check response

    return response.data.d;

  }

  async login(sessionId, account) {

    const axios = require('axios');

    // TODO: handle errors with try catch

    const response = await axios.post(this.solusUrl + '/Cat.asmx/Login', {
      AppID: this.sessionOptions.AppID,
      TemplateID: this.sessionOptions.TemplateID,
      SessionID: sessionId,
      DeviceID: this.sessionOptions.DeviceID,
      Locale: this.sessionOptions.Locale,
      UserID: '',
      Request: {
        UserID: account.borrower_number,
        Password: account.pin,
        StoreCredentials: true,
        Name: ''
      }
    }, this.axiosOptions);

    // TODO: check response

    return response.data.d;

  }

  async createSessionAuth() {

    const axios = require('axios');

    var options = this.sessionOptions;

    // TODO: handle errors with try catch

    const response = await axios.post(this.solusUrl + '/App.asmx/CreateSessionAuth', options, this.axiosOptions);

    // TODO: check response

    return response.data.d.SessionID;

  }

}