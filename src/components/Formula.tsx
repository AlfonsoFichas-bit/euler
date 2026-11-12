import katex from 'katex';

interface FormulaProps {
  tex: string;
  display?: boolean;
}

const Formula = ({ tex, display = true }: FormulaProps) => {
  const html = katex.renderToString(tex, {
    displayMode: display,
    throwOnError: false,
    strict: false,
  });

  return (
    <div
      class="formula"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default Formula;
