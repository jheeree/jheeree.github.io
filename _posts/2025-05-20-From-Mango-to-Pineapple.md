---
classes: wide
title: "From Mango to Pineapple 🍍"
date: 2025-05-20
header:
  teaser: /assets/images/content/MANGO/mango023.jpeg
  teaser_home_page: true
categories:
  - POST
tags:
  - POST
  - "2025"
  - "mango"
  - "pineapple"
  - "wifi"
---

Luego de un buen periodo de tener tirado este humilde blog, encontré nuevamente la motivación (y el tiempo) para poder redactar algo que me gustó mucho probar. Sobre todo porque hace rato tenía ganas de jugar con algo como esto. Así que menos bla bla, y vamos al grano.

{% include toc icon="cog" title="Contenido" %}

## • ¿Qué es un **WiFi Pineapple**?

El **WiFi Pineapple** es un dispositivo compacto y portátil, diseñado especialmente para la auditoría y pruebas de seguridad en redes inalámbricas. Su uso se enfoca principalmente en la realización de pruebas de penetración y análisis de vulnerabilidades en redes Wi-Fi, con el objetivo de identificar debilidades en la seguridad.

Entre sus funcionalidades más destacadas se incluyen:

- Creación de puntos de acceso falsos**,** donde simular redes Wi-Fi legítimas para atraer dispositivos y analizar su comportamiento.
- Ataques Man-in-the-Middle (MitM), para interceptar la comunicación entre dispositivos conectados a una red, permitiendo la captura y modificación de los datos transmitidos.
- Captura de credenciales, contraseñas y otros datos sensibles, que pueden ser utilizados para identificar brechas en la seguridad de una red.
- Un largo etcétera…

A lo largo de los años, han existido varios modelos de WiFi Pineapple, cada uno diseñado para ofrecer diferentes niveles de potencia, rendimiento y funcionalidades adicionales. Desde modelos compactos y de bajo consumo, como el WiFi Pineapple Nano, hasta versiones más avanzadas y robustas, como el WiFi Pineapple Mark VII, que incluyen soporte para redes de 2.4 GHz y 5 GHz, así como múltiples radios para auditorías simultáneas. De la versión Enterprise no hablaremos, ya que el enfoque que tendrá este post no va apuntando a esta parte de la billetera 😅 (a menos que quieras jugar con $949.99 USD, sin mencionar los costes de envíos y tasas de importe).

Ya que mencionamos la “**Mark VII**”, hablemos un poco de su hardware. 

A grandes rasgos posee un procesador SoC MIPS de núcleo único, 256MB de RAM, 2GB de almacenamiento EMMC, 3 antenas de alta ganancia dedicadas para operar en 2.4 GHz (para 5GHz hay que usar un módulo adicional), puerto USB-C para alimentación, puerto USB 2.0 para conectar dispositivos adicionales, entre otros puntos importantes.

## • Hablemos del “Mango” 🥭
<img src="/assets/images/content/MANGO/mango000.jpeg" alt="mango" style="width: 500px;" class="align-center" />

Dispositivos para hacer un clon de la pineapple hay por montones, pero dependerá de lo que tengas disponible y de lo que requieras. En este caso, para fines educativos y autodidacta (y ahorrar plata xD) adquirí este modelo.

“Mango” N300 Mini Wireless Router (o por su nombre técnico GL-MT300N-V2), es un mini router económico (ronda los 29 USD), ultraligero, y alimentado por USB. Viene con OpenWrt preinstalado (guiño guiño 😏).  Está basado en un SoC MT7628NN a 580 MHz con 128 MB de RAM y 16 MB de flash. Ofrece suficiente potencia de cómputo y flexibilidad de configuración, a un precio y factor de forma muy inferior a la Mark VII, pero considerando que nos estamos ahorrando una buena cantidad de dólares, y que también jamás le sacarás el 100% de uso en hardware, no está demás 😉

El contenido dentro de la caja consiste en un router, un cable Ethernet Cat.6, y un cable USB micro B que nos servirá para la alimentación de energía.

<img src="/assets/images/content/MANGO/mango001.jpeg" alt="mango" style="width: 500px;" class="align-center" />


Si quisiéramos comparar ya más ordenado el hardware de la Mark VII y el Mango, sería así:

