import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse, HttpParams } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../../environments/environment';


@Injectable()
export class CvsService {

    userData = new Map();
    constructor(private _http: HttpClient) {
    }

    private GATEWAY_PATH = environment.gatewayURL;

    private USER_ENROLL_PATH = 'api/user/enroll';
    private USER_FORGOT_USERNAME_PATH = 'api/user/forgotUsername';
    private USER_FORGOT_PASSWORD_PATH = 'api/user/forgotPassword';
    private USER_INFORMATION_PATH = 'api/user/information';
    private USER_LOGIN_PATH = 'authentication/login';
    private USER_LOGOUT_PATH = 'user/logout';
    private USER_PROFILE_PATH = 'api/user/profile';
    private USER_REFRESH_TOKEN_PATH = 'api/user/refreshToken';
    private USER_RESET_PASSWORD_PATH = 'api/user/resetPassword';
    private USER_CHANGE_PASSWORD_PATH = 'api/user/changePassword';
    private USER_REPORT_CARD = 'api/user/reportCard';
    private USER_MESSAGE_PREFERENCES_PATH = 'api/user/updateMessagingPreference';
    private CARD_BALANCE_INQUIRY = 'api/card/balanceInquiry';
    private CARD_TRANSACTION_HISTORY_PATH = 'api/card/transactionHistory';
    private CARD_TRANSACTION_NOTIFY_PATH = 'api/card/transactionNotify';
    private CARD_ADD_FUNDS = 'api/card/reload';
    private SUPPORT = 'api/user/getSupport';
    private USER_OPTOUT_RELOAD_PATH = '/api/user/optOutReload';
  //  private CARD_AUTORELOAD_INFO_PATH = 'api/card/getAutoReloadInfo';

 

    /**
     * Login with Username & Password
     * @param loginRequest
     * @returns {Observable<R|T>}
     */

    setUserInfo(data, arr) {
        this.userData.set('cardNumber', arr.cardNumber);
        this.userData.set('dateOfBirth', arr.dateOfBirth);
        this.userData.set('data', data);
    }

    getUserInfo() {
        return this.userData;
    }

    checkUserSession() {
        return sessionStorage.getItem('Session') !== null;
    }

   /**
   * Login with Username and Password
   * @param enrollRequest
   * @returns {Observable<R|T>}
   */

    login(loginRequest): Observable<HttpResponse<any>> {
        const merchantSessionId = '';
        return this._http.post(this.GATEWAY_PATH + this.USER_LOGIN_PATH, JSON.stringify(loginRequest),
            {  
                observe: 'response',

            });

    }

    /**
   * Enroll with Card & Date of birth
   * @param enrollRequest
   * @returns {Observable<R|T>}
   */

    enroll(enrollRequest): Observable<HttpResponse<any>> {
        console.log(enrollRequest, 'enrollRequest===');
        const enrollRequestObj = JSON.stringify(enrollRequest);       
        return this._http.post(this.GATEWAY_PATH + this.USER_ENROLL_PATH, JSON.stringify(enrollRequest),
        {
            observe: 'response'

        });
        
    }

    /**
    * Change Password
    * @param resetPasswordRequest
    * @returns {Observable<R|T>}
    */

    resetPassword(resetPasswordRequest): Observable<HttpResponse<any>> {
        console.log('URL : ', this.GATEWAY_PATH + this.USER_RESET_PASSWORD_PATH, resetPasswordRequest);
        return this._http.put(this.GATEWAY_PATH + this.USER_RESET_PASSWORD_PATH, JSON.stringify(resetPasswordRequest),
            {
                observe: 'response',

            });
    }


    changePassword(changePasswordRequest): Observable<HttpResponse<any>> {
        console.log('URL : ', this.GATEWAY_PATH + this.USER_CHANGE_PASSWORD_PATH, changePasswordRequest);
        return this._http.post(this.GATEWAY_PATH + this.USER_CHANGE_PASSWORD_PATH, JSON.stringify(changePasswordRequest),
            {
                observe: 'response',

            });
    }
    /**
    * Update Profile
    * @param profileRequest
    * @returns {Observable<R|T>}
    */

    updateProfile(profileRequest): Observable<HttpResponse<any>> {
        const merchantSessionId = '';

        let headers = new HttpHeaders();
        return this._http.post(this.GATEWAY_PATH + this.USER_PROFILE_PATH, JSON.stringify(profileRequest),
            {
                observe: 'response',

            });

    }

