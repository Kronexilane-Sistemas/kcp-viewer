import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'youtubeparams' })
export class YoutubeParamsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(data: string) {
    let str:string[]=data.split(",");
    let result:string=str.join("&");
    return "?"+result;
  }
}
