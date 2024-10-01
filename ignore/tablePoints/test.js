

/*

http://www.howardgrubb.co.uk/athletics/index.html
age-factors piste  2014: http://www.howardgrubb.co.uk/athletics/wmatnf14.html
age-factors route  2015: http://www.howardgrubb.co.uk/athletics/wmaroad15.html
age-factors marche 2018: http://www.howardgrubb.co.uk/athletics/wmawalk18.html
http://cheshireaa.com/statistics/CEscoring.htm

*/

var Erreur1 = "Y'a un problème !";
var Erreur2 = "Veuillez entrer au moins une perf puis recommencer.";
var Erreur3 = "Tables ou coefficients inconnus pour cette épreuve.\n";
    Erreur3+= "Vérifiez la catégorie, le sexe, voir le type.";

function txt2perf(txt,epr){
/*

   Convertit une perf "txt", au format texte, en nombre (réel). Il
   s'agit de mètres, de points ou de secondes suivant l'épreuve
   "epr". Ne tient pas compte de la correction temps manuel/électrique
   s'il s'agit d'un temps. Renvoie NaN s'il y a un problème, par
   exemple si "txt" est vide.

   Ex: txt2perf("2'08''44","800m-M-i") -> 128.44
       txt2perf("5m11","longueur-F") -> 5.11
       txt2perf("3600 pts","decathlon-M") -> 3600
*/
   var perf = new String(txt);
   if(perf.length == 0) return NaN;
   perf = perf.replace(/ /g,"");  // supprime tous les espaces
   perf = perf.replace(/’/g,"'"); // remplace apostrophe (’) par quote (')

   // si perf=distance ou nombre de points

   if(!is_time(epr)){
    perf = perf.replace("pts","");
    perf = perf.replace("p","");
    return Number(perf.replace(/[m,]/,"."));
    }

   // si perf=temps

   var t = new Number(0); // t=perf en secondes
   var pos = perf.indexOf("h",0); // heures
   if(pos>0){
      t += 3600*Number(perf.substring(0,pos));
      perf = perf.substring(pos+1,perf.length);
      }

   var p = new Number(2);
   pos = perf.indexOf("''",0); // centièmes
   if(pos<0){ pos = perf.indexOf(".",0); p=1; }
   if(pos<0){ pos = perf.indexOf(",",0); p=1; }
   if(pos<0){ pos = perf.indexOf('"',0); p=1; } // double quote
   if(pos>0){
      p = String(perf.substring(pos+p,perf.length));
      if(p.length==1) p += "0";
      t += Number(p)/100;
      perf = perf.substring(0,pos); // le reste
      }

   pos = perf.indexOf("'",0); // minutes
   if(pos<0) pos = perf.indexOf(":",0);
   if(pos>0){
      t += 60*Number(perf.substring(0,pos));
      perf = perf.substring(pos+1,perf.length); // le reste
     }

   return (t + Number(perf)); // ici forcément un nombre
}

function perf2txt(perf,epr){
/*

   Convertit une "perf" (nombre réel représentant des mètres, des
   secondes ou des points, suivant l'épreuve "epr") en performance au
   format texte et arrondi au centième, centimètre ou nombre de points
   le plus proche.

   Ex: perf2txt(3.319,"longueur-F") -> "3m32"
   Ex: perf2txt(5000,"decathlon-M") -> "5 000 pts"

*/
   var txt = new String("");
   var mm = new Number(0);
   var hh = new Number(0);

   // si perf = nombre (de points)

   if(is_pts(epr)){
      mm = Math.round(perf); // arrondi au plus proche
      hh = mm%1000;
      if(mm>=1000) txt = String(Math.floor(mm/1000)) + " ";
      if(hh<100) txt += "0";
      if(hh<10)  txt += "0";
      return (txt + String(hh) + " pts");
   }

   // si perf = distance (en mètres)

   if(!is_time(epr)){
      mm = Math.round(100*perf); // arrondi au centimètre le plus proche
      hh = mm%100;
      txt = String(Math.floor(mm/100)) + "m";
      if(hh<10) txt += "0";
      return (txt + String(hh));
   }

   // si perf = temps (en secondes)

   perf = Math.round(100*perf); // arrondi au centième le plus proche
   hh = Math.floor(perf/360000); // heures
   if(hh>0) txt = hh + "h";
   perf %= 360000;

   mm = Math.floor(perf/6000); // minutes
   if((txt.length>0)&&(mm<10)) txt += "0";
   if((txt.length>0)||(mm>0)) txt += mm + "'";
   perf %= 6000;

   mm = Math.floor(perf/100); // secondes
   if((txt.length>0)&&(mm<10)) txt += "0";
   txt += mm + "''";
   if(hh>0) return txt; // si > 1h, alors pas de centièmes

   mm = perf%100; // centièmes
   if(mm<10) txt += "0";

   return (txt + String(mm));
}

