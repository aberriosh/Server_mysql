const express = require("express");
const app = express();


const mysql = require('mysql');
const cors = require("cors");

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  user:'root',
  host:'localhost',
  password:'password',
  database:'sellers_amazon'
})


//---------------------------- Seller ---------------------------
//Create
app.post('/seller/create',(req, res)=>{ 
  console.log(req)
  let activo = req.body.activo
  let cargo = req.body.cargo
  let contactname = req.body.contactname
  let dbaname = req.body.dbaname
  let ejecutivoamazon = req.body.ejecutivoamazon
  let email = req.body.email
  let fecha_creacion = req.body.fecha_creacion
  let id_cliente = req.body.id_cliente
  let legalname = req.body.legalname
  let tax_id = req.body.tax_id
  let telefono = req.body.telefono
  let tipocorporacion = req.body.tipocorporacion
  let website = req.body.website

  db.query(
    "INSERT INTO sellers (activo,cargo,contactname,dbaname,ejecutivoamazon,email,fecha_creacion,id_cliente,legalname,tax_id,telefono,tipocorporacion,website) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)",
    [activo,cargo,contactname,dbaname,ejecutivoamazon,email,fecha_creacion,id_cliente,legalname,tax_id,telefono,tipocorporacion,website],
  (err, result) => {
      if(err){
        console.log(err)
      }else{
        res.send("values inserted");
      }
  }
  );
});

//Read All
app.get('/sellers', (req, res)=>{
  db.query("SELECT * FROM sellers",(err,result)=>{
    if (err){
      console.log(err)
    }else{
      res.send(result)
    }
  });
});

//Read for ID
app.get(('/seller/byId'),(req,res)=>{
  console.log(req.query.id)
  let id =  req.query.id;
  db.query(
    "select * from sellers S join legaladdress L ON S._id =L.sellers__id WHERE S.id_cliente = ?",[id],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        console.log(result)
        res.send(result);
      }
    })
});

//edit 
app.put(('/seller/edit'),(req,res)=>{
  console.log(req.body)
  let id = req.body.id_cliente;
  let cargo = req.body.cargo
  let contactname = req.body.contactname
  let dbaname = req.body.dbaname
  let ejecutivoamazon = req.body.ejecutivoamazon
  let email = req.body.email
  let fecha_creacion = req.body.fecha_creacion
  let legalname = req.body.legalname
  let tax_id = req.body.tax_id
  let telefono = req.body.telefono
  let tipocorporacion = req.body.tipocorporacion
  let website = req.body.website

  db.query(
    "UPDATE sellers SET cargo = ?, contactname = ?, dbaname = ?, ejecutivoamazon = ?, email = ?, fecha_creacion = ?, legalname = ?, tax_id = ?, telefono = ?, tipocorporacion = ?, website = ? WHERE id_cliente = ?",
    [cargo, contactname, dbaname, ejecutivoamazon, email, fecha_creacion, legalname, tax_id, telefono, tipocorporacion, website, id],
    (err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.send(result)
    }
    }
  )
});



//-------------------------- address ------------------------------
// Create
app.post('/address/create',(req, res)=>{
  console.log(req)
  let barrio = req.body.barrio;
  let calle = req.body.calle;
  let ciudad = req.body.ciudad;
  let estado = req.body.estado;
  let numero = req.body.numero;
  let pais = req.body.pais;
  let zip = req.body.zip;
  db.query(
      "INSERT INTO legaladdress (barrio,calle,ciudad,estado,numero,pais,zip,sellers__id) VALUES (?,?,?,?,?,?,?,LAST_INSERT_ID()) ",
  [barrio,calle,ciudad,estado,numero,pais,zip],
  (err, result) => {
    if(err){
      console.log(err)
    }else{
      res.send("Values inserted");
    }
  }
  );
});

// Read for ID
app.get('/legaladdress/byId',(req, res)=>{
  let id =  req.query.id;
  db.query(
    "SELECT * FROM legaladdress WHERE sellers__id = ?",[id],
  (err, result) => {
    if(err){
        console.log(err)
    }else{
        res.send(result);
    }
  }
  );
});

