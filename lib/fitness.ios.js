'use strict';

import AppleHealthKit from 'react-native-health';

const permissions = {
  permissions: {
    read: [
      AppleHealthKit.Constants.Permissions.DistanceWalkingRunning,
      AppleHealthKit.Constants.Permissions.StepCount,
      AppleHealthKit.Constants.Permissions.Steps,
    ],
  },
};

async function requestPermissions() {
  return new Promise((resolve, reject) => {
    AppleHealthKit.initHealthKit(permissions, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(true);
      }
    });
  });
}

async function getSteps(from, to) {
  const isAuthorized = await requestPermissions();
  if (isAuthorized) {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyStepCountSamples(
        {
          startDate: from.toISOString(),
          endDate: to.toISOString(),
        },
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        },
      );
    });
  }
  return [];
}

async function getDistance(from, to) {
  const isAuthorized = await await requestPermissions();
  if (isAuthorized) {
    return new Promise((resolve, reject) => {
      AppleHealthKit.getDailyDistanceWalkingRunningSamples(
        {
          startDate: from.toISOString(),
          endDate: to.toISOString(),
        },
        (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        },
      );
    });
  }
  return [];
}

async function getStepsAndDistances(from, to) {
  const [steps, distances] = await Promise.all([
    getSteps(from, to),
    getDistance(from, to),
  ]);
  // combine steps and distances into a single payload as expected by API
  const dailyWalks = [];
  for (let [i, step] of steps.entries()) {
    const dailyWalk = {
      date: step.startDate.format('YYYY-MM-DD'),
      steps: step.quantity,
    };
    if (i < distances.length && distances[i].startDate.isSame(step.startDate)) {
      dailyWalk.distance = distances[i].quantity;
    } else {
      // not sure if this will ever happen, but just in case steps/distances array don't match
      for (let distance of distances) {
        if (distance.startDate.isSame(step.startDate)) {
          dailyWalk.distance = distance.quantity;
          break;
        }
      }
    }
    // observed missing distance values when steps are small, set to 0 as fallback
    dailyWalk.distance = dailyWalk.distance || 0;
    dailyWalks.push(dailyWalk);
  }
  return dailyWalks;
}

export default {
  requestPermissions,
  getDistance,
  getSteps,
  getStepsAndDistances,
};
