# 🚀 Configuración de Jenkins para Deploy Automático

## 📋 Requisitos previos

### En tu servidor Windows con Docker:

1. **Jenkins instalado y corriendo** (en contenedor Docker)
2. **Docker instalado** en el host de Windows
3. **Docker Compose instalado**
4. **Git instalado** en el contenedor de Jenkins

## 🔧 Configuración de Jenkins

### Paso 1: Instalar plugins necesarios

Ve a **Jenkins → Manage Jenkins → Manage Plugins → Available** e instala:

- ✅ Git Plugin
- ✅ GitHub Plugin
- ✅ Docker Plugin (opcional, pero recomendado)
- ✅ Pipeline Plugin (ya viene instalado usualmente)

### Paso 2: Configurar credenciales de GitHub

1. Ve a **Jenkins → Manage Jenkins → Credentials**
2. Click en **(global)** → **Add Credentials**
3. Selecciona:
   - **Kind**: Username with password
   - **Username**: Tu usuario de GitHub
   - **Password**: Tu Personal Access Token de GitHub
   - **ID**: `github-credentials`
   - **Description**: GitHub Access Token

#### Crear Personal Access Token en GitHub:
1. Ve a GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token (classic)
3. Selecciona scopes: `repo`, `admin:repo_hook`
4. Copia el token generado

### Paso 3: Montar Docker socket en Jenkins

Si Jenkins está en Docker, asegúrate de que tenga acceso a Docker del host.

**Comando para correr Jenkins con acceso a Docker:**

```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v /usr/bin/docker:/usr/bin/docker \
  --user root \
  jenkins/jenkins:lts
```

**Para Windows con WSL2:**
```bash
docker run -d \
  --name jenkins \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_home:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --group-add 0 \
  jenkins/jenkins:lts
```

### Paso 4: Instalar Docker dentro de Jenkins

Accede al contenedor de Jenkins:

```bash
docker exec -it -u root jenkins bash
```

Instala Docker CLI:

```bash
apt-get update
apt-get install -y docker.io docker-compose
chmod 666 /var/run/docker.sock
exit
```

### Paso 5: Crear el Job en Jenkins

#### Opción A: Pipeline desde SCM (Recomendado)

1. Ve a **Jenkins → New Item**
2. Nombre: `administracion_qr_deploy`
3. Tipo: **Pipeline**
4. Click **OK**

5. En la configuración:
   - **General**:
     - ✅ GitHub project: `https://github.com/esauMartinez/administracion_qr/`

   - **Build Triggers**:
     - ✅ GitHub hook trigger for GITScm polling
     - ✅ Poll SCM: `H/5 * * * *` (cada 5 minutos como fallback)

   - **Pipeline**:
     - **Definition**: Pipeline script from SCM
     - **SCM**: Git
     - **Repository URL**: `https://github.com/esauMartinez/administracion_qr.git`
     - **Credentials**: Selecciona `github-credentials`
     - **Branch**: `*/main`
     - **Script Path**: `Jenkinsfile`

6. Click **Save**

#### Opción B: Pipeline script directo

Si prefieres copiar el script directamente en Jenkins:
1. En **Pipeline → Definition**: selecciona **Pipeline script**
2. Copia el contenido del Jenkinsfile en el campo de texto

### Paso 6: Configurar Webhook en GitHub (Deploy automático)

Para que Jenkins se ejecute automáticamente al hacer push:

1. Ve a tu repositorio en GitHub: `https://github.com/esauMartinez/administracion_qr`
2. Ve a **Settings → Webhooks → Add webhook**
3. Configura:
   - **Payload URL**: `http://TU_IP_JENKINS:8080/github-webhook/`
   - **Content type**: `application/json`
   - **Which events**: `Just the push event`
   - ✅ Active
4. Click **Add webhook**

**Nota**: Si Jenkins está en localhost, necesitarás usar un servicio como ngrok o tener una IP pública.

### Paso 7: Probar el pipeline

#### Primera ejecución manual:
1. Ve al job `administracion_qr_deploy`
2. Click en **Build Now**
3. Observa la consola para ver el progreso

#### Verificar el despliegue:
```bash
# Ver contenedores corriendo
docker ps

# Ver logs
docker-compose logs -f

# Verificar la aplicación
curl http://localhost:3500
```

## 🔄 Flujo de trabajo

1. **Desarrollo**: Haces cambios en tu código localmente
2. **Commit & Push**: `git push origin main`
3. **Webhook**: GitHub notifica a Jenkins
4. **Pipeline**: Jenkins ejecuta automáticamente:
   - Clona el código
   - Construye la imagen Docker
   - Detiene el contenedor anterior
   - Despliega el nuevo contenedor
5. **Verificación**: La app está disponible en `http://localhost:3500`

## 🐛 Troubleshooting

### Error: "docker: permission denied"
```bash
docker exec -u root jenkins chmod 666 /var/run/docker.sock
```

### Error: "docker-compose: command not found"
Instala docker-compose en el contenedor de Jenkins (ver Paso 4)

### Error: "Cannot connect to the Docker daemon"
Verifica que el socket de Docker esté montado correctamente en Jenkins

### El webhook no funciona
- Verifica que Jenkins sea accesible desde internet
- Usa ngrok si estás en localhost: `ngrok http 8080`
- Actualiza la URL del webhook con la URL de ngrok

### El build falla en npm
Asegúrate de que Jenkins tenga suficiente memoria:
```bash
docker update --memory="2g" jenkins
```

## 📊 Monitoreo

Ver logs en tiempo real:
```bash
# Logs de Jenkins
docker logs -f jenkins

# Logs de la aplicación
docker-compose logs -f sistema-prueba
```

## 🎉 ¡Listo!

Tu aplicación Vue.js ahora se desplegará automáticamente cada vez que hagas push a la rama `main`.

Accede a tu aplicación en: **http://localhost:3500** (o la IP de tu servidor)