//Update 
app.put('/legaladdress/edit',(req,res)=>{
  let id = req.body.id;
  let barrio = req.body.barrio;
  let calle = req.body.calle;
  let ciudad = req.body.ciudad;
  let estado = req.body.estado;
  let numero = req.body.numero;
  let pais = req.body.pais;
  let zip = req.body.zip;
  db.query(
    "UPDATE legaladdress SET barrio = ?, calle = ?, ciudad = ?, estado = ?, numero = ?, pais = ?, zip = ? WHERE sellers__id = ?",
    [barrio,calle,ciudad,estado,numero,pais,zip,id],
    (err, result) => {
      if(err){
        console.log(err)
      }else{
        res.send(result)
      }
    }
  );
});




//------------------------------ Pickup --------------------------
//read
app.get('/pickup',(req,res)=>{
  console.log( req.query.id)
  let id = req.query.id;
  db.query(
      `select
        p.idpickup, 
        P.barrio,
        P.calle,
        P.ciudad,
        P.estado,
        P.numero,
        P.pais,
        P.zip
      from pickup P join sellers S on P.sellers__id = S._id where S.id_cliente = ?`,[id],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send(result);
      }
    })
})

// Create
app.post('/pickup/create',(req,res)=>{
  console.log(req.body.id)
  let id = req.body.id
  let barrio = req.body.barrio
  let calle = req.body.calle
  let ciudad = req.body.ciudad
  let estado = req.body.estado
  let numero = req.body.numero
  let pais = req.body.pais
  let zip = req.body.zip
  let qy = `INSERT INTO pickup 
              (barrio,calle,ciudad,estado,numero,pais,zip,sellers__id)
	          VALUES (?,?,?,?,?,?,?,
              (select _id from sellers where id_cliente = ?))`;
  db.query(qy,
    [barrio,calle,ciudad,estado,numero,pais,zip,id],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send("Value inserted")
      }
    }
  )
})

// Edit
app.put('/pickup/edit',(req,res)=>{
  let id = req.body.id;
  let barrio = req.body.barrio;
  let calle = req.body.calle;
  let ciudad = req.body.ciudad;
  let estado = req.body.estado;
  let numero = req.body.numero;
  let pais = req.body.pais;
  let zip = req.body.zip;
  db.query("UPDATE pickup SET barrio = ?, calle = ?, ciudad = ?, estado = ?, numero = ?, pais = ?, zip = ? WHERE sellers__id = ?",
  [barrio,calle,ciudad,estado,numero,pais,zip,id]
  )})

// Delete
app.delete('/pickup/delete',(req,res)=>{
  let id = req.query.id;
  db.query("DELETE FROM pickup WHERE idpickup = ?",
  (err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.send("Value delete")
    }
  }
  )
})



//------------------------------- Dun ------------------------------------
// Read all
app.get('/dun',(req,res)=>{
  db.query('SELECT * FROM duns',
  (err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.send(result)
    }
  });
});

//Read Id
app.get('/dun/byId',(req,res)=>{
  console.log(req.query.id)
  let id = req.query.id;
  db.query(
    "SELECT * FROM duns WHERE idcliente = ?",
    [id],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send(result)
      }
    })

})

