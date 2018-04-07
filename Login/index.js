const express           = require('express');
const router            = express.Router();
const DatabaseConnector = require('../lib/DatabaseConnector');
const path              = require('path');
const cookie            = require('cookie');



var cookieGlobal;
var cookieValue

router.get('/', (req,res)=>{

		res.sendFile( path.join( __dirname , "form.html" ) );
		
		res.cookie('SoyUnaCookie','NoUser', { maxAge: 900000, httpOnly: true })

		
})

///////////////////////////////////////////////////Crear Usuario HTML ////////////////////////////////////////////////////////
router.get('/crearUsuario',(req,res)=>{
		
	cookieGlobal = cookie.parse(req.headers.cookie || '');
	cookieValue  = cookieGlobal.SoyUnaCookie;
	console.log(cookieValue);
	
	
	
	if (cookieValue == 'NoUser'){
			res.redirect('/Login');
			
	}else{
		res.sendFile( path.join( __dirname , "crearUsuario.html" ) );	
	}	 
	
});
///////////////////////////////////////////////////Crear Usuario Interaccion Base de Datos  /////////////////////////////////

router.post('/cUsuario',(req,res)=>{
		
	cookieGlobal = cookie.parse(req.headers.cookie || '');
	cookieValue  = cookieGlobal.SoyUnaCookie;
	console.log(cookieValue);
	
	if (cookieValue == 'NoUser'){
			res.redirect('/Login');
			
	}else{
		
	var conn = DatabaseConnector.getDatabaseConnection();
	
	var usuario  =req.body.username;
	var passw    =req.body.password;
	var email    =req.body.mail;
	  
	
	conn.insertUsuario('usuarios',{nombre:usuario, password: passw, mail:email});
	conn.close();									
				
	res.redirect('/Login/seUsuario');
					
					
	}	 
	
});

//////////////////////////////////////////////////////////////////////////////////////////////////////
router.post('/bBaseUsuario', (req,res)=>{
	
	var conn = DatabaseConnector.getDatabaseConnection();
	
	var usuario  =req.body.username;
	var passw    =req.body.password;
	
	var logDate = new Date();
  
	
	conn.findInCollection('usuarios',{nombre:usuario, password:passw},(cursor)=>{
		
		cursor.toArray((err,doc)=>{
				
			if(doc[0] == null){
					cursor.close();
					conn.close();
					res.render("NoUsuario",{noEncon:usuario});
					
					//res.write("<html>Usuario no encontrado</html>");
					//res.end();
				
			}else{
				
				
				cursor.close();
				
				//conn.insertLog('log',{nombre:usuario, logDate: logDate});
				/**************** FORMATEAR FECHA Y USUARIO  **************/
				
				var fechaformateada = new Date (logDate);
				var fechachingona   = fechaformateada.toDateString();
				var fechaSpliteada = fechachingona.split(" "); 
				console.log(fechachingona);
				
				conn.insertLog('logBueno',{nombre:usuario, mes:fechaSpliteada[1], dia:fechaSpliteada[2], anio:fechaSpliteada[3] , logDate: logDate});
				conn.close();
				/***********************************************************/
				
												
				var userName = doc[0].nombre;
				var userPass = doc[0].password;
				
				res.cookie('SoyUnaCookie',userName, { maxAge: 900000, httpOnly: true })
				
				//cookieGlobal = cookie.parse(req.headers.cookie || '');
				
				//cookieValue  = cookieGlobal.SoyUnaCookie;
				
				//console.log(cookieValue);
				
				res.redirect('/Login/seUsuario');
					
				
			}
			
		});
			
		
	});
		
});

router.get('/seUsuario',(req,res)=>{
		  
		//res.sendFile( path.join( __dirname , "usuario.html" ) );
		cookieGlobal = cookie.parse(req.headers.cookie || '');
		cookieValue  = cookieGlobal.SoyUnaCookie;
		console.log(cookieValue);
		if (cookieValue == 'NoUser'){
			res.redirect('/Login');
			
		}else{
			res.sendFile( path.join( __dirname , "usuario.html" ) );			
		}	
});

router.get('/quitarSession',(req,res)=>{
		
		res.clearCookie("SoyUnaCookie");
		req.session.destroy();
		res.redirect('/Login');
	
});

