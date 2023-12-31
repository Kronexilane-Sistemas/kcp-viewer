import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { kcp_item } from 'src/app/app-parts/categories/categories.model';

@Component({
  selector: 'app-docfooter',
  templateUrl: './docfooter.component.html',
  styleUrls: ['./docfooter.component.scss']
})
export class DocfooterComponent implements OnInit {

  public parameters!: Map<string, any>;
  @Input("kcp-item") docitem: kcp_item | undefined;
  @Input("parameters") data!: any;
  @Output("jumpheader") jumpdata: EventEmitter<string> = new EventEmitter<string>();

  constructor() {

  }

  ngOnInit(): void {
    this.parameters = this.data;
  }
  /**
   * Salta al exterior con un dato del header
   * separado con el carácter |
   * Campo 0 (izquierda) especificador (date/tag ...)
   * Campo 1 (derecho), dato en sí
   * @param data
   */
  public JumpTo(data: string): void {
    this.jumpdata.emit(data);
  }

}