//Create 
app.post('/dun/create',(req,res)=>{
  let rgcompanyname = req.body.rgcompanyname
  let rginitial = req.body.rginitial
  let rgaddress = req.body.rgaddress
  let rgcity = req.body.rgcity
  let rgstate = req.body.rgstate
  let rgcountry= req.body.rgcountry
  let rgzipcode= req.body.rgzipcode
  let rgphone= req.body.rgphone
  let rgceoname= req.body.rgceoname
  let rgemail= req.body.rgemail
  let rgstructure= req.body.rgstructure
  let rgyearcreated = req.body.rgyearcreated
  let rgareabussines = req.body.rgareabussines
  let rgnumberemployers = req.body.rgnumberemployers
  let idcliente = req.body.idcliente
  let idpn= req.body.idpn
  let daterequest= req.body.daterequest
  let status= req.body.status
  let pago = req.body.pago
  db.query(`INSERT INTO duns 
            (rgcompanyname,
            rginitial,
            rgaddress,
            rgcity,
            rgstate,
            rgzipcode,
            rgphone,
            rgceoname,
            rgemail,
            rgstructure,
            rgcountry,
            rgyearcreated,
            rgareabussines,
            rgnumberemployers,
            idcliente,
            daterequest,
            status,
            pago,
            sellers__id)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [rgcompanyname,rginitial,rgaddress,rgcity,rgstate,
      rgcountry,rgzipcode,rgphone,rgceoname,rgemail,
      rgstructure,rgyearcreated,rgareabussines,
      rgnumberemployers,idcliente,daterequest,
      status,pago,idpn],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send("Values inserted")
      }
    })
})

// Delete
app.delete('/dun/delete',(req,res)=>{
  let id = req.query.id;
  db.query('DELETE FROM duns WHERE idduns = ?',
  [id],
  (err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.send("values delete")
    }
  })
})

//------------------------------- FSVP ------------------------------------

//Read Id
app.get('/fsvp/byId',(req,res)=>{
  console.log(req.query.id)
  let id = req.query.id;
  let sql = `select  F.idFSVP,
              F.companyname,
              F.companyaddress,
              F.companycreationdate,
              F.contactname,
              F.positioncompany,
              F.phone,
              F.cellphone,
              F.emergencycontact,
              F.phoneemegerncycontact,
              F.cellphoneemergencycontact,
              F.agentcompanyname,
              F.agentcontactaddress,
              F.agentname,
              F.agentcontactphone,
              F.fdanumber,
              F.producttype,
              F.sellers__id,
              F.pago,
              F.status
            from fsvp F join sellers S on S.id_cliente = ?`
  db.query(
    sql,
    [id],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        console.log(result)
        res.send(result)
      }
    })
})


//Create 
app.post('/fsvp/create',(req,res)=>{
  let cilegalcompanyname = req.body.cilegalcompanyname
  let ciaddress = req.body.ciaddress
  let cicontactname = req.body.cicontactname
  let ciphone = req.body.ciphone
  let cicellphone = req.body.cicellphone
  let ciauxcontact= req.body.ciauxcontact
  let ciauxphone= req.body.ciauxphone
  let ciauxcellphone= req.body.ciauxcellphone
  let cititle= req.body.cititle
  let cidate= req.body.cidate
  let ciagentcompanyname= req.body.ciagentcompanyname
  let ciagentaddress = req.body.ciagentaddress
  let ciagentcontactname = req.body.ciagentcontactname
  let ciagentphone = req.body.ciagentphone
  let cifda = req.body.cifda
  let typeproduct= req.body.typeproduct
  let idpn= req.body.idpn
  let pago = req.body.pago
  let status = req.body.status

  db.query(`INSERT INTO fsvp
    (companyname,
    companyaddress,
    companycreationdate,
    contactname,
    positioncompany,
    phone,
    cellphone,
    emergencycontact,
    phoneemegerncycontact,
    cellphoneemergencycontact,
    agentcompanyname,
    agentcontactaddress,
    agentname,
    agentcontactphone,
    fdanumber,
    producttype,
    sellers__id,
    pago,
    status)
    VALUE (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [cilegalcompanyname,ciaddress,cicontactname,ciphone,cicellphone,
      ciauxcontact,ciauxphone,ciauxcellphone,cititle,cidate,
      ciagentcompanyname,ciagentaddress,ciagentcontactname,
      ciagentphone,cifda,typeproduct,
      idpn,pago,status],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send(result)
      }
    })
})

// Delete
app.delete('/fsvp/delete',(req,res)=>{
  let id = req.query.id;
  db.query('DELETE FROM fsvp WHERE idFSVP = ?',
  [id],
  (err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.send("values delete")
    }
  })
})


