let Notifications;

async function ensureModule() {
  if (Notifications) return Notifications;
  try {
    // Lazy import to avoid crashing if module isn't installed yet
    Notifications = require('expo-notifications');
    // Configure Android channel if available
    if (Notifications && Notifications.setNotificationChannelAsync) {
      await Notifications.setNotificationChannelAsync('deadlines', {
        name: 'Project Deadlines',
        importance: Notifications.AndroidImportance?.HIGH || 4,
      });
    }
  } catch (e) {
    Notifications = null;
  }
  return Notifications;
}

export async function requestNotificationPermissions() {
  const mod = await ensureModule();
  if (!mod) return false;
  const { status } = await mod.requestPermissionsAsync();
  return status === 'granted';
}

function toDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? null : d;
}

export async function scheduleProjectDeadlineNotifications(project) {
  const mod = await ensureModule();
  if (!mod) return [];
  const granted = await requestNotificationPermissions();
  if (!granted) return [];

  const end = toDate(project.endDate);
  if (!end) return [];

  const notifications = [];
  // On deadline
  const onDeadline = await mod.scheduleNotificationAsync({
    content: {
      title: 'موعد تحویل پروژه',
      body: `پروژه ${project.name} امروز باید تحویل شود.`,
      data: { projectId: project.id },
    },
    trigger: { channelId: 'deadlines', date: end },
  });
  notifications.push(onDeadline);

  // One day before
  const dayBefore = new Date(end.getTime() - 24 * 60 * 60 * 1000);
  if (dayBefore > new Date()) {
    const beforeId = await mod.scheduleNotificationAsync({
      content: {
        title: 'یادآوری مهلت پروژه',
        body: `یک روز تا پایان پروژه ${project.name} باقی مانده است.`,
        data: { projectId: project.id },
      },
      trigger: { channelId: 'deadlines', date: dayBefore },
    });
    notifications.push(beforeId);
  }

  return notifications;
}

export async function cancelNotifications(notificationIds) {
  const mod = await ensureModule();
  if (!mod || !Array.isArray(notificationIds)) return;
  for (const id of notificationIds) {
    try { await mod.cancelScheduledNotificationAsync(id); } catch (_) {}
  }
}


