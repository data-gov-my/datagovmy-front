export type ElectionType = "parlimen" | "dun";
export enum ElectionEnum {
  Parlimen = 0,
  Dun = 1,
}
export type ElectionResult = "won" | "won_uncontested" | "lost" | "lost_deposit";

export type Candidate = {
  type: ElectionType;
  election_name: string;
  date: string;
  seat: string;
  party: string;
  votes: Record<"abs" | "perc", number>;
  result: ElectionResult;
};

export type Party = {
  party: string;
  type: ElectionType;
  state: string;
  election_name: string;
  date: string;
  seats: {
    total: number;
    perc: number;
    won: number;
  };
  votes: {
    abs: number;
    perc: number;
  };
};

export type Seat = {
  seat: string;
  election_name: string;
  date: string;
  party: string;
  name: string;
  majority: {
    abs: number;
    perc: number;
  };
  type: ElectionType;
};

export type OverallSeat = {
  seat: string;
  date: string;
  party: string;
  name: string;
  majority: {
    abs: number;
    perc: number;
  };
  voter_turnout: {
    abs: number;
    perc: number;
  };
  votes_rejected: {
    abs: number;
    perc: number;
  };
};

export type BaseResult = {
  name: string;
  type: ElectionType;
  date: string;
  election_name: string;
  seat: string;
  party: string;
  votes: {
    abs: number;
    perc: number;
  };
  result: string;
};

export type SeatResult = {
  votes: {
    majority: number;
    majority_perc: number;
    voter_turnout: number;
    voter_turnout_perc: number;
    votes_rejected: number;
    votes_rejected_perc: number;
  };
  data: Array<BaseResult>;
};

export type CandidateResult = SeatResult;

export type PartyResult = Array<{
  party: string;
  type: string;
  state: string;
  election_name: string;
  date: string;
  seats: {
    total: number;
    perc: number;
    won: number;
  };
  votes: {
    abs: number;
    perc: number;
  };
}>;

export type SeatOptions = {
  seat_name: string;
  type: ElectionType;
};

type ElectionParams<T> = T extends Candidate
  ? { candidate_name: string }
  : T extends Party
  ? {
      party_name: string;
      state: string;
    }
  : T extends Seat
  ? SeatOptions
  : never;

export type ElectionResource<T extends Candidate | Party | Seat> = {
  elections: T extends Candidate | Party
    ? {
        parlimen: T[];
        dun: T[];
      }
    : T[];
  params: ElectionParams<T>;
};
