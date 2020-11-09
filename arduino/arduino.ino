#include <SoftwareSerial.h>
#include "BigNumber.h"


SoftwareSerial mySerial(4, 2);
#define NUMBER_OF_SHIFT_CHIPS 4 
#define DATA_WIDTH NUMBER_OF_SHIFT_CHIPS * 8 
#define PULSE_WIDTH_USEC 5 
#define BYTES_VAL_T unsigned long

int ploadPin = 8;
int clockEnablePin = 10;
int dataPin = 11;
int clockPin = 12;

BYTES_VAL_T pinValues; 
BYTES_VAL_T oldPinValues; 

BYTES_VAL_T read_shift_regs() {
long bitVal;
BYTES_VAL_T bytesVal = 0;

digitalWrite(clockEnablePin, HIGH);
digitalWrite(ploadPin, LOW);
delayMicroseconds(PULSE_WIDTH_USEC);
digitalWrite(ploadPin, HIGH);
digitalWrite(clockEnablePin, LOW);

for(int i = 0; i < DATA_WIDTH; i++){
bitVal = digitalRead(dataPin);
bytesVal |= (bitVal << ((DATA_WIDTH-1) - i));
digitalWrite(clockPin, HIGH);
delayMicroseconds(PULSE_WIDTH_USEC);
digitalWrite(clockPin, LOW);
}
return(bytesVal);
}

void updateSerial()
{
delay(500);
while (Serial.available())
{
mySerial.write(Serial.read());
}
while(mySerial.available())
{
Serial.write(mySerial.read());
}
}

void sendPls(int car, long pinValues) {
Serial.println("Initializing...");
delay(1000);
int block3 = pinValues & 255;
int block4 = (pinValues >> 8) & 255;
int block1 = (pinValues >> 16) & 255;
int block2 = (pinValues >> 24) & 255;

BigNumber a = 2;
BigNumber tmp =  (2+~(block1>>2&1));
BigNumber degree = 65;
BigNumber seat1 = tmp*a.pow(degree);
tmp =  (2+~(block1>>3&1));
degree = 64;
BigNumber seat2 = tmp*a.pow(degree);
tmp =  (2+~(block1>>1&1));
degree = 60;
BigNumber seat3 = tmp*a.pow(degree);
tmp =  (2+~(block1&1));
degree = 61;
BigNumber seat4 = tmp*a.pow(degree);
tmp =  (2+~(block2>>3&1));
degree = 42;
BigNumber result = seat1 + seat2 + seat3 + seat4;
BigNumber seat5 = tmp*a.pow(degree);
tmp =  (2+~(block2>>2&1));
degree = 43;
BigNumber seat6 = tmp*a.pow(degree);
tmp =  (2+~(block2>>1&1));
degree = 37;
BigNumber seat7 = tmp*a.pow(degree);
tmp =  (2+~(block2&1));
degree = 38;
BigNumber seat8 = tmp*a.pow(degree);
tmp =  (2+~(block3>>3&1));
degree = 21;
result = result + seat5 + seat6 + seat7 + seat8;
BigNumber seat9 = tmp*a.pow(degree);
tmp =  (2+~(block3>>2&1));
degree = 22;
BigNumber seat10 = tmp*a.pow(degree);
tmp =  (2+~(block3>>1&1));
degree = 16;
BigNumber seat11= tmp*a.pow(degree);
tmp =  (2+~(block3&1));
degree = 17;
BigNumber seat12 = tmp*a.pow(degree);
  tmp =  (2+~(block4>>3&1));
degree = 11;
result = result + seat9 + seat10 + seat11 + seat12;
BigNumber seat13 = tmp*a.pow(degree);
tmp =  (2+~(block4>>2&1));
degree = 12;
BigNumber seat14 = tmp*a.pow(degree);
tmp =  (2+~(block4>>1&1));
degree = 6;
BigNumber seat15 = tmp*a.pow(degree);
tmp =  (2+~(block4&1));
degree = 7;
BigNumber seat16 = tmp*a.pow(degree);
result = result + seat13 + seat14 + seat15 + seat16;
Serial.println(result);

//Подключение к GPRS и отправка запроса на сервер
mySerial.println("AT+SAPBR=3,1,\"CONTYPE\",\"GPRS\""); 
updateSerial();
mySerial.println("AT+SAPBR=3,1,\"APN\",\"internet.beeline.ru\""); 
updateSerial();
mySerial.println("AT+SAPBR=3,1,\"USER\",\"beeline\"");
updateSerial();
mySerial.println("AT+SAPBR=3,1,\"PWD\",\"beeline\"");
updateSerial();
mySerial.println("AT+SAPBR=1,1"); 
updateSerial();
mySerial.println("AT+HTTPINIT");
updateSerial();
mySerial.println("AT+HTTPPARA=\"CID\",1");
updateSerial();
mySerial.print("AT+HTTPPARA=\"URL\",\"http://trains.zisest.ru/api/");
mySerial.print("updateSeats?key=[SECRET_KEY]&id=6639_0_9602498_g20_4&layout=");
mySerial.print(result);
mySerial.print("&car=");
mySerial.print(car);
mySerial.println("\"");
updateSerial();
mySerial.println("AT+HTTPACTION=0");
updateSerial();
}


void setup(){
Serial.begin(9600);
mySerial.begin(9600);
pinMode(ploadPin, OUTPUT);
pinMode(clockEnablePin, OUTPUT);
pinMode(clockPin, OUTPUT);
pinMode(dataPin, INPUT);
digitalWrite(clockPin, LOW);
digitalWrite(ploadPin, HIGH);

BigNumber::begin ();
pinValues = read_shift_regs();
oldPinValues = pinValues;
}

void loop(){
updateSerial();
pinValues = read_shift_regs();
int p3 = pinValues & 255;
int p4 = (pinValues >> 8) & 255;
int p1 = (pinValues >> 16) & 255;
int p2 = (pinValues >> 24) & 255;
if (pinValues!=oldPinValues){
Serial.println(p1, BIN);
Serial.println(p2, BIN);
Serial.println(p3, BIN);
Serial.println(p4, BIN);
Serial.println("****************************");
sendPls(1,pinValues);
oldPinValues = pinValues;
}
delay(400);
}
