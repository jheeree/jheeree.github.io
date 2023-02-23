---
layout: single
classes: wide
title: "CTF-Q4 - Writeup - Impostor"
date: 2020-10-06
header:
  teaser: /assets/images/content/CTF/Q4-2020/impostor/image_001.PNG
  teaser_home_page: true
categories:
  - CTF
  - Writeup
tags:
  - CTF
  - "2020"
  - "Q4"
excerpt: "Un equipo de astronautas tripulantes de la nave espacial “WaloSpace” acaban de aterrizar en la tierra, durante el descenso tuvieron dificultades de oxígeno, por lo que toda la tripulación esta inconsciente en estos momentos."
---
<img src="/assets/images/content/CTF/Q4-2020/impostor/image_001.PNG" style="zoom: 67%;" />

> Un equipo de astronautas tripulantes de la nave espacial “WaloSpace” acaban de aterrizar en la tierra, durante el descenso tuvieron dificultades de oxígeno, por lo que toda la tripulación esta inconsciente en estos momentos, además, por desgracia, se encontró el
> cuerpo del Cdte Celeste, líder de este equipo de tripulantes. Mientras los médicos intentan despertar a los astronautas, se le ha encomendado como misión revisar el servidor que estaba a bordo para poder encontrar alguna pista de lo que sucedió y quién asesino al Comandante.

[+] IP: 68.183.137.189
[+] By barto & dplastico &  l4tin-HTB

------

En lo personal, me gustó mucho este desafío, ya que se pone a prueba la paciencia y la tolerancia a la frustración por sobre lo técnico, con el solo hecho de ver que no termina nunca la recolección de información. 😂 En cada paso que das, te puedes encontrar con algo que puede traer más y más y más evidencias. 

Creo no haber sido el único que se preguntó "¿qué tipo de estupefaciente habrá ingerido el Diego al momento de hacer el desafío?". 

Pero esa es la gracia de los retos. Que nos hagan pensar y de tratar de encontrar la manera de llegar a una solución.

------

Comenzamos realizando un escaneo de puertos a la dirección IP indicada para ver a qué nos enfrentamos.

```
$ nmap -p- -n --open -T5 --min-rate=5000 -v 68.183.137.189
.
.
 PORT   STATE SERVICE
 22/tcp open  ssh
 80/tcp open  http
.
.
```

2 puertos abiertos. Veamos qué más trae.

```
$ nmap -p22,80 -sV -sC -n -T5 --min-rate=5000 -v 68.183.137.189
.
.
 PORT   STATE SERVICE VERSION
 22/tcp open  ssh     OpenSSH 8.2p1 Ubuntu 4ubuntu0.1 (Ubuntu Linux; protocol 2.0)
 80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
 | http-methods: 
 |_  Supported Methods: GET POST OPTIONS HEAD
 |_http-server-header: Apache/2.4.41 (Ubuntu)
 |_http-title: Apache2 Ubuntu Default Page: It works
 Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
.
.
```

SSH y HTTP. Al parecer por este último será el desarrollo del desafío.

Ingresamos al navegador. A simple vista podemos ver que se trata de la página por defecto que usa el servicio Apache, y que además está siendo alojada en un servidor con sistema operativo Ubuntu.

![](/assets/images/content/CTF/Q4-2020/impostor/image_002.PNG)

Se busca más detalles con whatweb para ver si encontramos algo que se nos escape.

```bash
$ whatweb http://68.183.137.189
 http://68.183.137.189 [200 OK] Apache[2.4.41], 
 Country[UNITED STATES][US], 
 HTTPServer[Ubuntu Linux][Apache/2.4.41 (Ubuntu)], 
 IP[68.183.137.189], 
 Title[Apache2 Ubuntu Default Page: It works]
```

De esto, nada relevante. Ni siquiera en código en fuente. 🤷‍♂️

