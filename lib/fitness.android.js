'use strict';

import {PermissionsAndroid} from 'react-native';
import GoogleFit, { BucketUnit, Scopes} from 'react-native-google-fit';
import moment from 'moment';

// note that Write permission is requested because on Android, Intentional Walk may be the
// first app to request Step activity from Google Play Services (i.e. if Google Fit is not
// installed and used)- at least, this is my best understanding at this time
// on Android, we also request "Activity" permission used for the live pedometer implementation
// in lib/pedometer.android.js
const scopes = [
  Scopes.FITNESS_ACTIVITY_READ,
  Scopes.FITNESS_ACTIVITY_WRITE,
];

async function requestPermissions() {
  // on Android, we now need to separately ask for permission to read from the phone's activity sensors
  // SEPARATELY from asking for permissions to use Google Fit APIs below...
  let result = await PermissionsAndroid.requestMultiple([
    'android.permission.ACTIVITY_RECOGNITION',
    'com.google.android.gms.permission.ACTIVITY_RECOGNITION',
  ]);
  if (
    result['android.permission.ACTIVITY_RECOGNITION'] !==
      PermissionsAndroid.RESULTS.GRANTED &&
    result['com.google.android.gms.permission.ACTIVITY_RECOGNITION'] !==
      PermissionsAndroid.RESULTS.GRANTED
  ) {
    return false;
  }
  result = await GoogleFit.authorize({ scopes });
  if (result.success) {
    GoogleFit.startRecording((event) => {
      console.log('GoogleFit.startRecording callback', event);
    }, ['step', 'distance']);
  }
  return result.success;
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
  await GoogleFit.checkIsAuthorized();
  if (GoogleFit.isAuthorized) {
    const steps = await GoogleFit.getDailyStepCountSamples({
      startDate: from.toISOString(),
      endDate: to.toISOString(),
      bucketUnit: BucketUnit.DAY,
      bucketInterval: 1
    })
    return normalize(steps);
  } else {
    return [];
  }
}

async function getDistance(from, to) {
  await GoogleFit.checkIsAuthorized();
  if (GoogleFit.isAuthorized) {
    const distances = await GoogleFit.getDailyDistanceSamples({
      startDate: from.toISOString(),
      endDate: to.toISOString(),
      bucketUnit: BucketUnit.DAY,
      bucketInterval: 1
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
