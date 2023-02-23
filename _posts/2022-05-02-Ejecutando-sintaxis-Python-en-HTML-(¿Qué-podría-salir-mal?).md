---
classes: wide
title: "Ejecutando sintaxis Python en HTML (¿Qué podría salir mal?)"
date: 2022-05-02
categories:
  - POST
tags:
  - POST
  - "2022"
  - "pyscript"
  - "python"
  - "html"
---
Partiendo la semana, un día lunes común y corriente, revisando entre foros me topo con un post en el que se menciona un proyecto llamado “pyscript”, en el que básicamente permitiría ejecutar código Python dentro de etiquetas HTML.

- URL: [https://pyscript.net/](https://pyscript.net/)

La premisa suena bastante interesante. Incluso en el mismo foro comienzan a proponer ideas aleatorias de lo que se podría llegar a hacer.

![Untitled](/assets/images/content/POST/PYSCRIPT/pyscript000.png){: .align-center}

Su uso es bastante sencillo. En el mismo sitio nos muestran 2 opciones que podríamos usar, que sería agregar una etiqueta dentro de nuestro HTML para llamar al recurso directamente (como lo es con varios frameworks web que existen por ahí).

![Untitled](/assets/images/content/POST/PYSCRIPT/pyscript001.png){: .align-center}

O bien podemos descargar un archivo comprimido que contiene los recursos necesarios para poder incluirlos dentro del proyecto web que se esté desarrollando.

![Untitled](/assets/images/content/POST/PYSCRIPT/pyscript002.png){: .align-center}

Link directo del repositorio en Github:

- [https://github.com/pyscript/pyscript](https://github.com/pyscript/pyscript)

## ¿Qué ocurre con el punto de vista en la seguridad?

Es sabido que nada es completamente seguro. Todo es susceptible a tener vulnerabilidades, y cuando estamos hablando de sitios web, esta no es una excepción. 

A modo de ejemplo, acá les dejo un artículo del amigo [b3ta](https://twitter.com/b3t_a) en el que menciona como es posible obtener una shell en los interpretes online de Python.

[IDE Backdoor con Python](https://eh337.net/2020/10/14/ide-backdoor-con-python/)

Sin ir más lejos, podríamos perfectamente abusar de una inyección HTML, para empezar a recopilar información relacionada a la máquina, o inclusive, llegar a obtener una ejecución de comandos en el peor (o tal vez mejor) de los casos.

## PoC

En esta oportunidad, no buscaremos comprometer el equipo, pero se elabora una estructura bastante simple para realizar esta prueba, la cual contempla una creación de carpetas, listado de estas, obtención del usuario logeado, e información muy básica del sistema operativo en uso.

### [+] Código

```html
<html>
   <head>
      <link rel="stylesheet" href="https://pyscript.net/alpha/pyscript.css" />
      <script defer src="https://pyscript.net/alpha/pyscript.js"></script>
   </head>
   <body>
      <py-script>
print("+-----------------------------------------+")
print('[+] PoC py-script')
print("+-----------------------------------------+")

import os
print("[+] Make dir and list")
os.mkdir('blueteam')
os.mkdir('poc')
os.mkdir('jhere')
os.listdir(os.getcwd())
      </py-script>
      <py-script>
print("+-----------------------------------------+")
print("[+] Print user loged")
print("+-----------------------------------------+")
os.getlogin()
      </py-script>
          <py-script>
print("+-----------------------------------------+")
print("[+] OS information")
print("+-----------------------------------------+")
os.uname()
          </py-script>
   </body>
</html>
```

Es posible probar desde cualquier intérprete online de HTML, como por ejemplo [htmledit.squarefree.com](http://htmledit.squarefree.com).

![Untitled](/assets/images/content/POST/PYSCRIPT/pyscript003.png){: .align-center}

Vemos que la salida de texto que obtenemos corresponde a la información de donde está hosteado el recurso directo de py-script. Esto daría a entender que mediante una estructura un poco más trabajada, perfectamente un actor malicioso podría llegar a obtener una shell sobre el host, y posteriormente comprometer la máquina para otros fines.

<div>✅ Esto claramente lo hemos notificado en el repositorio del proyecto para que se puedan tomar las medidas necesarias de prevención.</div>{: .notice--info}

## Conclusión

Nuevas tecnologías aparecerán día a día. Eso está asumido. Pero es nuestra responsabilidad estar avanzando junto con ellas, e incluso adelantarnos a posibles escenarios que se podría enfrentar. Un atacante jamás dudará en buscar todas las vías posibles y existentes para comprometer la seguridad de un activo.

Tampoco quiero dar a entender que este sea un proyecto malo. Es más, está super interesante en el momento que apareció en el foro. Pero así como muchos, suelen presentarse pequeños detalles que se podrían solventar en su avance, y cada uno de nosotros es y será siempre una pieza fundamental para la mejora.
