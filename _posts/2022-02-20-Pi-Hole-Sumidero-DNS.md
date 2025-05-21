---
classes: wide
title: "Pi Hole - Sumidero DNS"
date: 2022-02-20
categories:
  - POST
tags:
  - POST
  - "2022"
  - pihole
---
En más de alguna ocasión nos ha tocado lidiar con anuncios que llegan a ser una molestia al momento de navegar en un sitio web. Anuncios que usualmente no nos interesan en la gran mayoría de los casos, y lo único que logran es afectar la experiencia del usuario (o terminar odiando el producto que se promociona 🤣).

Es común que de igual forma terminemos instalando alguna extensión en nuestro navegador para poder subsanar esto, pero ¿Qué pasa si quiero hacer lo mismo con el navegador que tengo en el teléfono?. Y más aún, ¿Qué pasa con esos datos que se tramitan por detrás de estas extensiones sin que nos demos cuenta?. ¿Irán a parar a un lugar “confiable”?

Pues hay solución, y en esta oportunidad se llama “[Pi Hole](https://pi-hole.net)”.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled.png){: .align-center}


{% include toc icon="cog" title="Contenido" %}

## + ¿Qué es Pi Hole?

“Pi Hole” es una aplicación que nos permitirá bloquear publicidades y rastreadores de internet, pero a nivel de red (algo así como un “sumidero” de DNS, según el mismo sitio), y que además entrega funciones de DHCP (pero eso no lo veremos en esta oportunidad).

Esto quiere decir que tendremos la capacidad de poder bloquear la publicidad y rastreadores de todos los equipos que se encuentren dentro de nuestra red, sin la necesidad de tener que hacer  instalaciones adicionales en nuestros dispositivos. Algo sumamente conveniente para lo que estamos buscando.



## + ¿Cómo funciona?

El protocolo DNS (Domain Name System), básicamente nos permite realizar traducciones de dominios a direcciones IP. Por ejemplo, si queremos visitar un sitio llamado “www.ejemplo.com”, lo que estamos haciendo es mandar una petición al servidor DNS consultando cual es la IP de ese sitio. Luego este nos responde, y luego esa petición seguiría su flujo hacia donde sea que corresponda.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%201.png){: .align-center}

Explicado eso, cuando realizamos una petición que involucra a una publicidad de por medio, esta también es consultada al DNS asociado a nuestra red.

Ejemplo, si mandamos una consulta DNS al dominio “ads.google.com”, se nos resolverán las siguientes IP.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%202.png){: .align-center}

Lo que hace Pi-Hole, es indicar que este tipo de peticiones, sean resueltos con dirección 0.0.0.0, y por consiguiente, no sean mostrados.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%203.png){: .align-center}



## + Pre-requisitos

Pi-Hole no pide mayores recursos. Con tan solo 2GB de espacio libre de almacenamiento como mínimo, y 512 MB de RAM, ya tendríamos totalmente funcional nuestro sumidero. 

Ahora en cuanto a sistema operativo, oficialmente son soportados los siguientes:

| Distribución | Release | Arquitectura |
| --- | --- | --- |
| Raspberry Pi OS | Stretch / Buster / Bullseye | ARM |
| Ubuntu | 16.x / 18.x / 20.x /21.x | ARM / x86_64 |
| Debian | 9 / 10 /11 | ARM / x86_64 / i386 |
| Fedora | 33 / 34 | ARM / x86_64 |
| CentOS | 7 / 8 | x86_64 |

Tendremos que considerar además la disponibilidad de algunos puertos en particular sobre el equipo que lo instalaremos, con el fin de evitar conflictos en el uso de estos con alguna otra aplicación. Estos serían:

| Servicio | Puerto | Protocolo |
| --- | --- | --- |
| pihole-FTL | 53 (DNS) | TCP/UDP |
| pihole-FTL | 67 (DHCP) | IPv4 UDP |
| pihole-FTL | 547 (DHCPv6) | IPv6 UDP |
| lighttpd | 80 (HTTP) | TCP |
| pihole-FTL | 4711 | TCP |


<div>💡 La sigla “FTL” corresponde al demonio de Pi Hole “Faster Than Light”. </div>{: .notice--info}


