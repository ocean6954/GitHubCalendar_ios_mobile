export interface ContributionDay {
  date: string;
  contributionCount: number;
}

export interface Week {
  contributionDays: ContributionDay[];
}

export interface Contribution {
  id?: number;
  date: string;
  contributionCount: number;
}