router.get('/editarDatos',(req,res)=>{
		
	cookieGlobal = cookie.parse(req.headers.cookie || '');
	cookieValue  = cookieGlobal.SoyUnaCookie;
	console.log(cookieValue);
	
	if (cookieValue == 'NoUser'){
			res.redirect('/Login');
			
	}else{
		var conn = DatabaseConnector.getDatabaseConnection();
		
		conn.findInCollection('usuarios',{nombre:cookieValue},(cursor)=>{
		
		cursor.toArray((err,doc)=>{
				
			if(doc[0] == null){
					cursor.close();
					conn.close();
					res.write("<html>Usuario no encontrado</html>");
					res.end();
				
			}else{
				cursor.close();
				conn.close();
												
				var userName = doc[0].nombre;
				var userPass = doc[0].password;
				var userMail = doc[0].mail;
				res.render('modificarUsuarios', { title: 'Edita a: '+userName, userPug: userName, passPug: userPass, mailPug: userMail});
					
			}
			
		});
			
		
	});
				
	}	 
	
});

router.post('/mUsuario', (req,res)=>{
	
	var usuario  =req.body.username;
	var passw    =req.body.password;
	var email     =req.body.mail;
	
	var conn = DatabaseConnector.getDatabaseConnection();
	
	conn.updateCollection('usuarios',{nombre:usuario}, {$set: {password: passw,mail: email}});
	conn.close();
	
	res.render('alert');
		
	
})

router.get('/log',(req,res)=>{
		
	var conn = DatabaseConnector.getDatabaseConnection();
    
    conn.findInCollection('logBueno',{}, (cursor)=>{
        
        if( cursor == null){
            conn.close();
            res.write("<html>No se encontraron registros</html>");
            res.end();
            
        }else{
    
            var str = "";
            cursor.each( (err,doc)=>{
                
                //console.log(doc);

                if( doc == null){
                    cursor.close();
                    conn.close();
					
					//console.log("Soy el string"+str);
                    //str.toString();
					
					res.render('fechaRegistros', {stringConTodo: str});
					
                }else{
                    				
					str = str + "<tr><td>" + doc.nombre + "</td>" + "<td>" + doc.mes + "</td>" + "<td>" + doc.dia + "</td>" + "<td>" + doc.anio + "</td>" + "<td>" + doc.logDate + "</td></tr>";              
                }
            });
        }
    });	
});

router.post('/filtroFecha', (req,res)=>{
	
	var mesDrop  =req.body.mes;
	var diaDrop  =req.body.dia;
	
	console.log(mesDrop);
	console.log(diaDrop);
	
	var conn = DatabaseConnector.getDatabaseConnection();
    
	if(diaDrop == "Solo Mes"){
		conn.findInCollection('logBueno',{mes:mesDrop}, (cursor)=>{
			
			if( cursor == null){
				conn.close();
				res.write("<html>No se encontraron registros</html>");
				res.end();
				
			}else{
		
				var str = "";
				cursor.each( (err,doc)=>{
					
					//console.log(doc);

					if( doc == null){
						cursor.close();
						conn.close();
						
						//console.log("Soy el string"+str);
						//str.toString();
						
						res.render('fechaRegistros', {stringConTodo: str});
						
					}else{
										
						str = str + "<tr><td>" + doc.nombre + "</td>" + "<td>" + doc.mes + "</td>" + "<td>" + doc.dia + "</td>" + "<td>" + doc.anio + "</td>" + "<td>" + doc.logDate + "</td></tr>";              
					}
				});
			}
		});	
		
		
	}else{
	
	
		conn.findInCollection('logBueno',{mes:mesDrop, dia:diaDrop}, (cursor)=>{
			
			if( cursor == null){
				conn.close();
				res.write("<html>No se encontraron registros</html>");
				res.end();
				
			}else{
		
				var str = "";
				cursor.each( (err,doc)=>{
					
					//console.log(doc);

					if( doc == null){
						cursor.close();
						conn.close();
						
						//console.log("Soy el string"+str);
						//str.toString();
						
						res.render('fechaRegistros', {stringConTodo: str});
						
					}else{
										
						str = str + "<tr><td>" + doc.nombre + "</td>" + "<td>" + doc.mes + "</td>" + "<td>" + doc.dia + "</td>" + "<td>" + doc.anio + "</td>" + "<td>" + doc.logDate + "</td></tr>";              
					}
				});
			}
		});	
	
	}
	
	
		
	
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


router.get('/Bootstrap',(req,res)=>{
		  
		res.render( path.join( __dirname , "bootstrap.pug" ) );		
});

 




module.exports = router;

