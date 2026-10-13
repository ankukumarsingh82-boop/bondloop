const K='bondloop:v1',$=id=>document.getElementById(id),DAY=864e5;
const PROMPTS=['What made you smile today?','What is something small you are looking forward to?','What did you learn this week?','Who helped you recently?','What song is stuck in your head?','What is one thing you want to try this month?','What drained you today, and what recharged you?'];
const STARTERS=["Ask {n} what they've been enjoying lately — no pressure, just curiosity.","Share a funny moment from your day and ask {n} for theirs.","Ask {n} for a recommendation: a song, show, or snack.","Tell {n} you noticed they've been quiet and that you're around if they want to chat.","Invite {n} to a quick walk or call this week.","Ask {n} what the best part of their week has been so far."];
const seed=()=>({members:['Aarav','Meera','Kabir','Zoya','Ishaan'],posts:[{who:'Aarav',text:'Finished my first 5k run!',t:Date.now()-DAY*0.2},{who:'Meera',text:'Exam prep is intense, but chai helps.',t:Date.now()-DAY*1},{who:'Kabir',text:'Learned some guitar chords.',t:Date.now()-DAY*1.5},{who:'Aarav',text:'Movie night with cousins.',t:Date.now()-DAY*2}]});
let s=JSON.parse(localStorage.getItem(K)||'null')||seed();const save=()=>localStorage.setItem(K,JSON.stringify(s));
const dayIdx=Math.floor(Date.now()/DAY);$('prompt').textContent=PROMPTS[dayIdx%PROMPTS.length];
s.members.forEach(m=>$('who').add(new Option(m)));
// Offline "AI" heuristic: members with no check-in in last 2 days are quiet. Swap suggest() for an LLM call later.
function suggest(n,i){return STARTERS[(n.length+dayIdx+i)%STARTERS.length].replace('{n}',n)}
function render(){$('feed').innerHTML='';s.posts.slice().sort((a,b)=>b.t-a.t).forEach(p=>{const d=document.createElement('p');d.innerHTML='<b></b>: <span></span> <small></small>';d.querySelector('b').textContent=p.who;d.querySelector('span').textContent=p.text;d.querySelector('small').textContent=new Date(p.t).toLocaleString();$('feed').appendChild(d)});
const quiet=s.members.filter(m=>!s.posts.some(p=>p.who===m&&Date.now()-p.t<2*DAY));$('ice').innerHTML=quiet.length?'':'<p>Everyone has checked in recently 🎉</p>';quiet.forEach((m,i)=>{const d=document.createElement('div');d.className='ice';d.textContent=`💬 ${suggest(m,i)}`;$('ice').appendChild(d)})}
$('post').onclick=()=>{const t=$('txt').value.trim();if(!t)return;s.posts.push({who:$('who').value,text:t,t:Date.now()});$('txt').value='';save();render()};
$('reset').onclick=()=>{localStorage.removeItem(K);location.reload()};render();
