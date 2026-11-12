import { formatInput } from '../lib/paramFields';
import { formatNumber, type Iteration } from '../lib/rocket';

interface IterationTableProps {
  iterations: Iteration[];
  step: number;
}

const IterationTable = ({ iterations, step }: IterationTableProps) => (
  <div
    class="table-scroll"
    role="region"
    aria-label="Tabla de iteraciones"
    tabIndex={0}
  >
    <table class="data-table">
      <caption class="data-table__caption">
        Iteraciones de Euler con paso de {formatInput(step)} s
      </caption>
      <thead>
        <tr>
          <th scope="col">Tiempo (s)</th>
          <th scope="col">Velocidad (m/s)</th>
          <th scope="col">Altura (m)</th>
        </tr>
      </thead>
      <tbody>
        {iterations.map((row) => (
          <tr key={row.n}>
            <th scope="row">{formatInput(row.t)}</th>
            <td>{formatNumber(row.v)}</td>
            <td>{formatNumber(row.y)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default IterationTable;
