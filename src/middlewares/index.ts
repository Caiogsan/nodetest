import express from 'express'
import { get } from "lodash"
import { getUserBySessionToken } from '../db/users'

export const isOwner = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { id } = req.params
        const currentUserId = get(req, 'identity._id') as string

        if(!currentUserId){
            console.log('No current id')
            return res.sendStatus(403)
        }

        if(currentUserId.toString() !== id){
            console.log('wrong id')
            return res.sendStatus(403)
        }
        next()
    } catch (error){
        console.log(error)
        return res.sendStatus(400)
    }
}

export const isAuthenticated = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try{
        
        const sessionToken = req.cookies['CAIO-AUTH']
        console.log(sessionToken)
        if(!sessionToken){
            console.log('No session token')
            return res.sendStatus(403)
        }

        const existingUser = await getUserBySessionToken(sessionToken)
        console.log(existingUser)
        if(!existingUser){
            console.log('No existing user')
            return res.sendStatus(403)
        }
        
        Object.assign(req, { identity: existingUser })
        console.log('after auth')
        next()
    } catch (error) {
        console.log(`There is an error: ${error}`)
        return res.sendStatus(400)
    }
}
