import { AfterViewInit, Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchEngineService, SearchMessages } from './search-engine.service';
import { kcp_item_result_founded } from './search.model';
import { CNWithOutParams, RUTAS } from 'src/app/app-routing.module';
import { PortfolioHeaderService } from 'src/app/services/portfolio/portfolio-header.service';
import { KrnPaginatorComponent } from 'src/app/plugins/krn-paginator/krn-paginator.component';
import { ConversionUtils } from 'turbocommons-ts';
import { SearchCached } from './SearchCached';

// Declaramos las variables para jQuery
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, AfterViewInit{

  public searchParams!: string;
  public msgInfo: string = "La búsqueda no ha encontrado resultados coincidentes.";
  public msgInfo2: string = "Pruebe con otros criterios de búsqueda más adecuados a lo que quiere encontrar."

  public prettyResults: boolean = false;
  public parameters: any;

  public results!: kcp_item_result_founded[];
  public fragment!: kcp_item_result_founded[];

  public searchCached: SearchCached = new SearchCached();
  public showCached: boolean = false;
  public validCache: boolean = false;

  public clickPage!: number;

  @ViewChild('paginatorSearch') paginador?: KrnPaginatorComponent;

  constructor(
    private router: Router,
    private aRoute: ActivatedRoute,
    private engine: SearchEngineService,
    private portfolio: PortfolioHeaderService
  ) {
    // Reactualización de RUTAS angular
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;

  }

  ngAfterViewInit(): void {
    $('#searchShow').hide();
  }

  /*** ------ Lectura de los datos de búsqueda para pasarselos a los "PAINTER"----- */
  async ngOnInit() {
    window.scroll(0, 0);
    if (this.engine.getCached()) {
      let data: SearchCached = new SearchCached();
      this.validCache = data.isValid;
      if (!this.validCache) {
        this.msgInfo = "La caché de búsqueda está vacia";
        this.msgInfo2 = "Realice en primer lugar una búsqueda con los críterios que desee.";
      }
    }
    // Lectura del objeto codificado que contiene los parámetros de búsqueda
    this.aRoute.params.subscribe(data => { this.searchParams = data.data; });
    try {
      if (this.searchParams == "cache") {
        this.parameters = this.engine.URLDecodeParams(this.searchCached.KeySearch);
        //this.prettyResults = (this.parameters.Type >2);
        this.showCached = true;
      } else {
        this.parameters = this.engine.URLDecodeParams(this.searchParams);
        //this.prettyResults = (this.parameters.Type == 2);
      }
    } catch (error) {
      if (!this.validCache) {

      } else {
        this.router.navigateByUrl(CNWithOutParams(RUTAS.SEARCH));
      }

    }

    // Lectura de los datos
    await this.engine.SearchItems(this.parameters).then(data => {
      if (!this.showCached) {
        this.results = data;
        if (this.results.length == 0) {
          window.scrollBy(0,0);
          this.msgInfo = "La búsqueda no ha producido resultados coincidentes."
          this.msgInfo2 = "Pruebe con otros criterios de búsqueda más adecuados a lo que quiere encontrar.";
        }
      } else {
        this.results = this.searchCached.Data;

      }
      $('#progress').hide();
      $('#searchShow').show();

      // Si estamos en modo cacheado, grabar la búsqueda actual
      if (this.engine.getCached()) {
        if (this.searchParams != 'cache') {
          let dataCode: string = JSON.stringify(this.results);
          sessionStorage.setItem("sc_data", ConversionUtils.stringToBase64(dataCode));
          sessionStorage.setItem("sc_keysearch", this.searchParams);
          sessionStorage.setItem("sc_time", new Date().toISOString());
        }
      }
    });
    window.scroll(0, 0);

    let npages: number = 0;
    // Con esto nos posicionamos en la página de la búsqueda que queramos
    if (this.showCached) {
      setTimeout(() => {

        if (this.engine.getCached()) sessionStorage.setItem("sc_page", this.searchCached.Page.toString());
        npages = this.paginador!.TotalPages;
        // 1º Cálcula la posición dentro del conjunto de páginas
        //    de la página donde nos hemos quedado y vamos a ella

        let pageC: number = 0;
        let pageR: any = Math.ceil(this.paginador!.TotalPages / this.paginador!.NumberOfBetweenPages) + 1;
        let pageT: any = pageR;

        for (let i: number = npages; i != this.searchCached.Page; i--) {
          pageC++;
          if (pageC == this.paginador?.NumberOfBetweenPages) {
            pageC = 0;
            pageR--;
          }
        }
        if (pageR == pageT) {
          this.paginador?.Last2();
        } else {
          for (let i: number = 0; i < pageR - 2; i++) {
            this.paginador?.Next2();
          }
        }

        // 2º Posiciona la página
        this.paginador?.setCurrentPage(this.searchCached.Page);


      }, 100);
    }
  }

  // --- Manejo del paginador ---
  public paginar(page: any): void {
    this.fragment = page;
  }
  // --- Evento que devuelve el nº de página en el que se clicka
  public PageCurrent(page: any) {
    // Si estamos en modo cacheado de búsqueda, grabamos la página
    // en la que nos quedamos en el sessiostorage
    if (this.engine.getCached()) {
      sessionStorage.setItem("sc_page", page);
    }
  }

  // --- Manejo del item seleccionado para saltar hacia él ---
  async Selected(item: kcp_item_result_founded) {
    let pathItem: string = "";
    let pathTransform: string = "";

    // -- Paso 0: Mandamos mensaje de cierre de la búsqueda avanzada
    this.engine.SendMessage(SearchMessages.close_advanced_search);

    // -- Paso 1: Pedimos la ruta del elemento mediante el API correspondiente
    await this.portfolio.GetItemPath(item.id).then(data => { pathItem = data[0]; });

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
