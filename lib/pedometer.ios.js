'use strict';

import {
  isStepCountingSupported,
  startStepCounterUpdate,
  stopStepCounterUpdate,
} from '@dongminyu/react-native-step-counter';

import Realm from './realm';
import Fitness from './fitness';

async function isAuthorized() {
  try {
    const result = await isStepCountingSupported();
    return result?.supported === true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function startUpdates(callback) {
  if (await isAuthorized()) {
    const walk = await Realm.getCurrentWalk();
    if (walk) {
      startStepCounterUpdate(walk.start, data => {
        callback({
          numberOfSteps: data.steps,
          distance: data.distance,
        });
      });
    }
  }
}

function stopUpdates() {
  stopStepCounterUpdate();
}

async function getPedometerData(end) {
  const walk = await Realm.getCurrentWalk();
  if (walk) {
    const results = await Fitness.getStepsAndDistances(walk.start, end);
    if (results?.length) {
      return results.reduce(
        (sum, result) => {
          sum.numberOfSteps += result.steps;
          sum.distance += result.distance;
        },
        {numberOfSteps: 0, distance: 0},
      );
    }
  }
  return null;
}

export default {
  startUpdates,
  getPedometerData,
  stopUpdates,
};
