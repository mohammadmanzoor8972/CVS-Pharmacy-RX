import { Injectable } from '@angular/core';
import { createClient, Entry, ContentType } from 'contentful';
import { environment } from '../../environments/environment';
import { SelectLangService } from './selectLang.service';


const CONFIG = {
  space: environment.spaceId,
  accessToken: environment.accessToken,

};


class StorageItem {

  date: Date;
  cmsContent: string;

  constructor(date: Date, cmsContent: string) {
    this.date = date;
    this.cmsContent = cmsContent;
  }
}

@Injectable()
export class CmsService {

  private client = createClient({
    space: CONFIG.space,
    accessToken: CONFIG.accessToken
  });

  constructor(private userLocale: SelectLangService) {
    this.userLocale.currentLanguage.subscribe(info => {
      this.setLocale(info);
    });
  }

  setLocale(value) {
    if (localStorage.getItem('newLocation') === null || undefined) {
      localStorage.setItem('newLocation', 'en-US');
      localStorage.setItem('btnCss', 'en');
    }else if (value === 'en') {
      localStorage.setItem('newLocation', 'en-US');
      localStorage.setItem('userSetLocale', 'true');
      localStorage.setItem('btnCss', 'en');
      location.reload();
    }else if (value === 'es') {
      localStorage.setItem('newLocation', 'es');
      localStorage.setItem('userSetLocale', 'true');
      localStorage.setItem('btnCss', 'es');
      location.reload();
    }
  }

  /**
   * Get cms data for content type
   * If data is in cache api will not be called
   * @param contentType
   * @param callback
   */
  getContent(contentType: string, callback: any) {
    console.log('Caching turned on: --->', environment.cacheCms);
    const cmsdata = this.checkCacheContentAndExpiration(contentType);
    const currentLocale = localStorage.getItem('newLocation');

    if (cmsdata && environment.cacheCms) {
      console.log('Getting data from cache for content type:  ', currentLocale + '-' + contentType);
      callback(cmsdata);
    } else {
      console.log('Getting data from contentful for content type:  ', currentLocale + '-' + contentType);
      this.client.getEntries({
        locale: currentLocale,
        'sys.contentType.sys.id': contentType, include: 10
      })
        .then((response) => {
          localStorage.setItem(currentLocale + '-' + contentType,
          JSON.stringify(new StorageItem(new Date(), JSON.stringify(response.items[0]))));
          callback(response.items[0]);
          // console.log('THIS IS THE CMS SERVICE');
        });
    }
  }

  /*
   * below method is to validate the content in cache
   * is stored for less than one hour
   * to have most up to date content
   */
  checkCacheContentAndExpiration(contentType: string) {

    let cmsdata;
    let storageItem;
    const currentLocale = localStorage.getItem('newLocation');

    try {
      storageItem = JSON.parse(localStorage.getItem(currentLocale + '-' + contentType));
      // console.log('THIS IS THE STORAGEITEM---------------->>>>', storageItem, );
    } catch (e) {
      localStorage.clear();
      console.log('SOMETHING WENT WRONG', e);
      return '';
    }

    // console.log('cmsData Object: ', cmsdata);

    if (storageItem) {

      try {
        if (!storageItem.date) {
          localStorage.removeItem(currentLocale + '-' + contentType);
          return '';
        }
      } catch (e) {
        console.log('error retreiving cached date', e);
        localStorage.removeItem(currentLocale + '-' + contentType);
        return '';
      }
      // console.log(storageItem.cmsContent);
      try {
        if (JSON.parse(storageItem.cmsContent)) {
          cmsdata = JSON.parse(storageItem.cmsContent);
        }
      } catch (e) {
        console.log('STORAGE ITEM PARSE DID NOT WORK.... HERE IS WHY: --- ', e);
        return '';
      }
      const endDate = new Date();
      const secondsCached = (endDate.getTime() - new Date(storageItem.date).getTime()) / 1000;

      console.log('content type', currentLocale + '-' + contentType);
      // console.log('stored date', new Date(storageItem.date));
      // console.log('current date', endDate);
      console.log('Amount of Seconds Cached: ', secondsCached);

      if (secondsCached > environment.cacheExpiration) {
        console.log('cacheExpiration ' + environment.cacheExpiration + ' seconds Exceeded, clearing cmsdata');
        localStorage.removeItem(currentLocale + '-' + contentType);
        cmsdata = '';
      }

    }

    return cmsdata;

  }


}
