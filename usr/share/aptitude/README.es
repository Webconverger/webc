                         Manual de usuario de aptitude

Version 0.6.3

  Daniel Burrows

   <dburrows@debian.org>

   Copyright (c) 2004-2008 Daniel Burrows

   This manual is free software; you can redistribute it and/or modify it
   under the terms of the GNU General Public License as published by the Free
   Software Foundation; either version 2 of the License, or (at your option)
   any later version.

   This manual is distributed in the hope that it will be useful, but WITHOUT
   ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or
   FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
   more details.

   You should have received a copy of the GNU General Public License along
   with this manual; if not, write to the Free Software Foundation, Inc., 59
   Temple Place, Suite 330, Boston, MA 02111-1307 USA

   --------------------------------------------------------------------------

   Tabla de contenidos

   Introduccion

                ?Que es aptitude?

                ?Que es un gestor de paquetes?

                ?Que es el sistema apt?

                ?Como puedo conseguir aptitude?

                             Paquetes pre-compilados de aptitude, o "lo que
                             el 99% de los usuarios deberia hacer".

                             Construir aptitude desde el codigo fuente.

                             Como seguir y participar en el desarrollo de
                             aptitude.

   1. Empezar

                Usar aptitude

                             Introduccion al uso de aptitude.

                             Explorar la lista de paquetes de aptitude.

                             Encontrar paquetes por nombre.

                             Gestionar paquetes

                             Actualizar la lista de paquetes e instalar
                             paquetes.

                Usar aptitude en la linea de ordenes

   2. Guia de referencia de aptitude

                La interfaz de usuario de aptitude en la terminal

                             Usar los menus.

                             Ordenes del menu.

                             Trabajar con varias vistas.

                             Convertirse en root.

                Gestionar paquetes

                             Gestionar la lista de paquetes.

                             Acceso a la informacion de los paquetes.

                             Modificar los estados de los paquete.

                             Descargar, instalar y eliminar paquetes.

                             Llaves GPG: Entender y gestionar la confianza de
                             los paquetes.

                             Gestionar paquetes automaticamente instalados.

                Resolver las dependencias de los paquetes

                             Resolucion de dependencias de aptitude.

                             Resolucion inmediata de dependencias.

                             Resolver dependencias de manera interactiva.

                             Costs in the interactive dependency resolver

                             Configurar el solucionador interactivo de
                             dependencias.

                Patrones de busqueda

                             Buscar cadenas de caracteres.

                             Abreviaturas de terminos de busqueda.

                             Busquedas y versiones.

                             Objetivos explicitos de busqueda.

                             Referencia de los terminos de busqueda.

                Personalizar aptitude

                             Personalizar la lista de paquetes.

                             Personalizar teclas rapidas.

                             Personalizar los colores del texto y estilos.

                             Personalizar el diseno de la interfaz.

                             Referencia del archivo de configuracion.

                             Temas.

                Jugar al Buscaminas

   3. Preguntas mas frecuentes de aptitude

   4. Creditos

   I. Referencia de la linea de ordenes

                aptitude -- interfaz de alto nivel para la gestion de
                paquetes

                aptitude-create-state-bundle -- empaquetar el estado actual
                de aptitude

                aptitude-run-state-bundle -- desempaquetar un archivo de
                estado de aptitude e invocar aptitude sobre este

   Lista de figuras

   2.1. Ordenes disponibles en el menu Acciones.

   2.2. Ordenes disponibles en el menu Deshacer.

   2.3. Ordenes disponibles en el menu Paquete.

   2.4. Ordenes disponibles en el menu Solucionador.

   2.5. Ordenes disponibles en el menu Buscar.

   2.6. Ordenes disponibles en el menu Opciones.

   2.7. Ordenes disponibles en el menu Vistas.

   2.8. Ordenes disponibles en el menu Ayuda.

   2.9. Valores de la marca de "estado actual"

   2.10. Valores de la marca de "accion"

   2.11. Syntax of compound cost components

   2.12. Safety cost levels

   2.13. Sintaxis del termino ?for

   2.14. Estilos personalizables en aptitude

   Lista de tablas

   2.1. Basic cost components

   2.2. Default safety cost levels

   2.3. Guia rapida de terminos de busqueda

   Lista de ejemplos

   2.1. Sample resolver costs

   2.2. Uso del termino ?=.

   2.3. Uso del termino ?bind.

   2.4. Uso del termino ?exact-name.

   2.5. Uso del termino ?for.

   2.6. Uso del termino ?term-prefix.

   2.7. Uso de pattern (patron) para agrupar paquetes en base a su
   desarrollador.

   2.8. Uso de pattern con algunos paquetes del nivel superior.

   2.9. Uso de la directriz de agrupacion pattern con sub-directrices.

   10. Uso de --show-summary.

Introduccion

   Tabla de contenidos

   ?Que es aptitude?

   ?Que es un gestor de paquetes?

   ?Que es el sistema apt?

   ?Como puedo conseguir aptitude?

                Paquetes pre-compilados de aptitude, o "lo que el 99% de los
                usuarios deberia hacer".

                Construir aptitude desde el codigo fuente.

                Como seguir y participar en el desarrollo de aptitude.

     "Maestro, ?posee Emacs la naturaleza del Buda?" pregunto el novicio.

     "No veo porque no," respondio el maestro. "Va sobrado en todo lo
     demas." Varios anos despues, de subito, el novicio alcanzo la
     iluminacion.
                                                                -- John Fouhy

   !Hola y bienvenido al Manual de usuario de aptitude! Esta seccion
   introductoria explica que es aptitude y como conseguirlo; en lo referente
   a informacion de su uso, vease Capitulo 1, Empezar.

?Que es aptitude?

   aptitude es un gestor de paquetes con varias funciones disenado para
   sistemas Debian GNU/Linux, y basado en la infraestructura del conocido
   gestor de paquetes apt. aptitude ofrece la funcionalidad de dselect y
   apt-get asi como otras funciones adicionales que no se encuentran en
   ninguno de los programas anteriormente mencionados.

?Que es un gestor de paquetes?

   Un gestor de paquetes mantiene un registro del software que esta instalado
   en su ordenador, y le permite instalar software nuevo, actualizarlo a
   versiones mas recientes, o eliminar software de una manera sencilla. Como
   su propio nombre sugiere, los gestores de paquetes gestionan paquetes:
   conjuntos de archivos que se agrupan y que puede instalar y eliminar como
   conjunto.

   A menudo, un paquete es un solo programa. Por ejemplo, el cliente de
   mensajeria instantanea gaim se encuentra dentro en un paquete Debian del
   mismo nombre. Por otro lado, es comun que un programa consista de varios
   paquetes relacionados entre ellos. Por ejemplo, el editor de imagenes gimp
   no solo consiste del paquete gimp, sino tambien del paquete gimp-data;
   ademas, hay otros paquetes opcionales tambien disponibles (los cuales
   contienen datos esotericos, documentacion y asi en adelante). Tambien es
   posible que varios programas pequenos y relacionados entre si se
   encuentren en el mismo paquete: por ejemplo, el paquete fileutils contiene
   varias ordenes de Unix, tales como ls, cp, etc.

   Algunos paquetes requieren de otros para funcionar. En Debian, algunos
   paquetes pueden depender de otro, recomendar, sugerir, romper, o entrar en
   conflicto con otros paquetes.

     o Si un paquete A depende de otro paquete B, entonces B es necesario
       para que A funcione correctamente. Por ejemplo, el paquete gimp
       depende del paquete gimp-data para permitir que el editor grafico GIMP
       pueda acceder a sus archivos criticos de datos.

     o Si un paquete A recomienda otro paquete B, entonces B ofrece una
       importante funcionalidad adicional para A que seria deseable en la
       mayoria de las circunstancias. Por ejemplo, el paquete mozilla-browser
       recomienda el paquete mozilla-psm, que anade la capacidad para la
       transferencia segura de datos al navegador web de Mozilla. Aunque
       mozilla-psm no es estrictamente necesario para que Mozilla funcione,
       la mayoria de usuarios desearan que Mozilla permita la transmision de
       datos de manera confidencial (tales como los numeros de una tarjeta de
       credito).

     o Si un paquete A sugiere otro paquete B, entonces el paquete B ofrece a
       A una funcionalidad que puede que mejore A, pero que no es necesaria
       en la mayoria de los casos. Por ejemplo, el paquete kmail sugiere el
       paquete gnupg, el cual contiene software de cifrado que KMail puede
       emplear.

     o Si un paquete A entra en conflicto con otro paquete B, los dos
       paquetes no se pueden instalar a la vez. Por ejemplo, fb-music-hi
       entra en conflicto con fb-music-low porque ofrecen conjuntos
       alternativos de sonidos para el juego Frozen Bubble.

   La labor de un gestor de paquetes es la de presentar una interfaz que
   asista al usuario en la tarea de administrar el conjunto de paquetes que
   estan instalados en su sistema. aptitude proporciona una interfaz que se
   basa en el sistema de administracion de paquetes apt.

?Que es el sistema apt?

   Poder instalar y eliminar paquetes esta muy bien, pero el software basico
   que realiza esta funcion (conocido como dpkg) hace exactamente esto y nada
   mas. Esto es suficiente si se descarga uno o dos paquetes a mano, pero
   enseguida se convierte en una ardua tarea cuando intenta gestionar un
   numero mayor de paquetes. Mas aun, si su flamante paquete nuevo requiere
   software que no ha instalado previamente, tendra que descargarse los
   paquetes requeridos a mano. Y si despues decide eliminar el ya obsoleto
   software, esos paquetes adicionales se quedarian en el sistema consumiendo
   espacio a menos que los elimine manualmente.

   Obviamente, toda esta labor manual es una tarea tediosa, y por ello la
   mayoria de sistemas de gestion de paquetes incorporan software que se
   ocupa de parte o de toda esta labor por Ud. apt proporciona una base comun
   sobre la que construir estos programas: ademas de aptitude, programas
   tales como synaptic y apt-watch hacen uso de apt.

   apt funciona mediante el registro de una lista de los paquetes que se
   pueden descargar desde Debian a su ordenador. Esta lista es util a la hora
   de encontrar los paquetes a actualizar y para instalar paquetes nuevos.
   apt tambien puede resolver problemas de dependencias automaticamente: por
   ejemplo, cuando escoja instalar un paquete, encontrara cualquier paquete
   adicional requerido e instalara esos tambien.

   Cuando use un gestor de paquetes basado en apt, tales como aptitude, por
   lo general realizara tres tareas basicas: actualizar la lista de paquetes
   que estan disponibles mediante la descarga de listas nuevas desde los
   servidores de Debian, seleccionar que paquetes se deberian instalar,
   actualizar o eliminar, y finalmente confirmar sus selecciones llevando a
   cabo las instalaciones, eliminaciones, etc.

   Los sistemas de gestion de paquetes basados en apt leen la lista de
   "fuentes" (<<sources>>, repositorios de paquetes para Debian) del archivo
   /etc/apt/sources.list. El formato y contenido de este archivo estan mas
   alla del alcance de este documento, pero se describen en la pagina de
   manual sources.list(5).

?Como puedo conseguir aptitude?

   En el caso de que este leyendo este manual sin tener aptitude instalado en
   su sistema, esta seccion le ayudara a corregir esta desafortunada
   situacion. La mayoria de usuarios deberian leer directamente la seccion de
   paquetes pre-compilados.

  Paquetes pre-compilados de aptitude, o "lo que el 99% de los usuarios deberia
  hacer".

   Los paquetes pre-compilados, o paquetes "binarios", ofrecen la manera mas
   sencilla y comun de instalar aptitude. Solo se debe intentar una
   instalacion desde las fuentes si los paquetes binarios no estan
   disponibles por alguna razon, o si tiene necesidades especiales que no
   cubren los paquetes binarios.

   Si esta usando un sistema Debian, ejecute la siguiente orden como root
   (administrador): apt-get install aptitude. Si no esta usando un sistema
   Debian, puede que su proveedor de software haya creado un paquete
   pre-compilado de aptitude; puede contactarles para preguntas posteriores
   si no esta seguro.

  Construir aptitude desde el codigo fuente.

   Tambien puede construir aptitude desde las fuentes; por otro lado, este no
   es un ejercicio util a menos que tenga apt ya instalado en su sistema. Si
   lo esta, puede instalar aptitude desde las fuentes mediante los siguientes
   pasos:

    1. Instalar los siguientes programas:

          o Un compilador C++, por ejemplo g++.

          o Los archivos de desarrollo de apt, que generalmente se encuentran
            en un paquete con un nombre parecido a libapt-pkg-dev.

          o La biblioteca libsigc++-2.0, disponible en el paquete
            libsigc++-2.0-dev o desde http://libsigc.sourceforge.net.

          o La biblioteca cwidget, disponible en el paquete libcwidget-dev o
            en http://cwidget.alioth.debian.org.

          o El programa gettext, que deberia estar incluido en su
            distribucion de Linux.

          o Una herramienta make, tal como GNU make.

          o Por ultimo pero no por ello menos importante, descargue la
            version mas reciente del codigo fuente, disponible en
            http://packages.debian.org/unstable/admin/aptitude (desplacese
            hasta la base de la pagina y descargue el archivo
            ".orig.tar.gz").

   Una vez que disponga de todos los componentes necesarios, abra una
   terminal y ejecute la orden tar zxf aptitude-0.6.3.tar.gz para
   desempaquetar el codigo fuente. Una vez que haya desempaquetado el codigo
   fuente, introduzca cd aptitude-0.6.3 && ./configure && make para compilar
   aptitude. Si tiene exito, asegurese de que es el usuario root (usando su,
   por ejemplo), y despues teclee make install para instalar aptitude en su
   equipo. Una vez que haya instalado aptitude con exito, ejecutar aptitude
   en una terminal deberia iniciar el programa.

  Como seguir y participar en el desarrollo de aptitude.

    Obtener las fuentes del arbol de desarrollo de aptitude

   Si quiere probar el codigo fuente mas reciente de aptitude, puede
   descargar el codigo fuente no publicado de aptitude usando Mercurial.
   Instale Mercurial (disponible en http://www.selenic.com/mercurial/) y
   ejecute la orden hg clone http://hg.debian.org/hg/aptitude/head aptitude
   para descargarse el codigo fuente mas reciente.

   [Aviso] Aviso
           El repositorio de aptitude en Mercurial es un arbol de desarrollo
           activo; varia a medida que se corrigen fallos y nuevas
           caracteristicas son anadidas, y no hay ninguna garantia de que
           pueda compilarlo, !no digamos ejecutarlo correctamente! !Los
           informes de error son bienvenidos, pero sea consciente de que esta
           usando el codigo en desarrollo bajo su responsabilidad!^[1]

    Lista de correo

   La lista de correo principal para aptitude es
   <aptitude-devel@lists.alioth.debian.org>. Los archivos de esta lista se
   encuentra en http://lists.alioth.debian.org/pipermail/aptitude-devel/.
   Para suscribirse, visite la pagina web
   http://lists.alioth.debian.org/mailman/listinfo/aptitude-devel.

    Enviar parches

   Preferentemente, los parches se han de enviar a la lista de correo de
   aptitude <aptitude-devel@lists.alioth.debian.org>. Pero si prefiere
   mandarlos a traves de un correo privado, debe hacerlo a
   <aptitude@packages.debian.org> o a <dburrows@debian.org>. Apreciariamos de
   manera especial una breve descripcion de la motivacion que hay detras de
   su parche, y una explicacion de su funcionamiento.

    Seguir los cambios en el arbol de fuentes de aptitude

   El arbol de fuentes de aptitude se actualiza regularmente con nuevas
   caracteristicas, arreglos de fallos, y fallos nuevos. Una vez que el
   codigo fuente este disponible en su ordenador (vease la seccion anterior),
   puede usar cd para acceder a la carpeta y ejecutar hg pull && hg update
   para actualizarlo con cualquier cambio que se haya podido introducir en el
   repositorio central.

   Para recibir notificaciones automaticas cuando se realicen cambios al
   codigo base de aptitude, suscribase a la fuente web RSS disponible en
   http://hg.debian.org/hg/aptitude/head?cl=tip;style=rss.

    Compilar aptitude desde el arbol de desarrollo

   Para compilar aptitude desde el repositorio Mercurial, debe tener
   instalados los programas autoconf y automake. Introduzca sh ./autogen.sh
   && ./configure para generar los archivos necesarios para compilar aptitude
   y ejecute make y make install.

   --------------

   ^[1] Por supuesto, todo el software libre se emplea bajo la
   responsabilidad del usuario, pero el riesgo relacionado con usar un arbol
   de desarrollo activo es mucho mayor.

Capitulo 1. Empezar

   Tabla de contenidos

   Usar aptitude

                Introduccion al uso de aptitude.

                Explorar la lista de paquetes de aptitude.

                Encontrar paquetes por nombre.

                Gestionar paquetes

                Actualizar la lista de paquetes e instalar paquetes.

   Usar aptitude en la linea de ordenes

           Una travesia de mil millas debe empezar con un solo paso.
                                                                   -- Lao Tsu

   aptitude es un programa relativamente grande con muchas caracteristicas, y
   que puede presentar ciertas dificultades al usuario a la hora de
   familiarizarse con el. Este capitulo no describe de manera exhaustiva las
   caracteristicas de aptitude (vease Capitulo 2, Guia de referencia de
   aptitude para ello), pero ofrece una presentacion de las funciones mas
   basicas y empleadas.

Usar aptitude

   Esta seccion describe como usar la interfaz grafica de aptitude. Para
   informacion relacionada con el uso de la interfaz en linea de ordenes de
   aptitude, vease "Usar aptitude en la linea de ordenes".

  Introduccion al uso de aptitude.

   Para iniciar aptitude abra su terminal de texto favorita y, en la linea de
   ordenes, teclee:

 foobar$ aptitude

   Una vez que el almacen se cargue (esto puede llevar algun tiempo en
   maquinas mas lentas), deberia aparecer la pantalla central de aptitude:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1
 --- Paquetes instalados
 --- Paquetes no instalados
 --- Paquetes obsoletos y creados localmente
 --- Paquetes virtuales
 --- Tareas






 Estos paquetes estan instalados en su ordenador.









   Como puede ver, la pantalla principal de aptitude esta dividida en varias
   areas. La linea azul en la parte superior de la terminal es la barra de
   menu, y las lineas inferiores muestran mensajes informativos que describen
   algunas ordenes importantes. El espacio negro a continuacion es la lista
   de todos los paquetes disponibles, en la cual aparecen algunos grupos de
   paquetes. El grupo seleccionado ("Paquetes instalados") esta resaltado, y
   su descripcion se muestra en el espacio inferior en negro.

   Como sugiere la linea superior de la pantalla, puede acceder al menu de
   aptitude pulsando Control+t; tambien puede pulsar sobre el titulo del menu
   si su sistema lo permite. Pulsar Control+t abriria el menu Acciones:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 +-------------------------+  u: Actualizar  g: Descarga/Instala/Elimina Paqs
 |Instalar/eliminar paquetes g     |
 |Actualizar la lista de paquetes u|
 |Olvidar paquetes nuevos         f|
 |Limpiar el almacen de paquetes   |
 |Limpiar ficheros obsoletos       |
 |Marcar actualizable             U|
 |Jugar al buscaminas              |
 |Convertirse en administrador     |
 +---------------------------------+
 |Salir                           Q|
 +---------------------------------+










 Realizar todas las instalaciones y eliminaciones pendientes

   Use las teclas de direccion e Intro para seleccionar los elementos del
   menu (o si su sistema lo permite, pulse sobre ellos con el raton); para
   cerrar el menu sin seleccionar nada, pulse Control+t otra vez. Una
   descripcion del elemento del menu resaltado aparecera en la base de la
   pantalla. Si un elemento del menu se puede activar mediante un atajo de
   teclado, el atajo aparecera en el menu: por ejemplo, puede ejecutar la
   orden "Actualizar la lista de paquetes" pulsando u.

   En cualquier momento, puede pulsar ? para mostrar una tabla de referencia
   en linea con los atajos de teclado disponibles.

  Explorar la lista de paquetes de aptitude.

   La lista de paquetes es la interfaz primaria de aptitude. Al iniciar
   aptitude la lista se organiza en grupos, como puede ver en la siguiente
   imagen:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1
 --- Paquetes instalados
 --- Paquetes no instalados
 --- Paquetes obsoletos y creados localmente
 --- Paquetes virtuales
 --- Tareas






 Estos paquetes estan instalados en su ordenador.









   [Nota] Nota
          aptitude ocultara automaticamente los grupos de paquetes que esten
          vacios, asi que puede que vea mas o menos grupos de los que
          aparecen en esta imagen.

   En la captura de pantalla anterior, el primer grupo ("Paquetes
   instalados") esta resaltado, indicando que esta seleccionado en ese
   momento. Puede navegar a traves de la lista con las flechas de direccion;
   observe que la descripcion en el campo inferior a la lista de paquetes
   varia a medida que navega. Para "expandir" un grupo, pulse Intro cuando el
   grupo este resaltado:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1
 --\ Paquetes instalados
   --- admin - Utilidades de administracion (instalacion de programas, gestion de usuarios, etc)
   --- devel - Utilidades y programas para desarollo de programas
   --- doc - Documentacion y programas especializados para ver documentacion
   --- editors - Editores y procesadores de texto
   --- electronics - Programas para trabajar con circuitos y electronica
   --- games - Juegos, jugetes y programas divertidos
   --- gnome - El sistema de escritorio GNOME
   --- graphics - Utilidades para crear ver y editar ficheros de graficos

 Estos paquetes estan instalados en su ordenador.









   Como puede ver, el grupo "Paquetes instalados" se ha expandido para
   mostrar su contenido: contiene un numero de sub-grupos, definidos de
   manera abierta dependiendo del tipo de software que contienen. Si
   expandimos la seccion "admin" resaltandolo y pulsando Intro, podemos ver:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1
 --\ Paquetes instalados
   --- admin - Utilidades de administracion (instalacion de programas, gestion de usuarios, etc)
     ---principal
   --- devel - Utilidades y programas para desarollo de programas
   --- doc - Documentacion y programas especializados para ver documentacion
   --- editors - Editores y procesadores de texto
   --- electronics - Programas para trabajar con circuitos y electronica
   --- games - Juegos, jugetes y programas divertidos
   --- gnome - El sistema de escritorio GNOME

 Los paquetes en la seccion 'admin' permiten realizar tareas de administracion
 como instalar programas, gestionar los usuarios, configurar y monotorizar tu sistema,
 examinar el trafico de red, y asi sucesivamente.







   El grupo "admin" contiene un solo sub-grupo, el archivo "principal"
   (<<main>>) de Debian. !Si expande este grupo vera algunos paquetes!

   [Sugerencia] Sugerencia
                Para ahorrar tiempo, puede usar la tecla [ para expandir
                todos los sub-grupos de un grupo a la vez. Seleccionar
                "Paquetes instalados" y pulsar [ revelaria inmediatamente los
                paquetes de la imagen inferior.

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1
 --\ Paquetes instalados
   --\ admin - Utilidades de administracion (instalacion de programas, gestion de usuarios, etc)
     --\ principal
 i     acpid                                                1.0.3-19   1.0.3-19
 i     alien                                                8.44       8.44
 i     anacron                                              2.3-9      2.3-9
 i     apt-show-versions                                    0.07       0.07
 i A   apt-utils                                            0.5.25     0.5.25
 i     apt-watch                                            0.3.2-2    0.3.2-2
 i     aptitude                                             0.2.14.1-2 0.2.14.1-2









   Ademas de las flechas de direccion, puede mover la seleccion a traves de
   la lista de paquetes mostrando una pagina de informacion cada vez usando
   las teclas Repag y Avpag.

   [Sugerencia] Sugerencia
                Cuando hay mas informacion en la zona inferior de la pantalla
                de la que cabe en el espacio disponible, puede emplear las
                teclas a y z para desplazarse a traves de la informacion.

  Encontrar paquetes por nombre.

   Para encontrar rapidamente un paquete cuyo nombre conoce, pulse / para
   abrir una ventana de dialogo de busqueda:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1
 i     frozen-bubble                                        1.0.0-5    1.0.0-5
 i A   frozen-bubble-data                                   1.0.0-5    1.0.0-5
 i     geekcode                                             1.7.3-1    1.7.3-1
 i     gfpoken                                              0.25-3     0.25-3
 i     ggz-gnome-client                                     0.0.7-2    0.0.7-2
 i     ggz-gtk-client                                       0.0.7-1    0.0.7-1
 i     ggz-gtk-game-data                                    0.0.7-2    0.0.7-2
 i +--------------------------------------------------------------------------+
 i |Buscar:                                                                   |
 i |froz                                                                      |
 Po|                             [ Aceptar]                       [ Cancelar ]|
 Fr+--------------------------------------------------------------------------+
 attempt to shoot bubbles into groups of the same color to cause them to pop. It
 features 100 single-player levels, a two-player mode, music and striking
 graphics.

 This game is widely rumored to be responsible for delaying the Woody release.

 URL: http://www.frozen-bubble.org/


   Como puede ver en la imagen anterior, una busqueda de froz encuentra el
   paquete frozen-bubble. Es posible encontrar paquetes con criterios
   complejos usando el poderoso lenguaje de busqueda de aptitude, descrito en
   "Patrones de busqueda".

   [Sugerencia] Sugerencia
                Puede buscar hacia atras en la lista de paquetes si pulsa \,
                y puede repetir la ultima busqueda si pulsa n tras cerrar la
                ventana de busqueda.

   A veces es practico ocultar todos los paquetes excepto aquellos que se
   corresponden con un criterio en particular. Para ello, pulse l:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1
 --- Paquetes instalados
 --- Paquetes no instalados
 --- Paquetes obsoletos y creados localmente
 --- Paquetes virtuales
 --- Tareas


   +--------------------------------------------------------------------------+
   |Introduzca el nuevo limite de arbol de paquetes                           |
   |apti                                                                      |
   |                             [ Aceptar ]                      [ Cancelar ]|
 Es+--------------------------------------------------------------------------+









   Este dialogo funciona exactamente igual que el dialogo de busqueda, solo
   que en vez de realzar el siguiente paquete que coincide con lo que ha
   introducido en el cuadro de dialogo, oculta todos los paquetes que no lo
   hacen. Por ejemplo, si teclea apti y pulsa Intro, ocultara todos los
   paquetes excepto aquellos cuyo nombre contiene "apti":

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1
 --\ Paquetes instalados
   --\ admin - Utilidades de administracion (instalacion de programas, gestion de usuarios, etc)
     --\ principal................................................
 i     aptitude                                             0.2.14.1-2 0.2.14.1-2
 i A   synaptic                                             0.51-1     0.51-1
   --\ x11 - El sistema de ventanas X y programas relacionados
     --\ principal......................
 i     xfree86-driver-synaptics                             0.13.3-1   0.13.3-1
 --- Paquetes no instalados
 --- Paquetes virtuales

 Estos paquetes estan instalados en su ordenador









  Gestionar paquetes

   Ahora que sabe navegar a traves de la lista de paquetes, es hora de que
   empiece a usar aptitude para instalar y eliminar paquetes. En esta
   seccion, aprendera como marcar los paquetes para su instalacion,
   eliminacion o actualizacion.

   [Sugerencia] Sugerencia
                Solo puede cambiar la configuracion del sistema como el
                usuario root. Si quiere experimentar con aptitude, puede
                iniciarlo de manera segura como cualquier otro usuario aparte
                de como root sin danar el sistema de ninguna manera. aptitude
                le avisara cuando este intentando hacer algo que solo el
                usuario root puede hacer, y si desea continuar tendra que
                introducir la contrasena de root.

   Todos los cambios a un paquete se realizan primero, resaltandolo en la
   lista de paquetes, y despues pulsando la tecla correspondiente a la accion
   que se deberia realizar. Las teclas de accion basicas ^[2] son +, para
   instalar o actualizar un paquete, - para eliminarlo y = para evitar que un
   paquete se actualice automaticamente (esto se conoce como retener el
   paquete). Estas acciones no se ejecutan inmediatamente; aptitude
   simplemente actualiza la lista de paquetes para mostrar los cambios
   solicitados.

   Por ejemplo, en la siguiente imagen se ha seleccionado el paquete kaffeine
   y la tecla +, pulsada. El paquete esta ahora resaltado en verde, y ha
   aparecido la letra "i" a la izquierda de su nombre para indicar que se va
   a instalar; ademas, se muestra una estimacion del espacio que el paquete
   ocupara en el disco duro.

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1                  Se usara 2925kB del TamDes: 1375kB
   --\ kde - El sistema de escritorio KDE
     --\ principal
 p     bibletime-i18n                                        <none>     1.4.1-1
 p     education-desktop-kde                                 <none>     0.771
 p     junior-kde                                            <none>     1.4
 piA   kaffeine                                      +2843kB <none>     0.4.3-1
 pi    kaffeine-mozilla                              +81.9kB <none>     0.4.3-1
 p     karamba                                               <none>     0.17-5
 p     kde-devel                                             <none>     4:3.1.2
 p     kde-devel-extras                                      <none>     4:3.1.2
 El sistema de escritorio K(utilidades para desarrollo de programas)
 A metapackage containing dependencies for the core development suite of KDE
 including kdesdk, qt3-designer, and all core KDE -dev packages.








   [Sugerencia] Sugerencia
                En cualquier momento puede usar Deshacer -> Deshacer
                (Control+u) para "deshacer" cualquier cambio realizado a uno
                o mas paquetes. Esto es bastante util en caso de que una
                accion tenga consecuencias inesperadas y desee "revertir" los
                paquetes a su estado anterior.

   Aparte de las acciones que afectan a los paquetes de manera individual,
   hay disponible otra accion importante: pulsar U actualiza cualquier
   paquete que tenga una nueva version. Deberia utilizar esta orden de manera
   regular para mantener su sistema siempre actualizado.

    Gestionar paquetes rotos

   A veces, cambiar el estado de un paquete puede causar que ciertos
   requisitos entre dependencias queden incumplidas; los paquetes con
   dependencias no resueltas se denominan rotos. aptitude le avisara cuando
   esto ocurra y describira lo ocurrido. Por ejemplo, esto es lo que pasa si
   intento eliminar sound-juicer:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.3.3       #Roto: 1   Se liberara 48.6MB de espacio del TamDesc
 i A   nautilus                                             2.10.1-4   2.10.1-4
 i     nautilus-cd-burner                                   2.10.2-1.1 2.10.2-1.1
 i A   nautilus-data                                        2.10.1-4   2.10.1-4
 i     netspeed                                             0.12.1-1   0.12.1-1
 i A   oaf                                                  0.6.10-3   0.6.10-3
 i     pybliographer                                        1.2.6.2-1  1.2.6.2-1
 i     rhythmbox                                            0.8.8-13   0.8.8-13
 i     shermans-aquarium                                    3.0.1-1    3.0.1-1
 idA   sound-juicer                                 -1733kB 2.10.1-3   2.10.1-3
 GNOME 2 CD Ripper
 sound-juicer se eliminara.


 Los siguientes dependen de sound-juicer y se romperan debido a su eliminacion:


   * gnome-desktop-environment depende de sound-juicer

 [1(1)/...] Sugiere 1 instalacion
 e: Examinar  !: Aplicar  .: Siguiente  ,: Anterior

   Como puede ver, aptitude muestra tres indicadores de que algo ha ido mal:
   primero, el numero de paquetes rotos se muestra en el area azul superior;
   segundo, la mitad inferior de la pantalla cambia para mostrar los paquetes
   rotos relacionados con el paquete seleccionado en ese momento; tercero, en
   la base de la pantalla aparece una barra con una sugerencia de como
   solucionar el problema. Para encontrar con rapidez paquetes rotos en la
   lista de paquetes puede pulsar b o realizar una busqueda de ?broken.

   [Nota] Nota
          El texto [1(1)/...] indica el progreso del solucionador de
          dependencias de aptitude. El primer numero es la solucion que esta
          seleccionada en ese momento, y el segundo es el numero de
          soluciones que aptitude ha generado. La presencia del texto "..."
          indica que pueden existir algunas soluciones adicionales mas alla
          de las generadas; si aptitude estuviese seguro de haber generado la
          unica solucion posible, este indicador mostraria [1/1].

   Para ver mas informacion de como aptitude piensa que puede solucionar este
   problema, pulse e. Apareceria una pantalla similar a la siguiente:

   Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
                 Paquetes                          Resolver las dependencias
   --\ Mantener los paquetes siguientes en la version actual:
     gstreamer0.8-cdparanoia                           [0.8.10-1 (unstable, now)]
     sound-juicer                                                [2.10.1-2 (now)]
















 [1(1)/...] Sugiere 2 mantenidos
 e: Examinar  !: Aplicar  .: Siguiente  ,: Anterior

   A partir de aqui puede ver mas soluciones si pulsa <<.>>, o volver a las
   soluciones previamente examinadas si pulsa <<,>>. Para aplicar la solucion
   seleccionada en ese momento y volver a la lista de paquetes, pulse !. Por
   ejemplo, si pulsase <<.>> en la pantalla anterior, se le presentaria la
   siguiente solucion:

   Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
                 Paquetes                          Resolver dependencias
   --\ Mantener los paquetes siguientes en la version actual::
     sound-juicer                                      [2.10.1-3 (unstable, now)]
   --\ Desactualizar los paquetes siguientes:
     gstreamer0.8-cdparanoia          [0.8.11-1 unstable, now -> 0.8.8-3 testing]















 [2(2)/...] Sugiere 1 mantenido,1 desactualizacion
 e: Examine  !: Apply  .: Next  ,: Previous

   Ademas de las ordenes basicas disponibles cuando examina las soluciones,
   puede pulsar r para "rechazar" las acciones que desapruebe. Por ejemplo,
   la primera solucion cancelaria la eliminacion de sound-juicer
   !precisamente la accion que intentaba ejecutar! Si pulsa r sobre el
   espacio correspondiente a esta accion, le diria a aptitude que no deberia
   cancelar la eliminacion de sound-juicer de esta manera.

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
                 Paquetes                          Resolver dependencias
   --\ Mantener los paquetes siguientes en la version actual:
     gstreamer0.8-cdparanoia                           [0.8.11-1 (unstable, now)]
 R   sound-juicer                                      [2.10.1-3 (unstable, now)]






 GNOME 2 CD Ripper
 gnome-desktop-environment depende de sound-juicer
 --\ Las acciones siguientes resolveran estas dependencias:
   -> Eliminar gnome-desktop-environment [1:2.10.2.3 (unstable, testing, now)]
 R -> Cancelar la eliminacion de sound-juicer
   -> Desactualizar sound-juicer [2.10.1-3 (unstable, now) -> 0.6.1-2 (testing)]




 [1(1)/...] Sugiere 2 mantenidos
 e: Examine  !: Apply  .: Next  ,: Previous

   Como puede ver, el elemento de la lista correspondiente a la accion de
   mantener la misma version de sound-juicer se ha vuelto roja y marcada con
   una "R", indicando que se ha rechazado. Las soluciones que pudiese generar
   en el futuro (esto es, cualquier solucion que no haya examinado aun) no
   incluirian esta accion, aunque seguirian disponibles las soluciones
   previamente generadas y que contienen esta solucion.

   [Nota] Nota
          En la captura de pantalla anterior, se puede ver una descripcion de
          sound-juicer, el cual se muestra en el centro de la pantalla; bajo
          esta descripcion puede ver la dependencia que causo que
          sound-juicer se haya mantenido en su version actual, ademas de
          todas las maneras que aptitude conoce para resolver esta
          dependencia.

   Por ejemplo, si este rechazo (a una solucion) se impone inmediatamente
   despues de intentar eliminar sound-juicer, pulsar . nos llevaria a la
   siguiente solucion, omitiendo la solucion que cancela la instalacion de
   sound-juicer y que desactualiza gstreamer0.8-cdparanoia.

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
                 Paquetes                          Resolver las dependencias
   --\ Eliminar los paquetes siguientes:
     gnome-desktop-environment              [1:2.10.2.3 (unstable, testing, now)]

















 [2(2)/...] Sugiere 1 eliminacion
 e: Examinar  !: Aplicar  .: Siguiente  ,: Anterior

   Los rechazos solo se aplican a las soluciones generadas en el momento:
   esto es, las soluciones generadas al pulsar <<.>> mientras visiona la
   ultima solucion generada. Las soluciones generadas anteriormente pueden
   aun contener rechazos a ciertas acciones. Puede cancelar un rechazo en
   cualquier momento si selecciona una vez mas la accion rechazada y pulsa r;
   esto permitiria que se generen otra vez las soluciones que contienen la
   accion rechazada, incluyendo cualquier solucion que haya "omitido" con
   anterioridad.

   La contrario a rechazar una accion es aprobarla. Para aprobar una accion
   simplemente seleccione la accion y presione a; esto forzaria al
   solucionador de problemas a escoger esta accion cuando sea posible^[3].
   Las acciones aprobadas se volveran verdes y se marcaran con "A", como
   puede ver en la siguiente imagen:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
                 Paquetes                          Resolver las dependencias
   --\ Eliminar los paquetes siguientes:
     gnome-desktop-environment              [1:2.10.2.3 (unstable, testing, now)]

















 [2(2)/...] Sugiere 1 eliminacion
 e: Examinar  !: Aplicar  .: Siguiente  ,: Anterior

   [Importante] Importante
                Si no resuelve ninguna dependencia rota, aptitude llevara a
                cabo su sugerencia actual automaticamente cuando confirme al
                pulsar g las selecciones que haya hecho. Por otro lado, es
                dificil resolver automaticamente los problemas de
                dependencias, y puede que no le guste el resultado final. Por
                ello, es siempre mejor observar lo que aptitude ha planeado
                hacer antes de llevar a cabo los cambios.

  Actualizar la lista de paquetes e instalar paquetes.

   En este momento, ya sabe lo suficiente acerca de aptitude como para llevar
   a cabo modificaciones en el sistema.

   Deberia actualizar periodicamente su lista de paquetes disponibles desde
   los servidores de Debian para estar al tanto de paquetes nuevos y de
   versiones nuevas de paquetes. Para ello, pulse u. Puede interrumpir la
   descarga en cualquier momento pulsando q.

   Una vez que tenga una lista actualizada de los paquetes, puede elegir que
   paquetes se actualizaran, instalaran o eliminaran, como se ha descrito en
   seccion anterior. Al instalar el paquete kaffeine-mozilla (del ejemplo
   anterior), se nos presenta la siguiente pantalla:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1                  Se usara 2925kB de espacio TamDesc: 1375kB
 --\ Paquetes automaticamente instalados para satisfacer las dependencias
 piA kaffeine                                        +2843kB <none>     0.4.3-1
 --\ Paquetes a instalar
 pi  kaffeine-mozilla                                +81.9kB <none>     0.4.3-1







 Estos paquetes se instalaran porque algun paquete seleccionado para
 instalar los necesita.

 Si selecciona un paquete, en este espacio aparecera una explicacion de su estado actual.





   Como puede ver, aptitude decidio de manera automatica instalar kaffeine en
   mi sistema porque kaffeine-mozilla lo necesita. En este momento, puedo
   escoger entre continuar con la instalacion, pulsando g, o cancelarla,
   pulsando q.

Usar aptitude en la linea de ordenes

   Ademas de la interfaz "grafica" descrita en la seccion anterior, tambien
   puede usar aptitude desde la linea de ordenes de la misma manera que
   usaria apt-get. Esta seccion cubre las ordenes en linea de ordenes mas
   comunes; para mas informacion, vease la guia de referencia en la linea de
   ordenes de aptitude.

   En general, invocar una orden de aptitude en la linea de ordenes presenta
   este aspecto:

   aptitude accion [argumentos...]

   La accion indica a aptitude que accion realizar; los argumentos restantes
   se emplean de una manera especifica dependiendo de la opcion deseada. En
   lineas generales, consisten de nombres de paquetes y de diferentes
   opciones en la linea de ordenes^[4].

   Las acciones mas importantes son:

   aptitude update

           Esta orden actualiza la lista de paquetes, al igual que si el
           usuario ejecuta la interfaz grafica y pulsa u.

   aptitude safe-upgrade

           Esta orden actualiza tantos paquetes como sea posible sin eliminar
           paquetes ya existentes en el sistema.

           Algunas veces es necesario eliminar un paquete para poder
           actualizar otro; esta orden no es capaz de actualizar paquetes en
           tales situaciones. Use la orden full-upgrade para actualizar
           tambien esos paquetes.

   aptitude full-upgrade

           Al igual que safe-upgrade, esta orden llevaria a cabo una
           actualizacion de paquetes, pero es mas agresiva a la hora de
           resolver los problemas de dependencias: instalara y eliminara
           paquetes hasta que todas las dependencias esten resueltas. Debido
           a la naturaleza de esta orden es probable que realice acciones no
           deseadas, y por lo tanto deberia ser cuidadoso a la hora de
           emplearlo.

           [Nota] Nota
                  Por razones historicas, esta orden se llamaba originalmente
                  dist-upgrade, y aptitude aun reconoce este nombre.

   aptitude [ install | remove | purge ] paq1 [paq2...]

           Estas ordenes instalan, eliminan o purgan ^[5] los paquetes
           especificados. "Instalar" un paquete que ya lo esta pero
           susceptible de ser actualizado hara que este se actualice.

   aptitude search patron1 [patron2...]

           Esta orden busca paquetes cuyo nombre contenga cualquiera de los
           patrones, mostrando el resultado en la terminal. Ademas de ser una
           cadena de texto, cada patron puede ser un patron de busqueda tal y
           como se describe en "Patrones de busqueda". ^[6]Por ejemplo,
           "aptitude search gnome kde" mostraria todos los paquetes cuyo
           nombre contenga "gnome" o "kde".

   aptitude show paq1 [paq2...]

           Mostrar informacion sobre cada paq (paquete) en la terminal.

   Todas las ordenes que instalan, actualizan o eliminan paquetes aceptan el
   parametro -s, que simboliza "simular". Cuando se introduce -s en la linea
   de ordenes el programa realiza todas las acciones que haria normalmente,
   pero en la practica no descarga, instala o elimina ningun archivo.

   A veces, aptitude nos presentara un dialogo como este:

 Se instalaran automaticamente los siguientes paquetes NUEVOS:
   space-orbit-common
 Se instalaran los siguiente paquetes NUEVOS:
   space-orbit space-orbit-common
 0 paquetes actualizados, 2 nuevos instalados, 0 para eliminar y 0 sin actualizar.
 Necesito descargar 3200kB de ficheros. Despues de desempaquetar se usaran 8413kB
 ?Quiere continuar? [Y/n/?]

   Ademas de las obvias opciones "Yes" y "No", dispone de un numero de
   ordenes que puede usar para cambiar la informacion mostrada, o para
   especificar futuras acciones. Por ejemplo, pulsar s muestra u oculta
   informacion acerca del espacio que cada paquete usara:

 ?Quiere continuar? [Y/n/?] s

 Se mostraran los tamanos de los cambios.

 Se instalaran automaticamente los siguientes paquetes NUEVOS:
   space-orbit-common <+8020kB>
 Se instalaran los siguiente paquetes NUEVOS:
   space-orbit <+393kB> space-orbit-common <+8020kB>
 0 paquetes actualizados, 2 nuevos instalados, 0 para eliminar y 0 sin actualizar.
 Necesito descargar 3200kB de ficheros. Despues de desempaquetar se usaran 8413kB
 ?Quiere continuar? [Y/n/?]

   De manera similar, pulsar d mostrara informacion acerca de paquetes
   automaticamente instalados o eliminados:

 Se instalaran automaticamente los siguientes paquetes NUEVOS:
   space-orbit-common (D: space-orbit)
 Se instalaran los siguiente paquetes NUEVOS:
   space-orbit space-orbit-common
 0 paquetes actualizados, 2 nuevos instalados, 0 para eliminar y 0 sin actualizar.
 Necesito descargar 3200kB de ficheros. Despues de desempaquetar se usaran 8413kB

   Esto muestra que space-orbit-common se instalara porque space-orbit
   depende de el. Puede ver la lista entera de posibles entradas pulsando ?
   en el dialogo.

   aptitude le preguntara que hacer si su peticion rompe dependencias de una
   manera que no se pueda resolver de una forma sencilla:

 Los siguientes paquetes estan ROTOS:
   libsdl1.2debian
 Se ELIMINARAN los siguientes paquetes:
   libsdl1.2debian-alsa
 .
 .
 .
 Las acciones siguientes resolveran estas dependencias:

 Instalar los paquetes siguientes:
 libsdl1.2debian-all [1.2.12-1 (unstable)]

 La puntuacion es 41

 ?Acepta esta solucion? [Y/n/q/?]

   Pulsar y (o simplemente Intro) aceptara la solucion propuesta. Si pulsa n
   vera la "siguiente mejor" solucion:

 ?Acepta esta solucion? [Y/n/q/?] n
 Las acciones siguientes resolveran estas dependencias:

 Instalar los paquetes siguientes:
 libsdl1.2debian-esd [1.2.12-1 (unstable)]

 Score is 19

 ?Acepta esta solucion? [Y/n/q/?]

   Al igual que en la linea de ordenes, puede realizar un numero de acciones
   adicionales incluyendo alterar manualmente el estado de los paquetes
   desde, el dialogo de resolucion de conflictos. Pulse ? para ver una lista
   completa.

   Si pulsa q, cancelaria el solucionador automatico y le permitiria resolver
   las dependencias manualmente:

 ?Acepta esta solucion? [Y/n/q/?] q
 aptitude no pudo encontrar una solucion a estas dependencias. Puede solucionar estas dependencias manualmente o pulsar <<n>> para salir
 No se satisfacen las dependencias de los siguientes paquetes:
   libsdl1.2debian: Depende de: libsdl1.2debian-alsa (= 1.2.12-1) pero no es instalable o
                             libsdl1.2debian-all (= 1.2.12-1) pero no es instalable o
                             libsdl1.2debian-esd (= 1.2.12-1) pero no es instalable o
                             libsdl1.2debian-arts (= 1.2.12-1) pero no es instalable o
                             libsdl1.2debian-oss (= 1.2.12-1) pero no es instalable o
                             libsdl1.2debian-nas (= 1.2.12-1) pero no es instalable o
                             libsdl1.2debian-pulseaudio (= 1.2.12-1) pero no es instalable
 ?Desea resolver las dependencias manualmente? [N/+/-/_/:/?]

   Puede usar cualquiera de las ordenes de gestion de paquetes para resolver
   las dependencias rotas (pulse ? para una lista completa de las ordenes
   disponibles). Pulse n o Intro para salir de aptitude:

 ?Desea resolver las dependencias manualmente? [N/+/-/_/:/?] n
 Cancela.

   Para una completa documentacion acerca de las caracteristicas de aptitude
   en la linea de ordenes, vease Referencia de la linea de ordenes.

   --------------

   ^[2] Tambien puede cambiar el estado de los paquetes usando el menu
   Paquete; vease "El menu Paquete" para mas detalles.

   ^[3] Aprobar una accion es ligeramente distinto a requerir que todas las
   soluciones contengan esa accion; lo que esto significa es que si se da una
   eleccion entre una accion aprobada y una no aprobada, el solucionador
   siempre escogera la accion aprobada. Si se pueden aplicar varias acciones
   aprobadas, todas ellas seran candidatas a ser presentadas en la solucion.

   ^[4] Una "opcion" es una letra precedida de un guion: por ejemplo, "-a",
   "-v", etc.

   ^[5] Purgar un paquete elimina el paquete, asi como tambien sus archivos
   de configuracion.

   ^[6] De hecho, lo mismo sirve para las ordenes que toman paquetes como
   argumentos, tales como install o show.

Capitulo 2. Guia de referencia de aptitude

   Tabla de contenidos

   La interfaz de usuario de aptitude en la terminal

                Usar los menus.

                Ordenes del menu.

                Trabajar con varias vistas.

                Convertirse en root.

   Gestionar paquetes

                Gestionar la lista de paquetes.

                Acceso a la informacion de los paquetes.

                Modificar los estados de los paquete.

                Descargar, instalar y eliminar paquetes.

                Llaves GPG: Entender y gestionar la confianza de los
                paquetes.

                Gestionar paquetes automaticamente instalados.

   Resolver las dependencias de los paquetes

                Resolucion de dependencias de aptitude.

                Resolucion inmediata de dependencias.

                Resolver dependencias de manera interactiva.

                Costs in the interactive dependency resolver

                Configurar el solucionador interactivo de dependencias.

   Patrones de busqueda

                Buscar cadenas de caracteres.

                Abreviaturas de terminos de busqueda.

                Busquedas y versiones.

                Objetivos explicitos de busqueda.

                Referencia de los terminos de busqueda.

   Personalizar aptitude

                Personalizar la lista de paquetes.

                Personalizar teclas rapidas.

                Personalizar los colores del texto y estilos.

                Personalizar el diseno de la interfaz.

                Referencia del archivo de configuracion.

                Temas.

   Jugar al Buscaminas

     El Conejo Blanco se puso las gafas. 'Por favor, ?por donde podria yo
     empezar, Su Majestad? pregunto.

     'Empieza por el principio' dijo el Rey con gravedad, 'y continua hasta
     que llegues al final: entonces, para.'
                         -- Lewis Carrol, Alicia en el pais de las Maravillas

   aptitude es un programa extenso con varias caracteristicas, y algunas
   veces es dificil recordar como hacer alguna operacion, o incluso si es
   posible. De hecho, muchas de las peticiones que llegan al autor acerca de
   la implementacion de mas caracteristicas describen caracteristicas ya
   presentes, pero dificiles de encontrar.^[7]

   En un intento de combatir esta oscuridad, esta guia de referencia describe
   todas las capacidades y parametros de configuracion de aptitude, vease
   Capitulo 1, Empezar.

   [Nota] Nota
          Puede configurar el comportamiento y la apariencia de aptitude de
          varias maneras. Este manual describe el funcionamiento del programa
          con las opciones predeterminadas; las descripciones de las
          multiples opciones que afectan al comportamiento se detallan en
          "Personalizar aptitude".

La interfaz de usuario de aptitude en la terminal

   Esta seccion describe las partes que componen la interfaz de usuario de
   aptitude en la terminal no relacionadas con gestionar paquetes.

  Usar los menus.

   La barra de menu en la parte superior de la pantalla contiene las ordenes
   mas importantes de aptitude. Para activar la barra de menu, pulse
   Control+t; ahora puede navegar a traves de el seleccionando cualquier
   elemento del menu usando Intro.

   Algunos elementos del menu son accesibles a traves de "teclas de acceso
   directo": numeros o letras que se pueden emplear para seleccionar la
   entrada mientras el menu esta activo. Estos atajos se muestran en un color
   mas claro que el del resto del menu.

   Ademas, algunos elementos del menu poseen "atajos": combinaciones de
   teclas que ejecutan la misma accion que la entrada de menu mientras no
   esta activo. Dispone de una lista de estos atajos en el lado derecho del
   menu.

   De aqui en adelante, las ordenes de menu se escribiran asi:Menu -> Entrada
   (tecla). Esto indica que deberia escoger la Entrada del Menu menu, y esa
   tecla/s es el atajo para esa orden.

  Ordenes del menu.

    El menu Acciones.

   Figura 2.1. Ordenes disponibles en el menu Acciones.

   +------------------------------------------------------------------------+
   |            Orden             |               Descripcion               |
   |------------------------------+-----------------------------------------|
   |                              | Si no hay una previsualizacion          |
   | Acciones ->                  | disponible, muestra una; de no ser asi, |
   | Instalar/eliminar paquetes   | ejecuta un proceso de instalacion tal y |
   | (g)                          | como se describe en "Descargar,         |
   |                              | instalar y eliminar paquetes.".         |
   |------------------------------+-----------------------------------------|
   | Acciones -> Actualizar la    | Actualizar la lista de paquetes.        |
   | lista de paquetes (u)        |                                         |
   |------------------------------+-----------------------------------------|
   |                              | Marcar todos los paquetes               |
   | Acciones -> Marcar           | actualizables, excepto aquellos que     |
   | actualizable (U)             | esten prohibidos o bloqueados para su   |
   |                              | actualizacion.                          |
   |------------------------------+-----------------------------------------|
   | Acciones -> Olvidar paquetes | Descartar toda la informacion referente |
   | nuevos (f)                   | a que paquetes son "nuevos" (vacia el   |
   |                              | arbol "Paquetes nuevos").               |
   |------------------------------+-----------------------------------------|
   |                              | Cancelar toda instalacion, eliminacion, |
   | Acciones -> Cancelar         | actualizacion y retencion pendiente. Es |
   | acciones pendientes          | el equivalente a ejecutar la orden Keep |
   |                              | sobre cada paquete en la base de datos  |
   |                              | de paquetes.                            |
   |------------------------------+-----------------------------------------|
   | Actions -> Limpiar el        | Eliminar todos los paquetes comprimidos |
   | almacen de paquetes          | que aptitude ha descargado ^[a].        |
   |------------------------------+-----------------------------------------|
   |                              | Eliminar cualquier paquete comprimido   |
   |                              | que aptitude descargo ^[a] y que ya no  |
   | Acciones -> Limpiar ficheros | estan disponibles. Se asume que estos   |
   | obsoletos                    | paquetes ya estan obsoletos, y se       |
   |                              | pueden eliminar del disco duro sin      |
   |                              | precisar de una descarga que por otro   |
   |                              | lado seria inutil.                      |
   |------------------------------+-----------------------------------------|
   | Acciones -> Jugar al         | Jugar al Buscaminas, tal y como se      |
   | buscaminas                   | describe en "Jugar al Buscaminas".      |
   |------------------------------+-----------------------------------------|
   | Acciones -> Convertirse en   | Continuar trabajando como el usuario    |
   | administrador                | root, vease "Convertirse en root.".     |
   |------------------------------+-----------------------------------------|
   | Acciones -> Salir (Q)        | Cerrar aptitude guardando cualquier     |
   |                              | cambio hecho al estado de los paquetes. |
   |------------------------------------------------------------------------|
   | ^[a] O cualquier otra herramienta de apt.                              |
   +------------------------------------------------------------------------+

    El menu Deshacer

   Figura 2.2. Ordenes disponibles en el menu Deshacer.

   +------------------------------------------------------------------------+
   |        Orden         |                   Descripcion                   |
   |----------------------+-------------------------------------------------|
   |                      | Cancelar el efecto del ultimo cambio realizado  |
   | Deshacer -> Deshacer | al estado de un paquete hasta el punto en que   |
   | (Control+u)          | aptitude se inicio, la lista de paquetes se ha  |
   |                      | actualizado o en el que un proceso de           |
   |                      | instalacion se llevo a cabo.                    |
   +------------------------------------------------------------------------+

    El menu Paquete

   Figura 2.3. Ordenes disponibles en el menu Paquete.

   +------------------------------------------------------------------------+
   |          Orden          |                 Descripcion                  |
   |-------------------------+----------------------------------------------|
   | Paquete -> Instalar (+) | Marcar el paquete seleccionado para su       |
   |                         | instalacion.                                 |
   |-------------------------+----------------------------------------------|
   | Paquete -> Eliminar (-) | Marcar el paquete seleccionado para su       |
   |                         | eliminacion.                                 |
   |-------------------------+----------------------------------------------|
   | Paquete -> Purgar (_)   | Marcar el paquete seleccionado para que sea  |
   |                         | purgado.                                     |
   |-------------------------+----------------------------------------------|
   |                         | Cancelar toda instalacion, actualizacion o   |
   | Paquete -> Mantener (:) | eliminacion pendiente de ejecucion sobre el  |
   |                         | paquete seleccionado, y eliminar cualquier   |
   |                         | retencion impuesta al paquete.               |
   |-------------------------+----------------------------------------------|
   | Paquete -> Retener (=)  | Retener el paquete seleccionado.             |
   |-------------------------+----------------------------------------------|
   |                         | Marcar al paquete instalado como             |
   | Paquete -> Marcar       | "automaticamente instalado". Para mas        |
   | automatico (M)          | informacion, vease "Gestionar paquetes       |
   |                         | automaticamente instalados.".                |
   |-------------------------+----------------------------------------------|
   |                         | Marcar el paquete seleccionado como          |
   | Paquete -> Marcar       | "manualmente instalado". Para mas            |
   | manual (m)              | informacion referente a paquetes manual y    |
   |                         | automaticamente instalados, vease "Gestionar |
   |                         | paquetes automaticamente instalados.".       |
   |-------------------------+----------------------------------------------|
   |                         | Si se selecciona un paquete susceptible de   |
   | Paquete -> Prohibir     | ser actualizado, prohibe que se actualice a  |
   | versiones (F)           | la version disponible en el servidor. Si     |
   |                         | selecciona la version de un paquete, prohibe |
   |                         | que el paquete se actualice a esa version.   |
   |-------------------------+----------------------------------------------|
   |                         | Mostrar una pantalla que contiene            |
   | Paquete -> Informacion  | informacion acerca del paquete seleccionado, |
   | (enter)                 | tales como de que paquetes depende, asi como |
   |                         | que paquetes dependen de el, y las           |
   |                         | diferentes versiones disponibles.            |
   |-------------------------+----------------------------------------------|
   |                         | Cuando explora la lista de paquetes, varia   |
   |                         | la informacion que puede ver en el area de   |
   |                         | informacion (la mitad inferior de la         |
   | Paquete -> Recorrer     | pantalla). El area de informacion puede      |
   | informacion de paquetes | mostrar una larga descripcion del paquete    |
   | (i)                     | seleccionado (predeterminado), un resumen de |
   |                         | las dependencias relacionadas con ese        |
   |                         | paquete o un analisis de que otros paquetes  |
   |                         | requieren o sugieren el paquete              |
   |                         | seleccionado.                                |
   |-------------------------+----------------------------------------------|
   |                         | Mostrar el registro de cambios de Debian del |
   | Paquete -> Registro de  | paquete seleccionado. Para ver el registro   |
   | cambios (C)             | de cambios de una version en particular,     |
   |                         | seleccione la version y ejecute esta orden.  |
   +------------------------------------------------------------------------+

    El menu Solucionador

   Figura 2.4. Ordenes disponibles en el menu Solucionador.

   +------------------------------------------------------------------------+
   |      Orden       |                     Descripcion                     |
   |------------------+-----------------------------------------------------|
   | Solucionador ->  | Mostrar una detallada descripcion de la accion      |
   | Examinar         | sugerida por el solucionador (vease "Resolver       |
   | solucion (e)     | dependencias de manera interactiva.").              |
   |------------------+-----------------------------------------------------|
   | Solucionador ->  | Llevar a cabo las acciones sugeridas por el         |
   | Aplicar Solucion | solucionador.                                       |
   | (!)              |                                                     |
   |------------------+-----------------------------------------------------|
   | Solucionador ->  | Seleccionar la siguiente sugerencia del             |
   | Solucion         | solucionador.                                       |
   | siguiente (.)    |                                                     |
   |------------------+-----------------------------------------------------|
   | Solucionador ->  | Seleccionar la anterior sugerencia del              |
   | Solucion         | solucionador.                                       |
   | anterior (,)     |                                                     |
   |------------------+-----------------------------------------------------|
   | Solucionador ->  |                                                     |
   | Primera solucion | Seleccionar la primera sugerencia del solucionador. |
   | (<)              |                                                     |
   |------------------+-----------------------------------------------------|
   | Solucionador ->  | Seleccionar la ultima solucion generada por el      |
   | Ultima solucion  | solucionador (vease "Resolver dependencias de       |
   | (>)              | manera interactiva.").                              |
   |------------------+-----------------------------------------------------|
   |                  | Cuando examina una solucion, conmuta si rechaza o   |
   | Solucionador ->  | no la accion seleccionada, pasando despues a la     |
   | Conmutar         | siguiente accion (vease "Resolver dependencias de   |
   | Rechazados (r)   | manera interactiva."). Si la accion ya se aprobo,   |
   |                  | queda cancelada.                                    |
   |------------------+-----------------------------------------------------|
   |                  | Cuando examina una solucion, conmuta si la accion   |
   | Solucionador ->  | seleccionada se aprueba o no, y pasa a la siguiente |
   | Conmutar         | accion (vease "Resolver dependencias de manera      |
   | Aceptada (a)     | interactiva."). Si la accion ya se rechazo, esta    |
   |                  | queda cancelada.                                    |
   |------------------+-----------------------------------------------------|
   | Solucionador ->  | Cuando examina una solucion, muestra informacion    |
   | Ver objetivo     | detallada acerca del paquete afectado por la accion |
   | (enter)          | seleccionada (vease "Resolver dependencias de       |
   |                  | manera interactiva.").                              |
   |------------------+-----------------------------------------------------|
   |                  | Rechazar (al igual que con Solucionador -> Conmutar |
   |                  | Rechazados (r)) todas las acciones que rompen una   |
   | Solucionador ->  | retencion o que instalan una version prohibida. De  |
   | Rechazar romper  | manera predeterminada, estas acciones se rechazan a |
   | bloqueos         | menos que defina                                    |
   |                  | Aptitude::ProblemResolver::Allow-Break-Holds como   |
   |                  | true.                                               |
   +------------------------------------------------------------------------+

    El menu Buscar

   Figura 2.5. Ordenes disponibles en el menu Buscar.

   +------------------------------------------------------------------------+
   |          Orden          |                 Descripcion                  |
   |-------------------------+----------------------------------------------|
   |                         | Buscar el siguiente paquete en la lista de   |
   | Buscar -> Buscar (/)    | paquetes que coincida con el patron de       |
   |                         | busqueda (vease "Patrones de busqueda").     |
   |-------------------------+----------------------------------------------|
   | Buscar -> Buscar hacia  | Buscar el paquete anterior en la lista de    |
   | atras (\)               | paquetes que coincida con el patron de       |
   |                         | busqueda (vease "Patrones de busqueda").     |
   |-------------------------+----------------------------------------------|
   | Buscar -> Buscar otra   | Repetir la ultima busqueda.                  |
   | vez (n)                 |                                              |
   |-------------------------+----------------------------------------------|
   |                         | Repetir la ultima busqueda, pero en          |
   | Buscar -> Buscar de     | direccion opuesta. Si la ultima orden de     |
   | nuevo hacia atras (N)   | busqueda empleada fue <<Buscar hacia         |
   |                         | atras>>, esta orden ejecutaria una busqueda  |
   |                         | hacia delante, y viceversa.                  |
   |-------------------------+----------------------------------------------|
   |                         | Filtrar la lista de paquetes eliminando      |
   | Buscar -> Limitar vista | cualquier paquete que no coincida con el     |
   | (l)                     | patron de busqueda (vease "Patrones de       |
   |                         | busqueda").                                  |
   |-------------------------+----------------------------------------------|
   | Buscar -> No limitar    | Eliminar el filtro del paquete actual (todos |
   | vista                   | los paquetes seran visibles).                |
   |-------------------------+----------------------------------------------|
   | Buscar -> Buscar Roto   | Buscar el siguiente paquete roto. Esto       |
   | (b)                     | equivale a buscar ?broken.                   |
   +------------------------------------------------------------------------+

    El menu Opciones

   Figura 2.6. Ordenes disponibles en el menu Opciones.

   +------------------------------------------------------------------------+
   |        Orden         |                   Descripcion                   |
   |----------------------+-------------------------------------------------|
   |                      | Abrir una vista de nivel superior en la cual    |
   |                      | puede modificar los parametros de aptitude. Las |
   |                      | opciones de configuracion se organizan en       |
   | Opciones ->          | arbol, similar al arbol de paquetes; para       |
   | Preferencias         | activar o desactivar una opcion, seleccionela y |
   |                      | pulse Espacio o Intro. Las opciones de          |
   |                      | configuracion se guardan en ~/.aptitude/config  |
   |                      | en el mismo momento de su seleccion.            |
   |----------------------+-------------------------------------------------|
   | Opciones -> Deshacer | Devolver todas las opciones a sus valores       |
   | opciones             | predeterminados.                                |
   +------------------------------------------------------------------------+

    El menu Vistas

   [Nota] Nota
          Para una introduccion al funcionamiento de las vistas, vease
          "Trabajar con varias vistas.".

   Figura 2.7. Ordenes disponibles en el menu Vistas.

   +------------------------------------------------------------------------+
   |           Orden           |                Descripcion                 |
   |---------------------------+--------------------------------------------|
   | Vistas -> Siguiente (F6)  | Pasar a la siguiente vista activa.         |
   |---------------------------+--------------------------------------------|
   | Vistas -> Prev (F7)       | Pasar a la anterior vista activa.          |
   |---------------------------+--------------------------------------------|
   | Vistas -> Cierra (q)      | Cerrar la vista actual.                    |
   |---------------------------+--------------------------------------------|
   | Vistas -> Nueva vista de  | Crear una nueva vista de la lista de       |
   | paquetes                  | paquetes.                                  |
   |---------------------------+--------------------------------------------|
   | Vistas -> Auditar         | Crear una vista que muestra paquetes no    |
   | Recomendaciones           | instalados, recomendados por algun paquete |
   |                           | instalado en su sistema.                   |
   |---------------------------+--------------------------------------------|
   | Vistas -> Nueva vista de  | Crear una nueva vista de paquetes en la    |
   | paquetes plana            | cual los paquetes no estan categorizados.  |
   |---------------------------+--------------------------------------------|
   | Vistas -> Nuevo navegador | Crear una nueva vista de paquetes en la    |
   | debtags                   | cual los paquetes estan categorizados      |
   |                           | segun sus entradas de debtags.             |
   |---------------------------+--------------------------------------------|
   | Vistas -> Nuevo navegador | Ver la lista de paquetes, agrupados por    |
   | de categorias             | categoria.                                 |
   |---------------------------+--------------------------------------------|
   |                           | Pueden aparecer un numero de elementos     |
   | Elementos adicionales     | adicionales del menu correspondientes a la |
   |                           | vista activa actual. Para cambiar a otra   |
   |                           | vista, seleccionela desde el menu.         |
   +------------------------------------------------------------------------+

    El menu Ayuda

   Figura 2.8. Ordenes disponibles en el menu Ayuda.

   +------------------------------------------------------------------------+
   |        Orden         |                   Descripcion                   |
   |----------------------+-------------------------------------------------|
   | Ayuda -> Acerca de   | Mostrar la informacion de copyright.            |
   |----------------------+-------------------------------------------------|
   | Ayuda -> Ayuda (?)   | Mostrar la pagina de ayuda en linea.            |
   |----------------------+-------------------------------------------------|
   | Ayuda -> Manual de   | Mostrar el Manual de usuario (este documento).  |
   | usuario              |                                                 |
   |----------------------+-------------------------------------------------|
   | Ayuda -> PUF         | Mostrar el PUF de aptitude .                    |
   |----------------------+-------------------------------------------------|
   | Ayuda -> Registro de | Mostrar un historial de los cambios mas         |
   | cambios              | significativos hechos a aptitude.               |
   |----------------------+-------------------------------------------------|
   | Ayuda -> Licencia    | Mostrar los terminos bajo los cuales puede      |
   |                      | copiar, modificar y distribuir aptitude.        |
   +------------------------------------------------------------------------+

  Trabajar con varias vistas.

   aptitude permite trabajar con varias "vistas" a la vez. Una "vista" (a
   veces llamada "pantalla") es simplemente algo que puede aparecer en el
   area de la pantalla por debajo de la barra de menu. La vista mas comun es
   la lista de paquetes, aunque vistas de descargas tambien son habituales.

   Cuando hay varias vistas abiertas a la vez, aparecera una barra en la
   parte superior de la pantalla listando todas las vistas. Por ejemplo, si
   examino apt pulsando Intro, y despues examino libc6, el resultado seria
   una pantalla parecida a esta:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
          Paquetes                  apt info                  libc6 info
 aptitude 0.3.1
 i A  --\ libc6                                             2.3.2.ds1- 2.3.2.ds1-
   Descripcion: Biblioteca de C de GNU: Bibliotecas compatidas
     Contiene las bibliotecas estandar que utiliza casi cualquier programa en
     el sistema. Esta biblioteca incluye las bibliotecas compartidas de la biblioteca
     estandar de C y de la biblioteca de matematicas, asi como muchas otras bibliotecas.
   Prioridad: requiere
   Seccion: base
   Desarrollador: GNU Libc Maintainers <debian-glibc@lists.debian.org>
   Tamano comprimido: 4901k
   Tamano sin comprimir: 15.9M
   Paquete fuente: glibc
   --\ Depende
     --- libdb1-compat
   --\ Sugiere
     --- locales
     --- glibc-doc
   --\ Conflicts
 Biblioteca de C de GNU: Bibliotecas compatidas

   Puede cerrar la vista actual usando Vistas -> Cierra (q). Para cambiar a
   la vista anterior o a la siguiente, use Vistas -> Siguiente (F6) y Vistas
   -> Prev (F7), o pulse sobre el nombre de la vista en la parte superior de
   la pantalla; tambien puede ver una lista de todas las vistas activas en el
   menu Vistas.

   Como se ha visto con anterioridad, algunas ordenes (como por ejemplo,
   visionar informacion acerca de un paquete) crearan nuevas vistas
   automaticamente; tambien puede crear una nueva vista usando Vistas ->
   Nueva vista de paquetes o Vistas -> Nuevo navegador de categorias.

  Convertirse en root.

   Algunas acciones, tales como actualizar la lista de paquetes, tan solo se
   pueden llevar a cabo como superusuario (root). Si no es root e intenta
   actualizar la lista de paquetes, se le preguntara si quiere convertirse en
   root:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1
 --- Paquetes instalados
 --- Paquetes no instalados
 --- Paquetes obsoletos y creados localmente
 --- Paquetes virtuales
 --- Tareas

   +-------------------------------------------------------------------------+
   |La actualizacion de la lista de paquetes disponibles requiere privilegios |
   |de administracion, que actualmente no tiene. ?Desearia cambiar a la |
   |cuenta de administrador?                                                     |
   | [ Convertirse en administrador] [ No convertirse en administrador ]          |
 Th+-------------------------------------------------------------------------+









   Si selecciona "Convertirse en administrador", aptitude le solicitara la
   contrasena de administrador; una vez que la haya introducido aptitude
   realizara la accion que requiere privilegios de root. Aun sera root
   despues de que la accion finalice.

   Puede identificarse como root en cualquier momento usando la orden
   Acciones -> Convertirse en administrador. Cualquier cambio realizado al
   estado de los paquetes sera preservado (pero no se guardaran hasta que
   quite aptitude).

   De manera predeterminada, aptitude usara la orden su para obtener
   privilegios de superusuario. Si desea usar otra orden, (como por ejemplo
   sudo), defina la opcion de configuracion Aptitude::Get-Root-Command.

Gestionar paquetes

   Esta seccion describe como manipular la lista de paquetes, como instalar
   paquetes nuevos en el sistema y como eliminar paquetes viejos.

  Gestionar la lista de paquetes.

   Es recomendable actualizar periodicamente la lista de paquetes para
   mantenerla al dia. Puede hacer esto usando la orden Acciones -> Actualizar
   la lista de paquetes (u).

  Acceso a la informacion de los paquetes.

   La informacion relativa a los paquetes se presenta en diferentes areas en
   aptitude: la lista de paquetes ofrece una lista preliminar del estado de
   cada paquete; tambien hay vistas adicionales que proporcionan informacion
   detallada acerca de un paquete.

    La lista de paquetes

   La lista de paquetes muestra una sinopsis "superficial" del estado de un
   paquete. Por ejemplo, el paquete webmin podria mostrar una sinopsis
   cercana a esta:

 piAU  webmin                                        +5837kB <none>     1.160-2

   Los cuatro caracteres en el lado izquierdo de la sinopsis muestran que el
   paquete no esta instalado ("p"), que va a ser instalado ("i"), que ha sido
   automaticamente seleccionado para su instalacion ("A"), y tambien que no
   va firmado ("U"). Puede ver en el lado derecho de la sinopsis la version
   actualmente instalada y la ultima version disponible, asi como una
   indicacion de cuanto espacio se va a usar al actualizar el paquete.

   [Sugerencia] Sugerencia
                Puede configurar como se muestran las sinopsis de los
                paquetes; vease "Personalizar la presentacion de los
                paquetes" para mas detalles.

   Las cuatro marcas (caracteres) en el lado izquierdo de la pantalla ofrecen
   informacion basica acerca del estado de un paquete. El primer caracter es
   el estado actual. El segundo caracter simboliza la accion que se ejecutara
   sobre el paquete. El tercer caracter indica si el paquete ha sido
   automaticamente instalado (vease "Gestionar paquetes automaticamente
   instalados."), y el cuarto caracter indica si el paquete esta firmado
   (vease "Llaves GPG: Entender y gestionar la confianza de los paquetes.").

   Los cuatro posibles valores de la marca de "estado actual" se tratan en
   Figura 2.9, "Valores de la marca de "estado actual"", y los posibles
   valores de "accion" se tratan en Figura 2.10, "Valores de la marca de
   "accion"".

   Figura 2.9. Valores de la marca de "estado actual"

   i - el paquete esta instalado y todas sus dependencias satisfechas.
   c - el paquete se elimino, pero sus archivos de configuracion siguen
       presentes.
   p - el paquete y todos sus archivos de configuracion se eliminaron, o el
       paquete nunca se instalo.
   v - el paquete es virtual.
   B - el paquete tiene dependencias rotas.
   u - el paquete se ha desempaquetado, pero no configurado.
   C - medio-configurado: la configuracion del paquete se interrumpio.
   H - medio-instalado: la instalacion del paquete se interrumpio.

   Figura 2.10. Valores de la marca de "accion"

   i - el paquete se va a instala.
   u - el paquete se va a actualizar.
   d - el paquete se va a eliminar: se desinstalara, pero sus archivos de
       configuracion permaneceran en el sistema.
   p - el paquete se va a purgar; se eliminaran el y sus archivos de
       configuracion.
   h - el paquete se va a retener: permanecera en su version actual, aunque
       haya una nueva version disponible, hasta que se cancele la retencion .
   F - Se prohibio la actualizacion del paquete.
   r - el paquete se va a reinstalar.
       el paquete esta "roto": algunas de sus dependencias no seran
   B - satisfechas. aptitude no le permitira instalar, eliminar o actualizar
       nada mientras tenga paquetes rotos.

   Ademas, aptitude usara colores para indicar el estado de los paquetes si
   su terminal lo permite. Las distinciones relativas al estado se muestran
   usando el color de fondo:

   Negro

           El paquete no se puede actualizar (o no se va a instalar), y no
           tiene problemas de dependencias. Si se instala el paquete, su
           nombre aparecera resaltado.

   Verde

           El paquete se va instalar.

   Azul

           El paquete esta instalado, y se va a actualizar.

   Magenta

           El paquete esta instalado, pero se va a eliminar.

   Blanco

           El paquete esta instalado, y "retenido" en su version actual: las
           actualizaciones automaticas ignoraran este paquete.

   Rojo

           Este paquete esta roto: algunas de sus dependencias no seran
           satisfechas.

   Por ultimo, la mitad inferior de la pantalla muestra la descripcion
   completa. aptitude intentara detectar si el paquete esta envuelto en un
   problema de dependencias; de ser asi se mostraria aqui informacion
   referente al problema de dependencias. Para pasar de la informacion de
   dependencias a la descripcion del paquete, pulse i.

    Informacion detallada del paquete

   Si pulsa Intro mientras resalta un paquete vera la siguiente pantalla
   informativa:

   Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1
 i A --\ apt                                                0.5.25     0.5.25
   Descripcion: Interfaz avanzada para dpkg
     Esta es la interfaz de nueva generacion de Debian para el gestor de paquetes.
     Proporciona la herramienta apt-get y un metodo dselect que ofrece una manera mas
     simple y segura de instalar y actualizar paquetes

     APT permite hacer ordenacion de la instalacion, acceder a multiples fuentes
     y tambien otras funcionalidades unicas. Para mas informacion consulte
     la Guia del Usuario en el paquete apt-doc
   Esencial: si
   Prioridad: importante
   Seccion: base
   Desarrollador: APT Development Team <deity@lists.debian.org>
   Tamano comprimido: 970k
   Tamano sin comprimir: 2961k
   Paquete fuente: apt
   --\ Depende
     --- libc6 (>= 2.3.2.ds1-4)
     --- libgcc1 (>= 1:3.3.3-1)
     --- libstdc++5 (>= 1:3.3.3-1)
   --\ Sugiere
     --- aptitude | synaptic | gnome-apt | wajig
     --- dpkg-dev
     --\ apt-doc (INSATISFECHO)
 p     0.6.25
 p     0.5.25
   --\ Reemplaza
     --- libapt-pkg-doc (< 0.3.7)
     --- libapt-pkg-dev (< 0.3.7)
   --- Nombres del paquete proporcionado por apt
   --- Paquetes que dependen de apt
   --\ Versiones
 p A 0.6.25
 i A 0.5.25


   Puede moverse por esta pantalla de una manera similar a la lista de
   paquetes: por ejemplo, en la captura de pantalla superior, expandi la
   dependencia de apt-doc mostrando las versiones disponibles de apt-doc que
   pueden satisfacer la dependencia. Estas versiones se pueden manipular de
   la misma manera que un paquete: por ejemplo, para instalar la version
   0.5.25 de apt-doc, deberia resaltarlo y pulsar +.

   [Sugerencia] Sugerencia
                Para satisfacer rapidamente una dependencia, seleccione la
                dependencia y presione +; aptitude intentara satisfacerlas
                automaticamente por usted.

   Ademas de las dependencias de un paquete, tambien puede ver los nombres de
   paquetes que <<Provee>>, los paquetes sobre los que <<Depende>>, y las
   versiones disponibles del paquete (incluyendo cualquier paquete que lo
   <<Provea>>).

   Como es normal, puede cerrar esta pantalla y volver a la vista principal
   pulsando q. Para su conveniencia, dispone de otras pantallas informativas
   (que solo muestran la informacion mas usada, ocultando el resto): pulse v
   para ver las versiones de un paquete, d para ver las dependencias de un
   paquete, y r para ver las dependencias inversas de un paquete (paquetes
   que dependen de el).

  Modificar los estados de los paquete.

   Dispone de las siguientes ordenes para modificar el estado de los
   paquetes. Las ordenes se ejecutaran la siguiente vez que realice un
   proceso de instalacion; hasta entonces, puede revertir estas ordenes con
   Deshacer -> Deshacer (Control+u).

   Para aplicar una orden a un paquete, simplemente seleccione el paquete en
   la lista de paquetes y ejecute la orden. Estas ordenes se pueden aplicar
   tambien a grupos de paquetes, seleccionando la cabecera del grupo (por
   ejemplo, "Paquetes actualizables"), y ejecutando la orden.

   +------------------------------------------------------------------------+
   |           Orden           |                Descripcion                 |
   |---------------------------+--------------------------------------------|
   |                           | Marcar el paquete para su instalacion.     |
   |                           |                                            |
   | Instalar: Paquete ->      | Si el paquete no esta instalado, se        |
   | Instalar (+)              | instalara. Si ya lo esta, se actualizara,  |
   |                           | de ser posible, y cualquier retencion en   |
   |                           | efecto se cancelara.                       |
   |---------------------------+--------------------------------------------|
   |                           | Marcar el paquete seleccionado para su     |
   | Eliminar: Paquete ->      | eliminacion.                               |
   | Eliminar (-)              |                                            |
   |                           | Si el paquete esta instalado, se           |
   |                           | eliminara.                                 |
   |---------------------------+--------------------------------------------|
   |                           | Marcar el paquete para ser purgado         |
   |                           |                                            |
   |                           | Si el paquete esta instalado, se           |
   | Purgar: Paquete -> Purgar | eliminara. Mas aun, aunque se elimine,     |
   | (_)                       | cualquier archivo resultante (tales como   |
   |                           | los archivos de configuracion)             |
   |                           | relacionados con el paquete tambien se     |
   |                           | eliminaran del sistema.                    |
   |---------------------------+--------------------------------------------|
   |                           | Marcar el paquete para que se mantenga en  |
   |                           | su version actual.                         |
   |                           |                                            |
   | Mantener: Paquete ->      | Cualquier accion que se fuese a llevar a   |
   | Mantener (:)              | cabo sobre el paquete -- instalacion,      |
   |                           | eliminacion o actualizacion -- se cancela, |
   |                           | y cualquier retencion impuesta al paquete  |
   |                           | se elimina.                                |
   |---------------------------+--------------------------------------------|
   |                           | Imponer una retencion al paquete.          |
   |                           |                                            |
   |                           | Al igual que con <<Mantener>>, se cancela  |
   | Retener: Paquete ->       | cualquier accion programada para el        |
   | Retener (=)               | paquete. Ademas, el paquete no se          |
   |                           | actualizara automaticamente ^[a] hasta que |
   |                           | elimine esta accion. Puede cancelar        |
   |                           | <<Mantener>> ejecutando la siguiente       |
   |                           | orden.                                     |
   |---------------------------+--------------------------------------------|
   |                           | El paquete no se actualizara               |
   |                           | automaticamente ^[a] a la version a la que |
   |                           | lo iba a ser. Si se iba a actualizar, la   |
   |                           | actualizacion se cancela.                  |
   |                           |                                            |
   |                           | Si ejecuta esta orden sobre una version en |
   |                           | particular de un paquete, el paquete no se |
   | Paquete -> Prohibir       | actualizara a la version escogida. Observe |
   | versiones (F)             | que solo puede prohibir una version al     |
   |                           | mismo tiempo.                              |
   |                           |                                            |
   |                           | Esta funcionalidad se ha implementado en   |
   |                           | gran medida para la conveniencia de la     |
   |                           | distribucion "unstable (sid)", para que    |
   |                           | asi se puedan evitar versiones de          |
   |                           | programas ya conocidas como malas.         |
   |---------------------------+--------------------------------------------|
   |                           | Reinstalar el paquete.                     |
   |                           |                                            |
   |                           | Observe que la reinstalacion no se         |
   |                           | guardara cuando salga de aptitude o        |
   | Reinstalar: pulse L       | ejecute un proceso de instalacion por      |
   |                           | razones tecnicas (basicamente, las capas   |
   |                           | de software subyacentes, dpkg y apt no     |
   |                           | proporcionan ninguna manera de ver si una  |
   |                           | reinstalacion ha tenido exito o no).       |
   |---------------------------+--------------------------------------------|
   |                           | Define si un paquete se toma como          |
   |                           | automaticamente instalado; los paquetes    |
   | Paquete -> Marcar         | automaticamente instalados se eliminaran   |
   | automatico (M), Paquete   | cuando ningun otro paquete dependa de      |
   | -> Marcar manual (m)      | ellos. Para mas informacion, vease         |
   |                           | "Gestionar paquetes automaticamente        |
   |                           | instalados.".                              |
   |------------------------------------------------------------------------|
   | ^[a] Esto es, que no se vera afectado por Acciones -> Marcar           |
   | actualizable (U) o por las ordenes en linea de ordenes full-upgrade o  |
   | safe-upgrade                                                           |
   +------------------------------------------------------------------------+

   Ademas de estas ordenes que afectan al paquete seleccionado, hay dos
   ordenes que afectan a un gran numero de paquetes en una sola accion
   independientemente de lo que haya seleccionado. Acciones -> Olvidar
   paquetes nuevos (f) elimina el estado "nuevo" de todos los paquetes de la
   lista de paquetes, y Acciones -> Marcar actualizable (U) marca todos los
   paquetes actualizables para su actualizacion, excepto aquellos que estan
   retenidos o prohibidos de actualizacion.

   [Nota] Nota
          Todos los cambios efectuados al estado de los paquetes se guardan
          cuando cierre aptitude, actualice la lista de paquetes o realice un
          proceso de instalacion. Si no desea guardar los cambios, siempre
          puede interrumpir aptitude pulsando Ctrl-C.

  Descargar, instalar y eliminar paquetes.

   Cambiar el estado de los paquetes tal y como se describe en la seccion
   anterior no afecta de manera directa a lo que esta instalado en el
   sistema. Por ello, puede ajustar el estado de los paquetes sin afectar al
   sistema hasta que este satisfecho con lo que ve; una vez que lo este,
   puede "confirmar" los cambios de verdad, instalando y eliminando
   paquetes.^[8]

   Para confirmar los cambios, use la orden Acciones -> Instalar/eliminar
   paquetes (g). Seleccionar esta orden muestra una previsualizacion que
   describe los cambios que se llevaran a cabo. Esta imagen es una simple
   lista de paquetes por lo que puede manipular los paquetes (por ejemplo,
   cancelando eliminaciones no deseadas) de la misma manera en que lo puede
   hacer en el lista principal.

   Una vez que haya finalizado, use Vistas -> Cierra (q) para cancelar la
   instalacion, o use Acciones -> Instalar/eliminar paquetes (g) para
   proceder con las selecciones. aptitude descargara en ese momento cualquier
   paquete necesario para despues continuar con la instalacion.

   Los paquetes descargados por aptitude se guardan en el directorio almacen
   (por omision /var/cache/apt/archives). Normalmente, los paquetes son
   guardados ad infinitum. Para eliminar todos los archivos de este
   directorio, use Actions -> Limpiar el almacen de paquetes; para eliminar
   solo aquellos paquetes que ya no se pueden descargar (p. ej., paquetes
   obsoletos), use Acciones -> Limpiar ficheros obsoletos.

  Llaves GPG: Entender y gestionar la confianza de los paquetes.

   La habilidad de apt de acceder a multiples fuentes de paquetes conduce a
   una potencial vulnerabilidad de seguridad. Supongamos que intenta anadir
   un archivo de paquetes de Jose Hacker Aleatorio a su archivo sources.list
   para poder instalar el paquete gargleblast de Pepe. Por otro lado, es
   posible que (fuera de su conocimiento) el archivo de Pepe contenga
   versiones de paquetes como libc6 y ssh...!versiones que roban su
   informacion privada o que abren puertas traseras en el sistema! Si estos
   paquetes tuviesen unos numeros de version mas elevados que los que se
   encuentran el archivo de Debian, apt los instalaria sin dudar en la
   siguiente actualizacion, permitiendo a Pepe realizar su sucia labor sin
   ser detectado. Pepe podria incluso entrar en los servidores replica de
   Debian y reemplazar el software legitimo con su version medicada.

   Afortunadamente, las versiones mas recientes de apt y de aptitude, tales
   como la version documentada en este manual, tienen defensas incorporadas
   para repeler este tipo de ataques. apt usa unos fuertes mecanismos de
   seguridad basados en el conocido software de cifrado GPG para verificar
   que los paquetes distribuidos por los servidores replica de Debian son los
   mismos que los que subieron desarrolladores de Debian. De esta manera,
   aptitude le avisara si intenta instalar un paquete desde una fuente que no
   pertenece a Debian, o si intenta actualizar un paquete de Debian a una
   version que viene de una fuente que no es de Debian.

   [Aviso] Aviso
           Los mecanismos de seguridad de apt proporcionan una garantia casi
           perfecta de que los contenidos de su servidor replica son
           identicos o los del servidor central de Debian. Aun asi, no son
           perfectos. Teoricamente, hay varias maneras en las que un paquete
           modificado se pueda introducir en el archivo central de Debian.

           Asegurando que solo pueda instalar desde una fuente firmada le
           dara un alto grado de proteccion frente a los paquetes maliciosos,
           pero no puede eliminar todos los riesgos inherentes a instalar
           software.

    Entender la confianza

   apt permite al administrador de un archivo dotar de una firma al indice
   del archivo. Esta firma, que (por razones practicas) no se puede
   falsificar, indica que los paquetes del archivo listados en el indice son
   los mismos que el administrador puso en el archivo en primer lugar: p.
   ej., que los contenidos de un paquete no se han manipulado desde su
   creacion.^[9] La firma se puede validar cerciorandose de que se
   corresponde con la llave publica del administrador. La llave publica del
   archivo de Debian se distribuye con apt, generalmente a traves de su CD de
   Debian.

   Cuando aptitude descarga el indice de un archivo, comprobara si el indice
   esta apropiadamente firmado. Si no esta firmado aptitude no confiara en
   los paquetes provenientes de ese archivo (mas adelante se explicara lo que
   esto significa). Si tiene una firma pero es incorrecta o no se puede
   verificar, vera un aviso y aptitude se negara a confiar en paquetes
   procedentes de ese archivo.

   Mas adelante, cuando lleve a cabo un proceso de instalacion, aptitude
   revisara si los paquetes son de una fuente firmada. Entonces vera un
   mensaje de aviso si se va a instalar un paquete sin firmar, o si un
   paquete se actualizara de una version firmada a otra que no lo es, dandole
   la oportunidad de interrumpir la instalacion.

   Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.3.0                    Esto usara 831kB de espacio del disco   TamDesc: 30.4MB
 --\ Paquetes a actualizar
 iu U wesnoth                                       -98.3kB 0.8.7-1    0.8.8-1.0w
 iuAU wesnoth-data                                  +930kB  0.8.7-1    0.8.8-1.0w
 +------------------------------------------------------------------------------+
 |AVISO: !se instalaran versiones sin firmar de los siguientes paquetes     #|
 |                                                                             #|
 |Los paquetes sin firmar pueden comprometer la seguridad del sistema.#|
 |Solo debe continuar con la instalacion si esta completamente seguro de que  #|
 |es lo que quiere                                                         #|
 |                                                                             #|
 |  * wesnoth [version 0.8.8-1.0wesnoth.org]                                   #|
 |  * wesnoth-data [version 0.8.8-1.0wesnoth.org]                              #|
 |  * wesnoth-music [version 0.8.8-1.0wesnoth.org]                             #|
 |   [ Continua de todas formas ]             [ Aborta la instalacion ]          |
 +------------------------------------------------------------------------------+
                                                                                #
                                                                                #
                                                                                #
                                                                                #
                                                                                #
                                                                                #

    Confiar en llaves adicionales

   Puede encontrar util que apt confie en archivos externos aparte de los
   archivos de Debian. Para cada paquete en el que quiera confiar, tendra que
   adquirir la llave publica que se usa para firmar el indice del archivo de
   paquetes. Este es por lo general un archivo de texto cuyo nombre finaliza
   en .asc; puede ser suministrado por el administrador del sitio web o
   descargado desde un servidor de llaves publicas. Para mas informacion
   acerca de llaves publicas y de como conseguirlas, vease la pagina web de
   GPG.

   La lista de llaves en las que apt confia se guarda en el archivo del
   anillo de llaves /etc/apt/trusted.gpg. Una vez que tenga la llave GPG,
   puede anadirla a este archivo ejecutando esta orden, gpg
   --no-default-keyring --keyring /etc/apt/trusted.gpg --import
   nueva_llave.asc. aptitude confiara entonces en cualquier archivo firmado
   con la llave contenida en nueva_llave.asc.

   [Aviso] Aviso
           Una vez que se anade un archivo de una llave al anillo de llaves
           de APT, !se le otorgara la misma confianza que a los propios
           servidores replica de Debian! Haga esto solo si esta muy seguro de
           que la llave que esta anadiendo es la correcta y si la persona que
           posee la llave es competente y de toda confianza.

  Gestionar paquetes automaticamente instalados.

   Para instalar un paquete es a veces necesario instalar muchos otros (para
   satisfacer sus dependencias). Por ejemplo, si desea instalar el paquete
   clanbomber, debe tambien instalar el paquete libclanlib2. Si elimina
   clanbomber, probablemente no necesite mas libclanlib2; aptitude intentara
   detectar esto y eliminar el paquete libclanlib2.

   Funciona de la siguiente manera: cuando instala un paquete, aptitude
   instalara automaticamente cualquier otro paquete sobre el cual este
   dependa. Estos paquetes se marcan como "automaticamente instalados";
   aptitude los registrara y eliminara cuando ya no sean dependencia de
   cualquier paquete manualmente instalado ^[10] . Apareceran en la
   previsualizacion como "paquetes que se eliminaran porque ya no se usan."

   Al igual que con cualquier proceso automatico, hay posibilidades de que
   las cosas se compliquen. Por ejemplo, aunque de inicio un paquete se
   instalo automaticamente, puede resultar util por si mismo. Puede cancelar
   la marca de "automatico" en cualquier momento pulsando m; si ya se elimino
   el paquete, puede usar Paquete -> Instalar (+) para cancelar la
   eliminacion y borrar la marca de "automatico".

Resolver las dependencias de los paquetes

  Resolucion de dependencias de aptitude.

   Hay dos algoritmos principales en la resolucion de dependencias de
   aptitude

   El primero es un algoritmo que se emplea tambien en programas tales como
   apt-get y synaptic; Me referire a el como "resolucion inmediata". Se
   invoca cuando marca un paquete para su instalacion de forma interactiva, e
   inmediatamente despues de que uno o mas paquetes son marcados en la linea
   de ordenes. La resolucion inmediata es rapida y solucionara la mayoria de
   problemas de dependencias, aunque a veces no pueda encontrar ninguna.

   El segundo algoritmo, que llamare "resolucion interactiva", se invoca
   cuando hay paquetes con dependencias rotas incluso despues de la
   resolucion inmediata^[11]. Puede resolver mas dependencias, le permite
   previsualizar la solucion antes de aplicarla, y le permitiria tambien
   introducir respuestas al solucionador, para asi guiarle a una solucion mas
   adecuada.

  Resolucion inmediata de dependencias.

   En el momento que elija instalar o actualizar un paquete, aptitude hara un
   intento inmediato de resolver cualquier dependencia no satisfecha. Por
   cada dependencia insatisfecha (sea un "Depende", "Recomienda", o con un
   "Conflicto"), realizara los siguientes pasos:

    1. Si la dependencia es una recomendacion, aptitude intentara ver si es
       una recomendacion "nueva" o una "recomendacion" ya "satisfecha".
       aptitude considera una recomendacion como "nueva" si el paquete
       manifestando la recomendacion no esta instalado, o si la version
       instalada no recomienda un paquete del mismo nombre. Por otro lado,
       una recomendacion esta "satisfecha" si el paquete ya instalado
       recomienda un paquete del mismo nombre, estando ya satisfecho.

       Por ejemplo: imagine que la version 1.0 de prog recomienda la version
       4.0 de libcool1, pero la version 2.0 de prog recomienda la version 5.0
       de libcool1, y tambien recomienda apache. Si escogiese actualizar prog
       de la version 1.0 a la version 2.0, la recomendacion de apache se
       considerara "nueva" porque la version 1.0 de prog no recomendaba
       apache. Por otro lado, la recomendacion de libcool1 no es "nueva",
       porque la version1.0 de prog recomienda libcool1, aunque recomiende
       una version diferente. De todas formas, si libcool1 esta instalado,
       entonces la recomendacion se tratara como "ya satisfecha".

       Si la opcion de configuracion Apt::Install-Recommends es true,
       aptitude siempre intentara satisfacer las recomendaciones nuevas y ya
       satisfechas; todas las demas se ignoraran en la siguiente resolucion.
       Si la opcion es false, la resolucion inmediata de dependencias
       ignorara todas las recomendaciones.

    2. Si la dependencia se da en varios paquetes en combinacion con <<OR>>,
       examine cada una de las alternativas en el orden dado. Por ejemplo, si
       un paquete depende de "exim | mail-transport-agent", aptitude
       procesara primero exim, y despues mail-transport-agent.

    3. Intente resolver cada alternativa dada. Si la dependencia es un
       conflicto, elimine la alternativa actual si ya esta instalada (y por
       cada conflicto no de versiones, elimine tambien cualquier paquete que
       provoca el nucleo del conflicto). Tambien puede instalar la version
       candidata de la alternativa actual si satisface la dependencia. Si no,
       o si no hay otra version candidata (p. ej., porque la alternativa
       actual es un paquete virtual), y si la dependencia no tiene version,
       intente instalar el paquete de mas alta prioridad^[12] cuya version
       candidata provea el objetivo de la alternativa actual.

       Por ejemplo, imagine que estamos intentando resolver "Depende: exim |
       mail-transport-agent". En primer lugar, aptitude intentara instalar el
       paquete exim. Si exim no esta disponible, aptitude intentara entonces
       instalar el paquete con la prioridad mas alta cuya version candidata
       provee exim. Si no encuentra tal paquete, aptitude instalara el
       paquete con la prioridad mas alta cuya version candidata provee el
       paquete virtual mail-transport-agent. Por otro lado, imagine que la
       dependencia es "Depende: exim (>= 2.0.0) | mail-transport-agent", pero
       cuya unica version de exim disponible es 1.0. En este caso, aptitude
       no instalara exim (porque la version no corresponde a la dependencia),
       ni intentara instalar paquetes que provean exim (porque los paquetes
       virtuales no pueden satisfacer una dependencia con una restriccion en
       cuanto a la version). Por ello, aptitude le instalaria el paquete con
       la prioridad mas alta cuya version candidata provea
       mail-transport-agent.

    4. Si el paquete se instalo siguiendo el paso anterior, resuelve sus
       dependencias empleando este algoritmo, y finaliza entonces.

   Mientras que esta tecnica resuelve a menudo las dependencias mas notorias,
   tambien puede fallar bajo ciertas circunstancias.

     o La manera de resolver un conflicto es desinstalando el paquete que es
       el nucleo del conflicto, dejando otros paquetes que dependen de el con
       dependencias no resueltas; el solucionador inmediato no realiza
       ninguna accion para arreglarlo.

     o Puede que nunca se satisfaga una dependencia por razones de
       restricciones de versiones y debido a la limitacion de que se
       consideran solo las versiones candidatas. Por ejemplo, imagine que las
       versiones 1.0 y 2.0 de fileutils estan disponibles, que la version
       candidata es 1.0 y que el paquete octopus declara una dependencia
       "Depende: fileutils (>= 2.0)". El solucionador inmediato es incapaz de
       resolver esta dependencia pues nunca considerara la version 2.0 del
       mismo paquete puesto que no es la version candidata.

   El solucionador de dependencias interactivo puede solucionar estos
   problemas y mas. Cuando quedan atras dependencias rotas, o cuando se
   desactiva el solucionador de dependencias inmediato, el solucionador
   interactivo buscara automaticamente una solucion. La siguiente seccion
   muestra como usar el solucionador interactivo de dependencias.

  Resolver dependencias de manera interactiva.

   aptitude le asistira a la hora de resolver si surge un problema de
   dependencias que el solucionador inmediato no puede resolver. Una barra
   roja aparecera en la base de la pantalla en el momento en que aparezca un
   problema mostrando un resumen de la sugerencia de aptitude acerca del modo
   de solucionar el problema. Por ejemplo, en la siguiente imagen aptitude
   indica que puede solucionar el problema manteniendo dos paquetes en sus
   versiones presentes.

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.3.3       #Roto: 1   Se liberara 48.6MB de espacio del TamDesc
 i A   nautilus                                             2.10.1-4   2.10.1-4
 i     nautilus-cd-burner                                   2.10.2-1.1 2.10.2-1.1
 i A   nautilus-data                                        2.10.1-4   2.10.1-4
 i     netspeed                                             0.12.1-1   0.12.1-1
 i A   oaf                                                  0.6.10-3   0.6.10-3
 i     pybliographer                                        1.2.6.2-1  1.2.6.2-1
 i     rhythmbox                                            0.8.8-13   0.8.8-13
 i     shermans-aquarium                                    3.0.1-1    3.0.1-1
 idA   sound-juicer                                 -1733kB 2.10.1-3   2.10.1-3
 GNOME 2 CD Ripper
 sound-juicer se eliminara.


 Los siguientes dependen de sound-juicer y se romperan debido a su eliminacion:


   * gnome-desktop-environment depende de sound-juicer

 [1(1)/...] Sugiere 1 instalacion
 e: Examinar  !: Aplicar  .: Siguiente  ,: Anterior

   Como se indica en la base de la pantalla, puede ver soluciones adicionales
   si pulsa . y ,, aplicar la solucion en pantalla pulsando !, y examinar la
   solucion mas detenidamente pulsando e. Ud. veria una pantalla similar a la
   siguiente si examinase este mismo problema.

   Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
                 Paquetes                          Resolver las dependencias
   --\ Mantener los paquetes siguientes en la version actual:
     gstreamer0.8-cdparanoia                           [0.8.10-1 (unstable, now)]
     sound-juicer                                                [2.10.1-2 (now)]
















 [1(1)/...] Sugiere 2 mantenidos
 e: Examinar  !: Aplicar  .: Siguiente  ,: Anterior

   Puede acceder a la informacion del paquete afectado pulsando Intro
   mientras el paquete esta seleccionado. Para una explicacion mas detallada
   acerca de una decision en particular de aptitude, puede resaltar el
   elemento en lista. Cuando lo haga, la mitad inferior de la pantalla
   mostrara la dependencia solucionada por la eleccion de aptitude, asi como
   cada manera en que se pudo resolver la dependencia.

   Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
                 Paquetes                        Resolver dependencias
   --\ Mantener los paquetes siguientes en la version actual:
     gstreamer0.8-cdparanoia                           [0.8.11-1 (unstable, now)]
     sound-juicer                                      [2.10.1-3 (unstable, now)]






 cdparanoia plugin for GStreamer
 sound-juicer depende de   gstreamer0.8-cdparanoia
 --\ Las acciones siguientes resolveran estas dependencias:
   -> Descatualizar sound-juicer [2.10.1-3 (unstable, now) -> 0.6.1-2 (testing)]
   -> Eliminar sound-juicer [2.10.1-3 (unstable, now)]
   -> Cancelar la eliminacion de gstreamer0.8-cdparanoia
   -> Descatualizar gstreamer0.8-cdparanoia [0.8.11-1 (unstable, now) -> 0.8.8-3 (tes



 [1(1)/...] Sugiere 2 mantenidos
 e: Examinar  !: Aplicar  .: Siguiente  ,: Anterior

   Puede guiar al solucionador de dependencias a una solucion que usted crea
   conveniente aprobando o rechazando las diferentes acciones de una
   solucion. Si aprueba una accion, el solucionador la tomara siempre que sea
   posible, ignorando otras alternativas (cuando hay mas de una accion
   aprobada entre las alternativas, cualquiera se puede seleccionar). Por
   otro lado, si rechaza una accion el solucionador nunca la elegira en el
   caso de que se presente.

   Para rechazar una accion, seleccione la misma y pulse r; el rechazo se
   puede cancelar pulsando r otra vez. De manera parecida, seleccione una
   accion y pulse a para aprobarla; pulse a otra vez para devolverla a su
   estado original. Puede deshacer esta accion empleando Deshacer -> Deshacer
   (Control+u) a la vez que la pantalla del solucionador esta activa. Si
   cancela un rechazo o una desinstalacion, cualquier solucion que se ignoro
   estara disponible la siguiente vez que genere una solucion nueva.

   [Nota] Nota
          Por omision el solucionador rechaza acciones que puedan cambiar el
          estado de paquetes retenidos, o que instalan versiones prohibidas
          de ciertos paquetes. Puede invalidar estos rechazos, y por ello
          anular el estado configurado, de la misma forma que puede invalidar
          cualquier otro rechazo. Si configura la opcion
          Aptitude::ProblemResolver::Allow-Break-Holds como true desactivaria
          estas acciones, lo cual quiere decir que el solucionador siempre
          rompera retenciones (aunque con una penalizacion, vease
          Aptitude::ProblemResolver::BreakHoldScore).

   Las acciones rechazadas se muestran de color rojo y marcadas con una "R",
   mientras que las acciones aprobadas son verdes y se marcan con una "A".
   Puede ver esto en la siguiente imagen, donde la accion "mantener
   gstreamer0.8-cdparanoia en su version presente" se ha rechazado, y que la
   accion "mantener sound-juicer en su version presente" se aprobo.

   Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
                 Paquetes                         Resolver dependencias
   --\ Mantener los paquetes siguientes en la version actual:
 R   gstreamer0.8-cdparanoia                           [0.8.11-1 (unstable, now)]
 A   sound-juicer                                      [2.10.1-3 (unstable, now)]
















 [1(1)/...] Sugiere 2 mantenidos
 e: Examinar  !: Aplicar  .: Siguiente  ,: Anterior

   Las aprobaciones o rechazos solo afectan a las soluciones generadas
   recientemente. Puede ver cuando se ha generado una solucion nueva
   examinando el indicador en la esquina inferior izquierda de la pantalla:
   si hay un numero entre parentesis, muestra el numero de soluciones
   generadas. Siendo esto asi, cuando el numero que se encuentra frente al
   parentesis y el que esta dentro son identicos (como aparece arriba),
   pulsar <<.>> genera una nueva solucion. Si no hay ningun numero entre
   parentesis, (por ejemplo, si el indicador muestra [1/5]), entonces no
   quedan mas soluciones por generar. En cualquier momento, puede seleccionar
   la ultima solucion generada pulsando >, o < para ver la primera solucion
   generada.

   [Importante] Importante
                El estado del solucionador de problemas cambia cuando
                modifica el estado de cualquier paquete. Si marca un paquete
                para instalar, actualizar o eliminar, etc... el solucionador
                desecha todos los rechazos y aprobaciones, asi como las
                soluciones que haya generado hasta el momento.

   Ademas de las acciones que puede seleccionar de la lista en la parte
   superior de la pantalla, tambien puede seleccionarlas usando la lista en
   la parte inferior de la pantalla. Para acceder a ella use el raton o pulse
   Tab. Por ultimo, para ver las decisiones que el solucionador tomo por
   orden, pulse o. Esto dara un lista de las dependencias que se resolvieron
   y la accion tomada para ello, como puede ver en la siguiente captura de
   pantalla.

   Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
                 Paquetes                         Resolver dependencias
   --\ gnome-desktop-environment depende de sound-juicer
     -> Cancelar la eliminacion de sound-juicer
   --\ sound-juicer depende de gstreamer0.8-cdparanoia
     -> Cancelar la eliminacion de gstreamer0.8-cdparanoia





 GNOME 2 CD Ripper
 gnome-desktop-environment depende de sound-juicer
 --\ Las acciones siguientes resolveran estas dependencias:
   -> Eliminar gnome-desktop-environment [1:2.10.2.3 (unstable, testing, now)]
   -> Cancelar la eliminacion de sound-juicer
   -> Desactualizar sound-juicer [2.10.1-3 (unstable, now) -> 0.6.1-2 (testing)]




 [1(1)/...] Sugiere 2 mantenidos
 e: Examinar  !: Aplicar  .: Siguiente  ,: Anterior

   Puede abandonar esta vista pulsando o otra vez.

  Costs in the interactive dependency resolver

    Costs and cost components

   The cost of a solution produced by the interactive dependency resolver is
   a value that aptitude uses to determine how "bad" that solution is.
   Solutions that are "better" are always displayed before solutions that are
   "worse". The cost of solutions is defined in the configuration option
   Aptitude::ProblemResolver::SolutionCost.

   Some typical costs are shown in Ejemplo 2.1, "Sample resolver costs".

   Ejemplo 2.1. Sample resolver costs

   The default cost, sorting solutions by their safety cost, then by their
   apt pin priority:

 safety, priority

   Remove as few packages as possible, then cancel as few actions as
   possible:

 removals, canceled-actions

   Sort solutions by the number of packages they remove plus twice the number
   of actions they cancel.

 removals + 2 * canceled-actions

   As can be seen from the above examples, a cost is not necessarily a single
   number. In fact, a cost consists of one or more cost components, each of
   which is a number associated with the solution. When sorting solutions,
   the resolver examines cost components in order, proceeding to later
   components only if the earlier ones are equal. For instance, in the cost
   "removals, canceled-actions", solutions with fewer removals always appear
   before solutions with more removals, regardless of how many canceled
   actions they have. However, solutions with the same number of removals are
   sorted so that solutions with fewer canceled actions appear first.

   Cost components come in two flavors: basic cost components and compound
   cost components.

   Basic components simply name some property of the solution, such as
   "upgrades" or "removals". A list of built-in basic components provided by
   aptitude can be found in Tabla 2.1, "Basic cost components". You can also
   create your own cost components using the add-to-cost-component and
   raise-cost-component hints; see "Configurar indicaciones del solucionador"
   for details.

   Each basic component is either a counter or a level. Counters count how
   many of a solution's actions meet some condition (such as removing
   packages or installing new packages), while levels associate a number with
   each action and compute the highest number associated with any action in
   the solution.

   Tabla 2.1. Basic cost components

+----------------------------------------------------------------------------------+
|       Nombre       | Type  |                     Descripcion                     |
|--------------------+-------+-----------------------------------------------------|
|                    |       |Counts the number of holds that the solution breaks, |
|broken-holds        |Counter|if the resolver is allowed to break holds            |
|                    |       |(Aptitude::ProblemResolver::Allow-Break-Holds).      |
|--------------------+-------+-----------------------------------------------------|
|                    |       |Counts the number of pending actions that the        |
|canceled-actions    |Counter|solution cancels (keeping packages at their current  |
|                    |       |version).                                            |
|--------------------+-------+-----------------------------------------------------|
|installs            |Counter|Counts the number of packages that the solution      |
|                    |       |installs.                                            |
|--------------------+-------+-----------------------------------------------------|
|non-default-versions|Counter|Counts the number of versions that the solution      |
|                    |       |installs or upgrades from non-default sources.       |
|--------------------+-------+-----------------------------------------------------|
|                    |       |A value that increases as the apt pin priority of a  |
|priority            |Level  |version decreases. Specifically, this is computed by |
|                    |       |negating the pin priority (so, e.g., if the pin      |
|                    |       |priority is 500, this component will compute -500).  |
|--------------------+-------+-----------------------------------------------------|
|removals            |Counter|Counts the number of packages that the solution      |
|                    |       |removes.                                             |
|--------------------+-------+-----------------------------------------------------|
|removals-of-manual  |Counter|Counts the number of manually installed packages that|
|                    |       |the solution removes.                                |
|--------------------+-------+-----------------------------------------------------|
|safety              |Level  |A broad heuristic that increases as actions become   |
|                    |       |less "safe"; see "Safety costs" for details.         |
|--------------------+-------+-----------------------------------------------------|
|upgrades            |Counter|Counts the number of packages that the solution      |
|                    |       |upgrades.                                            |
+----------------------------------------------------------------------------------+

   Compound components are built by combining the values of basic components.
   For instance, removals + canceled-actions adds the components removal and
   canceled-actions, resulting in a component that counts the number of
   removals and canceled actions. Compound components combine counters by
   adding them together and levels by taking their maximum value, as shown in
   Figura 2.11, "Syntax of compound cost components".

   [Nota] Nota
          It is an error to add two levels, or to take the maximum of two
          counters, or to combine levels and counters in any way. For
          instance, the costs removals + safety and max(upgrades, installs)
          will be treated as errors and ignored by the resolver.^[13]

   Figura 2.11. Syntax of compound cost components

   Add two or more basic costs:

                 [scale1]*cost1 + [scale2]*cost2 + ...


   Take the maximum value of two or more basic costs:

                 max([scale1]*cost1, [scale2]*cost2, ...)


   Note that each individual basic component can be multiplied by a scaling
   factor before it is combined with other components. This can be used to
   control the trade-offs that the resolver makes between costs. For
   instance, a cost of 2*removals + 3*upgrades says that two removals are
   exactly as "bad" as three upgrades. Solutions that contain four removals
   and one upgrade will be considered equivalent to solutions containing one
   removal and three upgrades, since both have a cost of eleven.

    Safety costs

   Figura 2.12. Safety cost levels

   Safety cost levels

   The safety cost component is a heuristic estimate of how "safe" or
   "unsafe" a solution is. Safety costs can be thought of as a way of
   dividing solutions into several numbered "levels", where "less safe"
   levels are given higher numbers. Figura 2.12, "Safety cost levels" shows
   how this works with aptitude's default settings.

   [Sugerencia] Sugerencia
                Safety cost levels are just one way to control the order in
                which dependency solutions are returned. See "Costs in the
                interactive dependency resolver" for a full description of
                how to change the order in which aptitude sorts solutions.

   By default, aptitude initializes the resolver with a "reasonable" set of
   safety cost levels. They are:

   Tabla 2.2. Default safety cost levels

+------------------------------------------------------------------------------+
| Cost |     Descripcion     |             Opcion de configuracion             |
|level |                     |                                                 |
|------+---------------------+-------------------------------------------------|
|      |Solutions that       |                                                 |
|      |include only "safe"  |                                                 |
|      |actions (installing  |                                                 |
|10,000|the default target   |Aptitude::ProblemResolver::Safe-Level,           |
|      |for a package or     |Aptitude::ProblemResolver::Remove-Level          |
|      |keeping a package at |                                                 |
|      |its current version) |                                                 |
|      |and package removals.|                                                 |
|------+---------------------+-------------------------------------------------|
|      |La solucion que      |                                                 |
|20,000|cancela todas las    |Aptitude::ProblemResolver::Keep-All-Level        |
|      |acciones del usuario.|                                                 |
|------+---------------------+-------------------------------------------------|
|      |Soluciones que rompen|                                                 |
|      |retenciones definidas|                                                 |
|40,000|por el usuario o que |Aptitude::ProblemResolver::Break-Hold-Level      |
|      |instalan versiones   |                                                 |
|      |prohibidas.          |                                                 |
|------+---------------------+-------------------------------------------------|
|      |Soluciones que       |                                                 |
|      |instalan paquetes con|                                                 |
|      |versiones no         |                                                 |
|50,000|predeterminadas      |Aptitude::ProblemResolver::Non-Default-Level     |
|      |(tales como          |                                                 |
|      |"experimental", por  |                                                 |
|      |ejemplo).            |                                                 |
|------+---------------------+-------------------------------------------------|
|      |Soluciones que       |                                                 |
|60,000|desinstalan paquetes |Aptitude::ProblemResolver::Remove-Essential-Level|
|      |Esenciales.          |                                                 |
+------------------------------------------------------------------------------+

   If a solution qualifies for several safety cost levels, it will be placed
   in the highest one, that is, the one that appears last. For example, a
   solution that upgrades one package to its default version and breaks a
   hold on a second package will be placed at level 40,000. You can adjust
   the levels of individual versions using resolver hints; see "Configurar
   indicaciones del solucionador" for details. The default levels are
   illustrated in Figura 2.12, "Safety cost levels".

  Configurar el solucionador interactivo de dependencias.

    Configurar indicaciones del solucionador

   Puede proporcionar indicaciones al solucionador interactivo de
   dependencias para mejorar la calidad de las soluciones de dependencias que
   recibe. Estas indicaciones pueden alterar las prioridades del
   solucionador, inclinandolo mas fuertemente hacia otra version o paquete, o
   se pueden usar para "pre-cargar" el solucionador con rechazos y
   aprobaciones, al igual que si hubiese entrado en el solucionador y
   rechazado o aprobado varias versiones manualmente.

   Las indicaciones se guardan en el archivo de configuracion de apt,
   /etc/apt/apt.conf, dentro del grupo de
   configuracion."Aptitude::ProblemResolver::Hints" (vease "Referencia del
   archivo de configuracion." para mas detalles acerca del archivo de
   configuracion).

   Cada indicacion del solucionador consiste de una accion, un objetivo, y
   una version, opcional. Una indicacion se escribe de la siguiente
   manera:"accion objetivo [version]". Para aplicar una indicacion del
   solucionador, aptitude ubica uno o mas paquetes usando el valor del
   objetivo, elije una o mas versiones de esos paquetes usando el valor de la
   version y, por ultimo, ejecuta la accion.

   El campo correspondiente a la accion de una indicacion del solucionador
   puede ser uno de los siguientes:

    1. "approve": Aprobar la version, al igual que si ejecuta la orden
       Solucionador -> Conmutar Aceptada (a).

    2. "reject": Rechazar la version, al igual que si ejecuta la orden
       Solucionador -> Conmutar Rechazados (r).

    3. "discard": Discard every solution containing the version. Differs from
       "reject" in that it is not visible to the user and cannot be modified
       interactively.

    4. "increase-safety-cost-to number": increase the safety cost of any
       solution that contains the version to number; if its safety cost is
       already higher than number, this hint has no effect. The safety cost
       can be used (and is used by default) to control the order in which
       solutions appear; see "Costs and cost components" and "Safety costs"
       for details.

       Several special cost levels can be chosen by name:

         a. conflict, discard: instead of changing the safety cost, discard
            solutions containing the version as if the "discard" hint had
            been applied.

         b. maximum: the highest safety cost.

         c. minimum: the lowest safety cost. All searches start at this cost,
            so "increasing" a version to this cost has no effect. However,
            this value can also be used when adjusting the predefined cost
            levels: for instance, setting
            Aptitude::ProblemResolver::Remove-Level to "minimum" will cause
            removed packages to have no effect on the safety cost of a
            solution.

       [Nota] Nota
              The increase-safety-cost-to hint is applied in addition to any
              default safety cost that is due to the selected action. For
              instance, a hint that increases the safety cost of "install hal
              from experimental" to 15,000 will have no effect, because that
              action already has a safety cost of 50,000 (assuming that this
              version of hal is not the default candidate version).

    5. "numero": anadir el numero a la puntuacion de la version, inclinando
       al solucionador a favor del mismo o (con un numero negativo) en
       contra. Por ejemplo, la indicacion 200 emacs anade 200 a la puntuacion
       de emacs, mientras que la indicacion -10 emacs sustrae 10 a su
       puntuacion.

   Si el campo de objetivo de una indicacion del solucionador contiene un
   signo de interrogacion ("?") o tilde ("~"), se toma como un patron de
   busqueda y se consideran todas las versiones de paquetes que encajen . De
   otra manera, se toma como el nombre de un paquete a seleccionar. Asi que
   el objetivo "g++" solo seleccionaria el paquete g++, pero el objetivo
   "?section(non-free)" seleccionaria cualquier paquete dentro de la seccion
   non-free. Para mas informacion acerca de patrones de busqueda, vease
   "Patrones de busqueda".

   Si el campo de version no esta presente, todas las versiones del paquete
   se veran afectadas por la indicacion. De no ser asi, puede tener
   cualquiera de las siguientes formas:

    1. "/archivo": la indicacion afecta solo a las versiones disponibles del
       archivo dado.

    2. "<version": la indicacion afecta solo a las versiones cuyo numero de
       version es menor que version.

    3. "<=version": la indicacion solo afecta a las versiones cuyo numero de
       version es menor o igual a version.

    4. "=version": la indicacion afecta solo a las versiones cuyo numero de
       version es version.

    5. "<>version": la indicacion afecta solo a las versiones cuyo numero de
       version no es version.

    6. ">=version": la indicacion afecta solo a las versiones cuyo numero de
       version es mayor o igual a version.

    7. ">version": la indicacion afecta solo a las versiones cuyo numero de
       version es mayor que version.

    8. ":UNINST": en lugar de afectar a cualquier otra version del objetivo,
       la indicacion afecta a la decision de desinstalar el objetivo. Por
       ejemplo, "reject aptitude :UNINST" impide al solucionador intentar
       desinstalar aptitude.

    9. "version": la indicacion afecta solo a las versiones cuyo numero de
       version es version.

Patrones de busqueda

   La palabra que introduce cuando busca un paquete o crea una vista limitada
   de la lista en aptitude se conoce como "patron de busqueda". Mientras que
   el uso mas basico de los patrones de busqueda es el de emparejar por
   nombre de paquete, aptitude le permite realizar busquedas mucho mas
   complejas. Ademas de la interfaz grafica, algunas operaciones en la linea
   de ordenes pueden emplear patrones de busqueda; vease Referencia de la
   linea de ordenes para mas detalles.

   Un patron de busqueda consiste de una o mas condiciones (tambien conocidas
   como "terminos"); los paquetes se corresponden con el patron si se
   corresponden con todos sus terminos. Por lo general, los terminos empiezan
   con un signo de interrogacion ("?"), seguido del nombre del termino, el
   cual describe la busqueda que el termino realiza: por ejemplo, el termino
   ?name se corresponde con los nombres de los paquetes, mientras que el
   termino ?version busca entre las versiones de los paquetes. Por ultimo,
   cualquier parametro adicional al termino de busqueda se escribe entre
   parentesis, (vease la documentacion de terminos individuales para ver los
   detalles de lo que significa cada parametro de los diferentes terminos).

   [Nota] Nota
          Un texto que no venga precedido de "?" forma tambien un patron de
          busqueda: aptitude trata cada palabra (o palabra entrecomillada)
          como un argumento para el patron ?name, el cual busca un paquete
          cuyo nombre encaja con el texto cuando este se interpreta como una
          expresion regular.

   [Aviso] Aviso
           El comportamiento de aptitude cuando se introduce un patron de
           busqueda sin "?" (o "~") esta dispuesto asi como conveniencia para
           el uso interactivo, y cambiara en el futuro; aquellos scripts que
           invoquen aptitude deberan nombrar la estrategia de busqueda de
           manera explicita. Esto es, que los scripts deberian buscar
           "?name(coq)" en lugar de "coq").

  Buscar cadenas de caracteres.

   Muchos terminos de busqueda toman una cadena de caracteres como parametro,
   comparandolo con un campo de informacion de uno mas paquetes. Se pueden
   introducir cadenas entrecomilladas ("""), con lo cual "?name(scorch)" y
   "?name("scorch")" realizarian la misma busqueda. Si introduce una cadena
   de busqueda empleando comillas dobles puede tambien incluir comillas
   dobles literales poniendo un barra invertida ("\") justo delante: por
   ejemplo, "?description("\"easy\"")" encajaria con todo paquete cuya
   descripcion contenga la cadena en cuestion.

   En caso de introducir una cadena "simple", una que no va entrecomillada,
   aptitude considerara que la cadena ha "finalizado" cuando encuentra el
   parentesis de cierre o la coma antes del segundo argumento del termino de
   busqueda.^[14] Para que estos caracteres pierdan su significado especial,
   ponga una tilde ("~") delante de ellos. Por ejemplo, "?description(etc))"
   contiene un error de sintaxis, porque el primer ")" cierra el termino
   ?description, y el segundo ")" no se corresponde con ningun "(". En
   contraste, "?description(etc~))" si muestra cualquier paquete cuyo texto
   contiene "etc)". Hay tambien consideraciones adicionales si esta empleando
   la abreviatura de un termino; vease "Abreviaturas de terminos de
   busqueda." para mas detalles.

   La mayoria de busquedas de texto (nombres de paquete, descripciones,
   etc...) se realizan usandoexpresiones regulares no sensibles a las
   mayusculas. Una expresion regular encaja con un campo si cualquier porcion
   del campo de texto encaja con la expresion; por ejemplo, "ogg[0-9]" encaja
   con "libogg5", "ogg123", y "theogg4u". Algunos caracteres tienen un
   significado especial dentro de una expresion regular ^[15] , asi que si
   desea encontrarlos en las busquedas tendra que introducir un escape de
   barra inversa: por ejemplo, para encontrar "g++" deberia usar el patron
   "g\+\+".

   Los caracteres "!" y "|" tienen un significado especial dentro de un
   patron de busqueda. Para poder incluir estos caracteres en una cadena no
   entrecomillada, puede precederlos de una tilde ("~"). Por ejemplo, para
   encontrar paquetes cuya descripcion contiene "grand" u "oblique", use el
   patron "?description(grand~|oblique)". De todas formas, en estos casos
   posiblemente encuentre mas sencillo usar una cadena entrecomillada:
   "?description("grand|oblique")".

  Abreviaturas de terminos de busqueda.

   Algunos terminos de busqueda se pueden escribir usando formas "cortas",
   las cuales consisten de una tilde ("~") seguida de un unico caracter que
   identifica el termino y por ultimo, los argumentos (en caso de haberlos)
   para el termino. Por ejemplo, la forma corta de ?name(aptitude) es ~n
   aptitude.

   Cuando escribe un termino empleando su forma corta los caracteres de tilde
   y "espacios en blanco", espacios, tabulados y similares dividirian el
   termino e iniciarian un nuevo termino. Por ejemplo, "~mDaniel Burrows"
   buscaria cualquier paquete cuyo campo de desarrollador contenga "Daniel" y
   cuyo nombre contenga "Burrows", mientras que "~i~napt" busca paquetes
   instalados cuyo nombre contiene apt. Para incluir espacios en blanco en la
   expresion de busqueda, puede poner una tilde delante del mismo (como en
   Daniel~ Burrows) o introducir unas comillas (como en "Debian Project", o
   incluso Debian" "Project). Dentro de una cadena entrecomillada, puede
   emplear la barra invertida ("\") para cancelar el significado especial de
   unas comillas: por ejemplo, ~d"\"email" mostraria todo paquete cuya
   descripcion contiene unas comillas inmediatamente seguidas de email. ^[16]

   [Nota] Nota
          Los signos de interrogacion ("?") no pueden cerrar la forma corta
          de un termino, aunque vayan seguidos por el nombre de un termino de
          busqueda. Por ejemplo, "~napt?priority(required)" busca cualquier
          paquete cuyo nombre se corresponde con la expresion regular
          "apt?priority(required)". Anada uno o mas espacios entre los
          terminos si desea combinar un termino corto de consulta con un
          termino de busqueda especificado por el nombre, como por ejemplo
          "~napt ?priority(required)", o introduzca signos de interrogacion
          en torno al texto (de haberlo) siguiendo la forma corta del
          termino, como puede ver en "~n"apt"?priority(required)".

   Tabla 2.3, "Guia rapida de terminos de busqueda" presenta en una lista la
   forma corta de cada termino de busqueda.

  Busquedas y versiones.

   De manera predeterminada, un patron se corresponde con un paquete si
   cualquier version del paquete encaja con el patron. De todas formas,
   algunos patrones restringen sus sub-patrones para emparejarse solo con
   algunas versiones de un paquete. Por ejemplo, el termino de busqueda
   ?depends(patron) selecciona cualquier paquete que dependa de un paquete
   que encaja con patron. De todas formas, patron solo encaja con las
   versiones de un paquete que satisfacen la dependencia. Esto significa que
   si foo depende de bar (>= 3.0), estando disponibles 2.0, 3.0, y 4.0, en el
   patron de busqueda ?depends(?version(2\.0)) solo las versiones 3.0 y 4.0
   se compararian con ?version(2\.0), conduciendo a que no se encontraria foo
   en esta busqueda.

   Importa que versiones se revisan porque, al igual que en el ejemplo
   anterior, algunos patrones encajarian con una version pero no con la otra.
   Por ejemplo, el patron ?installed solo muestra la version del paquete que
   esta instalado. De manera similar, el patron ?maintainer(desarrollador)
   solo encontraria versiones que contengan el desarrollador dado.
   Normalmente, todas las versiones de un paquete tienen el mismo
   desarrollador, pero este no es siempre el caso; de hecho, cualquier patron
   de busqueda que examina los campos de un paquete (aparte de su nombre, por
   supuesto) actua de esta manera, pues todos los campos de un paquete pueden
   variar de una version a otra.

   Para revisar un patron con todas las versiones de un paquete, aunque el
   patron generalmente se compara solo con algunas versiones, use el termino
   ?widen. Por ejemplo, ?depends(?widen(?version(2\.0))) muestra cualquier
   paquete A que depende de un paquete B, donde B encaja con la version 2.0,
   independientemente de si la version satisface la dependencia de A. Por
   otro lado, el termino ?narrow restringe las versiones con las cuales se
   compara el sub-patron: ?narrow(?installed, ?depends(?version(ubuntu)))
   encontraria cualquier paquete cuya version instalada tiene una dependencia
   que se puede satisfacer con un paquete cuya cadena de version contenga
   "ubuntu".

   [Nota] Nota
          Hay una sutil pero importante distincion entre emparejar un patron
          con un paquete, y emparejarlo con todas las versiones de ese
          paquete. Cuando un patron se compara con un paquete cada uno de sus
          terminos se compara con el paquete, y por lo tanto cada termino
          encajaria si cualquier version del paquete encaja. En contraste,
          cuando un patron se compara con cada version de un paquete,
          encajaria con exito al emparejarse cuando todos sus terminos
          encajan con la misma version del paquete.

          Por ejemplo: suponga que la version 3.0-1 del paquete aardvark esta
          instalado, pero esta disponible la version 4.0-1. La expresion de
          busqueda ?version(4\.0-1)?installed muestra aardvark, porque
          ?version(4\.0-1) encaja con la version 4.0-1 de aardvark, mientras
          que ?installed encaja con la version 3.0-1. Por otra parte, esta
          expresion no se emparejaria con todas las versiones de aardvark,
          porque no hay ninguna version instalada y porque tambien tiene el
          numero de version 4.0-1.

  Objetivos explicitos de busqueda.

   Algunas busquedas particularmente complejas se pueden expresar en aptitude
   usando objetivos explicitos. En una expresion normal de busqueda no hay
   ninguna manera de referirse al paquete o a la version que se revisa en el
   momento. Por ejemplo, suponga que desea realizar una busqueda de todo
   paquete P que depende de un segundo paquete Q de manera que Q recomienda
   P. Obviamente, necesita comenzar con el termino ?depends(...). Pero el
   termino introducido en ... necesita seleccionar paquetes identicos a aquel
   emparejado con ?depends. Cuando he descrito esta meta trate con este tema
   dando los nombres de los paquetes, denominandolos P y Q; terminos con
   objetivos explicitos harian exactamente lo mismo. ^[17]

   Un objetivo explicito se introduce con el termino ?for.

   Figura 2.13. Sintaxis del termino ?for

 ?for variable: patron

   Funciona de la misma manera que patron, pero puede emplear la variable
   dentro de patron para referirse al paquete o version con el cual se
   empareja patron. Puede usar variable de dos maneras:

    1. El termino ?= encajaria de manera exacta con el paquete o la version
       indicada por la variable dada. De manera especifica, si el termino
       ?for correspondiente se limita a una sola version, ?= encajaria o bien
       con la version (si ?= se ha limitado) o con el paquete completo; de
       otra forma, encaja con cualquier version del paquete.

       Vease Ejemplo 2.2, " Uso del termino ?=. " para ver un ejemplo de uso
       de ?=.

    2. El termino ?bind(variable, patron) encaja con cualquier paquete o
       version si el valor de variable encaja con patron.

       Hay una forma abreviada para terminos de tipo ?. La expresion
       ?bind(variable, ?termino[(argumentos)]) se puede sustituir por
       ?variable:termino(argumentos).

       Vease Ejemplo 2.3, "Uso del termino ?bind." para un ejemplo de uso de
       ?bind.

  Referencia de los terminos de busqueda.

   Tabla 2.3, "Guia rapida de terminos de busqueda" proporciona un escueto
   resumen de todos los terminos de busqueda en aptitude. Puede consultar la
   descripcion completa de cada termino a continuacion.

   Tabla 2.3. Guia rapida de terminos de busqueda

+-------------------------------------------------------------------------------------------------+
|          Forma larga          |                Forma corta                |     Descripcion     |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar el       |
|                               |                                           |paquete ligado a     |
|?=variable                     |                                           |variable; vease      |
|                               |                                           |"Objetivos explicitos|
|                               |                                           |de busqueda.".       |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar el       |
|?not(patron)                   |!patron                                    |paquete que no encaja|
|                               |                                           |con patron.          |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |que se han marcado   |
|?action(accion)                |~aaccion                                   |para la accion dada  |
|                               |                                           |(p. ej., "install" o |
|                               |                                           |"upgrade").          |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?all-versions(patron)          |                                           |cuyas versiones      |
|                               |                                           |encajan con patron.  |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar todo     |
|?and(patron1, patron2)         |patron1 patron2                            |paquete que encaja   |
|                               |                                           |con patron1 y        |
|                               |                                           |patron2.             |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?any-version(patron)           |                                           |con al menos una     |
|                               |                                           |version que encaje   |
|                               |                                           |con patron.          |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?archive(archivo)              |~Aarchivo                                  |del archivo dado     |
|                               |                                           |(tales como          |
|                               |                                           |"unstable").         |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?automatic                     |~M                                         |automaticamente      |
|                               |                                           |instalados.          |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar cualquier|
|                               |                                           |variable que encaja  |
|?bind(variable, patron)        |?variable:nombre_del_termino[(argumentos)] |con patron; vease    |
|                               |                                           |"Objetivos explicitos|
|                               |                                           |de busqueda.".       |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?broken                        |~b                                         |con una dependencia  |
|                               |                                           |rota.                |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar cualquier|
|?broken-tipodep                |~Btipodep (tipo de dependencia)            |paquete con una      |
|                               |                                           |dependencia rota del |
|                               |                                           |tipodep dado.        |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar cualquier|
|                               |                                           |paquete con una      |
|?broken-tipodep(patron)        |~DB[tipodep:]patron                        |dependencia rota del |
|                               |                                           |tipodep dado que     |
|                               |                                           |encaje con patron.   |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |sobre los que un     |
|?broken-reverse-tipodep(patron)|~RB[tipodep:]patron                        |paquete que encaja   |
|                               |                                           |con el patron declara|
|                               |                                           |una dependencia rota |
|                               |                                           |del tipo tipodep.    |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |que entran en        |
|?conflicts(patron)             |~Cpatron                                   |conflicto con un     |
|                               |                                           |paquete que encaja   |
|                               |                                           |con patron.          |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?config-files                  |~c                                         |desinstalados pero no|
|                               |                                           |purgados.            |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |que declaran una     |
|?tipodep(patron)               |~D[tipodep:]patron                         |dependencia de tipo  |
|                               |                                           |tipodep sobre un     |
|                               |                                           |paquete que encaja   |
|                               |                                           |con patron.          |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?description(descripcion)      |~ddescripcion                              |cuya descripcion     |
|                               |                                           |encaja con           |
|                               |                                           |descripcion.         |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |esenciales, aquellos |
|?essential                     |~E                                         |con Essential: yes en|
|                               |                                           |sus archivos de      |
|                               |                                           |control.             |
|-------------------------------+-------------------------------------------+---------------------|
|?exact-name(nombre)            |                                           |Seleccionar paquetes |
|                               |                                           |llamados nombre.     |
|-------------------------------+-------------------------------------------+---------------------|
|?false                         |~F                                         |No seleccionar       |
|                               |                                           |paquetes.            |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |que encajan el patron|
|                               |                                           |con la variable      |
|?for variable: patron          |                                           |ligada al paquete con|
|                               |                                           |que se empareja;     |
|                               |                                           |vease "Objetivos     |
|                               |                                           |explicitos de        |
|                               |                                           |busqueda.".          |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?garbage                       |~g                                         |que ningun paquete   |
|                               |                                           |instalado manualmente|
|                               |                                           |requiere.            |
|-------------------------------+-------------------------------------------+---------------------|
|?installed                     |~i                                         |Seleccionar paquetes |
|                               |                                           |instalados.          |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?maintainer(desarrollador)     |~mdesarrollador                            |cuyo responsable es  |
|                               |                                           |el desarrollador.    |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?narrow(filtro, patron)        |~S filtro patron                           |que encajan con ambos|
|                               |                                           |filtro y patron en   |
|                               |                                           |una sola version.    |
|-------------------------------+-------------------------------------------+---------------------|
|?name(nombre)                  |~nnombre, nombre                           |Seleccionar paquetes |
|                               |                                           |con el nombre dado.  |
|-------------------------------+-------------------------------------------+---------------------|
|?new                           |~N                                         |Seleccionar paquetes |
|                               |                                           |nuevos.              |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Buscar paquetes      |
|?obsolete                      |~o                                         |instalados que no se |
|                               |                                           |pueden descargar.    |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?or(patron1, patron2)          |patron1 | patron2                          |que encajan con      |
|                               |                                           |patron1, patron2, o  |
|                               |                                           |ambos.               |
|-------------------------------+-------------------------------------------+---------------------|
|?origin(origen)                |~Oorigen                                   |Seleccionar paquetes |
|                               |                                           |con el origen dado.  |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?provides(patron)              |~Ppatron                                   |que proveen un       |
|                               |                                           |paquete que encaja   |
|                               |                                           |con el patron.       |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?priority(prioridad)           |~pprioridad                                |con la prioridad     |
|                               |                                           |dada.                |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |que son objetivo de  |
|                               |                                           |una dependencia de   |
|?reverse-tipodep(patron)       |~R[tipodep:]patron                         |tipo tipodep         |
|                               |                                           |declarado por un     |
|                               |                                           |paquete que encaja   |
|                               |                                           |con patron.          |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |que son el objetivo  |
|                               |                                           |de una dependencia   |
|?reverse-broken-tipodep(patron)|~RB[tipodep:]patron                        |rota de tipo tipodep |
|                               |                                           |declarado por un     |
|                               |                                           |paquete que encaja   |
|                               |                                           |con patron.          |
|-------------------------------+-------------------------------------------+---------------------|
|?section(seccion)              |~sseccion                                  |Seleccionar paquetes |
|                               |                                           |en la seccion dada.  |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |cuyo nombre de       |
|?source-package(nombre)        |                                           |paquete fuente encaja|
|                               |                                           |con la expresion     |
|                               |                                           |regular nombre.      |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |cuya version de      |
|?source-version(version)       |                                           |paquete fuente encaja|
|                               |                                           |con la expresion     |
|                               |                                           |regular version.     |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?tag(etiqueta)                 |~Getiqueta                                 |con la etiqueta      |
|                               |                                           |debtags dada.        |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Busqueda completa de |
|?term(palabra_clave)           |                                           |texto para paquetes  |
|                               |                                           |que contienen la     |
|                               |                                           |palabra_clave dada.  |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Busqueda completa de |
|                               |                                           |texto de paquetes que|
|?term-prefix(palabra_clave)    |                                           |contienen una palabra|
|                               |                                           |clave que comienza   |
|                               |                                           |con la palabra_clave.|
|-------------------------------+-------------------------------------------+---------------------|
|?true                          |~T                                         |Seleccionar todos los|
|                               |                                           |paquetes.            |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?task(tarea)                   |~ttarea                                    |dentro de la tarea   |
|                               |                                           |especificada.        |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|?upgradable                    |~U                                         |instalados           |
|                               |                                           |susceptibles de      |
|                               |                                           |actualizacion.       |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |marcados con una     |
|                               |                                           |etiqueta de usuario  |
|?user-tag                      |                                           |que encaje con la    |
|                               |                                           |expresion regular    |
|                               |                                           |user-tag (etiqueta de|
|                               |                                           |usuario).            |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar paquetes |
|                               |                                           |cuya version encaja  |
|?version(version)              |~Vversion                                  |con version (valores |
|                               |                                           |especiales: CURRENT, |
|                               |                                           |CANDIDATE, y TARGET).|
|-------------------------------+-------------------------------------------+---------------------|
|?virtual                       |~v                                         |Seleccionar paquetes |
|                               |                                           |virtuales.           |
|-------------------------------+-------------------------------------------+---------------------|
|                               |                                           |Seleccionar versiones|
|                               |                                           |para los cuales el   |
|                               |                                           |patron encaja con    |
|                               |                                           |cualquier version del|
|?widen(patron)                 |~Wpatron                                   |paquete              |
|                               |                                           |correspondiente,     |
|                               |                                           |descartando las      |
|                               |                                           |restricciones locales|
|                               |                                           |de versiones.        |
+-------------------------------------------------------------------------------------------------+

   nombre

           Emparejar paquetes cuyos nombres encajan con la expresion regular
           nombre. Este es el modo de busqueda "predeterminado" y se emplea
           con patrones que no comienzan con ~.

           [Nota] Nota
                  Use el termino ?name (descrito abajo) para encontrar
                  paquetes cuyos nombres contengan diferentes sub-cadenas;
                  por ejemplo, "?name(apti)?name(tude)" busca cualquier
                  paquete cuyo nombre contiene ambos "apti" y "tude".

   ?=variable

           Buscar paquetes que se corresponden con el valor de variable, que
           se debe cerrar con ?for. Por ejemplo, ?for x: ?depends(
           ?recommends( ?=x ) ) busca todo paquete x que dependa de un
           paquete que recomienda x.

           Por ejemplo, la siguiente expresion de busqueda reune paquetes que
           entran en conflicto con ellos mismos:

           Ejemplo 2.2. Uso del termino ?=.

           ?for x: ?conflicts(?=x)

           Para mas informacion, vease "Objetivos explicitos de busqueda.".

   ?not(patron), !patron

           Buscar paquetes que no encajan con el patron patron. Por ejemplo,
           "?not(?broken)" selecciona paquetes que no estan "rotos".

           [Nota] Nota
                  Para poder incluir "!" en una cadena de busqueda, debe
                  tener un "escape" introduciendo una tilde ("~") delante de
                  el; de no ser asi, aptitude lo considerara como parte de un
                  termino ?not. Por ejemplo, para seleccionar paquetes cuya
                  descripcion contenga "extra!", use "?description(extra~!)".

   ?and(patron1, patron2), patron1 patron2

           Buscar paquetes que encajan con ambos patron1 y patron2.

   ?or(patron1, patron2), patron1 | patron2

           Buscar paquetes que encajan con el patron1 o el patron2.

           [Nota] Nota
                  Para poder emplear el caracter "|" en una expresion
                  regular, debe tener un "escape" para impedir que aptitude
                  genere un termino OR de el: "~|".

   (patron)

           Buscar patron. Por ejemplo, "opengl (perl|python)" busca cualquier
           paquete cuyo nombre contenga opengl, asi como tambien perl o
           python.

   ?action(accion), ~aaccion

           Buscar paquetes marcados para la accion introducida. La accion
           puede ser "install" (instalar), "upgrade" (actualizar),
           "downgrade" (desactualizar), "remove" (eliminar), "purge
           (purgar)", "hold" (retener, revisa si algun paquete se ha
           retenido), o "keep" (mantener, revisa si algun paquete permanecera
           sin cambios).

           Observe que esto solo revisa si hay alguna accion por realizar
           sobre un paquete, no si se podria llevar a cabo. Por ello, por
           ejemplo, ?action(upgrade) busca aquellos paquetes que haya
           decidido actualizar, no los paquetes que se podrian actualizar en
           el futuro (para ello, use ?upgradable).

   ?all-versions(patron)

           Buscar todo paquete cuya version se corresponde con la expresion
           dada. Cada version de un paquete se comparara separadamente con el
           patron, y el paquete encajara si todas sus versiones tambien lo
           hacen. Siempre se buscaran los paquetes sin versiones, tales como
           los paquetes virtuales, con este termino de busqueda.

           Este termino no se puede ser usar en un contexto en el cual las
           versiones a comparar ya se han restringido, tales como dentro de
           ?depends o ?narrow. De todas formas, siempre se puede usar dentro
           de ?widen.

   ?any-version(patron)

           Mostrar un paquete si cualquiera de sus versiones encajan con el
           patron dado. Esta es la version dual de ?all-versions.

           Este termino no se puede ser usar en un contexto en el cual las
           versiones a comparar ya se han restringido, tales como dentro de
           ?depends o ?narrow. De todas formas, siempre se puede usar dentro
           de ?widen.

           [Nota] Nota
                  Este termino tiene una estrecha relacion con ?narrow. De
                  hecho, ?any-version(patron1 patron2) es exactamente lo
                  mismo que ?narrow(patron1, patron2).

   ?archive(archivo), ~Aarchivo

           Buscar las versiones de paquetes disponibles desde un archivo que
           encaja con la expresion regular archivo. Por ejemplo,
           "?archive(testing)" encaja con cualquier paquete disponible en el
           archivo testing.

   ?automatic, ~M

           Buscar paquetes instalados automaticamente.

   ?bind(variable, patron), ?variable:termino[(argumentos)]

           Buscar cualquier paquete o version si el patron dado encaja con el
           paquete o version ligado a la variable, que debe definir en un
           ?for de cierre.

           Ejemplo 2.3. Uso del termino ?bind.

           ?for x: ?depends(?depends(?for z: ?bind(x, ?depends(?=z))))

           ?for x: ?depends(?depends(?for z: ?x:depends(?=z)))

           Los dos patrones de busqueda en el ejemplo anterior encajan con
           cualquier paquete x de manera que x depende de un paquete y, el
           cual depende a su vez de un paquete z, de manera que x depende
           tambien de manera directa de z. El primer patron emplea ?bind
           directamente, mientras que el segundo usa una sintaxis abreviada
           equivalente al primero.

           Para mas informacion, vease "Objetivos explicitos de busqueda.".

   ?broken, ~b

           Buscar paquetes que estan "rotos": tienen dependencias
           insatisfechas, una pre-dependencia, rompen, o entran en conflicto.

   ?broken-tipodep, ~Btipodep

           Buscar paquetes con una dependencia no satisfecha ("roto") del
           tipodep dado. El tipodep puede ser "depends" (depende),
           "predepends"(pre-depende), "recommends" (recomienda), "suggests"
           (sugiere), "breaks" (rompe), "conflicts" (entra en conflicto), o
           "replaces" (reemplaza).

   ?broken-tipodep(patron), ~DB[tipodep:]patron

           Buscar paquetes con una dependencia no satisfecha del tipo tipodep
           en un paquete que encaja con patron. El tipodep puede ser
           cualquiera de los tipos de dependencias listados en la
           documentacion de ?broken-tipodep.

   ?conflicts(patron), ~Cpatron

           Buscar paquetes que entran en conflicto con un paquete que encaja
           con el patron dado. Por ejemplo,
           "?conflicts(?maintainer(dburrows@debian.org))" busca cualquier
           paquete que entra en conflicto con el paquete del que soy
           responsable.

   ?config-files, ~c

           Buscar paquetes desinstalados, pero cuyos archivos de
           configuracion permanecen en el sistema (p. ej., se eliminaron pero
           no purgaron).

   ?tipodep(patron), ~D[tipodep:]patron

           El tipodep puede ser cualquiera de los tipos dependencia que se
           muestran en la documentacion de ?broken-tipodep, asi como
           provides: por ejemplo, ?depends(libpng3) muestra todo paquete que
           depende de libpng3. Si emplea la forma corta (~D) pero sin
           introducir tipodep,buscara depends de manera predeterminada.

           Si el tipodep es "provides", muestra paquetes que proveen un
           paquete que encaja con patron (el equivalente a ?provides). De no
           ser asi, busca paquetes que declaran una dependencia de tipo
           tipodep sobre una version de paquete que encaja con patron.

   ?description(descripcion), ~ddescripcion

           Buscar paquetes cuya descripcion se corresponde con la expresion
           regular descripcion.

   ?essential, ~E

           Buscar paquetes Esenciales.

   ?exact-name(nombre)

           Buscar paquetes nombrados nombre. Funciona de manera similar a
           ?name, pero el nombre debe ser exacto. Por ejemplo, el siguiente
           patron solo emparejaria el paquete apt; con ?name, tambien
           mostraria aptitude, uvcapture, etc.

           Ejemplo 2.4. Uso del termino ?exact-name.

           ?exact-name(apt)

   ?false, ~F

           Este termino no encaja con ningun paquete. ^[18]

   ?for variable: patron

           Buscar patron, pero puede emplear la variable dentro del patron
           para referirse al paquete o version del paquete.

           Puede emplear variable de dos maneras. Para usar un termino del
           tipo ?, escriba ?variable:nombre_termino(argumentos); por ejemplo,
           ?x:depends(apt). Ademas, el termino ?=variable selecciona todo
           paquete o version que se corresponde con el valor de la variable.

           Por ejemplo, el siguiente termino busca cualquier paquete x que
           recomienda y depende de un segundo paquete y.

           Ejemplo 2.5. Uso del termino ?for.

           ?for x: ?depends( ?for y: ?x:recommends( ?=y ) )

           Para mas informacion, vease "Objetivos explicitos de busqueda.".

   ?garbage, ~g

           Buscar paquetes que no estan instalados, o que se instalaron
           automaticamente y que no son dependencia de ningun paquete
           instalado.

   ?installed, ~i

           Buscar versiones de paquetes instalados.

           Debido a que de manera predeterminada se revisan todas las
           versiones, esto generalmente muestra paquetes que estan
           instalados.

   ?maintainer(desarrollador), ~mdesarrollador

           Buscar paquetes cuyo campo de desarrollador se corresponde con la
           expresion regular desarrollador. Por ejemplo, "?maintainer(joeyh)"
           mostraria todos los paquetes mantenidos por Joey Hess.

   ?narrow(filtro, patron), ~S filtro patron

           Este termino "restringe" la busqueda a las versiones de paquetes
           que se corresponden con filtro. En particular, muestra cualquier
           version del paquete que encaja con ambos filtro y patron. El valor
           de la cadena de la correspondencia es el valor de patron.

   ?name(nombre), ~nnombre

           Buscar paquetes cuyo nombre encaja con la expresion regular
           nombre. Por ejemplo, la mayoria de los paquetes que encajan con
           "?name(^lib)" son bibliotecas de un tipo u otro.

   ?new, ~N

           Buscar paquetes "nuevos": esto es, que se han anadido al archivo
           desde la ultima vez que limpio la lista de paquetes usando
           Acciones -> Olvidar paquetes nuevos (f) o la accion en linea de
           ordenes forget-new.

   ?obsolete, ~o

           Este termino busca todo paquete instalado no disponible en ninguna
           de sus versiones desde cualquier archivo. Estos paquetes aparecen
           en la interfaz grafica como "Paquetes obsoletos o creados
           localmente".

   ?origin(origen), ~Oorigen

           Buscar versiones de un paquete cuyo origen encaja con la expresion
           regular origen. Por ejemplo, "!?origin(debian)" muestra cualquier
           paquete no oficial en su sistema (paquetes que no provienen del
           archivo de Debian).

   ?provides(patron), ~Ppatron

           Buscar versiones de un paquete que proveen otro que encaja con
           patron. Por ejemplo, "?provides(mail-transport-agent)" muestra
           todos los paquetes que proveen "mail-transport-agent".

   ?priority(prioridad), ~pprioridad

           Buscar paquetes cuya prioridad es prioridad; La prioridad puede
           ser extra, important, optional, required, o standard. Por ejemplo,
           "?priority(required)" muestra aquellos paquetes con una prioridad
           "required".

   ?reverse-tipodep(patron), ~R[tipodep:]patron

           tipodep puede ser "provides" o uno de los tipos de dependencias
           ilustrados en la documentacion de ?broken-tipodep. Si tipodep no
           esta presente, depends es el argumento predeterminado.

           Si tipodep es "provides", muestra los paquetes cuyo nombre es
           provisto por una version de un paquete que se corresponde con
           patron. De no ser asi, muestra paquetes con una version de paquete
           que se corresponde con patron y sobre la cual declara un
           dependencia tipodep.

   ?reverse-broken-tipodep(patron), ?broken-reverse-tipodep(patron),
   ~RB[tipodep:]patron

           tipodep puede ser "provides" o uno de los tipos de dependencias
           ilustrados en la documentacion de ?broken-tipodep. Si tipodep no
           esta presente, depends es el argumento predeterminado.

           Buscar paquetes con una version de paquete que encaja con patron
           sobre la que declara una dependencia insatisfecha de tipodep.

   ?section(seccion), ~sseccion

           Buscar paquetes cuya seccion coincide con la expresion regular
           seccion.

   ?source-package(nombre)

           Buscar paquetes cuyo nombre de paquete fuente coincide con la
           expresion regular nombre.

   ?source-version(version)

           Buscar paquetes cuya version de paquete fuente coincide con la
           expresion regular version.

   ?tag(etiqueta), ~Getiqueta

           Buscar paquetes cuyo campo de <<Tag>> (etiqueta) coincide con la
           expresion regular etiqueta. Por ejemplo, el patron
           ?tag(game::strategy) mostraria juegos de estrategia.

           Para mas informacion acerca de etiquetas y debtags, vease
           http://debtags.alioth.debian.org.

   ?task(tarea), ~ttarea

           Buscar paquetes agrupados bajo una tarea cuyo nombre coincide con
           la expresion regular tarea.

   ?term(palabra_clave)

           Este termino ejecuta una busqueda completa de texto de
           palabra_clave en el almacen de paquetes de apt. Cuando se usa con
           "aptitude search", Buscar -> Limitar vista (l) en la interfaz de
           curses, o introducido en el espacio de la ventana de busqueda de
           la interfaz de usuario GTK+, este termino permite a aptitude
           acelerar la busqueda usando un indice Xapian.

   ?term-prefix(palabra_clave)

           Este termino ejecuta una busqueda completa de texto de cualquier
           palabra clave que comienza con la palabra_clave en el almacen de
           paquetes de apt. Cuando se usa con "aptitude search", Buscar ->
           Limitar vista (l) en la interfaz de curses, o introducido en el
           espacio de la ventana de busqueda de la interfaz de usuario GTK+,
           este termino permite a aptitude acelerar la busqueda usando un
           indice Xapian.

           Esto es similar a ?term, pero empareja las extensiones de
           palabraclave. Por ejemplo, el siguiente patron de busqueda muestra
           todo paquete indexado bajo las palabras clave hour, hourglass,
           hourly, y asi en adelante.

           Ejemplo 2.6. Uso del termino ?term-prefix.

           ?term-prefix(hour)

   ?true, ~T

           Este termino empareja todo paquete. Por ejemplo
           "?installed?provides(?true)" muestra los paquetes instalados que
           cualquier otro provee.

   ?upgradable, ~U

           Este termino busca cualquier paquete instalado susceptible de
           actualizacion.

   ?user-tag(etiqueta)

           Este termino busca todo paquete marcado con un <<user-tag>> que se
           corresponde con la expresion regular etiqueta.

   ?version(version), ~Vversion

           Buscar cualquier version de paquete cuyo numero de version se
           corresponde con la expresion regular version, con las excepciones
           mencionadas posteriormente. Por ejemplo, "?version(debian)"
           muestra paquetes cuya version contiene "debian".

           Los siguientes valores de version se tratan de manera especifica.
           Para buscar un numero de version que contiene estos valores,
           preceda el valor con una barra inversa; por ejemplo, para
           encontrar versiones de paquetes cuyo numero contiene CURRENT,
           busque con \CURRENT.

              o CURRENT busca la version instalada del paquete, de existir.

              o CANDIDATE busca la version, de existir, del paquete que se
                instalaria si pulsa + sobre el paquete o ejecuta aptitude
                install sobre el paquete.

              o TARGET busca la version de un paquete marcado para su
                instalacion, de existir.

   ?virtual, ~v

           Buscar cualquier paquete puramente virtual; esto es, que un
           paquete provee su nombre o que se menciona como dependencia, sin
           que exista ningun paquete con tal nombre. Por ejemplo
           "?virtual!?provides(?true)" muestra paquetes que son virtuales y
           que ningun otro paquete provee: declarados como dependencia pero
           que no existen.

   ?widen(patron), ~Wpatron

           "Extender" la busqueda: si se ha usado un termino de cierre (tales
           como ?depends) en la busqueda de versiones, estos limites
           desaparecen. Por ello, ?widen(patron) muestra la version de un
           paquete si el patron se corresponde con cualquier version de ese
           paquete.

Personalizar aptitude

  Personalizar la lista de paquetes.

   Puede personalizar la lista de paquetes de varias maneras: la presentacion
   de los paquetes, como se crea la jerarquia de paquetes, como se agrupan
   los paquetes e incluso configurar la pantalla principal.

    Personalizar la presentacion de los paquetes

   Esta seccion describe como configurar los contenidos y el formato de la
   lista de paquetes, la linea de estado y la de cabecera, asi como la salida
   de aptitude search.

   Puede definir el formato de cada uno de estos espacios con una "cadena
   formato". Una cadena formato es una cadena de texto que contiene escapes
   tales como % %p, %S, y mas. La salida resultante se crea tomando el texto
   para reemplazar los escapes % de acuerdo a su significado (explicados a
   continuacion).

   Un escape % puede tener un tamano definido, en cuyo caso siempre se
   reemplazaria con la misma cantidad de texto (con espacios anadidos para
   rellenar si es necesario), o puede ser "ampliable", tomando el espacio que
   las columnas de tamano fijo no requieren. De existir varias columnas
   ampliables, el espacio se distribuye de manera equitativa.

   Todos los escapes % tienen un tamano y/o capacidad de ampliacion. Puede
   cambiar el tamano de un escape % insertandolo entre % y el caracter que
   identifica el escape; por ejemplo, %20V genera la version candidata del
   paquete, 20 caracteres de ancho. El ancho "basico" de la columna puede
   variar dependiendo del contenido si inserta un signo de interrogacion (?)
   entre % y el caracter que identifica el escape. Cabe que las columnas
   resultantes no se puedan alinear verticalmente.

   Si desea poder ampliar un escape % en particular, a pesar de tener un
   ancho definido, inserte una celdilla (p. ej., "#") a su derecha. Por
   ejemplo, para mostrar la version candidata de un paquete sin importar su
   longitud, use la cadena formato %V#. Puede tambien insertar # despues de
   algo que no es un escape %; aptitude "ampliara" el texto que precede a #
   anadiendo espacios tras el.

   En resumen, la sintaxis de un escape % es:

 %[ancho][?]codigo[#]

   Las variables de configuracion Aptitude::UI::Package-Display-Format,
   Aptitude::UI::Package-Status-Format, y Aptitude::UI::Package-Header-Format
   definen la forma predeterminada de la lista de paquetes, la cabecera en lo
   alto de la lista de paquetes, y la linea de estado debajo de la lista de
   paquetes, respectivamente. Para cambiar la manera en que se muestran los
   resultados de una orden aptitude search, use la opcion -F.

   Los siguientes escapes % estan disponibles en cadenas formato:

   [Nota] Nota
          Algunas de las descripciones a continuacion se refieren al
          "paquete". En la interfaz grafica de usuario (GUI), esto es el
          paquete que esta visionando o el seleccionado; en la busca en linea
          de ordenes, esto es el paquete que esta visionando

    Escape       Nombre          Tamano      Ampliable      Descripcion
                             predeterminado
                                                       Esto no es realmente
                                                       un escape; solo
   %%       Literal %        1               No        inserta un signo
                                                       porcentual en la
                                                       salida en el momento
                                                       en que aparece.
                                                       En algunas
                                                       circunstancias, una
                                                       cadena formato de
                                                       presentacion puede
                                                       tener "parametros":
                                                       por ejemplo, en el
                                                       search de linea de
            Reemplazo de                               ordenes, los grupos
   %#numero parametro        Variable        No        encontrados en la
                                                       busqueda se usan como
                                                       parametros al
                                                       presentar el
                                                       resultado. El
                                                       parametro, que se
                                                       indica con numero,
                                                       reemplaza al codigo
                                                       del formato.
                                                       Una marca de un solo
                                                       caracter que resume
                                                       cualquier accion que
                                                       se va a ejecutar sobre
   %a       Marca de accion  1               No        el paquete, tal y como
                                                       se describe en
                                                       Figura 2.10, "Valores
                                                       de la marca de
                                                       "accion"".
                                                       Una descripcion algo
                                                       mas detallada de la
   %A       Accion           10              No        accion que se va a
                                                       ejecutar sobre el
                                                       paquete.
                                                       Si no hay paquetes
                                                       rotos, no produce
                                                       nada. De otra forma,
   %B       Total rotos      12              No        genera una cadena como
                                                       por ejemplo "Broken:
                                                       10", que describe el
                                                       numero de paquetes
                                                       rotos.
                                                       Una marca de un solo
                                                       caracter que resume el
                                                       estado actual del
   %c       Marca de estado  1               No        paquete, tal y como se
            actual                                     describe en
                                                       Figura 2.9, "Valores
                                                       de la marca de "estado
                                                       actual"".
                                                       Una descripcion mas
   %C       Estado actual    11              No        detallada del estado
                                                       actual del paquete.
   %d       Descripcion      40              Si        La descripcion corta
                                                       del paquete.
            El tamano del                              El tamano del archivo
   %D       paquete          6               No        del paquete que
                                                       contiene el paquete.
            Nombre del                                 El nombre del
   %H       anfitrion        15              No        ordenador en el que
            (<<host>>)                                 ejecuta aptitude.
                                                       Mostrar la prioridad
                                                       mas alta asignada a la
                                                       version de un paquete;
                                                       para paquetes, muestra
   %i       Prioridad pin    4               No        la prioridad de la
                                                       version que se va a
                                                       instalar de forma
                                                       predeterminada (de
                                                       existir).
                                                       El espacio aproximado
   %I       Tamano instalado 6               No        que el paquete ocupara
                                                       en el disco duro.
   %m       Desarrollador    30              Si        El desarrollador del
                                                       paquete.
                                                       Si el paquete esta
            Marca de                                   automaticamente
   %M       automatico       1               No        instalado, da como
                                                       salida "A"; si no, no
                                                       devuelve nada.
                                                       Mostrar la version de
   %n       Version del      La longitud de  No        aptitude que esta
            programa         "0.6.3".                  ejecutando,
                                                       actualmente "0.6.3".
                                                       Mostrar el nombre del
   %N       Nombre del       La longitud del No        programa;
            programa         nombre.                   generalmente,
                                                       "aptitude".
                                                       Si no se va a instalar
                                                       ningun paquete, no
                                                       muestra nada. De otra
                                                       forma, muestra una
                                                       cadena que describe el
   %o       TamDescarga      15              No        tamano total de todos
                                                       los paquetes que va a
                                                       instalar (una
                                                       estimacion de cuanto
                                                       necesita descargar);
                                                       por ejemplo "TamDesc:
                                                       1000B".
                                                       Mostrar el nombre del
                                                       paquete. Cuando vea un
                                                       paquete en un contexto
            Nombre del                                 de arbol, su nombre
   %p       paquete          30              Si        estara en negrita, de
                                                       ser posible, de
                                                       acuerdo a su
                                                       profundidad en el
                                                       arbol.
   %P       Prioridad        9               No        Mostrar la prioridad
                                                       de un paquete.
            Total de                                   Mostrar el numero
   %r       dependencias     2               No        aproximado de paquetes
            inversas                                   instalados que
                                                       dependen del paquete.
                                                       Mostrar una
                                                       descripcion abreviada
   %R       Prioridad        3               No        de la prioridad de un
            abreviada                                  paquete: por ejemplo
                                                       "Important" pasa a ser
                                                       "Imp".
   %s       Seccion          10              No        Mostrar la seccion del
                                                       paquete
            Estado de                                  Mostrar la letra <<U>>
   %S       confianza        1               No        si el paquete no esta
                                                       firmado.
                                                       El archivo en el que
   %t       Archivo          10              Si        se encuentra el
                                                       paquete.
                                                       Mostrar "*" si el
                                                       paquete esta
   %T       Etiqueta         1               No        etiquetado, de no ser
                                                       asi, no devuelve
                                                       nada.^[19]
                                                       Si las acciones
                                                       seleccionadas van a
                                                       alterar la cantidad de
                                                       espacio usado en el
            Cambio de uso de                           disco, muestra la
   %u       disco            30              No        descripcion del cambio
                                                       en el espacio del
                                                       disco duro; por
                                                       ejemplo "Se usara
                                                       100MB de espacio en
                                                       disco."
                                                       Mostrar la version
   %v       Version actual   10              No        instalada del paquete,
                                                       o <none> si el paquete
                                                       no esta instalado.
                                                       Mostrar la version del
                                                       paquete que puede
            Version                                    instalar si ejecuta
   %V       candidata        10              No        Paquete -> Instalar
                                                       (+) sobre el paquete,
                                                       o <none> si el paquete
                                                       no esta disponible.
                                                       Mostrar cuanto espacio
                                                       adicional se va a
   %Z       Cambio de        7               No        usar, o cuanto espacio
            espacio                                    se va a liberar al
                                                       instalar, actualizar o
                                                       eliminar un paquete.

    Personalizar la jerarquia de paquetes

   La jerarquia de paquetes se genera a traves de una directriz de
   agrupacion: reglas que describen como se debe construir la jerarquia. Una
   directriz de agrupacion describe una "segmentacion" de reglas; cada regla
   puede descartar paquetes, crear sub-jerarquias en los cuales los paquetes
   residen, o manipular el arbol. Los elementos de configuracion
   Aptitude::UI::Default-Grouping y Aptitude::UI::Default-Preview-Grouping
   definen las directrices de agrupacion para listas de paquetes recien
   creadas y pantallas de previsualizacion, respectivamente. Puede configurar
   la directriz de agrupacion para la lista de paquetes actual pulsando G.

   Una directriz de agrupacion se describe con una lista separada por comas
   de reglas: regla1,regla2,.... Cada regla consiste de su nombre,
   posiblemente seguido de argumentos: por ejemplo, versions o
   section(subdir). El tipo de regla determina si se necesitan argumentos, y
   cuantos.

   Una regla puede ser no-terminal o terminal. Una regla no-terminal procesa
   un paquete generando parte de la jerarquia, para despues filtrar el
   paquete con otra regla. Una regla terminal, por otra parte, tambien genera
   parte del arbol (por lo general, elementos correspondientes al paquete),
   pero no filtra el paquete con otra regla posterior. Si no especifica una
   regla terminal, aptitude usara la regla predeterminada, que es crear los
   "elementos de paquete" estandar.

 action

           Agrupar paquetes de acuerdo a la accion que se va a realizar sobre
           ellos; se ignoraran paquetes sin cambios y no actualizables. Este
           es el agrupamiento que se emplea en los arboles de
           previsualizacion.

 deps

           Esta es una regla terminal.

           Creacion de elementos de paquete estandar que puede expandir para
           mostrar las dependencias del paquete.

 filter(patron)

           Incluir solo paquetes con al menos una version que coincide con
           patron.

           No descartar ningun paquete si "no hay" un patron. Esta es una
           caracteristica de compatibilidad inversa y puede quedar obsoleta
           en el futuro.

 firstchar

           Agrupar paquetes en base al primer caracter del nombre.

 hier

           Agrupar paquetes de acuerdo a un archivo de datos adicional que
           describe una "jerarquia" de paquetes.

 pattern(patron [=> titulo] [{ directriz }] [, ...])

           Una directriz de agrupacion que puede personalizar. Cada version
           de cada paquete se compara con el patron dado. La primera
           correspondencia se emplea para asignar un titulo al paquete;
           entonces, los paquetes se agrupan segun su titulo. Las cadenas con
           forma \N que aparecen en titulo se reemplazan por el enesimo
           resultado de la busqueda. Si titulo no esta presente, se toma como
           \1. Observe que los paquetes que no se corresponden con ningun
           patron no aparecen en el arbol.

           Ejemplo 2.7. Uso de pattern (patron) para agrupar paquetes en base
           a su desarrollador.

           pattern(?maintainer() => \1)

           El ejemplo anterior agrupa paquetes de acuerdo al campo de
           desarrollador. La directriz pattern(?maintainer()) realiza la
           misma funcion, al igual que un titulo ausente pasa a ser \1 de
           manera predeterminada.

           Cabe que una entrada finalice en ||, en lugar de => titulo. Esto
           indica que los paquetes que se corresponden con patron se
           insertaran en el arbol al mismo nivel que el agrupacion patron, en
           lugar de insertarlos en sub-arboles.

           Ejemplo 2.8. Uso de pattern con algunos paquetes del nivel
           superior.

           pattern(?action(remove) => Packages Being Removed, ?true ||)

           El ejemplo anterior muestra las paquetes que se van a eliminar en
           un sub-arbol, y muestra todos los demas paquetes en el nivel
           actual, agrupados de acuerdo a las directrices que sigue pattern
           (patron).

           De manera predeterminada, todos los paquetes que se corresponden
           con cada patron se agrupan de acuerdo a las reglas que sigue la
           directriz del pattern. Para especificar una directriz diferente
           para algunos paquetes, describa la directriz entre llaves ({}) a
           continuacion del titulo del grupo, despues de ||, o despues del
           patron, en caso de que ninguno este presente. Por ejemplo:

           Ejemplo 2.9. Uso de la directriz de agrupacion pattern con
           sub-directrices.

           pattern(?action(remove) => Packages Being Removed {},
           ?action(install) => Packages Being Installed, ?true || {status})

           La directriz del ejemplo anterior tiene los siguientes efectos:

              o Los paquetes que se van a eliminar se muestran en un
                sub-arbol etiquetado "Paquetes que se eliminaran"; la
                directriz de agrupacion para este sub-arbol esta vacio, con
                lo cual se muestran los paquetes en una lista plana.

              o Los paquetes que se van a instalar se muestran en un arbol
                etiquetado Paquetes que se instalaran y agrupados de acuerdo
                a las directrices que sigue pattern.

              o Todos los paquetes restantes se ubican en el nivel mas alto
                del arbol, agrupados de acuerdo a su estado.

           Vease "Patrones de busqueda" para mas informacion acerca del
           formato de patron.

 prioridad

           Agrupar paquetes de acuerdo a su prioridad.

 section[(modo[,passthrough])]

           Agrupar paquetes de acuerdo a su campo de Seccion.

           modo puede ser uno de los siguientes:

                none

                        Agrupar en base a todo el campo de la seccion, con lo
                        cual se crean categorias tales como "non-free/games".
                        Esta es la manera predeterminada si no se especifica
                        el modo.

                topdir

                        Agrupar en base a la parte del campo de la seccion
                        antes del primer signo /; si esta parte de la seccion
                        no se reconoce, o si no hay un / se usara la primera
                        entrada en la lista Aptitude::Sections::Top-Sections.

                subdir

                        Agrupar en base a la parte del campo de seccion
                        despues del primer signo /, de estar en la lista
                        Aptitude::Sections::Top-Sections. En caso contrario,
                        o en ausencia de /, agrupa en base a todo el campo de
                        la seccion.

                subdirs

                        Agrupar en base a la parte del campo de la Seccion
                        despues del primer signo /, si la porcion del campo
                        que lo antecede esta dentro de la lista
                        Aptitude::Sections::Top-Sections; si no, o en
                        ausencia de /, se usara todo el campo. Si hay varios
                        signos / en la porcion del campo que esta en uso, se
                        formara una jerarquia de grupos. Por ejemplo, si
                        "games" no es un miembro de
                        Aptitude::Sections::Top-Sections, entonces un paquete
                        con una seccion de "games/arcade" se colocara debajo
                        de la cabecera de nivel superior "games", en un
                        sub-arbol llamado "arcade".

           En presencia de passthrough, aquellos paquetes que por una razon u
           otra no tienen una seccion real (por ejemplo, paquetes virtuales)
           pasaran directamente al siguiente nivel de agrupacion sin ser
           primero colocados en sub-categorias.

 status

           Agrupar paquetes en las siguientes categorias:

              o Instalados

              o No instalados

              o Actualizaciones de seguridad

              o Actualizables

              o Obsoletos

              o Virtuales

 tag[(faceta)]

           Agrupar paquetes de acuerdo a la informacion <<Tag>> (etiqueta)
           guardado en los archivos de paquetes Debian. Si introduce faceta
           solo se mostraran las marcas correspondientes a esta faceta, y se
           ocultaran los paquetes que no poseen esta faceta; de otra forma,
           se muestran todos los paquetes al menos una vez (con paquetes sin
           etiquetar listados separadamente de los paquetes etiquetados).

           Para mas informacion acerca de debtags, vease
           http://debtags.alioth.debian.org.

 task

           Crear un arbol llamado "Tareas" que contiene las tareas
           disponibles (la informacion acerca de las tareas es extraida de
           debian-tasks.desc, en el paquete tasksel). La regla que sigue a
           tarea creara sus categorias como hermanos de Tareas.

 versions

           Esta es una regla terminal.

           Crear elementos estandar de paquete que se pueden expandir para
           mostrar las versiones del paquete.

    Personalizar como se ordenan los paquetes

   Por omision, los paquetes en la lista de paquetes o en la salida de
   aptitude search se ordenan por nombre. De todas formas, a menudo es
   bastante util ordenarlos de acuerdo a otros criterios (por ejemplo, por
   tamano de paquete), y aptitude le permite hacer precisamente esto
   modificando la directriz de ordenacion.

   Al igual que la directriz de agrupacion descrita en la seccion anterior,
   la directriz de ordenacion es una lista separada por comas. Cada elemento
   de la lista es el nombre de una regla de ordenacion; si hay paquetes
   "iguales" de acuerdo a la primera regla, se emplea la segunda regla para
   ordenarlos, y asi en adelante. Insertar un signo de tilde (~) delante de
   una regla revierte el significado normal de esa regla. Por ejemplo,
   priority,~name ordena paquetes por prioridad, pero los paquetes con la
   misma prioridad se colocaran en orden inverso de acuerdo a su nombre.

   Para modificar la directriz de ordenacion en una lista de paquetes activa,
   pulse S. Para modificar la ordenacion predeterminada de todas las listas
   de paquetes, configure la opcion de configuracion
   Aptitude::UI::Default-Sorting. Para modificar la directriz de ordenacion
   de busqueda en aptitude, use la opcion de linea de ordenes --sort.

   Las reglas disponibles son:

   installsize

           Ordenar paquetes segun la cantidad estimada de espacio que
           necesitan cuando se instalan.

   name

           Ordenar paquetes por nombre.

   priority

           Ordenar paquetes por prioridad.

   version

           Ordenar paquetes de acuerdo a su numero de version.

  Personalizar teclas rapidas.

   Puede personalizar las teclas empleadas para activar ordenes en aptitude
   en el archivo de configuracion. Cada orden tiene una variable de
   configuracion asociada en Aptitude::UI::Keybindings; para cambiar la tecla
   ligada a una orden, simplemente configure la variable correspondiente a la
   tecla. Por ejemplo, para hacer que la tecla s realice una busqueda, cambie
   Aptitude::UI::Keybindings::Search a "s". Puede precisar que la tecla se
   debe pulsar <<Control>> introduciendo "C-" delante de la tecla: por
   ejemplo, introducir "C-s" en vez de "s" ligaria la busqueda a Control+s en
   vez de a s. Por ultimo, puede ligar la misma orden a diferentes teclas de
   una sola vez usando una lista separada por comas: por ejemplo, introducir
   "s,C-s" causaria que ambos s y Control+s ejecutasen una busqueda.

   Las siguientes ordenes pueden ligarse a teclas configurando la variable
   Aptitude::UI::Keybindings::orden, donde orden es el nombre de la orden que
   se va ligar:

   +------------------------------------------------------------------------+
   |         Orden          | Predeterminado  |         Descripcion         |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Si hay paquetes rotos y     |
   |                        |                 | aptitude ha sugerido una    |
   | ApplySolution          | !               | solucion al problema,       |
   |                        |                 | aplicar inmediatamente la   |
   |                        |                 | solucion.                   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Desplazarse al inicio de la |
   |                        |                 | pantalla actual: a lo alto  |
   | Begin                  | home,C-a        | de una lista, o a la        |
   |                        |                 | izquierda de una entrada de |
   |                        |                 | texto en un campo.          |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Informar de un fallo en el  |
   | BugReport              | B               | paquete seleccionado        |
   |                        |                 | actualmente, empleando      |
   |                        |                 | reportbug.                  |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Cancelar la interaccion     |
   |                        |                 | actual: por ejemplo,        |
   | Cancel                 | C-g,escape,C-[  | descarta una ventana de     |
   |                        |                 | dialogo o desactiva el      |
   |                        |                 | menu.                       |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Mostrar el changelog.Debian |
   |                        |                 | (registro de cambios        |
   | Changelog              | C               | Debian) del paquete         |
   |                        |                 | seleccionado o de la        |
   |                        |                 | version del paquete.        |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Modificar la directriz de   |
   | ChangePkgTreeGrouping  | G               | agrupacion de la lista de   |
   |                        |                 | paquetes activa en ese      |
   |                        |                 | momento.                    |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Modificar el limite de la   |
   | ChangePkgTreeLimit     | l               | lista de paquetes           |
   |                        |                 | actualmente activa.         |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Modificar la directriz de   |
   | ChangePkgTreeSorting   | S               | ordenacion de la lista de   |
   |                        |                 | paquetes activa.            |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Marcar el paquete           |
   | ClearAuto              | m               | seleccionado como           |
   |                        |                 | manualmente instalado.      |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Cerrar el arbol             |
   | CollapseAll            | ]               | seleccionado y todas sus    |
   |                        |                 | ramas en una lista          |
   |                        |                 | jerarquica.                 |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Cerrar el arbol             |
   | CollapseTree           | Sin ligar       | seleccionado en una lista   |
   |                        |                 | jerarquica.                 |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | En el editor de jerarquias, |
   |                        |                 | almacena la posicion del    |
   | Commit                 | N               | paquete actual en la        |
   |                        |                 | jerarquia y procede al      |
   |                        |                 | siguiente paquete.          |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Esto equivale a pulsar "Ok" |
   |                        |                 | en los cuadros de dialogo;  |
   |                        |                 | si esta interactuando con   |
   | Confirm                | enter           | una pregunta de eleccion    |
   |                        |                 | multiple de la linea de     |
   |                        |                 | estado, elige la opcion     |
   |                        |                 | predeterminada.             |
   |------------------------+-----------------+-----------------------------|
   | Cycle                  | tab             | Cambiar el foco del teclado |
   |                        |                 | al siguiente "componente".  |
   |------------------------+-----------------+-----------------------------|
   | CycleNext              | f6              | Pasar a la siguiente vista  |
   |                        |                 | activa.                     |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Pasar por organizaciones    |
   | CycleOrder             | o               | predeterminadas de la       |
   |                        |                 | pantalla.                   |
   |------------------------+-----------------+-----------------------------|
   | CyclePrev              | f7              | Pasar a la anterior vista   |
   |                        |                 | activa.                     |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Eliminar todo el texto      |
   | DelBOL                 | C-u             | entre el cursor y el inicio |
   |                        |                 | de la linea.                |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Eliminar el caracter        |
   | DelBack                | backspace,C-h   | precedente al insertar      |
   |                        |                 | texto.                      |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Eliminar todo el texto      |
   | DelEOL                 | C-k             | desde el cursor al final de |
   |                        |                 | la linea.                   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Eliminar el caracter bajo   |
   | DelForward             | delete,C-d      | el cursor al insertar       |
   |                        |                 | texto.                      |
   |------------------------+-----------------+-----------------------------|
   | Dependencies           | d               | Mostrar las dependencias    |
   |                        |                 | del paquete seleccionado.   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Cuando examina la lista de  |
   | DescriptionCycle       | i               | paquetes, realiza un ciclo  |
   |                        |                 | de las vistas disponibles   |
   |                        |                 | en el area de informacion.  |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Cuando examina la lista de  |
   | DescriptionDown        | z               | paquetes, desplaza el area  |
   |                        |                 | de informacion una linea    |
   |                        |                 | mas abajo.                  |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Cuando examina la lista de  |
   | DescriptionUp          | a               | paquetes, desplaza el area  |
   |                        |                 | de informacion una linea    |
   |                        |                 | hacia arriba.               |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Si no esta en la pantalla   |
   |                        |                 | de previsualizacion,        |
   |                        |                 | muestra una pantalla de     |
   | DoInstallRun           | g               | previsualizacion^[a]; de    |
   |                        |                 | estar viendo esta pantalla, |
   |                        |                 | ejecuta un proceso de       |
   |                        |                 | instalacion.                |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Desplazarse hacia abajo:    |
   |                        |                 | por ejemplo, desplaza el    |
   | Down                   | down,j          | texto hacia abajo o         |
   |                        |                 | selecciona el siguiente     |
   |                        |                 | elemento de la lista.       |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Ejecutar "dpkg-reconfigure" |
   | DpkgReconfigure        | R               | sobre el paquete            |
   |                        |                 | seleccionado.               |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | De haber paquetes rotos,    |
   |                        |                 | registra el estado actual   |
   | DumpResolver           | *               | del solucionador de         |
   |                        |                 | problemas en un archivo     |
   |                        |                 | (para corregir errores).    |
   |------------------------+-----------------+-----------------------------|
   | EditHier               | E               | Abrir el editor de          |
   |                        |                 | jerarquias.                 |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Desplazarse al final de la  |
   |                        |                 | pantalla actual: al final   |
   | End                    | end,C-e         | de la lista, o a la derecha |
   |                        |                 | de un campo de entrada de   |
   |                        |                 | texto.                      |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Si hay paquetes rotos y     |
   |                        |                 | aptitude ha sugerido una    |
   | ExamineSolution        | e               | solucion, muestra una       |
   |                        |                 | ventana de dialogo con una  |
   |                        |                 | descripcion detallada de la |
   |                        |                 | solucion propuesta.         |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Expandir el arbol           |
   | ExpandAll              | [               | seleccionado y todas sus    |
   |                        |                 | ramas en una lista          |
   |                        |                 | jerarquica.                 |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Expandir el arbol           |
   | ExpandTree             | Sin ligar       | seleccionado en una lista   |
   |                        |                 | jerarquica.                 |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Seleccionar la primera      |
   | FirstSolution          | <               | solucion generada por el    |
   |                        |                 | solucionador de problemas.  |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Prohibir que un paquete se  |
   | ForbidUpgrade          | F               | actualice a la version      |
   |                        |                 | disponible (o a una version |
   |                        |                 | en particular).             |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Descartar toda informacion  |
   |                        |                 | relativa a que paquetes son |
   | ForgetNewPackages      | f               | "nuevos" (vacia la lista de |
   |                        |                 | paquetes "Paquetes          |
   |                        |                 | nuevos").                   |
   |------------------------+-----------------+-----------------------------|
   | Help                   | ?               | Mostrar la pantalla de      |
   |                        |                 | ayuda en linea.             |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Desplazarse hacia delante   |
   | HistoryNext            | down,C-n        | en la historia, en un       |
   |                        |                 | editor de linea con         |
   |                        |                 | historia.                   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Desplazarse hacia atras en  |
   | HistoryPrev            | up,C-p          | la historia, en un editor   |
   |                        |                 | de linea con historia.      |
   |------------------------+-----------------+-----------------------------|
   | Hold                   | =               | Retener un paquete.         |
   |------------------------+-----------------+-----------------------------|
   | Install                | +               | Marcar un paquete para su   |
   |                        |                 | instalacion.                |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Marcar un solo paquete para |
   |                        |                 | su instalacion; todos los   |
   | InstallSingle          | I               | otros paquetes se           |
   |                        |                 | mantendran en su version    |
   |                        |                 | actual.                     |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Cancelar cualquier peticion |
   |                        |                 | de instalacion o            |
   | Keep                   | :               | eliminacion asi como todas  |
   |                        |                 | las retenciones en un       |
   |                        |                 | paquete.                    |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Seleccionar la ultima       |
   | LastSolution           | <               | solucion generada por el    |
   |                        |                 | solucionador de problemas.  |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Desplazarse a la izquierda: |
   |                        |                 | por ejemplo, mueve un menu  |
   | Left                   | left,h          | a la izquierda de la barra  |
   |                        |                 | de menu, o desplaza el      |
   |                        |                 | cursor a la izquierda si    |
   |                        |                 | edita texto.                |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | En una lista jerarquica,    |
   |                        |                 | selecciona el siguiente     |
   |                        |                 | hermano del elemento        |
   | LevelDown              | J               | actualmente seleccionado    |
   |                        |                 | (el siguiente elemento del  |
   |                        |                 | mismo nivel con la misma    |
   |                        |                 | rama padre).                |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | En una lista jerarquica,    |
   |                        |                 | selecciona el hermano       |
   | LevelUp                | K               | anterior al elemento        |
   |                        |                 | seleccionado (el elemento   |
   |                        |                 | anterior del mismo nivel    |
   |                        |                 | con la misma rama padre).   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Intenta actualizar todos    |
   | MarkUpgradable         | U               | los paquetes que no estan   |
   |                        |                 | retenidos o prohibidos de   |
   |                        |                 | actualizacion.              |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | En el Buscaminas, pone o    |
   | MineFlagSquare         | f               | quita una marca en el       |
   |                        |                 | cuadrado.                   |
   |------------------------+-----------------+-----------------------------|
   | MineLoadGame           | L               | Cargar una partida del      |
   |                        |                 | Buscaminas.                 |
   |------------------------+-----------------+-----------------------------|
   | MineSaveGame           | S               | Guardar una partida del     |
   |                        |                 | Buscaminas.                 |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Buscar en torno a la        |
   | MineSweepSquare        | Sin ligar       | casilla actual en el        |
   |                        |                 | Buscaminas.                 |
   |------------------------+-----------------+-----------------------------|
   | MineUncoverSquare      | Sin ligar       | Descubrir la casilla        |
   |                        |                 | presente en el Buscaminas.  |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Descubrir la casilla        |
   |                        |                 | presente en el Buscaminas   |
   | MineUncoverSweepSquare | enter           | en caso de estar oculta; de |
   |                        |                 | no estarlo, busca en torno  |
   |                        |                 | suyo.                       |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Desplazar la pantalla       |
   | NextPage               | pagedown,C-f    | actual a la siguiente       |
   |                        |                 | pagina.                     |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Conducir al solucionador de |
   | NextSolution           | .               | dependencias a la siguiente |
   |                        |                 | solucion.                   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Esta tecla seleccionara el  |
   | No                     | n^[b]           | boton "no" en los cuadros   |
   |                        |                 | de dialogo si/no.           |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Seleccionar la rama padre   |
   | Parent                 | ^               | del elemento seleccionado   |
   |                        |                 | en la lista jerarquica.     |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Desplazar la pantalla       |
   | PrevPage               | pageup,C-b      | actual a la pagina          |
   |                        |                 | anterior.                   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Devolver el solucionador de |
   | PrevSolution           | ,               | dependencias a la solucion  |
   |                        |                 | anterior.                   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Marcar el paquete           |
   | Purge                  | _               | seleccionado para ser       |
   |                        |                 | purgado.                    |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Activar el boton            |
   | PushButton             | space,enter     | seleccionado actualmente, o |
   |                        |                 | conmuta una casilla.        |
   |------------------------+-----------------+-----------------------------|
   | Quit                   | q               | Cerrar la vista actual.     |
   |------------------------+-----------------+-----------------------------|
   | QuitProgram            | Q               | Salir del programa.         |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Rechazar toda accion del    |
   |                        |                 | solucionador que rompe una  |
   | RejectBreakHolds       |                 | retencion; equivale a       |
   |                        |                 | Solucionador -> Rechazar    |
   |                        |                 | romper bloqueos.            |
   |------------------------+-----------------+-----------------------------|
   | Refresh                | C-l             | Redibujar la pantalla desde |
   |                        |                 | cero.                       |
   |------------------------+-----------------+-----------------------------|
   | Remove                 | -               | Marcar un paquete para su   |
   |                        |                 | eliminacion.                |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Marcar el paquete           |
   | ReInstall              | L               | seleccionado para su        |
   |                        |                 | reinstalacion.              |
   |------------------------+-----------------+-----------------------------|
   | RepeatSearchBack       | N               | Repitir la ultima busqueda, |
   |                        |                 | en direccion inversa.       |
   |------------------------+-----------------+-----------------------------|
   | ReSearch               | n               | Repitir la ultima busqueda. |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Mostrar paquetes que        |
   | ReverseDependencies    | r               | dependen del paquete        |
   |                        |                 | actualmente seleccionado.   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Desplazarse a la derecha:   |
   |                        |                 | por ejemplo, desplazarse a  |
   | Right                  | right,l         | un menu a la derecha, en la |
   |                        |                 | barra de menu, o desplazar  |
   |                        |                 | el cursor a la derecha la   |
   |                        |                 | editar texto.               |
   |------------------------+-----------------+-----------------------------|
   | SaveHier               | S               | Guardar la jerarquia actual |
   |                        |                 | en el editor de jerarquias. |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Activar la funcion de       |
   | Search                 | /               | "busqueda" del elemento de  |
   |                        |                 | interfaz actualmente        |
   |                        |                 | activo.                     |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Activar la funcion de       |
   | SearchBack             | \               | "busqueda inversa" del      |
   |                        |                 | elemento de interfaz        |
   |                        |                 | actualmente activo.         |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | En un arbol de paquetes,    |
   | SearchBroken           | b               | busca el siguiente paquete  |
   |                        |                 | roto.                       |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Marcar el paquete           |
   | SetAuto                | M               | seleccionado como instalado |
   |                        |                 | automaticamente.            |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | En un lista de paquetes,    |
   | ShowHideDescription    | D               | conmuta si el area de       |
   |                        |                 | informacion es visible o    |
   |                        |                 | no.                         |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Cuando examina una          |
   |                        |                 | solucion, marca la accion   |
   | SolutionActionApprove  | a               | actualmente seleccionada    |
   |                        |                 | como <<aprobada>> (se       |
   |                        |                 | incluira en soluciones      |
   |                        |                 | futuras, de ser posible).   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Cuando examina una          |
   |                        |                 | solucion, marca la solucion |
   | SolutionActionReject   | r               | actualmente seleccionado    |
   |                        |                 | como <<rechazada>>          |
   |                        |                 | (descartada en soluciones   |
   |                        |                 | futuras).                   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Expandir o cerrar el arbol  |
   | ToggleExpanded         | enter           | seleccionado en una lista   |
   |                        |                 | jerarquica.                 |
   |------------------------+-----------------+-----------------------------|
   | ToggleMenuActive       | C-m,f10,C-space | Activar o desactivar el     |
   |                        |                 | menu principal.             |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Cancelar la ultima accion,  |
   |                        |                 | hasta el punto en que       |
   | Undo                   | C-_,C-u         | inicio aptitude, o hasta la |
   |                        |                 | ultima vez que actualizo la |
   |                        |                 | lista de paquetes o instalo |
   |                        |                 | paquetes.                   |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Desplazarse hacia arriba:   |
   |                        |                 | por ejemplo, desplaza un    |
   | Up                     | up,k            | texto arriba o selecciona   |
   |                        |                 | el elemento anterior en una |
   |                        |                 | lista.                      |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Actualizar la lista de      |
   |                        |                 | paquetes mediante la        |
   | UpdatePackageList      | u               | obtencion de listas nuevas  |
   |                        |                 | a traves de Internet si es  |
   |                        |                 | necesario.                  |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Mostrar las versiones       |
   | Versions               | v               | disponibles del paquete     |
   |                        |                 | seleccionado.               |
   |------------------------+-----------------+-----------------------------|
   |                        |                 | Esta tecla selecciona el    |
   | Yes                    | y ^[b]          | boton "Si" en los cuadros   |
   |                        |                 | de dialogo Si/No.           |
   |------------------------------------------------------------------------|
   | ^[a] a menos que Aptitude::Display-Planned-Action tiene valor de       |
   | <<false>>.                                                             |
   |                                                                        |
   | ^[b] Esta configuracion predeterminada puede variar con diferentes     |
   | locales.                                                               |
   +------------------------------------------------------------------------+

   Ademas de las teclas de letras, numeros y puntuacion, puede ligar las
   siguientes teclas "especiales":

   +------------------------------------------------------------------------+
   | Nombre de la tecla |                    Descripcion                    |
   |--------------------+---------------------------------------------------|
   | a1                 | La tecla A1.                                      |
   |--------------------+---------------------------------------------------|
   | a3                 | La tecla A3.                                      |
   |--------------------+---------------------------------------------------|
   | b2                 | La tecla B2.                                      |
   |--------------------+---------------------------------------------------|
   | backspace          | La tecla de retroceso.                            |
   |--------------------+---------------------------------------------------|
   | backtab            | La tecla tabulado de retroceso.                   |
   |--------------------+---------------------------------------------------|
   | begin              | La tecla Comenzar (no Inicio)                     |
   |--------------------+---------------------------------------------------|
   | break              | La tecla de "pausa".                              |
   |--------------------+---------------------------------------------------|
   | c1                 | La tecla C1.                                      |
   |--------------------+---------------------------------------------------|
   | c3                 | La tecla C3.                                      |
   |--------------------+---------------------------------------------------|
   | cancel             | La tecla Cancelar.                                |
   |--------------------+---------------------------------------------------|
   | create             | La tecla Crear.                                   |
   |--------------------+---------------------------------------------------|
   |                    | Coma (,) -- observe que debido a que las comas se |
   | comma              | emplean para listar teclas, esta es la unica      |
   |                    | manera de ligar una coma a una accion.            |
   |--------------------+---------------------------------------------------|
   | command            | La tecla de Orden.                                |
   |--------------------+---------------------------------------------------|
   | copy               | La tecla Copiar.                                  |
   |--------------------+---------------------------------------------------|
   | delete             | La tecla Suprimir.                                |
   |--------------------+---------------------------------------------------|
   | delete_line        | La tecla "borrar linea".                          |
   |--------------------+---------------------------------------------------|
   | down               | La tecla de direccion "abajo".                    |
   |--------------------+---------------------------------------------------|
   | end                | La tecla Fin.                                     |
   |--------------------+---------------------------------------------------|
   | entry              | La tecla Intro.                                   |
   |--------------------+---------------------------------------------------|
   | exit               | La tecla Salir.                                   |
   |--------------------+---------------------------------------------------|
   | f1, f2, ..., f10   | Las teclas desde F1 a F10.                        |
   |--------------------+---------------------------------------------------|
   | find               | La tecla Buscar.                                  |
   |--------------------+---------------------------------------------------|
   | home               | La tecla Inicio.                                  |
   |--------------------+---------------------------------------------------|
   | insert             | La tecla Insertar.                                |
   |--------------------+---------------------------------------------------|
   | insert_exit        | La tecla "insertar salir".                        |
   |--------------------+---------------------------------------------------|
   | clear              | La tecla "borrar".                                |
   |--------------------+---------------------------------------------------|
   | clear_eol          | La tecla "borrar hasta final de linea".           |
   |--------------------+---------------------------------------------------|
   | clear_eos          | La tecla "borrar hasta final de pantalla".        |
   |--------------------+---------------------------------------------------|
   | insert_line        | La tecla "insertar linea".                        |
   |--------------------+---------------------------------------------------|
   | left               | La tecla de direccion "izquierda".                |
   |--------------------+---------------------------------------------------|
   | mark               | La tecla Marcar.                                  |
   |--------------------+---------------------------------------------------|
   | message            | La tecla Mensaje.                                 |
   |--------------------+---------------------------------------------------|
   | move               | La tecla Mover.                                   |
   |--------------------+---------------------------------------------------|
   | next               | La tecla Siguiente.                               |
   |--------------------+---------------------------------------------------|
   | open               | La tecla Abrir.                                   |
   |--------------------+---------------------------------------------------|
   | previous           | La tecla Anterior.                                |
   |--------------------+---------------------------------------------------|
   | print              | La tecla Imprimir.                                |
   |--------------------+---------------------------------------------------|
   | redo               | La tecla Rehacer.                                 |
   |--------------------+---------------------------------------------------|
   | reference          | La tecla Referencia.                              |
   |--------------------+---------------------------------------------------|
   | refresh            | La tecla Refrescar.                               |
   |--------------------+---------------------------------------------------|
   | replace            | La tecla Reemplazar.                              |
   |--------------------+---------------------------------------------------|
   | restart            | La tecla Reiniciar.                               |
   |--------------------+---------------------------------------------------|
   | resume             | La tecla Continuar.                               |
   |--------------------+---------------------------------------------------|
   | return             | La tecla de Retorno.                              |
   |--------------------+---------------------------------------------------|
   | right              | La tecla de direccion "derecha".                  |
   |--------------------+---------------------------------------------------|
   | save               | La tecla Guardar.                                 |
   |--------------------+---------------------------------------------------|
   | scrollf            | La tecla "desplazarse hacia delante".             |
   |--------------------+---------------------------------------------------|
   | scrollr            | La tecla "desplazarse hacia atras".               |
   |--------------------+---------------------------------------------------|
   | select             | La tecla Seleccionar.                             |
   |--------------------+---------------------------------------------------|
   | suspend            | La tecla Suspender.                               |
   |--------------------+---------------------------------------------------|
   | pagedown           | La tecla "Avpag".                                 |
   |--------------------+---------------------------------------------------|
   | pageup             | La tecla "Repag".                                 |
   |--------------------+---------------------------------------------------|
   | space              | La tecla Espacio.                                 |
   |--------------------+---------------------------------------------------|
   | tab                | La tecla Tabulador.                               |
   |--------------------+---------------------------------------------------|
   | undo               | La tecla Deshacer.                                |
   |--------------------+---------------------------------------------------|
   | up                 | La tecla de direccion "arriba".                   |
   +------------------------------------------------------------------------+

   Ademas de poder ligar las teclas de manera global, tambien es posible
   cambiar teclas ligadas para una parte en particular (o dominio) de
   aptitude: por ejemplo, para hacer que el tabulador sea el equivalente a la
   tecla de direccion derecha en la barra de menu, defina
   Aptitude::UI::Keybindings::Menubar::Right como "tab,right". Los siguientes
   dominios estan disponibles:

   +------------------------------------------------------------------------+
   |    Dominio    |                      Descripcion                       |
   |---------------+--------------------------------------------------------|
   | EditLine      | Empleado por elementos de edicion de linea, tales como |
   |               | el campo de entrada en un dialogo de "busqueda".       |
   |---------------+--------------------------------------------------------|
   | Menu          | Empleado por los menus que se abren hacia abajo.       |
   |---------------+--------------------------------------------------------|
   | Menubar       | Empleado por la barra de menu en la parte alta de la   |
   |               | pantalla.                                              |
   |---------------+--------------------------------------------------------|
   | Minesweeper   | Empleado por el modo Buscaminas.                       |
   |---------------+--------------------------------------------------------|
   |               | Empleado por las preguntas de eleccion multiple que    |
   | MinibufChoice | aparecen si escoge que ciertas preguntas aparezcan en  |
   |               | la linea de estado.                                    |
   |---------------+--------------------------------------------------------|
   | Pager         | Empleado cuando se muestra un archivo del disco (por   |
   |               | ejemplo, el texto de ayuda).                           |
   |---------------+--------------------------------------------------------|
   |               | Empleado por paquetes, arboles de paquetes, versiones  |
   | PkgNode       | de paquetes y dependencias de paquetes cuando aparecen |
   |               | en listas de paquetes.                                 |
   |---------------+--------------------------------------------------------|
   | PkgTree       | Empleado por listas de paquetes.                       |
   |---------------+--------------------------------------------------------|
   | Table         | Empleado por tablas de componentes (por ejemplo,       |
   |               | cuadros de dialogo).                                   |
   |---------------+--------------------------------------------------------|
   | TextLayout    | Empleado por presentaciones de texto formateados,      |
   |               | tales como las descripciones de paquetes.              |
   |---------------+--------------------------------------------------------|
   |               | Empleado por todas las presentaciones de arbol         |
   | Tree          | (incluyendo listas de paquetes, se puede anular        |
   |               | mediante PkgTree).                                     |
   +------------------------------------------------------------------------+

  Personalizar los colores del texto y estilos.

   Puede personalizar extensivamente los colores y estilos visuales empleados
   por aptitude para mostrar el texto. Cada elemento visual tiene un "estilo"
   asociado, que describe los colores y atributos visuales que se emplean
   para mostrar tal elemento. Los estilos tienen la forma de una lista de
   configuraciones para el color y los atributos. Esta lista no es
   necesariamente exhaustiva; si no se especifica algun color o atributo sus
   valores se toman del contexto visual circundante. De hecho, la mayoria de
   los elementos visuales tiene un estilo "vacio" de manera predeterminada.

   Puede modificar los contenidos de un estilo, creando un grupo de
   configuracion del mismo nombre en el archivo de configuracion de apt o de
   aptitude. Por ejemplo, el estilo de "MenuBorder" se usa para dibujar el
   borde en torno a los menus desplegables. Por omision este borde se dibuja
   resaltado y en blanco sobre azul. Insertar el siguiente texto en el
   archivo de configuracion lo dibuja en blanco sobre azul:

 Aptitude::UI::Styles {
   MenuBorder {fg white; bg cyan; set bold;};
 };

   Como puede ver, un grupo de configuracion de estilo consiste de una serie
   de instrucciones. Las clases generales de instrucciones son:

   fg color

           Mostrar el texto en primer plano con el color dado. Vease mas
           abajo para una lista de los colores conocidos por aptitude.

   bg color

           Mostrar el texto de fondo con el color dado. Vease mas abajo para
           una lista de colores conocidos por aptitude.

   set atributo

           Activar el atributo de texto dado. Vease mas abajo para una lista
           de atributos de texto conocidos por aptitude.

   clear atributo

           Desactivar el atributo de texto dado. Vease mas abajo para una
           lista de los atributos de texto conocidos por aptitude.

   flip atributo

           Conmutar el atributo de texto: si esta activo en el elemento
           circundante, se desactivara, y viceversa. Vease mas abajo para una
           lista de los atributos de texto conocidos por aptitude.

   Los colores que aptitude reconoce son el negro, azul, cian, verde,
   magenta, rojo, blanco y amarillo ^[20]. Ademas, puede especificar default
   en lugar de un color de fondo para usar el fondo predeterminado de la
   terminal (esto puede ser el color predeterminado, un archivo de imagen, o
   incluso "transparente"). Los estilos que aptitude reconoce son:

   blink

           Activar texto parpadeante.

   bold

           Dar mas brillo al color en primer plano del texto (o el fondo, si
           ha activado el video inverso).

   dim

           Esto puede causar que el texto sea mas oscuro en algunos
           terminales. No se ha observado este efecto en terminales comunes
           de Linux.

   reverse

           Intercambiar los colores en primer plano y de fondo. Muchos
           elementos visuales emplean este atributo para realizar tareas
           comunes de resaltado.

   standout

           Esto activa "el mejor modo de resaltado de la terminal". Es
           similar en xterms, pero no identico al video inverso; el
           comportamiento de esto en otros terminales puede variar.

   underline

           Activar el subrayado de texto.

   Puede seleccionar varios atributos a la vez si los separa con comas; por
   ejemplo set bold,standout;.

   [Nota] Nota
          Como se indica arriba, la interpretacion del estilo y de los
          atributos de texto depende en gran medida de la terminal. Puede que
          necesite experimentar un poco para encontrar exactamente que
          configuraciones son posibles en su terminal.

   Puede personalizar los siguientes estilos en aptitude:

   Figura 2.14. Estilos personalizables en aptitude

+---------------------------------------------------------------------------------+
|          Estilo          | Predeterminado |             Descripcion             |
|--------------------------+----------------+-------------------------------------|
|Bullet                    |fg yellow; set  |El estilo de los puntos en las listas|
|                          |bold;           |por puntos.                          |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo de las nuevas versiones de |
|                          |                |un paquete en la vista de registro de|
|                          |                |cambios. Observe que aptitude solo   |
|ChangelogNewerVersion     |set bold;       |resalta las nuevas versiones de      |
|                          |                |paquetes si el paquete               |
|                          |                |<<libparse-debianchangelog-perl>>    |
|                          |                |esta instalado.                      |
|--------------------------+----------------+-------------------------------------|
|Default                   |fg white; bg    |El estilo basico de la pantalla.     |
|                          |black;          |                                     |
|--------------------------+----------------+-------------------------------------|
|DepBroken                 |fg black; bg    |El estilo para las dependencias no   |
|                          |red;            |satisfechas.                         |
|--------------------------+----------------+-------------------------------------|
|                          |fg black; bg    |El estilo para las entradas de menu  |
|DisabledMenuEntry         |blue; set dim;  |que estan desactivadas y que no se   |
|                          |                |pueden emplear.                      |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo empleado para indicar que  |
|DownloadHit               |fg black; bg    |un archivo ha sido "hit": p.ej., no  |
|                          |green;          |ha cambiado desde la ultima vez que  |
|                          |                |se descargo.                         |
|--------------------------+----------------+-------------------------------------|
|DownloadProgress          |fg blue; bg     |El estilo del indicador de progreso  |
|                          |yellow;         |de una descarga.                     |
|--------------------------+----------------+-------------------------------------|
|                          |fg white; bg    |El estilo de editores de linea (por  |
|EditLine                  |black; clear    |ejemplo, la entrada en el cuadro de  |
|                          |reverse;        |dialogo "Buscar").                   |
|--------------------------+----------------+-------------------------------------|
|Error                     |fg white; bg    |El estilo de los mensajes de error.  |
|                          |red; set bold;  |                                     |
|--------------------------+----------------+-------------------------------------|
|Header                    |fg white; bg    |El estilo de las cabeceras de        |
|                          |blue; set bold; |pantalla.                            |
|--------------------------+----------------+-------------------------------------|
|                          |fg white; bg    |El estilo del nombre de menu         |
|HighlightedMenuBar        |blue; set       |seleccionado en la barra de menu.    |
|                          |bold,reverse;   |                                     |
|--------------------------+----------------+-------------------------------------|
|                          |fg white; bg    |El estilo de la eleccion seleccionada|
|HighlightedMenuEntry      |blue; set       |actualmente en un menu .             |
|                          |bold,reverse;   |                                     |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo del cuadro de dialogo      |
|MediaChange               |fg yellow; bg   |empleado para informar al usuario de |
|                          |red; set bold;  |que debe insertar un disco compacto  |
|                          |                |nuevo.                               |
|--------------------------+----------------+-------------------------------------|
|MenuBar                   |fg white; bg    |El estilo de la barra de menu.       |
|                          |blue; set bold; |                                     |
|--------------------------+----------------+-------------------------------------|
|MenuBorder                |fg white; bg    |El estilo de los bordes que rodean a |
|                          |blue; set bold; |un menu desplegable.                 |
|--------------------------+----------------+-------------------------------------|
|MenuEntry                 |fg white; bg    |El estilo de cada entrada en un menu |
|                          |blue;           |desplegable.                         |
|--------------------------+----------------+-------------------------------------|
|MineBomb                  |fg red; set     |El estilo de las bombas en el        |
|                          |bold;           |Buscaminas.                          |
|--------------------------+----------------+-------------------------------------|
|MineBorder                |set bold;       |El estilo del borde que se dibuja en |
|                          |                |torno al tablero del Buscaminas.     |
|--------------------------+----------------+-------------------------------------|
|MineFlag                  |fg red; set     |El estilo de las marcas en el        |
|                          |bold;           |Buscaminas.                          |
|--------------------------+----------------+-------------------------------------|
|MineNumberN               |Varios          |El estilo del numero N en el         |
|                          |                |Buscaminas; N puede variar de 0 a 8. |
|--------------------------+----------------+-------------------------------------|
|MultiplexTab              |fg white; bg    |El color empleado para mostrar       |
|                          |blue;           |"pestanas" ademas de la seleccionada.|
|--------------------------+----------------+-------------------------------------|
|MultiplexTabHighlighted   |fg blue; bg     |El color empleado para mostrar la    |
|                          |white;          |"pestana" seleccionada.              |
|--------------------------+----------------+-------------------------------------|
|                          |fg red; flip    |El estilo de los paquetes en la lista|
|PkgBroken                 |reverse;        |de paquetes que tienen dependencias  |
|                          |                |no satisfechas.                      |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo de los paquetes resaltados |
|PkgBrokenHighlighted      |fg red;         |en la lista de paquetes que tienen   |
|                          |                |dependencias no satisfechas.         |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo de los paquetes que no     |
|PkgNotInstalled           |                |estan instalados y que no se van a   |
|                          |                |instalar.                            |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo de los paquetes resaltados |
|PkgNotInstalledHighlighted|                |que no estan instalados y que no se  |
|                          |                |van a instalar.                      |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo de los paquetes instalados |
|PkgIsInstalled            |set bold;       |en la actualidad pero para los cuales|
|                          |                |no hay ninguna accion programada.    |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo de los paquetes resaltados |
|PkgIsInstalledHighlighted |set bold; flip  |instalados en la actualidad pero para|
|                          |reverse;        |los cuales no hay ninguna accion     |
|                          |                |programada.                          |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo de los paquetes en la lista|
|PkgToDowngrade            |set bold;       |de paquetes que se van a             |
|                          |                |desactualizar.                       |
|--------------------------+----------------+-------------------------------------|
|                          |set bold; flip  |El estilo de los paquetes resaltados |
|PkgToDowngradeHighlighted |reverse         |en la lista de paquetes que se van a |
|                          |                |desactualizar.                       |
|--------------------------+----------------+-------------------------------------|
|PkgToHold                 |fg white; flip  |El estilo de los paquetes retenidos  |
|                          |reverse;        |en la lista de paquetes.             |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo de los paquetes retenidos, |
|PkgToHoldHighlighted      |fg white;       |y resaltados, en la lista de         |
|                          |                |paquetes.                            |
|--------------------------+----------------+-------------------------------------|
|                          |fg green; flip  |El estilo de los paquetes en la lista|
|PkgToInstall              |reverse;        |de paquetes que se van a instalar (no|
|                          |                |actualizar) o reinstalar.            |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo de los paquetes resaltados |
|PkgToInstallHighlighted   |fg green;       |en la lista de paquetes que se van a |
|                          |                |instalar (no actualizar) o           |
|                          |                |reinstalar.                          |
|--------------------------+----------------+-------------------------------------|
|                          |fg magenta; flip|El estilo de los paquetes en la lista|
|PkgToRemove               |reverse;        |de paquetes que se van a eliminar o  |
|                          |                |purgar.                              |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo de los paquetes resaltados |
|PkgToRemoveHighlighted    |fg magenta;     |en la lista de paquetes que se van a |
|                          |                |eliminar o purgar.                   |
|--------------------------+----------------+-------------------------------------|
|PkgToUpgrade              |fg cyan; flip   |El estilo de los paquetes en la lista|
|                          |reverse;        |de paquetes que se van a actualizar. |
|--------------------------+----------------+-------------------------------------|
|                          |                |El estilo de los paquetes resaltados |
|PkgToUpgradeHighlighted   |fg cyan;        |en la lista de paquetes que se van a |
|                          |                |actualizar.                          |
|--------------------------+----------------+-------------------------------------|
|                          |fg blue; bg     |El estilo de las barras de progreso  |
|Progress                  |yellow;         |tales como el que aparece cuando se  |
|                          |                |carga el almacen de paquetes.        |
|--------------------------+----------------+-------------------------------------|
|SolutionActionApproved    |bg green;       |El estilo de las acciones aprobadas  |
|                          |                |en una solucion.                     |
|--------------------------+----------------+-------------------------------------|
|SolutionActionRejected    |bg red;         |El estilo de los acciones rechazadas |
|                          |                |en una solucion.                     |
|--------------------------+----------------+-------------------------------------|
|Status                    |fg white; bg    |El estilo de las lineas de estado en |
|                          |blue; set bold; |la base de la pantalla.              |
|--------------------------+----------------+-------------------------------------|
|TreeBackground            |                |El color basico de todas las listas y|
|                          |                |arboles.                             |
|--------------------------+----------------+-------------------------------------|
|                          |fg red; bg      |El color empleado para mostrar los   |
|TrustWarning              |black; set bold;|avisos referentes a la confianza de  |
|                          |                |los paquetes.                        |
+---------------------------------------------------------------------------------+

  Personalizar el diseno de la interfaz.

   Es posible configurar el diseno de la lista de paquetes de aptitude
   modificando el archivo de configuracion.

    Elementos de pantalla

   El diseno de pantalla se guarda en el grupo de configuracion
   Aptitude::UI::Default-Package-View, y consiste de una lista de los
   elementos de pantalla:

 Nombre Tipo {
   Row fila;
   Column columna;
   Width ancho;
   Height altura;

   opciones adicionales...
 };

   Esto crea un elemento de pantalla denominado Nombre; el tipo de elemento
   creado se determina por el Tipo. Las opciones Row, Column, Width y Height
   deben estar presentes; determinan la posicion del elemento de pantalla
   (vease mas abajo para una explicacion detallada acerca de la disposicion
   de los elementos de pantalla)

   Para ver ejemplos de como cambiar el diseno de pantalla, vease las
   definiciones de tema en el archivo /usr/share/aptitude/aptitude-defaults.

   Los siguientes tipos de elementos de pantalla estan disponibles:

   Description

           Este elemento de pantalla contiene el "area de informacion"
           (generalmente una descripcion del paquete seleccionado).

           La opcion PopUpDownKey proporciona el nombre de una orden de
           teclado que oculta o muestra el elemento de pantalla. Por ejemplo,
           si configura esto como ShowHideDescription, el elemento de
           pantalla actual tendria las mismas caracteristicas que el area de
           informacion predeterminado. La opcion PopUpDownLinked proporciona
           el nombre de otro elemento de pantalla; el elemento se mostrara u
           ocultara dependiendo de si el otro elemento lo esta tambien.

   MainWidget

           Este es un espacio para el elemento de pantalla "principal": esto
           es, generalmente, la lista de paquetes. Un diseno de interfaz debe
           contener exactamente un elemento MainWidget: ni mas, ni menos.

   Static

           Un espacio de la pantalla que muestra algun texto, que
           posiblemente contiene codigos de formato tal y como se describe en
           "Personalizar la presentacion de los paquetes". El texto a mostrar
           se puede configurar en la opcion Columns, o se puede guardar en
           otra variable de configuracion especificada en la opcion
           ColumnsCfg. El color del texto se determina por el color nombrado
           en la opcion Color.

           Los elementos Static (estaticos) se pueden mostrar u ocultar de la
           misma manera que elementos de Description, empleando las opciones
           PopUpDownKey y PopUpDownLinked.

    Ubicacion de los elementos de pantalla

   Los elementos de pantalla aparecen en un "tablero". La esquina superior
   izquierda de un elemento esta en la celula dada por las opciones Row y
   Column (comenzando generalmente por la fila 0, columna 0; esto no es
   obligatorio). El ancho de un elemento en celulas aparece en la opcion
   Width, y su altura, en la opcion Height.

   Una vez que los elementos de pantalla estan dispuestos y se les ha dado
   una cantidad inicial de espacio en la pantalla, puede que aun quede
   espacio sobrante. Si hay espacio vertical sobrante, a cada fila que
   contiene un elemento de pantalla cuya opcion RowExpand es true se le dara
   una parte de ese espacio sobrante; de manera similar, si hay espacio
   horizontal sobrante, cada columna que contiene un elemento de pantalla
   cuya opcion ColExpand es true se le dara una parte de ese espacio
   sobrante.

   En la situacion de que no haya suficiente espacio, cada fila y columna
   cuyos componentes tienen todas sus opciones RowShrink o ColShrink
   definidos como true, son encogidos. Si esto no es suficiente, todas las
   filas y columnas se encojen para encajar en el espacio disponible.

   Si no se expande un elemento de pantalla, pero si su fila o columna, su
   alineamiento se determina por las opciones RowAlign (alineamiento de la
   fila) y ColAlign (alineamiento de la columna). Configurarlos con Left
   (izq.), Right (der.), Top (inicio), Bottom (final) o Center (centro),
   indica a aptitude donde ubicar el elemento dentro de la fila o columna.

   Por ejemplo, el siguiente grupo de configuracion crea un elemento estatico
   llamado "Header", con un ancho de tres celulas y que se expande
   horizontalmente, pero no en vertical. Posee el mismo color que otras
   lineas de cabecera y emplea el formato de presentacion estandar para las
   lineas de cabecera:

 Header Static {
   Row 0;
   Column 0;
   Width 3;
   Height 1;

   ColExpand true;
   ColAlign Center;

   RowAlign Center;

   Color ScreenHeaderColor;
   ColumnsCfg HEADER;
 };

    Referencia de las opciones de diseno de la interfaz

   Las siguientes opciones estan disponibles para los elementos de pantalla:

   ColAlign alineamiento;

           El alineamiento debe ser Left, Right, o Center. Si la fila que
           contiene el elemento de pantalla actual es mas ancho que el mismo
           elemento y ColExpand es false, el elemento se posicionara en la
           fila de acuerdo al valor de alineamiento.

           Si esta opcion no esta presente, activa Left de manera
           predeterminada.

   ColExpand true|false;

           Si esta opcion se configura como true la columna que contiene este
           elemento de pantalla recibe una parte de cualquier espacio
           horizontal sobrante disponible.

           Si esta opcion no esta presente, false es la opcion
           predeterminada.

   Color nombre_de_color;

           Esta opcion afecta a los elementos Static. nombre_de_color es el
           nombre de un color (por ejemplo, ScreenStatusColor) que se debe
           usar como el color "predeterminado" para este elemento de
           pantalla.

           Si esta opcion no esta presente, la opcion predeterminada es
           DefaultWidgetBackground.

   ColShrink true|false;

           Si cada elemento de una columna tiene esta opcion como true y no
           hay suficiente espacio horizontal, la columna encogera en la
           medida de lo necesario. Observe que la columna puede variar de
           tamano aunque ColShrink sea false; simplemente indica que aptitude
           deberia intentar encoger una columna en particular antes de
           encoger las demas.

           Si esta opcion no esta presente, false es la opcion
           predeterminada.

   Column columna;

           Definir la columna mas a la izquierda que contiene este elemento
           de interfaz.

   Columns formato;

           Esta opcion afecta a los elementos de pantalla Static que no
           tienen especificada la opcion en ColumnsCfg. Configura los
           contenidos mostrados del elemento de estado; es una cadena formato
           tal y como se describe en "Personalizar la presentacion de los
           paquetes".

   ColumnsCfg HEADER|STATUS|nombre;

           Esta opcion afecta a los elementos de pantalla Static. Cambia el
           formato de pantalla del elemento seleccionado a una valor de otra
           variable de configuracion: si es HEADER o STATUS, las opciones
           Aptitude::UI::Package-Header-Format y
           Aptitude::UI::Package-Status-Format se emplean, respectivamente;
           de no ser asi, se emplea la opcion nombre.

           Si esta opcion no esta presente, se usa el valor de la opcion
           Columns para gestionar los contenidos del elemento estatico.

   Height altura;

           Definir la altura del elemento de interfaz actual.

   PopUpDownKey orden;

           Esta opcion afecta a los elementos de pantalla Description y
           Static.

           orden es el nombre de una orden de teclado (por ejemplo,
           ShowHideDescription). Si pulsa esta tecla, el elemento de pantalla
           se ocultara en caso de estar visible, y visible si esta oculto.

   PopUpDownLinked elemento;

           Esta opcion afecta a los elementos de pantalla Description y
           Static.

           elemento es el nombre de un elemento de pantalla. Cuando elemento
           es visible, el elemento actual tambien es visible; cuando elemento
           esta oculto, el elemento actual tambien esta oculto.

   Row fila;

           Definir la fila mas alta que contiene este elemento.

   RowAlign alineamiento;

           alineamiento debe ser Top, Bottom, o Center. Si la fila que
           contiene el elemento de pantalla actual es mas alto que el
           elemento mismo y si RowExpand vale false, el elemento aparecera en
           la fila de acuerdo al valor de alineamiento.

           Si esta opcion no esta presente, Top es la opcion predeterminada.

   RowExpand true|false;

           Si esta opcion tiene valor de true, la fila que contiene el
           elemento de pantalla dispondra de un espacio adicional si hay
           espacio vertical libre.

           Si esta opcion no esta presente, false es la opcion
           predeterminada.

   RowShrink true|false;

           Si da valor de true a esta opcion para cada elemento de la fila y
           no hay suficiente espacio vertical, la fila encogera en la medida
           de lo necesario. Observe que una fila puede encoger aunque
           RowShrink sea false; solo indica a aptitude que ha de intentar
           encoger un fila en particular antes de encoger otras.

           Si esta opcion no esta presente, false es la opcion
           predeterminada.

   Visible true|false;

           Si da valor de false este elemento de pantalla estara oculto de
           inicio. Supuestamente, esto solo es util en conjuncion con
           PopUpDownKey y/o PopUpDownLinked.

           Si no configura esta opcion, true es la forma predeterminada.

   Width ancho;

           Definir el ancho del elemento de interfaz actual.

  Referencia del archivo de configuracion.

    Formato del archivo de configuracion

   En su forma basica, el archivo de configuracion de aptitude es una lista
   de opciones seguidas de sus valores. Cada linea debe tener la forma
   "Opcion Valor;": por ejemplo, la siguiente linea en el archivo de
   configuracion configura la opcion Aptitude::Theme como "Dselect".

 Aptitude::Theme "Dselect";

   Una opcion puede "contener" otras opciones si se escriben entre corchetes
   entre la opcion y el semi-colon que le sigue,como por ejemplo:

 Aptitude::UI {
   Package-Status-Format "";
   Package-Display-Format "";
 };

   Una opcion que contiene otras opciones se denomina grupo. De hecho, los
   doble-colon que aparecen en los nombres de opciones son la forma corta de
   indicar contenido: la opcion Aptitude::UI::Default-Grouping se encuentra
   dentro del grupo Aptitude::UI, el cual a su vez se encuentra dentro del
   grupo Aptitude. Por ello, si lo desea, podria activar esta opcion como ""
   de la siguiente manera:

 Aptitude {
   UI {
     Default-Grouping "";
   };
 };

   Para mas informacion referente al formato del archivo de configuracion,
   vease la pagina de manual apt.conf(5).

    Ubicaciones de los archivos de configuracion

   La configuracion de aptitude se lee desde las siguientes fuentes, en
   orden:

    1. El archivo de configuracion de usuario, ~/.aptitude/config. Este
       archivo se sobreescribe cuando el usuario modifica la configuracion en
       el menu Opciones.

    2. El archivo de configuracion del sistema, /etc/apt/apt.conf.

    3. Valores predeterminados guardados en
       /usr/share/aptitude/aptitude-defaults.

    4. Valores predeterminados integrados en aptitude

   Cuando se activa una opcion, estas fuentes se examinan por orden, y se
   emplea el primero que provee el valor para la opcion usada. Por ejemplo,
   si configura una opcion en /etc/apt/apt.conf, esto sobreescribe los
   valores predeterminados de aptitude para esa opcion, pero no sobreescribe
   las configuraciones de usuario en ~/.aptitude/config.

    Opciones de configuracion disponibles

   aptitude emplea las siguientes opciones de configuracion. Observe que
   estas no son todas las opciones de configuracion disponibles; aquellas
   empleadas por el sistema subyacente apt no se encuentran en esta lista.
   Vease las paginas de manual apt(8) y apt.conf(5) para informacion
   referente a las opciones de apt.

   Opcion: Apt::AutoRemove::RecommendsImportant
   Predeterminado: true
   Descripcion: Si esta opcion tiene valor de true, aptitude no considerara
   en desuso ningun paquete (y por ello no se eliminaran automaticamente)
   siempre y cuando algun paquete instalado los recomiende, aunque
   Apt::Install-Recommends valga false. Para mas informacion, vease
   "Gestionar paquetes automaticamente instalados.".
   Opcion: Apt::AutoRemove::SuggestsImportant
   Predeterminado: false
   Descripcion: Si esta opcion tiene valor de true, aptitude considerara que
   ningun paquete esta en desuso (y por ello no los eliminara
   automaticamente) siempre y cuando algun paquete los sugiera. Para mas
   informacion, vease "Gestionar paquetes automaticamente instalados.".
   Opcion: Apt::Get::List-Cleanup
   Predeterminado: true
   Descripcion: Un sinonimo de Apt::List-Cleanup. Si define cualquiera de
   estas opciones como false, aptitude no borrara los archivos antiguos de
   listas de paquetes despues de descargar un nuevo conjunto de listas de
   paquetes.
   Opcion: Apt::List-Cleanup
   Predeterminado: true
   Descripcion: Un sinonimo de Apt::Get::List-Cleanup. Si define cualquiera
   de estas opciones como false, aptitude no borrara los archivos antiguos de
   listas de paquetes despues de descargar un nuevo conjunto de listas de
   paquetes.
   Opcion: Apt::Install-Recommends
   Predeterminado: true
   Descripcion: Si esta opcion vale true y Aptitude::Auto-Install vale true
   tambien, cuando marque un paquete para su instalacion aptitude marcara
   tambien todos los paquetes recomendados. Mas aun, si esta opcion es true,
   aptitude considerara que ninguna paquete esta en desuso mientras otro lo
   recomiende. Para mas informacion, vease "Gestionar paquetes
   automaticamente instalados." y "Resolucion inmediata de dependencias.".
   Opcion: Aptitude::Allow-Null-Upgrade
   Predeterminado: false
   Descripcion: Por lo general, si intenta iniciar un proceso de instalacion
   sin que haya marcado ningun paquete para una accion aptitude mostrara un
   aviso y volvera a la lista de paquetes. Si esta opcion vale true, aptitude
   mostrara la pantalla de previsualizacion si hay paquetes actualizables, en
   lugar de mostrar un recordatorio relativo a la orden Acciones -> Marcar
   actualizable (U).
   Opcion: Aptitude::Always-Use-Safe-Resolver
   Predeterminado: false
   Descripcion: Si esta opcion es true, las acciones en linea de ordenes de
   aptitude siempre emplearan un solucionador de dependencias "seguro", al
   igual que si hubiese introducido el argumento --safe-resolver en la linea
   de ordenes.
   Opcion: Aptitude::Autoclean-After-Update
   Predeterminado: false
   Descripcion: Si esta opcion tiene valor de true, aptitude borrara los
   paquetes obsoletos (vease Acciones -> Limpiar ficheros obsoletos) cada vez
   que actualice la lista de paquetes.
   Opcion: Aptitude::Auto-Fix-Broken
   Predeterminado: true
   Descripcion: Si esta opcion vale false, aptitude le pedira permiso antes
   de intentar arreglar cualquier paquete roto.
   Opcion: Aptitude::Auto-Install
   Predeterminado: true
   Descripcion: Si esta opcion es true, aptitude intentara automaticamente
   cumplir con las dependencias de un paquete cuando lo marque para su
   instalacion o actualizacion.
   Opcion: Aptitude::Auto-Install-Remove-Ok
   Predeterminado: false
   Descripcion: Si esta opcion vale true, aptitude eliminara automaticamente
   aquellos paquetes que entran en conflicto al marcar un paquete para su
   instalacion o actualizacion, Generalmente se marcan estos conflictos, y
   tendra que gestionarlos manualmente.
   Opcion: Aptitude::Auto-Upgrade
   Predeterminado: false
   Descripcion: Si esta opcion es true, aptitude marcara automaticamente
   todos los paquetes actualizables cuando inicie el programa, al igual que
   si ejecuta la orden Acciones -> Marcar actualizable (U).
   Opcion: Aptitude::CmdLine::Always-Prompt
   Predeterminado: false
   Descripcion: En la interfaz en linea de ordenes, si esto se activa,
   aptitude siempre le preguntara antes de empezar a instalar o eliminar
   paquetes, incluso si la pregunta se obviaria en situaciones normales. Esto
   equivale a la opcion en linea de ordenes -P.
   Opcion: Aptitude::CmdLine::Assume-Yes
   Predeterminado: false
   Descripcion: En modo de linea de ordenes, si esta opcion vale true,
   aptitude actuara como si el usuario hubiese respondido "si" a cada
   pregunta, haciendo que la mayoria de ellos se obvien. Esto equivale a la
   orden en linea de ordenes -y.
   Opcion: Aptitude::CmdLine::Disable-Columns
   Predeterminado: false
   Descripcion: Si activa esta opcion, los resultados de una busqueda en la
   linea de ordenes (ejecutados con aptitude search) no se formatearan en
   columnas de tamano fijo o cortados al ancho de la pantalla. Esto equivale
   a la opcion en la linea de ordenes --disable-columns.
   Opcion: Aptitude::CmdLine::Download-Only
   Predeterminado: false
   Descripcion: En el modo de linea de ordenes, si esta opcion vale true,
   aptitude descargara los paquetes pero no los instalara. Esto equivale a la
   opcion de linea de ordenes -d.
   Opcion: Aptitude::CmdLine::Fix-Broken
   Predeterminado: false
   Descripcion: En el modo de linea de ordenes, si esta opcion vale true,
   aptitude sera mas agresivo en sus intentos de arreglar las dependencias de
   un paquete roto. Esto equivale a la opcion en la linea de ordenes -f.
   Opcion: Aptitude::CmdLine::Versions-Group-By
   Predeterminado: Set to auto, none, package, or source-package to control
   whether and how the output of aptitude versions is grouped. Equivalent to
   the command-line option --group-by (see its documentation for more
   description of what the values mean).
   Opcion: Aptitude::CmdLine::Ignore-Trust-Violations
   Predeterminado: false
   Descripcion: En el modo de linea de ordenes, hace que aptitude ignore la
   instalacion de paquetes no de confianza. Esto es sinonimo de
   Apt::Get::AllowUnauthenticated.
   Opcion: Aptitude::CmdLine::Package-Display-Format
   Predeterminado: %c%a%M %p# - %d#
   Descripcion: Esta es una cadena formato, tal y como se describe en
   "Personalizar la presentacion de los paquetes", que se emplea para mostrar
   los resultados de una busqueda en la linea de ordenes. Esto equivale a la
   opcion de linea en ordenes -F.
   Opcion: Aptitude::CmdLine::Package-Display-Width
   Predeterminado:
   Descripcion: Esta opcion proporciona el ancho de los caracteres que
   aparecen en una busqueda en linea de ordenes. De estar vacia
   (predeterminado; p.ej., ""), los resultados de busqueda se formatearan en
   relacion al tamano de la terminal, o para una exposicion de 80 columnas si
   no se puede determinar el tamano de la terminal.
   Opcion: Aptitude::CmdLine::Progress::Percent-On-Right
   Predeterminado: false
   Descripcion: This option controls whether command-line progress indicators
   display the percentage on the left-hand side of the screen, in the same
   style as apt-get, or on the right-hand side (the default). This option
   does not affect download progress indicators.
   Opcion: Aptitude::CmdLine::Progress::Retain-Completed
   Predeterminado: false
   Descripcion: If this value is false, then command-line progress indicators
   will be deleted and overwritten once the task they represent is completed.
   If it is true, then they will be left on the terminal. This option does
   not affect download progress indicators.
   Opcion: Aptitude::CmdLine::Request-Strictness
   Predeterminado: 10000
   Descripcion: Si encuentra problemas de dependencias en el modo de linea de
   ordenes, aptitude anadira este valor a la puntuacion del solucionador de
   problemas para cada accion que usted requiera de manera explicita.
   Opcion: Aptitude::CmdLine::Resolver-Debug
   Predeterminado: false
   Descripcion: En el modo de linea de ordenes, si esta opcion es true,
   aptitude mostrara informacion extremadamente detallada cuando intente
   resolver dependencias rotas. Como su propio nombre sugiere, esta opcion
   esta pensada para ayudar en el proceso de eliminar los fallos del
   solucionador.
   Opcion: Aptitude::CmdLine::Resolver-Dump
   Predeterminado:
   Descripcion: En el modo de linea de ordenes, en caso de ser necesario
   solucionar dependencias rotas y si esta opcion se configura con el nombre
   de un archivo con permisos de escritura, el estado del solucionador se
   guardara en este archivo antes de realizar cualquier calculo.
   Opcion: Aptitude::CmdLine::Resolver-Show-Steps
   Predeterminado: false
   Descripcion: Si esta opcion vale true, se mostrara una solucion de
   dependencias como una secuencia de las resoluciones de las dependencias
   individuales; por ejemplo "wesnoth depende de wesnoth-data (= 1.2.4-1) ->
   instalar wesnoth-data 1.2.4-1 (unstable)". Para conmutar el modo de vista,
   pulse o cuando se le pregunte "?Acepta esta solucion?".
   Opcion: Aptitude::CmdLine::Safe-Upgrade::No-New-Installs
   Predeterminado: false
   Descripcion: En modo de linea de ordenes, si esta opcion vale true, la
   orden safe-upgrade no intentara resolver dependencias mediante la
   instalacion de paquetes nuevos. Si para actualizar un paquete A tiene que
   instalar el paquete B, A no se actulizara. Esto equivale a la opcion en
   linea de ordenes --no-new-installs.
   Opcion: Aptitude::CmdLine::Safe-Upgrade::Show-Resolver-Actions
   Predeterminado: false
   Descripcion: Si esta opcion esta activada, la orden safe-upgrade mostrara
   una explicacion de las acciones que el solucionador ha tomado, antes de
   mostrar la previsualizacion del proceso de instalacion. Esto equivale a
   Aptitude::Safe-Resolver::Show-Resolver-Actions, pero solo afecta a la
   orden safe-upgrade. Esto equivale a --show-resolver-actions.
   Opcion: Aptitude::CmdLine::Show-Deps
   Predeterminado: false
   Descripcion: En el modo de linea de ordenes, si esta opcion vale true,
   aptitude mostrara un resumen de las dependencias (de haberlas)
   relacionadas con el estado de un paquete. Esto equivale a -D en la linea
   de ordenes.
   Opcion: Aptitude::CmdLine::Show-Size-Changes
   Predeterminado: false
   Descripcion: En modo de linea de ordenes, si esta opcion vale true,
   aptitude mostrara una estimacion del espacio que usara cada paquete. Esto
   equivale a la opcion de linea de ordenes -Z.
   Opcion: Aptitude::CmdLine::Why-Display-Mode
   Predeterminado: no-summary
   Descripcion: Esta opcion define el valor predeterminado del argumento en
   linea de ordenes --show-summary. Vease la documentacion de --show-summary
   para una lista de los valores permitidos con esta opcion, asi como su
   significado.
   Opcion: Aptitude::CmdLine::Show-Versions
   Predeterminado: false
   Descripcion: En modo de linea de ordenes, si esta opcion vale true,
   aptitude mostrara la version del paquete que se va a instalar o eliminar.
   Esto equivale a la opcion en linea de ordenes -V.
   Opcion: Aptitude::CmdLine::Show-Why
   Predeterminado: false
   Descripcion: En modo de linea de ordenes, si esta opcion vale true,
   aptitude mostrara cada paquete instalado automaticamente que paquetes
   instalados manualmente requieren, o los paquetes manualmente instalados
   que generan un conflicto con cada paquete eliminado de manera automatica.
   Esto equivale a la opcion en linea de ordenes -W, y muestra la misma
   informacion accesible a traves de aptitude why, o pulsando i en la lista
   de paquetes.
   Opcion: Aptitude::CmdLine::Version-Display-Format
   Predeterminado: %c%a%M %p# %t %i
   Descripcion: This is a format string, as described in "Personalizar la
   presentacion de los paquetes", which is used to display the output of
   aptitude versions. This is equivalent to the -F command-line option.
   Opcion: Aptitude::CmdLine::Versions-Show-Package-Names
   Predeterminado: Set to always, auto, or never to control when package
   names are displayed in the output of aptitude versions. Equivalent to the
   command-line option --show-package-names (see its documentation for more
   description of what the values mean).
   Opcion: Aptitude::Safe-Resolver::Show-Resolver-Actions
   Predeterminado: false
   Descripcion: Si activa esta opcion, cuando se activa el solucionador de
   dependencias "safe" mediante --safe-resolver, mostrara un resumen de las
   acciones que el solucionador toma, antes de previsualizar los cambios.
   Esta opcion equivale Aptitude::Safe-Upgrade::Show-Resolver-Actions, pero
   solo afecta a acciones de linea de ordenes que no sean safe-upgrade.
   Equivale a la opcion en linea de ordenes --show-resolver-actions.
   Opcion: Aptitude::Screenshot::IncrementalLoadLimit
   Predeterminado: 16384
   Descripcion: The minimum size in bytes at which aptitude will begin to
   display screenshots incrementally. Below this size, screenshots will not
   appear until they are fully downloaded.
   Opcion: Aptitude::Screenshot::Cache-Max
   Predeterminado: 4194304
   Descripcion: The maximum number of bytes of screenshot data that aptitude
   will store in memory for screenshots that are not currently being
   displayed. The default is four megabytes.
   Opcion: Aptitude::CmdLine::Simulate
   Predeterminado: false
   Descripcion: Recomendamos no usar esta opcion; use Aptitude::Simulate. En
   la linea de ordenes, hace que aptitude muestre las acciones que tomaria (a
   diferencia de tomarlas en el momento); en la interfaz grafica, aptitude se
   iniciaria en modo de solo lectura independientemente de si Ud. es root o
   no. Equivale a la opcion -s.
   Opcion: Aptitude::CmdLine::Verbose
   Predeterminado: 0
   Descripcion: Controlar cuanta informacion recibe en modo de linea de
   ordenes de aptitude. Cada aparicion de la opcion -v anade 1 a este valor.
   Opcion: Aptitude::CmdLine::Visual-Preview
   Predeterminado: false
   Descripcion: Si esta opcion vale true, aptitude entrara en modo grafico
   para poder previsualizar el proceso de instalacion, y descargar paquetes.
   Opcion: Aptitude::Debtags-Binary
   Predeterminado: /usr/bin/debtags
   Descripcion: La ruta absoluta de la orden debtags. Si se configura con
   compatibilidad para libept, aptitude ejecutara este programa siempre que
   actualice la lista de paquetes, dirigiendo a este los argumentos listados
   en Aptitude::Debtags-Update-Options.
   Opcion: Aptitude::Debtags-Update-Options
   Predeterminado: --local
   Descripcion: Puede introducir opciones adicionales a debtags update al
   invocarlo despues de actualizar la lista de paquetes. Estos se dividen por
   espacios; reconoce tambien las cadenas entre comillas asi que configurar
   esto como "--vocabulary='/file with a space" guarda el vocabulario de
   debtags en "/file with a space".
   Opcion: Aptitude::Delete-Unused
   Predeterminado: true
   Descripcion: Si activa esta opcion, se eliminaran los paquetes instalados
   automaticamente que ya no se requieran. Para mas informacion, vease
   "Gestionar paquetes automaticamente instalados.".
   Opcion: Aptitude::Delete-Unused-Pattern
   Predeterminado:
   Descripcion: Alias obsoleto para Aptitude::Keep-Unused-Pattern. Si
   configura Aptitude::Keep-Unused-Pattern con una cadena vacia el valor de
   esta opcion de configuracion lo sobreescribira. De otra manera, se ignora
   Aptitude::Delete-Unused-Pattern.
   Opcion: Aptitude::Display-Planned-Action
   Predeterminado: true
   Descripcion: Si esta opcion vale true, aptitude mostrara una
   previsualizacion antes de ejecutar las acciones que desea llevar a cabo.
   Opcion: Aptitude::Forget-New-On-Install
   Predeterminado: false
   Descripcion: Si esta opcion vale true, aptitude vaciara la lista de
   paquetes nuevos en el momento que instale, actualice o elimine paquetes,
   al igual que si ejecuta Acciones -> Olvidar paquetes nuevos (f).
   Opcion: Aptitude::Forget-New-On-Update
   Predeterminado: false
   Descripcion: Si esta opcion vale true, aptitude vaciara la lista de
   paquetes nuevos en el momento que actualice la lista de paquetes, al igual
   que si ejecuta Acciones -> Olvidar paquetes nuevos (f).
   Opcion: Aptitude::Get-Root-Command
   Predeterminado: su:/bin/su
   Descripcion: Esta opcion define la orden externa que emplea aptitude para
   pasar a usuario root (vease "Convertirse en root."). Su forma es
   protocolo:orden. El protocolo debe ser su o sudo; define la manera en que
   aptitude invoca el programa cuando desea tener privilegios de
   administrador. Si el protocolo es su, se emplea la orden -c argumentos
   para convertirse en superusuario; de no ser asi, aptitude usa orden
   argumentos. La primera palabra de la orden es el nombre del programa que
   se debe invocar; las palabras restantes se toman como argumentos de ese
   mismo programa.
   Opcion: Aptitude::Ignore-Old-Tmp
   Predeterminado: false
   Descripcion: Versiones anteriores de aptitude creaban una carpeta
   ~/.aptitude/.tmp, ya obsoleto. Si la carpeta existe y
   Aptitude::Ignore-Old-Tmp vale true, aptitude le preguntara si desea
   eliminar esta carpeta. La opcion sera true automaticamente tras su
   respuesta. Por otro lado, si la carpeta no existe, esta opcion hara que
   aptitude tome esto como false para asi notificarle en caso de que
   reaparezca.
   Opcion: Aptitude::Ignore-Recommends-Important
   Predeterminado: false
   Descripcion: En versiones anteriores de aptitude, la opcion
   Aptitude::Recommends-Important activaba la instalacion automatica de
   paquetes recomendados, de la misma manera que hoy en dia realiza
   Apt::Install-Recommends. Si esta opcion vale false y
   Aptitude::Recommends-Important es tambien false, aptitude configurara
   Apt::Install-Recommends como false, y
   Aptitude::Ignore-Recommends-Important como true al inicio.
   Opcion: Aptitude::Keep-Recommends
   Predeterminado: false
   Descripcion: Esta opcion esta obsoleta; utilice
   Apt::AutoRemove::Recommends-Important en lugar de ello. Definir esta
   opcion como true tiene el mismo efecto que definir
   Apt::AutoRemove::Recommends-Important como true.
   Opcion: Aptitude::Keep-Suggests
   Predeterminado: false
   Descripcion: Esta opcion esta obsoleta; utilice
   Apt::AutoRemove::Suggests-Important en lugar de ello. Definir esta opcion
   como true tiene el mismo efecto que definir
   Apt::AutoRemove::Suggests-Important como true.
   Opcion: Aptitude::Keep-Unused-Pattern
   Predeterminado:
   Descripcion: Si Aptitude::Delete-Unused vale true, solo se eliminaran
   aquellos paquetes que no se correspondan con el patron (vease "Patrones de
   busqueda"). Si define esta opcion como una cadena vacia (opcion
   predeterminada), se eliminan todos aquellos paquetes no usados.
   Opcion: Aptitude::LockFile
   Predeterminado: /var/lock/aptitude
   Descripcion: Un archivo que estara <<fcntl-locked>> para asegurar que solo
   un proceso de aptitude pueda modificar el almacen en cada momento. Nunca
   tendra la necesidad de modificar esto en circunstancias normales; aunque
   puede ser util para depurar fallos. Nota: si aptitude informa que no puede
   conseguir el permiso unico sobre el archivo, esto no significa que
   necesite destruir el archivo. Los <<fcntl locks>> (cerrojos) se gestionan
   por el kernel y son destruidos cuando el programa que los emplea finaliza;
   un fallo en el momento de adquirir el permiso significa que otro programa
   lo esta usando.
   Opcion: Aptitude::Log
   Predeterminado: /var/log/aptitude
   Descripcion: Si define esto como una cadena vacia, aptitude registrara las
   instalaciones de paquetes, eliminaciones y actualizaciones que lleve a
   cabo. Si el valor de Aptitude::Log empieza con un caracter de segmentacion
   (p.ej., "|"), el resto de su valor se emplea como el nombre de una orden
   al cual se redirigira el registro: por ejemplo, |mail -s 'Aptitude install
   run' root permite mandar el registro al root por correo electronico. Puede
   definir esta opcion como una lista de objetivos de archivos de registro
   para registrar varios archivos u ordenes,.
   Opcion: Aptitude::Logging::File
   Predeterminado:
   Descripcion: If this is set to a nonempty string, aptitude will write
   logging messages to it; setting it to "-" causes logging messages to be
   printed to standard output. This differs from the setting Aptitude::Log:
   that file is used to log installations and removals, whereas this file is
   used to log program events, errors, and debugging messages (if enabled).
   This option is equivalent to the command-line argument --log-file. See
   also Aptitude::Logging::Levels.
   Opcion: Aptitude::Logging::Levels
   Predeterminado: (empty)
   Descripcion: Esta opcion es un grupo en el que sus miembros controlan que
   mensajes del registro se escriben. Cada entrada es, o bien "nivel", para
   definir el nivel de registro global (el nivel de registro del registrador
   del administrador) con el "nivel" insertado, o bien "categoria:nivel",
   donde categoria es la categoria de los mensajes que modificar (tales como
   aptitude.resolver.hints.match), y nivel es el nivel mas bajo de registro
   de mensajes en esa categoria que se deberian ver. Los niveles de registro
   validos son "fatal", "error", "warn" (aviso), "info" (informacion),
   "debug" (depuracion de fallos), y "trace" (rastro). Puede emplear la
   opcion en linea de ordenes --log-level para definir o invalidar cualquier
   nivel de registro.
   Opcion: Aptitude::Parse-Description-Bullets
   Predeterminado: true
   Descripcion: Si activa esta opcion, aptitude intentara detectar
   automaticamente listas por puntos en las descripciones de paquete. En
   lineas generales, esto mejorara como se muestran las descripciones, pero
   no tiene una compatibilidad inversa total; algunas descripciones recibiran
   un formato menos atractivo cuando esta opcion sea true a cuando sea false.
   Opcion: Aptitude::Pkg-Display-Limit
   Predeterminado:
   Descripcion: El filtro predeterminado que se aplica a la lista de
   paquetes; vease "Patrones de busqueda" para ver los detalles acerca de su
   formato.
   Opcion: Aptitude::ProblemResolver::Allow-Break-Holds
   Predeterminado: false
   Descripcion: Si da a esta opcion valor de true, el solucionador de
   problemas considerara romper la retencion de cualquier paquete o instalar
   versiones prohibidas si con ello puede resolver una dependencia. Si lo
   define como false, se rechazaran estas acciones de forma predeterminada,
   aunque siempre puede activarlas manualmente (vease "Resolver dependencias
   de manera interactiva.").
   Opcion: Aptitude::ProblemResolver::BreakHoldScore
   Predeterminado: -300
   Descripcion: Cuanto premiar o penalizar soluciones que modifican el estado
   de un paquete retenido o que instalan versiones prohibidas. Observe que a
   menos que Aptitude::ProblemResolver::Allow-Break-Holds tenga valor de
   true, el solucionador nunca rompera una retencion o instalara una version
   prohibida a menos que tenga el permiso explicito del usuario.
   Opcion: Aptitude::ProblemResolver::Break-Hold-Level
   Predeterminado: 50000
   Descripcion: The safety cost assigned to actions that break a hold set by
   the user (by upgrading a held package or by installing a forbidden version
   of a package). See "Safety costs" for a description of safety costs.
   Opcion: Aptitude::ProblemResolver::BrokenScore
   Predeterminado: -100
   Descripcion: Cuanto premiar o penalizar soluciones potenciales en base al
   numero de dependencias que rompen. Este numero se anadira a la puntuacion
   de cada solucion por cada dependencia rota que genere; por lo general,
   este tiene un valor negativo.
   Opcion: Aptitude::ProblemResolver::DefaultResolutionScore
   Predeterminado: 400
   Descripcion: Cuanto premiar o penalizar una solucion potencial en base a
   cuantas resoluciones "predeterminadas" instalan por dependencias
   actualmente insatisfechas. La resolucion predeterminada es la que tomaria
   "apt-get install" o el "solucionador de dependencias inmediato". La
   puntuacion solo se aplica a las dependencias y recomendaciones cuyos
   objetivos no estan instalados actualmente en el sistema.
   Opcion: Aptitude::ProblemResolver::Discard-Null-Solution
   Predeterminado: true
   Descripcion: Si esta opcion tiene valor de true, aptitude nunca sugerira
   cancelar todas las acciones propuestas para poder resolver un problema de
   dependencias.
   Opcion: Aptitude::ProblemResolver::EssentialRemoveScore
   Predeterminado: -100000
   Descripcion: Cuanto premiar o penalizar soluciones que eliminan un paquete
   Esencial.
   Opcion: Aptitude::ProblemResolver::Remove-Essential-Level
   Predeterminado: 60000
   Descripcion: The safety cost assigned to actions that remove an Essential
   package. See "Safety costs" for a description of safety costs.
   Opcion: Aptitude::ProblemResolver::ExtraScore
   Predeterminado: -1
   Descripcion: Este numero se anadira a la puntuacion de cualquier paquete
   con prioridad "extra".
   Opcion: Aptitude::ProblemResolver::FullReplacementScore
   Predeterminado: 500
   Descripcion: Este numero se anade al puntuacion de una solucion que
   elimina un paquete e instala otro que lo reemplaza por completo (p. ej.,
   tiene un conflicto, lo reemplaza, y lo provee).
   Opcion: Aptitude::ProblemResolver::FutureHorizon
   Predeterminado: 50
   Descripcion: Cuantos "pasos" debe tomar el solucionador antes de encontrar
   la primera solucion. Aunque aptitude intenta generar las mejores
   soluciones antes que las peores es a veces incapaz de ello; esta
   configuracion permite al solucionador buscar brevemente una solucion mejor
   antes de mostrar los resultados, a diferencia de detenerse inmediatamente
   tras encontrar la primera solucion.
   Opcion: Aptitude::ProblemResolver::Hints
   Predeterminado: (empty)
   Descripcion: Esta opcion es un grupo en el cual sus miembros se utilizan
   para configurar el solucionador de problemas. Cada elemento del grupo es
   una cadena que describe la accion que se deberia aplicar a uno o mas
   paquetes. La sintaxis para cada indicacion y el efecto que tiene se pueden
   ver en "Configurar indicaciones del solucionador".
   Opcion: Aptitude::ProblemResolver::ImportantScore
   Predeterminado: 5
   Descripcion: Este numero se anade a la puntuacion de cualquier version de
   un paquete con una prioridad "importante".
   Opcion: Aptitude::ProblemResolver::Infinity
   Predeterminado: 1000000
   Descripcion: La puntuacion "maxima" para soluciones en potencia. Si un
   conjunto de acciones tiene una puntuacion peor que -Infinity, se
   descartara inmediatamente.
   Opcion: Aptitude::ProblemResolver::InstallScore
   Predeterminado: -20
   Descripcion: Cuanta importancia otorga el solucionador de paquetes a la
   instalacion de un paquete si este no se va a instalar a peticion del
   usuario.
   Opcion: Aptitude::ProblemResolver::Keep-All-Level
   Predeterminado: 20000
   Descripcion: The safety cost assigned to the single solution that cancels
   all of the actions selected by the user. See "Safety costs" for a
   description of safety costs.
   Opcion: Aptitude::ProblemResolver::KeepScore
   Predeterminado: 0
   Descripcion: Cuanta importancia otorga el solucionador de problemas a
   mantener un paquete en su estado actual, si este no se va mantener en su
   estado actual a peticion del usuario.
   Opcion: Aptitude::ProblemResolver::NonDefaultScore
   Predeterminado: -40
   Descripcion: Cuanta importancia otorga el solucionador de problemas a
   instalar una version no predeterminada de un paquete (una que no es la
   version presente y tampoco la "version candidata").
   Opcion: Aptitude::ProblemResolver::Non-Default-Level
   Predeterminado: 50000
   Descripcion: The safety cost assigned to actions that install non-default
   versions of a package. For instance, if version 5 of a package is
   installed, versions 6, 7, and 8 are available, and version 7 is the
   default version, then versions 6 and 8 will be given a safety cost that is
   at least this high. See "Safety costs" for a description of safety costs.
   Opcion: Aptitude::ProblemResolver::OptionalScore
   Predeterminado: 1
   Descripcion: Este numero se anade a la puntuacion de toda version de un
   paquete con prioridad "opcional"
   Opcion: Aptitude::ProblemResolver::PreserveAutoScore
   Predeterminado: 0
   Descripcion: Cuanta importancia otorga el solucionador de problemas a
   conservar las instalaciones automaticas o eliminaciones.
   Opcion: Aptitude::ProblemResolver::PreserveManualScore
   Predeterminado: 60
   Descripcion: Cuanta importancia otorga el solucionador a conservar
   selecciones explicitas del usuario.
   Opcion: Aptitude::ProblemResolver::RemoveScore
   Predeterminado: -300
   Descripcion: Cuanta importancia otorga el solucionador de problemas a
   eliminar un paquete (si no esta ya marcado para su eliminacion).
   Opcion: Aptitude::ProblemResolver::Remove-Level
   Predeterminado: 10000
   Descripcion: The safety cost assigned to actions that remove a package.
   See "Safety costs" for a description of safety costs.
   Opcion: Aptitude::ProblemResolver::RequiredScore
   Predeterminado: 4
   Descripcion: Este numero se anade a la puntuacion de toda version de un
   paquete con prioridad de "requiere".
   Opcion: Aptitude::ProblemResolver::ResolutionScore
   Predeterminado: 50
   Descripcion: Ademas de todos los otros factores de puntuacion, las
   soluciones propuestas que resuelven todas las dependencias insatisfechas
   reciben esta cantidad de puntos adicionales.
   Opcion: Aptitude::ProblemResolver::Safe-Level
   Predeterminado: 10000
   Descripcion: The safety cost assigned to actions that install the default
   version of a package, upgrade a package to its default version, or cancel
   installing or upgrading a package. Solutions assigned this cost could be
   generated by aptitude safe-upgrade. See "Safety costs" for a description
   of safety costs.
   Opcion: Aptitude::ProblemResolver::SolutionCost
   Predeterminado: safety,priority
   Descripcion: Describes how to determine the cost of a solution. See "Costs
   in the interactive dependency resolver" for a description of what solution
   costs are, what they do, and the syntax used to specify them. If the cost
   cannot be parsed, an error is issued and the default cost is used instead.
   Opcion: Aptitude::ProblemResolver::StandardScore
   Predeterminado: 3
   Descripcion: Este numero se anade a la puntuacion de toda version de un
   paquete con prioridad "estandar".
   Opcion: Aptitude::ProblemResolver::StepLimit
   Predeterminado: 5000
   Descripcion: El numero maximo de "pasos" que deberia tomar el solucionador
   de problemas a cada intento de encontrar una solucion a un problema de
   dependencias. Si reduce este numero, aptitude se dara antes "por vencido";
   si lo aumenta, permitira que la busqueda de una solucion pueda tomar mas
   tiempo y memoria antes de interrumpirse. Si define el valor de StepLimit
   como 0, desactivaria totalmente el solucionador de problemas. El valor
   predeterminado es suficientemente alto para gestionar comodamente las
   situaciones mas comunes, a la vez que impide que aptitude "explote" en
   caso de encontrarse con un problema mas complicado. (Nota: esto solo
   afecta a las busquedas en linea de ordenes; en la interfaz grafica el
   solucionador continuara hasta encontrar una solucion)
   Opcion: Aptitude::ProblemResolver::StepScore
   Predeterminado: 70
   Descripcion: Cuanto premiar o castigar soluciones potenciales en base a su
   longitud. Este numero de puntos se anade por cada accion realizada por la
   solucion. Cuanto mas alto sea este valor, mas tendera el solucionador a
   conservarlo en lugar de considerar otras alternativas; esto causara que la
   solucion se genere mas rapidamente, pero esta puede ser de menor calidad
   que en situaciones normales.
   Opcion: Aptitude::ProblemResolver::Trace-Directory
   Predeterminado:
   Descripcion: Si define este valor, cada vez que el solucionador de
   problemas genere una solucion guardara una version simplificada del estado
   del paquete, que se puede emplear para reproducir la misma solucion. Si
   define tambien Aptitude::ProblemResolver::Trace-File, se escribira la
   misma informacion en el archivo de seguimiento (<<trace-file>>). Los
   directorios de seguimiento son mas transparentes que los archivos de
   seguimiento, y mas adecuados para, por ejemplo, incluir arboles de fuentes
   como casos de prueba.
   Opcion: Aptitude::ProblemResolver::Trace-File
   Predeterminado:
   Descripcion: Si define este valor, cada vez que el solucionador de
   problemas genere una solucion guardara una version simplificada del estado
   del paquete, que se puede emplear para reproducir la misma solucion. Si
   define tambien Aptitude::ProblemResolver::Trace-Directory, se escribira la
   misma informacion en el directorio de seguimiento (<<trace-directory>>).
   Un archivo de seguimiento es simplemente un directorio de seguimiento
   comprimido en un archivo; ocupa menos espacio que el directorio de
   seguimiento y es mas apropiado para su transmision a traves de una red.
   Opcion: Aptitude::ProblemResolver::UndoFullReplacementScore
   Predeterminado: -500
   Descripcion: Esta puntuacion se asigna a la accion de instalar un paquete
   y eliminar otro que lo reemplaza totalmente (p. ej., conflicto de
   dependencias, reemplaza y provee).
   Opcion: Aptitude::ProblemResolver::UnfixedSoftScore
   Predeterminado: -200
   Descripcion: Cuanto premiar o penalizar el no resolver una relacion de
   <<Recomienda>>. Generalmente, este numero es menor que <<RemoveScore>>, o
   aptitude tendera a eliminar paquetes antes que dejar sus recomendaciones
   sin resolver. Para mas detalles, vease "Resolver dependencias de manera
   interactiva.".
   Opcion: Aptitude::ProblemResolver::UpgradeScore
   Predeterminado: 0
   Descripcion: Cuanta importancia otorga el solucionador de problemas a
   actualizar (o desactualizar) un paquete a su version candidata, en caso de
   que el paquete no estuviese marcado para actualizar.
   Opcion: Aptitude::Purge-Unused
   Predeterminado: false
   Descripcion: Si define esta opcion con valor de true y si
   Aptitude::Delete-Unused es tambien true, se purgaran del sistema los
   paquetes no usados, eliminando sus datos de configuracion asi como quizas
   otros datos importantes. Para mas informacion relativa a que paquetes se
   consideran "no usados", vease "Gestionar paquetes automaticamente
   instalados.". !ESTA OPCION PUEDE CAUSAR PERDIDA DE DATOS! !NO LA HABILITE
   A MENOS QUE SEPA LO QUE ESTA HACIENDO!
   Opcion: Aptitude::Recommends-Important
   Predeterminado: true
   Descripcion: Esta es una opcion de configuracion obsoleta y que
   Apt::Install-Recommends ha reemplazado. Al inicio, aptitude copiara
   Aptitude::Recommends-Important (si existe) a Apt::Install-Recommends y
   despues vaciara Aptitude::Recommends-Important en su archivo de
   configuracion de usuario.
   Opcion: Aptitude::Safe-Resolver::No-New-Installs
   Predeterminado: false
   Descripcion: Si define esta opcion con valor de true, cuando active el
   solucionador de dependencias "seguro" mediante --safe-resolver, no se le
   permitira al solucionador instalar paquetes que no lo estan actualmente.
   Esto es similar a Aptitude::CmdLine::Safe-Upgrade::No-New-Installs, pero
   solo afecta a aquellas acciones en linea de ordenes aparte de
   safe-upgrade.
   Opcion: Aptitude::Safe-Resolver::No-New-Upgrades
   Predeterminado: false
   Descripcion: Si activa esta opcion, cuando active el solucionador de
   dependencias "seguro" mediante --safe-resolver, el solucionador no podra
   resolver ninguna dependencia si con ello tiene que actualizar paquetes.
   Opcion: Aptitude::Sections::Descriptions
   Predeterminado: Vease $prefix/share/aptitude/section-descriptions
   Descripcion: Esta opcion es un grupo cuyos miembros definen las
   descripciones mostradas para cada seccion cuando emplea la directriz de
   agrupacion "section" para la jerarquia de paquetes. Las descripciones se
   asignan a arboles de seccion en base al ultimo componente del nombre: por
   ejemplo, un miembro del grupo llamado "games" se utilizara para describir
   las secciones "games", "non-free/games", y "non-free/desktop/games". En el
   texto comprendido en las descripciones de seccion, se reemplaza la cadena
   "\n" por un corte de lineas, y la cadena "''", por una comilla doble.
   Opcion: Aptitude::Sections::Top-Sections
   Predeterminado: "main"; "contrib"; "non-free"; "non-US";
   Descripcion: Un grupo de configuracion cuyos elementos son los nombres de
   las secciones en el nivel superior del archivo. Las directrices de
   agrupacion "topdir", "subdir", y "subdirs" utilizan esta lista para
   interpretar los campos de <<Seccion>>: si el primer elemento de ruta de la
   seccion de un paquete no esta contenido en esta lista, o si su seccion
   solo tiene un elemento, se agrupara el paquete utilizando el primer
   miembro de esta lista como primer elemento de ruta. Por ejemplo, si el
   primer miembro de Top-Sections es "main", un paquete cuya seccion es
   "games", se tratara como si su campo de seccion fuese "games/arcade".
   Opcion: Aptitude::Simulate
   Predeterminado: false
   Descripcion: En modo de linea de ordenes, hace que aptitude solo muestre
   las acciones que se van a llevar a cabo (en lugar de llevarlas a cabo
   directamente); en la interfaz grafica, hace que aptitude se inicie en modo
   de solo lectura independientemente de si usted es root (administrador), o
   no. Esto equivale a la opcion en linea de ordenes -s.
   Opcion: Aptitude::Spin-Interval
   Predeterminado: 500
   Descripcion: El numero de segundos que dejar entre actualizar la "rueda"
   que aparece cuando el solucionador de problemas esta en ejecucion.
   Opcion: Aptitude::Suggests-Important
   Predeterminado: false
   Descripcion: Esta opcion esta obsoleta; utilice
   Apt::AutoRemove::Suggests-Important en lugar de ello. Definir esta opcion
   como true tiene el mismo efecto que definir
   Apt::AutoRemove::Suggests-Important como true.
   Opcion: Aptitude::Suppress-Read-Only-Warning
   Predeterminado: false
   Descripcion: Si define esto como false, aptitude mostrara un aviso la
   primera vez que intente modificar el estado de los paquetes cuando
   aptitude esta en modo de solo lectura.
   Opcion: Aptitude::Theme
   Predeterminado:
   Descripcion: El tema que aptitude debe utilizar; para mas informacion,
   vease "Temas.".
   Opcion: Aptitude::Track-Dselect-State
   Predeterminado: true
   Descripcion: Si define esta opcion como true, aptitude intentara detectar
   si se ha modificado el estado de un paquete con dselect o con la orden
   dpkg: por ejemplo, si elimina un paquete utilizando dpkg, aptitude no
   intentara reinstalarlo. Observe que este comportamiento puede ser
   erratico.
   Opcion: Aptitude::UI::Advance-On-Action
   Predeterminado: false
   Descripcion: Si define esta opcion como true, aptitude resaltara el
   siguiente elemento del grupo tras modificar el estado de un paquete.
   Opcion: Aptitude::UI::Auto-Show-Reasons
   Predeterminado: true
   Descripcion: Si define esta opcion como true, al seleccionar un paquete
   roto o que parece causar que otros paquetes esten rotos el area de
   informacion mostrara algunas de las razones de porque la ruptura tiene
   lugar.
   Opcion: Aptitude::UI::Default-Grouping
   Predeterminado:
   filter(missing),status,section(subdirs,passthrough),section(topdir)
   Descripcion: Definir la directriz de agrupacion predeterminada utilizada
   en las listas de paquetes. Para informacion adicional acerca de las
   directrices de agrupacion, vease "Personalizar la jerarquia de paquetes".
   Opcion: Aptitude::UI::Default-Package-View
   Predeterminado:
   Descripcion: Esta opcion es un grupo cuyos miembros definen la
   presentacion predeterminada de la interfaz de aptitude. Para mas
   informacion, vease "Personalizar el diseno de la interfaz.".
   Opcion: Aptitude::UI::Default-Preview-Grouping
   Predeterminado: action
   Descripcion: Definir la directriz de agrupacion predeterminada para las
   pantallas de previsualizacion. Para informacion adicional acerca de las
   directrices de agrupacion, vease "Personalizar la jerarquia de paquetes".
   Opcion: Aptitude::UI::Default-Sorting
   Predeterminado: name
   Descripcion: La directriz de ordenacion predeterminada para la vista de
   paquetes. Para mas informacion, vease "Personalizar como se ordenan los
   paquetes".
   Opcion: Aptitude::UI::Description-Visible-By-Default
   Predeterminado: true
   Descripcion: Cuando se muestra una lista de paquetes, el area de
   informacion (que generalmente contiene la descripcion completa del paquete
   seleccionado) sera visible si la opcion tiene valor de true, y estara
   oculta si el valor es false.
   Opcion: Aptitude::UI::Exit-On-Last-Close
   Predeterminado: true
   Descripcion: Si define esta opcion como true, cerrar todas las vistas
   activas cierra aptitude; de no ser asi aptitude no se cerrara hasta que
   invoque la orden Acciones -> Salir (Q). Para mas informacion, vease
   "Trabajar con varias vistas.".
   Opcion: Aptitude::UI::Fill-Text
   Predeterminado: false
   Descripcion: Si define esta opcion como true, aptitude le dara un formato
   a las descripciones de manera que cada linea ocupe exactamente el ancho de
   la pantalla.
   Opcion: Aptitude::UI::Flat-View-As-First-View
   Predeterminado: false
   Descripcion: Si define esta opcion como true, aptitude mostrara una vista
   plana al inicio, en lugar de la vista predeterminada.
   Opcion: Aptitude::UI::HelpBar
   Predeterminado: true
   Descripcion: Si define esta opcion como true, vera una linea con los
   atajos de teclado mas importantes en la parte superior de la pantalla.
   Opcion: Aptitude::UI::Incremental-Search
   Predeterminado: true
   Descripcion: Si define esta opcion como true, aptitude realizara busquedas
   "incrementales": a medida que introduce el patron de busqueda, buscara el
   siguiente paquete que se corresponda con lo que ha introducido hasta el
   momento.
   Opcion: Aptitude::UI::InfoAreaTabs
   Predeterminado: false
   Descripcion: Si define esta opcion como true, aptitude mostrara pestanas
   justo encima del area de informacion (el panel en el fondo de la
   pantalla), describiendo los diferentes modos en los que puede configurar
   esta area.
   Opcion: Aptitude::UI::Keybindings
   Predeterminado:
   Descripcion: Este es un grupo cuyos miembros definen las conexiones entre
   atajos de teclado y ordenes dentro de aptitude. Para mas informacion,
   vease "Personalizar teclas rapidas.".
   Opcion: Aptitude::UI::Menubar-Autohide
   Predeterminado: false
   Descripcion: Si define esta opcion como true, la barra de menu estara
   oculta mientras no este en uso.
   Opcion: Aptitude::UI::Minibuf-Download-Bar
   Predeterminado: false
   Descripcion: Si define esta opcion como true, aptitude empleara un
   mecanismo menos visible para mostrar el progreso de las descargas: vera
   una barra en la base de la pantalla mostrando el estado actual de la
   descarga. Puede abortar una descarga activa presionando q.
   Opcion: Aptitude::UI::Minibuf-Prompts
   Predeterminado: false
   Descripcion: Si define esta opcion como true, algunas preguntas (tales
   como preguntas yes/no o preguntas de eleccion multiple) se mostraran en la
   base de la pantalla, y no en ventanas de dialogo.
   Opcion: Aptitude::UI::New-Package-Commands
   Predeterminado: true
   Descripcion: Si define esta opcion como false, las ordenes tales como
   Paquete -> Instalar (+) tendran el mismo comportamiento, ya obsoleto, que
   tenian en versiones anteriores de aptitude.
   Opcion: Aptitude::UI::Package-Display-Format
   Predeterminado: %c%a%M %p %Z %v %V
   Descripcion: Esta opcion controla la cadena formato utilizada para mostrar
   los paquetes en la lista de paquetes. Para mas informacion, vease
   "Personalizar la presentacion de los paquetes".
   Opcion: Aptitude::UI::Package-Header-Format
   Predeterminado: %N %n #%B %u %o
   Descripcion: Esta opcion controla la cadena formato utilizada para mostrar
   la cabecera de las listas de paquetes (p. ej., la linea que aparece entre
   la lista de paquetes y la barra de menu). Para mas informacion acerca de
   las cadenas formato, vease "Personalizar la presentacion de los paquetes".
   Opcion: Aptitude::UI::Package-Status-Format
   Predeterminado: %d
   Descripcion: Esta opcion controla la cadena formato utilizada para mostrar
   la linea de estado de las listas de paquetes (p. ej., la linea que aparece
   entre la lista de paquetes y el area de informacion). Para mas informacion
   relativa a las cadenas formato, vease "Personalizar la presentacion de los
   paquetes".
   Opcion: Aptitude::UI::Pause-After-Download
   Predeterminado: OnlyIfError
   Descripcion: Si define esta opcion como true, aptitude le preguntara si
   quiere continuar con la instalacion una vez finalizada la descarga. Si el
   valor es OnlyIfError, el mensaje solo aparecera en caso de que la descarga
   haya fallado. De otra manera, si la opcion tiene valor de false aptitude
   procedera inmediatamente a la siguiente pantalla una vez finalizada la
   descarga.
   Opcion: Aptitude::UI::Preview-Limit
   Predeterminado:
   Descripcion: El filtro predeterminado que se aplica a la pantalla de
   previsualizacion. Para mas detalles acerca de su formato, vease "Patrones
   de busqueda".
   Opcion: Aptitude::UI::Prompt-On-Exit
   Predeterminado: true
   Descripcion: Si define esta opcion con valor de true, aptitude le pedira
   una confirmacion cuando desee salir del programa.
   Opcion: Aptitude::UI::Styles
   Predeterminado:
   Descripcion: Este es un grupo de configuracion cuyos miembros definen el
   estilo de texto que aptitude emplea para mostrar informacion. Para mas
   informacion, vease "Personalizar los colores del texto y estilos.".
   Opcion: Aptitude::UI::ViewTabs
   Predeterminado: true
   Descripcion: Si define esta opcion con valor de false, aptitude no
   mostrara "pestanas" describiendo las vistas activas presentes en el margen
   superior de la pantalla.
   Opcion: Aptitude::Warn-Not-Root
   Predeterminado: true
   Descripcion: Si define esta opcion con valor de true, aptitude detectara
   cuando precise privilegios de root (administrador), y le preguntara si
   desea cambiar a la cuenta de root si aun no lo es. Para mas informacion,
   vease "Convertirse en root.".
   Opcion: DebTags::Vocabulary
   Predeterminado: /usr/share/debtags/vocabulary
   Descripcion: La ubicacion del archivo de vocabulario de debtags, utilizado
   para cargar los meta-datos de marcas de paquetes.
   Opcion: Dir::Aptitude::state
   Predeterminado: /var/lib/aptitude
   Descripcion: El directorio en el que se guarda la informacion persistente
   de estado de aptitude.
   Opcion: Quiet
   Predeterminado: 0
   Descripcion: Controlar el grado de verbosidad en el modo de linea de
   ordenes. Definirlo con un valor mas alto desactiva los indicadores de
   progreso.

  Temas.

   En aptitude un tema es simplemente un conjunto de configuraciones que
   "estan agrupados". Los temas funcionan invalidando los valores
   predeterminados de las opciones: si una opcion no esta definida en el
   archivo de configuracion del sistema, o en su propio archivo personal de
   configuracion, aptitude utilizara la configuracion del tema presente de
   haber uno disponible, antes de utilizar el valor estandar predeterminado.

   Un tema es simplemente un grupo nombrado bajo Aptitude::Themes; cada
   opcion de configuracion contenida en el grupo invalidara la
   correspondiente opcion en la configuracion global. Por ejemplo, si
   selecciona el tema Dselect, la opcion
   Aptitude::Themes::Dselect::Aptitude::UI::Package-Display-Format invalidara
   el valor predeterminado de la opcion Aptitude::UI::Package-Display-Format.

   Para seleccionar un tema, defina la opcion de configuracion
   Aptitude::Theme con el nombre del tema; por ejemplo,

 Aptitude::Theme Vertical-Split;

   aptitude tiene integrados los siguientes temas en
   /usr/share/aptitude/aptitude-defaults:

   Dselect

           Este tema hace que aptitude se parezca mas en estetica y
           funcionamiento al gestor de paquetes <<legacy>> (legado) dselect.

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 --\ Paquetes instalados
   --\ admin
     --\ principal - The Debian base system
 c   base  base-file 3.0.16      3.0.16      Debian base system miscellaneous fil
 c   base  base-pass 3.5.7       3.5.7       Debian base system master password a
 c   base  bash      2.05b-15    2.05b-15    The GNU Bourne Again SHell
 c   base  bsdutils  1:2.12-7    1:2.12-7    Basic utilities from 4.4BSD-Lite
 c   base  coreutils 5.0.91-2    5.0.91-2    The GNU core utilities
 c   base  debianuti 2.8.3       2.8.3       Miscellaneous utilities specific to
 c   base  diff      2.8.1-6     2.8.1-6     File comparison utilities
 base-files                      installed ; none                       required
 This package contains the basic filesystem hierarchy of a Debian system, and
 several important miscellaneous files, such as /etc/debian_version,
 /etc/host.conf, /etc/issue, /etc/motd, /etc/profile, /etc/nsswitch.conf, and
 others, and the text of several common licenses in use on Debian systems.







   Vertical-Split

           Este tema reorganiza la pantalla: la descripcion del paquete
           seleccionado apareceria a la derecha de la lista de paquetes, en
           lugar de debajo de la misma. Este tema es util en terminales muy
           anchas, y quizas tambien a la hora de editar la jerarquia de
           paquetes integrada.

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 aptitude 0.2.14.1
 --\ Paquetes instalados               Modern computers support the Advanced  #
   --\ admin - Utilidades de adminstracion
     --\ principal - The main Debian archive  (ACPI) to allow intelligent power
 i   acpid         1.0.3-19   1.0.3-19   management on your system and to query
 i   alien         8.44       8.44       battery and configuration status.
 i   anacron       2.3-9      2.3-9
 i   apt-show-vers 0.07       0.07       ACPID is a completely flexible, totally
 i A apt-utils     0.5.25     0.5.25     extensible daemon for delivering ACPI
 i   apt-watch     0.3.2-2    0.3.2-2    events. It listens on a file
 i   aptitude      0.2.14.1-2 0.2.14.1-2 (/proc/acpi/event) and when an event
 i   at            3.1.8-11   3.1.8-11   occurs, executes programs to handle the
 i   auto-apt      0.3.20     0.3.20     event. The programs it executes are
 i   cron          3.0pl1-83  3.0pl1-83  configured through a set of
 i   debconf       1.4.29     1.4.29     configuration files, which can be
 i   debconf-i18n  1.4.29     1.4.29     dropped into place by packages or by
 i A debootstrap   0.2.39     0.2.39     the admin.
 i A deborphan     1.7.3      1.7.3
 i   debtags       0.16       0.16       In order to use this package you need a
 i A defoma        0.11.8     0.11.8     recent Kernel (=>2.4.7). This can be
 i   discover      2.0.4-5    2.0.4-5    one including the patches on
 Utilities for using ACPI power management

Jugar al Buscaminas

   En el caso de que este cansado de instalar y eliminar paquetes, aptitude
   incluye una version del clasico juego "Buscaminas". Seleccione Acciones ->
   Jugar al buscaminas para iniciarlo; vera entonces el tablero inicial del
   Buscaminas:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu  ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 Buscaminas                                              10/10 minas  13 segundos





                                    +--------+
                                    |        |
                                    |        |
                                    |        |
                                    |        |
                                    |        |
                                    |        |
                                    |        |
                                    |        |
                                    +--------+






   Comprendidos en el rectangulo que aparece en la pantalla hay diez minas
   ocultas. Su meta es determinar a traves de la intuicion, logica y suerte,
   donde estan esas minas sin detonar ninguna de ellas. Para hacer esto, ha
   de descubrir todos los cuadrados que no contienen minas; al hacerlo,
   aprendera informacion valiosa relativa a que cuadrados contienen minas.
   Cuidado: descubrir un cuadrado que contiene una mina la detonara,
   finalizando la partida inmediatamente.

   Para descubrir un cuadrado (y asi descubrir si hay una mina ahi
   escondida), seleccione el cuadrado con las flechas de direccion y pulse
   Intro:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu  ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 Buscaminas                                             10/10 minas  387 segundos





                                    +--------+
                                    | 2......|
                                    | 2111...|
                                    |    1...|
                                    | 1111...|
                                    |11...111|
                                    |...113  |
                                    |1122    |
                                    |        |
                                    +--------+






   Como puede ver en la imagen, algunas partes ocultas (vacias) del tablero
   han quedado descubiertas. Los cuadrados que contengan un . son aquellos
   que no estan contiguos a una mina; los numeros que aparecen en los
   cuadrados restantes indican la distancia a la que estan de las minas.

   Si cree saber donde esta una mina, puede "marcar" el cuadrado. Para hacer
   esto, seleccione el cuadrado sospechoso y pulse f. Por ejemplo, en la
   imagen inferior, decidi que el cuadrado en el lado izquierdo del tablero
   parecia sospechoso...

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu  ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 Buscaminas                                              9/10 minas  961 segundos





                                    +--------+
                                    | 2......|
                                    | 2111...|
                                    |    1...|
                                    |F1111...|
                                    |11...111|
                                    |...113  |
                                    |1122    |
                                    |        |
                                    +--------+






   Como puede ver, hay una F en el cuadrado seleccionado. Ya no puede
   descubrir este cuadrado, incluso por accidente, hasta que elimine la marca
   (pulsando f otra vez). Una vez que haya marcado todas las minas contiguas
   a un cuadrado (por ejemplo, aquellos cuadrados etiquetados con 1 contiguas
   a la marca) puede hacer un "barrido" en torno al cuadrado. Este es solo un
   conveniente atajo para descubrir todos los cuadrados cerca de el
   (exceptuando aquellos marcados,por supuesto). Por ejemplo, haciendo un
   barrido en torno al 1 de la imagen superior:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu  ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 Buscaminas                                              9/10 minas  2290 segundos





                                    +--------+
                                    | 2......|
                                    | 2111...|
                                    |221 1...|
                                    |F1111...|
                                    |11...111|
                                    |...113  |
                                    |1122    |
                                    |        |
                                    +--------+






   Afortunadamente (?o ha sido suerte?), mi suposicion acerca de la ubicacion
   de la mina era correcta. De haber errado, habria perdido inmediatamente:

  Acciones  Deshacer  Paquete  Buscar  Opciones  Vistas  Ayuda
 f10: Menu  ?: Ayuda q: Salir u: Actualizar g: Descarga/Instala/Elimina Paqs
 Buscaminas                              Buscaminas    Perdio en 2388 segundos





                                    +--------+
                                    |^2......|
                                    |^2111...|
                                    |221^1...|
                                    |^1111...|
                                    |11...111|
                                    |...113^ |
                                    |1122* ^ |
                                    | ^ ^   ^|
                                    +--------+






   Cuando pierda se revelara la ubicacion de todas las minas: aquellas que no
   han explotado estan marcadas con un simbolo de intercalacion (^), y se
   indica la que ha "pisado" con un asterisco (*).

   --------------

   ^[7] Me complace decir que el numero de peticiones de esta indole cayeron
   dramaticamente a continuacion de la primera publicacion de esta guia.
   Seria una agradable coincidencia de haber una conexion entre ambos
   eventos.

   ^[8] A esto se le denomina a veces como un "proceso de instalacion",
   aunque lo que en realidad este haciendo sea eliminar o actualizar
   paquetes, ademas de instalarlos.

   ^[9] Como se ha mencionado antes, esto no indica que los paquetes del
   archivo sean seguros, o incluso no maliciosos; simplemente muestra que son
   genuinos.

   ^[10] Mas exactamente: se desinstalaran cuando nada conduzca a ellos a
   traves de <<Depende>>, <<Predepende>> o <<Recomienda>> desde un paquete
   instalado manualmente. Si Aptitude::Keep-Suggests es <<true>>, una
   relacion de <<Sugiere>> es tambien suficiente para mantener un paquete
   instalado.

   ^[11] O cuando la resolucion inmediata se desactiva.

   ^[12] El paquete con la mas alta prioridad en dpkg, no el paquete con la
   mas alta prioridad apt pin.

   ^[13] This limit was imposed because more complex cost structures could
   make it difficult to optimize the resolver. Future versions of the program
   might remove some of the restrictions if they turn out to be unnecessary.

   ^[14] aptitude trata la coma de manera unica si hay un segundo argumento,
   con lo cual "?name(apt,itude)" busca la cadena "apt,itude" en el campo de
   Name de los paquetes.

   Aunque este comportamiento esta bien definido, puede dar lugar a
   sorpresas. Recomiendo usar las comillas dobles para todo patron que
   contenga caracteres que puedan tener algun significado particular.

   ^[15] Los caracteres con un significado especial incluyen: "+", "-", ".",
   "(", ")", "|", "[", "]", "^", "$" y "?". Observe que algunos de estos son
   tambien meta-caracteres de aptitude, asi que si quiere introducir, por
   ejemplo, un "|" literal, debe usar una barra invertida:
   "?description(\~|)" muestra paquetes cuya descripcion contiene un caracter
   de barra vertical ("|").

   ^[16] Tambien estan disponibles las secuencias de escape \\, \n, y \t

   ^[17] El lector astuto habra notado que, esencialmente, esta es una manera
   de nombrar de manera explicita la variable en los l - terminos
   correspondientes al termino. Generalmente, un termino tiene la forma "l x,
   el nombre es igual a (x, patron)"; dando lugar a que un objetivo explicito
   x sea visible en el lenguaje de busqueda.

   ^[18] Esto se ha implementado principalmente por simetria con ?true.

   ^[19] Etiquetar no es posible por el momento; este escape existe para un
   uso futuro.

   ^[20] En algunas terminales, un fondo "amarillo" aparecera marron.

Capitulo 3. Preguntas mas frecuentes de aptitude

     "?Cual .... es su nombre?"

     "Yo soy Arturo, rey de los Bretones."

     "?Cual ... es su cruzada?"

     "!Busco el Santo Grial!"

     "?Cual ... es la velocidad de vuelo de una golondrina sin cargamento?"

     "?A que se refiere? A una golondrina africana, o europea?"

     "?Hmmm? Yo ... no lo se---AAAAAAAAGGGHH!"
                                             -- Monty Python y el Santo Grial

   3.1. ?Como puedo encontrar solo un paquete en base al nombre?

   3.2. ?Como puedo encontrar paquetes rotos?

   3.3. Quiero seleccionar texto. ?Porque aptitude no me permite desactivar
   el raton?

   3.1. ?Como puedo encontrar solo un paquete en base al nombre?
        Como se menciona en "Patrones de busqueda", cuando realiza una
        busqueda de un paquete en base al nombre, el texto que introduce es
        en realidad una expresion regular. Por ello, el patron de busqueda
        "^nombre$" solo coincidiria con un paquete llamado nombre.

        Por ejemplo, puede buscar apt (pero no aptitude o synaptic)
        introduciendo ^apt$; puede buscar g++ (pero no g++-2.95 o g++-3.0)
        introduciendo ^g\+\+$.
   3.2. ?Como puedo encontrar paquetes rotos?
        Utilice la orden Buscar -> Buscar Roto (b).
   3.3. Quiero seleccionar texto. ?Porque aptitude no me permite desactivar
        el raton?
        Normalmente, no puede seleccionar texto empleando el raton en una
        terminal xterm mientras haya un programa ejecutandose en esa terminal
        (tal como aptitude). Puede, no obstante, invalidar este
        comportamiento y llevar a cabo una seleccion presionando
        continuadamente Shift mientras pulsa sobre la terminal.

Capitulo 4. Creditos

           Nadie recuerda al cantante. La cancion permanece.
                                            -- Terry Pratchett, The Last Hero

   Esta seccion es un homenaje a algunas de las personas que han contribuido
   a aptitude a lo largo de su vida.

   [Nota] Nota
          Esta seccion esta mas bien incompleta, y es probable que se
          actualice y que crezca a medida que pase el tiempo (en particular,
          muchos de ellos son creditos de las traducciones debido al alto
          numero de fuentes de traducciones^[21]). Si piensa que deberia
          aparecer en esta lista, escribame a la direccion
          <dburrows@debian.org> con una explicacion de porque piensa que debe
          estar.

   Traducciones e internacionalizacion

   Traduccion al portugues de Brasil

           Andre Luis Lopes, Gustavo Silva

   Traduccion al chino

           Carlos Z.F. Liu

   Traduccion al checo

           Miroslav Kure

   Traduccion al danes

           Morten Brix Pedersen, Morten Bo Johansen

   Traduccion al neerlandes

           Luk Claes

   Traduccion al finlandes

           Jaakko Kangasharju

   Traduccion al frances

           Martin Quinson, Jean-Luc Coulon

   Traduccion al aleman

           Sebastian Schaffert, Erich Schubert, Sebastian Kapfer, Jens Seidel

   Traduccion al italiano

           Danilo Piazzalunga

   Traduccion al japones

           Yasuo Eto, Noritada Kobayashi

   Traduccion al lituano

           Darius ?itkevicius

   Traduccion al polaco

           Michal Politowski

   Traduccion al portugues

           Nuno Senica, Miguel Figueiredo

   Traduccion al noruego

           Haavard Korsvoll

   Traduccion al espanol

           Jordi Malloch, Ruben Porras, Javier Fernandez-Sanguino, Omar
           Campagne Polaino

   Traduccion al sueco

           Daniel Nylander

   Parche inical de i18n

           Masato Taruishi

   Mantenimiento y gestion de la i18n

           Christian Perrier

   Documentacion

   Manual de usuario

           Daniel Burrows

   Programacion

   Diseno del programa e implementacion

           Daniel Burrows

   Compatibilidad con el campo de <<Breaks>> (rompe) de dpkg

           Ian Jackson, Michael Vogt

   --------------

   ^[21] Deberia ser posible reunir una lista relativamente completa de
   aquellos contribuidores de i18n en base al registro de cambios, sus
   referencias en el sistema de seguimiento de fallos de Debian, y el
   historico de revisiones de aptitude, pero llevar esto a cabo requiere una
   alta inversion en tiempo que no esta disponible en este momento.

                       Referencia de la linea de ordenes

   --------------------------------------------------------------------------

   Tabla de contenidos

   aptitude -- interfaz de alto nivel para la gestion de paquetes

   aptitude-create-state-bundle -- empaquetar el estado actual de aptitude

   aptitude-run-state-bundle -- desempaquetar un archivo de estado de
   aptitude e invocar aptitude sobre este

Nombre de referencia

   aptitude -- interfaz de alto nivel para la gestion de paquetes

Sinopsis

   aptitude [opciones...] { autoclean | clean | forget-new | keep-all |
   update }

   aptitude [opciones...] { full-upgrade | safe-upgrade } [paquetes...]

   aptitude [options...] { build-dep | build-depends | changelog | download |
   forbid-version | hold | install | markauto | purge | reinstall | remove |
   show | unhold | unmarkauto | versions } packages...

   aptitude extract-cache-subset directorio_de_salida paquetes...

   aptitude [opciones...] search patrones...

   aptitude [opciones...] { add-user-tag | remove-user-tag } etiqueta
   paquetes...

   aptitude [opciones...] { why | why-not } [patrones...] paquete

   aptitude [-S nombre_de_archivo] [ --autoclean-on-startup |
   --clean-on-startup | -i | -u ]

   aptitude help

Descripcion

   aptitude es una interfaz de texto para el sistema de paquetes de Debian
   GNU/Linux.

   Permite al usuario ver la lista de paquetes y realizar tareas de gestion
   tales como instalar, actualizar o eliminar paquetes. Puede llevar a cabo
   las acciones con una interfaz grafica o en la linea de ordenes.

Acciones en la linea de ordenes

   El primer argumento que no va precedido de un guion ("-") se toma como una
   accion que el programa ha de llevar a cabo. Si no se especifica ninguna
   opcion en la linea de ordenes, aptitude iniciara el modo grafico.

   Dispone de las siguientes acciones:

   install

           Instalar uno o mas paquetes. Los paquetes deben aparecer despues
           de la orden "install"; si un nombre de paquete contiene una tilde
           ("~") o un signo de interrogacion ("?"), se toma como un patron de
           busqueda y se instalara cada paquete que se corresponda con el
           patron (vease la seccion "Patrones de busqueda" en el manual de
           referencia de aptitude)

           Para seleccionar una version en particular de un paquete, anada
           "=version": por ejemplo, "aptitude install apt=0.3.1". De manera
           parecida, para seleccionar un paquete de un archivo (repositorio)
           en particular, anada "/archivo" al nombre del paquete: por
           ejemplo, "aptitude install apt/experimental".

           No tiene que instalar todos los paquetes enumerados en la linea de
           ordenes; puede decirle a aptitude que haga una accion diferente
           con cada paquete si anade un "especificador de invalidacion" al
           nombre del paquete. Por ejemplo, aptitude remove wesnoth+
           instalaria wesnoth, no lo eliminaria. Estan disponibles los
           siguientes "especificadores de invalidacion":

                paquete+

                        Instalar paquete.

                paquete+M

                        Instalar el paquete, y marcarlo inmediatamente como
                        instalado automaticamente (observe que si nada
                        depende del paquete, este se eliminaria
                        inmediatamente).

                paquete-

                        Eliminar paquete.

                paquete_

                        Purgar el paquete: eliminarlo asi como todos sus
                        archivos de configuracion y de datos asociados a el.

                paquete=

                        Retener el paquete: impide instalar, actualizar o
                        eliminar, asi como cualquier futura actualizacion
                        automatica.

                paquete:

                        Mantener el paquete en su version actual: cancela
                        instalar, eliminar o actualizar. Al contrario que
                        "retener" (vease arriba) esto no impide
                        actualizaciones automaticas en el futuro.

                paquete&M

                        Marcar el paquete como automaticamente instalado.

                paquete&m

                        Marcar el paquete como manualmente instalado.

           Como caso especial, "install" sin argumentos procesaria cualquier
           accion guardada o pendiente de ejecucion.

           [Nota] Nota
                  Una vez que introduce Y en la peticion final de
                  confirmacion, la orden "install" modificara la informacion
                  guardada en aptitude relativa a que acciones ejecutar. Por
                  ello, si ejecuta la orden, por ejemplo, "aptitude install
                  foo bar" y despues interrumpe la instalacion durante la
                  descarga e instalacion de paquetes, necesitara ejecutar
                  "aptitude remove foo bar" para cancelar esa orden.

   remove, purge, hold, unhold, keep, reinstall

           Estas ordenes realizan lo mismo que "install", pero en este caso
           la accion nombrada afectaria a todos aquellos paquetes en la linea
           de ordenes que no la invaliden. La diferencia entre hold (retener)
           y keep (mantener), es que el primero causaria que un paquete se
           ignorase en futuras ordenes safe-upgrade o full-upgrade, mientras
           que keep solo cancela toda accion programada para ese paquete.
           unhold (anular retencion) permitiria actualizar un paquete en un
           futuro con las ordenes safe-upgrade o full-upgrade, que de otra
           forma no alterarian su estado.

           Por ejemplo, "aptitude remove '~ndeity'" eliminaria todos los
           paquetes cuyo nombre contiene "deity".

   markauto, unmarkauto

           Marcar paquetes como automatica o manualmente instalado,
           respectivamente. Los paquetes se especifican al igual que con la
           orden "install". Por ejemplo, "aptitude markauto '~slibs'"
           marcaria todos los paquetes de la seccion "libs" como
           automaticamente instalados.

           Para mas informacion acerca de paquetes automaticamente
           instalados, vease la seccion "Gestionar paquetes automaticamente
           instalados" del manual de referencia de aptitude.

   build-depends, build-dep

           Satisfacer las dependencias de construccion
           (<<build-dependencies>>) de un paquete. Cada nombre de paquete
           puede ser un paquete fuente, en cuyo caso se instalaran las
           dependencias de compilacion de ese paquete fuente; por otro lado,
           los paquetes binarios se encuentran de la misma manera que con la
           orden "install", y asi satisfacer las dependencias de compilacion
           de los paquetes fuente que compilan esos paquetes binarios.

           De estar presente el parametro de linea de ordenes --arch-only,
           solo obedeceria aquellas dependencias de compilacion
           independientes de arquitectura (p. ej., no Build-Depends-Indep o
           Build-Conflicts-Indep).

   forbid-version

           Prohibir que un paquete se actualice a un version determinada.
           Esto evita que aptitude lo actualice a esa version, pero
           permitiria una actualizacion automatica a otra version futura. De
           manera predeterminada aptitude escogera la version a la que se
           actualizaria el paquete en cualquier circunstancia; puede
           invalidar esta seleccion anadiendo "=version" al nombre del
           paquete: por ejemplo "aptitude forbid-version vim=1.2.3.broken-4".

           Esta orden es util para evitar versiones rotas de paquetes sin
           necesidad de definir y eliminar retenciones manuales. Si al final
           decide que realmente quiere la version prohibida, la orden
           "install" invalidaria la prohibicion.

   update

           Actualizar la lista de paquetes disponibles desde las fuentes de
           apt (equivale a "apt-get update")

   safe-upgrade

           Actualizar los paquetes instalados a su version mas reciente. Los
           paquetes instalados se eliminaran a menos que no se usen (vease la
           seccion "Gestionar paquetes automaticamente instalados" en la guia
           de referencia de aptitude). Los paquetes no instalados se pueden
           instalar para resolver dependencias a menos que se invoque la
           orden --no-new-installs.

           Si no introduce ningun paquete en la linea de ordenes, aptitude
           intentara actualizar todos los paquetes susceptibles de ello. De
           no ser asi, aptitude intentara actualizar solo aquellos paquetes
           que se deben actualizar. Puede extender paquete con sufijos de la
           misma manera que da argumentos a aptitude install, lo que le
           permite dar a aptitude instrucciones adicionales. Por ejemplo,
           aptitude safe-upgrade bash dash- intentaria actualizar el paquete
           bash y eliminar el paquete dash.

           A veces es necesario eliminar un paquete para poder actualizar
           otro; en tales situaciones esta orden no es capaz de actualizar
           paquetes. Utilice la orden full-upgrade para actualizar tantos
           paquetes como sea posible.

   full-upgrade

           Actualizar paquetes instalados a su version mas reciente,
           instalando o eliminando paquetes si es necesario. Esta orden es
           menos conservadora que safe-upgrade, y por ello mas proclive a
           ejecutar acciones no deseadas. Sin embargo, es capaz de actualizar
           paquetes que safe-upgrade es incapaz de actualizar.

           If no packages are listed on the command line, aptitude will
           attempt to upgrade every package that can be upgraded. Otherwise,
           aptitude will attempt to upgrade only the packages which it is
           instructed to upgrade. The packages can be extended with suffixes
           in the same manner as arguments to aptitude install, so you can
           also give additional instructions to aptitude here; for instance,
           aptitude full-upgrade bash dash- will attempt to upgrade the bash
           package and remove the dash package.

           [Nota] Nota
                  Por razones historicas, la orden se llamaba originalmente
                  dist-upgrade, y aptitude aun reconoce dist-upgrade como
                  sinonimo de full-upgrade.

   keep-all

           Cancelar todas las acciones programadas para cualquier paquete; se
           volvera al estado original cualquier paquete cuyo estado virtual
           indique instalar, actualizar o eliminar el paquete.

   forget-new

           Olvidar toda informacion interna relativa a que paquetes son
           "nuevos" (equivale a pulsar "f" en el modo grafico).

   search

           Buscar paquetes que coincidan con uno de los patrones introducidos
           en la linea de ordenes. Se mostrarian todos los paquetes que
           coincidan con cualquier patron introducido; por ejemplo "aptitude
           search '~N' edit" listaria todos los paquetes "nuevos" y todos
           aquellos paquetes cuyo nombre contenga "edit". Para mas
           informacion acerca de patrones de busqueda, vease la siguiente
           seccion en la guia de referencia de aptitude "Patrones de
           busqueda".

           [Nota] Nota
                  In the example above, "aptitude search '~N' edit" has two
                  arguments after search and thus is searching for two
                  patterns: "~N" and "edit". As described in the search
                  pattern reference, a single pattern composed of two
                  sub-patterns separated by a space (such as "~N edit")
                  matches only if both patterns match. Thus, the command
                  "aptitude search '~N edit'" will only show "new" packages
                  whose name contains "edit".

           A menos que introduzca la opcion -F, la salida de aptitude search
           tendra este aspecto:

 i   apt                             - Advanced front-end for dpkg
 pi  apt-build                       - frontend to apt to build, optimize and in
 cp  apt-file                        - APT package searching utility -- command-
 ihA raptor-utils                    - Raptor RDF Parser utilities

           Cada resultado de la busqueda aparece en una linea distinta. El
           primer caracter de cada linea indica el estado actual del paquete:
           los estados mas comunes son p, no se encontro ninguna senal de que
           tal paquete exista en el sistema, c, el paquete se elimino pero
           sus archivos de configuracion permanecen en el sistema, i, el
           paquete esta instalado, y v, que significa que el paquete es
           virtual. El segundo caracter indica la accion programada (de
           existir, si no, vera un espacio en blanco) para el paquete. Las
           acciones principales son i, el paquete se va a instalar, d, el
           paquete se va a eliminar, y p, que significa que el paquete y sus
           archivos de configuracion se van a eliminar completamente
           (purgar). Si el caracter es A, es que el paquete se instalo
           automaticamente.

           Para una lista completa de las marcas de estado y de accion
           posibles, vease la seccion "Acceder a la informacion de los
           paquetes" en la guia de referencia de aptitude. Para personalizar
           la salida de search, vease las opciones de linea de ordenes -F y
           --sort.

   show

           Mostrar informacion detallada relativa a uno o mas paquetes,
           listados de acuerdo a la orden <<search>>. Si el nombre de un
           paquete contiene un caracter de tilde ("~") o un signo de
           interrogacion ("?"), se tomara como un patron de busqueda y vera
           todos aquellos paquetes coincidentes (vease la seccion "Patrones
           de busqueda" en el manual de referencia de aptitude).

           Si el nivel de verbosidad es 1 o mayor (p. ej., al menos hay un -v
           en la linea de ordenes), aparecera informacion acerca de todas las
           versiones de los paquetes. De no ser asi, se muestra la
           informacion acerca de la "version candidata" (la version que
           "aptitude install" descargaria).

           Puede ver informacion relativa a una version diferente del paquete
           anadiendo =version al nombre del paquete; puede ver la version de
           un archivo o distribucion en particular anadiendo /archivo o
           /distribucional nombre del paquete. De introducirse uno, solo se
           mostrara la version que Ud. requirio, independientemente del nivel
           de verbosidad.

           Si el nivel de verbosidad es 1 o mayor, se mostrara la
           arquitectura del paquete, tamano comprimido, nombre de archivo y
           la suma de control md5. Si el nivel de verbosidad es 2 o mayor, la
           version o versiones seleccionadas se mostraran una vez por cada
           archivo en el que se encontraron.

   versions

           Displays the versions of the packages listed on the command-line.

 $ aptitude versions wesnoth
 p   1:1.4.5-1                                                             100
 p   1:1.6.5-1                                    unstable                 500
 p   1:1.7.14-1                                   experimental             1

           Each version is listed on a separate line. The leftmost three
           characters indicate the current state, planned state (if any), and
           whether the package was automatically installed; for more
           information on their meanings, see the documentation of aptitude
           search. To the right of the version number you can find the
           releases from which the version is available, and the pin priority
           of the version.

           If a package name contains a tilde character ("~") or a question
           mark ("?"), it will be treated as a search pattern and all
           matching versions will be displayed (see the section "Search
           Patterns" in the aptitude reference manual). This means that, for
           instance, aptitude versions '~i' will display all the versions
           that are currently installed on the system and nothing else, not
           even other versions of the same packages.

 $ aptitude versions '~nexim4-daemon-light'
 Package exim4-daemon-light:
 i   4.71-3                                                                100
 p   4.71-4                                       unstable                 500

 Package exim4-daemon-light-dbg:
 p   4.71-4                                       unstable                 500

           If the input is a search pattern, or if more than one package's
           versions are to be displayed, aptitude will automatically group
           the output by package, as shown above. You can disable this via
           --group-by=none, in which case aptitude will display a single list
           of all the versions that were found and automatically include the
           package name in each output line:

 $ aptitude versions --group-by=none '~nexim4-daemon-light'
 i   exim4-daemon-light 4.71-3                                             100
 p   exim4-daemon-light 4.71-4                    unstable                 500
 p   exim4-daemon-light-dbg 4.71-4                unstable                 500

           To disable the package name, pass --show-package-names=never:

 $ aptitude versions --show-package-names=never --group-by=none '~nexim4-daemon-light'
 i   4.71-3                                                                100
 p   4.71-4                                       unstable                 500
 p   4.71-4                                       unstable                 500

           In addition to the above options, the information printed for each
           version can be controlled by the command-line option -F. The order
           in which versions are displayed can be controlled by the
           command-line option --sort. To prevent aptitude from formatting
           the output into columns, use --disable-columns.

   add-user-tag, remove-user-tag

           Anadir una etiqueta de usuario o quitar una etiqueta de usuario
           del grupo de paquetes seleccionado. Si el nombre de un paquete
           contiene una tilde ("~") o un signo de interrogacion ("?"), se
           tomara como un patron de busqueda y la etiqueta se anadira o
           quitara a todos los paquetes que coinciden con el patron (vease la
           seccion "Patrones de busqueda" en el manual de referencia de
           aptitude).

           Las etiquetas de usuario son cadenas arbitrarias asociadas a un
           paquete. Pueden utilizarse en conjuncion con el termino de
           busqueda ?user-tag(etiqueta), el cual selecciona todos los
           paquetes con una etiqueta de usuario que coincide con etiqueta.

   why, why-not

           Explicar la razon de que un paquete en particular no se deberia, o
           deba, instalar en el sistema.

           Esta orden busca paquetes que requieren o entran en conflicto con
           el paquete dado. Muestra una secuencia de dependencias que llevan
           al paquete objetivo, acompanado de una nota que indica el estado
           de instalacion de cada paquete en la cadena de dependencias.

 $ aptitude why kdepim
 i   nautilus-data Recomienda nautilus
 i A nautilus      Recomienda desktop-base (>= 0.2)
 i A desktop-base  Sugiere   gnome | kde | xfce4 | wmaker
 p   kde           Depende de   kdepim (>= 4:3.4.3)

           La orden why busca una cadena de dependencias que instala el
           paquete nombrado en la linea de ordenes, tal y como se ve arriba.
           Tenga en cuenta que la dependencia que aptitude ha generado en
           este caso es solo una sugerencia. Esto se debe a que ningun
           paquete instalado actualmente en el sistema depende o recomienda
           el paquete kdepim; de haber una dependencia mas fuerte, aptitude
           la habria mostrado.

           Al contrario, why-not encuentra una cadena de dependencias que
           lleva a un conflicto con el paquete objetivo.

 $ aptitude why-not textopo
 i   ocaml-core          Depende de   ocamlweb
 i A ocamlweb            Depende de   tetex-extra | texlive-latex-extra
 i A texlive-latex-extra tiene conflictos con textopo

           Si hay uno o mas patrones, aptitude iniciara la busqueda a partir
           de estos patrones; esto es, el primer paquete de la cadena que
           devuelva sera un paquete que coincide con el patron en cuestion.
           Estos patrones se consideran como nombres de paquete a menos que
           contengan un signo de tilde ("~") o un signo de interrogacion
           ("?"), en cuyo caso se toman como patrones de busqueda (vease la
           seccion "Patrones de busqueda" en el manual de referencia de
           aptitude).

           Si no introduce ningun patron, aptitude busca cadenas de
           dependencias que se inician en paquetes manualmente instalados.
           Esto muestra con efectividad los paquetes que han causado o
           causarian que se instalase un paquete en particular.

           [Nota] Nota
                  aptitude why no ejecuta una resolucion completa de
                  dependencias, solo muestra relaciones directas entre
                  paquetes. Por ejemplo, si A depende de B, C depende de D, y
                  B y C entran en conflicto, "aptitude why-not D" no
                  devolveria la respuesta "A depende de B, B entra en
                  conflicto con C, y D depende de C".

           De manera predeterminada, aptitude solo muestra la cadena de
           dependencias "con mas paquetes instalados, la mas fuerte, precisa
           y corta". Esto significa que busca una cadena que solo contiene
           paquetes instalados y que se van a instalar; busca las
           dependencias mas fuertes posibles bajo esa restriccion; busca
           cadenas que evitan dependencias <<OR>> y <<Provee>>; y busca la
           cadena de dependencias mas corta que se ajusta a estos criterios.
           Estas reglas se debilitan de manera progresiva hasta encontrar una
           correspondencia.

           Si el nivel de verbosidad es 1 o mas, se mostraran todas las
           explicaciones que aptitude pueda encontrar, en orden inverso de
           importancia. Si el nivel de verbosidad es 2 o mas, se mostrara una
           cantidad realmente excesiva de informacion de depuracion de fallos
           a traves de la salida estandar.

           Esta orden devuelve 0 si tiene exito, 1 si no se pudo generar una
           explicacion, y -1 en caso de error.

   clean

           Eliminar todos los paquetes .deb del directorio almacen de
           paquetes (generalmente /var/cache/apt/archives).

   autoclean

           Eliminar todos los paquetes del almacen que ya no se pueden
           descargar. Esto le permite evitar que un almacen crezca sin
           control a lo largo del tiempo, sin tener que vaciarlo en su
           totalidad.

   changelog

           Descargar y mostrar el registro de cambios de Debian para cada
           paquete binario o fuente dado.

           De manera predeterminada, se descarga el registro de cambios de la
           version que se va a instalar con "aptitude install". Puede
           seleccionar una version en particular de un paquete anadiendo
           =version al nombre del paquete; puede seleccionar una version de
           un archivo o distribucion en particular anadiendo /archivo o
           /distribucional nombre del paquete (por ejemplo, /unstable o
           /sid).

   download

           Descargar el archivo .deb del paquete dado al directorio actual.
           Si el nombre de un paquete contiene un signo de tilde ("~") o un
           signo de interrogacion ("?"), se tomara como un patron de busqueda
           y se descargaran todos los paquetes correspondientes (vease la
           seccion "Patrones de busqueda" del manual de referencia de
           aptitude).

           De manera predeterminada, se descarga la version que se instalaria
           con "aptitude install". Puede seleccionar una version en
           particular de un paquete anadiendo =version al nombre del paquete;
           puede seleccionar una version de un archivo o distribucion en
           particular anadiendo /archivo o /release al nombre del paquete
           (por ejemplo, /unstable o /sid).

   extract-cache-subset

           Copiar el directorio de configuracion de apt (/etc/apt) y un
           subconjunto de la base de datos de paquetes al directorio
           especificado. Si no menciona ningun paquete se copiara la base de
           datos de paquetes en su totalidad; de otra forma solo se copiaran
           las entradas correspondientes a los paquetes nombrados. Cada
           nombre de paquete puede ser un patron de busqueda, y se
           seleccionaran todos los paquetes que se correspondan con el patron
           (vease la seccion "Patrones de busqueda"). Cualquier base de datos
           de paquetes presente en el directorio de salida se sobreescribira.

           Las dependencias en estancias de paquete binarias se reescribiran
           para eliminar referencias a paquetes que no se encuentren en el
           conjunto seleccionado.

   help

           Mostrar un breve resumen de las ordenes disponibles y sus
           opciones.

Opciones

   Puede utilizar las siguientes opciones para modificar el comportamiento de
   las acciones descritas anteriormente. Observe que mientras que todas las
   ordenes aceptan todas las opciones, algunas opciones no afectan a ciertas
   ordenes y estas ordenes las ignoraran.

   --add-user-tag etiqueta

           Para full-upgrade, safe-upgrade, forbid-version, hold, install,
           keep-all, markauto, unmarkauto, purge, reinstall, remove, unhold,
           y unmarkauto: anadir la etiqueta de usuario etiqueta a todos los
           paquetes instalados, eliminados o actualizados mediante esta
           orden, al igual que con la orden add-user-tag.

   --add-user-tag-to etiqueta,patron

           Para full-upgrade, safe-upgrade forbid-version, hold, install,
           keep-all, markauto, unmarkauto, purge, reinstall, remove, unhold,
           and unmarkauto: anadir la etiqueta de usuario etiqueta a todos los
           paquetes que coinciden con patron al igual que con la orden
           add-user-tag. El patron es un patron de busqueda tal y como se
           describe en la seccion "Patrones de busqueda" en el manual de
           referencia de aptitude.

           Por ejemplo, aptitude safe-upgrade --add-user-tag-to
           "new-installs,?action(install)" anadiria la etiqueta new-installs
           a todos los paquetes instalados mediante la orden safe-upgrade.

   --allow-new-upgrades

           Cuando se usa el solucionador seguro (p. ej., ha introducido
           --safe-resolver o se definio Aptitude::Always-Use-Safe-Resolver
           con valor de true), permite al solucionador de dependencias
           actualizar paquetes independientemente del valor de
           Aptitude::Safe-Resolver::No-New-Upgrades.

   --allow-new-installs

           Permitir que la orden safe-upgrade instale paquetes nuevos; cuando
           se usa el solucionador seguro (p. ej., ha introducido
           --safe-resolver o se ha definido
           Aptitude::Always-Use-Safe-Resolver con valor de true), permite al
           solucionador de dependencias instalar paquetes nuevos. Esta opcion
           tiene efecto sin importar el valor de
           Aptitude::Safe-Resolver::No-New-Installs.

   --allow-untrusted

           Instalar paquetes de fuentes sin firmar sin pedir confirmacion.
           Deberia utilizar esto solo si sabe lo que esta haciendo, ya que
           podria comprometer facilmente la seguridad de su sistema.

   --disable-columns

           This option causes aptitude search and aptitude version to output
           their results without any special formatting. In particular:
           normally aptitude will add whitespace or truncate search results
           in an attempt to fit its results into vertical "columns". With
           this flag, each line will be formed by replacing any format
           escapes in the format string with the correponding text; column
           widths will be ignored.

           Por ejemplo, las primeras lineas de la salida de "aptitude search
           -F '%p %V' --disable-columns libedataserver" pueden ser:

 disksearch 1.2.1-3
 hp-search-mac 0.1.3
 libbsearch-ruby 1.5-5
 libbsearch-ruby1.8 1.5-5
 libclass-dbi-abstractsearch-perl 0.07-2
 libdbix-fulltextsearch-perl 0.73-10

           Como se aprecia en el ejemplo anterior, --disable-columns es a
           menudo util en combinacion con un formato de diseno personalizado
           usando la opcion en linea de ordenes -F.

           Esto se corresponde con la opcion de configuracion
           Aptitude::CmdLine::Disable-Columns.

   -D, --show-deps

           Mostrar explicaciones breves de las instalaciones y eliminaciones
           automaticas de las ordenes que instalaran o eliminaran paquetes
           (install, full-upgrade, etc)

           Esto se corresponde con la opcion de configuracion
           Aptitude::CmdLine::Show-Deps.

   -d, --download-only

           Descargar cuantos paquetes se necesitan al almacen de paquetes,
           pero no instalar o eliminar nada. De manera predeterminada, el
           almacen de paquetes se guarda en /var/cache/apt/archives.

           Esto se corresponde con la opcion de configuracion
           Aptitude::CmdLine::Download-Only.

   -F formato, --display-format formato

           Specify the format which should be used to display output from the
           search and version commands. For instance, passing "%p %V %v" for
           format will display a package's name, followed by its currently
           installed version and its available version (see the section
           "Customizing how packages are displayed" in the aptitude reference
           manual for more information).

           La opcion en linea de ordenes --disable-columns es a veces util
           combinado con -F.

           For search, this corresponds to the configuration option
           Aptitude::CmdLine::Package-Display-Format; for versions, this
           corresponds to the configuration option
           Aptitude::CmdLine::Version-Display-Format.

   -f

           Intentar arreglar agresivamente las dependencias de paquetes
           rotos, incluso si ello significa ignorar las acciones introducidas
           en la linea de ordenes.

           Esto se corresponde con el elemento de configuracion
           Aptitude::CmdLine::Fix-Broken.

   --full-resolver

           Cuando se encuentren problemas de dependencias de paquetes,
           utilizar el solucionador predeterminado "full" (completo). A
           diferencia del solucionador "seguro" (el cual se ejecuta mediante
           --safe-resolver), el solucionador completo eliminara con alegria
           cualquier paquete para asi cumplir con las dependencias. Puede
           solucionar mas situaciones que el algoritmo seguro, pero puede que
           sus soluciones sean indeseables.

           Esta opcion se puede utilizar para forzar el uso del solucionador
           completo aunque Aptitude::Always-Use-Safe-Resolver tenga valor de
           <<true>>. La orden safe-upgrade nunca utiliza el solucionador
           completo, y no acepta la opcion --full-resolver.

   --group-by grouping-mode

           Control how the versions command groups its output. The following
           values are recognized:

              o archive to group packages by the archive they occur in
                ("stable", "unstable", etc). If a package occurs in several
                archives, it will be displayed in each of them.

              o auto to group versions by their package unless there is
                exactly one argument and it is not a search pattern.

              o none to display all the versions in a single list without any
                grouping.

              o package to group versions by their package.

              o source-package to group versions by their source package.

              o source-version to group versions by their source package and
                source version.

           This corresponds to the configuration option
           Aptitude::CmdLine::Versions-Group-By.

   -h, --help

           Muestra un breve mensaje de ayuda. Identica a la accion help.

   --log-file=archivo

           Si el archivo es una cadena que no esta vacia, en el se escribiran
           los mensajes del registro. Pero si archivo es "-" los mensajes
           saldran por la salida convencional. Si introduce esta opcion
           varias veces, la ultima aparicion es la que tiene efecto.

           This does not affect the log of installations that aptitude has
           performed (/var/log/aptitude); the log messages written using this
           configuration include internal program events, errors, and
           debugging messages. See the command-line option --log-level to get
           more control over what gets logged.

           Esto se corresponde con la opcion de configuracion
           Aptitude::Logging::File.

   --log-level=nivel, --log-level=categoria:nivel

           --log-level=nivel provoca que aptitude registre mensajes cuyo
           nivel es nivel, o superior. Por ejemplo, si define el nivel de
           registro como error, solo los mensajes al nivel de error y fatal
           se mostrarian; todos los otros se ocultarian. Los niveles de
           registro (en orden descendente) son off, fatal, error, warn, info,
           debug, y trace. El nivel de registro predeterminado es warn.

           --log-level=categoria:nivel hace que los mensajes pertenecientes a
           categoria se registren solo si su nivel es nivel o superior.

           --log-level puede aparecer varias veces en la linea de ordenes; la
           configuracion mas especifica es la que tiene efecto. Si introduce
           --log-level=aptitude.resolver:fatal y
           --log-level=aptitude.resolver.hints.match:trace, los mensajes en
           aptitude.resolver.hints.parse se imprimiran solo si su nivel es
           fatal, pero aquellos mensajes en aptitude.resolver.hints.match se
           mostraran. Si configura el nivel de la misma categoria dos o mas
           veces, la ultima configuracion es la que tiene efecto.

           This does not affect the log of installations that aptitude has
           performed (/var/log/aptitude); the log messages written using this
           configuration include internal program events, errors, and
           debugging messages. See the command-line option --log-file to
           change where log messages go.

           Esto se corresponde con el grupo de configuracion
           Aptitude::Logging::Levels.

   --log-resolver

           Definir algunos niveles estandar del registro relativos al
           solucionador, para producir una salida del registro apropiada para
           su procesamiento con herramientas automaticas. Esto equivale a las
           opciones en linea de ordenes
           --log-level=aptitude.resolver.search:trace
           --log-level=aptitude.resolver.search.tiers:warn.

   --no-new-installs

           Evitar que safe-upgrade instale cualquier paquete nuevo; cuando se
           utiliza el solucionador seguro (p. ej., introdujo --safe-resolver,
           o Aptitude::Always-Use-Safe-Resolver tiene valor de <<true>>),
           impide que el solucionador de dependencias instale paquetes
           nuevos. Esta opcion tiene efecto independientemente del valor de
           Aptitude::Safe-Resolver::No-New-Installs.

           Esto imita el comportamiento historico de apt-get upgrade.

           Esto se corresponde con la opcion de configuracion
           Aptitude::CmdLine::Safe-Upgrade::No-New-Installs.

   --no-new-upgrades

           Cuando se utiliza el solucionador seguro (p. ej., ha introducido
           --safe-resolver o Aptitude::Always-Use-Safe-Resolver se ha
           definido como true), permite al solucionador de dependencias
           instalar software nuevo independientemente del valor de
           Aptitude::Safe-Resolver::No-New-Installs.

   --no-show-resolver-actions

           No mostrar las acciones ejecutadas por el solucionador "seguro",
           invalidando toda opcion de configuracion o una orden anterior
           --show-resolver-actions.

   -O orden, --sort orden

           Specify the order in which output from the search and versions
           commands should be displayed. For instance, passing "installsize"
           for order will list packages in order according to their size when
           installed (see the section "Customizing how packages are sorted"
           in the aptitude reference manual for more information).

           The default sort order is name,version.

   -o llave=valor

           Definir directamente una opcion del archivo de configuracion; por
           ejemplo, use -o Aptitude::Log=/tmp/my-log para registrar las
           acciones de aptitude a /tmp/my-log. Para mas informacion acerca de
           las opciones del archivo de configuracion, vease la seccion
           "Referencia del archivo de configuracion" en el manual de
           referencia de aptitude.

   -P, --prompt

           Siempre pedir una confirmacion antes de descargar, instalar o
           eliminar paquetes, aunque no haya otras acciones programadas mas
           que las que Ud. requirio.

           Esto se corresponde con la opcion de configuracion
           Aptitude::CmdLine::Always-Prompt.

   --purge-unused

           Si define Aptitude::Delete-Unused como "true" (su valor
           predeterminado), ademas de eliminar cada paquete que ya no
           necesite ningun otro paquete instalado, aptitude los purgara,
           borrando sus archivos de configuracion y puede que otros datos
           importantes. Para mas informacion relativa a que paquetes se
           consideran "en desuso", vease la seccion "Gestionar paquetes
           automaticamente instalados". !ESTA OPCION PUEDE OCASIONAR PERDIDA
           DE DATOS! !NO LA USE A MENOS QUE SEPA LO QUE ESTA HACIENDO!

           Esto se corresponde con la opcion de configuracion
           Aptitude::Purge-Unused.

   -q[=n], --quiet[=n]

           Eliminar todos los indicadores de progreso incrementales,
           permitiendole registrar la salida. Puede introducirlo varias veces
           para disminuir los mensajes del programa, pero al contrario que
           apt-get, aptitude no activa -y cuando introduce q.

           Se puede utilizar la orden opcional =numero para configurar
           directamente la cuantia de silencio (por ejemplo, para invalidar
           una configuracion en /etc/apt/apt.conf); causa que el programa
           responda como si se hubiese introducido -q numero veces.

   -R, --without-recommends

           No toma recomendaciones como dependencias a la hora de instalar
           paquetes (esto invalida las configuraciones en /etc/apt/apt.conf y
           ~/.aptitude/config)

           Esto se corresponde con las dos opciones de configuracion
           Apt::Install-Recommends y Apt::AutoRemove::InstallRecommends.

   -r, --with-recommends

           Tratar las recomendaciones como dependencias a la hora de instalar
           paquetes nuevos (esto invalida las configuraciones en
           /etc/apt/apt.conf y ~/.aptitude/config).

           Esto se corresponde con la opcion de configuracion
           Apt::Install-Recommends

   --remove-user-tag etiqueta

           Para full-upgrade, safe-upgrade forbid-version, hold, install,
           keep-all, markauto, unmarkauto, purge, reinstall, remove, unhold,
           y unmarkauto: eliminar la etiqueta de usuario etiqueta de todos
           los paquetes que se van a instalar, eliminar o actualizar con esta
           orden, al igual que con la orden add-user-tag.

   --remove-user-tag-from etiqueta,patron

           Para full-upgrade, safe-upgrade forbid-version, hold, install,
           keep-all, markauto, unmarkauto, purge, reinstall, remove, unhold,
           y unmarkauto: eliminar la etiqueta de usuario etiqueta de todos
           los paquetes que coinciden con patron al igual que con la orden
           remove-user-tag. El patron es un patron de busqueda tal y como se
           describe en la seccion "Patrones de busqueda" en el manual de
           referencia de aptitude.

           Por ejemplo, aptitude safe-upgrade --remove-user-tag-from
           "not-upgraded,?action(upgrade)" borraria toda etiqueta
           not-upgraded de cualquier paquete que la orden safe-upgrade pueda
           actualizar.

   -s, --simulate

           En modo de linea de ordenes, imprime las acciones que se tomarian,
           pero no las ejecuta, sino que las simula. Esto no precisa de
           privilegios de administrador (root). En la interfaz grafica, abre
           el almacen con privilegios de solo lectura independientemente de
           si es, o no, el administrador.

           Esto se corresponde con la opcion de configuracion
           Aptitude::Simulate.

   --safe-resolver

           Cuando se encuentre un problema de dependencias, usar un algoritmo
           "safe" (seguro) para resolverlos. Este solucionador intenta
           preservar tantas elecciones suyas como sea posible; nunca
           eliminara un paquete o instalara una version que no sea la version
           candidata del paquete. Es el mismo algoritmo usado con
           safe-upgrade; efectivamente, aptitude --safe-resolver full-upgrade
           equivale aaptitude safe-upgrade. Debido a que safe-upgrade siempre
           usa el solucionador seguro, no acepta la marca --safe-resolver.

           Esta opcion equivale a definir la variable de configuracion
           Aptitude::Always-Use-Safe-Resolver como true.

   --schedule-only

           Programa las operaciones de las ordenes que modifican el estado de
           los paquetes, sin ejecutarlos realmente. Puede ejecutar acciones
           programadas ejecutando aptitude install sin introducir argumentos.
           Esto equivale a realizar las selecciones correspondientes en la
           interfaz grafica, y cerrar el programa tras ello.

           Por ejemplo. aptitude --schedule-only install evolution programa
           una instalacion ulterior para el paquete evolution.

   --show-package-names when

           Controls when the versions command shows package names. The
           following settings are allowed:

              o always: display package names every time that aptitude
                versions runs.

              o auto: display package names when aptitude versions runs if
                the output is not grouped by package, and either there is a
                pattern-matching argument or there is more than one argument.

              o never: never display package names in the output of aptitude
                versions.

           This option corresponds to the configuration item
           Aptitude::CmdLine::Versions-Show-Package-Names.

   --show-resolver-actions

           Mostrar las acciones tomadas por el solucionador seguro ("safe").

   --show-summary[=MODO]

           Modificar el comportamiento de "aptitude why" para que la salida
           sea un resumen de la cadena de dependencias, mas que mostrar la
           forma completa. Si esta opcion esta presente y el MODO no es
           "no-summary", las cadenas que contengan dependencias del tipo
           <<Sugiere>> no se mostraran: combine --show-summary con -v para
           ver un resumen de todas las razones por las que el paquete
           objetivo se va a instalar.

           El MODO puede ser cualquiera de los siguientes:

             1. no-summary: no mostrar el resumen (el comportamiento
                predeterminado si no se ha introducido --show-summary).

             2. first-package: mostrar el primer paquete de cada cadena. Este
                es el valor predeterminado de MODO si no esta presente.

             3. first-package-and-type: mostrar el primer paquete de cada
                cadena, acompanado de la fuerza de la dependencia mas debil
                de la cadena.

             4. all-packages: mostrar un resumen de cada cadena de
                dependencias que lleva al paquete objetivo.

             5. all-packages-with-dep-versions: mostrar un resumen de cada
                cadena de dependencias que conduce al paquete objetivo,
                incluyendo la version objetivo de cada dependencia.

           Esta opcion se corresponde con el elemento de configuracion
           Aptitude::CmdLine::Show-Summary; de estar presente --show-summary
           en la linea de ordenes, invalidaria
           Aptitude::CmdLine::Show-Summary.

           Ejemplo 10. Uso de --show-summary.

           --show-summary en conjuncion con -v muestra las razones de porque
           un paquete esta instalado:

 $ aptitude -v --show-summary why foomatic-db
 Paquetes que dependen de foomatic-db:
   cupsys-driver-gutenprint
   foomatic-db-engine
   foomatic-db-gutenprint
   foomatic-db-hpijs
   foomatic-filters-ppds
   foomatic-gui
   kde
   printconf
   wine

 $ aptitude -v --show-summary=first-package-and-type why foomatic-db
 Paquetes que dependen de foomatic-db:
   [Depende] cupsys-driver-gutenprint
   [Depende] foomatic-db-engine
   [Depende] foomatic-db-gutenprint
   [Depende] foomatic-db-hpijs
   [Depende] foomatic-filters-ppds
   [Depende] foomatic-gui
   [Depende] kde
   [Depende] printconf
   [Depende] wine

 $ aptitude -v --show-summary=all-packages why foomatic-db
 Paquetes que dependen de foomatic-db:
   cupsys-driver-gutenprint D: cups-driver-gutenprint D: cups R: foomatic-filters R: foomatic-db-engine D: foomatic-db
   foomatic-filters-ppds D: foomatic-filters R: foomatic-db-engine D: foomatic-db
   kde D: kdeadmin R: system-config-printer-kde D: system-config-printer R: hal-cups-utils D: cups R: foomatic-filters R: foomatic-db-engine D: foomatic-db
   wine D: libwine-print D: cups-bsd R: cups R: foomatic-filters R: foomatic-db-engine D: foomatic-db
   foomatic-db-engine D: foomatic-db
   foomatic-db-gutenprint D: foomatic-db
   foomatic-db-hpijs D: foomatic-db
   foomatic-gui D: python-foomatic D: foomatic-db-engine D: foomatic-db
   printconf D: foomatic-db

 $ aptitude -v --show-summary=all-packages-with-dep-versions why foomatic-db
 Paquetes que dependen de foomatic-db:
   cupsys-driver-gutenprint D: cups-driver-gutenprint (>= 5.0.2-4) D: cups (>= 1.3.0) R: foomatic-filters (>= 4.0) R: foomatic-db-engine (>= 4.0) D: foomatic-db (>= 20090301)
   foomatic-filters-ppds D: foomatic-filters R: foomatic-db-engine (>= 4.0) D: foomatic-db (>= 20090301)
   kde D: kdeadmin (>= 4:3.5.5) R: system-config-printer-kde (>= 4:4.2.2-1) D: system-config-printer (>= 1.0.0) R: hal-cups-utils D: cups R: foomatic-filters (>= 4.0) R: foomatic-db-engine (>= 4.0) D: foomatic-db (>= 20090301)
   wine D: libwine-print (= 1.1.15-1) D: cups-bsd R: cups R: foomatic-filters (>= 4.0) R: foomatic-db-engine (>= 4.0) D: foomatic-db (>= 20090301)
   foomatic-db-engine D: foomatic-db
   foomatic-db-gutenprint D: foomatic-db
   foomatic-db-hpijs D: foomatic-db
   foomatic-gui D: python-foomatic (>= 0.7.9.2) D: foomatic-db-engine D: foomatic-db (>= 20090301)
   printconf D: foomatic-db


           --show-summary se emplea para mostrar la cadena en una linea:

 $ aptitude --show-summary=all-packages why aptitude-gtk libglib2.0-data
 Paquetes que dependen de libglib2.0-data:
   aptitude-gtk D: libglib2.0-0 R: libglib2.0-data

   -t distribucion, --target-release distribucion

           Definir la rama de la que se deberian instalar los paquetes. Por
           ejemplo, "aptitude -t experimental ..." instalaria paquetes de la
           distribucion <<experimental>> a menos que especifique lo
           contrario. Para las acciones en linea de ordenes "changelog",
           "download", y "show", esto equivale a anadir /rama al final de
           cada paquete nombrado en la linea de ordenes; para otras ordenes,
           esto afecta a la version candidata de los paquetes de acuerdo a
           las reglas descritas en apt_preferences(5).

           Esto se corresponde con el elemento de configuracion
           APT::Default-Release.

   -V, --show-versions

           Mostrar que versiones de paquetes se van a instalar.

           Esto se corresponde con la opcion de configuracion
           Aptitude::CmdLine::Show-Versions.

   -v, --verbose

           Causar que algunas ordenes, (tales como show) muestren informacion
           adicional. Esto se puede introducir varias veces para asi obtener
           mas y mas informacion.

           Esto se corresponde con la opcion de configuracion
           Aptitude::CmdLine::Verbose.

   --version

           Mostrar la version de aptitude y cierta informacion acerca de como
           se compilo.

           Cuando ejecuta la orden safe-upgrade o cuando se ha introducido la
           opcion --safe-resolver, aptitude mostrara un resumen de las
           acciones tomadas por el solucionador antes de imprimir la
           previsualizacion de la instalacion. Esto equivale a las opciones
           de configuracion
           Aptitude::CmdLine::Safe-Upgrade::Show-Resolver-Actions y
           Aptitude::Safe-Resolver::Show-Resolver-Actions.

   --visual-preview

           Mostrar la pantalla de previsualizacion de la interfaz grafica al
           eliminar o instalar paquetes desde la linea de ordenes, en lugar
           de la pantalla normal.

   -W, --show-why

           En la pantalla de previsualizacion que se muestra antes de
           instalar o eliminar paquetes, mostrar las dependencias de paquetes
           manualmente instalados sobre cada paquete automaticamente
           instalado. Por ejemplo:

 $ aptitude --show-why install mediawiki
 ...
 Se van a instalar los siguientes paquetes NUEVOS:
   libapache2-mod-php5{a} (for mediawiki)  mediawiki  php5{a} (for mediawiki)
   php5-cli{a} (for mediawiki)  php5-common{a} (for mediawiki)
   php5-mysql{a} (for mediawiki)

           En combinacion con -v o un valor que no equivalga a 0 para
           Aptitude::CmdLine::Verbose, mostrar la cadena de dependencias
           completa que conducen a cada paquete que se va a instalar. Por
           ejemplo:

 $ aptitude -v --show-why install libdb4.2-dev
 Se instalaran los siguiente paquetes NUEVOS:
   libdb4.2{a} (libdb4.2-dev D: libdb4.2)  libdb4.2-dev
 Se ELIMINARAN los siguientes paquetes:
   libdb4.4-dev{a} (libdb4.2-dev C: libdb-dev P<- libdb-dev)

           Esta opcion tambien describiria porque los paquetes se van a
           eliminar, como puede observar en el texto anterior. En este
           ejemplo, libdb4.2-dev entra en conflicto con libdb-dev, que provee
           libdb-dev.

           Este argumento se corresponde con la opcion de configuracion
           Aptitude::CmdLine::Show-Why, y muestra la misma informacion
           computada por aptitude why y aptitude why-not.

   -w ancho, --width ancho

           Especificar el ancho de pantalla que se deberia emplear en la
           salida de la orden search (el ancho de la terminal se usa de
           manera predeterminada).

           Esto se corresponde con la opcion de configuracion
           Aptitude::CmdLine::Package-Display-Width

   -y, --assume-yes

           Cuando se presente una pregunta si/no, se asumira que el usuario
           introdujo "si". En particular, suprime la previsualizacion final
           cuando instala, actualizar o elimina paquetes. Aun asi, vera
           preguntas acerca de acciones "peligrosas" tales como eliminar
           paquetes esenciales. Esta opcion invalida -P.

           Esto se corresponde con la opcion de configuracion
           Aptitude::CmdLine::Assume-Yes.

   -Z

           Mostrar cuanto espacio del disco se va usar o liberar por cada
           paquete individual que se va a instalar, actualizar, o eliminar.

           Esto se corresponde con la opcion de configuracion
           Aptitude::CmdLine::Show-Size-Changes.

   Las siguientes opciones afectan a la interfaz grafica del programa, pero
   se han disenado para un uso interno; generalmente, no tendra que
   utilizarlas.

   --autoclean-on-startup

           Eliminar los archivos descargados y antiguos al inicio (equivale a
           iniciar el programa y seleccionar inmediatamente Acciones ->
           Limpiar el almacen de paquetes). No puede usar esta opcion y
           "--autoclean-on-startup", "-i", o "-u" a la vez.

   --clean-on-startup

           Vaciar el almacen de paquetes cuando el programa se inicia
           (equivale a iniciar el programa y seleccionar inmediatamente
           Acciones -> Limpiar el almacen de paquetes). No puede usar esta
           opcion y "--autoclean-on-startup", "-i", o "-u" a la vez.

   -i

           Mostrar una previsualizacion de la descarga cuando se inicia el
           programa (equivale a iniciar el programa y pulsar "g"
           inmediatamente). No puede utilizar esta opcion y
           "--autoclean-on-startup", "--clean-on-startup", o "-u" a la vez.

   -S nombre_de_archivo

           Cargar la informacion de estado extendida desde nombre_de_archivo
           en lugar del archivo estandar de estado.

   -u

           Actualizar la lista de paquetes en cuanto se inicia el programa.
           No puede usar esta opcion y "--autoclean-on-startup",
           "--clean-on-startup", o "-i" a la vez.

Entorno

   HOME

           Si existe <<$HOME/.aptitude>>, aptitude guardara su archivo de
           configuracion en <<$HOME/.aptitude/config>>. De no ser asi,
           buscara en el directorio de inicio del usuario actual usando
           getpwuid(2), y guardara ahi su archivo de configuracion.

   PAGER

           Si define esta variable de entorno aptitude la usara para mostrar
           los registros de cambios cuando invoque "aptitude changelog". De
           no ser asi, su valor predeterminado es more.

   TMP

           Si no define TMPDIR, aptitude guardara sus archivos temporales en
           TMP si se ha definido esa variable. De no ser asi, los guardara en
           /tmp.

   TMPDIR

           aptitude guardara sus archivos temporales en el directorio
           indicado en esta varible de entorno. Si no define TMPDIR, se usara
           TMP; si tampoco ha definido TMP, aptitude usara /tmp.

Archivos

   /var/lib/aptitude/pkgstates

           El archivo en el que se guardan los estados de los paquetes y
           algunas marcas de accion.

   /etc/apt/apt.conf, /etc/apt/apt.conf.d/*, ~/.aptitude/config

           Los archivos de configuracion de aptitude. ~/.aptitude/config
           invalida /etc/apt/apt.conf. Vease apt.conf(5) para la
           documentacion relativa al formato y contenido de estos archivos.

Vease tambien

   apt-get(8), apt(8), /usr/share/doc/aptitude/html/es/index.html disponible
   en el paquete aptitude-doc-es

   --------------------------------------------------------------------------

Nombre de referencia

   aptitude-create-state-bundle -- empaquetar el estado actual de aptitude

Sinopsis

   aptitude-create-state-bundle [opciones...] archivo_de_salida

Descripcion

   La orden aptitude-create-state-bundle genera un archivo comprimido que
   guarda los archivos necesarios para mimetizar el estado actual del archivo
   de paquetes. Se incluyen en el archivo generado los siguientes archivos y
   directorios:

     o $HOME/.aptitude

     o /var/lib/aptitude

     o /var/lib/apt

     o /var/cache/apt/*.bin

     o /etc/apt

     o /var/lib/dpkg/status

   La salida de este programa se puede usar como un argumento de
   aptitude-run-state-bundle(1).

Opciones

   --force-bzip2

           Invalidar la deteccion de que algoritmo de compresion usar. De
           manera predeterminada, aptitude-create-state-bundle utiliza
           bzip2(1), de estar disponible, o gzip(1) de no ser asi. Introducir
           esta opcion fuerza el uso de bzip2 aunque no parezca estar
           disponible.

   --force-gzip

           Invalidar la deteccion de que algoritmo de compresion usar. De
           manera predeterminada, aptitude-create-state-bundle utiliza
           bzip2(1), de estar disponible, o gzip(1) de no ser asi. Introducir
           esta opcion fuerza el uso de gzip aunque bzip2 este disponible.

   --help

           Mostrar un breve resumen del uso, despues cierra.

   --print-inputs

           En lugar de crear un archivo, muestra una lista de los archivos y
           directorios que el programa incluiria de generar un archivo de
           estado.

El formato del archivo

   El archivo de estado es simplemente un archivo tar(1) comprimido con
   bzip2(1) o gzip(1). La raiz de cada uno de los arboles de directorios de
   entrada es ".".

Vease tambien

   aptitude-run-state-bundle(1), aptitude(8), apt(8)

   --------------------------------------------------------------------------

Nombre de referencia

   aptitude-run-state-bundle -- desempaquetar un archivo de estado de
   aptitude e invocar aptitude sobre este

Sinopsis

   aptitude-run-state-bundle [opciones...] archivo_de_entrada [ programa
   [argumentos...]]

Descripcion

   aptitude-run-state-bundle desempaqueta el archivo de estado de aptitude
   creado por aptitude-create-state-bundle(1) en un directorio temporal,
   invoca programa sobre el con los argumentos proporcionados, y elimina el
   directorio temporal a continuacion. Si no se introduce programa, su valor
   por omision es aptitude(8).

Opciones

   Las siguientes opciones pueden preceder al archivo de entrada en la linea
   de ordenes. Las opciones a continuacion del archivo de entrada se toman
   como argumentos para aptitude.

   --append-args

           Introducir al final de la linea de ordenes las opciones que dan la
           ubicacion del archivo de estado al invocar programa, en lugar de
           al principio de este (comportamiento predeterminado).

   --help

           Mostrar un breve resumen del uso.

   --prepend-args

           Introducir al inicio de la linea de ordenes las opciones que dan
           la ubicacion del paquete de estado al invocar programa,
           invalidando cualquier otro --append-args (el valor predeterminado
           es ubicar las opciones al inicio).

   --no-clean

           Evita eliminar el directorio de estado desempaquetado despues de
           ejecutar aptitude. Deberia usar esto si, por ejemplo, esta
           depurando un fallo que aparece al modificar el archivo de estado
           de aptitude. El nombre del directorio de estado se mostrara al
           final de la ejecucion de aptitude, para asi permitirle un acceso
           futuro.

           Esta opcion se activa automaticamente por --statedir.

   --really-clean

           Eliminar el directorio de estado tras ejecutar aptitude, incluso
           si introduce --no-clean o --statedir.

   --statedir

           En lugar de tratar el archivo de entrada como un archivo de
           estado, lo trata como un archivo de estado desempaquetado. Por
           ejemplo, puede usar esto para acceder al directorio de estado que
           se creo al ejecutar --no-clean con anterioridad.

   --unpack

           Desempaquetar el archivo de entrada en un directorio temporal,
           pero no ejecutar la orden aptitude.

Vease tambien

   aptitude-create-state-bundle(1), aptitude(8), apt(8)
