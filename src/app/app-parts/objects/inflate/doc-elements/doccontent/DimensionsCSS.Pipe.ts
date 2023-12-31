import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'cssdimensions' })
export class DimensionsCSSPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(data: string) {
    let result:string="width:100%; heigth:100%";
    if(data!=""){
      let dat:string[]=data.split(",");
      result=`width:${dat[0]}; heigth:${dat[1]}`;
    }

    return result;
  }
}
