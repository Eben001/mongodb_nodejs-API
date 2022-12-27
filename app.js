const { ObjectId } = require('bson')
const express = require('express')
const {connectToDb, getDb} = require('./db')


//init app & middleware
const app = express()
app.use(express.json())

//db connection 
let db
connectToDb((err) => {
    //only listen for request after successful connection to the db
    if(!err){
        app.listen(3000, () => {
            console.log('app listening on port 3000')
         })
    }
    db = getDb()
})



//routes
app.get('/books', (req, res) =>{
    //current page
    const page = req.query.p || 0
    const booksPerPage = 5
     

    let books = []

    db.collection('books')
    .find() //returns a cursor; use methods like toArray forEach to get document and do something with it 
    .sort({author: 1})
    .skip(page * booksPerPage)
    .limit(booksPerPage)
    .forEach(book => { 
         books.push  (book)})
    .then(() => {
        res.status(200).json(books)
    })
    .catch(() => {
        res.status(500).json({error: "Could not fetch the documents"})
    })

})


app.get('/books/:id', (req, res) =>{
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
    .findOne({_id: ObjectId(req.params.id)})
    .then(doc =>{
        res.status(200).json(doc)
    })
    .catch(err =>{
        res.status(500).json({error: 'Could not fetch the documents'})
    })
    }else{
        res.status(500).json({error: "Not a valid document id"})
    } 
    
})

app.post('/books', (req, res) =>{
    const book = req.body
    
    db.collection('books')
    .insertOne(book)
    .then(result =>{
        res.status(201).json(result)
    })
    .catch(err =>{
        res.status(500).json({error: 'Could not create a new document'})
    })
})

app.delete('/books/:id', (req, res) =>{
    //const bookId = ObjectId(req.params.id)
    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .deleteOne({_id: ObjectId(req.params.id)})
        .then(result =>{
            res.status(201).json(result)
        })
        .catch(err =>{
            res.status(500).json({error: 'Could not delete this document'})
        })
    }else{
        res.status(500).json({error: "Not a valid document id"})
    }   

})

app.patch('/books/:id', (req, res) =>{
    const updates = req.body

    if(ObjectId.isValid(req.params.id)){
        db.collection('books')
        .updateOne({_id: ObjectId(req.params.id)}, {$set: updates})
        .then(result =>{
            res.status(200).json(result)
        })
        .catch(err =>{
            res.status(500).json({error: 'Could not update the document'})
        })
    }else{
        res.status(500).json({error: "Not a valid document id"})
    }   
})