En caso de estar utilizando IPTables, ufw, o FirewallD, el sitio de la documentación nos entrega el apoyo suficiente para poder configurar nuestras reglas.

- [Firewalls](https://docs.pi-hole.net/main/prerequisites/#firewalls)🔥



## + Instalación

Aprovechando que tengo una Raspberry en estos momentos, realizaremos la instalación en ella, pero en este caso, será con enfoque en Docker. Los pasos no varían casi nada, pero me acomoda mucho más,  ya que tengo varios servicios corriendo en ella.

El modelo en particular de la Raspberry que utilizaremos corresponde a la Pi 4 B, de 4GB, y actualmente está con Ubuntu 21.10. Pero recuerda que si tienes algún otro dispositivo que cumpla con los requisitos previos, no deberías tener mayores complicaciones.

Existen múltiples maneras de instalar Docker. En el siguiente link podrás ver la documentación.

- [Install Docker Engine on Ubuntu](https://docs.docker.com/engine/install/ubuntu/)

Una vez instalado Docker, podemos levantar nuestro contenedor de 2 formas. La primera sería con los siguientes comandos y variables:

```bash
docker run -d \
    --name pihole \
    -p 53:53/tcp -p 53:53/udp \
    -p 80:80 \
    -e TZ="America/Santiago" \
    -v "$(pwd)/etc-pihole:/etc/pihole" \
    -v "$(pwd)/etc-dnsmasq.d:/etc/dnsmasq.d" \
    --dns=127.0.0.1 --dns=1.1.1.1 \
    --restart=unless-stopped \
    --hostname pi.hole \
    -e VIRTUAL_HOST="pi.hole" \
    -e PROXY_LOCATION="pi.hole" \
    -e ServerIP="127.0.0.1" \
    pihole/pihole:latest
```

A modo de explicación rápida sería:

| —name | Nombre del contenedor. |
| --- | --- |
| -p | Puerto a exponer separados por “:”, donde el lado izquierdo es puerto externo (o del host), y lado derecho sería el puerto del contenedor. |
| -e | Variable de entorno. |
| -v | Volumen que montaremos en nuestro contenedor. |
| —dns | Servidor DNS para configuración interna del contenedor. |
| —restart | Con “unless-stopped” nos garantizamos que en caso de reiniciar el host, el contenedor se levante automáticamente. |
| —hostname | Nombre interno del contenedor. Importante en este caso para el uso de Pi Hole. |

O bien, la segunda forma sería primero crear un archivo llamado “docker-compose.yml” con lo siguiente:

```bash
version: "3"

services:
  pihole:
    container_name: pihole
    image: pihole/pihole:latest
    ports:
      - "53:53/tcp"
      - "53:53/udp"
      - "67:67/udp"
      - "80:80/tcp"
    environment:
      TZ: 'America/Santiago'
      TEMPERATUREUNIT: 'c'
      VIRTUAL_HOST: 'pi.hole'
      ServerIP: '127.0.0.1'
      PROXY_LOCATION: 'pi.hole'
    volumes:
      - './etc-pihole:/etc/pihole'
      - './etc-dnsmasq.d:/etc/dnsmasq.d'
      # Ejecuta `touch ./var-log/pihole.log` primmero si quieres evitar los errores
      # - './var-log/pihole.log:/var/log/pihole.log'
    # Recomendado pero no requerido (DHCP necesita NET_ADMIN)
    #   https://github.com/pi-hole/docker-pi-hole#note-on-capabilities
    cap_add:
      - NET_ADMIN
    restart: unless-stopped
```

Y luego tan solo ejecutar el comando:

```bash
docker-compose up -d
```

Si tienes dudas con respecto a las variables de entornos utilizadas, o si deseas configurar alguna en particular durante la instalación, podrás revisar con mayor detalle el siguiente link:

- [https://github.com/pi-hole/docker-pi-hole/blob/master/README.md#environment-variables](https://github.com/pi-hole/docker-pi-hole/blob/master/README.md#environment-variables)



## + Configuración

Para comenzar con la administración de nuestro Pi-Hole, ingresamos mediante navegador a la IP del host donde se encuentra corriendo. En mi caso sería la 192.168.0.20.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%204.png){: .align-center}

Notarán que aparece un aviso, en la cual nos pregunta si queríamos dirigirnos al panel de administración. La parte en azul es un link que nos envía directamente. Sino, en el navegador agregamos “admin” a la url.

```bash
http://192.168.0.20/admin/
```

Al costado izquierdo podrán ver el menú de navegación, donde se muestran breves estadísticas de estado de nuestro host (como el uso de memoria, temperatura, estado, etc), y además vemos el acceso para poder autenticarnos. Le damos a “Login”.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%205.png){: .align-center}

Nos pedirá la contraseña. Si durante la instalación has especificado algún valor para la variable de entorno “WEBPASSWORD”, esta correspondería al panel de acceso. 

Por mi parte no lo recomiendo hacer de esta forma, ya que dejaríamos una credencial en texto plano, y además mucho menos deshabilitar el uso de esta, ya que aquí vamos a estar utilizando buenas prácticas como corresponde👌.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%206.png){: .align-center}

