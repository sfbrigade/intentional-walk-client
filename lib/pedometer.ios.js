'use strict';

import {
  CMAuthorizationStatus,
  authorizationStatus,
  startUpdates as startCmUpdates,
  stopUpdates as stopCmUpdates,
  queryPedometerData,
} from '@sfcivictech/react-native-cm-pedometer';

import Realm from './realm';

async function isAuthorized() {
  const result = await authorizationStatus();
  return (
    result === CMAuthorizationStatus.notDetermined ||
    result === CMAuthorizationStatus.authorized
  );
}

async function startUpdates(callback) {
  if (await isAuthorized()) {
    const walk = await Realm.getCurrentWalk();
    if (walk) {
      startCmUpdates(walk.start, (error, data) => {
        callback({
          numberOfSteps: data.numberOfSteps,
          distance: data.distance,
        });
      });
    }
  }
}

function stopUpdates() {
  stopCmUpdates();
}

async function getPedometerData(end) {
  const walk = await Realm.getCurrentWalk();
  if (walk) {
    try {
      const data = await queryPedometerData(walk.start, end);
      return {
        numberOfSteps: data.numberOfSteps,
        distance: data.distance,
      };
    } catch (err) {
      console.error(err);
    }
  }
  return null;
}

export default {
  startUpdates,
  getPedometerData,
  stopUpdates,
};
