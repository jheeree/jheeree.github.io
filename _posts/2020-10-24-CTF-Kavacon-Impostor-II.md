---
classes: wide
title: "CTF-Kavacon - Writeup - Impostor 2"
date: 2020-10-24
header:
  teaser: /assets/images/content/CTF/Kavacon-2020/impostor2/image_000.PNG
  teaser_home_page: true
categories:
  - CTF
  - Writeup
tags:
  - CTF
  - "2020"
  - Kavacon
excerpt: "Si les dolió la cabeza con el Impostor 1, esta no será diferente."
---
<img src="/assets/images/content/CTF/Kavacon-2020/impostor2/image_001.PNG" style="zoom:67%;" />{: .align-center}

> Si les dolió la cabeza con el Impostor 1, esta no será diferente.
>
> Durante la segunda misión a Marte de la tripulación, nuevamente algo terrible ha sucedido, dos miembros de la misión fueron asesinados y el capitán de la nave, el Cdte Rojo se contactó con la tierra mediante morse para informar que blanco fue el asesino, desde la base de la estación espacial, se interrogó a los 3 tripulantes que se encuentran vivos, pero hay muchas situaciones y testimonios que no dejan clara la situación.

[+] Dificultad	: Medio - 600 pts.

[+] Creador	   : @DM20911

------

