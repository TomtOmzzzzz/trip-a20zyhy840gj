const P='triptest-',V=P+'19Nov2052',F=P+'fonts';
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(['./','manifest.webmanifest','icon-192.png','icon-512.png'].map(x=>new Request(x,{cache:'reload'})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.indexOf(P)===0&&x!==V&&x!==F).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
/* a weak connection must never leave a blank screen: the saved copy is shown if the network has not delivered the whole file in 3 seconds */
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 const base=new URL(self.registration.scope).pathname;if(u.origin===location.origin&&(u.pathname.indexOf(base)!==0||(!/\/test\/$/.test(base)&&u.pathname.indexOf(base+'test/')===0)||/family\.html|version\.txt/.test(u.pathname)))return;
 if(u.origin===location.origin){const key=r.mode==='navigate'?'./':r;
  const net=fetch(r.url,{cache:'no-store',credentials:'same-origin'}).then(x=>{if(!x.ok)return x;const ct=x.headers.get('Content-Type')||'text/html';return x.blob().then(b=>{const mk=()=>new Response(b,{status:200,headers:{'Content-Type':ct}});return caches.open(V).then(c=>c.put(key,mk())).then(mk,mk)})});
  e.waitUntil(net.catch(()=>{}));
  e.respondWith(caches.open(V).then(c=>c.match(key)).then(h=>{if(!h)return net;return new Promise(res=>{const t=setTimeout(()=>res(h),3000);net.then(x=>{clearTimeout(t);res(x.ok?x:h)},()=>{clearTimeout(t);res(h)})})}));}
 else if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.open(F).then(c=>c.match(r).then(h=>h||new Promise((res,rej)=>{const t=setTimeout(()=>rej(new Error('slow')),3000);fetch(r).then(x=>{clearTimeout(t);c.put(r,x.clone());res(x)},z=>{clearTimeout(t);rej(z)})}))));}
});
