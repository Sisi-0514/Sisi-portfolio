import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
let css=read('src/style.css').replaceAll("url('/assets/","url('assets/");
const data=read('src/data.js').replace('export const data','const data');
const view=read('src/view.js').replace(/^import .*;\s*$/gm,'').replace('export function renderApp','function renderApp');
const main=read('src/main.js').replace(/^import .*;\s*$/gm,'');
let page=read('index.html').replace('<link rel="stylesheet" href="src/style.css">',()=>'<style>'+css+'</style>').replace('<script type="module" src="/src/main.js"></script>',()=>'<script>'+data+'\n'+view+'\n'+main+'</script>');
const mime={'.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webp':'image/webp','.pdf':'application/pdf','.svg':'image/svg+xml'};
const used=[];
for(const ref of new Set(page.match(/assets\/[\w.-]+/g)||[])){
 const file=path.join(root,'public',ref);
 if(!fs.existsSync(file))throw new Error('Missing media: '+ref);
 page=page.replaceAll(ref,'data:'+(mime[path.extname(file)]||'application/octet-stream')+';base64,'+fs.readFileSync(file).toString('base64'));
 used.push(ref);
}
if(page.includes('type="module"')||page.includes('assets/'))throw new Error('Unbundled dependency');
fs.mkdirSync(path.join(root,'dist'),{recursive:true});
fs.writeFileSync(path.join(root,'dist/index.html'),page);
if(process.argv.includes('--local-copy'))fs.writeFileSync(path.join(root,'../王镭澌_个人网站_全新V3.html'),page);

console.log(JSON.stringify({embeddedAssets:used.length,bytes:Buffer.byteLength(page),output:'dist/index.html'}));
