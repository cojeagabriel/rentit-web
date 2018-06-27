import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'statusFilter'
})
export class StatusFilterPipe implements PipeTransform {

  transform(orders: any, statuses: String[]): any {
    if(statuses.length == 0)
      return orders;
    else{
      return orders.filter(function (order) {
        return statuses.indexOf(order.status) >=0;
      });
    }
  }

}
