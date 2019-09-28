import { BaseModalModel } from '../modal/base-modal-model';

export class ImageModalModel extends BaseModalModel {
  isClosable: boolean;
  imageSource: string;

  constructor(visible: boolean, closeable: boolean, imgSource: string) {
    super(visible);
    this.isClosable = closeable;
    this.imageSource = imgSource;
  }
}
