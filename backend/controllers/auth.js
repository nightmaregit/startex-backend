const query = require("../database");
const bcrypt = require('bcryptjs');
const { randomUUID } = require("crypto");

async function register(req, res) {
  const { nama, email, password } = req.body;
  if (
    nama === undefined ||
    nama === "" ||
    email === undefined ||
    email === "" ||
    password === undefined ||
    password === "" 
  )
    return res.status(400).json("Invalid data!");
  //if (password !== confPassword) return res.status(400).json("Password not match!");
  try {
    // logic handling
    const isDuplicate = await query(
      `
        SELECT id_anggota FROM tb_anggota WHERE nama = ? OR email = ? 
    `,
      [nama, email]
    );
    if (isDuplicate.length > 0) return res.status(400).json("User already exists!");
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const role = "anggota";

    await query(
      `
        INSERT INTO tb_anggota (
           nama, email, role, password,uuid
        ) VALUES (
          ?, ?, ?, ?,?
        );
    `,
      [ nama, email, role ,hashPassword,randomUUID()]
    );
    return res.status(200).json("Register success!");
  } catch (error) {
    return res.status(400).json("Bermasalah lur");
  }
}

async function registerAdmin(req, res) {
  const { nama, email, password } = req.body;

  try {
    // logic handling
    const isDuplicate = await query(
      `
        SELECT id_anggota FROM tb_anggota WHERE nama = ? OR email = ? 
    `,
      [nama, email]
    );
    if (isDuplicate.length > 0) return res.status(400).json("User already exists!");
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const role = "petugas";

    await query(
      `
        INSERT INTO tb_petugas (
           nama, email, role, uuid, password
        ) VALUES (
          ?, ?, ?, ?,?
        );
    `,
      [ nama, email, role , randomUUID(),hashPassword]
    );
    return res.status(200).json("Register success!");
  } catch (error) {
    return res.status(400).json("Bermasalah lur");
  }
}

async function login(req, res) {
  const {email,role,password,uuid} = req.body;
  try {
    const hai = await query(
      `
        SELECT uuid,nama, email,role,password FROM tb_anggota WHERE email = ? ; 
    `,
      [email,password]
    );
  // return res.status(200).json(hai[0].password);
   if (!hai) return res.status(404).json({msg: "user tidak ditemukan "});
  const match = await bcrypt.compare(password, hai[0].password);

 if(!match)return res.status(400).json({msg: "slh pw"});
    req.session.cobaf = hai[0].uuid;
    return res.status(200).json(hai);
  } catch (error) {
    return res.status(400).json("Something went wrong!");
  }
}



async function me(req, res) {
  const {uuid, nama, email, role} = req.body;
  const v123 = req.session.cobaf; 
  if(!req.session.cobaf){
    return res.status(401).json({msg: "login woy"});
}
  try {
    const hah = await query(
      `
      SELECT uuid, nama, email, role
      FROM tb_anggota
      WHERE uuid = ?;  
    `,
      [v123,nama,email,email,role]
    );
    if (!hah) return res.status(404).json({msg: "user tidak ditemukan "});
    return res.status(200).json(hah);
  } catch (error) {
    return res.status(400).json("Sini!");
  }
}

async function logout(req, res) {
  req.session.destroy((err)=>{
    if(err) return res.status(400).json({msg: "gak bisa keluar"});
    res.status(200).json({msg: "bsa keluar"});
});
}

async function verify(req, res,next) {
  const {uuid, nama, email, role} = req.body;
  const v123 = req.session.cobaf; 
  if(!req.session.cobaf){
    return res.status(401).json({msg: "login woy"});
}
  try {
    const hah = await query(
      `
      SELECT uuid
      FROM tb_anggota
      WHERE uuid = ?;  
    `,
      [v123,nama,email,email,role]
    );
    if (!hah) return res.status(404).json({msg: "user tidak ditemukan "});
    req.idAnggota = hah[0].id_anggota;
    req.role = hah[0].role;
    next();
  
  } catch (error) {
    return res.status(400).json("Sini!");
  }
}

async function petugasonly(req, res,next) {
  const {uuid, nama, email, role} = req.body;
  const v123 = req.session.cobaf; 
  if(!req.session.cobaf){
    return res.status(401).json({msg: "login woy"});
}
  try {
    const hah = await query(
      `
      SELECT uuid,role
      FROM tb_anggota
      WHERE uuid = ?;  
    `,
      [v123,nama,email,email,role]
    );
    
    if (!hah) return res.status(404).json({msg: "user tidak ditemukan "});

  //return res.status(200).json(hah[0].role);
   if(hah[0].role !== "admin") return res.status(403).json({msg: "Akses terlarang "});
   next();
  
  } catch (error) {
    return res.status(400).json("Sini!");
  }
}

async function coba(req, res) {
  const {uuid, nama, email, role} = req.body;
  try {
    const hai = await query(
      `
        SELECT * FROM tb_anggota  ; 
    `,
      [email]
    );

    return res.status(200).json(hai[0].id_anggota);
  } catch (error) {
    return res.status(400).json("Sini!");
  }
}

module.exports = {
  register,
  login,
  me,
  petugasonly,
  logout,
  verify,
  registerAdmin,
  coba
};
