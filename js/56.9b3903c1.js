"use strict";(self["webpackChunkbattleship"]=self["webpackChunkbattleship"]||[]).push([[56],{8533:function(t,n,e){e.d(n,{$x:function(){return p},NU:function(){return i},_Q:function(){return d},_v:function(){return a},bw:function(){return g},f0:function(){return s},gg:function(){return y},gr:function(){return f},hk:function(){return v},m9:function(){return h},tV:function(){return c},zA:function(){return m}});e(7658);var r=e(8897),o=e(1084);function a(t){return new Promise((n=>setTimeout(n,t)))}function i(t){let n=!0;return Object.values(r.JY).forEach((e=>{t[e].guiCount>0&&(n=!1)})),n}function s(t){if(0===t.length)return!1;if(0===t[0].length)return!1;for(const n of t)for(const t of n)if(t.shipHitbox&&!t.contains.successfulShot)return!1;return!0}function u(t){for(const n of t)for(const t of n)if(!y(t))return!0;return!1}function c(t){if(s(t))throw new Error("Game is over, cannot make a move.");if(!u(t))throw new Error("No valid moves available.");const n=Math.floor(Math.random()*t.length),e=Math.floor(Math.random()*t[0].length);return y(t[n][e])?c(t):{row:n,col:e}}function l(t,n){const e=[];for(let a=0;a<o.y[t].length;a++)for(let i=0;i<o.y[t].width;i++)n===r.i5.HORIZONTAL&&e.push({row:i,col:a}),n===r.i5.VERTICAL&&e.push({row:a,col:i});return e}function f(t,n,e,r,o){const a=l(n,e);for(const i of a){if(i.row+r>=t.length)return!0;if(i.col+o>=t[0].length)return!0;const n=t[i.row+r][i.col+o];if(y(n))return!0;if(n.shipHitbox)return!0}return!1}function h(t,n,e,r,o){if(f(t,n,e,r,o))throw new Error("Invalid ship placement.");const a=l(n,e);for(const i of a){const e=t[i.row+r][i.col+o];e.shipHitbox=n,e.shipSprite&&(e.shipSprite.isPreview=!1)}}function p(t){const n=Object.values(r.JY);n.forEach((n=>{for(let e=0;e<o.y[n].count;e++)while(1){const e=Math.floor(Math.random()*t.length),o=Math.floor(Math.random()*t[0].length),a=Math.random()<.5?r.i5.HORIZONTAL:r.i5.VERTICAL;if(!f(t,n,a,e,o)){h(t,n,a,e,o);break}}}))}function d(t,n){for(const e of t)for(const t of e)t.shipHitbox&&t.shipHitbox===n&&(t.contains.uncoveredShip=!0)}function g(t,n,e){for(let r=n-1;r<=n+1;r++)for(let n=e-1;n<=e+1;n++){if(r<0||r>=t.length)continue;if(n<0||n>=t[0].length)continue;const e=t[r][n];y(e)||(e.shipHitbox?e.contains.uncoveredShip=!0:e.contains.missedShot=!0)}}function m(t,n,e){for(let r=n-1;r<=n+1;r++)for(let n=e-1;n<=e+1;n++)v(t,r,n)}function v(t,n,e){if(n<0||n>=t.length)return;if(e<0||e>=t[0].length)return;const r=t[n][e];y(r)||(void 0!==r.shipHitbox?r.contains.successfulShot=!0:r.contains.missedShot=!0)}function y(t){const n=t.background.isLand||t.background.isOutOfBounds||t.contains.missedShot||t.contains.successfulShot;return n}},3730:function(t,n,e){e.d(n,{Z:function(){return g}});var r=e(3396),o=e(4870),a=e(7139),i=e(9242),s=e(8327),u=e(7627),c=e(8533);const l={class:"board-wrapper"},f=["onDragenter","onDragleave","onDrop","onTouchstart","onTouchend"];var h=(0,r.aZ)({__name:"PlayerBoard",setup(t){const n=(0,u.o)();let e=null;function h(t,n,r){e=t.target,g(t,n,r)}function p(t,n,r){e===t.target&&(v(t,n,r),e=null)}function d(t){return t.background.isWater?"water":t.background.isLand?"land":t.background.isOutOfBounds?"out-of-bounds":void 0}function g(t,e,r){if(!(t.target instanceof HTMLElement))return;const o=n.currentlyDraggedShip?.name,a=n.currentlyDraggedShip?.orientation;if(!o||!a)return;const i=n.player.board;(0,c.gr)(i,o,a,e,r)||(i[e][r].shipSprite={name:o,orientation:a,isPreview:!0},t.target.classList.add("darken"))}function m(t,e,r){if(!(t.target instanceof HTMLElement))return;const o=n.currentlyDraggedShip?.name,a=n.currentlyDraggedShip?.orientation;if(!o||!a)return;const i=n.player.board;(0,c.gr)(i,o,a,e,r)||(i[e][r].shipSprite=void 0,t.target.classList.remove("darken"))}function v(t,e,r){if(!(t.target instanceof HTMLElement))return;const o=n.currentlyDraggedShip?.name,a=n.currentlyDraggedShip?.orientation;if(!o||!a)return;const i=n.player.board;(0,c.gr)(i,o,a,e,r)||((0,c.m9)(i,o,a,e,r),n.setPlayerShipGUICount(o,n.player[o].guiCount-1),t.target.classList.remove("darken"))}return(t,e)=>((0,r.wg)(),(0,r.iD)("div",l,[((0,r.wg)(!0),(0,r.iD)(r.HY,null,(0,r.Ko)((0,o.SU)(n).player.board,((t,n)=>((0,r.wg)(),(0,r.iD)("div",{key:n,class:"board-row"},[((0,r.wg)(!0),(0,r.iD)(r.HY,null,(0,r.Ko)(t,((t,o)=>((0,r.wg)(),(0,r.iD)("div",{key:o,class:"board-cell"},[(0,r._)("div",{class:(0,a.C_)(d(t)),onDragenter:t=>g(t,n,o),onDragleave:t=>m(t,n,o),onDragover:e[0]||(e[0]=(0,i.iM)((()=>{}),["prevent"])),onDrop:t=>v(t,n,o),onTouchstart:t=>h(t,n,o),onTouchend:t=>p(t,n,o)},[(0,r.Wm)(s.Z,{tile:t},null,8,["tile"])],42,f)])))),128))])))),128))]))}}),p=e(89);const d=(0,p.Z)(h,[["__scopeId","data-v-61b0d520"]]);var g=d},5778:function(t,n,e){e.r(n),e.d(n,{default:function(){return x}});e(7658);var r=e(3396),o=e(4870),a=e(7139),i=e(7627),s=e(8897),u=e(1084);const c=["id"],l={class:"secondary-text"},f={class:"secondary-text"},h={class:"secondary-text"};var p=(0,r.aZ)({__name:"ShipItem",props:{shipName:null},setup(t){const n=t,e=(0,i.o)(),p=(0,o.iH)(s.i5.HORIZONTAL),d=(0,o.iH)(null);function g(t){t.target instanceof HTMLElement&&e.setCurrentlyDraggedShip(n.shipName,p.value)}function m(t){t.target instanceof HTMLElement&&e.setCurrentlyDraggedShip(n.shipName,p.value)}function v(t){t.target instanceof HTMLElement&&(t.target.style.position="",t.target.style.left="",t.target.style.top="",t.target.style.zIndex="")}function y(){p.value===s.i5.HORIZONTAL?p.value=s.i5.VERTICAL:p.value=s.i5.HORIZONTAL}return(0,r.YP)((()=>e.currentlyDraggedShip?.name),(t=>{t===n.shipName?d.value?.classList.add("selected"):d.value?.classList.remove("selected")})),(i,s)=>(0,o.SU)(e).player[t.shipName].guiCount>0?((0,r.wg)(),(0,r.iD)("div",{key:0,id:t.shipName,class:"secondary-background"},[(0,r._)("h2",l,(0,a.zw)(t.shipName),1),(0,r._)("div",{ref_key:"svgContainer",ref:d,class:"svg-container",draggable:"true",onDragstart:g,onTouchstart:m,onTouchend:v},[(0,r.WI)(i.$slots,"default")],544),(0,r._)("span",f," Size: "+(0,a.zw)((0,o.SU)(u.y)[n.shipName].length)+" x "+(0,a.zw)((0,o.SU)(u.y)[n.shipName].width),1),(0,r._)("button",{class:(0,a.C_)(["primary-button",p.value]),onClick:y},(0,a.zw)(p.value),3),(0,r._)("span",h," Count: x"+(0,a.zw)((0,o.SU)(e).player[t.shipName].guiCount),1)],8,c)):(0,r.kq)("",!0)}}),d=e(89);const g=(0,d.Z)(p,[["__scopeId","data-v-0974f5a8"]]);var m=g,v=e(2483),y=e(3730),S=e(8533),w=e(943),b=e(9716),D=e(3567),_=e(1597),k=e(1010),T=e(5562);const H={class:"view-wrapper"},N={key:0,class:"primary-text"},O={key:1,class:"primary-text"},L={key:3,class:"gui"},C={key:0,class:"primary-text mt-5"},I={key:1,class:"primary-text mt-5"},U={class:"ship-container"};var E=(0,r.aZ)({__name:"PlaceShips",setup(t){const n=(0,i.o)(),e=(0,v.tv)(),a=(0,r.Fl)((()=>/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)));function u(){const t=JSON.parse(JSON.stringify(n.player.board)),r=JSON.parse(JSON.stringify(n.computer.board));n.$reset(),n.setPlayerBoard(t),n.setComputerBoard(r),(0,S.$x)(n.computer.board),n.setPlayerHasCurrentTurn(!0),e.push({name:"Game"})}return(t,e)=>((0,r.wg)(),(0,r.iD)("div",H,[(0,o.SU)(S.NU)((0,o.SU)(n).player)?((0,r.wg)(),(0,r.iD)("h1",N," Start Game ")):((0,r.wg)(),(0,r.iD)("h1",O," Place Your Ships ")),(0,r.Wm)(y.Z),(0,o.SU)(S.NU)((0,o.SU)(n).player)?((0,r.wg)(),(0,r.iD)("button",{key:2,onClick:u,class:"primary-button mt-5"}," Start Game ")):((0,r.wg)(),(0,r.iD)("div",L,[(0,o.SU)(a)?((0,r.wg)(),(0,r.iD)("h2",C," Tap on a ship and tap the board to place it ")):((0,r.wg)(),(0,r.iD)("h2",I," Drag a ship and drop it on the board to place it ")),(0,r._)("div",U,[(0,r.Wm)(m,{"ship-name":(0,o.SU)(s.JY).AIRCRAFT_CARRIER},{default:(0,r.w5)((()=>[(0,r.Wm)(T.Z)])),_:1},8,["ship-name"]),(0,r.Wm)(m,{"ship-name":(0,o.SU)(s.JY).SUBMARINE},{default:(0,r.w5)((()=>[(0,r.Wm)(w.Z)])),_:1},8,["ship-name"]),(0,r.Wm)(m,{"ship-name":(0,o.SU)(s.JY).DESTROYER},{default:(0,r.w5)((()=>[(0,r.Wm)(D.Z)])),_:1},8,["ship-name"]),(0,r.Wm)(m,{"ship-name":(0,o.SU)(s.JY).BATTLESHIP},{default:(0,r.w5)((()=>[(0,r.Wm)(_.Z)])),_:1},8,["ship-name"]),(0,r.Wm)(m,{"ship-name":(0,o.SU)(s.JY).FRIGATE},{default:(0,r.w5)((()=>[(0,r.Wm)(k.Z)])),_:1},8,["ship-name"]),(0,r.Wm)(m,{"ship-name":(0,o.SU)(s.JY).SUPPLY_BOAT},{default:(0,r.w5)((()=>[(0,r.Wm)(b.Z)])),_:1},8,["ship-name"])])]))]))}});const Z=(0,d.Z)(E,[["__scopeId","data-v-d02554ce"]]);var x=Z}}]);
//# sourceMappingURL=56.9b3903c1.js.map