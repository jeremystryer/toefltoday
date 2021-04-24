import Essay from "./essay.js";

export default class API {
  constructor(essayDraft, generateReportFunc) {
    this.essayDraft = essayDraft;
    this.init(this.essayDraft, generateReportFunc);
  }

  init(essayDraft, generateReportFunc) {
    this.checkGrammar(this.essayDraft, generateReportFunc);
  }

  checkGrammar(essayDraft, generateReportFunc) {
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://dnaber-languagetool.p.rapidapi.com/v2/check",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "x-rapidapi-key": "4a434644b7mshf0c157810805032p180f52jsn6f7ab924b303",
        "x-rapidapi-host": "dnaber-languagetool.p.rapidapi.com",   
      },
      "data": {
        "text": essayDraft,
        "language": "en-US"
      }
    };
    
    $.ajax(settings).done(function (response) {
      console.log(response);
      generateReportFunc(response);
    });
  }
}