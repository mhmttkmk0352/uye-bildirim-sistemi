//var site_url = "https://www.test.com";

var httpPORT = 1546;
var httpsPORT = 546;
var site_url = ["https://test1.test.com", "https://test2.test.com"];
var secilenSite = 0;
var idHavuzu = {}; //Kullanici id de?erlerinin biriktirildi?i havuz
var sidHavuzu = {}; // socket.id'leri kullanici id'lerinin e?le?tirildi?i havuz
var saldiriTespitHavuzu = [];
var token = "11111-1111-11111-1111-111111111111111"; //Token de?eri di?aridan gelen post isteklerini engellemek iÃ§in konuldu.


    let filtreler = {
         XSS:["/script", "<script"],
         SQL_INJECTION:["order by", "order+by", "union select","union+select", "from information_schema", "from+information_schema"],
         BLIND_SQL_INJECTION :["and 1=2", "and 1=1", "and+1=1", "and+1=2" ,"and false", "and+false", "and+true"],
         LFI_INJECTION : ["/etc/passwd","/proc/self/environ","/etc/named.conf","/etc/shadow"],
         RCE : ["&& ls", "&& cat", "&& ln", "&& tac", "&& more","&&+ls", "&&+cat", "&&+ln", "&&+tac", "&&+more", "&& less", "&&+less"]
    }



const fs = require("fs");
const urlencode = require("urlencode");
const MongoClient = require("mongodb").MongoClient;

const cert = fs.readFileSync('../sslverisi/CER-CRT-Files/test_test_com.crt');
const ca = fs.readFileSync('../sslverisi/CER-CRT-Files/My_CA_Bundle.ca-bundle');
const key = fs.readFileSync('../sslverisi/ek/test.test.com.key');


let httpsOptions = {
    cert: cert,
    ca:ca,
    key:key
}


const md5 = require("md5-js");
const base64 = require("js-base64").Base64;


function sifrele(d){
    return md5("test"+base64.encode(md5(d+"mehmettokmak")));
}
function c(d){
    
    //console.log(d);
    
}
function kb(m, d){
    if(d && typeof d === "object"){
        c(m + (Object(JSON.stringify(d)).length/1024).toFixed(1)+ " KB");       
    }
    
}

function cc(d){
    
    c("--------------------------------------------------------------------");
    c(d);
    c("--------------------------------------------------------------------");

}
function ci(){

    
    c("Ba?li Socket Sayisi: "+ io.engine.clientsCount);
    c("sidHavuzu sayisi: "+Object.keys(sidHavuzu).length);
    c("Fark: "+(io.engine.clientsCount-Object.keys(sidHavuzu).length));
    kb("SidHavuzu Toplam Length: ",sidHavuzu);
    

}
function us(){

    
    c("Uye sayisi: "+Object.keys(idHavuzu).length);
    kb("idHavuzu Toplam Length: ",idHavuzu);
    

}
function sifirKoy(d){
    if (d<10){
       return "0"+d;
    }
    else{
       return d;
    }
}


function kullaniciCevrimDurumPost(uyeid, durum){
    if (site_url && site_url != "" && site_url.length>0){
        
        site_url.forEach(function(siteadresi, k){
            var url  = siteadresi+"/callback/ilansahibicevrimdurumu?id="+uyeid+"&cevrimdurum="+durum+"&token="+token;
            request(url, function(error, response, html){
                if (!error && response.statusCode == 200){
                    //console.log(html);
                }
            });       
        });

    }

}




const bodyparser = require("body-parser");
const express = require("express");
const app = express();
const http = require("http");
const https = require("https");
const redirectHttps = require("redirect-https");
const request = require("request");
const sleep = require("util").promisify(setTimeout);
var ip = require("ip");


app.use(bodyparser.urlencoded({extended:true}));

let redirectOptions = {port: httpsPORT}
httpServer=http.createServer(redirectHttps(redirectOptions));
server = https.createServer(httpsOptions, app);

const io = require("socket.io").listen(server);


