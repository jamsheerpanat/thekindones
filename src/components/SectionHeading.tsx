export const SectionHeading = ({
  eyebrow,
  title,
  description
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) => (
  <div className="flex flex-col gap-3">
    {eyebrow ? (
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-400">
        {eyebrow}
      </span>
    ) : null}
    <h2>{title}</h2>
    {description ? <p className="max-w-2xl">{description}</p> : null}
  </div>
);
