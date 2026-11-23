import { createServer } from 'node:http'
import sirv from 'sirv'

// Serve only the deployable files, at the same mount point Pages will use.
const mount = `${process.env.PAGES_BASE_PATH || ''}/`
const port = Number(process.env.PORT || 4173)
const serve = sirv('dist/client')
createServer((req, res) => {
  if (!req.url?.startsWith(mount)) {
    res.writeHead(404).end()
    return
  }
  req.url = req.url.slice(mount.length - 1)
  serve(req, res)
}).listen(port, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${port}${mount}`))