Al igual que con "El Impostor I", este desafío es algo diferente ya que no se pone tanto a prueba lo técnico, sino que la paciencia y tolerancia a la frustración por el hecho de estar constantemente recolectando información que te puede servir pero no sabes cuando😂 ([pueden ver el writeup de "El Impostor I" en este link👈](https://jheeree.github.io/ctf/writeup/CTF-Q4-Impostor/)). Sin embargo, no deja de ser entretenido para un CTF.

Trataremos de tener el contador de "Diego te odio" en cero. Esperemos que sea posible.

------

En comparación a la vez anterior, no se nos indica una dirección IP a la que tengamos que realizar un escaneo de servicios, sino que nos entregan un archivo de audio en formato `wav`.

```bash
$ file test_1.wav 
test_1.wav: RIFF (little-endian) data, WAVE audio, Microsoft PCM, 8 bit, mono 11050 Hz
```

En la descripción del desafío ya se nos menciona que corresponde a un mensaje en morse, y a menos que apliquemos el "viste el audio que te mandé?", será mejor utilizar alguna herramienta que nos facilite la primera indagación de detalles.

Para esto, podemos usar el siguiente recurso web : [Link](https://morsecode.world/international/decoder/audio-decoder-adaptive.html)👈

Subimos el archivo wav y le damos a `play`.

Nota adicional: se puede ir jugando con los valores de abajo para obtener mejores resultados, ya que tiende a fallar en algunos casos, o bien no muestra el mensaje de forma correcta.

![image_003](/assets/images/content/CTF/Kavacon-2020/impostor2/image_003.PNG){: .align-center}

Vemos que nos entrega un texto que parece ser un link acortado, pero con cierta modificación y hints:

> C U T T . L Y / H M A Y U S = G M I N U S = J M I N U S = T M A Y U S = X M A Y U S = 4 N U M E R O = G M I N U S

- H = mayúscula
- g = minúscula
- j = minúscula
- T = mayúscula
- X = mayúscula
- 4 = número
- g = minúscula

Si vamos ordenando todo, quedaría así : `cutt.ly/HgjTX4g`, lo que nos llevaría a un link de google drive:

> https://drive.google.com/file/d/12CkRYRPfc7h9FtXcBDbMifea9nYpYFsC/view
>

El enlace nos permite descargar un archivo llamado `information.exe`, pero OJO, no corresponde a un archivo ejecutable.👀

```
$ file information.exe 
information.exe: ASCII text, with very long lines
```

Al revisarlo, podemos ver que corresponde a un archivo de texto. Revisemos qué trae.

```
$ cat information.exe 
++++++++++[>+>+++>+++++++>++++++++++<<<<-]>>>++++++++++.>+.+++++++++++++.+.----.-.-------------.+++++++++++.<<++.>>--------.+.<<.>>+++++++.-----------.<<.>>+++++++++++++++++++.-----------.----.+++++++++++++..<+++++++++++++++++.<++++++++++++.------------.>++++.>+.+.-----.<<.>.>++++.<<.>>+.-----.<-.>.<<.>>---.+++.<<.>>++.++++.<+.<.>>-----.+++++.<-.+.<.>>---.<.>+.<--.--.>+.<.>--.<<.>+++.+.<.>>----.+++++++.<.>--.+.--.<----.>+.<<.>++.--.>-.--.<++++.>++++.<----.>-.<<.>++.>----.--.+++.<--.>++.++.<++++++++.-----.---.>-.<<.>++++.>-----.<<.>>--.<----.<.>>++.<.>++++++++.<++++.<++++++++++++.------------.>>------.-.+++.<<.>-.+.>+.<++.>-.<------.++.++++++.--------.<++++++++++++.------------.>>------.+++++++++.<++++.++.>------.<<.>---.+.<.>>---.<----.<.>>+.++++++++.<++++.>---.++.<.<.>-.+.<.>>--.---.++++.<----.<.>>++++++.<<.>>---.<++++.>----.<-.+.<++++++++++++.------------.>>++.-----.<-.>.++++.<<.>>+.+.+.<+++++.----.>----.---.-.<<.>>++++++.<++++.----.>-------.+++.-.<<.>-.+.<.>++++.>-.<--.>++++.<--.>+.<----.>-.<<.>.<.>+.>---.+++..<-.>.<<.>>+.++.--.<<.>+++.---.>+.-----.++++.<<++++++++++++.------------.>++++.>.<<.>>+.-----.<-.>.<<.>>---.+++.<<.>>++.++++.<+.<.>>-.<.>------.<++.>+.<<++++++++++++.------------.>--.>++++.---.<.>++.---.<<.>-.---.>+++.<<.>++.>---.-.<<.>++.>--.<<.>--.>+++++++++.<+++++++++.++++.---------------.+.>---------.<+++.<.>+++.>++++++++..----.+++.<<++++++++++++++++++++++++++.-----------..>>+.<<-.>+++++.--------.<+.>+++++.+++++.------.+++++.-----------.+++++.-------.>.<<.++++++++++++++++++.....+++++.>-------.++++++++++++.>---.<---------------.>--.-.++.<<--------------------.>>------------.<--.<++++++.>>---.<----.---.>++++.++.
```

Al parecer, esto sería lenguaje `brainfuck` (recomiendo leer sobre lenguajes de programación esotéricos. Suelen presentarse a menudo desafíos con estos en CTF's ).

Buscamos un intérprete online para ver qué nos muestra.

<img src="/assets/images/content/CTF/Kavacon-2020/impostor2/image_004.PNG" alt="image_004" style="zoom: 80%;" />{: .align-center}

> Personal de la tierra, esto es todo lo que pude rescatar de nuestras carpetas compartidas en la nave, por desgracia, luego de la muerte de rosa y verde, todos tuvieron tiempo de ingresar a borrar sus datos, es todo lo que tengo, espero dar con el culpable https://t.me/joinchat/AAAAAFZfqWonp2dU8aQNeg

Ya empezamos con los enlaces a telegram😂. Este sería un canal. 

![image_005](/assets/images/content/CTF/Kavacon-2020/impostor2/image_005.PNG){: .align-center}

Al unirte, vemos que solamente trae un archivo comprimido.

<img src="/assets/images/content/CTF/Kavacon-2020/impostor2/image_006.PNG" alt="image_006" style="zoom:67%;" />{: .align-center}

Lo descargamos, y cuando probamos con tratar de descomprimirlo, nos percatamos que este se encuentra protegido con contraseña.

Hasta este punto, como no hemos tenido indicios ni nada relacionado a lo que podría considerarse una contraseña, optaremos por la vía de crackearlo con nuestro viejo confiable rockyou.

```bash
$ fcrackzip -v -D -u -p /usr/share/wordlists/rockyou.txt tripulacion\(1\).zip 
'blanco/' is not encrypted, skipping
'negro/' is not encrypted, skipping
'rojo/' is not encrypted, skipping
'rosado/' is not encrypted, skipping
'verde/' is not encrypted, skipping
found file 'blanco/peligro.zip', (size cp/uc 229893/229881, flags 9, chk 9eae)
found file 'negro/warning.zip', (size cp/uc    336/   324, flags 9, chk 8536)
found file 'negro/notas', (size cp/uc    140/   178, flags 9, chk 8314)
found file 'rojo/mis_investigaciones.txt', (size cp/uc    174/   194, flags 9, chk 832d)
found file 'rosado/no_recuerdo_esta_pass.zip', (size cp/uc    311/   299, flags 9, chk 89c1)
found file 'verde/mi_legado.zip', (size cp/uc    538/   526, flags 9, chk 98f8)
checking pw budayday                                

PASSWORD FOUND!!!!: pw == carabell
```

Hemos conseguido la contraseña: `carabell`.

Al descomprimir, podemos percatarnos de que trae varias carpetas. 

Si queremos tener una rápida visualización de lo que podrían contener sin tener la necesidad de hacer un `ls` a cada una de ellas, usamos `tree`.

```bash
$ tree 
├── blanco
│   └── peligro.zip
├── negro
│   ├── notas
│   └── warning.zip
├── rojo
│   └── mis_investigaciones.txt
├── rosado
│   └── no_recuerdo_esta_pass.zip
└── verde
    └── mi_legado.zip

5 directories, 6 files
```

5 directorios y 6 archivos en total.

Dado este punto, y recordando que la vez anterior tuvimos que trabajar con múltiples directorios, se opta por tener dividida en varias ventanas la terminal para poder trabajar mucho más organizado.

Comenzamos por la carpeta de `rojo`. Este traía un archivo de texto. Al revisarlo nos muestra lo siguiente:

```bash
/rojo$ cat mis_investigaciones.txt 
Hay algunas cosas que no puedo decir rápidamente, pero deje ciertas pistas para recordar luego bWljb21wYWVscm9qby53ZWJub2RlLmNs quizás tambíen utilice esto para ayudar a negro como me pidio.
```

La cadena de caracteres que se muestra corresponde a base64. Al decodificarlo nos muestra un enlace.

```bash
/rojo$ echo "bWljb21wYWVscm9qby53ZWJub2RlLmNs" | base64 -d
micompaelrojo.webnode.cl
```

Ingresamos y ...

<img src="/assets/images/content/CTF/Kavacon-2020/impostor2/image_007.PNG" alt="image_007" style="zoom: 67%;" />{: .align-center}

Un cachupín nos recibe🐕. (#NoCompren #Adopten)

Dando un rápido vistazo, en uno de los títulos se ve la palabra `cewl` (creo que ya sabemos por donde va esto).

<img src="/assets/images/content/CTF/Kavacon-2020/impostor2/image_008.PNG" alt="image_008" style="zoom:67%;" />{: .align-center}

`cewl` es una herramienta que nos permite generar un diccionario en base a un sitio web. Como en este caso posee una cantidad considerable de texto, nos hace sentido poder generar uno con lo que tiene. Podría servirnos a futuro.

```bash
$ cewl -w dir_cewl.txt https://micompaelrojo.webnode.cl
CeWL 5.4.8 (Inclusion) Robin Wood (robin@digi.ninja) (https://digi.ninja/)

$ wc -l dir_cewl.txt 
172 dir_cewl.txt
```

Ya creado el diccionario, nos dirigimos a crackear algunos de los archivos comprimidos de las otras carpetas.

El único que nos entregó resultados fue con `warning.zip` en la carpeta de `negro`.

```bash
/negro$ fcrackzip -v -D -u -p ../dir_cewl.txt warning.zip 
found file 'nota_super_importante', (size cp/uc    116/   201, flags 9, chk 84fc)

PASSWORD FOUND!!!!: pw == voluptate
```

La contraseña es `voluptate`.

Descomprimimos y vemos que trae un archivo de texto. 

```bash
/negro$ cat nota_super_importante 
4465626f207265636f7264617220656e766961726c6520737520706173732064652061636365736f206120726f7361646f20616e7465732064652071756520746f646f7320626f7272656e20737573206461746f73204173756e6369306e2c2c32303230
```

Esto sería hexadecimal. Veamos qué nos muestra al pasarlo a texto plano.

![image_009](/assets/images/content/CTF/Kavacon-2020/impostor2/image_009.PNG){: .align-center}

> Debo recordar enviarle su pass de acceso a rosado antes de que todos borren sus datos Asunci0n,,2020

Vaya vaya. Tenemos al parecer una contraseña que pertenecería a `rosado`. Vamos a descomprimir el archivo con esta y ver qué trae.

```bash
/rosado$ unzip no_recuerdo_esta_pass.zip 
Archive:  no_recuerdo_esta_pass.zip
[no_recuerdo_esta_pass.zip] vamosquesepuede.txt password: 
 extracting: vamosquesepuede.txt
```

Un archivo con texto que pareciera ser ROT13.

```bash
/rosado$ catn vamosquesepuede.txt 
vhhdg://rfwjs.uccuzs.qca/twzs/r/1D9a61NAmtKQ6u3-Xz-tr937_2WZAcMvL/jwsk?igd=gvofwbu
```

Pero nooooo. Era ROT12. Y nos muestra un enlace a un archivo compartido en google drive.

![image_010](/assets/images/content/CTF/Kavacon-2020/impostor2/image_010.PNG){: .align-center}

> https://drive.google.com/file/d/1P9m61ZMyfWC6g3-Jl-fd937_2ILMoYhX/view?usp=sharing

Un código QR que al escanearlo nos da otro link acortado.

Hasta este punto estaba tratando de mantener el contador de "Diego te odio" en 0, pero ya con tanta URL allá y acá, le agregaremos un `1`. 

![image_011](/assets/images/content/CTF/Kavacon-2020/impostor2/image_011.PNG){: .align-center}

> https://acortar.link/P3z1K

Un link hacia un grupo de whatsapp?. Ok, esto es nuevo.

![image_012](/assets/images/content/CTF/Kavacon-2020/impostor2/image_012.PNG){: .align-center}

Una vez que ingresas, en la descripción de este puedes ver lo que pareciera ser una contraseña.

![image_013](/assets/images/content/CTF/Kavacon-2020/impostor2/image_013.PNG){: .align-center}

> m4nz4n4z2018

El nombre del grupo era `verde` y tenemos una posible contraseña. Probemos con el archivo comprimido que está en ese directorio.

```bash
/verde$ unzip mi_legado.zip 
Archive:  mi_legado.zip
[mi_legado.zip] tehedescubierto password: 
  inflating: tehedescubierto
```

Otro archivo. Si revisamos, sería un archivo de texto, que ha su vez trae algo en binario.

```bash
/verde$ file tehedescubierto 
tehedescubierto: ASCII text, with very long lines

/verde$ cat tehedescubierto 
01000100 01110101 01110010 01100001 01101110 01110100 01100101 00100000 01101101 01101001 01110011 00100000 01100111 01110101 01100001 01110010 01100100 01101001 01100001 01110011 00001010 01101110 01101111 01100011 01110100 01110101 01110010 01101110 01100001 01110011 00101100 00100000 01110000 01110101 01110011 01100101 00100000 01100101 01110110 01101001 01100100 01100101 01101110 01100011 01101001 01100001 01110010 00001010 01100011 01101111 01101101 01101111 00100000 01100010 01101100 01100001 01101110 01100011 01101111 00100000 01100111 01110101 01100001 01110010 01100100 01100001 01100010 01100001 00100000 01110011 01110101 01110011 00100000 01100110 01101111 01110100 01101111 01110011 00001010 01100011 01101111 01101110 00100000 01101101 01110101 01100011 01101000 01100001 00100000 01110011 01100101 01100111 01110101 01110010 01101001 01100100 01100001 01100100 00001010 01101100 01101111 00100000 01100101 01110011 01100011 01110101 01100011 01101000 01100101 00100000 01100100 01100101 01100011 01101001 01110010 00100000 01110001 01110101 01100101 00100000 01110011 01110101 00100000 01100011 01101111 01101110 01110100 01110010 01100001 01110011 01100101 11110001 01100001 00001010 01100101 01110011 00100000 01100101 01101100 01110011 01100101 01100011 01110010 01100101 01110100 01101111 01100100 01100101 01101100 01101100 01110101 01101110 01101001 01110110 01100101 01110010 01110011 01101111 00100000 01101101 01100001 01110011 00100000 01110011 01110101 00100000 01100001 11110001 01101111 00100000 01100100 01100101 00100000 01101110 01100001 01100011 01101001 01101101 01101001 01100101 01101110 01110100 01101111 00001010 01100101 01101100 00100000 01110100 01101001 01100101 01101110 01100101 00100000 00110011 00110000 00100000 01100001 11110001 01101111 01110011 00101100 00100000 01100100 01100101 01100010 01101111 00100000 01100011 01100001 01101100 01100011 01110101 01101100 01100001 01110010 00100000 01100100 01100101 01110011 01110000 01110101 01100101 01110011 00100000 01100011 01110101 01100001 01101110 01100100 01101111 00100000 01101110 01100001 01100011 01101001 01101111 00101110
```

Lo pasamos a texto plano y vemos qué dice.

> Durante mis guardias nocturnas, puse evidenciar como blanco guardaba sus fotos con mucha seguridad
> lo escuche decir que su contraseña es elsecretodelluniverso mas su año de nacimiento el tiene 30 años, debo calcular despues cuando nacio.

Osea: `elsecretodelluniverso1990`

Ahora nos vamos a probar con el archivo comprimido que estaba en la carpeta de `blanco`.

```bash
/blanco$ unzip peligro.zip 
Archive:  peligro.zip
[peligro.zip] MiSecreto.jpg password: 
  inflating: MiSecreto.jpg           
  inflating: mis_pass.txt
```

2 archivos que serían 1 imagen y 1 archivo de texto.

![image_014](/assets/images/content/CTF/Kavacon-2020/impostor2/image_014.PNG){: .align-center}



Asumiendo ya a estas alturas que puede ser un stego, seguimos con el archivo de texto, que nos muestra un comando para descargar una imagen.

```bash
/blanco$ cat mis_pass.txt 
sudo wget https://www.mibolsillo.com/__export/1600536607400/sites/debate/img/2020/09/19/impostor_among_us_crop1600536607033.jpg_1902800913.jpg
```

La descargamos y vemos qué es.

![image_015](/assets/images/content/CTF/Kavacon-2020/impostor2/image_015.PNG){: .align-center}

Una imagen descargada de un archivo que se llamaba "mi_pass", nos puede dar indicio que acá se encuentra la contraseña de la imagen que trae stego.

Si nos fijamos en el texto, podríamos deducir posibles contraseñas, incluidas todas sus variantes:

- Defeat
- Nick
- O2
- thanelys

Vamos probando con cada una en la primera foto (`MiSecreto.jpg`), y con "thanelys" nos extrae el archivo `flag.txt`.

```bash
/blanco$ steghide extract -sf MiSecreto.jpg 
Anotar salvoconducto: 
anotó los datos extraídos en : "flag.txt".
```

La revisamos y...

```bash
/blanco$ cat flag.txt 
Por fin!!! muy bien, efectivamente el impostor era el blanco

KVC{EL_BL4NC0_ERA_EL_IMPOSTOR!!}
```



¡¡Finalmente hemos dado con la flag!! 🏁🏆

------

Uno de los tantos desafíos entretenidos del CTF de Kavacon 2020 que se recompensaba la paciencia con unos 600 puntitos de una.

Supimos como mantener el contador lo más bajo posible, sin la necesidad de apelar a agüitas de melisa, o cosas por el estilo.

Ahora, ya se amarró con continuar la trilogía. Quizás qué nos traerá. 🤔

Y lo siento mucho Diego, pero el trolleo que ocurrió en el paso final, me lo llevaré a la tumba .😂

![image_000](/assets/images/content/CTF/Kavacon-2020/impostor2/image_000.PNG){: .align-center}