Continuamos con `dirsearch` para enumerar archivos y directorios. Ya que es un servidor apache, se considera la extensión `php` dentro de las búsquedas.

```bash
$ dirsearch -u http://68.183.137.189/ -e php,html,txt -f -w /usr/share/wordlists/dirb/big.txt -t 50
   
 Extensions: php, html, txt | HTTP method: get | Threads: 50 | Wordlist size: 81872
 
 Target: http://68.183.137.189/
 
 [13:00:51] Starting: 
 [13:01:42] 200 -  952B  - /cafe/                         
 [13:02:50] 403 -  279B  - /icons/                      
 [13:02:54] 200 -   11KB - /index.html          
 [13:04:18] 403 -  279B  - /server-status/          
 [13:05:00] 200 -    3KB - /webadmin/                 
                                                 
 Task Completed
```
De los resultados obtenidos, 2 llaman la atención. El directorio `webadmin` y el directorio `cafe`.

Revisamos primero qué hay en el directorio `webadmin`.

![](/assets/images/content/CTF/Q4-2020/impostor/image_003.PNG)

Comienza a tener sentido con la imagen de la descripción del desafío. Una imagen de fondo con los personajes de la tripulación de `Among Us`.

Si seguimos revisando bien, notaremos algo en el código fuente.

![](/assets/images/content/CTF/Q4-2020/impostor/image_004.PNG)

Una línea comentada haciendo alusión a una ruta `68.183.137.189/celeste`.  Nos dirigimos a ella y vemos que nos muestra algo.

![](/assets/images/content/CTF/Q4-2020/impostor/image_005.PNG)



Al revisar el archivo `bitacora_del_cdte.txt` podemos ver que trae a simple vista lo que parece ser un mensaje en código binario.

![](/assets/images/content/CTF/Q4-2020/impostor/image_006.PNG)

Lo que traducido a texto nos diría lo siguiente:

> Mi querida tripulación, antes de partir a este viaje intergaláctico quiero decirles que son los mejores, por desgracia, como todos saben, a última hora se me ordenó que dos integrantes más viajaran con nosotros, no se cuales son sus capacidades pero entre todos podremos cumplir con la misión. Recuerden revisar sus directorios antes de viaje CDTE CELESTE

Antes de continuar, y ya procesando un poco el cómo seguirá el desafío, creo que ya han notado de que tendremos directorios asociados a los colores de los personajes. Sobre todo si recordamos que anteriormente `dirsearch` nos mostró entre sus resultados `cafe`.

Posibles rutas deducidas en base a los colores de la tripulación que aparece de fondo en `webadmin`:

- http://68.183.137.189/celeste

- http://68.183.137.189/rosado

- http://68.183.137.189/blanco

- http://68.183.137.189/azul

- http://68.183.137.189/cafe

- http://68.183.137.189/negro

- http://68.183.137.189/rojo

- http://68.183.137.189/verde

- http://68.183.137.189/amarillo

- http://68.183.137.189/morado

Seguiremos con `cafe`.

![](/assets/images/content/CTF/Q4-2020/impostor/image_007.PNG)

Vemos que hay un archivo llamado `notas_personales`. Revisemos qué dice.

> ```
> Si llego a morir quiero que al menos los que descubran mi cuerpo lean esto:
> 
> Desde el primer dia blanco estuvo muy cercano al cdte., incluso creo que recibio un regalo de él
> Rojo que estaba de segundo al mando, nunca lo entendio, siempre dijo que era mejor que él, ademas, fue regañado por usar siempre el mismo código de acceso 20911, y el cdte ordenó que no tengan claves numericas
> ROsada se la pasa de novia, no hace mas que dibujar y andar con negro todo el tiempo
> Amarillo esta triste, aún no comprende lo que sucede
> Azul no es mucho aporte, pese a que fue el último en subir a la nave, creo que no lo conocemos realmente
> NEGRO SOLO conversa con rosada, creo que esos dos ocultan algo...
> ```

