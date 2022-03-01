import { verify } from 'jsonwebtoken';
import {key} from '../controllers/apiAuth'

function authenticateToken(req, res, next){
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    verify(token, key , (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

  export default authenticateToken;