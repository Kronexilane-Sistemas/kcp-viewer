import { WrongUrlComponent } from './app-parts/wrong-url/wrong-url.component';
import { ObjectsComponent } from './app-parts/objects/objects.component';
import { SearchComponent } from './app-parts/search/search.component';
import { ItemsComponent } from './app-parts/items/items.component';
import { NgModule, Component } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ObjectErrorComponent } from './app-parts/object-error/object-error.component';



/*** Rutas a los componentes visuales */
export const RUTAS = {
  HOME: "home",
  SEARCH: "search/:data",
  NAVIGATOR: "navigator/:path",
  OBJECTS:"objects/:identificador",
  OBJECT_ERROR:"documentFail/:msg",
  WRONGURL:"url-error"
};



const homeComponent=ItemsComponent;

const routes: Routes = [
  {path:'',component:homeComponent},
  {path:RUTAS.HOME,component:homeComponent},
  {path: RUTAS.SEARCH, component: SearchComponent},
  {
    path: RUTAS.NAVIGATOR,
    component: ItemsComponent
  },
  {path: RUTAS.OBJECTS, component: ObjectsComponent },
  {path: RUTAS.OBJECT_ERROR, component: ObjectErrorComponent },
  {path:'**',component:WrongUrlComponent}
];

/**
 * Function JAVASCRIPT, devuelve el Nombre del componente pero sin la parametrización
 * @param path
 * @returns
 */
export function CNWithOutParams(path:string){
    let result:string="";
    let data:string[]=path.split("/:");
    if(data.length>0) result=data[0];
    return result;
}

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'ignore',useHash:false})],
  exports: [RouterModule],
  providers: [
    // Para evitar el error de ruta incorrecta al actualizar (F5) en el navegador.tr
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
})

export class AppRoutingModule {

}