   /**
   * Get Profile
   * 
   * @returns {Observable<R|T>}
   */
    getUserProfile(): Observable<HttpResponse<any>> {
        return this._http.get(this.GATEWAY_PATH +  this.USER_PROFILE_PATH, { 
            observe: 'response'
        }
        );
    }
    
     /**
   * Forgot Username Request
   * @param emailReq
   * @returns {Observable<R|T>}
   */
    forgotUserName(emailReq): Observable<HttpResponse<any>> {
        return this._http.put(this.GATEWAY_PATH + this.USER_FORGOT_USERNAME_PATH, JSON.stringify(emailReq), { 
            observe: 'response'
        }
        );
    }

    /**
   * Forgot Password Request
   * @param emailReq
   * @returns {Observable<R|T>}
   */
    forgotPassword(emailReq): Observable<HttpResponse<any>> {
        return this._http.post(this.GATEWAY_PATH + this.USER_FORGOT_PASSWORD_PATH, JSON.stringify(emailReq),{
            
            observe: 'response'
        }
        );
    }

    /**
   * Get the Transaction History for the Card
   * @param cardRequest
   * @returns {Observable<R|T>}
   */
    getCardTransactionHistory(cardRequest): Observable<HttpResponse<any>> {
        return this._http.get(this.GATEWAY_PATH + this.CARD_TRANSACTION_HISTORY_PATH, {
            observe: 'response'
        });
       

    }

    
   /**
   * Get the User Information by card Number and DOB
   * @param userInfoConfigRequest
   * @returns {Observable<R|T>}
   */
    getUserInformation(userInfoConfigRequest): Observable<HttpResponse<any>> {
        return this._http.get(this.GATEWAY_PATH + this.USER_INFORMATION_PATH, {
            params: {
                cardNumber: userInfoConfigRequest.cardNumber,
                dateOfBirth: userInfoConfigRequest.dateOfBirth
            },
            observe: 'response'
        });
     
    }

    
   /**
   * Get Refresh token 
   * @returns {Observable<R|T>}
   */
    getRefreshToken(): Observable<HttpResponse<any>> {
        return this._http.get<any>(this.GATEWAY_PATH + this.USER_REFRESH_TOKEN_PATH, {
            observe: 'response'
        }
        );
    }


   /**
   * Get the Balance Inquiry on the card
   * @param cardConfigRequest
   * @returns {Observable<R|T>}
   */

    cardBalanceInquiry(cardConfigRequest?): Observable<HttpResponse<any>> {
        if (this.checkUserSession()) {
            return this._http.get(this.GATEWAY_PATH + this.CARD_BALANCE_INQUIRY, {
                observe: 'response',
            });
        }else {
            return this._http.post(this.GATEWAY_PATH + this.CARD_BALANCE_INQUIRY, JSON.stringify(cardConfigRequest),
            {
                observe: 'response',

            });
        }
    
    }

    addFunds(addFunds): Observable<HttpResponse<any>> {
        return this._http.post(this.GATEWAY_PATH + this.CARD_ADD_FUNDS, JSON.stringify(addFunds),
          {
            observe: 'response',
          });
      }

    optOutReload(confirmReq): Observable<HttpResponse<any>> {
       return this._http.put(this.GATEWAY_PATH + this.USER_OPTOUT_RELOAD_PATH,JSON.stringify(confirmReq),
           {
            observe: 'response',
           });
       }

    support(supportRequest): Observable<HttpResponse<any>> {
        return this._http.post(this.GATEWAY_PATH + this.SUPPORT, JSON.stringify(supportRequest),
          {
            observe: 'response',
          });
      }

   /**
   * Report Lost / Damaged Card Call Service
   * @param cardConfigRequest
   * @returns {Observable<R|T>}
   */
    reportLostDamagedCard(cardConfigRequest?): Observable<HttpResponse<any>> {
                return this._http.post(this.GATEWAY_PATH + this.USER_REPORT_CARD, JSON.stringify(cardConfigRequest),
            {
                observe: 'response',

            });

    }

    /**
   * Update Messaging Preferences Call Service
   * @param msgPreferenceConfig
   * @returns {Observable<R|T>}
   */
    updateMessagePreferences(msgPreferenceConfig): Observable<HttpResponse<any>> {
                return this._http.post(this.GATEWAY_PATH + this.USER_MESSAGE_PREFERENCES_PATH,
            JSON.stringify(msgPreferenceConfig),
            {
                observe: 'response',

            });

    }

}















