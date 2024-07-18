import axios from 'axios';
import _ from 'lodash';

import {ConcurrencyManager} from './axiosConcurrency';

import {API_BASE_URL} from '@env';

const instance = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

const MAX_CONCURRENT_REQUESTS = 1;
ConcurrencyManager(instance, MAX_CONCURRENT_REQUESTS);

export default {
  appUser: {
    create: function (
      firstName,
      lastName,
      email,
      zip,
      age,
      account_id,
      is_latino,
      race,
      race_other,
      gender,
      gender_other,
      sexual_orien,
      sexual_orien_other,
    ) {
      return instance.post('appuser/create', {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        zip,
        age,
        account_id,
        is_latino,
        race,
        race_other,
        gender,
        gender_other,
        sexual_orien,
        sexual_orien_other,
      });
    },
    createv2: function (
      account_id,
      age,
      device_model,
      device_type,
      device_version,
      email,
      firstName,
      gender,
      gender_other,
      is_latino,
      lastName,
      race,
      race_other,
      sexual_orien,
      sexual_orien_other,
      zip,
    ) {
      return instance.post('/v2/appuser', {
        account_id,
        age,
        device_model,
        device_type,
        device_version,
        email,
        firstName,
        gender,
        gender_other,
        is_latino,
        lastName,
        race,
        race_other,
        sexual_orien,
        sexual_orien_other,
        zip,
      });
    },
    update: function (account_id, attributes) {
      const payload = _.pick(attributes, [
        'is_latino',
        'race',
        'race_other',
        'gender',
        'gender_other',
        'sexual_orien',
        'sexual_orien_other',
      ]);
      payload.account_id = account_id;
      return instance.put('appuser/create', payload);
    },
    updatev2: function (appuser, attributes) {
      const {
        device_model,
        device_type,
        device_version,
        gender,
        gender_other,
        is_latino,
        race,
        race_other,
        sexual_orien,
        sexual_orien_other,
      } = attributes;
      const payload = {
        account_id: appuser.id,
        device_model,
        device_type,
        device_version,
        gender,
        gender_other,
        is_latino,
        race,
        race_other,
        sexual_orien,
        sexual_orien_other,
      };
      const updates = instance.patch('/v2/appuser', payload);
      // pessimistically update the appuser.
      appuser.update(updates);
      return updates;
    },
    delete: function (account_id) {
      return instance.delete('appuser/delete', {
        data: {account_id: account_id},
      });
    },
  },
  contest: {
    current: function () {
      return instance.get('contest/current');
    },
  },
  dailyWalk: {
    create: function (daily_walks, account_id) {
      return instance.post('dailywalk/create', {
        daily_walks,
        account_id,
      });
    },
  },
  intentionalWalk: {
    create: function (intentional_walks, account_id) {
      return instance.post('intentionalwalk/create', {
        intentional_walks,
        account_id,
      });
    },
    get: function (account_id) {
      return instance.post('intentionalwalk/get', {account_id});
    },
  },
  leaderboard: {
    get: function (device_id, contest_id) {
      return instance.get('leaderboard/get', {
        params: {device_id, contest_id},
      });
    },
  },
  weeklyGoal: {
    create: function (account_id, weekly_goal) {
      return instance.post('weeklygoal/create', {
        account_id,
        weekly_goal,
      });
    },
    get: function (account_id) {
      return instance.post('weeklygoal/get', {account_id});
    },
  },
};
