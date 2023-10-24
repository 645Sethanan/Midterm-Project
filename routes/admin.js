const express = require('express')
const router = express.Router()
const People = require('../models/people')
const multer = require('multer');
const path = require('path');

// ตั้งค่า multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/images'); // กำหนดโฟลเดอร์ที่รับไฟล์ที่อัปโหลด
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname)); // กำหนดชื่อไฟล์ที่จะถูกบันทึก
    }
  });
  
  // กำหนดการอัปโหลดโดยใช้ multer
  const upload = multer({
    storage: storage
  });



router.get('/create',(req,res)=>{
    res.render('admin-create.ejs')
})

router.get('/delete',async(req,res)=>{
    const PEOPLE = await People.find();
    res.render('admin-delete.ejs',{people:PEOPLE})
})

router.get('/update',async(req,res)=>{
    const PEOPLE = await People.find();
    res.render('admin-update.ejs',{people:PEOPLE})
})


router.post('/create/people',upload.single('image'),async(req,res)=>{
    let {name,qualification} = req.body
    console.log(req.body)
    try {
        // สร้างproductใหม่
          const newPeople = new People({
              name: name,
              image: req.file ? req.file.filename : null,
              qualification: qualification,
          });
          await newPeople.save(); // ใช้ await เพื่อรอให้ข้อมูลบันทึกเสร็จสมบูรณ์
              res.redirect('/');
              console.log('Create New porduct Success!!!');
    
      }catch (error) {
          console.error(error);
          res.status(500).send(error);
      }

})

router.post('/delete/people',async(req,res)=>{
    let {id} = req.body;
    try {
        await People.findByIdAndDelete(id);
        // ทำสิ่งที่คุณต้องการกับ deletedDocument
        res.redirect('/');
      } catch (error) {
        // จัดการข้อผิดพลาด
        console.log(error)
      }

});

router.post('/update/people', upload.single('image'), async (req, res) => {
    let { id, name, qualification} = req.body;

    // ตรวจสอบว่ามีไฟล์รูปถูกอัปโหลดหรือไม่
    let image = req.file ? req.file.filename : null;

    try {
        // สร้างออบเจ็กต์ใหม่ที่ต้องการอัปเดต
        const updatedPeople = {
            name: name,
            image: image,
            qualification: qualification,
        };

        // ใช้ findByIdAndUpdate() โดยไม่ระบุฟิลด์ _id ในออบเจ็กต์ที่ต้องการอัปเดต
        await Product.findByIdAndUpdate(id, updatedPeople, { new: true });
        res.redirect('/')
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


module.exports = router