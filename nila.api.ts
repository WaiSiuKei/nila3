import { createNilaBaseAPI } from "./standalone/standaloneBase";
import { createNilaChartAPI } from "./standalone/standaloneChart";
import { createNilaGraphicAPI } from "./standalone/standaloneGraphic";

const nila = createNilaBaseAPI();
nila.chart = createNilaChartAPI();
nila.graphic = createNilaGraphicAPI();

export default nila
