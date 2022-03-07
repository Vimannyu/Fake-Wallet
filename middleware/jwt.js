/* eslint-disable import/extensions */
import jwt from 'jsonwebtoken'
import {key} from '../controllers/userController.js'

function authenticateToken(req, res, next){
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
  
    jwt.verify(token, key , (err, user) => {
      console.log(err)
      if (err) return res.sendStatus(403)
      req.user = user
      next()
    })
  }

  export default authenticateToken;