Después de este relato podemos ver que nos llama la atención cierta información que podríamos usar en algún momento, que sería:

- Blanco recibió un regalo del comandante.

- Rojo usaba siempre el mismo código de acceso (`20911`).

- Negro y Rosada ocultan algo.

  

Ahora, seguiremos con la ruta `http://68.183.137.189/rosado`

![](/assets/images/content/CTF/Q4-2020/impostor/image_008.PNG)

Un archivo llamado `pequeño proyecto.txt`. Veamos qué tiene.

> ```
> En este pequeño proyecto que he creado deje la prueba con la que descubriré lo secretos de morado llegando a tierra.
> 
> http://telegram.me/Amongusrosa_bot
> ```

Un link que te lleva a un bot de telegram.

![](/assets/images/content/CTF/Q4-2020/impostor/image_009.PNG)

![](/assets/images/content/CTF/Q4-2020/impostor/image_010.PNG)

En resumen de este punto, el bot de Rosada nos puede ayudar a descubrir los secretos de `morado`. Tenerlo en consideración.

Seguiremos con `http://68.183.137.189/blanco`.

![](/assets/images/content/CTF/Q4-2020/impostor/image_011.PNG)

Veamos qué trae `notas_curiosas.txt`:

> ```
> No me gusta la cena que dan en la cafeteria
> 
> - hoy pille a rojo con una revista de adultos debajo de su almohada jajaja que niño rata
> 
> Extraño ver el futboll, asi que hicimos una cancha para jugar cerca de la electricidad, tuvimos que mover muchas cajas antes
> 
> - hoy me di cuenta que entre rosa y negro pasa algo mas que "trabajo" 1313
> 
> ::::::::::: todo se fue al carajo, ell cdte fue encontrado muerto, alguien de aqui es un asesino...
> 
> - El cdte celeste era muy rudo, me dejo su brujula para cuand etemos en tierra, lo extraño
> - Hoy fuimos a analizar unas muestras, y morado estuvo muy distraido, nervioso todo el dia...
> 
> - hoy me di cuenta que verde utiliza la misma frase secreta para todo alaska2019 por último cambiar el año no?
> 
> - Los dias han estado tensos, ya nadie se habla como antes, ahora hay bandos y todos los dias pelean, creo que azul oculta algo, no viene a desayunar hace dias...
> 
> - Amarillo se la pasa en las camaras de seguridad, pero a mi no me engaña, utiliza la red satelital para algo, sospechoso.
> 
> - Hoy me puse a pelear con rojo, como el esta al mando piensa que no soy lo suficientemente bueno como para destruir asteroides... lo odio.
> ```

De estas notas podemos rescatar lo siguiente:

- Se aclara cual fue el regalo que recibió de Celeste, lo que sería una brújula. No tiene mayor importancia.
- También sospecha de que rosa y negro andan en algo raro.
- `Verde` usa `alaska2019` como frase secreta para todo. Considerar este punto.



Seguiremos con la ruta del `azul`.

![](/assets/images/content/CTF/Q4-2020/impostor/image_012.PNG)

Vemos que trae un archivo comprimido. Veamos si encontramos algo.

![](/assets/images/content/CTF/Q4-2020/impostor/image_013.PNG)

Al descomprimir el .zip, de todos los archivos que aparecen, el único que nos llama la atención es `cat hint.png`. Lo revisamos y....

<img src="/assets/images/content/CTF/Q4-2020/impostor/image_014.PNG"  />

> Uds pueden!!!! no se rindan!!!! concentrense y con calma, no es una carrera es solo diversión

Contador de "**Diego te odio**" = `1`.

Seguiremos con `http://68.183.137.189/negro`, pero algo anda mal. Al visitar la ruta, vemos que esta no existe.

![](/assets/images/content/CTF/Q4-2020/impostor/image_015.PNG)

Continuamos con `http://68.183.137.189/rojo` para no perder tiempo.

