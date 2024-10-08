import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const rise: Layer2 = upcomingL2({
  id: 'rise',
  display: {
    name: 'RISE',
    slug: 'rise',
    description:
      'RISE is a Parallel EVM Rollup that intends to unlock a new era of performance for Ethereum.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://riselabs.xyz/'],
      apps: [],
      documentation: ['https://docs.riselabs.xyz/'],
      explorers: [],
      repositories: ['https://github.com/risechain'],
      socialMedia: [
        'https://discord.com/invite/4yWVabz63y',
        'https://medium.com/@rise_chain',
        'https://x.com/rise_chain',
      ],
    },
  },
})
