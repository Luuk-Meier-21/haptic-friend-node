void setup() {
  Serial.begin(115200); // 115200 is the max, higher values will not work.
  pinMode(13, OUTPUT);
}

void loop() {
  if(Serial.available() > 0) {  
    int data = Serial.read();

    if (data == '1') { digitalWrite(13, HIGH); }
    if (data == '0') { digitalWrite(13, LOW); }
  }
}
