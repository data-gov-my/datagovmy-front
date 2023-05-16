export type ElectionType = "parlimen" | "dun";

export type Candidate = {
  type: ElectionType;
  election_name: string;
  date: string;
  seat: string;
  party: string;
  votes: Record<"abs" | "perc", number>;
  result: string;
  voter_turnout: number;
  voter_turnout_perc: number;
  voter_rejected: number;
  voter_rejected_perc: number;
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

type ElectionParams<T> = T extends Candidate
  ? { candidate_name: string }
  : T extends Party
  ? {
      party_name: string;
      state: string;
    }
  : T extends Seat
  ? { seat_name: string }
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
