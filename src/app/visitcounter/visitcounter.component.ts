import { PortfolioHeaderService } from './../services/portfolio/portfolio-header.service';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-visitcounter',
  templateUrl: './visitcounter.component.html',
  styleUrls: ['./visitcounter.component.scss']
})
export class VisitcounterComponent implements OnInit {

  public CounterMsgs!:string[];

  @Input() enabled:boolean=true;

  constructor(private data:PortfolioHeaderService) { }

  ngOnInit(): void {
    this.data.getVisitorCounter().then(a=>{ this.CounterMsgs=a});
  }

}
