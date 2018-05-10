void setup() {
  Serial.begin(9600); 
}

void loop() {
  int pot = analogRead(A0); 
  int IRValue = analogRead(A1); 

 if (pot<=200)
 {
  int potValue = map(pot,0,200,101,201); 
  Serial.println(potValue); 
 }

  delay(500);   
}
