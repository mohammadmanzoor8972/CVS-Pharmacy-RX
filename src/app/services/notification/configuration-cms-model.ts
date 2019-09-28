class NotificationMessage {
  code: string;
  message: string;

  constructor(json: any) {

    this.code = json.code;
    this.message = json.message;
  }
}

export class ConfigurationCmsModel {
  entryTitle: string;
  entryName: string;
  errorMessages: NotificationMessage[];
  successMessages: NotificationMessage[];
  neutralMessages: NotificationMessage[];
  googleAnalyticsCode: string;
  fisBinList: string[];
  metaData: any;

  constructor(json: any) {
    // super();
    this.entryName = json.entryName;
    //this.errorMessages = json.errorMessages;
    console.log("CONFIGURATION CMS MODEL JSON ", json);
    this.googleAnalyticsCode = json.googleAnalyticsCode;
    this.fisBinList = json.fisBinList;
    this.metaData = json.metaData;

    this.errorMessages =  json.errorMessages ? json.errorMessages.map((ErrorItem) => {
      return new NotificationMessage(ErrorItem.fields);
    }) : [] ;

    this.successMessages = json.successMessages ? json.successMessages.map((SuccessItem) => {
      return new NotificationMessage(SuccessItem.fields);
    }) : [];

    this.neutralMessages = json.neutralMessages ? json.neutralMessages.map((NeutralItem) => {
      return new NotificationMessage(NeutralItem.fields);
    }) : [];

  }
}
