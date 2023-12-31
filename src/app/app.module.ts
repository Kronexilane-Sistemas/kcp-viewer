import { DimensionsCSSPipe } from './app-parts/objects/inflate/doc-elements/doccontent/DimensionsCSS.Pipe';
import { YoutubeParamsPipe } from './app-parts/objects/inflate/doc-elements/doccontent/YoutubeParams.Pipe';
import { SecureContentPipe } from './app-parts/objects/inflate/doc-elements/doccontent/SecureContent.Pipe';
import { HttpClientModule } from '@angular/common/http';
import { APPSettings } from './services/config.app.service';
import { APPLoginService } from './services/login/app.login.service';
import { PluginSearchComponent } from './plugins/plugin-search/plugin-search.component';
import { PluginComponent } from './plugins/plugin/plugin.component';
import { KrnPaginatorComponent } from './plugins/krn-paginator/krn-paginator.component';

import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

import { PagemenuComponent } from './pagemenu/pagemenu.component';
import { Mainmenu1Component } from './mainmenu1/mainmenu1.component';
import { WebtitleComponent } from './webtitle/webtitle.component';
import { PagetitleComponent } from './pagetitle/pagetitle.component';
import { Rmainmenu1Component } from './rmainmenu1/rmainmenu1.component';
import { LogotipoComponent } from './logotipo/logotipo.component';
import { VisitcounterComponent } from './visitcounter/visitcounter.component';
import { CategoriesComponent } from './app-parts/categories/categories.component';
import { LoginComponent } from './app-parts/login/login.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LogoutComponent } from './plugins/logout/logout.component';
import { ItemsComponent } from './app-parts/items/items.component';
import { ItemPasswordComponent } from './plugins/item-info/item-info.component';
import { SearchComponent } from './app-parts/search/search.component';
import { ObjectsComponent } from './app-parts/objects/objects.component';
import { HTMLDocComponent } from './app-parts/objects/inflate/htmldoc/htmldoc.component';
import { PresentationComponent } from './app-parts/objects/inflate/presentation/presentation.component';

import { DocheaderComponent } from './app-parts/objects/inflate/doc-elements/docheader/docheader.component';
import { DoccontentComponent } from './app-parts/objects/inflate/doc-elements/doccontent/doccontent.component';
import { DocfooterComponent } from './app-parts/objects/inflate/doc-elements/docfooter/docfooter.component';
import { Rmainmenu2Component } from './rmainmenu2/rmainmenu2.component';
import { ButtonScrollingComponent } from './plugins/button-scrolling/button-scrolling.component';
import { WrongUrlComponent } from './app-parts/wrong-url/wrong-url.component';
import { ObjectErrorComponent } from './app-parts/object-error/object-error.component';
import { AppProgressComponent } from './plugins/app-progress/app-progress.component';
import { DoccontactComponent } from './app-parts/objects/inflate/doc-elements/doccontact/doccontact.component';
import { CookiesWarningComponent } from './plugins/cookies-warning/cookies-warning.component';
import { SearchPainterClassicComponent } from './app-parts/search/painters/search-painter-classic/search-painter-classic.component';
import { SearchPainterCardComponent } from './app-parts/search/painters/search-painter-card/search-painter-card.component';
import { SearchPainterPrettyComponent } from './app-parts/search/painters/search-painter-pretty/search-painter-pretty.component';







@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    PagemenuComponent,
    Mainmenu1Component,
    WebtitleComponent,
    PagetitleComponent,
    Rmainmenu1Component,
    Rmainmenu2Component,
    LogotipoComponent,
    VisitcounterComponent,
    CategoriesComponent,
    KrnPaginatorComponent,
    PluginComponent,
    PluginSearchComponent,
    LoginComponent,
    LogoutComponent,
    ItemsComponent,
    ItemPasswordComponent,
    SearchComponent,
    ObjectsComponent,
    HTMLDocComponent,
    PresentationComponent,
    DocheaderComponent,
    DoccontentComponent,
    SecureContentPipe,
    YoutubeParamsPipe,
    DimensionsCSSPipe,
    DocfooterComponent,
    ButtonScrollingComponent,
    WrongUrlComponent,
    ObjectErrorComponent,
    AppProgressComponent,
    DoccontactComponent,
    CookiesWarningComponent,
    SearchPainterClassicComponent,
    SearchPainterCardComponent,
    SearchPainterPrettyComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,

  ],
  providers:
  [
    APPSettings,
    APPLoginService
  ],
  schemas:[
    NO_ERRORS_SCHEMA
  ],
  bootstrap: [AppComponent],
  exports: [
    ButtonScrollingComponent,
    WrongUrlComponent,
    ObjectErrorComponent
  ]
})
export class AppModule {  }
