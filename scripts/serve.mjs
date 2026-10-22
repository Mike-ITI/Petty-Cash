import http from 'node:http';
import path from 'node:path';
import fs from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../dist');
const port=Number(process.env.PORT||5173);
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.woff2':'font/woff2'};
try{await fs.access(path.join(root,'index.html'))}catch{console.error('Build the prototype with pnpm build first.');process.exit(1)}
const server=http.createServer(async(req,res)=>{try{const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);let target=path.resolve(root,'.'+pathname);if(target!==root&&!target.startsWith(root+path.sep)){res.writeHead(403);res.end('Forbidden');return}if(pathname.endsWith('/'))target=path.join(target,'index.html');let data;try{data=await fs.readFile(target)}catch{if(path.extname(pathname)){res.writeHead(404);res.end('Not found');return}target=path.join(root,'index.html');data=await fs.readFile(target)}res.writeHead(200,{'Content-Type':types[path.extname(target)]||'application/octet-stream','Cache-Control':'no-cache','X-Content-Type-Options':'nosniff'});res.end(data)}catch{res.writeHead(400);res.end('Bad request')}});
server.on('error',error=>{console.error(error.code==='EADDRINUSE'?`The prototype may already be running at http://127.0.0.1:${port}`:error.message);process.exitCode=1});
server.listen(port,'127.0.0.1',()=>console.log(`Petty Cash prototype: http://127.0.0.1:${port}\nSample records reset on refresh. Press Ctrl+C to stop.`));
