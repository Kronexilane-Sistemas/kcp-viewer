import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, Input, OnInit, Output, AfterViewInit, OnChanges, SimpleChanges, AfterViewChecked } from '@angular/core';


@Component({
  selector: 'krn-paginator',
  templateUrl: './krn-paginator.component.html',
  styleUrls: ['./krn-paginator.component.scss']
})
export class KrnPaginatorComponent implements OnInit, OnChanges,AfterViewInit,AfterViewChecked {

  // Variables iniciales del paginador
  public TotalPages: number = 0;
  public CurrentPage: number = 0;


  // Propiedades externas generales
  @Input() public PageSize: number = 0;
  @Input() public DataSource!: Array<any>;
  @Input() public ButtonsSide:boolean=false;

  // Propiedades que controlan la apariencia del tipo 1 (Registro)
  @Input() public ShowNumberOfRegisters: boolean = true;
  @Input() public ShortInfo: boolean = false;
  @Input() public ExtraFunctions: Array<KRNPaginatorExtraFunction> | undefined;

  // Propiedades que controlan la apariencia del tipo 1 (Entre-páginas)
  @Input() public BetweenPages: boolean = false;
  @Input() public NumberOfBetweenPages: number = 0;
  @Input() public StepBetweenPages: number = 1;
  @Input() public BootstrapStyle:boolean=false;
  @Output() public PageSelected:EventEmitter<number>=new EventEmitter<number>();

  public BetweenPagesArray: Array<number> = [];

  public swArrows:boolean=true;

  // Funciones externas (Eventos)
  @Output()
  public PartialArray = new EventEmitter<Array<any>>();


  public TotalRegisters: number = 0;
  public Rest: number = 0;
  private DataCompleted: any = [];

  constructor() {

  }

  ngAfterViewChecked(): void {

  }
  ngAfterViewInit(): void {

  }


  ngOnChanges(changes: SimpleChanges): void {
    this.InitPaginator();
  }

  ngOnInit(): void {

  }

  //** Acceso al array de datos completos desde el exterior */
  public getData(): Array<any> {
    return this.DataCompleted;
  }

  //** Establecimiento manual de pagina */
  public setCurrentPage(page: number): void {
    if (page - 1 == this.TotalPages) page = this.TotalPages;
    if (page != this.TotalPages) {
      this.CurrentPage = page - 1;
      let partial: Array<any> = this.DataCompleted.slice(this.CurrentPage * this.PageSize, (this.CurrentPage * this.PageSize) + this.PageSize);
      this.PartialArray.emit(partial);
    } else {
      this.CurrentPage = this.TotalPages - 1;
      let partial: Array<any> = this.DataCompleted.slice(this.CurrentPage * this.PageSize, (this.CurrentPage * this.PageSize) + this.PageSize);
      this.PartialArray.emit(partial);
    }

  }

  //** Obtiene la página actual */
  public getCurrentPage(): number {
    return this.CurrentPage+1;
  }

  // ** Reseto manual variables paginador **/
  public Reset(): void {

    this.TotalRegisters = this.DataCompleted.length;
    this.TotalPages = Math.ceil(this.TotalRegisters / this.PageSize);
  }

  /** Procedimiento de inicialización del Paginador */
  public InitPaginator(): void {

    if (this.DataSource != undefined) {
      this.TotalRegisters = this.DataSource.length;
      this.DataCompleted = this.DataSource.slice(0, this.DataSource.length);
    }

    // Cálculos iniciales
    this.TotalPages = Math.ceil(this.TotalRegisters / this.PageSize);
    this.Rest = this.TotalRegisters % this.PageSize;


    // Nº de entrepaginas
    if(this.BetweenPages){
      if(this.NumberOfBetweenPages==0){
        this.BetweenPagesArray=[];
        if(this.TotalPages>5){
          this.NumberOfBetweenPages=5;
        }else{
          this.NumberOfBetweenPages = this.TotalPages;
          this.swArrows = false;
        }
      }else{
        this.BetweenPagesArray = [];
        if(this.TotalPages>=10){
          this.NumberOfBetweenPages=4;
        }else{
          this.NumberOfBetweenPages=this.TotalPages;
        }
      }
    }


    // Rellena el array de entre-páginas si procede
    if (this.BetweenPages) {
      if(this.BetweenPagesArray.length!=this.NumberOfBetweenPages){
        for (let n: number = 1; n < this.NumberOfBetweenPages + 1; n++) {
          this.BetweenPagesArray.push(n);
        }
      }
    }


    // Emite la ventana inicial de paginado
    if (this.PageSize > 0) {
      if (this.CurrentPage === 0) {
        let partial: Array<any> = this.DataCompleted.slice(0, this.PageSize);
        this.PartialArray.emit(partial);
        this.PageSelected.emit(1);
      }
    }

  }

