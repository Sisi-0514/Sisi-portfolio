import {data} from './data.js';
import {renderApp} from './view.js';

function dom(tag,props,...children){
 const element=document.createElement(tag);
 for(const [key,value] of Object.entries(props||{})){
  if(key==='key')continue;
  if(key==='dangerouslySetInnerHTML'){element.innerHTML=value.__html;continue;}
  if(key.startsWith('on')&&typeof value==='function'){element.addEventListener(key.slice(2).toLowerCase(),value);continue;}
  if(key==='className'){element.className=value;continue;}
  if(key==='tabIndex'){element.tabIndex=value;continue;}
  if(key==='disabled'){element.disabled=value;continue;}
  if(value!==null&&value!==undefined)element.setAttribute(key,String(value));
 }
 for(const child of children.flat(Infinity)){if(child!==null&&child!==undefined&&child!==false)element.append(child instanceof Node?child:document.createTextNode(String(child)));}
 return element;
}
let galleryFrame=0, gallerySpeed=0, galleryTime=0, galleryElement=null;
let state={category:'events',project:'ginkgo',step:0};
function paint(){galleryStop();const focused=document.activeElement;const id=focused?.id;const label=focused?.getAttribute('aria-label');document.getElementById('root').replaceChildren(renderApp(dom,state,actions));document.body.classList.add('rendered');if(id)document.getElementById(id)?.focus({preventScroll:true});else if(label){[...document.querySelectorAll('button[aria-label]')].find(x=>x.getAttribute('aria-label')===label)?.focus({preventScroll:true});}}
function category(id){state={category:id,project:data.projects.find(p=>p.category===id).id,step:0};paint();}
const actions={category,galleryMove,galleryStop,galleryPage,galleryKey,photo:openPhoto,project:id=>{state={...state,project:id,step:0};paint();},step:i=>{state={...state,step:i};paint();},jump:id=>{category(id);document.getElementById('portfolio').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}};
paint();
function openPhoto(photo){
 const dialog=document.createElement('dialog');dialog.className='photo-dialog';
 const close=document.createElement('button');close.className='photo-close';close.textContent='×';close.setAttribute('aria-label','关闭照片');
 const image=document.createElement('img');image.src=photo.src;image.alt=photo.caption;
 const caption=document.createElement('p');caption.textContent=photo.caption;
 close.addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
 dialog.addEventListener('close',()=>{dialog.remove();document.body.style.overflow='';});
 dialog.append(close,image,caption);document.body.append(dialog);dialog.showModal();document.body.style.overflow='hidden';
}

function galleryStop(){if(galleryFrame)cancelAnimationFrame(galleryFrame);galleryFrame=0;gallerySpeed=0;galleryTime=0;}
function galleryMove(event){
 if(event.pointerType!=='mouse'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 const track=event.currentTarget;const box=track.getBoundingClientRect();
 const position=((event.clientX-box.left)/box.width-.5)*2;
 gallerySpeed=Math.abs(position)<.25?0:Math.sign(position)*(Math.abs(position)-.25)*520;
 galleryElement=track;if(!gallerySpeed){galleryStop();return;}
 if(!galleryFrame)galleryFrame=requestAnimationFrame(galleryTick);
}
function galleryTick(time){
 if(!galleryElement?.isConnected){galleryStop();return;}
 const dt=galleryTime?Math.min((time-galleryTime)/1000,.05):.016;galleryTime=time;
 galleryElement.scrollLeft+=gallerySpeed*dt;
 galleryFrame=requestAnimationFrame(galleryTick);
}
function galleryPage(direction){galleryStop();const track=document.getElementById('moments-track');track?.scrollBy({left:direction*track.clientWidth*.75,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});}
function galleryKey(event){if(event.target!==event.currentTarget)return;if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();galleryPage(event.key==='ArrowRight'?1:-1);}}