function round(perf,n,dist){
/*

   Renvoie le nombre "perf" arrondie à 10^-n près inférieurement si
   "dist" est vrai (cas d'une distance ou d'un nombre de points) ou
   supérieurement si "dist" est faux (cas d'un temps).

   Ex: round(12.345, 2,true) -> 12.34   round(12.345, 2, false) -> 12.35
       round(12.345, 1,true) -> 12.3    round(12.345, 1, false) -> 12.4
       round(12.345, 0,true) -> 12      round(12.345, 0, false) -> 13
       round(12.345,-1,true) -> 10      round(12.345,-1, false) -> 20
       round(12.345,-2,true) -> 0       round(12.345,-2, false) -> 100

*/
   var x = new Number(Math.pow(10,-n));
   return dist? x*Math.floor(perf/x) : x*Math.ceil(perf/x);
}

function tps_man(txt,epr){
/*

   Renvoie la correction (en seconde) d'une performance "txt" (au
   format texte) correspondant à un temps manuel dans une épreuve
   "epr". La valeur renvoyée est 0.0, 0.14 ou 0.24. Le principe de la
   compensation n'est valable que si la distance est <= 400m (stade ou
   salle). La compensation est de +0"24 sauf si le départ est au
   niveau de l'arrivée, dans ce cas c'est 0"14. Au-delà de 400m, il
   n'y a pas de compensation.

   Ex: tps_man("48.5","400mh-M")  -> 0.14
       tps_man("48.50","400mh-M") -> 0.0
       tps_man("48.5","200m-M-i") -> 0.14
       tps_man("14m56","poids-M") -> 0.0

    stade: 80mh, 100m(h), 110mh, 200m, 300m(h), 320mh -> +0.24
    stade: 400m(h), 4x100m -> +0.14

    salle: 50m(h), 55m(h), 60m(h) -> +0.24
    salle: 200m, 400m -> +0.14

    sinon: -> 0.0

*/
   if(!/[.,"'][0-9]$/.test(txt)) return 0.0; // doit être un temps manuel
   if(/^[0-9]{2}m/.test(epr)) return 0.24; // < 100m: 50m,55m,60m,55mh,60mh,80mh
   if(!/^[0-9]{3}m/.test(epr)) return 0.0; // doit être du type: xxxm
   if(/^((400m)|(200m.*-i$))/.test(epr)) return 0.14; // 400m,400mh,400m-i ou 200m-i
   if(/^4x100m$/.test(epr)) return 0.14; // 4x100m
   if(/^[123][012]0m/.test(epr)) return 0.24; // 100m(h),110mh,200m,300m(h),320mh
   return 0.0;
}

function is_jump(epr){
/*

   Renvoie vrai ssi l'épreuve "epr" est un saut.

   Pour pouvoir utiliser les coefficients de la table EC[], il faut
   que la performance soit exprimée en secondes, en mètres ou en
   centimètres s'il s'agit d'un saut.

*/
   return /(longueur)|(hauteur)|(triple)|(perche)/.test(epr);
}

function is_pts(epr){
/*

   Renvoie vrai ssi les performances de l'épreuve "epr" est un nombre
   de points, c'est-à-dire s'il s'agit d'une épreuve combinée.

*/
   return /(athlon)|(alancer)/.test(epr);
}

function is_time(epr){
/*

   Renvoie vrai si les performances de l'épreuve "epr" sont des temps
   (courses), et faux sinon, c'est-à-dire que faux est renvoyé s'il
   s'agit d'une distance ou d'un nombre points.

   Deux autres façons de faire sont de tester: (1) si le dernier
   coefficient WMA[epr][(WMA[epr].length)-1]<1; ou (2) si
   IAAF[epr][2]<0. Mais cela marche seulement si "epr" est dans la
   table WMA[] ou IAAF[].

*/
   if(is_jump(epr)||is_pts(epr)) return false; 
   if(/(poids)|(disque)|(marteau)|(javelot)|(mlourd)/.test(epr)) return false;
   return true;
}

function is_iaaf_sec(epr){
/*

   Renvoie vrai ssi l'épreuve "epr" est une course dont la perf doit
   être exprimée en seconde pour utiliser les coefficients de la table
   IAAF[].

   Les coefficients de la table IAAF[] sont donnés pour des perfs en
   centièmes, secondes, mètres ou points. Pour les courses, il peut
   s'agir de centièmes ou de secondes notamment pour les épreuves de
   marche et de course sur route. Comme la perf dans le formulaire est
   toujours exprimées en secondes, il faut donc multiplier par 100 la
   perf dans certains cas.

*/
  return /(mm-)|(km-)|(marathon)|(10miles)/.test(epr);
}

function in_array(A,B,epr,i){
/*

   Renvoie faux si:
   - epr n'est pas une épreuve de A[]
   - epr n'est pas une épreuve de B[] et i>0
   - epr est dans B[] mais i n'est pas dans B[epr] et i>0
   et vrai sinon.

*/
   if(!(epr in A)) return false;
   if(i==0) return true;
   if(!(epr in B)) return false;
   if(!(i in B[epr])) return false;
   return true;
}

function is_perf(txt,epr){
/*

   Renvoie vrai (=true) ssi "txt" est une performance pour l'épreuve
   "epr". Utilisée dans make_table().

*/
  var x = new Number(txt2perf(txt,epr));
  return (!isNaN(x)) && (x>=0);
}

function wma_ec_pts(txt,epr,i){
/*

   Donne le nombre de points en épreuve combinée d'une perf "txt" (au
   format texte) pour l'épreuve "epr" dans la catégorie "i" (= indice
   de la catégorie, i=0 pour toute catégorie). Le temps manuel est
   détecté et corrigé. Dans la table EC[], les perfs doivent être en
   secondes, mètres ou centimètres s'il s'agit d'un saut. Utilise les
   tables WMA[] et EC[].

   Ex: wma_ec_pts("7.4","60m-M-i",1);

   NB: Attention aux erreurs d'arrondi, alert(100*2.03) donnant
   202.99999999999997 et pas 203. Cela pose problème pour un saut en
   hauteur à 2m03 car pour le calcul des points on doit faire
   100*coef*perf, arrondir inférieurement à cause du coefficient wma
   coef, avant d'appliquer les coefficients des épreuves combinées.

*/
   if(!in_array(EC,WMA,epr,i)){ alert(Erreur3); return "-"; } // erreur
   var coef = (i==0)? 1 : WMA[epr][i]; // coef WMA
   var dist = !is_time(epr); // temps ?
   var perf = Math.round(100*(txt2perf(txt,epr)+tps_man(txt,epr)));
   perf = round(coef*perf,0,dist); // arrondit la perf
   if(!is_jump(epr)) perf /= 100; // sauf si saut
   if(isNaN(perf)||(perf<0)) return "-"; // erreur: perf incorrecte

   var A = new Number(EC[epr][0]);
   var B = new Number(EC[epr][1]);
   var C = new Number(EC[epr][2]);

   perf=(dist)? Math.max(perf,C) : Math.min(perf,C);
   var pts = Math.floor(A*Math.pow(Math.abs(perf-C),B));
   return Math.min(Math.max(pts,0),1400);
}

function wma_ec_perf(txt,epr,i){
/*

   Retourne une perf au format texte d'après un nombre de points "txt"
   d'une épreuve combinée, une épreuve "epr" et un indice de catégorie
   "i" (i=0 pour Senior). Utilise les tables WMA[] et EC[].

   Ex: wma_ec_perf("500","longueur-M",0);

*/
   if(!in_array(EC,WMA,epr,i)) { alert(Erreur3); return "-"; } // erreur
   var coef = (i==0)? 1 : WMA[epr][i]; // coef WMA
   var pts = Math.min(Math.max(Number(txt),0),1400); // nb de points
   var dist = !is_time(epr); // temps ?

   var A = new Number(EC[epr][0]);
   var B = new Number(EC[epr][1]);
   var C = new Number(EC[epr][2]);

   var perf = Math.pow(pts/A,1/B);
   perf = (dist)? perf+C : C-perf;
   if(is_jump(epr)) perf /= 100; // si saut
   perf = round(perf/coef,2,dist); // deux chiffres significatifs
   return isNaN(perf)? "-" : perf2txt(perf,epr);
}

function wma_iaaf_pts(txt,epr,i){
/*

   Comme wma_ec_pts(txt,epr,i), mais utilise la table IAAF[] (et un
   calcul différent) au lieu de la table EC[] des épreuves combinées.

   Ex: wma_iaaf_pts("7.4","60m-M-i",1);

*/
   if(!in_array(IAAF,WMA,epr,i)) { alert(Erreur3); return "-"; } // erreur
   var coef = (i==0)? 1 : WMA[epr][i]; // coef WMA
   var dist = !is_time(epr); // temps ?
   var perf = coef * (txt2perf(txt,epr)+tps_man(txt,epr));
   perf = round(perf,2,dist); // arrondie la perf en fonction de dist
   if(!is_iaaf_sec(epr) && !is_pts(epr)) perf *= 100; // convertit en centième/centimètre
   if(isNaN(perf)||(perf<0)) return "-"; // erreur: perf incorrecte

   var A = new Number(IAAF[epr][0]);
   var D = new Number(IAAF[epr][1]);
   var B = new Number(IAAF[epr][2]);
   var C = new Number(IAAF[epr][3]);

   if((B<0)&&(perf+B>=0)) return 0; // perf plancher pour les courses
   var pts = Math.floor( A*(perf+B)*(perf+B)/Math.pow(10,D) + C );
   return Math.min(Math.max(pts,0),1400);
}

function wma_iaaf_perf(txt,epr,i){
/*

   Comme wma_ec_perf(txt,epr,i), mais utilise la table IAAF[], et un
   calcul différent, au lieu de la table EC[] des épreuves combinées.

   Ex: wma_iaaf_perf("500","longueur-M",0);

*/
   if(!in_array(IAAF,WMA,epr,i)) { alert(Erreur3); return "-"; } // erreur
   var coef = (i==0)? 1 : WMA[epr][i]; // coef WMA
   var pts = Math.min(Math.max(Number(txt),0),1400); // nb de points
   var dist = !is_time(epr); // temps ?

   var A = new Number(IAAF[epr][0]);
   var D = new Number(IAAF[epr][1]);
   var B = new Number(IAAF[epr][2]);
   var C = new Number(IAAF[epr][3]);

   var x = Math.sqrt(Math.pow(10,D)*(pts-C)/A);
   x = (B<0)? -x-B : x-B;
   if(!is_iaaf_sec(epr) && !is_pts(epr)) x /= 100;
   x = round(x/coef,2,dist); // deux chiffres significatifs
   return isNaN(x)? "-" : perf2txt(x,epr);
}

function Somme(doc,v,i,j){
/*
   Calcule des valeurs des variables doc.v<k> dont
   l'indice <k> va de i à j.
*/
   if(i>j) return 0;
   var s=new Number(0);
   for(;i<=j;i++) s += Number(doc[v+""+i].value);
   return s;
}

function NomEpr(txt){
/*

   Prend un nom d'épreuve standard ("longueur-M-i", ...) et le
   convertit en nom "joli" pour les épreuves combinées:
   - 1ère lettre en majuscule
   - suppression du "-i" et du "-M"
   - ajoût d'un espace pour les milliers ("1 500m")

*/
   var s=txt;
   s=s.replace(/-i$/,""); // supprime le "-M" et "-i" final
   s=s.replace(/-(F|M)$/,""); // supprime le "-M" (forcément final)
   s=s.replace(/^1000m/,"1 000m");
   s=s.replace(/^1500m/,"1 500m");
   return s.substring(0,1).toUpperCase() + s.slice(1); // 1ère lettre en maj
}
