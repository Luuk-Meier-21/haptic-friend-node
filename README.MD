### Oorsprong
Na een gesprek met [[Raymond CMD]] over mijn Tgif projecten kwam ik in contact met Rebecca.
Rebecca (een student health innovation) had een opdracht waar ik de uitwerking van kon doen. 

Het project Haptic Friend gaat over de tijdsbesteding van slechtziende en motorisch mindere kinderen. Er moest een "Muismat" gemaakt worden waarmee deze doelgroep haptisch / audio feedback kreeg van een spel dat zei speelde.

Het spel was nog simpel, luister een nummer, wanneer deze stopt moet je zo snel mogelijk het trillende knopje indrukken.

### Hardware
Het huidige prototype maakt gebruikt van 2 *Nodes* aangesloten op een *Arduino*.

#### Arduino board

![board](https://user-images.githubusercontent.com/79259813/201329774-694fd3dc-56e2-4f2d-a3a4-9962fb609ce7.png)

Layout Arduino board

G. Ground
I. Input Pin: Pak gebruikers input bij normale of double press.
O. Output Pin: Output signal voor haptische feedback.
S. Switch Pin: Switch signal voor versterkte haptische feedback.

#### Nodes
Aangesloten op het board zitten verschillende *nodes*. Iedere node heeft dezelfde layout en maakt gebruik van 4 pins.

![node](https://user-images.githubusercontent.com/79259813/201329837-f4ed6e03-3fe8-4cc9-8126-8444294f6f33.png)
