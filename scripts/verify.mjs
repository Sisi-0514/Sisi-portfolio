import assert from 'node:assert/strict';
import fs from 'node:fs';
import {data} from '../src/data.js';
import {renderApp} from '../src/view.js';
const h=(tag,props,...children)=>({tag,props:props||{},children:children.flat(Infinity)});
function walk(n){if(!n||typeof n!=='object')return [];return [n,...n.children.flatMap(walk)];}
let calls=[];const actions={category:x=>calls.push(['category',x]),project:x=>calls.push(['project',x]),step:x=>calls.push(['step',x]),jump:x=>calls.push(['jump',x])};
let checked=0;let urls=new Set();
for(const p of data.projects){
 assert(p.steps.length>0);
 for(let i=0;i<p.steps.length;i++){
 const nodes=walk(renderApp(h,{category:p.category,project:p.id,step:i},actions));
 const ids=nodes.filter(n=>n.props.id).map(n=>n.props.id);assert.equal(new Set(ids).size,ids.length);
 assert.equal(nodes.filter(n=>n.props.role==='tab'&&n.props['aria-selected']===true).length,3);
 for(const n of nodes){
  if(n.props['aria-controls'])assert(ids.includes(n.props['aria-controls']));
  if(n.props['aria-labelledby'])assert(ids.includes(n.props['aria-labelledby']));
  if(n.props.href?.startsWith('#'))assert(ids.includes(n.props.href.slice(1)));
  if(n.tag==='img')assert(fs.existsSync('public/'+n.props.src));
  if(n.props.dangerouslySetInnerHTML){for(const match of n.props.dangerouslySetInnerHTML.__html.matchAll(/href="([^"]+)"/g))urls.add(match[1]);}
 }
 const cats=nodes.filter(n=>n.props.role==='tab'&&n.props.id.startsWith('category-'));
 cats[0].props.onClick();assert.deepEqual(calls.pop(),['category','events']);
 const next=nodes.find(n=>n.props['aria-label']==='下一步');assert.equal(next.props.disabled,i===p.steps.length-1);
 if(!next.props.disabled){next.props.onClick();assert.deepEqual(calls.pop(),['step',i+1]);}
 const prev=nodes.find(n=>n.props['aria-label']==='上一步');assert.equal(prev.props.disabled,i===0);
 checked++;
 }
}
assert.equal(checked,38);
for(const suffix of ['UutHnjwhNnzzNoxPErxbnw','De6rIt4T7e3bz3pLt0d3XQ','P9HAmV3qSWKb8VOtGsL5tA'])assert([...urls].some(u=>u.endsWith(suffix)));
assert(![...urls].some(u=>u.includes('18-m2vv0')));
console.log('PASS: '+checked+' workflow states across '+data.projects.length+' projects; all 3 tab levels, IDs, relationships, navigation bounds and evidence links. React build/browser layout not exercised.');
