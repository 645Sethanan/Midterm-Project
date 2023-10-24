const express = require('express');
const admin = require('./routes/admin')
const app = express();
const path = require('path')
const People =require('./models/people')

// Middleware สำหรับรับข้อมูลจาก request body แบบ JSON
app.use(express.json());

// Middleware สำหรับรับข้อมูลจาก form data
app.use(express.urlencoded({ extended: true }));

app.use(admin)

app.set('view engine','ejs')
app.use(express.static('public'));

app.get('/', (req, res)=> {
  res.render('index.ejs');
});

app.get('/register',(req,res)=>{
  res.render('register.ejs');
});

app.get('/admin',(req,res)=>{
  res.render('admin.ejs');
});

app.get('/login',(req,res)=>{
  res.sendFile(path.join(__dirname,'/views/login.html'));
});

// Route handler ที่ใช้ข้อมูลจาก request body
app.post('/submit', (req, res) => {
  const {username,password} = req.body;
  console.log('Received data from client:', username,password);
  if(username === 'root' && password === 'rootroot'){
    res.render('admin-create.ejs');  
  }
  else{
    res.redirect('/');
  }
});

app.get('/people',async(req,res)=>{
  const PEOPLE = await People.find();
  res.render('people.ejs',{people:PEOPLE});
});

app.listen(3000);