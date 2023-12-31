import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { JQueryConfirm } from 'src/JQueryConfirm';
import { SearchCached } from 'src/app/app-parts/search/SearchCached';
import { SearchEngineService, SearchMessages, SearchTYPES } from 'src/app/app-parts/search/search-engine.service';

import { CNWithOutParams, RUTAS } from 'src/app/app-routing.module';
import { getRandomIDForDOM } from 'src/app/services/global.js.functions';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'plugin-search',
  templateUrl: './plugin-search.component.html',
  styleUrls: ['./plugin-search.component.scss'],
  host: {
    '(window:scroll)': 'onScroll($event)',
    '(window:mouseleave)': 'onMouseLeave($event)',
    '(window:resize)': 'OnResize($event)'
  }
})
export class PluginSearchComponent implements OnInit {


  // True=Cuadro de búsqueda avanzada
  @Input() asearch: boolean = true;
  @Input() adjust: boolean = false;
  @Input() responsive: boolean = false;
  @Input() special: boolean = false;
  @Output() PushButton:EventEmitter<boolean>=new EventEmitter<boolean>();

  public puntos: any;
  public discriminator1!: string;
  public discriminator2!: string
  public jqueryID1!: string;
  public jqueryID2!: string;

  public asearchActive: boolean = false;
  public additional_functions: boolean = false;
  public userE: string = "";
  public keySearch:string="";
  private adjustN: number = 0;
  private adjustM: number = 0;


  // Formularios de datos
  public formSearch1!: FormGroup;
  public formSearch2!: FormGroup;




  // Datos adicionales
  public tags!: string[];
  public cache:boolean=false;

  public onScroll(event: any) {
    if (window.scrollY == 0 && this.asearchActive) $(this.jqueryID1).show("fast");
    if (window.scrollY > 0) $(this.jqueryID1).hide();
  }

  public OnResize(e: any) {

  }

  constructor(
    private r: Router,
    private e: SearchEngineService,
    private formbuilder: FormBuilder
  ) {

    this.puntos = $('#cabeceraX').height();
    this.discriminator1 = "aSearch" + getRandomIDForDOM(10);
    this.discriminator2 = "aSearchButton" + getRandomIDForDOM(10);
    this.jqueryID1 = "#".concat(this.discriminator1);
    this.jqueryID2 = "#".concat(this.discriminator2);
    this.CreateForm();

    this.cache=SearchCached.CacheStatus;
  }

  async ngOnInit(): Promise<void> {
    this.e.getMessage().subscribe(
      (msg:SearchMessages)=>{
          if(this.asearchActive && msg==SearchMessages.close_advanced_search){
            this.AbrirBusquedaAvanzada();
          }
      });



  }

  // Función que crea los formularios de búsquedas
  private CreateForm() {
    // Formulario básico
    this.formSearch1 = this.formbuilder.group(
      {
        textFilter: new FormControl("", [
          Validators.required,
        ]),
        sw1: new FormControl(true),
        sw2: new FormControl(true),
        title: new FormControl("Resultados de la búsqueda"),
        type: new FormControl(1),
      }
    );
    // Formulario avanzado
    this.formSearch2 = this.formbuilder.group(
      {
        text: new FormControl(""),
        tags: new FormControl(""),
        items: new FormControl(""),
        initD: new FormControl(""),
        finalD: new FormControl(""),
        title: new FormControl("Resultados de la búsqueda"),
        type: new FormControl(1),
        sw1:new FormControl(true),
        sw2:new FormControl(true)
      }
    );

  }


  /** ----------------- ENVIO DE LAS BÚSQUEDAS ---------------- -*/

  /** Ejecutar Búsqueda básica */
  public BusquedaBasica(dataForm: any): void {
    this.PushButton.emit(true);
    this.keySearch = this.e.MakeKeySearch(SearchTYPES.simple, this.formSearch1);
    this.r.navigate([CNWithOutParams(RUTAS.SEARCH), this.keySearch]);

  }
  /** Ejecutar Búsqueda avanzada */
  public BusquedaAvanzada(dataForm: any): void {
    this.keySearch = this.e.MakeKeySearch(SearchTYPES.advanced, this.formSearch2);
    this.r.navigate([CNWithOutParams(RUTAS.SEARCH), this.keySearch]);
  }
  /** Ir a la caché de búsqueda **/
  public CacheBusqueda():void{
    this.r.navigate([CNWithOutParams(RUTAS.SEARCH), "cache"]);
  }

  /** ----------------- BOTONES DE BÚSQUEDA AVANZADA ---------------- -*/

  /** Abrir desplegable de búsqueda avanzada */
  public async AbrirBusquedaAvanzada(): Promise<void> {
    // Resetear formulario a valores por defecto

    if (this.formSearch1.controls['textFilter'].value != '') {
      this.formSearch2.controls['text'].setValue(this.formSearch1.controls['textFilter'].value);
    }

    // Ajustes de posición
    this.puntos = $('#cabeceraX').height();

    if(this.adjust) this.adjustN=4; else this.adjustN=1;
    $(this.jqueryID1).css("top", this.puntos+this.adjustN+"pt");
    if (this.adjust) this.adjustM = 300; else this.adjustM = 290;
    $(this.jqueryID1).css("height",this.adjustM+"px");

    /// Búsqueda avanzada (activación/desactivación)
    if (!this.asearchActive) {
      $(this.jqueryID2).css("opacity", "20%");
    } else {
      $(this.jqueryID2).css("opacity", "100%");
    }
    window.scroll(0, 0);

    $(this.jqueryID1).toggle("slow");

    this.asearchActive = !this.asearchActive
    if (this.asearchActive) {
      // Lectura de tags discriminados
      if (this.asearch) {
        let pfname: any = sessionStorage.getItem("portfolioname")
        if (pfname != undefined) {
          await this.e.getTags(pfname).then(data => {
            this.tags = data;
          })

        }
      }

    }
  }

  /** ----------------- OTRAS FUNCIONES ---------------- -*/

  // -- Aperturas de selección de TAGS y Tipos de elemento

  // Ventana de tags
  public MostrarTags(): void {
    let dialogs: JQueryConfirm = new JQueryConfirm();
    dialogs.SelectList(this.tags, "Tags de búsqueda").then(data => {
      if (data != "") {
        this.formSearch2.controls['tags'].setValue(data);
      }
    });
  }
  // Ventana de tipos de ITEM
  public MostrarTipos(): void {
    let dialogs: JQueryConfirm = new JQueryConfirm();
    let tipos: string[] = ['Web', 'Presentación', 'Trabajo', 'Enlace', 'Descarga', 'Contenedor', 'Grupo', 'Colección'];
    dialogs.SelectList(tipos, "tipos de items").then(data => {
      if (data != "") {
        this.formSearch2.controls['items'].setValue(data);
      }
    });
  }

  // Resetear form poniendo valores por defecto
  public Reset(): void {
    this.keySearch="";
    // Resetear FORM, poner valores por defecto.
    this.CreateForm();
  }
  // Copiar clave de búsqueda al portapapeles
  public CopiarClaveDeBusqueda(): void {
    navigator.clipboard.writeText(this.keySearch);
  }
  // Obtener título y subtitulo
  public getTitle(): string[] {
    let data!: string[];
    let title: any = sessionStorage.getItem("titleComposed");
    if (title != undefined) {
      data = (title as string).split("/");
    }
    return data;
  }


}