| **Característica** | **GL‑MT300N V2** | **WiFi Pineapple Mark VII** |
| --- | --- | --- |
| **CPU** | MT7628NN @ 580 MHz (MIPS single‑core) | MIPS single‑core Network SoC |
| **RAM** | 128 MB DDR2 | 256 MB DDR |
| **Almacenamiento** | 16 MB NOR Flash | 2 GB eMMC |
| **Wi‑Fi** | 2.4 GHz 802.11b/g/n, 1 radio | 2.4 GHz 802.11b/g/n (5 GHz con adaptador) 3 radios role‑based |
| **Antenas** | Internas | 3 × SMA alta ganancia |
| **Puertos** | 1 WAN, 1 LAN, 1 USB 2.0, Micro‑USB | USB‑C Power/Ethernet, USB 2.0 host |
| **Peso** | 39 g | ≈ 230 g |
| **Precio aprox (a la fecha de este post)** | USD 29.90 | USD 299 |

## • Manos a la acción!

<div>⚠️☝️ Este post es estrictamente con fines educativos y no me hago responsable del uso que se le dé, ni de daños, pérdida de datos o anulación de garantía que pueda derivarse de seguir estos pasos. Procede bajo tu propio riesgo y, ante cualquier duda, conserva siempre una copia del firmware original. </div> {: .notice--warning}

Comenzamos conectándolo a una fuente de alimentación, y por temas de comodidad establecemos conectividad mediante cable Ethernet (entre tener que estar colocando contraseñas de Wifi a cada rato, no sale muy práctico que digamos hacerlo por la otra vía). Importante, en el router deberás conectar el cable ethernet por la boquilla LAN.

Una vez hecho esto, esperamos a que el DHCP nos entregue una IP, y mediante navegador nos vamos la URL ‘http://192.168.8.1’. Nos saldrá un panel de bienvenida, junto con un asistente de configuración inicial del equipo. Seleccionamos idioma (en el caso mío Español), y luego a siguiente.

![](/assets/images/content/MANGO/mango002.png){: .align-center}

Nos pedirá establecer una contraseña de administración. En este punto da lo mismo la coloquen, ya que más adelante entre cambios de firmware la pueden volver a cambiar.

![](/assets/images/content/MANGO/mango003.png){: .align-center}

Y listo. Una vez hecho lo anterior, ya estamos dentro del panel de administración.

![](/assets/images/content/MANGO/mango004.png){: .align-center}

Dentro de las cualidades que posee el equipo, te permite establecer una señal inalámbrica para el uso convencional que se le daría, además de poder configurar una para “invitados” (nada mal sinceramente).

![](/assets/images/content/MANGO/mango005.png){: .align-center}

Permite la configuración de VPN tanto en modo cliente como servidor.

![](/assets/images/content/MANGO/mango006.png){: .align-center}

Además, te permite realizar la instalación de “complementos” para potenciar el uso del dispositivo.

![](/assets/images/content/MANGO/mango007.png){: .align-center}

Se ve super atractivo el router con las capacidades que ofrece por defecto. Pero este post va enfocado a otro tema. Entonces, a lo que vinimos!

