import express from 'express'
import { authentication, random } from '../helpers'
import { getUserByEmail, createUser } from '../db/users'

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body

        if(!email || !password) {
            console.log(`There is no email or password: ${email} ${password}`)
            return res.sendStatus(400)
        }

        const user = await getUserByEmail(email).select('+authentication.salt + authentication.password')

        if(!user) {
            console.log('No user with this email')
            return res.sendStatus(400)
        }

        const expectedHash = authentication(password, user.authentication.salt)

        if(user.authentication.password !== expectedHash) {
            console.log(`Wrong password ${expectedHash}`)
            return res.sendStatus(403)
        }

        const salt = random()
        user.authentication.sessionToken = authentication(salt, user._id.toString())
        await user.save()
        res.cookie('CAIO-AUTH', user.authentication.sessionToken, { domain: 'localhost', path: '/' })

        return res.status(200).json(user).end()
    } catch (error) {
        console.log(`There is an error: ${error}`)
        return res.sendStatus(400)
    }
}

export const register = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body

        if(!email || !password || !username){
            console.log(`Email or Username or Password missing: ${email}, ${username}, ${password}`)
            return res.sendStatus(400)
        }

        const existingUser = await getUserByEmail(email)
        
        if(existingUser){
            console.log("Email already exists!")
            return res.sendStatus(400)
        }

        const salt = random()
        const user = await createUser({
            email,
            username,
            authentication: {
                password: authentication(password, salt),
                salt
                
            }
        })

        return res.status(200).json(user).end()
    } catch (error) {
        console.log(`Oops. There is an error: ${error}`)
        return res.sendStatus(400)
    }
}