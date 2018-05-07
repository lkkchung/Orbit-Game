void setup() {
  Serial.begin(9600); //Transmit at 9600 Baud Rate
}

void loop() {
  int pot = analogRead(A0); //variable to store potValue
  int IRValue = analogRead(A1); //variable to store Flex Value

 if (pot<=200)
 {
  int potValue = map(pot,0,200,101,201); 
  Serial.println(potValue); 
 }

  delay(500);   
}
