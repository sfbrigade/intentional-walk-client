import {useEffect} from 'react';
import {collectDeviceInfo} from '../lib/deviceinfo';
// eslint-disable-next-line no-unused-vars
import {Api, Realm} from '../lib';

// This hook is used to collect device information and send it to the server.
// It's purpose is to backfill data on users that registered before the device information 
// was added to the registration form.
export function useDeviceInfoCollector() {
  useEffect(() => {
    const checkNeedsUpdate = async () => {
      const appUser = await Realm.getUser();
      if (!appUser) {
        return;
      }
      if (appUser.hasDeviceInfoTracked) {
        return;
      }
      const deviceInfo = collectDeviceInfo();
      // TODO: Uncomment this when the API is ready
      // const updated = await Api.appUser.updatev2(appUser.account_id, {
      //     device_type: deviceInfo.deviceType,
      //     device_version: deviceInfo.deviceVersion,
      // });
      await appUser.update({
        // Replace this with the return value
        // of the API call.
        device_type: deviceInfo.deviceType,
        device_version: deviceInfo.deviceVersion,
      });
    };
    checkNeedsUpdate();
  }, []);
}
