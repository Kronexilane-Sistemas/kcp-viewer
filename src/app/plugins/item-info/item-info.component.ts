import { ActivatedRoute, Router } from '@angular/router';
import { ContainerStatistics, eItems, kcp_item } from '../../app-parts/categories/categories.model';
import { Component, Input, OnInit } from '@angular/core';
import * as shajs from 'sha.js';
import { types } from 'util';
import { CategoriesComponent } from 'src/app/app-parts/categories/categories.component';
import { CNWithOutParams, RUTAS } from 'src/app/app-routing.module';
import { PortfolioHeaderService } from 'src/app/services/portfolio/portfolio-header.service';
import { KCP_Path_To_Objects_Format } from 'src/app/app-parts/objects/objects.component';

declare var $: any;

@Component({
  selector: 'app-item-info',
  templateUrl: './item-info.component.html',
  styleUrls: ['./item-info.component.scss']
})
export class ItemPasswordComponent implements OnInit {

  @Input() item!: kcp_item;
  @Input() execute!: Function;
  @Input() img!: string;
  @Input() small: boolean = false;
  @Input() statisc!: ContainerStatistics;
  @Input() buttontext: string = "Ir al elemento";
  @Input() idResponsive: string = "";

  public msgE: string = "Elemento protegido por contraseña";
  public msgE2: string = "Elemento protegido por contraseña";
  public wrongPassword: boolean = false;
  public wrongPassword2: boolean = false;
  public okPassword: boolean = false;
  public okPassword2: boolean = false;
  public keyPassword: boolean = false;
  public keyPassword2: boolean = false;

  constructor(private r: Router,private pf:PortfolioHeaderService) {

  }

  ngOnInit(): void { }



  // -------- Procedimientos para PANTALLAS NORMALES (GRANDES) -------------------
  // Lanzamiento de un enlace
  public GoTo(item: kcp_item): void {

    if (item.itemtype >= 3) {
      if (item.password != '') {
        let password: string = shajs('sha1').update($("#clavePN").val()).digest('hex');
        if (item.password !== password) {
          this.msgE = "Clave incorrecta";
          this.wrongPassword = true;
          return;
        }
      }


      if (item.href != '' && item.href != null) {
        this.GoToHREF(item);
      }


      if (item.router != '' && item.router != null) {
        this.GoToROUTE(item)
      }

    } else {
      this.ShowDocument(item);
    }

  }

  // ---------- Lanzamiento de un HREF ----------------
  public GoToHREF(item: kcp_item) {
    switch (item.itemtype) {
      case eItems.dLINK:
        var newlink = window.open(item.href, "_blank", "popup=yes,maximize=yes");
        newlink?.open();
        break;
      case eItems.dDOWNLOAD:
        var element = document.createElement('a');
        element.href = item.href;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);

    }
  }

  // ----------- Lanzamiento de un ROUTER -------------
  public GoToROUTE(item: kcp_item) {
    this.r.navigateByUrl(item.router);
  }

  // ---------- Lanzamiento de un documento ------------------
  public async ShowDocument(item: kcp_item) {
    // Obtiene el PATH de un documento y se lo pasa el componente OBJECTS
    let docPath:string="";
    await this.pf.GetItemPath(item.iitem).then(data=>{
      docPath=data[0]
    });

    this.r.navigate([CNWithOutParams(RUTAS.OBJECTS),KCP_Path_To_Objects_Format(docPath)]);
  }

  // ------------ Gestión de claves ----------------------
  public ActivateLink(keyevent: any, item: kcp_item): void {
    let ok: boolean = shajs('sha1').update($("#clavePN").val()).digest('hex') == item.password;
    if (ok) {
      this.msgE = "Contraseña correcta.";
      $("#msgError").removeClass("password-error text-dark");
      $("#msgError").addClass("password-ok");
      this.keyPassword = true;
    } else {
      this.keyPassword = false;

      if ($("#clavePN").val() != '') {
        this.msgE = "Contraseña incorrecta"
        $("#msgError").removeClass("password-ok text-dark");
        $("#msgError").addClass("password-error");
      } else {
        this.msgE = "Elemento protegido por contraseña";
        $("#msgError").removeClass("password-error password-ok");
        $("#msgError").addClass("text-dark");
      }
    }


  }

  // -------- Procedimientos para PANTALLAS PEQUEÑAS -------------------

  // Lanzamiento de un enlace
  public GoTo2(item: kcp_item): void {
    if (item.itemtype >= 3) {
      if (item.password != '') {
        let password: string = shajs('sha1').update($("#clavePP").val()).digest('hex');
        if (item.password !== password) {
          this.msgE2 = "Clave incorrecta";
          this.wrongPassword2 = true;
          return;
        }
      }

      $("#" + this.idResponsive).modal("hide");
      if (item.href != '' && item.href != null) {
        this.GoToHREF(item);
      }

      if (item.router != '' || item.router != null) {
        this.GoToROUTE(item)
      }
    } else {
      $("#" + this.idResponsive).modal("hide");
      this.ShowDocument(item);
    }
  }

  // ------------ Gestión de claves ----------------------
  public ActivateLink2(keyevent: any, item: kcp_item): void {
    let ok: boolean = shajs('sha1').update($("#clavePP").val()).digest('hex') == item.password;
    if (ok) {
      this.msgE2 = "Contraseña correcta.";
      $("#msgError2").removeClass("password-error text-dark");
      $("#msgError2").addClass("password-ok");
      this.keyPassword2 = true;
    } else {
      this.keyPassword2 = false;

      if ($("#clavePP").val() != '') {
        this.msgE2 = "Contraseña incorrecta"
        $("#msgError2").removeClass("password-ok text-dark");
        $("#msgError2").addClass("password-error");
      } else {
        this.msgE2 = "Elemento protegido por contraseña";
        $("#msgError2").removeClass("password-error password-ok");
        $("#msgError2").addClass("text-dark");
      }
    }


  }

}
