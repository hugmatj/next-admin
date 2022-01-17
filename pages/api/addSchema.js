import nc from 'next-connect';
import { writeJSON, getJSON } from '../../scripts/util.js'

const app = nc();

app.post((req, res) => {
  if (req.cookies.admin_session === process.env.ADMIN_SESSION) {
    try {
      let body = JSON.parse(req.body)
      let update = writeJSON((json) => ({
        ...json,
        [body.schema]: [...json[body.schema], body.data]
      }));
      res.json({ success: true, data: update });
    } catch (e) {
      console.log(e)
      res.json({ success: false })
    }
  }else{
    res.status(401).json({ status: 401, success: false, message: "Unauthorized" })
  }
})

export default app;