![](/assets/images/content/CTF/Q4-2020/impostor/image_016.PNG)

Vemos que existe un documento llamado `investigación propia.docx`. Veamos qué trae.

![](/assets/images/content/CTF/Q4-2020/impostor/image_017.PNG)

Nada que nos pueda servir. Ni siquiera en los metadatos.

Seguimos con `http://68.183.137.189/verde`.

![](/assets/images/content/CTF/Q4-2020/impostor/image_018.PNG)



Descargamos el zip. Al tratar de descomprimirlo, pide contraseña. No realizaremos fuerza bruta aún ya que todavía nos quedan colores por recorrer. Puede que nos topemos con algo de camino.

Continuamos con `http://68.183.137.189/amarillo/`.

![](/assets/images/content/CTF/Q4-2020/impostor/image_019.PNG)

Un archivo llamado `lovelove`. Si lo revisamos nos muestra los siguiente:

![](/assets/images/content/CTF/Q4-2020/impostor/image_020.PNG)

Un mensaje en base64 que tras traducirlo nos dice:

> Se que mi amorcito me ama mucho, en el fondo aunque sea gruñon es super tierno, aunque no me gusto mucho que se acercara a rosa, ni menos que le pillara su contraseña: powerrangerrosa como me prometio que cambiaria espero que ya tenga todo lo rosa eliminado

De esto podemos rescatar que :

- Amarillo conoce la contraseña de su amorcito (no sabemos aún quien es), y sería `powerrangerrosa`. La tendremos en consideración.

Finalmente, llegamos a `http://68.183.137.189/morado`. Y nos percatamos que trae un archivo comprimido.

![](/assets/images/content/CTF/Q4-2020/impostor/image_021.PNG)

Este archivo también se encuentra protegido con contraseña, pero si recuerdan, rosada nos va a dar esa clave. O más bien el bot de telegram. Lo dejaremos en standby mientras.

Ahora recapitulando todo lo obtenido hasta el momento, tenemos 1 contraseña que no sabemos a quien o qué cosa pertenece (`powerrangerrosa`), y 1 archivo comprimido (aparte del último que acabamos de encontrar) que está protegido con contraseña que desconocemos (`mis_cosas.zip`- verde). 

Probamos y ...

![](/assets/images/content/CTF/Q4-2020/impostor/image_022.PNG)

Nos topamos con estos archivos. El único que nos sirve es el `negro_te_pille.txt`, el cual trae lo siguiente:

> Ya me entere de que negro cambio su ruta en el server, y se puso /negrocabron/ es un mal nacido...

Vaya vaya. Esto nos ayuda a entender el motivo por el cual no veíamos nada con la ruta del negro. Veamos a qué nos lleva.

![](/assets/images/content/CTF/Q4-2020/impostor/image_023.PNG)

Si revisamos el archivo `mi grupo` podemos ver lo siguiente:

> ```
> Después de mucho tiempo pensando donde guardar mis notas, mejor me decidi por telegram, ojala algun dia pueda compartir mi viaje con otros https://t.me/joinchat/AAAAAEZfjXcHVCNXkzXzcg
> ```

Podemos ver que también trae un link de telegram. Esta vez corresponde a un canal.

![](/assets/images/content/CTF/Q4-2020/impostor/image_024.PNG)

![](/assets/images/content/CTF/Q4-2020/impostor/image_025.PNG)

![](/assets/images/content/CTF/Q4-2020/impostor/image_027.PNG)

<img src="/assets/images/content/CTF/Q4-2020/impostor/image_026.jpg" style="zoom:50%;" />

Puntos importantes:

- Negro usa la clave `24356`.
- En el papel que se comparten entre rosada y morado dice `sorpresaMDFS`. Posible clave de algo?. Recuerdan el bot de telegram?. De quien era el bot?. Así es. De rosada.

Nos vamos a probar lo que pillamos y ...

