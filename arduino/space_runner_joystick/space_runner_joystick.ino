// ============================================================
// Space Runner — Joystick Shield V1.A
// Envia dados do joystick via Serial para o navegador
// ============================================================
// Pinagem padrão Joystick Shield V1.A:
//   A0 = Eixo X (analógico)
//   A1 = Eixo Y (analógico)
//   D2 = Botão A     D6 = Botão E
//   D3 = Botão B     D7 = Botão F
//   D4 = Botão C     D8 = Botão Joystick (Sel)
//   D5 = Botão D
// ============================================================

#define PIN_JOY_X  A0
#define PIN_JOY_Y  A1
#define PIN_BTN_A  2
#define PIN_BTN_B  3
#define PIN_BTN_C  4
#define PIN_BTN_D  5
#define PIN_BTN_E  6
#define PIN_BTN_F  7
#define PIN_JOY_SEL 8

#define DEADZONE 80
#define SERIAL_BAUD 115200

void setup() {
    Serial.begin(SERIAL_BAUD);
    pinMode(PIN_BTN_A, INPUT_PULLUP);
    pinMode(PIN_BTN_B, INPUT_PULLUP);
    pinMode(PIN_BTN_C, INPUT_PULLUP);
    pinMode(PIN_BTN_D, INPUT_PULLUP);
    pinMode(PIN_BTN_E, INPUT_PULLUP);
    pinMode(PIN_BTN_F, INPUT_PULLUP);
    pinMode(PIN_JOY_SEL, INPUT_PULLUP);
}

void loop() {
    int x = analogRead(PIN_JOY_X);
    int y = analogRead(PIN_JOY_Y);

    int btnA = !digitalRead(PIN_BTN_A);
    int btnB = !digitalRead(PIN_BTN_B);
    int btnC = !digitalRead(PIN_BTN_C);
    int btnD = !digitalRead(PIN_BTN_D);
    int btnE = !digitalRead(PIN_BTN_E);
    int btnF = !digitalRead(PIN_BTN_F);
    int joySel = !digitalRead(PIN_JOY_SEL);

    int dir = 0; // 0=parado, -1=esquerda, 1=direita
    if (x < 512 - DEADZONE) dir = -1;
    else if (x > 512 + DEADZONE) dir = 1;

    // Formato: dir,btnA,btnB,btnC,btnD,btnE,btnF,joySel\n
    Serial.print(dir);
    Serial.print(',');
    Serial.print(btnA);
    Serial.print(btnB);
    Serial.print(btnC);
    Serial.print(btnD);
    Serial.print(btnE);
    Serial.print(btnF);
    Serial.println(joySel);

    delay(30);
}
