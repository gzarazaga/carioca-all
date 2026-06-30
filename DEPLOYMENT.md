# Deployment

Notas de evaluación de hosting gratuito para los dos componentes. Pendiente: elegir combinación y configurar el deploy.

## Restricciones conocidas
- Railway descartado: falló en un uso anterior.
- Backend (`carioca/`) usa WebSocket (`infrastructure/adapter/in/websocket/`), así que el host debe soportarlo.

## Opciones evaluadas

### Frontend (`carioca-fe/`, build estático de Vite)
- **Vercel** — deploy directo desde GitHub, sin cold start, capa gratuita generosa. (Recomendado)
- **Cloudflare Pages** — alternativa equivalente a Vercel.

### Backend (`carioca/`, Spring Boot + WebSocket)
- **Render** — reemplazo más directo a Railway (free web service, soporta Docker y WebSockets). Contra: el tier gratis duerme tras 15 min de inactividad, cold-start de 30-60s.
- **Fly.io** — no duerme tanto, buen soporte de WebSockets. Contra: pide tarjeta para verificar la cuenta (no cobra en tier gratis).
- **Koyeb** — similar a Render, no pide tarjeta. Contra: free tier más limitado en recursos.

## Combinaciones sugeridas
- Si el cold-start no molesta: **Render + Vercel**.
- Si se quiere evitar el sleep: **Fly.io + Cloudflare Pages**.

## Próximos pasos
- [ ] Decidir combinación de hosts.
- [ ] Configurar `application-prod.properties` / variables de entorno para el host elegido.
- [ ] Configurar build/deploy del frontend apuntando a la URL del backend en prod.
- [ ] Configurar CORS en el backend para el dominio del frontend desplegado.