<img src="/assets/images/content/CTF/Q4-2020/impostor/image_028.PNG" style="zoom: 80%;" />

Contador de "**Diego te odio**" = `2`.

Luego de un bueeeeeeeen rato, llegó la iluminación. Qué pasaba si colocábamos un `/` antes de `sorpresaMDFS`?. En el fondo es un bot, no?.

![](/assets/images/content/CTF/Q4-2020/impostor/image_029.PNG)

Contador de "**Diego te odio**" = `3`.

Dimos con la clave `anubis1321` que supuestamente pertenece a los archivos de `morado`(antecedentes.zip).

Probamos y ...

![](/assets/images/content/CTF/Q4-2020/impostor/image_030.PNG)

Nos muestra más archivos. Entre ellos, otro zip protegido con contraseña (contador de "**Diego te odio**" = `4`). 

Probamos con todas las claves recopiladas hasta el momento, pero no sucede nada. Es hora de aplicar fuerza bruta.

Para ello usaremos `fcrackzip` y el viejo confiable diccionario `rockyou`.

```
$ fcrackzip -v -D -u -p /usr/share/wordlists/rockyou.txt fotos.zip 
found file 'verdeconamarillo.txt', (size cp/uc    523/  4595, flags 9, chk 8da5)           

PASSWORD FOUND!!!!: pw == sisadmin
```

Hemos encontrado la contraseña `sisadmin`, y con ella logramos llegar al archivo `verdeconamarillo.txt`. Veamos qué trae.

