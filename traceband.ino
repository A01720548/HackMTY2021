#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <ArduinoJson.h>
#include <FirebaseObject.h>
#define trigger D5
#define echo D6
#define button D7

#define WIFI_SSID "cambio-WiFi-por-despensa" 
#define WIFI_PASSWORD "carneasada3508"
#define FIREBASE_HOST "meeseeks-dd5f8-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "DBP3zzcNqJlMt7hMPkSODkSbBt6xUQMLqpVRkVvr"

int contId=0;
float distancia; //variable de distancia para ultrasónico
bool contacto;  //variable si se hizo contacto con una persona
String idLocal="1"; //id preestablecido para identificar contacto con otro dipositivo
String readPath="meeseeks-dd5f8-default-rtdb.firebaseio.com/pairs/10";  //base de datos
String hash="",hashSujeto="",idSujeto="",emailSujeto="";  //variables para búsquedas
String vecId[]={"5","10","15","20"};


float ultrasonico(){ //medición de distancia
  float tiempo,distancia;
  digitalWrite(trigger,LOW);
  delayMicroseconds(4);
  digitalWrite(trigger,HIGH);
  delayMicroseconds(10);
  digitalWrite(trigger,LOW);

  tiempo=pulseIn(echo,HIGH);
  distancia=tiempo/58.3;
  Serial.print("Distancia: ");
  Serial.println(distancia);
  return distancia;
}

void wifiConnect() { //conexión WiFi
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Conectando WiFi: ");
    Serial.println(WIFI_SSID);

    while (WiFi.status() != WL_CONNECTED) { 
        delay(1000);
        Serial.print(".");
    }

    Serial.println('\n');
    Serial.println("WiFi conectado!");
    Serial.print("IP address:\t");
    Serial.println(WiFi.localIP());
}

bool checkContact(float distancia){ //chequeo de contacto continuo (mayor a 7 segundos)
     int cont=0;
     while(distancia<20){
      distancia=ultrasonico();
      cont++;
      delay(1000);
     }
     if(cont>7){
      return true;
     }
     else{
      return false;
     }
}

void setup() { 
  pinMode(trigger,OUTPUT);
  pinMode(echo,INPUT);
  pinMode(button,INPUT);

  Serial.begin(9600);
  delay(10);

  wifiConnect();

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH); //Verificación de conexión con base de datos
    if (Firebase.failed()) {
        Serial.println("setting number failed:");
        Serial.println(Firebase.error());
    } else {
        Serial.println("Firebase connected ");
    }
  
  
}
 
void loop() {
  if(digitalRead(button)==0){
    contId++;
    if(contId>3){
      contId=0;
    }
    while(digitalRead(button)==0){
      delay(100);
    }
  }
  Serial.print("Device detected :");
  Serial.println(vecId[contId]);
  distancia=ultrasonico(); //medición de distancia
  contacto=checkContact(distancia); //verificación de conacto continuo 
  hash=Firebase.getString("pairs/"+idLocal+"/hash"); //obtiene el hash de la sesión vinculada al dispositivo mediante QR
  if(contacto==true && hash!=""){ 
    hashSujeto=Firebase.getString("pairs/"+vecId[contId]+"/hash"); //obtiene el hash de la persona que está vinculada al dispositivo en contacto
    idSujeto=Firebase.getString("persons/"+hashSujeto+"/uid"); //se obtiene el código de identificación de la persona vinculada al dispositivo en contacto
    emailSujeto=Firebase.getString("persons/"+hashSujeto+"/email"); //también se obtiene su email
    Serial.print("Hash local: ");
    Serial.println(hash); //se imprime el código hash de la sesión vinculada a este dispositivo
    Firebase.setString("persons/"+hash+"/contacts/"+idSujeto,emailSujeto); //se añade el elemento en contacto a la lista de contactos
  }
  
  delay(1000); 
  
}
