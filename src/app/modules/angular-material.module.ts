import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTreeModule } from '@angular/cdk/tree';
import { PortalModule } from '@angular/cdk/portal';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTableModule} from '@angular/material/table';

import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSortModule} from '@angular/material/sort';
import {MatRadioModule} from '@angular/material/radio';

const materialModules = [
  OverlayModule,
  MatDialogModule,
  MatTableModule,
  MatCheckboxModule,
  MatRadioModule,
  CdkTreeModule,
  MatSortModule,
  MatDatepickerModule,
  MatPaginatorModule,
  MatNativeDateModule,
  PortalModule,
  MatToolbarModule,
  MatIconModule,
  MatSliderModule,
  MatButtonModule,
  MatMenuModule,
  MatSelectModule,
  MatGridListModule,
  MatListModule,
  MatSidenavModule,
  MatTooltipModule,
  MatCardModule,
  MatFormFieldModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatDividerModule,
  MatChipsModule,
  MatTabsModule,
  MatButtonToggleModule,
  DragDropModule,
  MatSnackBarModule,
  MatAutocompleteModule,
]
@NgModule({
  imports: [CommonModule, ...materialModules],
  exports: [...materialModules],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AngularMaterialModule {}
