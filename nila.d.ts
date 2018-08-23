declare namespace nila {

  export type Thenable<T> = PromiseLike<T>;

  export interface IDisposable {
    dispose(): void;
  }

  export interface IEvent<T> {
    (listener: (e: T) => any, thisArg?: any): IDisposable;
  }

  export interface CancellationToken {
    readonly isCancellationRequested: boolean;
    readonly onCancellationRequested: IEvent<any>;
  }

  export function generateUuid(): string;

  export enum ChartDataResolution {
    M,
    M5,
    M15,
    M30,
    Hour,
    Day,
    Week,
    Month,
    Year
  }

  export enum ChartDataRange {
    IntradayStock,
    IntradayFuture,
    DailyStock,
    DailyFuture,
    Continuous, // FX/Crypto currencies
  }
}

declare namespace nila.chart {
  export function create(domElement: HTMLElement): IChartsService;

  export function dispose(container: HTMLElement): void;

  export interface IChartsService {
    createChart(opt: IChartCreateOptions): IChartService;
    removeAllCharts(): void;
    dispose(): void;
  }

  export interface IChartService {
    updateData(name: string, data: IDataPoint | IDataPoint[]): void

    getFocusedPart(): IChart;

    addNewPart(opts: IChartPartOptions): void
    addSeries(partName: string, series: IChartSeriesOptions): void
    removeSeries(name: string): void
    executeCommand(commandId: string, ...args: any[]): void;
  }

  export interface IChart {
    mouseX: number
    mouseY: number
  }

  export interface IChartPartOptions {
    name: string,
    series: IChartSeriesOptions[]
  }

  export interface IDataPointField {
    name: string,
    label: string
  }

  export interface IChartSeriesOptions {
    name: string,
    dataSource: string | string[],
    fields: IDataPointField[],
    transform?: string,
    transformer?: (deps: Array<IBaseDataSource>) => IDataPoint[],
    alias: string,
    visualMap?: string
  }

  export interface IChartCreateOptions {
    parts: IChartPartOptions[],
    dataSources: string[],
    dataResolution: ChartDataResolution,
    dataRange: ChartDataRange
  }

  export interface IBaseDataSource {
    id: string
    name: string
    points: IDataPoint[]
    get(ind: number): IDataPoint
    first(): IDataPoint
    last(): IDataPoint
  }

  export interface IDataPoint {
    [key: string]: any
  }

}

declare namespace nila.graphic {
  //#region formatter
  export function registerDatetimeFormatter(interval: ChartDataResolution, formatter: (number) => string): IDisposable;

  //#endregion

  //#region suggesion
  export function registerSuggestionItemProvider(graphicType: string, provider: SuggestionItemProvider): IDisposable;

  export interface ISuggestion {
    id: string;
    text: string;
  }

  export interface SuggestionContext {
    triggerKey: string;
  }

  export interface SuggestResult {
    suggestion: ISuggestion
  }

  export interface SuggestionItemProvider {
    triggerKeys?: string[];
    provideSuggestionItems(context: SuggestionContext, token: CancellationToken): SuggestResult[] | Thenable<SuggestResult[]>;
    resolveSuggestionItem?(item: ISuggestion, token: CancellationToken): Thenable<void>;
  }

  //#endregion

  //#region data
  export function registerDataProvider(symbolName: string, provider: DataProvider): IDisposable

  export interface DataQuery {
    name: string;
    count: number;
    timeStamp: string; //ISO 8601
  }

  export interface DataProvider {
    provideData(context: DataQuery, token: CancellationToken): nila.chart.IDataPoint[] | Thenable<nila.chart.IDataPoint[]>;
  }
  //#endregion
}
