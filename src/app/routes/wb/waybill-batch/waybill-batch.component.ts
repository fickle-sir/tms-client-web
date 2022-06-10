import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NjTableAction, NjTableColumn, NjTableOptions, NjTableOptionsProvider, NJ_TABLE_OPTIONS_PROVIDER } from 'ng-jx/table';
import { NjFormOptionsProvider, NJ_FORM_OPTIONS_PROVIDER } from 'ng-jx/form';

@Component({
  selector: 'app-waybill-batch',
  templateUrl: './waybill-batch.component.html',
  styleUrls: ['./waybill-batch.component.less']
})
export class WaybillBatchComponent implements OnInit {
  options: any

  cargoOptions: NjTableOptions

  form: FormGroup

  constructor(
    @Inject(NJ_FORM_OPTIONS_PROVIDER)
    formOptionsProvider: NjFormOptionsProvider
  ) {
    formOptionsProvider.get('WaybillBatch')
      .then(options => {
        this.options = { fields: options.fields, nzSpan: 8 }
      });
  }

  cargoOptionsResolver(options: NjTableOptions): any {
    const fields = ((<any>options).fields as NjTableColumn[]).filter(c => c.name != 'Damage');
    fields.find(p => p.name == "WbID")!.show = false;
    const actions: NjTableAction[] = [
      {
        type: 'add',
        modal: {
          nzWidth: "lg",
          nzComponentParams: { nzSpan: 12 }
        }
      }
    ];

    return {
      ...options,
      ...{ source: null, fields, actions }
    };
  }

  ngOnInit(): void {

  }
}
