import notifee, {
  AuthorizationStatus,
  TimeUnit,
  TriggerType,
} from '@notifee/react-native';

async function isAuthorized() {
  const settings = await notifee.getNotificationSettings();
  return settings.authorizationStatus === AuthorizationStatus.AUTHORIZED;
}

async function requestPermissions() {
  return notifee.requestPermission({
    alert: true,
    badge: true,
    sound: true,
  });
}

async function scheduleHourlyNotification(message) {
  const channelId = await notifee.createChannel({
    id: 'default',
    name: 'iWalk Notifications',
  });

  const trigger = {
    type: TriggerType.INTERVAL,
    interval: 60,
    timeUnit: TimeUnit.MINUTES,
  };

  return notifee.createTriggerNotification(
    {
      body: message,
      android: {
        channelId,
      },
    },
    trigger,
  );
}

async function cancelNotification(id) {
  return notifee.cancelTriggerNotification(id);
}

export default {
  cancelNotification,
  isAuthorized,
  requestPermissions,
  scheduleHourlyNotification,
};
