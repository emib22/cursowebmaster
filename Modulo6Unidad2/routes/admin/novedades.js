var express = require('express');
var router = express.Router();
var novedadesModel = require('../../models/novedadesModel');


/* GET home page. */
router.get('/', async function (req, res, next) {

    //var novedades = await novedadesModel.getNovedades();

    var novedades 
    if (req.query.q === undefined) {
        novedades = await novedadesModel.getNovedades();
    } else {
        novedades = await novedadesModel.buscarNovedades(req.query.q);
    }

    res.render('admin/novedades', {
        layout: 'admin/layout',
        usuario: req.session.nombre, 
        novedades,
        is_search: req.query.q !== undefined,
        q: req.query.q

    });
});

router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;
    await novedadesModel.deleteNovedadesById(id);
    res.redirect('/admin/novedades');
});

router.get('/agregar', async (req, res, next) => {
    res.render('admin/agregar', {
        layout: 'admin/layout',
    }); //cierra render
}); //cierra get

/*insertar la novedad en la tabla*/ 

router.post('/agregar', async (req, res, next) =>{
    try {
        if (req.body.titulo != "" && req.body.subtitulo != "" && req.body.cuerpo != "") {
            await novedadesModel.insertNovedad(req.body);
            res.redirect('/admin/novedades')            
        } else {
            res.render ('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'todos los campos son requeridos'
            })
        }
    } catch (error) {
        console.log(error)
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se cargo la novedad'
        })
        
    }
})

/* para listar una sola novedad - by id */
router.get('/modificar/:id', async (req, res, next) => {
    var id = req.params.id;
    console.log(req.params.id);
    var novedad = await novedadesModel.getNovedadById(id);
    
    res.render('admin/modificar', {
        layout: 'admin/layout',
        novedad
    })

});

/*MODIFICANDO LA NOVEDAD */
router.post('/modificar', async (req, res, next) => {
    try {
       var obj = {
        titulo: req.body.titulo,
        subtitulo: req.body.subtitulo,
        cuerpo: req.body.cuerpo
       }

       console.log(obj)
       await novedadesModel.modificarNovedadById(obj, req.body.id);
       res.redirect('/admin/novedades');
    } catch (error) {
        console.log(error)
        res.render('admin/modificar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se modifico la novedad'
        })

    }
})

module.exports = router;