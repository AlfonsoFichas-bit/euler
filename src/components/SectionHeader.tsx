interface SectionHeaderProps {
  index: string;
  title: string;
  titleId: string;
  lead?: string;
}

const SectionHeader = ({ index, title, titleId, lead }: SectionHeaderProps) => (
  <div class="mb-8 flex items-baseline gap-4 border-b border-rule pb-4">
    <span class="font-mono text-sm text-signal" aria-hidden="true">
      {index}
    </span>
    <div class="min-w-0">
      <h2
        id={titleId}
        class="font-display text-[length:var(--step-2)] leading-[var(--leading-snug)] text-ink"
      >
        {title}
      </h2>
      {lead ? (
        <p class="mt-2 max-w-[var(--measure)] text-sm text-ink-soft">{lead}</p>
      ) : null}
    </div>
  </div>
);

export default SectionHeader;
