export abstract class CmsHelpers {

  constructor() {
  }

  getImage(image: any): string {
    // console.log("IMAGE**", image);
    if(image) {
      return image.fields.file.url;
    }
    return null;
  }
}