Entonces nos preguntamos, ¿Cómo obtenemos esta contraseña🤔?. Para ello, nos vamos nuevamente al terminal, y con el siguiente comando podremos visualizarla.

```bash
docker logs pihole | grep "password"
```

Por defecto nos entrega una contraseña con caracteres aleatorios. Si quieres evitar tener que estar ejecutando este comando cada vez que quieras ingresar al panel de administración, recomiendo hacer uso de algún gestor de contraseña (de estos hay muchísimos hoy en día).

Una vez autenticado, notaremos que nos aparecerán más gráficos versus a como lo vimos antes, además de nuevas opciones en el menú de navegación del costado izquierdo.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%207.png){: .align-center}



### - Aplicación

Antes de comenzar a realizar configuraciones adicionales, es importante hablar sobre la opción “Gravity”.

Básicamente corresponde a un script que funciona en conjunto con la aplicación. Esta se encarga de actualizar la base de datos con el listado de dominios en lista negra que nos entrega por defecto Pi-Hole, la cual es obtenida desde el siguiente link 

- [https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts](https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts)

Además, se encarga de consolidar en una base única todos los dominios que especifiquemos en lista negra, así como también en lista blanca, e inclusive expresiones regulares en base a algún sitio en particular. Todo esto quedará almacenado en la ruta "/etc/pihole/gravity.db”

Dicho esto, contamos con la opción de agregar listas de dominios adicionales de las fuentes que queramos. Para eso, nos vamos al menú de navegación, luego a sub-menú “Group Management”, y luego a la opción “Adlists”.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%208.png){: .align-center}

Acá podremos agregar las listas que queramos, junto con dejar algún comentario descriptivo de manera opcional. 


<div>💡 Recomiendo dejar alguno que haga alusión a la fecha de cuando lo agregaste, junto con alguna palabra clave que le describa. Esto con la finalidad de tener un orden y algo más claro al momento de gestionarlas a futuro.
Ejemplo : 20220130_Malware </div>{: .notice--info}

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%209.png){: .align-center}

Ahora puede que te preguntes: ¿De donde obtengo estos listados🤔?. Pues dentro de la comunidad de Pi-Hole ya sugieren algunos, pero perfectamente puedes buscarlos en cualquier sitio en lo largo y vasto de internet. Siempre existirá más de algún foro que hablen de ellos. 

Acá dejo a continuación una recopilación propia de algunos que me han servido.

