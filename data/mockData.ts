
import { Script } from '../types';
import { silkRoadScript } from './scripts/silkRoad';
import { shangYangScript } from './scripts/shangYang';
import { wuxuReformScript } from './scripts/wuxuReform';
import { octoberRevolutionScript } from './scripts/octoberRevolution';

// Aggregating all scripts into the database
export const SCRIPTS_DB: Script[] = [
    silkRoadScript,
    shangYangScript,
    wuxuReformScript,
    octoberRevolutionScript
];

export const MOCK_SCRIPT = SCRIPTS_DB[0];
