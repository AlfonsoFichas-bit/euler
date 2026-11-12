import { formatInput } from '../lib/paramFields';
import { formatNumber, type StepComparison } from '../lib/rocket';

interface ErrorTableProps {
  rows: StepComparison[];
}

const ErrorTable = ({ rows }: ErrorTableProps) => (
  <div
    class="table-scroll"
    role="region"
    aria-label="Comparación de error por paso"
    tabIndex={0}
  >
    <table class="data-table">
      <caption class="data-table__caption">
        Error absoluto al tiempo final según el paso
      </caption>
      <thead>
        <tr>
          <th scope="col">Paso</th>
          <th scope="col">Velocidad (m/s)</th>
          <th scope="col">Error de velocidad (m/s)</th>
          <th scope="col">Altura (m)</th>
          <th scope="col">Error de altura (m)</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={String(row.h)}>
            <th scope="row">
              {row.h === 'exact' ? 'Exacta' : `${formatInput(row.h)} s`}
            </th>
            <td>{formatNumber(row.v)}</td>
            <td>{formatNumber(row.vError)}</td>
            <td>{formatNumber(row.y)}</td>
            <td>{formatNumber(row.yError)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default ErrorTable;