> >++++++++[<++++++++>-]<+.>++++++++++++++[<++++++++++++++>-]<-----------.>++++++++++++[<------------>-]<++++.>+++++++++[<--------->-]<+++.>+++++++++[<+++++++++>-]<+++.>++++[<---->-]<+.>+++[<+++>-]<.-------.++++++++.>+++++++++[<--------->-]<++.>+++++++++[<+++++++++>-]<----.----.----.-.>+++[<+++>-]<++.>++++++++[<-------->-]<---.>+++[<--->-]<---.>+++++++++[<+++++++++>-]<-.++.---.--.--------.>++++[<++++>-]<-.>+++[<--->-]<--.----.>++++[<++++>-]<---.---.-.>+++++++++[<--------->-]<+++.>++++++++[<++++++++>-]<+.>++++[<++++>-]<++.>++++[<---->-]<++.>++++[<++++>-]<--.>+++[<--->-]<-.+++++.>++++[<---->-]<+++.>++++[<++++>-]<+.-----.--------.>++++++++[<-------->-]<-----.>+++++++++[<+++++++++>-]<++.>+++[<--->-]<-.>+++++++++[<--------->-]<++++++++.>++++++++[<++++++++>-]<++++++++.-------.+.>+++[<+++>-]<+.+++.>++++++++[<-------->-]<---.>+++[<--->-]<---.>+++++++++[<+++++++++>-]<-----.>+++[<--->-]<--.>++++++++[<-------->-]<-.>+++++++++[<+++++++++>-]<++++.-------.-----.------.--.>++++++++[<-------->-]<-.>++++++++[<++++++++>-]<++++++.>+++[<+++>-]<.+++++.-----.>+++++++++[<--------->-]<++.>++++++++[<++++++++>-]<+++.>+++[<+++>-]<+++.-.>+++++++++[<--------->-]<+++.>++++++++[<++++++++>-]<+++++.>++++[<++++>-]<+.>++++[<---->-]<+++.-----.+.>+++[<+++>-]<.>+++[<--->-]<--.++++++.--------.>++++++++[<-------->-]<-.>++++++++[<++++++++>-]<++++.+.>++++++++[<-------->-]<-----.>+++++++++[<+++++++++>-]<-----.>+++[<--->-]<--.>++++++++[<-------->-]<-.>+++++++++[<+++++++++>-]<----.++++++++.>++++[<---->-]<.>++++[<++++>-]<---.++.>++++[<---->-]<+.>++++++++[<-------->-]<-----.>+++++++++[<+++++++++>-]<----.--------.>++++++++[<-------->-]<-----.>++++++++[<++++++++>-]<++++++.>++++[<++++>-]<-.>++++[<---->-]<.>++++++++[<-------->-]<-----.>++++++++[<++++++++>-]<+.>++++[<++++>-]<+..>++++[<---->-]<+++.---.-.>++++[<++++>-]<+++.>++++[<---->-]<---.+++.---.>+++++++[<------->-]<----.>+++[<--->-]<---.>+++++++++[<+++++++++>-]<++.>+++++++++++[<+++++++++++>-]<+++++++.>++++++++++++[<------------>-]<+++++++++.+++.>++++++++++[<---------->-]<-.>++++++++++[<++++++++++>-]<-.>+++++++++[<--------->-]<++++.>+++++++++[<+++++++++>-]<+++.-----.>+++[<--->-]<---.--.>++++++++[<-------->-]<-.>++++++++[<++++++++>-]<+++++.>++++[<++++>-]<--.---.>+++[<--->-]<--.>++++[<++++>-]<---.>++++[<---->-]<-.>++++[<++++>-]<+.>+++++++++[<--------->-]<-.>++++++++[<++++++++>-]<+.>++++++++[<-------->-]<-.>+++++++++[<+++++++++>-]<-----..-------.++.------.>++++[<++++>-]<+.>+++++++++[<--------->-]<-.>++++++++[<++++++++>-]<+.>++++++++[<-------->-]<-.>+++++++++[<+++++++++>-]<+++.>+++[<--->-]<--.----.>++++[<++++>-]<---..>++++[<---->-]<-.>++++++++[<-------->-]<-.>+++++++++[<+++++++++>-]<++++++++.>+++++++++[<--------->-]<--------.>++++++++[<++++++++>-]<++++.+.--.++++++.>+++[<+++>-]<.------.-------.>++++[<++++>-]<--.>+++++++++[<--------->-]<--.>++++++++[<++++++++>-]<+.>++++++++[<-------->-]<-.>+++++++++[<+++++++++>-]<+++.-----.>+++[<--->-]<--.>+++[<+++>-]<++.++++.>+++++++++[<--------->-]<--.>+++++++++[<+++++++++>-]<.++++.>++++[<---->-]<.>++++++++[<-------->-]<-----.>+++++++++[<+++++++++>-]<-----.+++.++++.>+++++++++[<--------->-]<--.>++++++++[<++++++++>-]<+.>++++[<++++>-]<++.>++++[<---->-]<++.>++++[<++++>-]<--.>+++[<--->-]<-.+++++.+.++++.>+++++++++[<--------->-]<--.>++++++++[<++++++++>-]<+++++++.>++++[<++++>-]<--.>++++[<---->-]<----.>++++[<++++>-]<+.>++++[<---->-]<++.---.>++++[<++++>-]<+.---.-.>+++++++++[<--------->-]<+++.>+++++++++[<+++++++++>-]<-----.>+++[<--->-]<--.>++++++++[<-------->-]<-.>+++++++++[<+++++++++>-]<--------.+++++.--------.>+++[<+++>-]<.+++.-----.>+++[<--->-]<---.++.++++++.>++++++++++++[<++++++++++++>-]<------.>++++++++++++[<------------>-]<+++++++++++.>+++++++++[<--------->-]<+++.>++++++++[<++++++++>-]<+++++.>+++[<+++>-]<.>+++++++++[<--------->-]<+++.>+++++++++[<+++++++++>-]<++++.-------.>+++++++++[<--------->-]<+++.>++++++++[<++++++++>-]<++++.+++++.>+++[<+++>-]<.>++++[<---->-]<+++.--.>++++[<++++>-]<+.-----.+++.>+++[<--->-]<.++++++.>++++++++++[<---------->-]<-.>++++++++++[<++++++++++>-]<+++++.>++++[<---->-]<++.--.>++++[<++++>-]<-.>++++[<---->-]<+++.>++++[<++++>-]<-.-----.>+++++++++[<--------->-]<++.>++++++++[<++++++++>-]<++++.+.>++++++++[<-------->-]<-----.>++++++++[<++++++++>-]<+++++.+++++++..+++.++++.>+++++++++[<--------->-]<--.>++++[<++++>-]<-.>++++++++[<++++++++>-]<+++++++.>++++[<---->-]<-.>++++[<++++>-]<---.>++++[<---->-]<++.+.--.>+++[<+++>-]<+++.-.>++++[<---->-]<+++.>+++[<+++>-]<+++.>+++[<--->-]<---.>++++[<++++>-]<+.>+++[<--->-]<.+++..+++.++++.----.-.>+++[<--->-]<--.>+++[<+++>-]<+++.--.+++.----.---.------.++.>++++[<++++>-]<--.>++++++++[<-------->-]<----.>++++++[<------>-]<-..>+++++[<+++++>-]<---.

