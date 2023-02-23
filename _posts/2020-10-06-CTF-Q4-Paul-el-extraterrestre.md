---
layout: single
classes: wide
title: "CTF-Q4 - Writeup Paul el extraterrestre"
date: 2020-10-06
header:
  teaser: /assets/images/content/CTF/Q4-2020/paul/teaser.jpg
  teaser_home_page: true
categories:
  - CTF
  - Writeup
tags:
  - CTF
  - "2020"
  - "Q4"
excerpt: "Paul nuestro amigo hacker, ha llegado a la tierra para ayudarte con algunas misiones."
---
![](/assets/images/content/CTF/Q4-2020/paul/teaser.jpg)

> Paul nuestro amigo hacker, ha llegado a la tierra para ayudarte con algunas misiones.

[+] http://10.150.0.5:1312/

[+] Barto

[+] Reported Difficulty: Entry Level

------

Este fue un desafío web sencillito (pero no menos importante) que nos sirvió para calentar motores en el CTF de Q4-2020 de este fin de semana recién pasado. Por eso seré algo rápido, preciso, y conciso en la explicación de este writeup.

------

El desafío en cuestión ya nos indica que es un servicio `http` corriendo por el puerto `1312`, por ende, nos ahorramos el primer paso de escanear los servicios sobre la dirección IP.

Si ingresamos por navegador, nos toparemos con lo siguiente:

![](/assets/images/content/CTF/Q4-2020/paul/image001.PNG)

Además de toparnos con el amigo Paul👽, si nos damos cuenta, en el título de la página nos muestra la palabra `D3F4C3`, haciendo alusión al término "Defacement", que consiste básicamente en un ataque a un sitio web, cambiando la apariencia visual de una página (generalmente el index.*, o página de inicio), dando a demostrar que esta fue vulnerada por alguien.

Si usamos `whatweb` para ver si se nos escapa algo en primera instancia, obtendremos lo siguiente:

```
$ whatweb http://10.150.0.5:1312/
 http://10.150.0.5:1312/ [200 OK] Apache[2.4.38], 
 Country[RESERVED][ZZ], 
 HTTPServer[Debian Linux][Apache/2.4.38 (Debian)], 
 IP[10.150.0.5], 
 Title[D3F4C3]
```

Además de verificar el título, vemos también que está siendo alojada en un servicio `Apache 2.4.38`. Hasta acá, nada relevante. ¿Por qué digo esto?. Pues porque la imagen más allá de ser una portada, no posee ningún tipo de stego o información oculta. 

Seguimos con la enumeración de directorios. Para ellos usaremos `dirsearch`. Recordamos incluir la extensión `php` dentro de la búsqueda, ya que el servicio era un `apache`.

```bash
$ dirsearch -u http://10.150.0.5:1312/ -e php,html,txt -f -w /usr/share/wordlists/dirb/big.txt -t 50

Extensions: php, html, txt | HTTP method: get | Threads: 50 | Wordlist size: 81872

Target: http://10.150.0.5:1312

[10:41:31] Starting: 
[10:42:17] 200 -   58B  - /ads.txt                       
[10:43:35] 403 -  277B  - /data/                  
[10:44:18] 403 -  277B  - /fonts/                      
[10:44:48] 403 -  277B  - /icons/               
[10:44:52] 403 -  277B  - /img/                
[10:44:54] 200 -  235B  - /index.html          
[10:45:07] 403 -  277B  - /js/                  
[10:45:47] 403 -  277B  - /mp3/                 
[10:46:16] 200 -   59B  - /paul.php                
[10:47:12] 403 -  277B  - /server-status/       
[10:48:19] 403 -  277B  - /wav/                      
                                                
Task Completed 
```

De los resultados obtenidos, el que más nos llama la atención sería en específico `paul.php`. Revisemos qué nos muestra.

![](/assets/images/content/CTF/Q4-2020/paul/image003.PNG)

Una página en blanco😐. Pero si nos fijamos en el título dice `SIMPLE BACKDOOR`. ¿Será que podremos pasar comandos por la url?.

Hacemos la prueba agregando un `?cmd=id` al final de esta y ...

![](/assets/images/content/CTF/Q4-2020/paul/image004.PNG)

Tenemos ejecución de comandos 👀.

Cabe destacar que para los pasos a continuación, no era necesario establecer una reverse shell, ya que todo se podía hacer por la webshell.

Vemos primero con qué usuario estamos.

![](/assets/images/content/CTF/Q4-2020/paul/image005.PNG)

Y luego revisamos la ruta actual junto con los archivos en ella.

![](/assets/images/content/CTF/Q4-2020/paul/image009.PNG)

![](/assets/images/content/CTF/Q4-2020/paul/image010.PNG)

Al parecer, nada concreto que nos llame la atención.

Lo que podríamos hacer es una revisión de archivos de manera recursiva sobre la raíz (`/`), y ver si podemos encontrar la flag un poco más rápido.  Para ello tiramos del comando `ls -lahtR /`

![](/assets/images/content/CTF/Q4-2020/paul/image007.PNG)

Dado a que nos muestra una importante cantidad de información, búscamos con el mismo navegador (`ctrl + f` - `ctrl + b`) la palabra "flag", y veremos que ésta se encuentra en el directorio `/root/`, y además posee permisos de lectura.

Nos basta entonces con hacer un `cat /root/flag.txt` y ...

![](/assets/images/content/CTF/Q4-2020/paul/image008.PNG)

¡¡Habemus flag!! 🏁🏆

------

Como pudimos ver, fue un desafío rápido que nos permitió tener 99 puntitos (casi los 100, ya que nos ganaron la first blood 😅), pero que nos sirvió para preparar el terreno de lo que sería Q4 2020 😉

