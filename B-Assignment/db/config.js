const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://mnadeem:h1QaS5NNUx2zm2tM@cluster0.v4od3qa.mongodb.net/backend-Assignment', {
    useNewUrlParser: true
})

.then(() => console.log('MongoDb is Connected'))
.catch((err) => console.log(err))