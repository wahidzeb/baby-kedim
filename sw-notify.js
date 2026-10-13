/* Baby Kedim reminders add-on (imported by sw.js). Local only, no server. */
var BKN_URL = '/baby-kedim/';
self.addEventListener('notificationclick', function (e) {
  e.notification.close();
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function (cs) {
    for (var i = 0; i < cs.length; i++) { if (cs[i].url.indexOf(BKN_URL) >= 0 && 'focus' in cs[i]) return cs[i].focus(); }
    return self.clients.openWindow ? self.clients.openWindow(BKN_URL + '?source=reminder') : null;
  }));
});
function bknCancel() { return self.registration.getNotifications({ includeTriggered: true }).catch(function () { return self.registration.getNotifications(); }).then(function (ns) { ns.forEach(function (n) { if ((n.tag || '').indexOf('bk-') === 0) n.close(); }); }).catch(function () {}); }
self.addEventListener('message', function (e) {
  var d = e.data || {}; if (d.bk !== 'notify') return;
  if (d.op === 'cancel') { e.waitUntil(bknCancel()); return; }
  if (d.op === 'schedule' && typeof TimestampTrigger !== 'undefined') {
    e.waitUntil(bknCancel().then(function () { return Promise.all((d.items || []).slice(0, 2).map(function (it) {
      return self.registration.showNotification(it.title, { body: it.body, tag: it.tag, icon: BKN_URL + 'icons/icon-192.png', badge: BKN_URL + 'icons/icon-192.png', data: { url: BKN_URL }, showTrigger: new TimestampTrigger(it.t) }).catch(function () {});
    })); }));
  }
  if (d.op === 'show') { e.waitUntil(self.registration.showNotification(d.title, { body: d.body, tag: d.tag, icon: BKN_URL + 'icons/icon-192.png', badge: BKN_URL + 'icons/icon-192.png', data: { url: BKN_URL } }).catch(function () {})); }
});