<details>
<summary> Desplegar </summary>
    <a href="https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts">https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts</a><br>
    <a href="https://www.sunshine.it/blacklist.txt">https://www.sunshine.it/blacklist.txt</a><br>
    <a href="https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt">https://raw.githubusercontent.com/Perflyst/PiHoleBlocklist/master/SmartTV.txt</a><br>
    <a href="https://raw.githubusercontent.com/blocklistproject/Lists/master/smart-tv.txt">https://raw.githubusercontent.com/blocklistproject/Lists/master/smart-tv.txt</a><br>
    <a href="http://sysctl.org/cameleon/hosts">http://sysctl.org/cameleon/hosts</a><br>
    <a href="https://s3.amazonaws.com/lists.disconnect.me/simple_tracking.txt">https://s3.amazonaws.com/lists.disconnect.me/simple_tracking.txt</a><br>
    <a href="https://s3.amazonaws.com/lists.disconnect.me/simple_ad.txt">https://s3.amazonaws.com/lists.disconnect.me/simple_ad.txt</a><br>
    <a href="https://reddestdream.github.io/Projects/MinimalHosts/etc/MinimalHostsBlocker/minimalhosts">https://reddestdream.github.io/Projects/MinimalHosts/etc/MinimalHostsBlocker/minimalhosts</a><br>
    <a href="https://raw.githubusercontent.com/StevenBlack/hosts/master/data/KADhosts/hosts">https://raw.githubusercontent.com/StevenBlack/hosts/master/data/KADhosts/hosts</a><br>
    <a href="https://raw.githubusercontent.com/StevenBlack/hosts/master/data/add.Spam/hosts">https://raw.githubusercontent.com/StevenBlack/hosts/master/data/add.Spam/hosts</a><br>
    <a href="https://s3.amazonaws.com/lists.disconnect.me/simple_malvertising.txt">https://s3.amazonaws.com/lists.disconnect.me/simple_malvertising.txt</a><br>
    <a href="https://bitbucket.org/ethanr/dns-blacklists/raw/8575c9f96e5b4a1308f2f12394abd86d0927a4a0/bad_lists/Mandiant_APT1_Report_Appendix_D.txt">https://bitbucket.org/ethanr/dns-blacklists/raw/8575c9f96e5b4a1308f2f12394abd86d0927a4a0/bad_lists/Mandiant_APT1_Report_Appendix_D.txt</a><br>
    <a href="https://v.firebog.net/hosts/Prigent-Malware.txt">https://v.firebog.net/hosts/Prigent-Malware.txt</a><br>
    <a href="https://v.firebog.net/hosts/Prigent-Phishing.txt">https://v.firebog.net/hosts/Prigent-Phishing.txt</a><br>
    <a href="https://phishing.army/download/phishing_army_blocklist_extended.txt">https://phishing.army/download/phishing_army_blocklist_extended.txt</a><br>
    <a href="https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-malware.txt">https://gitlab.com/quidsup/notrack-blocklists/raw/master/notrack-malware.txt</a><br>
    <a href="https://v.firebog.net/hosts/Shalla-mal.txt">https://v.firebog.net/hosts/Shalla-mal.txt</a><br>
    <a href="https://raw.githubusercontent.com/StevenBlack/hosts/master/data/add.Risk/hosts">https://raw.githubusercontent.com/StevenBlack/hosts/master/data/add.Risk/hosts</a><br>
    <a href="https://gitlab.com/curben/urlhaus-filter/raw/master/urlhaus-filter-hosts.txt">https://gitlab.com/curben/urlhaus-filter/raw/master/urlhaus-filter-hosts.txt</a><br>
    <a href="https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate%20versions%20Anti-Malware%20List/AntiMalwareHosts.txt">https://raw.githubusercontent.com/DandelionSprout/adfilt/master/Alternate versions Anti-Malware List/AntiMalwareHosts.txt</a><br>
    <a href="https://raw.githubusercontent.com/HorusTeknoloji/TR-PhishingList/master/url-lists.txt">https://raw.githubusercontent.com/HorusTeknoloji/TR-PhishingList/master/url-lists.txt</a><br>
    <a href="https://zerodot1.gitlab.io/CoinBlockerLists/hosts_browser">https://zerodot1.gitlab.io/CoinBlockerLists/hosts_browser</a><br>
</details><br>


Una vez que ya tengamos agregadas nuestras listas, tocará forzar la ejecución de gravity, ya que si recordamos, este lo hace semanalmente.

Nos vamos nuevamente al menú de navegación, luego al sub-menú “Tools”, y luego en la opción “Update Gravity”.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2010.png){: .align-center}

Luego hacemos click en el botón gigante “Update”, y esperamos a que se complete la ejecución.

Es importante que no naveguemos en otras opciones de Pi-Hole mientras se ejecuta gravity, ya que podríamos interrumpir este y estropear la base de datos que tiene. Además, si has agregado múltiples listas, puede que tarde un tiempo considerable la primera vez. Puedes ir por un bebestible tranquilamente mientras 🍻☕.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2011.png){: .align-center}

