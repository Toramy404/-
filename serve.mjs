import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'dist');
const port=Number(process.env.NIGHTREIGN_PORT||4317);
const mime={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.webmanifest':'application/manifest+json; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.avif':'image/avif','.jpg':'image/jpeg','.txt':'text/plain; charset=utf-8'};
http.createServer((req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/health'){res.writeHead(200,{'Content-Type':'application/json'});res.end(JSON.stringify({app:'nightreign-local',root,port}));return}
  let relative=decodeURIComponent(url.pathname).replace(/^\/+/,'')||'index.html';
  const file=path.resolve(root,relative);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}
  if(!['GET','HEAD'].includes(req.method)){res.writeHead(405);res.end();return}
  if(!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404);res.end('Not found');return}
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});
  if(req.method==='HEAD')res.end();else fs.createReadStream(file).pipe(res);
 }catch(e){res.writeHead(400);res.end('Bad request')}
}).listen(port,'127.0.0.1',()=>console.log('渡夜手册: http://127.0.0.1:'+port));

