import nc from 'next-connect';
import { writeJSON, getJSON } from '../../scripts/util.js'

const app = nc();

app.post((req, res) => {
  if (req.cookies.admin_session === process.env.ADMIN_SESSION) {
    try {
      let body = JSON.parse(req.body)
      let json = getJSON();
      let obj = {
        ...json
      }
      for (var i = 0; i < Object.keys(body.data).length; i++) {
        eval("obj" + Object.keys(body.data)[i] + "='" + Object.values(body.data)[i].replace(/\'/g,"\\'").replace(/\"/g,"\\\"").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t") + "';")
      }
      let update = writeJSON(x => (obj))
      res.json({ success: true, data: update });
    } catch (e) {
      console.log(e)
      res.json({ success: false, error: e })
    }
  }else{
    res.status(401).json({ status: 401, success: false, message: "Unauthorized" })
  }
})

export default app;