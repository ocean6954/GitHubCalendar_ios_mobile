type ContributionDay = {
  date: string;
  contribution_count: number;
};

type Week = {
  contributionDays: ContributionDay[];
};

export type Weeks = Week[];

export interface ContributionRails {
  date: string;
  contribution_count: number;
}
