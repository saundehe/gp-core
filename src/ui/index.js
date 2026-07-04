// @gp/core/ui — the Riffwork family design system.
// CSS: import '@gp/core/ui/tokens.css' then '@gp/core/ui/base.css'.
// Icons: injectIcons() once at boot, then icon('play') for markup.
export { ICONS_SPRITE, ICON_NAMES, injectIcons, icon } from './icons.js';

// Canonical brand strings — use these, don't retype them.
export const BRAND = {
  family: 'Riffwork',
  tagline: 'Write it. Rig it. Play it.',
  products: {
    riffwork: { name: 'Riffwork', mono: 'R', role: 'write' },
    rigwork: { name: 'RigWork', mono: 'RG', role: 'rig' },
    loopwork: { name: 'LoopWork', mono: 'LW', role: 'hardware' },
    clockwork: { name: 'Clockwork', mono: 'CW', role: 'sync' },
    tools: { name: 'Riffwork · Free Tools', mono: 'RT', role: 'funnel' },
  },
};
