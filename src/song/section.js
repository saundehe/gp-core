export const SECTION_KINDS = Object.freeze({
  intro:      'intro',
  verse:      'verse',
  pre_chorus: 'pre_chorus',
  chorus:     'chorus',
  bridge:     'bridge',
  solo:       'solo',
  breakdown:  'breakdown',
  outro:      'outro',
});

export function createSection({
  name = '',
  kind = SECTION_KINDS.verse,
  startBar = 1,
  endBar = 4,
  tags = [],
  ...rest
} = {}) {
  return {
    _v: 1,
    name,
    kind,
    start_bar: startBar,
    end_bar:   endBar,
    tags,
    ...rest,
  };
}

export function normalizeSection(raw) {
  if (!raw) return null;
  if (raw._v === 1) return raw;
  return createSection({
    name:      raw.name      ?? '',
    kind:      raw.kind      ?? SECTION_KINDS.verse,
    startBar:  raw.start_bar ?? raw.startBar ?? 1,
    endBar:    raw.end_bar   ?? raw.endBar   ?? 4,
    tags:      raw.tags      ?? [],
  });
}