//------------------------------- Product  ------------------------------------

//Read Id
app.get('/product/byId',(req,res)=>{
  console.log(req.query.id)
  let id = req.query.id;
  let sql = `SELECT I.iditem_fsvp,
              I.productname, 
              I.productpackageformat,
              I.skullproduct
            from item_fsvp I 
            join fsvp F on I.FSVP_idFSVP = F.idFSVP 
            join sellers S on F.sellers__id = S._id
            where S.id_cliente = ?`
  db.query(sql,
    [id],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send(result)
      }
    })
})


//Create 
app.post('/product/create',(req,res)=>{
  let products = req.body.products;
  let fsvp = req.body.fsvp
  let arr = []
  products.forEach(element => {
    let aux = []
    aux.push(element.skuproducts)
    aux.push(element.nameproduct)
    aux.push(element.prestproduct)
    aux.push(fsvp)
    arr.push(aux)
  });

  db.query(`INSERT INTO item_fsvp
	  (skullproduct,
    productname,
    productpackageformat,
    FSVP_idFSVP)
    VALUE ?`,
    [arr],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send("Values inserted")
      }
    })
})

// Delete
app.delete('/product/delete',(req,res)=>{
  let id = req.query.id;
  db.query('DELETE FROM item_fsvp WHERE iditem_fsvp = ?',
  [id],
  (err,result)=>{
    if(err){
      console.log(err)
    }else{
      res.send("values delete")
    }
  })
})

//---------------------products-----------

app.get('/productregister/byId',(req,res)=>{
  console.log(req.query.id)
  let id = req.query.id;
  let sql = `select   P.description,
                      P.idproducts,
                      P.pais_origin,
                      P.price,
                      P.sellers__id,
                      P.sku,
                      P.weight,
                      P.upcnumber 
              from products P 
              join sellers S on P.sellers__id = S._id
              where S.id_cliente = ?`
  db.query(sql,
    [id],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send(result)
      }
    })
})


//-------create
app.post('/productregister/create',(req,res)=>{
  let description = req.body.shortdescription
  let price = req.body.fob
  let sku = req.body.sku
  let pais_origin = req.body.country_origin
  let upcnumber = req.body.upc_number
  let sellers__id= req.body.id_cliente
  let weight = req.body.weight
  db.query(`insert into products 
              (description,
              price,
              sku,
              pais_origin,
              upcnumber,
              weight,
              sellers__id)
            values (?,?,?,?,?,?,?)`,
    [description,price,sku,pais_origin,upcnumber,weight,sellers__id],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send("Values inserted")
      }
    })
})



//----------invoice

app.post('/invoice/create',(req,res)=>{
  let date = req.body.date
  let total = req.body.total
  db.query(`INSERT INTO invoice 
                (fecha,
                total)
            VALUE (?,?)`,
    [date,total],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send(result)
      }
    })
})


app.post('/invoice-middle/create',(req,res)=>{
  let products = req.body.arr
  let id = req.body.id_invoice
  let arr = []
  products.forEach(element=>{
    let aux = []
    aux.push(id)
    aux.push(element.id_product)
    aux.push(element.id_seller)
    aux.push(element.cant)
    arr.push(aux)
  });
  db.query(`INSERT INTO invoice_has_products 
      (invoice_idinvoice,
      products_idproducts,
      products_sellers__id,
      quantity)
      VALUE ?
    ON DUPLICATE KEY UPDATE
    quantity=VALUES(quantity)
    `,
    [arr],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send("Values inserted")
      }
    })
})

app.put('/invoice/edit',(req,res)=>{
  let total = req.body.total
  let idinvoice = req.body.id_invoice
  db.query(`UPDATE invoice SET
              total = ?
            WHERE idinvoice = ?`,
    [total,idinvoice],
    (err,result)=>{
      if(err){
        console.log(err)
      }else{
        res.send(result)
      }
    })
})


app.listen(3001,()=>{
    console.log("the server is running in the port 3001")
})




