import express from 'express';
import dotenv from 'dotenv/config';
import cookieParser from 'cookie-parser';
import { createClientsTable } from '././database/clientBase.js';
import { createCompaniesTable } from '././database/companyBase.js';
const app = express();

app.use(express.json())
    .use(express.static('../client/public'))
    .use(express.urlencoded({ extended: true }))
    .use(cookieParser());

//                          ROUTERS...
import checkAuth from './middleware/checkAuth.js';
import login from './Routers/loginRouter.js';
import logout from './Routers/logoutRouter.js';
import company from './Routers/companyRouter.js';
import client from './Routers/clientRouter.js';
app
    .use('/login', login)
    .use('/logout', checkAuth, logout)
    .use('/clients', checkAuth, client)
    .use('/companies', checkAuth, company)
    .get('/', (req, res) => {
        res.redirect('/login'); // Render dashboard or redirect to the login page if no valid token
    });
//                          ROUTERS ^

const PORT = process.env.PORT;
app.listen(PORT, async (error) => {
    if (error) {
        console.log("Error: ", error)
        return;
    }
    console.log("Server is running on port: ", PORT)
    await createClientsTable();
    await createCompaniesTable();
});
