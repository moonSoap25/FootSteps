/**
 * Footsteps — Google Apps Script backend.
 *
 * Deploy as a Web App (Deploy > New deployment > Web app).
 * Data is stored in Script Properties (Project Settings > Script properties),
 * shared across everyone who opens the deployed URL. Property values are
 * capped at 9KB and total storage at 500KB — fine for a small pilot group,
 * but swap this out for a Google Sheet or Firestore before real scale.
 */

function doGet(e) {
  // Apps Script file names are case-sensitive here.  The HTML file in this
  // project is named `index.html`, so requesting `Index` prevents the web app
  // from serving the client at all.
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Footsteps')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function _props() {
  return PropertiesService.getScriptProperties();
}
function _getJSON(key) {
  const v = _props().getProperty(key);
  return v ? JSON.parse(v) : null;
}
function _setJSON(key, val) {
  _props().setProperty(key, JSON.stringify(val));
  return true;
}

/** Returns the Workspace email of whoever opened the web app, or '' if unavailable
 *  (e.g. consumer Gmail accounts, or a deployment set to "Anyone" access). */
function getMyEmail() {
  try {
    return Session.getActiveUser().getEmail() || '';
  } catch (e) {
    return '';
  }
}

function getAllProfiles() {
  const idx = _getJSON('profile_index') || [];
  const out = [];
  idx.forEach(function (id) {
    const p = _getJSON('profile:' + id);
    if (p) out.push(p);
  });
  return out;
}

function getProfile(id) {
  return _getJSON('profile:' + id);
}

function saveProfile(profile) {
  _setJSON('profile:' + profile.id, profile);
  const idx = _getJSON('profile_index') || [];
  if (idx.indexOf(profile.id) === -1) {
    idx.push(profile.id);
    _setJSON('profile_index', idx);
  }
  return true;
}

function findProfileByEmail(email) {
  const all = getAllProfiles();
  for (var i = 0; i < all.length; i++) {
    if (all[i].email && all[i].email.toLowerCase() === String(email).toLowerCase()) {
      return all[i];
    }
  }
  return null;
}

function getConns(id) {
  return _getJSON('conn:' + id) || [];
}
function saveConns(id, conns) {
  return _setJSON('conn:' + id, conns);
}

function getNotifs(id) {
  return _getJSON('notif:' + id) || [];
}
function saveNotifs(id, notifs) {
  return _setJSON('notif:' + id, notifs);
}
