### Oorsprong
Na een gesprek met [[Raymond CMD]] over mijn Tgif projecten kwam ik in contact met Rebecca.
Rebecca (een student health innovation) had een opdracht waar ik de uitwerking van kon doen. 

Het project Haptic Friend gaat over de tijdsbesteding van slechtziende en motorisch mindere kinderen. Er moest een "Muismat" gemaakt worden waarmee deze doelgroep haptisch / audio feedback kreeg van een spel dat zei speelde.

Het spel was nog simpel, luister een nummer, wanneer deze stopt moet je zo snel mogelijk het trillende knopje indrukken.

### Hardware
Het huidige prototype maakt gebruikt van 2 *Nodes* aangesloten op een *Arduino*.

#### Arduino board
![[board.png|300]]
Layout Arduino board

G. Ground
I. Input Pin: Pak gebruikers input bij normale of double press.
O. Output Pin: Output signal voor haptische feedback.
S. Switch Pin: Switch signal voor versterkte haptische feedback.

#### Nodes
Aangesloten op het board zitten verschillende *nodes*. Iedere node heeft dezelfde layout en maakt gebruik van 4 pins.

![[node.png|200]]