Lo primero, tendremos que descargar una serie de archivos que son de vital importancia. Nos dirigimos al sitio [https://firmware-selector.openwrt.org](https://firmware-selector.openwrt.org/), buscamos el modelo de nuestro router (GL.iNet GL-MT300N V2), y seleccionamos la versión 19.07.7. Si te da problemas para mostrar el binario a descargar, te recomiendo seleccionar primero la versión, y luego haces la búsqueda del modelo (o puedes hacer click directo en este enlace con el filtro aplicado [https://firmware-selector.openwrt.org/?version=19.07.7&target=ramips%2Fmt76x8&id=gl-mt300n-v2](https://firmware-selector.openwrt.org/?version=19.07.7&target=ramips%2Fmt76x8&id=gl-mt300n-v2) ). Le damos al botón “sysupgrade” y guardamos el archivo en alguna ubicación para más tarde.

![](/assets/images/content/MANGO/mango008.png){: .align-center}

Siguiente paso, dirigirnos al repositorio [https://github.com/xchwarze/wifi-pineapple-cloner](https://github.com/xchwarze/wifi-pineapple-cloner). Acá podremos asegurarnos que nuestro dispositivo se encuentra dentro del listado soportado. 

![](/assets/images/content/MANGO/mango009.png){: .align-center}

Nos vamos a la sección de descargas, y luego buscamos el modelo de nuestro dispositivo “GL-MT300N V2” (tip: usando CTRL +F y luego colocas el modelo para buscar más rápido). Debemos fijarnos en la versión 19.07.7 que es justamente la versión de firmare que descargamos en el paso anterior.

![](/assets/images/content/MANGO/mango010.png){: .align-center}

Hasta este punto iba todo bien cuando estuve investigando sobre como cargar el firmware, y en varios tutoriales mencionaban sobre “configura tal IP en tu máquina, presiona X botón por 8912736186253618 mil segundos, desenchufa y enchufa el dispositivo mientras saltas en una pata, y bla bla bla”. Si bien es útil para hacer que corra el dispositivo en modo recovery (lo cual no está malo saberlo), es muchísimo más fácil hacerlo desde la misma interfaz actual que posee el dispositivo, ahorrándote unos buenos minutos en el proceso.

Nos vamos a “Sistema>Actualizar>Actualización Local”

![](/assets/images/content/MANGO/mango011.png){: .align-center}

Luego subimos el archivo que descargamos del sitio de OpenWrt (el archivo que empezaba con “openwrt-19.07.7………….), y luego le damos a “Instalar”.

![](/assets/images/content/MANGO/mango012.png){: .align-center}

Comenzará el proceso de “downgrade” de la versión de OpenWrt que trae el Mango, el cual lo tenemos que dejar solo por un par de minutos. Aprovecha mientras tanto de enderezar la espalda y tomar agua 😁

![](/assets/images/content/MANGO/mango013.png){: .align-center}

La ventana del navegador no dirá mucho una vez que se complete el proceso 😅 así que la señal para saber si está listo o no, es que estén las tres luces led encendidas permanentemente.

<img src="/assets/images/content/MANGO/mango014.jpeg" alt="mango" style="width: 500px;" class="align-center" />

Además, ahora también será otra dirección IP a la cual tendremos que acceder por navegador. Puedes verificarlo al observar lo que entregó el DHCP en tu tarjeta de red (por eso mencionaba al principio del post que salía más conveniente hacer todo este proceso mediante red cableada en lugar de Wifi 👀).

![](/assets/images/content/MANGO/mango015.png){: .align-center}

Al ingresar ahora a la IP (en este caso http://192.168.1.1), veremos un login distinto. El pie del sitio nos confirmará al cambio de firmware exitoso.

Ahora tendremos que configurar una nueva contraseña para el usuario root (esto porque no seleccioné “Guardar configuración” al momento de instalar el firmare.

![](/assets/images/content/MANGO/mango016.png){: .align-center}

Una vez hecho eso y ya habernos autenticado, nos vamos a la pestaña “System”, y luego a la opción “Backup/Flash Firmare”.

![](/assets/images/content/MANGO/mango017.png){: .align-center}

Bajamos un poco y encontraremos la opción “Flash new firmware image”. Acá es donde tendremos que subir la imagen que descargamos desde el repositorio de Gitlab.

![](/assets/images/content/MANGO/mango018.png){: .align-center}

Seleccionamos el archivo, y luego le damos a la opción “Upload”.

![](/assets/images/content/MANGO/mango019.png){: .align-center}

Nos dará un pequeño resumen sobre la integridad del archivo, y luego le damos a “Continue”. En mi caso desmarqué la casilla “Keep setting and ….”, ya que partiré de la base sobre que es un dispositivo nuevo que hay que configurar desde cero.

![](/assets/images/content/MANGO/mango020.png){: .align-center}

Nuevamente este proceso tomará un par de minutos, en los que no sabremos nada por la pantalla del navegador, pero si que nos dirá las 3 luces led. Además, notaremos nuevamente en el DHCP de la interfaz de red que se cambió el segmento de red. Ahora es una 172.168.42.0/24

![](/assets/images/content/MANGO/mango021.png){: .align-center}

Dicho esto, ahora tendremos que acceder por navegador a la IP 172.16.42.1 en mi caso, por el puerto 1471, en donde saltará la pantalla de bienvenida de la configuración inicial.

Luego de comenzar, saltará a una pantalla en la que nos sugiere apretar 2 veces el boton de reset de forma rápida. Justo no alcancé a tomar captura de esto, pero créanme.👌🏻

![](/assets/images/content/MANGO/mango022.png){: .align-center}

Aprovecharemos este punto para ir conectando alguna antena externa que tengamos por ahí, de esas que soportan modo monitor 👀 (en mi caso una RT5370**)**, y le damos los 2 toques al botón de reset (botón al lado del puerto USB).

<img src="/assets/images/content/MANGO/mango023.jpeg" alt="mango" style="width: 500px;" class="align-center" />

Seguimos con la configuración, en donde nos pedirá establecer una contraseña que nos servirá tanto para la interfaz Web y SSH. Procuren colocar una contraseña robusta y no pongan “piña123” please 🙏🏻.

Seleccionamos nuestra zona horaria (en mi caso GMT-4). Luego asignamos un nombre la SSID que tendrá el dispositivo, seguido de su respectiva contraseña. Esto será para poder acceder a la administración del dispositivo al estar conectados a la señal wifi que emita.

![](/assets/images/content/MANGO/mango024.png){: .align-center}

Configuramos el filtrado de clientes, y también de SSID (aquí ya esto es a gusto de ustedes).

![](/assets/images/content/MANGO/mango025.png){: .align-center}

Y por supuesto, una vez que ya leímos la licencia y los términos y condiciones de uso, marcamos ambas casillas y completamos la configuración, porque obviamente leímos estas cosas, cierto?

![](/assets/images/content/MANGO/mango026.png){: .align-center}

Luego nos redirigirá al panel de autenticación, colocamos nuestras credenciales…

![](/assets/images/content/MANGO/mango027.png){: .align-center}

Y listo! habemus piña! 🍍 El dispositivo ya está listo para ir metiendo mano en cuanto a customización se requiera darle 😏

![](/assets/images/content/MANGO/mango028.png){: .align-center}

![](/assets/images/content/MANGO/mango029.gif){: .align-center}

**Dato plus**: antes de comenzar a tirar escaneos, recomiendo descargar la “OUI Database” (Identificador Único Organizacional), la cual contiene la información sobre los fabricantes e identificadores de dispositivos en base a los primeros 24 bits iniciales de una dirección MAC).

Pero, cómo lo hago si la piña no tiene acceso a internet?

![](/assets/images/content/MANGO/mango030.png){: .align-center}

Pues tendremos que habilitarla en modo cliente. Para ello nos vamos a “Networking”, luego en la sección que dice “Interface actions” apagamos el modo monitor (Monitor OFF), luego en la sección “WiFI Client Mode” le damos a “Refresh”, y seleccionamos la interfaz que usaremos. En mi caso es “Wlan1”. Luego le damos a “Scan” para buscar la señal WiFi nuestra para conectarnos a internet.

![](/assets/images/content/MANGO/mango031.png){: .align-center}

Buscamos la señal, colocamos su respectiva contraseña, y luego le damos a “Connect”

![](/assets/images/content/MANGO/mango032.png){: .align-center}

Y listo. Ya tenemos la piña conectada a internet, y lista para descargar la OUI Database, así como también para comenzar a descargar módulos, pero eso ya lo veremos en el siguiente post, donde hablaremos sobre unas mejoras con cierto enfoque 🌚

![](/assets/images/content/MANGO/mango033.png){: .align-center}

Sé ético. Recuerda que esto es con fines de aprender y reforzar la seguridad de tus propias redes o de quienes te den el permiso. No seas (tan) malo con ese vecino (sabes a lo que me refiero), y actúa con responsabilidad.

Nos vemos! Happy Hacking ✌🏻


## • Referencias

- [https://www.gl-inet.com/products/gl-mt300n-v2/](https://www.gl-inet.com/products/gl-mt300n-v2/)
- [https://docs.hak5.org/wifi-pineapple](https://docs.hak5.org/wifi-pineapple)
- [https://shop.hak5.org/products/wifi-pineapple](https://shop.hak5.org/products/wifi-pineapple)

---
