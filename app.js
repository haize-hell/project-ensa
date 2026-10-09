(function () {
  "use strict";
  var key = "emberfield-player-v1";
  var outfits = {moss:"#5d8b68",sunset:"#dd8057",ocean:"#5485a4",berry:"#9b70aa"};
  var state = {volume:70,sensitivity:100,texture:240,name:"",outfit:"moss",hair:"#4c332a",eyes:"#6daaa1"};
  var views=document.querySelectorAll(".view"), volume=document.getElementById("volume"), volumeValue=document.getElementById("volume-value");
  var sensitivity=document.getElementById("sensitivity"), sensitivityValue=document.getElementById("sensitivity-value"), texture=document.getElementById("texture-size");
  var playerName=document.getElementById("player-name"), nameCount=document.getElementById("name-count"), nameError=document.getElementById("name-error");
  var hairInput=document.getElementById("hair-color"), eyeInput=document.getElementById("eye-color");
  var avatar=document.getElementById("avatar-preview"), avatarCtx=avatar.getContext("2d");
  var game=document.getElementById("game-canvas"), gameCtx=game.getContext("2d"), buffer=document.createElement("canvas"), bufferCtx=buffer.getContext("2d");
  var player={x:.5,y:.73}, keys=Object.create(null), lastFrame=0, audioContext=null;

  function load(){try{var saved=JSON.parse(localStorage.getItem(key)||"{}");Object.keys(state).forEach(function(k){if(saved[k]!==undefined)state[k]=saved[k];});}catch(e){}if(!outfits[state.outfit])state.outfit="moss";}
  function save(){try{localStorage.setItem(key,JSON.stringify(state));}catch(e){}}
  function show(name){views.forEach(function(v){v.classList.toggle("active",v.id==="view-"+name);});if(name==="customize")drawAvatar();if(name==="game"){document.getElementById("game-player-name").textContent=state.name||"PLAYER";lastFrame=0;requestAnimationFrame(loop);}window.scrollTo(0,0);}
  document.querySelectorAll("[data-go]").forEach(function(b){b.addEventListener("click",function(){show(b.getAttribute("data-go"));});});
  function syncSettings(){volume.value=state.volume;volumeValue.textContent=state.volume+"%";sensitivity.value=state.sensitivity;sensitivityValue.textContent=(state.sensitivity/100).toFixed(1)+"×";texture.value=String(state.texture);}
  volume.addEventListener("input",function(){state.volume=Number(volume.value);volumeValue.textContent=state.volume+"%";save();});
  sensitivity.addEventListener("input",function(){state.sensitivity=Number(sensitivity.value);sensitivityValue.textContent=(state.sensitivity/100).toFixed(1)+"×";save();});
  texture.addEventListener("change",function(){state.texture=Number(texture.value);save();});
  document.getElementById("test-sound").addEventListener("click",function(){if(!state.volume){window.alert("Your master volume is at 0%. Raise it to hear the test tone.");return;}try{var C=window.AudioContext||window.webkitAudioContext;if(!C)return;audioContext=audioContext||new C();if(audioContext.state==="suspended")audioContext.resume();var osc=audioContext.createOscillator(),gain=audioContext.createGain();osc.type="square";osc.frequency.value=660;gain.gain.setValueAtTime(state.volume/100*.055,audioContext.currentTime);gain.gain.exponentialRampToValueAtTime(.001,audioContext.currentTime+.16);osc.connect(gain);gain.connect(audioContext.destination);osc.start();osc.stop(audioContext.currentTime+.17);}catch(e){window.alert("Audio preview is not available in this browser.");}});
  function countName(){nameCount.textContent=playerName.value.length+" / 16";}
  playerName.addEventListener("input",countName);
  document.getElementById("name-continue").addEventListener("click",function(){var n=playerName.value.trim();if(n.length<2){nameError.textContent="Please enter at least 2 characters for your player name.";playerName.focus();return;}state.name=n;nameError.textContent="";save();document.getElementById("preview-name").textContent=n.toUpperCase();show("customize");});
  document.querySelectorAll(".swatch").forEach(function(b){b.addEventListener("click",function(){state.outfit=b.getAttribute("data-outfit");document.querySelectorAll(".swatch").forEach(function(x){x.classList.toggle("selected",x===b);});save();drawAvatar();});});
  hairInput.addEventListener("input",function(){state.hair=hairInput.value;document.querySelector(".hair-dot").style.setProperty("--dot",state.hair);save();drawAvatar();});
  eyeInput.addEventListener("input",function(){state.eyes=eyeInput.value;document.querySelector(".eye-dot").style.setProperty("--dot",state.eyes);save();drawAvatar();});
  document.getElementById("play-game").addEventListener("click",function(){show("game");setResolution();});
  function rect(c,x,y,w,h,color){c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
  function drawAvatar(){var c=avatarCtx,shirt=outfits[state.outfit]||outfits.moss,skin="#e2b18b";c.clearRect(0,0,192,224);
    rect(c,39,204,114,5,"#17211d");rect(c,59,179,27,31,"#35403b");rect(c,106,179,27,31,"#35403b");rect(c,55,203,34,9,"#4c443b");rect(c,103,203,34,9,"#4c443b");
    rect(c,51,112,89,69,shirt);rect(c,42,119,19,53,shirt);rect(c,131,119,19,53,shirt);rect(c,40,162,21,13,skin);rect(c,131,162,21,13,skin);
    rect(c,53,107,86,13,state.hair);rect(c,57,76,78,41,skin);rect(c,52,63,88,19,state.hair);rect(c,53,72,13,40,state.hair);rect(c,126,72,14,39,state.hair);rect(c,64,56,21,12,state.hair);rect(c,86,54,28,14,state.hair);rect(c,118,58,14,13,state.hair);
    rect(c,75,91,8,7,"#26342e");rect(c,112,91,8,7,"#26342e");rect(c,77,91,5,4,state.eyes);rect(c,113,91,5,4,state.eyes);rect(c,91,103,17,3,"#ad765e");rect(c,91,122,17,43,"#ffffff14");}
  function setResolution(){var size=Number(state.texture)||240;buffer.width=size;buffer.height=Math.round(size*9/16);game.width=960;game.height=540;gameCtx.imageSmoothingEnabled=false;}
  function drawTree(c,x,y,size){var u=Math.max(2,Math.floor(size/7));rect(c,x-u,y+size*.48,u*2,size*.4,"#665443");rect(c,x-u*3,y+size*.24,u*6,u*4,"#3b604b");rect(c,x-u*4,y+size*.36,u*8,u*3,"#42684f");rect(c,x-u*2,y+size*.06,u*5,u*4,"#4a7354");rect(c,x-u*2,y+size*.08,u*2,u*2,"#638361");}
  function drawPlayer(c,cx,by,size){var shirt=outfits[state.outfit]||outfits.moss,u=Math.max(2,Math.floor(size/12)),x=Math.round(cx-u*4),y=Math.round(by-size);rect(c,x+u,y+u*4,u*6,u*3,state.hair);rect(c,x+u,y+u*6,u*6,u*5,"#e2b18b");rect(c,x+u*2,y+u*8,u,u,state.eyes);rect(c,x+u*5,y+u*8,u,u,state.eyes);rect(c,x,y+u*11,u*8,u*4,shirt);rect(c,x+u,y+u*15,u*2,u*3,"#35403b");rect(c,x+u*5,y+u*15,u*2,u*3,"#35403b");rect(c,x-u*2,by+u,u*12,u,"#17211d");}
  function drawScene(){var c=bufferCtx,w=buffer.width,h=buffer.height,horizon=h*.43;c.clearRect(0,0,w,h);rect(c,0,0,w,h,"#90a89a");rect(c,0,0,w,horizon,"#7f9b9a");rect(c,0,horizon-2,w,h*.12,"#819078");rect(c,0,horizon+h*.1,w,h,"#667c5d");rect(c,w*.72,h*.12,w*.075,h*.14,"#e9c58b");
    var ridge=[.06,.11,.08,.17,.10,.06,.15,.08,.12,.07,.15,.06,.09,.13,.07,.10],unit=w/ridge.length;ridge.forEach(function(v,i){rect(c,i*unit,horizon-h*v,unit+1,h*v+2,i%3===0?"#657e73":"#71877a");if(i%4===1)rect(c,i*unit,horizon-h*v,unit*.5,h*v*.27,"#a4aa91");});
    for(var r=0;r<10;r++){var yy=horizon+h*.06+r*h*.07,rw=w*(.025+r*.095),center=w*.52,th=Math.max(1,h*.012*(1+r*.1));rect(c,center-rw,yy,rw*2,th,r%2?"#71875f":"#788b62");if(r>2)rect(c,center-rw*.16,yy,rw*.32,th,r%2?"#b3a276":"#aa986f");}
    drawTree(c,w*.15,h*.42,h*.26);drawTree(c,w*.83,h*.46,h*.21);drawTree(c,w*.68,h*.52,h*.12);
    for(var f=0;f<22;f++){var fx=(f*73+17)%w,fy=horizon+h*(.30+((f*31)%50)/100);rect(c,fx,fy,Math.max(1,w/240),Math.max(1,h/135),f%2?"#e8ca8c":"#dfaa82");}
    drawPlayer(c,w*player.x,h*player.y,h*.22);gameCtx.clearRect(0,0,960,540);gameCtx.drawImage(buffer,0,0,960,540);}
  function loop(t){if(!document.getElementById("view-game").classList.contains("active"))return;var dt=Math.min((t-(lastFrame||t))/1000,.04);lastFrame=t;var speed=.31*(state.sensitivity/100)*dt;if(keys.ArrowLeft||keys.a||keys.A)player.x-=speed;if(keys.ArrowRight||keys.d||keys.D)player.x+=speed;if(keys.ArrowUp||keys.w||keys.W)player.y-=speed;if(keys.ArrowDown||keys.s||keys.S)player.y+=speed;player.x=Math.max(.08,Math.min(.92,player.x));player.y=Math.max(.5,Math.min(.92,player.y));drawScene();requestAnimationFrame(loop);}
  window.addEventListener("keydown",function(e){if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].indexOf(e.key)>=0)e.preventDefault();keys[e.key]=true;});
  window.addEventListener("keyup",function(e){keys[e.key]=false;});window.addEventListener("blur",function(){keys=Object.create(null);});
  load();syncSettings();playerName.value=state.name;countName();hairInput.value=state.hair;eyeInput.value=state.eyes;document.querySelector(".hair-dot").style.setProperty("--dot",state.hair);document.querySelector(".eye-dot").style.setProperty("--dot",state.eyes);document.getElementById("preview-name").textContent=(state.name||"PLAYER").toUpperCase();document.querySelectorAll(".swatch").forEach(function(b){b.classList.toggle("selected",b.getAttribute("data-outfit")===state.outfit);});setResolution();drawAvatar();
})();
