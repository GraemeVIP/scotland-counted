export type CouncilPillar = {
  score: number;
  rank: number;
};

export type CouncilPerformanceRow = {
  code: string;
  name: string;
  slug: string;
  overallScore: number;
  overallRank: number;
  peerScore: number;
  peerRank: number;
  coverage: number;
  medianRank: number;
  rankLow: number;
  rankHigh: number;
  winnerProbability: number;
  topFiveProbability: number;
  topTenProbability: number;
  pillars: {
    residentExperience: CouncilPillar;
    serviceOutcomes: CouncilPillar;
    councilManagement: CouncilPillar;
    valueForMoney: CouncilPillar;
    operationalClimate: CouncilPillar;
  };
  residentVerdict: {
    average: number;
    rank: number;
    base: number;
  };
  landlordRank: number | null;
  context: {
    goodPlaceToLive: number;
    loneliness: number;
    childPoverty: number;
    recordedCrimeRate: number;
    drugDeathRate: number | null;
    budgetGapMillions: number;
    crisisGrantAwardRate: number;
  };
};

/**
 * Scotland Counted's editorial index. Scores are relative positions among the
 * 32 councils, not percentages or official grades. Values are rounded for the
 * public interface; the downloadable files retain six decimal places.
 */
export const councilPerformanceRows = 
[
  {
    "code": "S12000011",
    "name": "East Renfrewshire",
    "slug": "east-renfrewshire",
    "overallScore": 68.6,
    "overallRank": 1,
    "peerScore": 65.4,
    "peerRank": 1,
    "coverage": 98.2,
    "medianRank": 1,
    "rankLow": 1,
    "rankHigh": 6,
    "winnerProbability": 82.4,
    "topFiveProbability": 94.5,
    "topTenProbability": 98.3,
    "pillars": {
      "residentExperience": {
        "score": 66.8,
        "rank": 4
      },
      "serviceOutcomes": {
        "score": 83.7,
        "rank": 1
      },
      "councilManagement": {
        "score": 41.4,
        "rank": 24
      },
      "valueForMoney": {
        "score": 59.4,
        "rank": 2
      },
      "operationalClimate": {
        "score": 83.9,
        "rank": 4
      }
    },
    "residentVerdict": {
      "average": 43.6,
      "rank": 8,
      "base": 210
    },
    "landlordRank": 15,
    "context": {
      "goodPlaceToLive": 98.0,
      "loneliness": 15.0,
      "childPoverty": 12.0,
      "recordedCrimeRate": 252.8,
      "drugDeathRate": 7.5,
      "budgetGapMillions": 8.7,
      "crisisGrantAwardRate": 72.0
    }
  },
  {
    "code": "S12000010",
    "name": "East Lothian",
    "slug": "east-lothian",
    "overallScore": 60.8,
    "overallRank": 2,
    "peerScore": 61.6,
    "peerRank": 2,
    "coverage": 100.0,
    "medianRank": 3,
    "rankLow": 2,
    "rankHigh": 6,
    "winnerProbability": 3.9,
    "topFiveProbability": 91.5,
    "topTenProbability": 100.0,
    "pillars": {
      "residentExperience": {
        "score": 62.0,
        "rank": 9
      },
      "serviceOutcomes": {
        "score": 57.3,
        "rank": 5
      },
      "councilManagement": {
        "score": 57.5,
        "rank": 9
      },
      "valueForMoney": {
        "score": 61.6,
        "rank": 1
      },
      "operationalClimate": {
        "score": 95.2,
        "rank": 1
      }
    },
    "residentVerdict": {
      "average": 38.7,
      "rank": 13,
      "base": 240
    },
    "landlordRank": 12,
    "context": {
      "goodPlaceToLive": 96.0,
      "loneliness": 18.0,
      "childPoverty": 22.1,
      "recordedCrimeRate": 482.3,
      "drugDeathRate": 16.5,
      "budgetGapMillions": 3.5,
      "crisisGrantAwardRate": 58.0
    }
  },
  {
    "code": "S12000036",
    "name": "City of Edinburgh",
    "slug": "city-of-edinburgh",
    "overallScore": 58.5,
    "overallRank": 3,
    "peerScore": 55.7,
    "peerRank": 5,
    "coverage": 100.0,
    "medianRank": 4,
    "rankLow": 2,
    "rankHigh": 8,
    "winnerProbability": 0.9,
    "topFiveProbability": 74.6,
    "topTenProbability": 99.8,
    "pillars": {
      "residentExperience": {
        "score": 66.1,
        "rank": 5
      },
      "serviceOutcomes": {
        "score": 49.5,
        "rank": 17
      },
      "councilManagement": {
        "score": 65.9,
        "rank": 2
      },
      "valueForMoney": {
        "score": 50.7,
        "rank": 8
      },
      "operationalClimate": {
        "score": 77.4,
        "rank": 8
      }
    },
    "residentVerdict": {
      "average": 39.3,
      "rank": 12,
      "base": 750
    },
    "landlordRank": 26,
    "context": {
      "goodPlaceToLive": 95.0,
      "loneliness": 20.0,
      "childPoverty": 22.8,
      "recordedCrimeRate": 744.0,
      "drugDeathRate": 20.6,
      "budgetGapMillions": 27.9,
      "crisisGrantAwardRate": 66.0
    }
  },
  {
    "code": "S12000045",
    "name": "East Dunbartonshire",
    "slug": "east-dunbartonshire",
    "overallScore": 58.0,
    "overallRank": 4,
    "peerScore": 52.5,
    "peerRank": 12,
    "coverage": 100.0,
    "medianRank": 5,
    "rankLow": 2,
    "rankHigh": 12,
    "winnerProbability": 0.0,
    "topFiveProbability": 62.4,
    "topTenProbability": 92.6,
    "pillars": {
      "residentExperience": {
        "score": 61.9,
        "rank": 10
      },
      "serviceOutcomes": {
        "score": 68.2,
        "rank": 2
      },
      "councilManagement": {
        "score": 43.5,
        "rank": 23
      },
      "valueForMoney": {
        "score": 54.7,
        "rank": 4
      },
      "operationalClimate": {
        "score": 22.6,
        "rank": 26
      }
    },
    "residentVerdict": {
      "average": 36.1,
      "rank": 16,
      "base": 260
    },
    "landlordRank": 22,
    "context": {
      "goodPlaceToLive": 98.0,
      "loneliness": 14.0,
      "childPoverty": 14.9,
      "recordedCrimeRate": 279.6,
      "drugDeathRate": 12.5,
      "budgetGapMillions": 23.7,
      "crisisGrantAwardRate": 72.0
    }
  },
  {
    "code": "S12000028",
    "name": "South Ayrshire",
    "slug": "south-ayrshire",
    "overallScore": 57.9,
    "overallRank": 5,
    "peerScore": 57.2,
    "peerRank": 4,
    "coverage": 100.0,
    "medianRank": 3,
    "rankLow": 1,
    "rankHigh": 6,
    "winnerProbability": 12.7,
    "topFiveProbability": 93.0,
    "topTenProbability": 100.0,
    "pillars": {
      "residentExperience": {
        "score": 58.6,
        "rank": 13
      },
      "serviceOutcomes": {
        "score": 58.5,
        "rank": 4
      },
      "councilManagement": {
        "score": 64.8,
        "rank": 4
      },
      "valueForMoney": {
        "score": 46.8,
        "rank": 14
      },
      "operationalClimate": {
        "score": 45.2,
        "rank": 20
      }
    },
    "residentVerdict": {
      "average": 37.5,
      "rank": 17,
      "base": 240
    },
    "landlordRank": 7,
    "context": {
      "goodPlaceToLive": 95.0,
      "loneliness": 24.0,
      "childPoverty": 20.7,
      "recordedCrimeRate": 461.6,
      "drugDeathRate": 21.5,
      "budgetGapMillions": 20.7,
      "crisisGrantAwardRate": 64.0
    }
  },
  {
    "code": "S12000048",
    "name": "Perth and Kinross",
    "slug": "perth-and-kinross",
    "overallScore": 56.5,
    "overallRank": 6,
    "peerScore": 48.5,
    "peerRank": 21,
    "coverage": 100.0,
    "medianRank": 7,
    "rankLow": 4,
    "rankHigh": 11,
    "winnerProbability": 0.0,
    "topFiveProbability": 24.9,
    "topTenProbability": 92.7,
    "pillars": {
      "residentExperience": {
        "score": 59.5,
        "rank": 11
      },
      "serviceOutcomes": {
        "score": 50.9,
        "rank": 16
      },
      "councilManagement": {
        "score": 63.4,
        "rank": 5
      },
      "valueForMoney": {
        "score": 45.2,
        "rank": 17
      },
      "operationalClimate": {
        "score": 80.6,
        "rank": 5
      }
    },
    "residentVerdict": {
      "average": 45.5,
      "rank": 2,
      "base": 210
    },
    "landlordRank": 12,
    "context": {
      "goodPlaceToLive": 97.0,
      "loneliness": 27.0,
      "childPoverty": 19.2,
      "recordedCrimeRate": 423.8,
      "drugDeathRate": 18.0,
      "budgetGapMillions": 20.7,
      "crisisGrantAwardRate": 63.0
    }
  },
  {
    "code": "S12000027",
    "name": "Shetland Islands",
    "slug": "shetland-islands",
    "overallScore": 55.5,
    "overallRank": 7,
    "peerScore": 51.3,
    "peerRank": 14,
    "coverage": 96.5,
    "medianRank": 16,
    "rankLow": 5,
    "rankHigh": 29,
    "winnerProbability": 0.0,
    "topFiveProbability": 6.7,
    "topTenProbability": 29.9,
    "pillars": {
      "residentExperience": {
        "score": 92.9,
        "rank": 1
      },
      "serviceOutcomes": {
        "score": 47.1,
        "rank": 21
      },
      "councilManagement": {
        "score": 48.7,
        "rank": 20
      },
      "valueForMoney": {
        "score": 36.7,
        "rank": 29
      },
      "operationalClimate": {
        "score": 0.0,
        "rank": 32
      }
    },
    "residentVerdict": {
      "average": 52.1,
      "rank": 1,
      "base": 260
    },
    "landlordRank": 17,
    "context": {
      "goodPlaceToLive": 96.0,
      "loneliness": 16.0,
      "childPoverty": 14.5,
      "recordedCrimeRate": 202.7,
      "drugDeathRate": 18.2,
      "budgetGapMillions": 43.7,
      "crisisGrantAwardRate": 58.0
    }
  },
  {
    "code": "S12000030",
    "name": "Stirling",
    "slug": "stirling",
    "overallScore": 55.3,
    "overallRank": 8,
    "peerScore": 54.4,
    "peerRank": 9,
    "coverage": 100.0,
    "medianRank": 7,
    "rankLow": 3,
    "rankHigh": 16,
    "winnerProbability": 0.0,
    "topFiveProbability": 22.2,
    "topTenProbability": 81.4,
    "pillars": {
      "residentExperience": {
        "score": 70.3,
        "rank": 3
      },
      "serviceOutcomes": {
        "score": 53.4,
        "rank": 13
      },
      "councilManagement": {
        "score": 51.1,
        "rank": 15
      },
      "valueForMoney": {
        "score": 38.6,
        "rank": 28
      },
      "operationalClimate": {
        "score": 45.2,
        "rank": 19
      }
    },
    "residentVerdict": {
      "average": 32.2,
      "rank": 27,
      "base": 230
    },
    "landlordRank": 20,
    "context": {
      "goodPlaceToLive": 96.0,
      "loneliness": 30.0,
      "childPoverty": 20.4,
      "recordedCrimeRate": 449.2,
      "drugDeathRate": 21.4,
      "budgetGapMillions": 11.4,
      "crisisGrantAwardRate": 64.0
    }
  },
  {
    "code": "S12000041",
    "name": "Angus",
    "slug": "angus",
    "overallScore": 53.8,
    "overallRank": 9,
    "peerScore": 53.5,
    "peerRank": 10,
    "coverage": 100.0,
    "medianRank": 15,
    "rankLow": 8,
    "rankHigh": 24,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.1,
    "topTenProbability": 18.7,
    "pillars": {
      "residentExperience": {
        "score": 56.2,
        "rank": 15
      },
      "serviceOutcomes": {
        "score": 48.0,
        "rank": 19
      },
      "councilManagement": {
        "score": 60.2,
        "rank": 6
      },
      "valueForMoney": {
        "score": 51.5,
        "rank": 7
      },
      "operationalClimate": {
        "score": 67.7,
        "rank": 10
      }
    },
    "residentVerdict": {
      "average": 34.2,
      "rank": 25,
      "base": 230
    },
    "landlordRank": 23,
    "context": {
      "goodPlaceToLive": 95.0,
      "loneliness": 25.0,
      "childPoverty": 24.1,
      "recordedCrimeRate": 425.4,
      "drugDeathRate": 14.9,
      "budgetGapMillions": 13.9,
      "crisisGrantAwardRate": 79.0
    }
  },
  {
    "code": "S12000023",
    "name": "Orkney Islands",
    "slug": "orkney-islands",
    "overallScore": 53.7,
    "overallRank": 10,
    "peerScore": 53.1,
    "peerRank": 11,
    "coverage": 96.5,
    "medianRank": 19,
    "rankLow": 9,
    "rankHigh": 32,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.4,
    "topTenProbability": 11.5,
    "pillars": {
      "residentExperience": {
        "score": 77.4,
        "rank": 2
      },
      "serviceOutcomes": {
        "score": 47.2,
        "rank": 20
      },
      "councilManagement": {
        "score": 51.6,
        "rank": 14
      },
      "valueForMoney": {
        "score": 50.3,
        "rank": 9
      },
      "operationalClimate": {
        "score": 3.2,
        "rank": 31
      }
    },
    "residentVerdict": {
      "average": 43.9,
      "rank": 7,
      "base": 240
    },
    "landlordRank": 19,
    "context": {
      "goodPlaceToLive": 100.0,
      "loneliness": 21.0,
      "childPoverty": 18.6,
      "recordedCrimeRate": 244.8,
      "drugDeathRate": null,
      "budgetGapMillions": 21.3,
      "crisisGrantAwardRate": 66.0
    }
  },
  {
    "code": "S12000014",
    "name": "Falkirk",
    "slug": "falkirk",
    "overallScore": 53.7,
    "overallRank": 11,
    "peerScore": 54.6,
    "peerRank": 8,
    "coverage": 100.0,
    "medianRank": 8,
    "rankLow": 4,
    "rankHigh": 15,
    "winnerProbability": 0.0,
    "topFiveProbability": 16.3,
    "topTenProbability": 69.7,
    "pillars": {
      "residentExperience": {
        "score": 50.7,
        "rank": 18
      },
      "serviceOutcomes": {
        "score": 55.9,
        "rank": 6
      },
      "councilManagement": {
        "score": 48.7,
        "rank": 19
      },
      "valueForMoney": {
        "score": 49.7,
        "rank": 10
      },
      "operationalClimate": {
        "score": 79.0,
        "rank": 6
      }
    },
    "residentVerdict": {
      "average": 32.9,
      "rank": 26,
      "base": 220
    },
    "landlordRank": 25,
    "context": {
      "goodPlaceToLive": 89.0,
      "loneliness": 20.0,
      "childPoverty": 25.1,
      "recordedCrimeRate": 552.3,
      "drugDeathRate": 19.7,
      "budgetGapMillions": 14.5,
      "crisisGrantAwardRate": 68.0
    }
  },
  {
    "code": "S12000018",
    "name": "Inverclyde",
    "slug": "inverclyde",
    "overallScore": 53.6,
    "overallRank": 12,
    "peerScore": 57.2,
    "peerRank": 3,
    "coverage": 100.0,
    "medianRank": 12,
    "rankLow": 6,
    "rankHigh": 18,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.9,
    "topTenProbability": 33.7,
    "pillars": {
      "residentExperience": {
        "score": 55.5,
        "rank": 16
      },
      "serviceOutcomes": {
        "score": 55.3,
        "rank": 8
      },
      "councilManagement": {
        "score": 48.1,
        "rank": 21
      },
      "valueForMoney": {
        "score": 43.8,
        "rank": 22
      },
      "operationalClimate": {
        "score": 71.0,
        "rank": 9
      }
    },
    "residentVerdict": {
      "average": 42.2,
      "rank": 5,
      "base": 260
    },
    "landlordRank": null,
    "context": {
      "goodPlaceToLive": 94.0,
      "loneliness": 14.0,
      "childPoverty": 22.4,
      "recordedCrimeRate": 594.4,
      "drugDeathRate": 35.6,
      "budgetGapMillions": 4.0,
      "crisisGrantAwardRate": 89.0
    }
  },
  {
    "code": "S12000021",
    "name": "North Ayrshire",
    "slug": "north-ayrshire",
    "overallScore": 52.8,
    "overallRank": 13,
    "peerScore": 54.8,
    "peerRank": 6,
    "coverage": 100.0,
    "medianRank": 9,
    "rankLow": 5,
    "rankHigh": 16,
    "winnerProbability": 0.1,
    "topFiveProbability": 10.4,
    "topTenProbability": 67.9,
    "pillars": {
      "residentExperience": {
        "score": 58.3,
        "rank": 14
      },
      "serviceOutcomes": {
        "score": 45.4,
        "rank": 23
      },
      "councilManagement": {
        "score": 67.2,
        "rank": 1
      },
      "valueForMoney": {
        "score": 48.1,
        "rank": 12
      },
      "operationalClimate": {
        "score": 37.1,
        "rank": 21
      }
    },
    "residentVerdict": {
      "average": 37.5,
      "rank": 15,
      "base": 240
    },
    "landlordRank": 1,
    "context": {
      "goodPlaceToLive": 87.0,
      "loneliness": 33.0,
      "childPoverty": 24.3,
      "recordedCrimeRate": 543.5,
      "drugDeathRate": 29.5,
      "budgetGapMillions": 17.8,
      "crisisGrantAwardRate": 59.0
    }
  },
  {
    "code": "S12000029",
    "name": "South Lanarkshire",
    "slug": "south-lanarkshire",
    "overallScore": 52.0,
    "overallRank": 14,
    "peerScore": 49.1,
    "peerRank": 18,
    "coverage": 100.0,
    "medianRank": 12,
    "rankLow": 8,
    "rankHigh": 17,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.3,
    "topTenProbability": 26.1,
    "pillars": {
      "residentExperience": {
        "score": 41.2,
        "rank": 19
      },
      "serviceOutcomes": {
        "score": 54.5,
        "rank": 11
      },
      "councilManagement": {
        "score": 59.7,
        "rank": 7
      },
      "valueForMoney": {
        "score": 46.3,
        "rank": 15
      },
      "operationalClimate": {
        "score": 66.1,
        "rank": 11
      }
    },
    "residentVerdict": {
      "average": 34.1,
      "rank": 21,
      "base": 430
    },
    "landlordRank": 8,
    "context": {
      "goodPlaceToLive": 94.0,
      "loneliness": 15.0,
      "childPoverty": 19.5,
      "recordedCrimeRate": 501.1,
      "drugDeathRate": 25.1,
      "budgetGapMillions": -1.5,
      "crisisGrantAwardRate": 61.0
    }
  },
  {
    "code": "S12000039",
    "name": "West Dunbartonshire",
    "slug": "west-dunbartonshire",
    "overallScore": 51.4,
    "overallRank": 15,
    "peerScore": 54.7,
    "peerRank": 7,
    "coverage": 100.0,
    "medianRank": 13,
    "rankLow": 9,
    "rankHigh": 19,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 22.6,
    "pillars": {
      "residentExperience": {
        "score": 64.3,
        "rank": 7
      },
      "serviceOutcomes": {
        "score": 45.7,
        "rank": 22
      },
      "councilManagement": {
        "score": 51.1,
        "rank": 15
      },
      "valueForMoney": {
        "score": 49.2,
        "rank": 11
      },
      "operationalClimate": {
        "score": 37.1,
        "rank": 21
      }
    },
    "residentVerdict": {
      "average": 31.2,
      "rank": 23,
      "base": 250
    },
    "landlordRank": 17,
    "context": {
      "goodPlaceToLive": 89.0,
      "loneliness": 19.0,
      "childPoverty": 25.2,
      "recordedCrimeRate": 694.8,
      "drugDeathRate": 29.8,
      "budgetGapMillions": 15.9,
      "crisisGrantAwardRate": 59.0
    }
  },
  {
    "code": "S12000040",
    "name": "West Lothian",
    "slug": "west-lothian",
    "overallScore": 50.0,
    "overallRank": 16,
    "peerScore": 48.5,
    "peerRank": 20,
    "coverage": 100.0,
    "medianRank": 16,
    "rankLow": 10,
    "rankHigh": 21,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 9.0,
    "pillars": {
      "residentExperience": {
        "score": 37.2,
        "rank": 22
      },
      "serviceOutcomes": {
        "score": 55.7,
        "rank": 7
      },
      "councilManagement": {
        "score": 55.1,
        "rank": 11
      },
      "valueForMoney": {
        "score": 44.1,
        "rank": 21
      },
      "operationalClimate": {
        "score": 59.7,
        "rank": 12
      }
    },
    "residentVerdict": {
      "average": 41.6,
      "rank": 3,
      "base": 230
    },
    "landlordRank": 11,
    "context": {
      "goodPlaceToLive": 93.0,
      "loneliness": 24.0,
      "childPoverty": 24.1,
      "recordedCrimeRate": 552.7,
      "drugDeathRate": 16.3,
      "budgetGapMillions": 20.2,
      "crisisGrantAwardRate": 63.0
    }
  },
  {
    "code": "S12000026",
    "name": "Scottish Borders",
    "slug": "scottish-borders",
    "overallScore": 49.3,
    "overallRank": 17,
    "peerScore": 52.5,
    "peerRank": 13,
    "coverage": 100.0,
    "medianRank": 17,
    "rankLow": 9,
    "rankHigh": 26,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.2,
    "topTenProbability": 12.3,
    "pillars": {
      "residentExperience": {
        "score": 36.4,
        "rank": 23
      },
      "serviceOutcomes": {
        "score": 53.4,
        "rank": 14
      },
      "councilManagement": {
        "score": 58.6,
        "rank": 8
      },
      "valueForMoney": {
        "score": 47.0,
        "rank": 13
      },
      "operationalClimate": {
        "score": 48.4,
        "rank": 16
      }
    },
    "residentVerdict": {
      "average": 39.9,
      "rank": 9,
      "base": 230
    },
    "landlordRank": null,
    "context": {
      "goodPlaceToLive": 97.0,
      "loneliness": 15.0,
      "childPoverty": 21.5,
      "recordedCrimeRate": 408.5,
      "drugDeathRate": 13.5,
      "budgetGapMillions": 16.3,
      "crisisGrantAwardRate": 76.0
    }
  },
  {
    "code": "S12000034",
    "name": "Aberdeenshire",
    "slug": "aberdeenshire",
    "overallScore": 49.1,
    "overallRank": 18,
    "peerScore": 49.1,
    "peerRank": 19,
    "coverage": 100.0,
    "medianRank": 15,
    "rankLow": 7,
    "rankHigh": 21,
    "winnerProbability": 0.0,
    "topFiveProbability": 1.3,
    "topTenProbability": 20.0,
    "pillars": {
      "residentExperience": {
        "score": 31.5,
        "rank": 26
      },
      "serviceOutcomes": {
        "score": 54.8,
        "rank": 10
      },
      "councilManagement": {
        "score": 65.1,
        "rank": 3
      },
      "valueForMoney": {
        "score": 52.3,
        "rank": 6
      },
      "operationalClimate": {
        "score": 21.0,
        "rank": 27
      }
    },
    "residentVerdict": {
      "average": 31.9,
      "rank": 29,
      "base": 320
    },
    "landlordRank": 14,
    "context": {
      "goodPlaceToLive": 97.0,
      "loneliness": 18.0,
      "childPoverty": 15.0,
      "recordedCrimeRate": 293.8,
      "drugDeathRate": 11.1,
      "budgetGapMillions": 19.2,
      "crisisGrantAwardRate": 64.0
    }
  },
  {
    "code": "S12000005",
    "name": "Clackmannanshire",
    "slug": "clackmannanshire",
    "overallScore": 49.0,
    "overallRank": 19,
    "peerScore": 49.7,
    "peerRank": 17,
    "coverage": 98.2,
    "medianRank": 18,
    "rankLow": 10,
    "rankHigh": 23,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.1,
    "topTenProbability": 7.5,
    "pillars": {
      "residentExperience": {
        "score": 40.1,
        "rank": 21
      },
      "serviceOutcomes": {
        "score": 53.5,
        "rank": 12
      },
      "councilManagement": {
        "score": 41.4,
        "rank": 24
      },
      "valueForMoney": {
        "score": 53.6,
        "rank": 5
      },
      "operationalClimate": {
        "score": 79.0,
        "rank": 6
      }
    },
    "residentVerdict": {
      "average": 39.8,
      "rank": 10,
      "base": 220
    },
    "landlordRank": 3,
    "context": {
      "goodPlaceToLive": 94.0,
      "loneliness": 28.0,
      "childPoverty": 28.5,
      "recordedCrimeRate": 519.3,
      "drugDeathRate": 24.5,
      "budgetGapMillions": 7.0,
      "crisisGrantAwardRate": 68.0
    }
  },
  {
    "code": "S12000020",
    "name": "Moray",
    "slug": "moray",
    "overallScore": 48.9,
    "overallRank": 20,
    "peerScore": 46.3,
    "peerRank": 24,
    "coverage": 93.0,
    "medianRank": 18,
    "rankLow": 12,
    "rankHigh": 21,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 1.7,
    "pillars": {
      "residentExperience": {
        "score": 34.6,
        "rank": 24
      },
      "serviceOutcomes": {
        "score": 58.5,
        "rank": 3
      },
      "councilManagement": {
        "score": 44.1,
        "rank": 22
      },
      "valueForMoney": {
        "score": 56.6,
        "rank": 3
      },
      "operationalClimate": {
        "score": 48.4,
        "rank": 16
      }
    },
    "residentVerdict": {
      "average": 33.8,
      "rank": 19,
      "base": 240
    },
    "landlordRank": 5,
    "context": {
      "goodPlaceToLive": 94.0,
      "loneliness": 15.0,
      "childPoverty": 23.0,
      "recordedCrimeRate": 441.0,
      "drugDeathRate": 13.2,
      "budgetGapMillions": 10.6,
      "crisisGrantAwardRate": 65.0
    }
  },
  {
    "code": "S12000047",
    "name": "Fife",
    "slug": "fife",
    "overallScore": 47.8,
    "overallRank": 21,
    "peerScore": 45.4,
    "peerRank": 26,
    "coverage": 100.0,
    "medianRank": 19,
    "rankLow": 11,
    "rankHigh": 22,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 3.8,
    "pillars": {
      "residentExperience": {
        "score": 52.8,
        "rank": 17
      },
      "serviceOutcomes": {
        "score": 44.2,
        "rank": 25
      },
      "councilManagement": {
        "score": 54.8,
        "rank": 13
      },
      "valueForMoney": {
        "score": 44.5,
        "rank": 20
      },
      "operationalClimate": {
        "score": 30.6,
        "rank": 24
      }
    },
    "residentVerdict": {
      "average": 41.0,
      "rank": 6,
      "base": 520
    },
    "landlordRank": 4,
    "context": {
      "goodPlaceToLive": 93.0,
      "loneliness": 25.0,
      "childPoverty": 25.0,
      "recordedCrimeRate": 545.3,
      "drugDeathRate": 19.4,
      "budgetGapMillions": 3.6,
      "crisisGrantAwardRate": 73.0
    }
  },
  {
    "code": "S12000038",
    "name": "Renfrewshire",
    "slug": "renfrewshire",
    "overallScore": 47.8,
    "overallRank": 22,
    "peerScore": 47.2,
    "peerRank": 22,
    "coverage": 98.2,
    "medianRank": 22,
    "rankLow": 16,
    "rankHigh": 27,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 0.1,
    "pillars": {
      "residentExperience": {
        "score": 23.3,
        "rank": 31
      },
      "serviceOutcomes": {
        "score": 54.8,
        "rank": 9
      },
      "councilManagement": {
        "score": 54.8,
        "rank": 12
      },
      "valueForMoney": {
        "score": 45.4,
        "rank": 16
      },
      "operationalClimate": {
        "score": 90.3,
        "rank": 2
      }
    },
    "residentVerdict": {
      "average": 41.2,
      "rank": 3,
      "base": 250
    },
    "landlordRank": 9,
    "context": {
      "goodPlaceToLive": 95.0,
      "loneliness": 15.0,
      "childPoverty": 21.0,
      "recordedCrimeRate": 532.4,
      "drugDeathRate": 27.1,
      "budgetGapMillions": 5.0,
      "crisisGrantAwardRate": 64.0
    }
  },
  {
    "code": "S12000050",
    "name": "North Lanarkshire",
    "slug": "north-lanarkshire",
    "overallScore": 45.1,
    "overallRank": 23,
    "peerScore": 50.3,
    "peerRank": 15,
    "coverage": 100.0,
    "medianRank": 21,
    "rankLow": 13,
    "rankHigh": 25,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 0.8,
    "pillars": {
      "residentExperience": {
        "score": 29.8,
        "rank": 28
      },
      "serviceOutcomes": {
        "score": 51.4,
        "rank": 15
      },
      "councilManagement": {
        "score": 48.9,
        "rank": 18
      },
      "valueForMoney": {
        "score": 43.0,
        "rank": 24
      },
      "operationalClimate": {
        "score": 59.7,
        "rank": 13
      }
    },
    "residentVerdict": {
      "average": 33.9,
      "rank": 20,
      "base": 470
    },
    "landlordRank": 2,
    "context": {
      "goodPlaceToLive": 92.0,
      "loneliness": 17.0,
      "childPoverty": 24.9,
      "recordedCrimeRate": 588.3,
      "drugDeathRate": 25.3,
      "budgetGapMillions": 19.3,
      "crisisGrantAwardRate": 69.0
    }
  },
  {
    "code": "S12000035",
    "name": "Argyll and Bute",
    "slug": "argyll-and-bute",
    "overallScore": 43.8,
    "overallRank": 24,
    "peerScore": 46.0,
    "peerRank": 25,
    "coverage": 100.0,
    "medianRank": 25,
    "rankLow": 21,
    "rankHigh": 29,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 0.0,
    "pillars": {
      "residentExperience": {
        "score": 62.3,
        "rank": 8
      },
      "serviceOutcomes": {
        "score": 38.2,
        "rank": 29
      },
      "councilManagement": {
        "score": 41.4,
        "rank": 24
      },
      "valueForMoney": {
        "score": 36.1,
        "rank": 30
      },
      "operationalClimate": {
        "score": 21.0,
        "rank": 27
      }
    },
    "residentVerdict": {
      "average": 31.7,
      "rank": 30,
      "base": 250
    },
    "landlordRank": null,
    "context": {
      "goodPlaceToLive": 99.0,
      "loneliness": 14.0,
      "childPoverty": 21.2,
      "recordedCrimeRate": 411.2,
      "drugDeathRate": 17.3,
      "budgetGapMillions": 14.9,
      "crisisGrantAwardRate": 60.0
    }
  },
  {
    "code": "S12000013",
    "name": "Na h-Eileanan Siar",
    "slug": "na-h-eileanan-siar",
    "overallScore": 42.0,
    "overallRank": 25,
    "peerScore": 50.1,
    "peerRank": 16,
    "coverage": 96.5,
    "medianRank": 26,
    "rankLow": 21,
    "rankHigh": 31,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 0.0,
    "pillars": {
      "residentExperience": {
        "score": 66.1,
        "rank": 5
      },
      "serviceOutcomes": {
        "score": 40.4,
        "rank": 28
      },
      "councilManagement": {
        "score": 24.5,
        "rank": 32
      },
      "valueForMoney": {
        "score": 35.6,
        "rank": 31
      },
      "operationalClimate": {
        "score": 16.1,
        "rank": 29
      }
    },
    "residentVerdict": {
      "average": 40.9,
      "rank": 11,
      "base": 240
    },
    "landlordRank": null,
    "context": {
      "goodPlaceToLive": 99.0,
      "loneliness": 15.0,
      "childPoverty": 19.7,
      "recordedCrimeRate": 236.0,
      "drugDeathRate": 13.6,
      "budgetGapMillions": 5.0,
      "crisisGrantAwardRate": 69.0
    }
  },
  {
    "code": "S12000033",
    "name": "Aberdeen City",
    "slug": "aberdeen-city",
    "overallScore": 41.4,
    "overallRank": 26,
    "peerScore": 37.4,
    "peerRank": 32,
    "coverage": 100.0,
    "medianRank": 28,
    "rankLow": 22,
    "rankHigh": 31,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 0.0,
    "pillars": {
      "residentExperience": {
        "score": 40.5,
        "rank": 20
      },
      "serviceOutcomes": {
        "score": 36.2,
        "rank": 30
      },
      "councilManagement": {
        "score": 40.6,
        "rank": 28
      },
      "valueForMoney": {
        "score": 43.6,
        "rank": 23
      },
      "operationalClimate": {
        "score": 85.5,
        "rank": 3
      }
    },
    "residentVerdict": {
      "average": 25.7,
      "rank": 32,
      "base": 300
    },
    "landlordRank": 21,
    "context": {
      "goodPlaceToLive": 92.0,
      "loneliness": 19.0,
      "childPoverty": 19.1,
      "recordedCrimeRate": 667.1,
      "drugDeathRate": 23.3,
      "budgetGapMillions": 11.0,
      "crisisGrantAwardRate": 60.0
    }
  },
  {
    "code": "S12000006",
    "name": "Dumfries and Galloway",
    "slug": "dumfries-and-galloway",
    "overallScore": 40.8,
    "overallRank": 27,
    "peerScore": 46.9,
    "peerRank": 23,
    "coverage": 100.0,
    "medianRank": 26,
    "rankLow": 22,
    "rankHigh": 30,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 0.0,
    "pillars": {
      "residentExperience": {
        "score": 23.1,
        "rank": 32
      },
      "serviceOutcomes": {
        "score": 45.2,
        "rank": 24
      },
      "councilManagement": {
        "score": 55.9,
        "rank": 10
      },
      "valueForMoney": {
        "score": 42.7,
        "rank": 25
      },
      "operationalClimate": {
        "score": 30.6,
        "rank": 24
      }
    },
    "residentVerdict": {
      "average": 32.5,
      "rank": 24,
      "base": 260
    },
    "landlordRank": null,
    "context": {
      "goodPlaceToLive": 97.0,
      "loneliness": 25.0,
      "childPoverty": 22.7,
      "recordedCrimeRate": 552.4,
      "drugDeathRate": 21.6,
      "budgetGapMillions": 12.5,
      "crisisGrantAwardRate": 69.0
    }
  },
  {
    "code": "S12000019",
    "name": "Midlothian",
    "slug": "midlothian",
    "overallScore": 40.5,
    "overallRank": 28,
    "peerScore": 37.5,
    "peerRank": 31,
    "coverage": 98.2,
    "medianRank": 28,
    "rankLow": 24,
    "rankHigh": 31,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 0.0,
    "pillars": {
      "residentExperience": {
        "score": 34.0,
        "rank": 25
      },
      "serviceOutcomes": {
        "score": 48.1,
        "rank": 18
      },
      "councilManagement": {
        "score": 35.8,
        "rank": 30
      },
      "valueForMoney": {
        "score": 39.1,
        "rank": 27
      },
      "operationalClimate": {
        "score": 33.9,
        "rank": 23
      }
    },
    "residentVerdict": {
      "average": 38.4,
      "rank": 14,
      "base": 230
    },
    "landlordRank": 16,
    "context": {
      "goodPlaceToLive": 95.0,
      "loneliness": 17.0,
      "childPoverty": 24.6,
      "recordedCrimeRate": 499.3,
      "drugDeathRate": 18.2,
      "budgetGapMillions": 13.3,
      "crisisGrantAwardRate": 52.0
    }
  },
  {
    "code": "S12000049",
    "name": "Glasgow City",
    "slug": "glasgow-city",
    "overallScore": 39.5,
    "overallRank": 29,
    "peerScore": 40.9,
    "peerRank": 27,
    "coverage": 100.0,
    "medianRank": 28,
    "rankLow": 23,
    "rankHigh": 31,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 0.0,
    "pillars": {
      "residentExperience": {
        "score": 30.6,
        "rank": 27
      },
      "serviceOutcomes": {
        "score": 41.2,
        "rank": 27
      },
      "councilManagement": {
        "score": 50.0,
        "rank": 17
      },
      "valueForMoney": {
        "score": 30.4,
        "rank": 32
      },
      "operationalClimate": {
        "score": 46.8,
        "rank": 18
      }
    },
    "residentVerdict": {
      "average": 29.0,
      "rank": 31,
      "base": 870
    },
    "landlordRank": null,
    "context": {
      "goodPlaceToLive": 90.0,
      "loneliness": 21.0,
      "childPoverty": 36.1,
      "recordedCrimeRate": 848.7,
      "drugDeathRate": 41.1,
      "budgetGapMillions": 86.7,
      "crisisGrantAwardRate": 63.0
    }
  },
  {
    "code": "S12000008",
    "name": "East Ayrshire",
    "slug": "east-ayrshire",
    "overallScore": 38.6,
    "overallRank": 30,
    "peerScore": 39.0,
    "peerRank": 28,
    "coverage": 100.0,
    "medianRank": 29,
    "rankLow": 23,
    "rankHigh": 31,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 0.0,
    "pillars": {
      "residentExperience": {
        "score": 28.8,
        "rank": 29
      },
      "serviceOutcomes": {
        "score": 41.8,
        "rank": 26
      },
      "councilManagement": {
        "score": 37.1,
        "rank": 29
      },
      "valueForMoney": {
        "score": 44.9,
        "rank": 18
      },
      "operationalClimate": {
        "score": 54.8,
        "rank": 14
      }
    },
    "residentVerdict": {
      "average": 32.2,
      "rank": 28,
      "base": 240
    },
    "landlordRank": 5,
    "context": {
      "goodPlaceToLive": 93.0,
      "loneliness": 23.0,
      "childPoverty": 23.6,
      "recordedCrimeRate": 538.2,
      "drugDeathRate": 27.9,
      "budgetGapMillions": 9.5,
      "crisisGrantAwardRate": 67.0
    }
  },
  {
    "code": "S12000017",
    "name": "Highland",
    "slug": "highland",
    "overallScore": 36.8,
    "overallRank": 31,
    "peerScore": 37.8,
    "peerRank": 29,
    "coverage": 100.0,
    "medianRank": 27,
    "rankLow": 21,
    "rankHigh": 32,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 0.0,
    "pillars": {
      "residentExperience": {
        "score": 58.8,
        "rank": 12
      },
      "serviceOutcomes": {
        "score": 28.1,
        "rank": 32
      },
      "councilManagement": {
        "score": 28.2,
        "rank": 31
      },
      "valueForMoney": {
        "score": 44.8,
        "rank": 19
      },
      "operationalClimate": {
        "score": 14.5,
        "rank": 30
      }
    },
    "residentVerdict": {
      "average": 34.5,
      "rank": 22,
      "base": 310
    },
    "landlordRank": 9,
    "context": {
      "goodPlaceToLive": 96.0,
      "loneliness": 15.0,
      "childPoverty": 22.1,
      "recordedCrimeRate": 429.9,
      "drugDeathRate": 14.6,
      "budgetGapMillions": 23.4,
      "crisisGrantAwardRate": 53.0
    }
  },
  {
    "code": "S12000042",
    "name": "Dundee City",
    "slug": "dundee-city",
    "overallScore": 35.3,
    "overallRank": 32,
    "peerScore": 37.8,
    "peerRank": 30,
    "coverage": 100.0,
    "medianRank": 32,
    "rankLow": 30,
    "rankHigh": 32,
    "winnerProbability": 0.0,
    "topFiveProbability": 0.0,
    "topTenProbability": 0.0,
    "pillars": {
      "residentExperience": {
        "score": 28.2,
        "rank": 30
      },
      "serviceOutcomes": {
        "score": 33.7,
        "rank": 31
      },
      "councilManagement": {
        "score": 40.9,
        "rank": 27
      },
      "valueForMoney": {
        "score": 41.8,
        "rank": 26
      },
      "operationalClimate": {
        "score": 48.4,
        "rank": 15
      }
    },
    "residentVerdict": {
      "average": 36.0,
      "rank": 18,
      "base": 220
    },
    "landlordRank": 24,
    "context": {
      "goodPlaceToLive": 91.0,
      "loneliness": 29.0,
      "childPoverty": 26.1,
      "recordedCrimeRate": 929.0,
      "drugDeathRate": 35.6,
      "budgetGapMillions": 5.0,
      "crisisGrantAwardRate": 78.0
    }
  }
] as const satisfies readonly CouncilPerformanceRow[];

export const councilPerformanceBySlug = Object.fromEntries(
  councilPerformanceRows.map((council) => [council.slug, council])
) as Record<string, CouncilPerformanceRow>;

export const performancePillars = [
  { key: "residentExperience", label: "What residents said", weight: 25 },
  { key: "serviceOutcomes", label: "Services and results", weight: 40 },
  { key: "councilManagement", label: "How the council is run", weight: 20 },
  { key: "valueForMoney", label: "Value for money", weight: 10 },
  { key: "operationalClimate", label: "Council emissions", weight: 5 },
] as const;

export const headlineMeasureCount = 53;
export const evidenceFamilyCount = 29;
export const robustnessRunCount = 10_000;
