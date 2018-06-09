import { Injectable } from '@angular/core';
import { Image } from 'app/types/image';
import { environment } from 'environments/environment';

@Injectable()
export class ImageService {

  private defaultImage = 'http://placehold.it/200x300?text=No+preview'

  constructor() { }

  getImageStyleUrl(image: Image): string {
    return `url(${this.getImageUrl(image)})`;
  }

  getImageUrl(image: Image): string {
    return image ? `${environment.apiUrl}/${image.path}` : `${this.defaultImage}`;
  }

}
