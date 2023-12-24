
import { Router } from 'express';
import passport from 'passport';
import { generateToken } from '../utils.js';

const githubRouter = Router();


githubRouter.get('/github', passport.authenticate('github', {scope: ['user:email']}), async(req,res) =>{
    
    res.send({status : 'success', message: 'user registered'})
});

githubRouter.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), async(req,res) =>{
 try {
    const email = req.user.email || (req.user._json && req.user._json.email) || '';
    const name = (req.user._json && req.user._json.first_name) || (req.user.displayName || req.user.username) || req.user.first_name || '';
    
    const userObject = {
        first_name: name,
        last_name: "Patiño",
        email,
        age: 18,
        role: 'USER'
    };

    console.log("github1")
    console.log(name)
    req.session.user = userObject;

    

    const accessToken = generateToken(userObject);
    console.log("Token login", accessToken)
    res.cookie('coderCookieToken', accessToken, {maxAge: 60 * 60 * 1000, httpOnly: true})
    
    res.redirect('/products');

 } catch (error) {
    console.error('Error en /github-callback:', error);
        // Envía una respuesta de error al cliente
        res.status(500).json({ status: 'error', message: 'Internal Server Error' });
 }

})

githubRouter.get('/current', (req, res) => {
    res.send(req.user);    
})


githubRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if(error) return res.status(500).send({ status: 'error', message: error.message });
        res.redirect('/login');
    })
})

export default githubRouter;






