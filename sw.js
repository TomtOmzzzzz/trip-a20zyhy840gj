const V='trip-18Nov0007';
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(['./','manifest.webmanifest','icon-192.png','icon-512.png'])).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==V).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin===location.origin){e.respondWith(fetch(r,{cache:'no-store'}).then(x=>{const y=x.clone();caches.open(V).then(c=>c.put(r.mode==='navigate'?'./':r,y));return x}).catch(()=>caches.match(r.mode==='navigate'?'./':r)));}
 else if(/fonts\.(googleapis|gstatic)\.com$/.test(u.hostname)){e.respondWith(caches.match(r).then(h=>h||fetch(r).then(x=>{const y=x.clone();caches.open(V).then(c=>c.put(r,y));return x})));}
});