Al parecer, esto corresponde a brainfuck (lenguaje de programación esotérico). 

Buscamos un interprete online para ver qué dice.

> Aún tengo miedo, prometieron asesinarme si hablo, la unica foto con evidencia de la muerte me fue arrebatada, sólo m toca esperar a llegar a tierra y decirles a todos que los asesinos guardaron la información en un directorio secreto de ellos /verdeconamarillosoncomplices/

Esta historia parece que ya está por llegar a su fin. Ya que han pillado evidencia que compromete a verde y a amarillo como posibles impostores. 

Vamos a la ruta que nos menciona en el mensaje.

![](/assets/images/content/CTF/Q4-2020/impostor/image_031.PNG)

Un archivo de texto, que trae ...

> ```
> uggcf://qevir.tbbtyr.pbz/svyr/q/1ULn-v4Y1yQursbuGF5vLGN-LvwQagbqW/ivrj?hfc=funevat
> ```

Esto corresponde a ROT13, que tras su decodificación sería :

> https://drive.google.com/file/d/1HYa-i4L1lDhefohTS5iYTA-YijDntodJ/view?usp=sharing

Un link a un archivo alojado en google drive.

![](/assets/images/content/CTF/Q4-2020/impostor/image_032.PNG)

Corresponde a otro archivo comprimido que dentro tiene una imagen.

Adivinen. Tiene contraseña 🤦‍♂️ pero no perdamos la calma. Se acuerdan que aun no hemos utilizado `alaska2019`?. Intentamos y ...

![](/assets/images/content/CTF/Q4-2020/impostor/image_033.jpg)

¡Hemos dado con el impostor!. F por Celeste.

Pero aún no llegamos a la flag. ¿Será steganografía?.

Luego de múltiples intentos y el error de asumir que tendría contraseña (como todo lo anteriormente), nos damos cuenta que bastaba con extraer sin necesidad de esta. Esto sería con:

```
$ steghide --extract -sf 1601331002551.jpg
 Anotar salvoconducto: 
 anotó los datos extraídos en "evidencia.txt".
```

Contador de "**Diego te odio**" = `5`.

Vemos qué dice y ...

> Espero esta foto pueda ser analizada llegando a tierra si es que no logro sobrevivir.
>
> Q4{El_v3rd3_3r4_3l_1mp0st0r_cuek}



¡¡Finalmente hemos dado con la flag!! 🏁🏆



------

Un desafío entretenido, que como bien dijimos en un principio, lo técnico pasaría a segundo plano, ya que solo bastaba con googlear un poco, pero te pone a prueba el nivel de paciencia que tienes jajajaj.

El contador final de  "**Diego te odio**" quedó en `5`. Veamos en cuanto queda para "el impostor II" que dejó prometido xD.
