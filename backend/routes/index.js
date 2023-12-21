const express = require('express')
const router =express.Router()
const db = require('../data/database.js')
const { verify,petugasonly } = require("../controllers/auth");



const multer = require('multer');
const path = require('path')

// API DATA BUKU
router.get('/api/buku',(req, res)=>{
    const sql = "SELECT * FROM tb_buku"
    db.query(sql,(err, result)=>{
        if (err) throw err
       
        res.send(result)
    })
})

router.get("/api/buku/:id_buku", (req, res) => {
  const id = req.params.id_buku;
  const sql = `SELECT * FROM tb_buku WHERE id_buku = ${id}`;
  db.query(sql, (err, fild) => {
    // console.log(fild);
    res.send(fild);
  });
});



const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
});

// API untuk menyimpan data buku ke database
router.post('/api/buku', upload.single('cover_buku'),verify,petugasonly, (req, res) => {
  const {
    judul_buku,
    kode_buku,
    penerbit_buku,
    bahasa_buku,
    lokasi_buku,
    isbn_issn,
    jumlah_buku,
    ketersediaan,
    deskripsi,
  } = req.body;

  const cover_buku = req.file ? req.file.filename : null;

  // Query untuk menyimpan data buku ke tabel
  const query = `INSERT INTO tb_buku (judul_buku, kode_buku, penerbit_buku, bahasa_buku, lokasi_buku, isbn_issn, jumlah_buku, ketersediaan, cover_buku,deskripsi) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;

  db.query(
    query,
    [judul_buku, kode_buku, penerbit_buku, bahasa_buku, lokasi_buku, isbn_issn, jumlah_buku, ketersediaan, cover_buku, deskripsi],
    (err, result) => {
      if (err) {
        console.error('Gagal menyimpan data buku: ' + err.message);
        res.status(500).json({ error: 'Gagal menyimpan data buku' });
      } else {
        console.log('Data buku berhasil disimpan');
        res.status(200).json({ message: 'Data buku berhasil disimpan' });
      }
    }
  );
});






// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });
// const upload = multer({ storage: storage });

// router.post('/data-buku/tambah-buku/v1', (req, res) => {
//   console.log(req.body);
//   const id_buku= req.body.id_buku
//   const judul_buku = req.body.judul_buku;
//   const kode_buku = req.body.kode_buku;
//   const penerbit_buku = req.body.penerbit_buku;
//   const bahasa_buku = req.body.bahasa_buku;
//   const lokasi_buku = req.body.lokasi_buku;
//   const isbn_issn = req.body.isbn_issn;
//   const jumlah_buku = req.body.jumlah_buku;
//   const ketersediaan = req.body.ketersediaan;
//   const cover_buku = req.file.cover_buku

//   const sql = "INSERT INTO tb_buku (id_buku, judul_buku, kode_buku, penerbit_buku, bahasa_buku, lokasi_buku, isbn_issn, jumlah_buku, ketersediaan,cover_buku) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?,?)";
//   const values = [id_buku, judul_buku, kode_buku, penerbit_buku, bahasa_buku, lokasi_buku, isbn_issn, jumlah_buku, ketersediaan,cover_buku];

//   db.query(sql, values, (err, result) => {
//   if (err) {
//     console.error("Error executing query:", err);
//     return res.status(500).json({ message: "Gagal menyimpan data ke database" });
//   }

//   console.log(result);

//   // Mengirim respons dengan ID yang baru saja dimasukkan
//   return res.status(200).json({ message: "Data berhasil disimpan ke database", insertedId: result.insertId });
// });
// });    

router.delete('/api/bu/:id', (req, res) => {
  const bookId = req.params.id;

  // Periksa apakah buku dengan ID tersebut ada di database
  const checkQuery = 'SELECT * FROM tb_buku WHERE id_buku = ?';
  db.query(checkQuery, [bookId], (checkError, checkResults) => {
    if (checkError) {
      console.error('Error checking book existence:', checkError);
      res.status(500).json({ error: 'Internal Server Error' });
    } else if (checkResults.length === 0) {
      // Buku dengan ID tersebut tidak ditemukan
      res.status(404).json({ error: 'Book not found' });
    } else {
      // Buku dengan ID ditemukan, lakukan penghapusan
      const deleteQuery = 'DELETE FROM buku WHERE id_buku = ?';
      db.query(deleteQuery, [bookId], (deleteError, deleteResults) => {
        if (deleteError) {
          console.error('Error deleting book:', deleteError);
          res.status(500).json({ error: 'Internal Server Error' });
        } else {
          // Penghapusan berhasil
          res.status(200).json({ message: 'Book deleted successfully' });
        }
      });
    }
  });
});





router.delete("/api/buku/:id_buku", (req, res) => {
  const id = req.params.id_buku; // Menggunakan req.params.id untuk mendapatkan ID dari URL

  const sql = "DELETE FROM tb_buku WHERE id_buku = ?";
  const values = [id];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error executing query:", err);
      return res
        .status(500)
        .json({ message: "Gagal menghapus data dari database" });
    }

    console.log(result);
    res.status(200).json({ message: "Data berhasil dihapus dari database" });
  });
})

  // API DATA ANGGOTA
  router.get('/data-anggota/v1',verify,petugasonly,(req, res)=>{
    const sql = "SELECT * FROM tb_anggota"
    db.query(sql,(err, result)=>{
        if (err) throw err
       
        res.send(result)
    })
})

router.get("/data-anggota/v1/:id_anggota", (req, res) => {
  const id = req.params.id_anggota;
  const sql = `SELECT * FROM tb_anggota WHERE id_anggota = ${id}`;
  db.query(sql, (err, fild) => {
    // console.log(fild);
    res.send(fild);
  });
});

// API DATA PEMINJAMAN
router.get('/data-peminjaman/v1',verify,petugasonly,(req, res)=>{
    const sql = "SELECT * FROM tb_peminjaman"
    db.query(sql,(err, result)=>{
        if (err) throw err
       
        res.send(result)
    })
})

router.get("/data-peminjaman/v1/:id_peminjaman", (req, res) => {
  const id = req.params.id_peminjaman;
  const sql = `SELECT * FROM tb_peminjaman WHERE id_peminjaman = ${id}`;
  db.query(sql, (err, fild) => {
    // console.log(fild);
    res.send(fild);
  });
});


// API DATA PENGEMBALIN
router.get('/data-pengembalian/v1',(req, res)=>{
  const sql = "SELECT * FROM tb_pengembalian"
  db.query(sql,(err, result)=>{
      if (err) throw err
     
      res.send(result)
  })
})

module.exports = router