  /******************************************
   * Controles de página estilo 1: REGISTROS
   ******************************************/

  // Siguiente página
  public Next(): void {
    if (this.CurrentPage < this.TotalPages - 1) {
      this.CurrentPage++;
      let partial: Array<any> = this.DataCompleted.slice(this.CurrentPage * this.PageSize, (this.CurrentPage * this.PageSize) + this.PageSize);
      this.PartialArray.emit(partial);
    } else return;
  }
  // Anterior página
  public Previous(): void {
    if (this.CurrentPage > 0) {
      this.CurrentPage--;
      let partial: Array<any> = this.DataCompleted.slice(this.CurrentPage * this.PageSize, (this.CurrentPage * this.PageSize) + this.PageSize);
      this.PartialArray.emit(partial);
    } else return;
  }
  // Página primera
  public First(): void {
    this.CurrentPage = 0;
    let partial: Array<any> = this.DataCompleted.slice(this.CurrentPage * this.PageSize, (this.CurrentPage * this.PageSize) + this.PageSize);
    this.PartialArray.emit(partial);
  }
  // Página última
  public Last(): void {
    this.CurrentPage = this.TotalPages - 1;
    let partial: Array<any> = this.DataCompleted.slice(this.CurrentPage * this.PageSize, (this.CurrentPage * this.PageSize) + this.PageSize);
    this.PartialArray.emit(partial);
  }
  // Selección de página
  public Select(): void {
    let msg: string = "Indique la página a la que quiere ir (1-" + this.TotalPages + ")";
    let page: any;
    let strNumber: string;
    do {
      page = prompt(msg, "1");
      strNumber = Number.parseInt(page).toString();
      if (page == null) {
        this.CurrentPage += 1;
        strNumber = this.CurrentPage.toString();
        break;
      }
    } while (strNumber == 'NaN' || (Number(strNumber) < 1 || Number(strNumber) > this.TotalPages));
    let GoPage: number = Number(strNumber);
    this.CurrentPage = GoPage - 1;
    let partial: Array<any> = this.DataCompleted.slice(this.CurrentPage * this.PageSize, (this.CurrentPage * this.PageSize) + this.PageSize);
    this.PartialArray.emit(partial);
  }

  /********************************************
  * Controles de página estilo 2: Entre-Páginas
  **********************************************/
  // Siguiente tanda de páginas
  public Next2(): void {
    if (this.BetweenPagesArray[this.NumberOfBetweenPages-1] < this.TotalPages){
      for (let n: number = 0; n < this.BetweenPagesArray.length; n++) {
        this.BetweenPagesArray[n] += this.StepBetweenPages;
        if(this.BetweenPagesArray[n]==this.TotalPages){
          this.Last2();
          return;
        }
      }
    } else return;
  }
  // Anterior tanda de páginas
  public Previous2(): void {
    if(this.BetweenPagesArray[0]!=1){
      for (let n: number = 0; n < this.BetweenPagesArray.length; n++) {
        if(this.BetweenPagesArray[0]<0){
          this.First2();
          return;
        }
        this.BetweenPagesArray[n] -= this.StepBetweenPages;
      }
    }else return;
  }

  // Primera tanda de páginas
  public First2():void{
    for (let n: number = 0; n < this.BetweenPagesArray.length; n++) {
      this.BetweenPagesArray[n] = n+1;
    }
  }
  // Última tanda de páginas
  public Last2():void{
    for (let n: number = 0; n < this.BetweenPagesArray.length; n++) {
       let i:number=(this.TotalPages-this.NumberOfBetweenPages+1);
       this.BetweenPagesArray[n]=i+n;
    }
  }

  // Selección de una página e ir ella
  public Select2(page:number):void{

    this.PageSelected.emit(page);
    this.setCurrentPage(page);
  }

  // Recalcula el NumBetweenPages
  public ReCalculateNumberOfBetweenPages():void{
      this.BetweenPagesArray=[];
      this.InitPaginator();
      this.Reset();
      this.NumberOfBetweenPages=this.TotalPages;
  }

  // Marca la página seleccionada visualmente
  public PageMarked(n: number): string {
    if (n == this.CurrentPage + 1) return 'page-mark'; else return '';
  }



}

/**
 * Clase que soporta funciones extra
 */
export class KRNPaginatorExtraFunction {
  public title: string = "";
  public img: string = "";
  public FunctionParameter:any;
  public extraFunction:any;
  public activated:boolean=true;
}
