const mongoose = require('mongoose')
const mongoPath = 'mongodb+srv://dbUser:dbUser@cluster0.ujmlh.mongodb.net/<dbname>?retryWrites=true&w=majority';

module.exports = async () => {
  await mongoose.connect(mongoPath, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })

  return mongoose
}