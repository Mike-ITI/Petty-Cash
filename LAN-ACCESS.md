# Petty Cash LAN access

Use `Start LAN HTTPS.cmd` on this computer. Keep the two service windows open.

- Computer name: `ITI-PLVASQUEZ`
- LAN IP: `192.168.5.57`
- Wi-Fi MAC: `DC-21-48-E9-3A-95`
- App port (localhost only): `5173/TCP`
- LAN HTTPS port: `8443/TCP`
- User URL: `https://192.168.5.57:8443`
- Certificate authority file for IT: `root.crt`

IT should install `root.crt` into the **Trusted Root Certification Authorities** store on each client device that will access the service. The certificate is for this local Caddy CA; it is not a public internet certificate.
