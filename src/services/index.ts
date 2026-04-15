/**
 * services/index.ts
 * Exportações centralizadas dos services
 */

export * from './matchService';
export * from './refereeService';
export * from './squadService';
export * from './featureService';

import matchService from './matchService';
import refereeService from './refereeService';
import squadService from './squadService';
import * as featureService from './featureService';

export { matchService, refereeService, squadService, featureService };
