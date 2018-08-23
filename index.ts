import nila from './nila.api';
import { orders } from './mock/orders';
import { bars } from './mock/bars';
import SuggestionItemProvider = nila.graphic.SuggestionItemProvider;
import SuggestionContext = nila.graphic.SuggestionContext;
import CancellationToken = nila.CancellationToken;
import SuggestResult = nila.graphic.SuggestResult;
import ISuggestion = nila.graphic.ISuggestion;
import DataProvider = nila.graphic.DataProvider;
import DataQuery = nila.graphic.DataQuery;
import IDataPoint = nila.chart.IDataPoint;

const allData = bars.map(b => ({
  time: b.utc_time,
  open: +b.open,
  high: +b.high,
  low: +b.low,
  close: +b.close,
  volume: +b.volume
}));

const orderData = orders.map(ord => ({
  type: ord.type,
  count: ord.count,
  time: (new Date(ord.strtime)).getTime()
}));

class OrderItemProvider implements SuggestionItemProvider {
  triggerKeys: string[] = ['order'];

  provideSuggestionItems(context: SuggestionContext, token: CancellationToken): SuggestResult[] | Thenable<SuggestResult[]> {
    console.log(context);
    return [
      { suggestion: { id: '1', text: '1', } },
      { suggestion: { id: '2', text: '2', } },
      { suggestion: { id: '3', text: '3', } },
      { suggestion: { id: '4', text: '4', } },
      { suggestion: { id: '5', text: '4', } },
      { suggestion: { id: '6', text: '4', } },
      { suggestion: { id: '7', text: '4', } },
      { suggestion: { id: '8', text: '4', } },
      { suggestion: { id: '9', text: '4', } },
      { suggestion: { id: '10', text: '4', } },
      { suggestion: { id: '11', text: '4', } },
      { suggestion: { id: '12', text: '4', } },
      { suggestion: { id: '13', text: '4', } },
    ];
  }

  resolveSuggestionItem?(item: ISuggestion, token: CancellationToken): Thenable<void> {
    console.log('clicked', item);
    return Promise.resolve(null);
  }
}

class MarketDataProvider implements DataProvider {
  provideData(context: DataQuery, token: CancellationToken): IDataPoint[] | Thenable<IDataPoint[]> {
    return allData.slice(0, context.count);
  }
}

window.addEventListener('DOMContentLoaded', () => {

  let nl;

  let container = document.getElementById('container');

  function create() {
    nila.graphic.registerSuggestionItemProvider('order', new OrderItemProvider());
    nila.graphic.registerDatetimeFormatter(nila.ChartDataResolution.Day, (val) => (new Date(val)).toDateString());
    nila.graphic.registerDatetimeFormatter(nila.ChartDataResolution.Hour, (val) => (new Date(val)).getHours().toString());
    nila.graphic.registerDatetimeFormatter(nila.ChartDataResolution.M, (val) => (new Date(val)).getMinutes().toString());

    nila.graphic.registerDataProvider('*', new MarketDataProvider());

    nl = nila.chart.create(container);

    const chart = nl.createChart({
      dataResolution: nila.ChartDataResolution.M,
      dataRange: nila.ChartDataRange.IntradayStock,
      dataSources: ['shse600000'],
      parts: [
        {
          name: 'main', series: [{
            name: 'main',
            dataSource: 'shse600000',
            alias: '浦发银行',
            fields: [
              { name: 'open', label: 'open' },
              { name: 'high', label: 'high' },
              { name: 'low', label: 'low' },
              { name: 'close', label: 'close' }
            ]
          }]
        },
        {
          name: 'volume', series: [{
            name: 'main',
            dataSource: 'shse600000',
            alias: 'Volume',
            fields: [
              { name: 'volume', label: 'volume' },
            ]
          }]
        },
      ]
    });
    console.log(chart);

    chart.updateData('shse600000', allData);

    chart.addSeries('main',
      {
        name: `order_${nila.generateUuid()}`,
        dataSource: ['order'],
        moveable: true,
        fields: [],
        transformer(dss) {
          const [dsBar, dsOrd] = dss;
          let fields = dsBar.fields;
          let field = fields[fields.length - 1];
          let ret = [];
          let counter = 0;
          for (let j = 0, size = dsBar.points.length; j < size; j++) {
            let bar = dsBar.points[j];
            let temp = null;
            for (let i = 0, len = dsOrd.points.length; i < len; i++) {
              let pt = dsOrd.points[i];
              if (pt.time === bar.time) {
                temp = {
                  close: bar[field.name],
                  type: pt.type,
                  count: pt.count,
                  id: `${counter}`,
                  index: bar.i
                };
                counter++;
                ret.push(temp);
              }
            }
          }

          return ret;
        },
        alias: '交易委托',
        visualMap: 'order'
      });

    chart.updateData('order', orderData);
  }

  function destroy() {
    nila.chart.dispose(container);
  }

  create()

  // setTimeout(() => {
  //   destroy();
  // }, 2000);
  //
  // setTimeout(() => {
  //   create()
  // }, 5000)
});
