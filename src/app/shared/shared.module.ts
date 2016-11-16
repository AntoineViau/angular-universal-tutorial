import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ModelService } from './api.service';

const MODULES = [
  // Do NOT include UniversalModule, HttpModule, or JsonpModule here
  CommonModule,
  RouterModule,
  FormsModule,
  ReactiveFormsModule
];

const PROVIDERS = [
  ModelService
]

@NgModule({
  imports: [
    ...MODULES
  ],
  declarations: [
  ],
  providers: [
    ...PROVIDERS
  ],
  exports: [
    ...MODULES,
  ]
})
export class SharedModule { }
