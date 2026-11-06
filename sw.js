// service worker do app Defensivos Sucupira — rede primeiro, cache se estiver sem internet
const C='defensivos-suc';
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(['./','index.html','manifest.webmanifest','icon-192.png','icon-512.png'])));self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil(self.clients.claim());});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url); if(u.origin!==location.origin) return;
  if(u.pathname.endsWith('versao.json')) return;           // sempre da rede
  e.respondWith(fetch(r,{cache:'no-store'}).then(resp=>{ if(resp.ok){const cp=resp.clone(); const key=(r.mode==='navigate')?'index.html':r; caches.open(C).then(c=>c.put(key,cp));} return resp; })
    .catch(()=>caches.match(r.mode==='navigate'?'index.html':r,{ignoreSearch:true}).then(m=>m||caches.match('index.html'))));
});