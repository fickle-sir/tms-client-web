import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NJ_TABLE_ACTIONS, NjTableActionContext, NjTableModule } from 'ng-jx/table';
import { NjFormModule } from 'ng-jx/form';
import { NjSelectModule } from 'ng-jx/select';
import { AppService } from '../../core/app.service';
import { WaybillBatchComponent } from './waybill-batch/waybill-batch.component';
import { SharedModule } from '@/common/shared.module';

function numberToCN(value: number) {
  var cnNumMap = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
  var cnLowUnits = new Array('', '拾', '佰', '仟');
  var cnHighUnits = new Array('', '万', '亿', '兆');
  var cnNum = '';

  var intNum = value;
  var strNum = intNum.toString();

  if (intNum > 0) {
    var zeroCount = 0;
    var len = strNum.length;
    for (var i = 0; i < len; i++) {
      var num = parseInt(strNum.charAt(i));
      var p = len - i - 1;
      var lowUnitPos = p % 4;
      var highUnitPos = p / 4;

      if (num === 0) {
        zeroCount++;
      } else {
        if (zeroCount > 0) {
          cnNum += cnNumMap[0];
        }
        zeroCount = 0;
        cnNum += cnNumMap[num] + cnLowUnits[lowUnitPos];
      }

      if (lowUnitPos === 0 && zeroCount < 4) {
        cnNum += cnHighUnits[highUnitPos];
      }
    }
  }

  return cnNum;
}

export function wbPrintWaybill(context: NjTableActionContext): Promise<any> {
  return wbPrintWaybillInternal(context, 'waybill/getprintwaybill');
};

export function wbPrintRecept(context: NjTableActionContext): Promise<any> {
  return wbPrintWaybillInternal(context, 'waybill/getprintrecept');
};

export function wbPrintWaybillInternal(context: NjTableActionContext, url: string): Promise<boolean> {
  const { table } = context;
  const { injector } = table;
  const rows = table.getSelectedRows();
  const http = injector.get(HttpClient);
  const msgSrv = injector.get(NzMessageService);
  const entName = injector.get(AppService).entName;

  let resolve: any;
  const promise = new Promise<boolean>(r => resolve = r);

  if (rows.length === 0) {
    msgSrv.warning('未选中任何项');
    return resolve(false);
  }

  http.post(url, { ids: rows.map(r => r.ID.value) })
    .subscribe(
      (data: any) => {
        resolve(true);

        const tpl = data.Tpl;
        const body = new RegExp('<body>([\\w\\W]*)</body>').exec(tpl)![1];
        const items = rows.map(row => {
          const id = row['ID'].value;
          const waybill = (data.Waybills as any[]).find(w => w.ID == id);

          waybill['PaymentMode'] = row['PaymentMode'].value;

          for (var name in row) {
            if (!waybill.hasOwnProperty(name))
              waybill[name] = row[name].text;
          }

          const amount = Math.floor(waybill['ActualAmount']);
          const strAmount = amount.toString();
          const cnNums = [] as string[];
          const cnNumMap = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
          for (var i = 1; i <= 4; i++) {
            var len = strAmount.length;
            var num = parseInt(strAmount.charAt(len - i))

            if (isNaN(num))
              cnNums.unshift('--');
            else
              cnNums.unshift(cnNumMap[num]);
          }

          if (strAmount.length > 4) {
            const value = parseInt(strAmount.substr(0, strAmount.length - 1));
            if (value > 999)
              throw new Error('金额超出处理范围');
            cnNums.unshift(numberToCN(value));
          } else {
            cnNums.unshift('--');
          }

          waybill['CnNums'] = cnNums;
          waybill['EntName'] = entName;
          waybill['ActualAmount'] = amount.toFixed(2);

          return juicer(body, waybill);
        });

        const iframe = document.createElement('iframe');
        iframe.setAttribute('frameborder', '0');
        iframe.setAttribute('style', 'width:100%;height:100%;position:fixed;visible:false;');
        document.body.appendChild(iframe);

        const win = iframe.contentWindow!;
        const doc = win.document;
        doc.write(tpl);
        doc.close();
        doc.body.innerHTML = items.join('\n');

        win.focus();
        win.print();
      },
      _ => resolve(false)
    );

  return promise;
};

@NgModule({
  imports: [SharedModule, NjSelectModule, NjTableModule, NjFormModule],
  declarations: [WaybillBatchComponent]
})
export class WaybillModule {
  static forRoot(): ModuleWithProviders<WaybillModule> {
    return {
      ngModule: WaybillModule,
      providers: [
        {
          provide: NJ_TABLE_ACTIONS,
          useValue: {
            'Wb_PrintWaybill': wbPrintWaybill,
            'Wb_PrintRecept': wbPrintRecept
          },
          multi: true
        }
      ]
    };
  }
}
