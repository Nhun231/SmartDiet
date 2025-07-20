const swaggerJsdoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const port = process.env.PORT
const applicationName = process.env.APPLICATION_NAME

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Smart Diet API Documentation',
            description: "API endpoints for SmartDiet website documented on swagger",
            contact: {
                name: "Smart Diet",
                email: "smartdietsystem@gmail.com",
                url: "https://github.com/Nhun231/SmartDiet.git"
            },
            version: '1.0.0',
        },
        servers: [
            {
                url: `https://smartdiet-np8j.onrender.com/${applicationName}`,
                description: "Local server"
            }
        ]
    },
    // looks for configuration in specified directories
    apis: ['./src/routes/*.js', './src/models/*.js', './src/controllers/*.js'],
}
const swaggerSpec = swaggerJsdoc(options)
function swaggerDocs(app, port) {
    // Swagger Page
    app.use(
        '/docs',
        swaggerUi.serve,
        swaggerUi.setup(
            swaggerSpec,
            { 
                explorer: true
            })
    )
    // Documentation in JSON format
    app.get('/docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json')
        res.send(swaggerSpec)
    })
}
module.exports = { swaggerDocs }