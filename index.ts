import 'nila/style/index.scss';
import '@phosphor/widgets/style/index.css'
import nila from './nila.api'
import { orders } from "./mock/orders";
import { bars } from "./mock/bars";
import SuggestionItemProvider = nila.graphic.SuggestionItemProvider;
import SuggestionContext = nila.graphic.SuggestionContext;
import CancellationToken = nila.CancellationToken;
import SuggestResult = nila.graphic.SuggestResult;
import ISuggestion = nila.graphic.ISuggestion;

class OrderItemProvider implements SuggestionItemProvider {
  triggerKeys: string[] = ['order']

  provideSuggestionItems(context: SuggestionContext, token: CancellationToken): SuggestResult[] | Thenable<SuggestResult[]> {
    return [
      { suggestion: { label: '1', insertText: '1', } },
      { suggestion: { label: '2', insertText: '2', } },
      { suggestion: { label: '3', insertText: '3', } },
      { suggestion: { label: '4', insertText: '4', } },
      { suggestion: { label: '5', insertText: '4', } },
      { suggestion: { label: '6', insertText: '4', } },
      { suggestion: { label: '7', insertText: '4', } },
      { suggestion: { label: '8', insertText: '4', } },
      { suggestion: { label: '9', insertText: '4', } },
      { suggestion: { label: '10', insertText: '4', } },
      { suggestion: { label: '11', insertText: '4', } },
      { suggestion: { label: '12', insertText: '4', } },
      { suggestion: { label: '13', insertText: '4', } },
    ]
  }

  resolveSuggestionItem?(item: ISuggestion, token: CancellationToken): Thenable<void> {
    console.log('clicked')
    return Promise.resolve(null)
  }
}

window.addEventListener('DOMContentLoaded', () => {
  nila.graphic.registerSuggestionItemProvider('order', new OrderItemProvider())

  let nl = nila.chart.create(document.body)

  const allData = bars.map(b => ({
    time: b.utc_time,
    open: +b.open,
    high: +b.high,
    low: +b.low,
    close: +b.close,
    volume: +b.volume
  }))

  const orderData = orders.map(ord => ({
    type: ord.type,
    count: ord.count,
    time: (new Date(ord.strtime)).getTime()
  }))

  const chart = nl.createChart({
    interval: 1,
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
  })
  console.log(chart)

  chart.updateData('shse600000', allData)

  chart.addSeries('main',
    {
      name: `order_${nila.generateUuid()}`,
      dataSource: ['shse600000.main.main', 'order'],
      fields: [],
      transformer(dss) {
        const [dsBar, dsOrd] = dss
        let ret = []
        for (let j = 0, size = dsBar.points.length; j < size; j++) {
          let bar = dsBar.points[j]
          let temp = null
          for (let i = 0, len = dsOrd.points.length; i < len; i++) {
            let pt = dsOrd.points[i]
            if (pt.time === bar.time) {
              temp = { ...pt, index: j }
            }
          }
          if (temp) {
            temp.high = bar.high
            temp.low = bar.low
            temp.close = bar.close
            temp.key = `clOrdId: ${j}`
            ret.push(temp)
          }
        }

        return ret
      },
      alias: '交易委托',
      visualMap: 'order'
    })
  chart.updateData('order', orderData)
})
