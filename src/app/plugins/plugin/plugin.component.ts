import { Component, Input, OnInit } from '@angular/core';
import { PluginParameters } from './plugin.parameters';
import { kcp_item_result_founded } from 'src/app/app-parts/search/search.model';
import { eItems, kcp_item } from 'src/app/app-parts/categories/categories.model';
import { PortfolioHeaderService } from 'src/app/services/portfolio/portfolio-header.service';
import { SearchEngineService } from 'src/app/app-parts/search/search-engine.service';
import { CNWithOutParams, RUTAS } from 'src/app/app-routing.module';
import { Router } from '@angular/router';
import { ObjectUtils } from 'turbocommons-ts';

@Component({
  selector: 'plugin',
  templateUrl: './plugin.component.html',
  styleUrls: ['./plugin.component.scss']
})
export class PluginComponent implements OnInit{

  public icons: string[] = ['assets/defaultF.png', 'assets/workF.png', 'assets/presentationF.png', 'assets/downF.png']
  public Icon: string = ""

  @Input() config!: PluginParameters;

  public Data!:kcp_item_result_founded[];

  public Directory!:kcp_item;



  public Datos: String[] =
    [
      "Acerca del autor",
      "Vea mi Curriculum Vitae",
      "Mis trabajos más importantes",
      "Galeria de fotos",
      "Otras cosas",
    ];
  public Datos2: String[] =
    [
      "Acerca del autor",
      "Vea mi Curriculum Vitae",
      "Mis trabajos más importantes"
    ];

  constructor(private kcpdir:PortfolioHeaderService,private kcpsearch:SearchEngineService,private router:Router){}

  public ngOnInit(): void {

    // 1º Selección del icono y del modo de ejecución de lo datos
    switch (this.config.command) {
      case "work":
        this.Icon = this.icons[1];
        this.SearchList(eItems.dWORK);
        break;
      case "presentation":
        this.SearchList(eItems.dPRESENTATION);
        this.Icon = this.icons[2];
        break;
      case "download":
        this.SearchList(eItems.dDOWNLOAD);
        this.Icon = this.icons[3];
        break;
      case "kcpdir":
        this.DirectoryList();
        this.Icon = this.icons[0];
        break;
      default:
        this.Icon = this.icons[0];
    }
  }


  /**
   * Utiliza la función API GetMenu para obtener el contenido de
   * un contenedor y poderlo colocar en PLUGIN de footer
   */
  private async DirectoryList():Promise<void>{
    if(this.config.path!=undefined){
      await this.kcpdir.getMenu(this.config.path).then(data => { this.Directory=data});
    }
    this.SortDirectoryBy("index");
  }

  // -- Ordena el directorio por una clave --
  private SortDirectoryBy(key:string){
    if(!this.Directory || !this.Directory.subitems || this.Directory.subitems.length==0) return;
    this.Directory.subitems.sort((a, b) => {
      let result: number = 0;
      let sw:boolean=false;

      // Condición de campo en función de key
      if (key == "title") sw=a.title.toUpperCase() > b.title.toUpperCase();
      if(key=='name') sw=a.name.toUpperCase()>b.name.toUpperCase();
      if (key == 'index') sw = a.itemorder > b.itemorder;

      // Devuelve 1 si a>b , -1 si a<b y cero si a=b;
      if (sw) result = 1; else result = -1;
      return result;
    })
  }

  /**
   * Realiza la búsqueda de los últimos 5 elementos públicados del type (eITEMS)
   * @param type
   */
  private async SearchList(type:eItems):Promise<void>{
    // Buscar los últimos 5 elementos públicados del tipo especificado
    let searchData:any=
    {
      "Types":`${type}`,
      "LastPublications":true
    }

     await this.kcpsearch.SearchItems(searchData).then((data:kcp_item_result_founded[])=>{
      if(data.length!=0) this.Data=data;

    });
    this.SortDataBy("name");
  }

  // -- Ordena la lista de búsqueda por una clave --
  private SortDataBy(key: string) {
    if (!this.Directory || !this.Directory.subitems || this.Directory.subitems.length == 0) return;
    this.Data.sort((a, b) => {


      let result: number = 0;
      let sw: boolean = false;

      // Condición de campo en función de key
      if (key == "title") sw = a.title.toUpperCase() > b.title.toUpperCase();
      if (key == 'name') sw = a.name.toUpperCase() > b.name.toUpperCase();

      // Devuelve 1 si a>b , -1 si a<b y cero si a=b;
      if (sw) result = 1; else result = -1;
      return result;
    })
  }

  // --- Manejo del item seleccionado para saltar hacia él ---
  async Selected(item: any) {

    let pathItem: string = "";
    let pathTransform: string = "";
    let itemid!:number;

    // --- PASO 0, obtenemos el id del objeto (id=kcp_item_result_found iitem=kcp_item)
    // --- mediante reflexión de typescript

    // Recoge el nombre del campo id
    let id: string = ObjectUtils.getKeys(item)[0];

    // Obtiene el valor de dicho campo
    itemid = Object.getOwnPropertyDescriptor(item, id)?.value;



    // -- Paso 1: Pedimos la ruta del elemento mediante el API correspondiente
    await this.kcpdir.GetItemPath(itemid).then(data => { pathItem = data[0]; });


    // -- Paso 2: Separación de la ruta y ejecución del salto --
    switch (item.itemtype) {
      // 0,1,2 (Documento) Transformación a ruta por puntos
      case 0:
      case 1:
      case 2:
        pathTransform = pathItem.replace("://", ".").split("/").join(".");
        this.router.navigate([CNWithOutParams(RUTAS.OBJECTS), pathTransform]);
        break;
      // Resto de objetos: Obtener la ruta de su contenedor padre y saltar
      // al navegador con dicha ruta
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
        let pfname: any = sessionStorage.getItem("portfolioname");
        if (pfname != undefined) pfname = pfname.concat(":/");
        pathTransform = pathItem.replace(pfname, "").split("/").join(".");
        this.router.navigate([CNWithOutParams(RUTAS.NAVIGATOR), pathTransform]);
        break;
    }

  }

}

