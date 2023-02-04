
const express = require('express');
const bodyParser = require('body-parser');

const { getSubs } = require('./subtitles');
const { getSum } = require('./summarise')
const app = express();
const port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public/views');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.listen(port);
console.log('Server started at http://localhost:' + port);


app.get('/:url', async function(req,res) {
  const videoid = req.query.v;
  if (videoid) {
    try {
      getSubs(videoid).then(summary => {
        res.render('index',{summary:summary})
      }).catch(err => console.log(err))
      
    } catch(e) {
      console.log(e)
      res.render('invalid')
    }
    
    
  } else {
    res.render('invalid')
  }

  

})



