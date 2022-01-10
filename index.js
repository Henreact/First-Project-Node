const { request, response } = require('express')
const express = require('express')
const uuid = require('uuid')

const app = express()
const port = 3001
app.use(express.json())


const users = []

/* Utilizando o Middleware conseguimos verificar dados antes da aplicação
assim podemos economizar código*/

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex(user => user.id === id)

    if (index < 0) {
        return response.status(404).json({ error: "User not found" })
    }

    request.userIndex = index
    request.userId = id
    next()
}

app.get('/users', (request, response) => {
    return response.json(users)
})

// We can add Try and catch in case of errors 

app.post('/users', (request, response) => {
try {   const { name, age } = request.body

    if ( age < 18) throw new Error("Only people over 18 are allowed.") // We can create an error 

    const user = { id: uuid.v4(), name, age }

    users.push(user)

    return response.status(201).json(user)

} catch(err) { 
    return response.status(500).json({error: err.message}) 
} finally { 
    console.log("All done") // After the code works, we can add a message or a config here
}
})

app.put('/users/:id', checkUserId, (request, response) => {
    const { name, age } = request.body
    const index = request.userIndex
    const id =  request.userId
    const updatedUser = { id, name, age }


    users[index] = updatedUser

    return response.json(updatedUser)
})

app.delete('/users/:id', checkUserId, (request, response) => {
    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})

app.listen(port, () => {
    console.log(`🚀 Server started on port ${port}`)
}
) 