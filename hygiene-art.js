/* MARICICA • obiecte si cosulete ilustrate 3D pastel, culori exacte fara filtre CSS. */
(function(){
'use strict';
const colors={
 red:{base:'#f46887',light:'#ffc4d2',shine:'#ffe9ef',mid:'#fb91ac',dark:'#ba385c',shade:'#873455',name:'Roșu'},
 yellow:{base:'#ffc34b',light:'#fff2a5',shine:'#fffbe2',mid:'#ffdc77',dark:'#c18c23',shade:'#a77826',name:'Galben'},
 blue:{base:'#4caef2',light:'#c2edff',shine:'#edfbff',mid:'#85d2ff',dark:'#2676ba',shade:'#205b91',name:'Albastru'},
 purple:{base:'#cd8ce9',light:'#f1d4ff',shine:'#fbf1ff',mid:'#e8b9fa',dark:'#9458b7',shade:'#69407f',name:'Mov'}
};
function frame(type,color,markup){
 const p=colors[color]||colors.blue;
 const id='mha-'+type+'-'+color;
 return '<svg class="hg-art-svg hg-art-'+type+' hg-art-'+color+'" viewBox="0 0 220 190" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><defs>'+
 '<linearGradient id="'+id+'-body" x1=".03" y1="0" x2=".92" y2="1"><stop stop-color="'+p.shine+'"/><stop offset=".22" stop-color="'+p.light+'"/><stop offset=".58" stop-color="'+p.base+'"/><stop offset=".87" stop-color="'+p.mid+'"/><stop offset="1" stop-color="'+p.dark+'"/></linearGradient>'+
 '<linearGradient id="'+id+'-deep" x1="0" y1="0" x2=".84" y2="1"><stop stop-color="'+p.mid+'"/><stop offset=".6" stop-color="'+p.base+'"/><stop offset="1" stop-color="'+p.dark+'"/></linearGradient>'+
 '<linearGradient id="'+id+'-metal" x1="0" y1="0" x2=".4" y2="1"><stop stop-color="#fff"/><stop offset=".36" stop-color="#dfe7ed"/><stop offset=".67" stop-color="#a3c0d0"/><stop offset="1" stop-color="#eef8fd"/></linearGradient>'+
 '<radialGradient id="'+id+'-light"><stop stop-color="#fff" stop-opacity=".88"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>'+
 '<filter id="'+id+'-shadow" x="-40%" y="-40%" width="180%" height="200%"><feGaussianBlur stdDeviation="5"/></filter>'+
 '</defs><ellipse cx="111" cy="171" rx="74" ry="12" fill="#72577d" opacity=".17" filter="url(#'+id+'-shadow)"/>'+markup.replaceAll('%BODY%','url(#'+id+'-body)').replaceAll('%DEEP%','url(#'+id+'-deep)').replaceAll('%METAL%','url(#'+id+'-metal)').replaceAll('%LIGHT%','url(#'+id+'-light)').replaceAll('%BASE%',p.base).replaceAll('%DARK%',p.dark).replaceAll('%SHINE%',p.shine).replaceAll('%MID%',p.mid)+'</svg>';
}
/* Ilustrații 3D aprobate: 12 obiecte decupate logic din planșa 3×4.
   Fără filtre de recolorare și fără imagini vectoriale de substituție. */
function sprite(kind,color='blue'){
 const c={red:0,yellow:1,blue:2}[color]??2;
 const row={basket:0,soap:1,brush:2,towel:3}[kind];
 if(row===undefined){
  return '<span class="hg-photo-sprite hg-photo-comb"><img src="assets/cinema/comb.webp" alt="" draggable="false"></span>';
 }
 const x=['0%','50%','100%'][c];
 const y=['0%','33.333333%','66.666667%','100%'][row];
 return '<span class="hg-photo-sprite hg-photo-'+kind+' hg-photo-'+color+'" style="--hg-sprite-x:'+x+';--hg-sprite-y:'+y+';" aria-hidden="true"></span>';
}
function object(kind,color='blue'){return sprite(kind,color)}
function basket(color){return sprite('basket',color)}
window.MaricicaHygieneArt={object,basket,colors,version:'3.0'};
})();