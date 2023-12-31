import { MessengerService, msgType } from './../../services/messenger.service';
import { APPLoginService } from './../../services/login/app.login.service';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ThisReceiver } from '@angular/compiler';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  @Input() SimpleLogout!:boolean;

  constructor(
    private msg:MessengerService
  ){}

  ngOnInit(): void {

  }



  // Salida
  public Logout():void{
    sessionStorage.clear();
    this.msg.Emit(true,msgType.LOGOUT);
  }
}