Una vez completado el proceso, veremos una ventana con los resultados obtenidos.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2012.png){: .align-center}

Además, si volvemos al menú anterior de administración de adlists, y hacemos click en el ícono de la izquierda de cada uno que agregamos, podremos ver un resumen detallado, como lo sería la cantidad de dominios en la lista, la última vez que se actualizó, etc.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2013.png){: .align-center}

El resultado de todos los dominios en lista negra, lo podremos ver reflejado en el gráfico que nos aparece al inicio de Pi-Hole.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2014.png){: .align-center}



### - Equipo local

Si queremos testear el funcionamiento con únicamente nuestro equipo antes de hacerlo a nivel de red, podemos configurar de forma manual el servidor DNS tranquilamente.

El ejemplo de a continuación será sobre Windows, pero si estás usando alguna distribución de Linux o de MacOS, hay varios tutoriales en google 😉.

Presionamos la tecla de inicio + “r” para que nos aparezca la ventana de “Ejecutar”, luego escribimos “ncpa.cpl”, y luego en “Aceptar”.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2015.png){: .align-center}

Esto nos llevará directo a las conexiones de red disponibles en nuestro equipo.

Dependiendo si estamos conectados por cable o por wifi, seleccionamos el adaptador de red que estamos haciendo uso. Luego nos vamos a “Propiedades”, y luego hacemos doble click en “Habilitar protocolo de Internet versión 4 (TCP/IPv4).

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2016.png){: .align-center}

En la parte de abajo, seleccionamos la opción “Usar las siguientes direcciones de servidor DNS”. Luego especificamos la dirección de nuestro Pi-Hole de los primeros, y algún otro de nuestra preferencia como el DNS alternativo, y finalmente hacemos click en “Aceptar”.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2017.png){: .align-center}

<div>💡 La dirección 1.1.1.1 pertenece a uno de los DNS de Cloudflare por cierto.</div>{: .notice--info}

Si queremos verificar que esté configurado correctamente, en una ventana de CMD puedes ejecutar el siguiente comando.

```bash
ipconfig /all
```

Y verás que en el adaptador de red que estés haciendo uso, aparecerá especificado los DNS que indicamos.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2018.png){: .align-center}



### -Router - Modem

Si queremos testear directamente a nivel de red, tendremos que hacer las modificaciones en nuestro router.

Ya en este punto dependerá del fabricante que estamos utilizando. Por ende, tocará averiguar como  podemos llegar a la opción que nos permita configurar nuestra LAN.

Si ya estamos en ese apartado, al igual que en la opción anterior, indicamos la dirección IP del Pi-Hole como DNS Primario, y configuramos alguno de nuestra preferencia como secundario.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2019.png){: .align-center}

Cualquiera haya sido la opción que elegimos, tocará esperar un momento y generar algo de tráfico para que podamos ver los logs. Esto se podrá visualizar en los gráficos que aparecen al inicio de Pi-Hole, o bien en el menú de navegación nos vamos a “Query Log”.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2020.png){: .align-center}

Adicionalmente podremos realizar búsquedas por cliente, dominio,  o acción en caso de que queramos hacer algún análisis en particular, y además podremos realizar algún acción como sería agregar a una lista blanca o negra.



## + Actualización (Docker)

Al igual que cualquier aplicación, tocará realizar actualizaciones de vez en cuando.

En la pantalla de inicio, estas se mostrarán cuando estén disponibles. Sin embargo, si estamos ejecutando desde un contenedor, se recomienda no tirar de la opción “pihole -up” como se sugiere.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2021.png){: .align-center}

Esta se encuentra enfocada más que nada para cuando lo tenemos instalado de forma directa en nuestro host.

Entonces, ¿Cómo lo hacemos🤔?.

Cuando se libera una actualización nueva, los desarrolladores publican de forma adicional la última versión del contenedor. Si consideramos esto, ya vendría con las buenas prácticas aplicadas. Por ende nos ahorraríamos de eventuales problemas que podrían surgir ante una actualización manual, además de evitar estropear algún archivo que deje corrupto nuestro servicio.

