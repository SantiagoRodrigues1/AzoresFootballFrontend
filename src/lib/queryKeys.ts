export const queryKeys = {
  home: {
    dashboard: ['home-dashboard'] as const
  },
  matches: {
    byCompetition: ['matches-by-competition'] as const
  },
  standings: {
    all: ['standings'] as const
  },
  news: {
    list: (page = 1) => ['news', page] as const,
    feed: ['news-feed'] as const,
    detail: (id: string) => ['news', id] as const,
    comments: (id: string) => ['news-comments', id] as const
  },
  discovery: {
    trending: ['trending'] as const,
    search: (query: string) => ['smart-search', query] as const,
    achievements: ['my-achievements'] as const
  },
  community: {
    posts: ['community-posts'] as const,
    comments: (postId: string) => ['community-comments', postId] as const
  },
  favorites: {
    teams: ['favorite-teams'] as const
  },
  notifications: {
    all: ['notifications'] as const
  },
  players: {
    detail: (playerId: string) => ['player-detail', playerId] as const
  },
  editRequests: {
    root: ['edit-requests'] as const,
    mine: ['edit-requests', 'mine'] as const,
    admin: (status: string) => ['edit-requests', 'admin', status] as const
  },
  submissions: {
    mine: ['my-submissions'] as const,
    admin: ['admin-submissions'] as const
  },
  uploads: {
    mine: ['my-uploads'] as const,
    admin: ['admin-uploads'] as const
  },
  reports: {
    admin: ['admin-reports'] as const
  },
  teamManager: {
    match: (matchId: string) => ['team-manager', 'match', matchId] as const,
    lineup: (matchId: string, teamId: string) => ['team-manager', 'lineup', matchId, teamId] as const
  }
};