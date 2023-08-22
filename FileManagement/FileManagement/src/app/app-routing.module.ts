import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import { FileManagementListComponent } from './pages/file-management-list/file-management-list.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
       component: FileManagementListComponent
    },

];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