Para ello, lo que haríamos sería eliminar el contenedor. Así tal cual. Pero no te preocupes, ya que los volúmenes que especificamos anteriormente durante su instalación, fue precisamente para tener un respaldo de los archivos necesarios para su funcionamiento. Pero antes que todo, nos aseguramos de descargar la última imagen del contenedor con el siguiente comando:

```bash
docker pull pihole/pihole
```

Luego, borramos de forma forzada el contenedor que estamos haciendo uso:

```bash
docker rm -f pihole
```

Y finalmente, como se realizó durante la instalación, lo levantamos nuevamente junto con las variables que indicamos en primera instancia:

```bash
docker run -d \
    --name pihole \
    -p 53:53/tcp -p 53:53/udp \
    -p 80:80 \
    -e TZ="America/Santiago" \
    -v "$(pwd)/etc-pihole:/etc/pihole" \
    -v "$(pwd)/etc-dnsmasq.d:/etc/dnsmasq.d" \
    --dns=127.0.0.1 --dns=1.1.1.1 \
    --restart=unless-stopped \
    --hostname pi.hole \
    -e VIRTUAL_HOST="pi.hole" \
    -e PROXY_LOCATION="pi.hole" \
    -e ServerIP="127.0.0.1" \
    pihole/pihole:latest
```

o si utilizamos docker-compose:

```bash
docker-compose up -d
```

Podremos validar que esté correctamente levantado al revisar con el comando:

```bash
docker ps -a | grep "pihole"
```

Y una vez que esté todo ok, podremos verificarlo al final de la pantalla de inicio de Pi-Hole.

![Untitled](/assets/images/content/POST/PIHOLE/Untitled%2022.png){: .align-center}



## + Comentarios

Después de casi 1 mes y medio de uso, puedo comentar que me ha impresionado la cantidad de tráfico que ha bloqueado en solo publicidad y rastreadores. En particular cuando se hace uso del smart tv con aplicaciones de streaming, llegando a un punto tal de tener cerca de un 45% de bloqueos en rangos de 24 horas. 

Además de optimizar los tiempos de carga de las páginas, permite tener un mayor control del tráfico, ya que sabes qué es lo que está pasando por debajo, y solo mandas lo justo y necesario a tu proveedor de servicio de internet.

¿Puntos de mejora?, si los hay. A grandes rasgos trataría de algunas aplicaciones gratis que existen para los teléfonos. Pero importante, se debe recordar que para estos casos, es responsable el desarrollo de estas aplicaciones. Así que si al menos no tenemos rooteado, no podremos tocar esto.

Y el otro punto, y creo que es el que molestaría a mucha gente, es la publicidad de Youtube 🤣💔. Hasta el momento de la publicación de este post, he tratado de buscar la forma de poder bloquear el tráfico de la publicidad, sin tener que pasar a llevar algún dominio necesario para la experiencia de usuario. Pero cada intento, resulta en un fracaso 😅. Hasta hace un tiempo si era posible. Pero todo cambió cuando comenzó la época de Youtube Premium. Se debe recordar eso si que algunos creadores de contenido, dependen de los ingresos generados por estas visualizaciones de publicidad. Así que esta parte lo dejaré a tu criterio si deseas ver esa publicidad, no darle importancia, o contratar el famoso plan 👍🏻.



## + Enlaces de referencia

- [https://docs.pi-hole.net](https://docs.pi-hole.net/)
- [https://aws.amazon.com/es/route53/what-is-dns/](https://aws.amazon.com/es/route53/what-is-dns/)
- [https://docs.docker.com](https://docs.docker.com/)
- [https://discourse.pi-hole.net/t/docker-unable-to-bind-to-port-53/45082/](https://discourse.pi-hole.net/t/docker-unable-to-bind-to-port-53/45082/7)
- [https://askubuntu.com/questions/1343609/sudo-unable-to-resolve-host-hostname-temporary-failure-in-name-resolution](https://askubuntu.com/questions/1343609/sudo-unable-to-resolve-host-hostname-temporary-failure-in-name-resolution)
- [https://github.com/pi-hole/docker-pi-hole/blob/master/docker_run.sh](https://github.com/pi-hole/docker-pi-hole/blob/master/docker_run.sh)
- [https://github.com/pi-hole/docker-pi-hole/blob/master/README.md](https://github.com/pi-hole/docker-pi-hole/blob/master/README.md)

---
