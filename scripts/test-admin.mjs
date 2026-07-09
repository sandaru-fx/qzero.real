const base = 'http://localhost:3000';

const loginPage = await fetch(`${base}/admin/login`);
console.log('login page:', loginPage.status);

const dashUnauth = await fetch(`${base}/admin/dashboard`, { redirect: 'manual' });
console.log('dashboard unauth:', dashUnauth.status, dashUnauth.headers.get('location'));

const form = new FormData();
form.set('email', 'admin@qzero.lk');
form.set('password', 'qzero123');

const login = await fetch(`${base}/admin/login`, {
  method: 'POST',
  body: form,
  redirect: 'manual',
});
console.log('login POST:', login.status, login.headers.get('location'));

const session = 'qzero_admin_session=authenticated';

const dash = await fetch(`${base}/admin/dashboard`, {
  headers: { cookie: session },
});
const html = await dash.text();
console.log('dashboard auth:', dash.status);
console.log('vehicle count metric:', html.includes('Loaded vehicles') ? 'section ok' : 'missing');
console.log('shows Toyota:', html.includes('Toyota'));
console.log('shows Recent inventory:', html.includes('Recent inventory'));

const addPage = await fetch(`${base}/admin/add-vehicle`, {
  headers: { cookie: session },
  redirect: 'manual',
});
console.log('add-vehicle:', addPage.status);
