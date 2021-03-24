import Essay from "./essay.js";

export default class API {
  constructor(essayDraft) {
    this.essayDraft = essayDraft;
    this.init(this.essayDraft);
  }

  init(essayDraft) {
    const settings = {
      "async": true,
      "crossDomain": true,
      "url": "https://grammarbot.p.rapidapi.com/check",
      "method": "POST",
      "headers": {
        "content-type": "application/x-www-form-urlencoded",
        "x-rapidapi-key": "4a434644b7mshf0c157810805032p180f52jsn6f7ab924b303",
        "x-rapidapi-host": "grammarbot.p.rapidapi.com"
      },
      "data": {
        "text": essayDraft,
        "language": "en-US"
      }
    };
    
    $.ajax(settings).done(function (response) {
      response.matches.forEach(message => {
        console.log(message);
      });
    });
  }
}