httpServer.listen(httpPORT, function(){
    console.log("HTTP - PORT "+httpPORT+" Dinleme");
});
server.listen(httpsPORT, function(){
    console.log("SSL "+httpsPORT+" dinlemede");
});



MongoClient.connect("mongodb://mdb_admin:neSmUvcflavqOA5y@localhost", {"useNewUrlParser": true}, function(mdberr, mdbres){
        if (mdberr){
            c("MongoDB Ba?lanti Hatasi");
            c(mdberr);
            return false;
        }
        console.log("MongoDB baglantisi basarili.");

        var vt = mdbres.db("saldiritespit");
        var gu_vt = mdbres.db("guncelurunler");

        io.on("connection", function(s){

            if(!sidHavuzu[s.id]){
                sidHavuzu[s.id] = {}
            }

        function mongoGuncelUrunKayit(data){
            console.log("BurasÄ± mongoGuncelUrunKayit() fonksiyonu: ");
            console.log(data);

            if (data && data.productID && data.productID != ""){

                gu_vt.collection("urunlistesi").findOne({id: data.productID}, function(ulerr, ulres){
                    var suan = new Date().getTime();
                    if (ulres){
                 
                        gu_vt.collection("urunlistesi").updateOne({id: data.productID}, {$set: {tarih: suan}});
                    }else{
                        gu_vt.collection("urunlistesi").insertOne({id: data.productID, tarih: suan}, function(err,res){
        
                        });
                    }
                });

            }            
        } 

        function mongoKaldirilanUrunKayit(data){
            console.log("BurasÄ± mongoKaldirilanUrunKayit() fonksiyonu: ");
            console.log(data);

            if (data && data.productID && data.productID != ""){

                gu_vt.collection("kaldirilanurunlistesi").findOne({id: data.productID}, function(ulerr, ulres){
                    var suan = new Date().getTime();
                    if (ulres){
                 
                        gu_vt.collection("kaldirilanurunlistesi").updateOne({id: data.productID}, {$set: {tarih: suan}});
                    }else{
                        gu_vt.collection("kaldirilanurunlistesi").insertOne({id: data.productID, tarih: suan}, function(err,res){
        
                        });
                    }
                });

            }            
        } 


        function o_sayfaya_bagli_herkesin_sayfasina_gonder(data, emit_adi){
            console.log("Burasi o_sayfaya_bagli_herkesin_sayfasina_gonder() fonksiyonu:");
            console.log(data);
            mongoGuncelUrunKayit(data);

            if (sidHavuzu && sidHavuzu != "" && typeof sidHavuzu === "object" && Object.keys(sidHavuzu).length>0){
                for (sid in sidHavuzu){
                    if (sid && sid != ""){
                        if (sidHavuzu[sid].sepet && sidHavuzu[sid].sepet != "" && data.sayfa == sidHavuzu[sid].sayfa){
                            console.log("Sepet var. ÃœrÃ¼nler:");
                            var sepetim = JSON.parse(sidHavuzu[sid].sepet); //Base64 ile ?ifrelenmi? JSON formatindaki sepet verisini array'e Ã§evirdim.
                            sepetim.forEach(function(v, k){

                                var ipidvarmi = "";
                                var url = "";


                                if (v.productID == data.productID){
                                    console.log("Sepetteki Ã¼rÃ¼n gÃ¼ncellendi.");
                                    console.log("Veriler "+sid+" adresine gonderildi");
                                    io.to(sid).emit(emit_adi, data);
                                }

                            });
                        }
                    }
                }
            }
        }



        function kisiyeGoreFiyatGetir(sid, v, data, emit_adi){
            var ipidvarmi = "";
            var url = "";
            
            if (sidHavuzu && sidHavuzu[sid] && sidHavuzu[sid].uyeid){
                ipidvarmi = "&ipid="+sidHavuzu[sid].uyeid; 
            }      
            url = site_url[secilenSite]+"/basket/urunveuyeidsinegorefiyatgetir?tamProductID="+v.productID+"&productID="+v.productID.split("-")[0]+"&indirimsiz=1&count=0"+ipidvarmi;
             


            io.to(sid).emit(emit_adi, {url:url, data: data});


        }


        function stokKapatmaDurumunuSepetlereGonder(data, emit_adi){
            mongoGuncelUrunKayit(data);

            console.log("Burasi stokKapatmaDurumunuSepetlereGonder() fonksiyonu:");


                if (sidHavuzu && sidHavuzu != "" && typeof sidHavuzu === "object" && Object.keys(sidHavuzu).length>0){
                    for (sid in sidHavuzu){
                        if (sid && sid != ""){
                            if (sidHavuzu[sid].sepet && sidHavuzu[sid].sepet != "" && data.sayfa.split("-")[0] == sidHavuzu[sid].sayfa.split("-")[0]){
                                c("Sepet var. ÃœrÃ¼nler:");
                                var sepetim = JSON.parse(sidHavuzu[sid].sepet); //Base64 ile ?ifrelenmi? JSON formatindaki sepet verisini array'e Ã§evirdim.
                                sepetim.forEach(function(v, k){


                                    if (v.productID == data.productID){
                                        c("Sepetteki Ã¼rÃ¼n gÃ¼ncellendi.");
                                        
                                        //console.log("Verinin gidecegi socket.id ->"+sid);
                                        kisiyeGoreFiyatGetir(sid, v, data, emit_adi);

                                    }

                                });
                            }
                        }
                    }
                }


     
        }



        function urunSepetlerineGonder(data, emit_adi, mongoyayaz){


            /*
                mongoyayaz == 1 ise mongoGuncelUrunKayit(data) fonksiyonuna gider
                mongoyayaz == 2 ise mongoKaldirilanUrunKayit(data) fonksiyonuna gider
            */




            if (mongoyayaz && mongoyayaz == 1){
                mongoGuncelUrunKayit(data);
            }
            else if(mongoyayaz && mongoyayaz == 2){
                mongoKaldirilanUrunKayit(data);
            }

            console.log("Burasi urunSepetlerineGonder() fonksiyonu:");


                if (sidHavuzu && sidHavuzu != "" && typeof sidHavuzu === "object" && Object.keys(sidHavuzu).length>0){
        //console.log("sid havuzu var");
                    for (sid in sidHavuzu){
                        if (sid && sid != ""){
                            if (sidHavuzu[sid].sepet && sidHavuzu[sid].sepet != "" && data.sayfa == sidHavuzu[sid].sayfa){
     
                                var sepetim = JSON.parse(sidHavuzu[sid].sepet); //Base64 ile ?ifrelenmi? JSON formatindaki sepet verisini array'e Ã§evirdim.
                                sepetim.forEach(function(v, k){

        
                                    if (v.productID == data.productID){
                                        kisiyeGoreFiyatGetir(sid, v, data, emit_adi);
                                    }

                                });
                            }
                        }
                    }
                }


     
        }



        function sepettekiKontorlereGonder(data, emit_adi){
            mongoGuncelUrunKayit(data);
            console.log("Burasi sepettekiKontorlereGonder() fonksiyonu:");
            console.log(emit_adi);
            console.log(data);


            if (sidHavuzu && sidHavuzu != "" && typeof sidHavuzu === "object" && Object.keys(sidHavuzu).length>0){
                for (sid in sidHavuzu){
                    if (sid && sid != ""){
                        if (sidHavuzu[sid].sepet && sidHavuzu[sid].sepet != "" && data.sayfa == sidHavuzu[sid].sayfa){
                            c("Sepet var. ÃœrÃ¼nler:");
                            var sepetim = JSON.parse(sidHavuzu[sid].sepet); //Base64 ile ?ifrelenmi? JSON formatindaki sepet verisini array'e Ã§evirdim.
                            sepetim.forEach(function(v, k){

                                var ipidvarmi = "";
                                var url = "";
                            

                                if (v.productID == data.productID){
                                    console.log("Sepetteki kontÃ¶rlÃ¼ Ã¼rÃ¼nÃ¼nÃ¼n fiyati gÃ¼ncellendi ve "+sid+"'e veri gÃ¶nderildi");
                                    io.to(sid).emit(emit_adi, data);
                                }


                            });
                        }
                    }
                }
            }


        }




        function kisiye_ozel_sayfaya_gonder(data, emit_adi){
            console.log("Burasi kisiye_ozel_sayfaya_gonder() fonksiyonu:");
            c(emit_adi);
            c(data);

            if(idHavuzu && idHavuzu[data.id] && idHavuzu[data.id][data.sayfa] && idHavuzu[data.id][data.sayfa]["sidler"] && idHavuzu[data.id][data.sayfa]["sidler"].length>0){
                
                idHavuzu[data.id][data.sayfa]["sidler"].forEach(function(v,k){
                    io.to(v).emit(emit_adi, data);
                    console.log(v+ " socket.id'sine sahip "+sidHavuzu[v]["uyeid"]+" id'sine sahip kisinin bulundugu "+sidHavuzu[v]["sayfa"]+" sayfasina veri gÃ¶nderildi");

                });
            }
            
        }

        function kisiye_gonder(){

        }


        function ilanlarCevrimiciListele(data){
            //c("Burasi ilanlarCevrimiciListele() fonksiyonu:");
            var uyeler = [];

            for (uyeid in idHavuzu){
                uyeler.push(uyeid);
            }
            setTimeout(function(){
                s.emit("ilanlarCevrimiciListele", {
                    uyeler: uyeler
                }); 
            },100);
                                        
        }


        function ilanSahibiCevrimDurumu(uyeid,durum){
    
            if (uyeid == "undefined"){
                return false;
            }

            //c("Burasi ilanSahibiCevrimDurumu() fonksiyonu:");
            c(uyeid+" Cevrim Durumu Degisti: "+durum);

            //await sleep(1000);
                if (sidHavuzu && typeof sidHavuzu === "object"){
                    for (sid in sidHavuzu){
                        if (sidHavuzu[sid].sayfa && sidHavuzu[sid].sayfa.substring(0,8) == "/ilanlar"){
                            var jsn = {uyeid:uyeid, durum:durum}
                            if(durum == 1){
                               
                                 io.to(sid).emit("ilanSahibiCevrimDurumu", jsn);
                            }

                            
                            if (durum == 0){
                                if(idHavuzu && idHavuzu[uyeid]){

                                }else{
                                     io.to(sid).emit("ilanSahibiCevrimDurumu", jsn);
                                }

                            }
                            
                        }
                    }
              
                    
                }   
            cc(uyeid+" "+durum);
            kullaniciCevrimDurumPost(uyeid, durum);
        }






        /*
        CONTROLLER BASLANGIC
        ########################################################
        */
        function teslimatBelirle(data){
            c("Burasi teslimatBelirle() metodu:");
            kisiye_ozel_sayfaya_gonder(data,"teslimatBelirle");
        }
        function siparisOnayla(data){
            c("Burasi siparisOnayla() metodu:");
            kisiye_ozel_sayfaya_gonder(data,"siparisOnayla");
        }
        function siparisIptal(data){
            c("Burasi siparisIptal() metodu:");
            kisiye_ozel_sayfaya_gonder(data,"siparisIptal");    
        }
        function aldiklarimOnaylandi(data){
            c("Burasi aldiklarimOnaylandi() metodu:");
            kisiye_ozel_sayfaya_gonder(data,"aldiklarimOnaylandi");
        }
        function aldiklarimIptal(data){
            c("Burasi aldiklarimIptal() metodu:");
            kisiye_ozel_sayfaya_gonder(data,"aldiklarimIptal");
        }
        function odemeBildirimiOnayla(data){
            c("Burasi odemeBildirimiOnayla() metodu:");
            kisiye_ozel_sayfaya_gonder(data,"odemeBildirimiOnayla");
        }
        function odemeBildirimiIptal(data){
            c("Burasi odemeBildirimiIptal() metodu:");
            kisiye_ozel_sayfaya_gonder(data, "odemeBildirimiIptal");
        }
        function odemeBildirimiKimlikDogrulamasi(data){
            c("Burasi odemeBildirimiKimlikDogrulamasi() metodu:");
            kisiye_ozel_sayfaya_gonder(data, "odemeBildirimiKimlikDogrulamasi");
        }
        function bakiyeNakitOnayla(data){
            c("Burasi bakiyeNakitOnayla() metodu:");
            kisiye_ozel_sayfaya_gonder(data, "bakiyeNakitOnayla");
        }
        function bakiyeNakitIptal(data){
            c("Burasi bakiyeNakitIptal() metodu:");
            kisiye_ozel_sayfaya_gonder(data, "bakiyeNakitIptal");
        }
        function sistemMesaji(data){
            c("Burasi sistemMesaji() metodu:");
            kisiye_ozel_sayfaya_gonder(data, "sistemMesaji");
        }
        function ilanIptal(data){
            c("Burasi ilanIptal() metodu:");
            kisiye_ozel_sayfaya_gonder(data, "ilanIptal");
        }
        function ilanOnayla(data){
            c("Burasi ilanOnayla() metodu:");
            kisiye_ozel_sayfaya_gonder(data, "ilanOnayla");
        }
        function ilanlarCevrimDurumu(data){
            //c("Burasi ilanlarCevrimDurumu() metodu:");
            var sayfa = data.sayfa.substring(0,8);
            if (sayfa == "/ilanlar"){
                ilanlarCevrimiciListele(data);
            }
        }
        function aldiklarimGuncelle(data){
            c("Burasi aldiklarimMuveApi() metodu:");
            kisiye_ozel_sayfaya_gonder(data, "aldiklarimGuncelle");
        }
        function aldiklarimmYenile(data){
            c("Burasi aldiklarimmYenile() metodu:");
            kisiye_ozel_sayfaya_gonder(data, "aldiklarimmYenile");
        }
        function aldiklarimIslemeAlindi(data){
        	console.log("Burası aldiklarimIslemeAlindi() metodu:");
        	console.log(data);
            kisiye_ozel_sayfaya_gonder(data, "aldiklarimIslemeAlindi");
        }


        /*
        HERKESE GiDECEK FONKSiYONLAR BÃ–LMESi
        */


        function steamSepetGuncelle(data){
            console.log("Burasi steamSepetGuncelle() metodu.");
            o_sayfaya_bagli_herkesin_sayfasina_gonder(data, "steamSepetGuncelle");
        }

        function urunSepetGuncelleme(data){
            c("Burasi urunSepetGuncelleme() metodu.");
            urunSepetlerineGonder(data, "urunSepetGuncelleme", 1);
            console.log(data);

        }
        function kontorSepetGuncelleme(data){
            console.log("Burasi kontorSepetGuncelleme() metodu.");
            sepettekiKontorlereGonder(data, "kontorSepetGuncelleme")
        }
        function kodluUrunStokKapat(data){
            console.log("Burasi kodluUrunStokKapat() metodu.");
            console.log(data);
            stokKapatmaDurumunuSepetlereGonder(data, "kodluUrunStokKapat");
        }
        function sepettenIlanKaldir(data){
            console.log("Burasi sepettenIlanKaldir() fonksiyonu");
            console.log(data);
            urunSepetlerineGonder(data, "sepettenIlanKaldir", 2);
           
        }




        /*
        CONTROLLER BiTiS
        ########################################################
        */






        /*
        ROUTE BASLANGIC
        ########################################################
        */
        function Route(data){

            if (data.metod=="teslimatBelirle"){
                teslimatBelirle(data);
            }
            else if(data.metod=="siparisOnayla"){
                siparisOnayla(data);
            }
            else if(data.metod == "siparisIptal"){
                siparisIptal(data);
            }
            else if(data.metod == "aldiklarimOnaylandi"){
                aldiklarimOnaylandi(data);
            }
            else if(data.metod == "aldiklarimIptal"){
                aldiklarimIptal(data);
            }
            else if(data.metod == "odemeBildirimiOnayla"){
                odemeBildirimiOnayla(data)
            }
            else if(data.metod == "odemeBildirimiIptal"){
                odemeBildirimiIptal(data);
            }
            else if(data.metod == "odemeBildirimiKimlikDogrulamasi"){
                odemeBildirimiKimlikDogrulamasi(data);
            }
            else if(data.metod == "bakiyeNakitOnayla"){
                bakiyeNakitOnayla(data);
            }
            else if(data.metod == "bakiyeNakitIptal"){
                bakiyeNakitIptal(data);
            }
            else if(data.metod == "sistemMesaji"){
                sistemMesaji(data);
            }
            else if (data.metod == "ilanIptal"){
                ilanIptal(data);
            }
            else if(data.metod == "ilanOnayla"){
                ilanOnayla(data);
            }
            else if(data.metod == "aldiklarimGuncelle"){
                aldiklarimGuncelle(data);
            }
            else if(data.metod == "aldiklarimmYenile"){
                aldiklarimmYenile(data);
            }
            else if(data.metod == "aldiklarimIslemeAlindi"){
            	console.log("Burası data.metod == aldiklarimIslemeAlindi");
            	console.log(data);
            	aldiklarimIslemeAlindi(data);
            }


            //Herkese Gider - (Kullanici id'si yok veya tanimlanmami? ise)
          

            if (data.metod == "steamSepetGuncelle"){
                 steamSepetGuncelle(data);
            }
            else if(data.metod == "urunSepetGuncelleme"){
                urunSepetGuncelleme(data);
            }
            else if(data.metod == "kontorSepetGuncelleme"){
                kontorSepetGuncelleme(data);
            }
            else if (data.metod == "kodluUrunStokKapat"){
                kodluUrunStokKapat(data);
            }
            else if(data.metod == "sepettenIlanKaldir"){
                sepettenIlanKaldir(data);                
            }




            // IO ile GELENLER

            if (data.sayfa && data.sayfa != ""){
                ilanlarCevrimDurumu(data);
            }

            
        }
        /*
        ROUTE BiTiS
        ########################################################
        */


        app.get("/1.js", function(req, res){
            res.sendFile(__dirname + "/1.js");
        });

        app.get("/", function(req, res){
            res.send("Test");
        });


        app.post("/durak1", function(req, res){
            console.log("durak1 veri geldi");
                console.log(req.body);
                console.log(req.query);
                console.log(req.body);

            res.send("durak1");
        });
            


        app.post("/istekler", function(req, res){
            console.log("istek:");
            console.log(req.body.jsn);
            

            var R = JSON.parse(req.body.jsn);


            var istekBody = {
                url: site_url[secilenSite]+'/muveapi/purchaseProduct',
                body: JSON.stringify(R),
                headers: {
                    "Content-type": "application/x-www-form-urlencoded"
                }
            }
            res.send({status: "success"});

            request.post(istekBody , function(error, response, html){
                 if(!error && response.statusCode==200){
                     console.log("SonuÃ§ DÃ¶ndÃ¼: ");
                     console.log("++++++++++++++++++++++++++++++++++++++++");
                      
                    var htmJsn = JSON.parse(html);
                    var data = {id: parseInt(htmJsn["userID"]), sayfa: "/profil/aldiklarim", metod: "aldiklarimmYenile", siparisID: htmJsn["orderID"], productKey: htmJsn["productKey"]}
                    var data1 = {id: parseInt(htmJsn["userID"]), sayfa: "/profil/aldiklarim?islem=ok", metod: "aldiklarimGuncelle", siparisID: htmJsn["orderID"], productKey: htmJsn["productKey"]}
                    
                    console.log(data);
                    Route(data);
                    Route(data1);

                    console.log("++++++++++++++++++++++++++++++++++++++++");
                 }
                        
            }); 



            console.log(R);
           
 
        });

        app.post("/uyebildirim", function(req, res){


            c("PHP Satis Tamamla istegi alindi");

            var jsn = req.param("jsn");

            var data = JSON.parse(jsn);
            
            if (!data || data.token != token){
                c("Token dogru degil ya da bos");
                res.send("...");
                return false;
                exit();
            }


            var filtrelidata = data;

            filtrelidata["token"] = "";

            Route(filtrelidata);
            res.send("");

        });


            s.on("data", function(data){
                console.log(data);
            });


            //us();
            s.on("disconnect", function(){
        //ci();
            //us();

                var uyeid = "";
                var sayfa = "";

                if (sidHavuzu[s.id] && sidHavuzu[s.id]["uyeid"]){
                    uyeid = sidHavuzu[s.id]["uyeid"];   
                }
                if (sidHavuzu[s.id] && sidHavuzu[s.id]["sayfa"]){
                    sayfa = sidHavuzu[s.id]["sayfa"];   
                }


                setTimeout(function(){

                    
                    var sidSayfa = sidHavuzu[s.id].sayfa;
                    var sidUyeId = sidHavuzu[s.id].uyeid;

                    if (sidUyeId && sidUyeId != "" && sidSayfa && sidSayfa != ""){
                        
                        if (idHavuzu && idHavuzu[sidUyeId] && idHavuzu[sidUyeId][sidSayfa] && idHavuzu[sidUyeId][sidSayfa]["sidler"] && idHavuzu[sidUyeId][sidSayfa]["sidler"].length>0){
                            
                            //c("Silinen socket id: "+idHavuzu[sidUyeId][sidSayfa]["sidler"][idHavuzu[sidUyeId][sidSayfa]["sidler"].indexOf(s.id)]);
                            //c("Silinen socketim: "+s.id);


                            var sid_indisi = idHavuzu[sidUyeId][sidSayfa]["sidler"].indexOf(s.id);
                            idHavuzu[sidUyeId][sidSayfa]["sidler"].splice(sid_indisi, 1);

                            //cc(idHavuzu);
                            //c(idHavuzu[sidUyeId][sidSayfa]["sidler"].length);


                            if ( !idHavuzu[sidUyeId][sidSayfa]["sidler"] || idHavuzu[sidUyeId][sidSayfa]["sidler"].length<1 ){
                                
                                //c("Silinen sayfa: "+sidUyeId+" numarasina ait "+sidSayfa+ " length: "+idHavuzu[sidUyeId][sidSayfa]["sidler"].length);
                                delete idHavuzu[sidUyeId][sidSayfa];
                            }

                        }else{
                            delete idHavuzu[sidUyeId][sidSayfa];
                            //c("Silinen sayfa: "+sidUyeId+" numarasina ait "+sidSayfa);
                        }



                    }

                    setTimeout(function(){
                        if(idHavuzu[sidUyeId] && Object.keys(idHavuzu[sidUyeId]).length<1 ){
                            //c("Silinen uye: "+sidUyeId+ " length: "+Object.keys(idHavuzu[sidUyeId]).length);
                            delete idHavuzu[sidUyeId];
                            ilanSahibiCevrimDurumu(uyeid,0);
                        }                       
                    },900);



                    delete sidHavuzu[s.id];
                },100);
              


            });






            s.on("giris", function(data){
                c("Giris istegi:");
              
                us()
                // Route iÃ§ine yÃ¶nlendiriliyor.
    
                var guncellenmiurunlerHavuzu = [];
                var kaldirilmisUrunlerHavuzu = [];

                if (data && data.sepet){
                    data.sepet = base64.decode(data.sepet);
                }
           
                if (data && data.id && !idHavuzu[data.id]){
                    idHavuzu[data.id] = {};
                }
             

                if (data && data.id && data.id != "" && !idHavuzu[data.id][data.sayfa]){

                    idHavuzu[data.id][data.sayfa] = {sidler: []}
                    idHavuzu[data.id][data.sayfa]["sidler"].push(s.id);

                }
                else{
                    if (data && data.id && data.id != "") {
                        idHavuzu[data.id][data.sayfa]["sidler"].push(s.id);
                    }
                }

                

                var sepet = "";
                if (data.sepet && data.sepet != ""){
                    sepet = data.sepet;
             
                    if (sepet && sepet != ""){

                        var sepetjsn = JSON.parse(sepet);


                        sepetjsn.forEach(function(v,k){
                           gu_vt.collection("urunlistesi").findOne({id: v.productID}, function(err, res){

                                if (res && res != ""){

                                    guncellenmiurunlerHavuzu.push(res);
                                }
                               
                           });


                            gu_vt.collection("kaldirilanurunlistesi").findOne({id: v.productID}, function(err, res){

                                if (res && res != ""){
                                    console.log("Sepet iÃ§erisinde kaldirilmis urun var");
                                    console.log(res);
                                    kaldirilmisUrunlerHavuzu.push(res);
                                }
                               
                            });
                           

                        });
                        setTimeout(function(){

                            if (guncellenmiurunlerHavuzu && guncellenmiurunlerHavuzu.length>0){
                                console.log("-------------------------------------------------");

                                s.emit("guncellenenUrunlerListesi",{
                                    url: site_url[secilenSite]+"/basket/urunveuyeidsinegorefiyatgetir?productID=",
                                    ek1:"&indirimsiz=1&count=0",
                                    urunler: guncellenmiurunlerHavuzu,
                                    mesaj: "Sepetinizdeki bir Ã¼rÃ¼nÃ¼n fiyatÄ± gÃ¼ncellendi"
                                });

                                console.log("-------------------------------------------------");

                            } 

                            if (kaldirilmisUrunlerHavuzu && kaldirilmisUrunlerHavuzu.length>0){
                                console.log("-------------------------------------------------");


                                console.log("BurasÄ± kaldirilmisUrunlerHavuzu() setTimeout alanÄ±");
                                s.emit("kaldirilanUrunlerListesi",{
                                    urunler: kaldirilmisUrunlerHavuzu,
                                    mesaj: "Sepetinizdeki bir ilan kaldÄ±rÄ±ldÄ±"
                                });

                                console.log("-------------------------------------------------");

                            } 



                        },200);

                        
                    }
                    
                }

             

                sidHavuzu[s.id] = {uyeid: data.id, sayfa: data.sayfa, sepet: sepet, ip: ip.address()};
               

                if (data && data.id && data.id != "" && data.id.length>0){
                    ilanSahibiCevrimDurumu(data.id,1);
                }

        // Saldiri Tespit Filtreleri
                for (tip in filtreler){
                    filtreler[tip].forEach(function(v,k){
                        if (v && sidHavuzu[s.id].sayfa){
                            if (sidHavuzu[s.id].sayfa.indexOf(v)>0 || sidHavuzu[s.id].sayfa.toLowerCase().indexOf(v)>0 || sidHavuzu[s.id].sayfa.toLowerCase().indexOf(urlencode(v))>0 || sidHavuzu[s.id].sayfa.toLowerCase().indexOf(v)>0){
                                cc("XSS Saldirisi Algilandi");
                                cc(sidHavuzu[s.id]);

                                var suan = new Date();
                                var islemTarihi = sifirKoy(suan.getDate())+"/"+sifirKoy(suan.getMonth()+1)+"/"+suan.getFullYear();
                                var islemSaati = +" "+suan.getHours()+":"+sifirKoy(suan.getMinutes())+":"+sifirKoy(suan.getSeconds());
                                cc("islem Tarihi:");
                                cc(islemTarihi);

                                vt.collection("kayitlar").insert({ip:ip.address(), tip:tip, sayfa:sidHavuzu[s.id].sayfa, islemTarihi: islemTarihi, islemSaati: islemSaati});
                                io.to(s.id).emit("saldiriTespiti", {
                                    tip:tip,
                                    uyari: tip+' saldiri giri?imi algilandi ! Yapti?iniz saldiri giri?imi sebebiyle ip adresiniz('+ip.address()+'), '+islemTarihi+' '+islemSaati+' itibariyle hakkinizda i?lem yapilmak Ã¼zere kayit altina alindi. Bunun hatali bir tespit oldu?unu dÃ¼?Ã¼nÃ¼yorsaniz. LÃ¼tfen canli destek ekibimize bildiriniz.'
                                });

                            }
                        }
                    });
                }

                Route(data);            
            });



        });
//MongoClient Bitis
});