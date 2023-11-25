'use strict';

import Fitness from '@ovalmoney/react-native-fitness';
import moment from 'moment';

const permissions = [
  {
    kind: Fitness.PermissionKinds.Steps,
    access: Fitness.PermissionAccesses.Read,
  },
  {
    kind: Fitness.PermissionKinds.Distances,
    access: Fitness.PermissionAccesses.Read,
  },
];

async function requestPermissions() {
  let permitted = await Fitness.requestPermissions(permissions);
  return permitted;
}

// on android, the interval dates are not on day boundaries, so normalize
function normalize(records) {
  const normalizedRecords = [];
  let day = null;
  for (let record of records) {
    if (
      day == null ||
      !(
        moment(record.startDate).isSameOrAfter(day.startDate) &&
        moment(record.endDate).isBefore(day.endDate)
      )
    ) {
      let startDate = moment(record.startDate).startOf('day');
      let endDate = moment(startDate).add(1, 'days');
      day = {startDate, endDate, quantity: record.quantity};
      normalizedRecords.push(day);
    } else {
      day.quantity += record.quantity;
    }
  }
  return normalizedRecords;
}

async function getSteps(from, to) {
  const isAuthorized = await Fitness.isAuthorized(permissions);
  if (isAuthorized) {
    const steps = await Fitness.getSteps({
      startDate: from.toISOString(),
      endDate: to.toISOString(),
      interval: 'days',
    });
    return normalize(steps);
  } else {
    return [];
  }
}

async function getDistance(from, to) {
  const isAuthorized = await Fitness.isAuthorized(permissions);
  if (isAuthorized) {
    const distances = await Fitness.getDistances({
      startDate: from.toISOString(),
      endDate: to.toISOString(),
      interval: 'days',
    });
    return normalize(distances);
  } else {
    return [];
  }
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
