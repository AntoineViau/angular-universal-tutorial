import { BlablaComponent } from './blabla.component';
import { ContentComponent } from './content.component';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { NgModule } from '@angular/core';

@NgModule({
    imports:[
        CommonModule,
        RouterModule
    ],
    declarations: [
        NavbarComponent,
        ContentComponent,
        BlablaComponent
    ],
    exports:[
        NavbarComponent,
        ContentComponent,
        BlablaComponent
    ]
})
export class LayoutModule {}