
declare namespace nila {

  export type Thenable<T> = PromiseLike<T>;

  export interface IDisposable {
    dispose(): void;
  }

  export interface IEvent<T> {
    (listener: (e: T) => any, thisArg?: any): IDisposable;
  }

  export class Emitter<T> {
    constructor();
    readonly event: IEvent<T>;
    fire(event?: T): void;
    dispose(): void;
  }

  export class Promise<T = any, TProgress = any> {
    constructor(
      executor: (
        resolve: (value: T | PromiseLike<T>) => void,
        reject: (reason: any) => void,
        progress: (progress: TProgress) => void) => void,
      oncancel?: () => void);

    public then<TResult1 = T, TResult2 = never>(
      onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null,
      onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
      onprogress?: (progress: TProgress) => void): Promise<TResult1 | TResult2, TProgress>;

    public done(
      onfulfilled?: (value: T) => void,
      onrejected?: (reason: any) => void,
      onprogress?: (progress: TProgress) => void): void;

    public cancel(): void;

    public static as(value: null): Promise<null>;
    public static as(value: undefined): Promise<undefined>;
    public static as<T>(value: PromiseLike<T>): PromiseLike<T>;
    public static as<T, SomePromise extends PromiseLike<T>>(value: SomePromise): SomePromise;
    public static as<T>(value: T): Promise<T>;

    public static is(value: any): value is PromiseLike<any>;

    public static timeout(delay: number): Promise<void>;

    public static join<T1, T2>(promises: [T1 | PromiseLike<T1>, T2 | PromiseLike<T2>]): Promise<[T1, T2]>;
    public static join<T>(promises: (T | PromiseLike<T>)[]): Promise<T[]>;

    public static any<T>(promises: (T | PromiseLike<T>)[]): Promise<{ key: string; value: Promise<T>; }>;

    public static wrap<T>(value: T | PromiseLike<T>): Promise<T>;

    public static wrapError<T = never>(error: Error): Promise<T>;
  }

  export interface CancellationToken {
    readonly isCancellationRequested: boolean;
    readonly onCancellationRequested: IEvent<any>;
  }

  export function generateUuid(): string;
}

declare namespace nila.chart {
  export function create(domElement: HTMLElement): IChartsService;

  export interface IChartsService {
    createChart(opt: IChartCreateOptions): IChartService;
  }

  export interface IChartService {
    updateData(name: string, data: IDataPoint | IDataPoint[]): void

    getFocusedPart(): IChart;

    addNewPart(opts: IChartPartOptions): void
    addSeries(partName: string, series: IChartSeriesOptions): void
    removeSeries(name: string): void
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
    interval: number
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
  export function registerSuggestionItemProvider(graphicType: string, provider: SuggestionItemProvider): IDisposable;

  export interface ISuggestion {
    label: string;
    insertText: string;
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
}
