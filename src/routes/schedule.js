const express = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs-extra');
const path = require('path');
const hbs = require('handlebars');
const { isAuthenticated } = require('../helpers/auth');
const router = express.Router();
const User = require('../models/User');
const Schedule = require('../models/Schedule');

/**
 * Muestra la página del horario.
 */
router.get('/schedule/:id', isAuthenticated, async (req, res) => {
    const admin = await User.findById(req.user.id);
    let id;
    if (!admin.admin) {
        id = req.user.id;
    } else {
        id = req.params.id;
    }
    const user = await Schedule.find({ user: id });
    user.forEach(async function (aux) {
        if (aux.active) {
            if (aux == null) {
                createSchedule(id);
                res.render('users/activities/schedule');
            } else {
                const fields = await scheduleInfo(aux);
                res.render('users/activities/schedule', fields);
            }
        }
    });
});

/**
 * Guarda "localmente" el horario. Este puede ser modificado.
 */
router.post('/schedule/local/:id', isAuthenticated, async (req, res) => {
    const {
        check_btn11, check_btn12, check_btn13, check_btn14, check_btn15,
        check_btn21, check_btn22, check_btn23, check_btn24, check_btn25,
        check_btn31, check_btn32, check_btn33, check_btn34, check_btn35,
        check_btn41, check_btn42, check_btn43, check_btn44, check_btn45,
        check_btn51, check_btn52, check_btn53, check_btn54, check_btn55,
        check_btn61, check_btn62, check_btn63, check_btn64, check_btn65,
        check_btn71, check_btn72, check_btn73, check_btn74, check_btn75,
        check_btn81, check_btn82, check_btn83, check_btn84, check_btn85,
        check_btn91, check_btn92, check_btn93, check_btn94, check_btn95,
        check_btna1, check_btna2, check_btna3, check_btna4, check_btna5,
        check_btnb1, check_btnb2, check_btnb3, check_btnb4, check_btnb5,
        check_btnc1, check_btnc2, check_btnc3, check_btnc4, check_btnc5,
        check_btnd1, check_btnd2, check_btnd3, check_btnd4, check_btnd5,
        hidden_check_btn11, hidden_check_btn12, hidden_check_btn13, hidden_check_btn14, hidden_check_btn15,
        hidden_check_btn21, hidden_check_btn22, hidden_check_btn23, hidden_check_btn24, hidden_check_btn25,
        hidden_check_btn31, hidden_check_btn32, hidden_check_btn33, hidden_check_btn34, hidden_check_btn35,
        hidden_check_btn41, hidden_check_btn42, hidden_check_btn43, hidden_check_btn44, hidden_check_btn45,
        hidden_check_btn51, hidden_check_btn52, hidden_check_btn53, hidden_check_btn54, hidden_check_btn55,
        hidden_check_btn61, hidden_check_btn62, hidden_check_btn63, hidden_check_btn64, hidden_check_btn65,
        hidden_check_btn71, hidden_check_btn72, hidden_check_btn73, hidden_check_btn74, hidden_check_btn75,
        hidden_check_btn81, hidden_check_btn82, hidden_check_btn83, hidden_check_btn84, hidden_check_btn85,
        hidden_check_btn91, hidden_check_btn92, hidden_check_btn93, hidden_check_btn94, hidden_check_btn95,
        hidden_check_btna1, hidden_check_btna2, hidden_check_btna3, hidden_check_btna4, hidden_check_btna5,
        hidden_check_btnb1, hidden_check_btnb2, hidden_check_btnb3, hidden_check_btnb4, hidden_check_btnb5,
        hidden_check_btnc1, hidden_check_btnc2, hidden_check_btnc3, hidden_check_btnc4, hidden_check_btnc5,
        hidden_check_btnd1, hidden_check_btnd2, hidden_check_btnd3, hidden_check_btnd4, hidden_check_btnd5,
        notes } = req.body;

    const id = req.user.id;

    const schedules = await Schedule.find({ user: id });
    let user = null;
    schedules.forEach(async function (aux) {
        if (aux.active) {
            user = aux;
        }
    });

    const field11 = check_btn11 == 'on', field12 = check_btn12 == 'on', field13 = check_btn13 == 'on', field14 = check_btn14 == 'on', field15 = check_btn15 == 'on',
        field21 = check_btn21 == 'on', field22 = check_btn22 == 'on', field23 = check_btn23 == 'on', field24 = check_btn24 == 'on', field25 = check_btn25 == 'on',
        field31 = check_btn31 == 'on', field32 = check_btn32 == 'on', field33 = check_btn33 == 'on', field34 = check_btn34 == 'on', field35 = check_btn35 == 'on',
        field41 = check_btn41 == 'on', field42 = check_btn42 == 'on', field43 = check_btn43 == 'on', field44 = check_btn44 == 'on', field45 = check_btn45 == 'on',
        field51 = check_btn51 == 'on', field52 = check_btn52 == 'on', field53 = check_btn53 == 'on', field54 = check_btn54 == 'on', field55 = check_btn55 == 'on',
        field61 = check_btn61 == 'on', field62 = check_btn62 == 'on', field63 = check_btn63 == 'on', field64 = check_btn64 == 'on', field65 = check_btn65 == 'on',
        field71 = check_btn71 == 'on', field72 = check_btn72 == 'on', field73 = check_btn73 == 'on', field74 = check_btn74 == 'on', field75 = check_btn75 == 'on',
        field81 = check_btn81 == 'on', field82 = check_btn82 == 'on', field83 = check_btn83 == 'on', field84 = check_btn84 == 'on', field85 = check_btn85 == 'on',
        field91 = check_btn91 == 'on', field92 = check_btn92 == 'on', field93 = check_btn93 == 'on', field94 = check_btn94 == 'on', field95 = check_btn95 == 'on',
        fielda1 = check_btna1 == 'on', fielda2 = check_btna2 == 'on', fielda3 = check_btna3 == 'on', fielda4 = check_btna4 == 'on', fielda5 = check_btna5 == 'on',
        fieldb1 = check_btnb1 == 'on', fieldb2 = check_btnb2 == 'on', fieldb3 = check_btnb3 == 'on', fieldb4 = check_btnb4 == 'on', fieldb5 = check_btnb5 == 'on',
        fieldc1 = check_btnc1 == 'on', fieldc2 = check_btnc2 == 'on', fieldc3 = check_btnc3 == 'on', fieldc4 = check_btnc4 == 'on', fieldc5 = check_btnc5 == 'on',
        fieldd1 = check_btnd1 == 'on', fieldd2 = check_btnd2 == 'on', fieldd3 = check_btnd3 == 'on', fieldd4 = check_btnd4 == 'on', fieldd5 = check_btnd5 == 'on';

    const statusField11 = hidden_check_btn11, statusField12 = hidden_check_btn12, statusField13 = hidden_check_btn13, statusField14 = hidden_check_btn14, statusField15 = hidden_check_btn15,
        statusField21 = hidden_check_btn21, statusField22 = hidden_check_btn22, statusField23 = hidden_check_btn23, statusField24 = hidden_check_btn24, statusField25 = hidden_check_btn25,
        statusField31 = hidden_check_btn31, statusField32 = hidden_check_btn32, statusField33 = hidden_check_btn33, statusField34 = hidden_check_btn34, statusField35 = hidden_check_btn35,
        statusField41 = hidden_check_btn41, statusField42 = hidden_check_btn42, statusField43 = hidden_check_btn43, statusField44 = hidden_check_btn44, statusField45 = hidden_check_btn45,
        statusField51 = hidden_check_btn51, statusField52 = hidden_check_btn52, statusField53 = hidden_check_btn53, statusField54 = hidden_check_btn54, statusField55 = hidden_check_btn55,
        statusField61 = hidden_check_btn61, statusField62 = hidden_check_btn62, statusField63 = hidden_check_btn63, statusField64 = hidden_check_btn64, statusField65 = hidden_check_btn65,
        statusField71 = hidden_check_btn71, statusField72 = hidden_check_btn72, statusField73 = hidden_check_btn73, statusField74 = hidden_check_btn74, statusField75 = hidden_check_btn75,
        statusField81 = hidden_check_btn81, statusField82 = hidden_check_btn82, statusField83 = hidden_check_btn83, statusField84 = hidden_check_btn84, statusField85 = hidden_check_btn85,
        statusField91 = hidden_check_btn91, statusField92 = hidden_check_btn92, statusField93 = hidden_check_btn93, statusField94 = hidden_check_btn94, statusField95 = hidden_check_btn95,
        statusFielda1 = hidden_check_btna1, statusFielda2 = hidden_check_btna2, statusFielda3 = hidden_check_btna3, statusFielda4 = hidden_check_btna4, statusFielda5 = hidden_check_btna5,
        statusFieldb1 = hidden_check_btnb1, statusFieldb2 = hidden_check_btnb2, statusFieldb3 = hidden_check_btnb3, statusFieldb4 = hidden_check_btnb4, statusFieldb5 = hidden_check_btnb5,
        statusFieldc1 = hidden_check_btnc1, statusFieldc2 = hidden_check_btnc2, statusFieldc3 = hidden_check_btnc3, statusFieldc4 = hidden_check_btnc4, statusFieldc5 = hidden_check_btnc5,
        statusFieldd1 = hidden_check_btnd1, statusFieldd2 = hidden_check_btnd2, statusFieldd3 = hidden_check_btnd3, statusFieldd4 = hidden_check_btnd4, statusFieldd5 = hidden_check_btnd5;

    const temporal = true;

    if (fullSchedule(check_btn11, check_btn12, check_btn13, check_btn14, check_btn15, check_btn21, check_btn22, check_btn23, check_btn24, check_btn25, check_btn31, check_btn32, check_btn33, check_btn34, check_btn35, check_btn41, check_btn42, check_btn43, check_btn44, check_btn45, check_btn51, check_btn52, check_btn53, check_btn54, check_btn55, check_btn61, check_btn62, check_btn63, check_btn64, check_btn65, check_btn71, check_btn72, check_btn73, check_btn74, check_btn75, check_btn81, check_btn82, check_btn83, check_btn84, check_btn85, check_btn91, check_btn92, check_btn93, check_btn94, check_btn95, check_btna1, check_btna2, check_btna3, check_btna4, check_btna5, check_btnb1, check_btnb2, check_btnb3, check_btnb4, check_btnb5, check_btnc1, check_btnc2, check_btnc3, check_btnc4, check_btnc5, check_btnd1, check_btnd2, check_btnd3, check_btnd4, check_btnd5)) {
        await Schedule.findByIdAndUpdate(user.id, {
            field11, field12, field13, field14, field15, field21, field22, field23, field24, field25, field31, field32, field33, field34, field35, field41, field42, field43, field44, field45, field51, field52, field53, field54, field55, field61, field62, field63, field64, field65, field71, field72, field73, field74, field75, field81, field82, field83, field84, field85, field91, field92, field93, field94, field95, fielda1, fielda2, fielda3, fielda4, fielda5, fieldb1, fieldb2, fieldb3, fieldb4, fieldb5, fieldc1, fieldc2, fieldc3, fieldc4, fieldc5, fieldd1, fieldd2, fieldd3, fieldd4, fieldd5, statusField11, statusField12, statusField13, statusField14, statusField15, statusField21, statusField22, statusField23, statusField24, statusField25, statusField31, statusField32, statusField33, statusField34, statusField35, statusField41, statusField42, statusField43, statusField44, statusField45, statusField51, statusField52, statusField53, statusField54, statusField55, statusField61, statusField62, statusField63, statusField64, statusField65, statusField71, statusField72, statusField73, statusField74, statusField75, statusField81, statusField82, statusField83, statusField84, statusField85, statusField91, statusField92, statusField93, statusField94, statusField95, statusFielda1, statusFielda2, statusFielda3, statusFielda4, statusFielda5, statusFieldb1, statusFieldb2, statusFieldb3, statusFieldb4, statusFieldb5, statusFieldc1, statusFieldc2, statusFieldc3, statusFieldc4, statusFieldc5, statusFieldd1, statusFieldd2, statusFieldd3, statusFieldd4, statusFieldd5, notes, temporal
        });
    }
    let link = '/schedule/' + id;
    res.redirect(link);
});

/**
 * Guarda el horario, de manera que este ya no puede ser modificado.
 */
router.post('/schedule/final/:id', isAuthenticated, async (req, res) => {
    const final = true, temporal = false;
    const id = req.user.id;
    const schedules = await Schedule.find({ user: id });
    let user = null;
    schedules.forEach(async function (aux) {
        if (aux.active) {
            user = aux;
        }
    });

    await Schedule.findByIdAndUpdate(user.id, { final, temporal });
    let link = '/schedule/' + id;
    res.redirect(link);
});

/**
 * Despliega una pagina que muestra todos los horarios que son permanentes. Por defecto muestra los horarios del ciclo actual.
 * Al hacer click sobre el nombre del usuario se navega hasta el horario y se despliega.
 */
router.get('/schedules', isAuthenticated, async (req, res) => {
    const user = await User.findById(req.user.id);

    if(user['admin']){
        const schedules = await Schedules(null);
        res.render('users/activities/schedules', schedules);
    } else{
        res.redirect('/');
    }
});

/**
 * Cambia el ciclo escolar al especificado.
 * 
 * Actualiza la página con los horarios del ciclo seleccionado.
 */
router.post('/schedules', isAuthenticated, async (req, res) => {
    const { periodInput, period } = req.body;
    if (periodInput != null) {
        if (periodInput.length > 0 && /^(Ago||Feb)\s(Ene||Jul)\s20\d\d$/.test(periodInput)) {
            await setPeriod(periodInput);
            res.redirect('/schedules');
        } else {
            req.flash('error_msg', 'Favor de escribir correctamente el ciclo.');
            res.redirect('/schedules');
        }
    } else if (period != null) {
        const schedules = await Schedules(period);
        res.render('users/activities/schedules', schedules);
    }
});

/**
 * 
 * Despliega un html para visualizar de manera diferente el horario especificado.
 * 
router.get('/schedule/:id/:id2', isAuthenticated, async (req, res) => {
    let id2 = req.params.id2;
    const user = await Schedule.findById(id2);
    const fields = await scheduleInfo(user);
    res.render('users/activities/schedule', fields);
});
*/
/**
 * Genera y descarga un documento PDF que contiene el horario especificado.
 */
router.post('/schedule/print/:id/:id2', isAuthenticated, async (req, res) => {
    const id = req.params.id2;
    const user = await Schedule.findById(id);

    let data = await printData(user);
    let fileName =  Math.round(Date.now() / 1000) + '.pdf';
    try {

        const browser = await puppeteer.launch();
        const page = await browser.newPage();

        const content = await compile('printSchedule.hbs', data)

        await page.setContent(content)
        await page.pdf({
            path: path.join('src', 'views', 'users', 'activities', 'print', 'pdfs', fileName),
            format: 'A4',
            landscape: true,
            printBackground: true
        });
        
        res.download(path.join('src', 'views', 'users', 'activities', 'print', 'pdfs', fileName), function (){
            fs.unlink(path.join('src', 'views', 'users', 'activities', 'print', 'pdfs', fileName));
        });
    } catch (e) {
        console.log(e)
    }
});

/**
 * Recibe el id de un usuario, si este no cuenta con un horario se crea.
 * Funcion asincrona.
 * @param {*} user 
 */
async function createSchedule(user) {
    let field11 = true, field12 = true, field13 = true, field14 = true, field15 = true,
        field21 = true, field22 = true, field23 = true, field24 = true, field25 = true,
        field31 = true, field32 = true, field33 = true, field34 = true, field35 = true,
        field41 = true, field42 = true, field43 = true, field44 = true, field45 = true,
        field51 = true, field52 = true, field53 = true, field54 = true, field55 = true,
        field61 = true, field62 = true, field63 = true, field64 = true, field65 = true,
        field71 = true, field72 = true, field73 = true, field74 = true, field75 = true,
        field81 = true, field82 = true, field83 = true, field84 = true, field85 = true,
        field91 = true, field92 = true, field93 = true, field94 = true, field95 = true,
        fielda1 = true, fielda2 = true, fielda3 = true, fielda4 = true, fielda5 = true,
        fieldb1 = true, fieldb2 = true, fieldb3 = true, fieldb4 = true, fieldb5 = true,
        fieldc1 = true, fieldc2 = true, fieldc3 = true, fieldc4 = true, fieldc5 = true,
        fieldd1 = true, fieldd2 = true, fieldd3 = true, fieldd4 = true, fieldd5 = true,
        statusField11 = 'Available', statusField12 = 'Available', statusField13 = 'Available', statusField14 = 'Available', statusField15 = 'Available',
        statusField21 = 'Available', statusField22 = 'Available', statusField23 = 'Available', statusField24 = 'Available', statusField25 = 'Available',
        statusField31 = 'Available', statusField32 = 'Available', statusField33 = 'Available', statusField34 = 'Available', statusField35 = 'Available',
        statusField41 = 'Available', statusField42 = 'Available', statusField43 = 'Available', statusField44 = 'Available', statusField45 = 'Available',
        statusField51 = 'Available', statusField52 = 'Available', statusField53 = 'Available', statusField54 = 'Available', statusField55 = 'Available',
        statusField61 = 'Available', statusField62 = 'Available', statusField63 = 'Available', statusField64 = 'Available', statusField65 = 'Available',
        statusField71 = 'Available', statusField72 = 'Available', statusField73 = 'Available', statusField74 = 'Available', statusField75 = 'Available',
        statusField81 = 'Available', statusField82 = 'Available', statusField83 = 'Available', statusField84 = 'Available', statusField85 = 'Available',
        statusField91 = 'Available', statusField92 = 'Available', statusField93 = 'Available', statusField94 = 'Available', statusField95 = 'Available',
        statusFielda1 = 'Available', statusFielda2 = 'Available', statusFielda3 = 'Available', statusFielda4 = 'Available', statusFielda5 = 'Available',
        statusFieldb1 = 'Available', statusFieldb2 = 'Available', statusFieldb3 = 'Available', statusFieldb4 = 'Available', statusFieldb5 = 'Available',
        statusFieldc1 = 'Available', statusFieldc2 = 'Available', statusFieldc3 = 'Available', statusFieldc4 = 'Available', statusFieldc5 = 'Available',
        statusFieldd1 = 'Available', statusFieldd2 = 'Available', statusFieldd3 = 'Available', statusFieldd4 = 'Available', statusFieldd5 = 'Available',
        date = Date.now(), notes = '', final = false, temporal = false, active = true;
    const schedule = new Schedule({ user, field11, field12, field13, field14, field15, field21, field22, field23, field24, field25, field31, field32, field33, field34, field35, field41, field42, field43, field44, field45, field51, field52, field53, field54, field55, field61, field62, field63, field64, field65, field71, field72, field73, field74, field75, field81, field82, field83, field84, field85, field91, field92, field93, field94, field95, fielda1, fielda2, fielda3, fielda4, fielda5, fieldb1, fieldb2, fieldb3, fieldb4, fieldb5, fieldc1, fieldc2, fieldc3, fieldc4, fieldc5, fieldd1, fieldd2, fieldd3, fieldd4, fieldd5, statusField11, statusField12, statusField13, statusField14, statusField15, statusField21, statusField22, statusField23, statusField24, statusField25, statusField31, statusField32, statusField33, statusField34, statusField35, statusField41, statusField42, statusField43, statusField44, statusField45, statusField51, statusField52, statusField53, statusField54, statusField55, statusField61, statusField62, statusField63, statusField64, statusField65, statusField71, statusField72, statusField73, statusField74, statusField75, statusField81, statusField82, statusField83, statusField84, statusField85, statusField91, statusField92, statusField93, statusField94, statusField95, statusFielda1, statusFielda2, statusFielda3, statusFielda4, statusFielda5, statusFieldb1, statusFieldb2, statusFieldb3, statusFieldb4, statusFieldb5, statusFieldc1, statusFieldc2, statusFieldc3, statusFieldc4, statusFieldc5, statusFieldd1, statusFieldd2, statusFieldd3, statusFieldd4, statusFieldd5, date, notes, final, temporal, active });

    await schedule.save();
}

/**
 * 
 * @param {*} user 
 * @param {*} period 
 */
async function createSchedule(user, period) {
    let field11 = true, field12 = true, field13 = true, field14 = true, field15 = true,
        field21 = true, field22 = true, field23 = true, field24 = true, field25 = true,
        field31 = true, field32 = true, field33 = true, field34 = true, field35 = true,
        field41 = true, field42 = true, field43 = true, field44 = true, field45 = true,
        field51 = true, field52 = true, field53 = true, field54 = true, field55 = true,
        field61 = true, field62 = true, field63 = true, field64 = true, field65 = true,
        field71 = true, field72 = true, field73 = true, field74 = true, field75 = true,
        field81 = true, field82 = true, field83 = true, field84 = true, field85 = true,
        field91 = true, field92 = true, field93 = true, field94 = true, field95 = true,
        fielda1 = true, fielda2 = true, fielda3 = true, fielda4 = true, fielda5 = true,
        fieldb1 = true, fieldb2 = true, fieldb3 = true, fieldb4 = true, fieldb5 = true,
        fieldc1 = true, fieldc2 = true, fieldc3 = true, fieldc4 = true, fieldc5 = true,
        fieldd1 = true, fieldd2 = true, fieldd3 = true, fieldd4 = true, fieldd5 = true,
        statusField11 = 'Available', statusField12 = 'Available', statusField13 = 'Available', statusField14 = 'Available', statusField15 = 'Available',
        statusField21 = 'Available', statusField22 = 'Available', statusField23 = 'Available', statusField24 = 'Available', statusField25 = 'Available',
        statusField31 = 'Available', statusField32 = 'Available', statusField33 = 'Available', statusField34 = 'Available', statusField35 = 'Available',
        statusField41 = 'Available', statusField42 = 'Available', statusField43 = 'Available', statusField44 = 'Available', statusField45 = 'Available',
        statusField51 = 'Available', statusField52 = 'Available', statusField53 = 'Available', statusField54 = 'Available', statusField55 = 'Available',
        statusField61 = 'Available', statusField62 = 'Available', statusField63 = 'Available', statusField64 = 'Available', statusField65 = 'Available',
        statusField71 = 'Available', statusField72 = 'Available', statusField73 = 'Available', statusField74 = 'Available', statusField75 = 'Available',
        statusField81 = 'Available', statusField82 = 'Available', statusField83 = 'Available', statusField84 = 'Available', statusField85 = 'Available',
        statusField91 = 'Available', statusField92 = 'Available', statusField93 = 'Available', statusField94 = 'Available', statusField95 = 'Available',
        statusFielda1 = 'Available', statusFielda2 = 'Available', statusFielda3 = 'Available', statusFielda4 = 'Available', statusFielda5 = 'Available',
        statusFieldb1 = 'Available', statusFieldb2 = 'Available', statusFieldb3 = 'Available', statusFieldb4 = 'Available', statusFieldb5 = 'Available',
        statusFieldc1 = 'Available', statusFieldc2 = 'Available', statusFieldc3 = 'Available', statusFieldc4 = 'Available', statusFieldc5 = 'Available',
        statusFieldd1 = 'Available', statusFieldd2 = 'Available', statusFieldd3 = 'Available', statusFieldd4 = 'Available', statusFieldd5 = 'Available',
        date = Date.now(), notes = '', final = false, temporal = false, active = true;
    const schedule = new Schedule({ user, period, field11, field12, field13, field14, field15, field21, field22, field23, field24, field25, field31, field32, field33, field34, field35, field41, field42, field43, field44, field45, field51, field52, field53, field54, field55, field61, field62, field63, field64, field65, field71, field72, field73, field74, field75, field81, field82, field83, field84, field85, field91, field92, field93, field94, field95, fielda1, fielda2, fielda3, fielda4, fielda5, fieldb1, fieldb2, fieldb3, fieldb4, fieldb5, fieldc1, fieldc2, fieldc3, fieldc4, fieldc5, fieldd1, fieldd2, fieldd3, fieldd4, fieldd5, statusField11, statusField12, statusField13, statusField14, statusField15, statusField21, statusField22, statusField23, statusField24, statusField25, statusField31, statusField32, statusField33, statusField34, statusField35, statusField41, statusField42, statusField43, statusField44, statusField45, statusField51, statusField52, statusField53, statusField54, statusField55, statusField61, statusField62, statusField63, statusField64, statusField65, statusField71, statusField72, statusField73, statusField74, statusField75, statusField81, statusField82, statusField83, statusField84, statusField85, statusField91, statusField92, statusField93, statusField94, statusField95, statusFielda1, statusFielda2, statusFielda3, statusFielda4, statusFielda5, statusFieldb1, statusFieldb2, statusFieldb3, statusFieldb4, statusFieldb5, statusFieldc1, statusFieldc2, statusFieldc3, statusFieldc4, statusFieldc5, statusFieldd1, statusFieldd2, statusFieldd3, statusFieldd4, statusFieldd5, date, notes, final, temporal, active });

    await schedule.save();
}

/**
 * Recibe el id de un usuario y lo busca en la base de datos.
 * (Tipo de horario, temporal o final. Casillas seleccionadas, color, notas)
 * @param {*} user 
 * @returns Todos los campos.
 */
async function scheduleInfo(user) {
    const field11 = user.field11, field12 = user.field12, field13 = user.field13, field14 = user.field14, field15 = user.field15,
        field21 = user.field21, field22 = user.field22, field23 = user.field23, field24 = user.field24, field25 = user.field25,
        field31 = user.field31, field32 = user.field32, field33 = user.field33, field34 = user.field34, field35 = user.field35,
        field41 = user.field41, field42 = user.field42, field43 = user.field43, field44 = user.field44, field45 = user.field45,
        field51 = user.field51, field52 = user.field52, field53 = user.field53, field54 = user.field54, field55 = user.field55,
        field61 = user.field61, field62 = user.field62, field63 = user.field63, field64 = user.field64, field65 = user.field65,
        field71 = user.field71, field72 = user.field72, field73 = user.field73, field74 = user.field74, field75 = user.field75,
        field81 = user.field81, field82 = user.field82, field83 = user.field83, field84 = user.field84, field85 = user.field85,
        field91 = user.field91, field92 = user.field92, field93 = user.field93, field94 = user.field94, field95 = user.field95,
        fielda1 = user.fielda1, fielda2 = user.fielda2, fielda3 = user.fielda3, fielda4 = user.fielda4, fielda5 = user.fielda5,
        fieldb1 = user.fieldb1, fieldb2 = user.fieldb2, fieldb3 = user.fieldb3, fieldb4 = user.fieldb4, fieldb5 = user.fieldb5,
        fieldc1 = user.fieldc1, fieldc2 = user.fieldc2, fieldc3 = user.fieldc3, fieldc4 = user.fieldc4, fieldc5 = user.fieldc5,
        fieldd1 = user.fieldd1, fieldd2 = user.fieldd2, fieldd3 = user.fieldd3, fieldd4 = user.fieldd4, fieldd5 = user.fieldd5,
        availableField11 = user.statusField11 === 'Available', availableField12 = user.statusField12 === 'Available', availableField13 = user.statusField13 === 'Available', availableField14 = user.statusField14 === 'Available', availableField15 = user.statusField15 === 'Available',
        availableField21 = user.statusField21 === 'Available', availableField22 = user.statusField22 === 'Available', availableField23 = user.statusField23 === 'Available', availableField24 = user.statusField24 === 'Available', availableField25 = user.statusField25 === 'Available',
        availableField31 = user.statusField31 === 'Available', availableField32 = user.statusField32 === 'Available', availableField33 = user.statusField33 === 'Available', availableField34 = user.statusField34 === 'Available', availableField35 = user.statusField35 === 'Available',
        availableField41 = user.statusField41 === 'Available', availableField42 = user.statusField42 === 'Available', availableField43 = user.statusField43 === 'Available', availableField44 = user.statusField44 === 'Available', availableField45 = user.statusField45 === 'Available',
        availableField51 = user.statusField51 === 'Available', availableField52 = user.statusField52 === 'Available', availableField53 = user.statusField53 === 'Available', availableField54 = user.statusField54 === 'Available', availableField55 = user.statusField55 === 'Available',
        availableField61 = user.statusField61 === 'Available', availableField62 = user.statusField62 === 'Available', availableField63 = user.statusField63 === 'Available', availableField64 = user.statusField64 === 'Available', availableField65 = user.statusField65 === 'Available',
        availableField71 = user.statusField71 === 'Available', availableField72 = user.statusField72 === 'Available', availableField73 = user.statusField73 === 'Available', availableField74 = user.statusField74 === 'Available', availableField75 = user.statusField75 === 'Available',
        availableField81 = user.statusField81 === 'Available', availableField82 = user.statusField82 === 'Available', availableField83 = user.statusField83 === 'Available', availableField84 = user.statusField84 === 'Available', availableField85 = user.statusField85 === 'Available',
        availableField91 = user.statusField91 === 'Available', availableField92 = user.statusField92 === 'Available', availableField93 = user.statusField93 === 'Available', availableField94 = user.statusField94 === 'Available', availableField95 = user.statusField95 === 'Available',
        availableFielda1 = user.statusFielda1 === 'Available', availableFielda2 = user.statusFielda2 === 'Available', availableFielda3 = user.statusFielda3 === 'Available', availableFielda4 = user.statusFielda4 === 'Available', availableFielda5 = user.statusFielda5 === 'Available',
        availableFieldb1 = user.statusFieldb1 === 'Available', availableFieldb2 = user.statusFieldb2 === 'Available', availableFieldb3 = user.statusFieldb3 === 'Available', availableFieldb4 = user.statusFieldb4 === 'Available', availableFieldb5 = user.statusFieldb5 === 'Available',
        availableFieldc1 = user.statusFieldc1 === 'Available', availableFieldc2 = user.statusFieldc2 === 'Available', availableFieldc3 = user.statusFieldc3 === 'Available', availableFieldc4 = user.statusFieldc4 === 'Available', availableFieldc5 = user.statusFieldc5 === 'Available',
        availableFieldd1 = user.statusFieldd1 === 'Available', availableFieldd2 = user.statusFieldd2 === 'Available', availableFieldd3 = user.statusFieldd3 === 'Available', availableFieldd4 = user.statusFieldd4 === 'Available', availableFieldd5 = user.statusFieldd5 === 'Available',
        unavailableField11 = user.statusField11 === 'Unavailable', unavailableField12 = user.statusField12 === 'Unavailable', unavailableField13 = user.statusField13 === 'Unavailable', unavailableField14 = user.statusField14 === 'Unavailable', unavailableField15 = user.statusField15 === 'Unavailable',
        unavailableField21 = user.statusField21 === 'Unavailable', unavailableField22 = user.statusField22 === 'Unavailable', unavailableField23 = user.statusField23 === 'Unavailable', unavailableField24 = user.statusField24 === 'Unavailable', unavailableField25 = user.statusField25 === 'Unavailable',
        unavailableField31 = user.statusField31 === 'Unavailable', unavailableField32 = user.statusField32 === 'Unavailable', unavailableField33 = user.statusField33 === 'Unavailable', unavailableField34 = user.statusField34 === 'Unavailable', unavailableField35 = user.statusField35 === 'Unavailable',
        unavailableField41 = user.statusField41 === 'Unavailable', unavailableField42 = user.statusField42 === 'Unavailable', unavailableField43 = user.statusField43 === 'Unavailable', unavailableField44 = user.statusField44 === 'Unavailable', unavailableField45 = user.statusField45 === 'Unavailable',
        unavailableField51 = user.statusField51 === 'Unavailable', unavailableField52 = user.statusField52 === 'Unavailable', unavailableField53 = user.statusField53 === 'Unavailable', unavailableField54 = user.statusField54 === 'Unavailable', unavailableField55 = user.statusField55 === 'Unavailable',
        unavailableField61 = user.statusField61 === 'Unavailable', unavailableField62 = user.statusField62 === 'Unavailable', unavailableField63 = user.statusField63 === 'Unavailable', unavailableField64 = user.statusField64 === 'Unavailable', unavailableField65 = user.statusField65 === 'Unavailable',
        unavailableField71 = user.statusField71 === 'Unavailable', unavailableField72 = user.statusField72 === 'Unavailable', unavailableField73 = user.statusField73 === 'Unavailable', unavailableField74 = user.statusField74 === 'Unavailable', unavailableField75 = user.statusField75 === 'Unavailable',
        unavailableField81 = user.statusField81 === 'Unavailable', unavailableField82 = user.statusField82 === 'Unavailable', unavailableField83 = user.statusField83 === 'Unavailable', unavailableField84 = user.statusField84 === 'Unavailable', unavailableField85 = user.statusField85 === 'Unavailable',
        unavailableField91 = user.statusField91 === 'Unavailable', unavailableField92 = user.statusField92 === 'Unavailable', unavailableField93 = user.statusField93 === 'Unavailable', unavailableField94 = user.statusField94 === 'Unavailable', unavailableField95 = user.statusField95 === 'Unavailable',
        unavailableFielda1 = user.statusFielda1 === 'Unavailable', unavailableFielda2 = user.statusFielda2 === 'Unavailable', unavailableFielda3 = user.statusFielda3 === 'Unavailable', unavailableFielda4 = user.statusFielda4 === 'Unavailable', unavailableFielda5 = user.statusFielda5 === 'Unavailable',
        unavailableFieldb1 = user.statusFieldb1 === 'Unavailable', unavailableFieldb2 = user.statusFieldb2 === 'Unavailable', unavailableFieldb3 = user.statusFieldb3 === 'Unavailable', unavailableFieldb4 = user.statusFieldb4 === 'Unavailable', unavailableFieldb5 = user.statusFieldb5 === 'Unavailable',
        unavailableFieldc1 = user.statusFieldc1 === 'Unavailable', unavailableFieldc2 = user.statusFieldc2 === 'Unavailable', unavailableFieldc3 = user.statusFieldc3 === 'Unavailable', unavailableFieldc4 = user.statusFieldc4 === 'Unavailable', unavailableFieldc5 = user.statusFieldc5 === 'Unavailable',
        unavailableFieldd1 = user.statusFieldd1 === 'Unavailable', unavailableFieldd2 = user.statusFieldd2 === 'Unavailable', unavailableFieldd3 = user.statusFieldd3 === 'Unavailable', unavailableFieldd4 = user.statusFieldd4 === 'Unavailable', unavailableFieldd5 = user.statusFieldd5 === 'Unavailable',
        uncertainField11 = user.statusField11 === 'Uncertain', uncertainField12 = user.statusField12 === 'Uncertain', uncertainField13 = user.statusField13 === 'Uncertain', uncertainField14 = user.statusField14 === 'Uncertain', uncertainField15 = user.statusField15 === 'Uncertain',
        uncertainField21 = user.statusField21 === 'Uncertain', uncertainField22 = user.statusField22 === 'Uncertain', uncertainField23 = user.statusField23 === 'Uncertain', uncertainField24 = user.statusField24 === 'Uncertain', uncertainField25 = user.statusField25 === 'Uncertain',
        uncertainField31 = user.statusField31 === 'Uncertain', uncertainField32 = user.statusField32 === 'Uncertain', uncertainField33 = user.statusField33 === 'Uncertain', uncertainField34 = user.statusField34 === 'Uncertain', uncertainField35 = user.statusField35 === 'Uncertain',
        uncertainField41 = user.statusField41 === 'Uncertain', uncertainField42 = user.statusField42 === 'Uncertain', uncertainField43 = user.statusField43 === 'Uncertain', uncertainField44 = user.statusField44 === 'Uncertain', uncertainField45 = user.statusField45 === 'Uncertain',
        uncertainField51 = user.statusField51 === 'Uncertain', uncertainField52 = user.statusField52 === 'Uncertain', uncertainField53 = user.statusField53 === 'Uncertain', uncertainField54 = user.statusField54 === 'Uncertain', uncertainField55 = user.statusField55 === 'Uncertain',
        uncertainField61 = user.statusField61 === 'Uncertain', uncertainField62 = user.statusField62 === 'Uncertain', uncertainField63 = user.statusField63 === 'Uncertain', uncertainField64 = user.statusField64 === 'Uncertain', uncertainField65 = user.statusField65 === 'Uncertain',
        uncertainField71 = user.statusField71 === 'Uncertain', uncertainField72 = user.statusField72 === 'Uncertain', uncertainField73 = user.statusField73 === 'Uncertain', uncertainField74 = user.statusField74 === 'Uncertain', uncertainField75 = user.statusField75 === 'Uncertain',
        uncertainField81 = user.statusField81 === 'Uncertain', uncertainField82 = user.statusField82 === 'Uncertain', uncertainField83 = user.statusField83 === 'Uncertain', uncertainField84 = user.statusField84 === 'Uncertain', uncertainField85 = user.statusField85 === 'Uncertain',
        uncertainField91 = user.statusField91 === 'Uncertain', uncertainField92 = user.statusField92 === 'Uncertain', uncertainField93 = user.statusField93 === 'Uncertain', uncertainField94 = user.statusField94 === 'Uncertain', uncertainField95 = user.statusField95 === 'Uncertain',
        uncertainFielda1 = user.statusFielda1 === 'Uncertain', uncertainFielda2 = user.statusFielda2 === 'Uncertain', uncertainFielda3 = user.statusFielda3 === 'Uncertain', uncertainFielda4 = user.statusFielda4 === 'Uncertain', uncertainFielda5 = user.statusFielda5 === 'Uncertain',
        uncertainFieldb1 = user.statusFieldb1 === 'Uncertain', uncertainFieldb2 = user.statusFieldb2 === 'Uncertain', uncertainFieldb3 = user.statusFieldb3 === 'Uncertain', uncertainFieldb4 = user.statusFieldb4 === 'Uncertain', uncertainFieldb5 = user.statusFieldb5 === 'Uncertain',
        uncertainFieldc1 = user.statusFieldc1 === 'Uncertain', uncertainFieldc2 = user.statusFieldc2 === 'Uncertain', uncertainFieldc3 = user.statusFieldc3 === 'Uncertain', uncertainFieldc4 = user.statusFieldc4 === 'Uncertain', uncertainFieldc5 = user.statusFieldc5 === 'Uncertain',
        uncertainFieldd1 = user.statusFieldd1 === 'Uncertain', uncertainFieldd2 = user.statusFieldd2 === 'Uncertain', uncertainFieldd3 = user.statusFieldd3 === 'Uncertain', uncertainFieldd4 = user.statusFieldd4 === 'Uncertain', uncertainFieldd5 = user.statusFieldd5 === 'Uncertain';

    const notes = user.notes, final = user.final, temporal = user.temporal, idUser = user.user, name = await getName(user.user), period = user.period, active = user.active, id = user.id;

    return {
        field11, field12, field13, field14, field15, field21, field22, field23, field24, field25,
        field31, field32, field33, field34, field35, field41, field42, field43, field44, field45,
        field51, field52, field53, field54, field55, field61, field62, field63, field64, field65,
        field71, field72, field73, field74, field75, field81, field82, field83, field84, field85,
        field91, field92, field93, field94, field95, fielda1, fielda2, fielda3, fielda4, fielda5,
        fieldb1, fieldb2, fieldb3, fieldb4, fieldb5, fieldc1, fieldc2, fieldc3, fieldc4, fieldc5,
        fieldd1, fieldd2, fieldd3, fieldd4, fieldd5,
        availableField11, availableField12, availableField13, availableField14, availableField15,
        availableField21, availableField22, availableField23, availableField24, availableField25,
        availableField31, availableField32, availableField33, availableField34, availableField35,
        availableField41, availableField42, availableField43, availableField44, availableField45,
        availableField51, availableField52, availableField53, availableField54, availableField55,
        availableField61, availableField62, availableField63, availableField64, availableField65,
        availableField71, availableField72, availableField73, availableField74, availableField75,
        availableField81, availableField82, availableField83, availableField84, availableField85,
        availableField91, availableField92, availableField93, availableField94, availableField95,
        availableFielda1, availableFielda2, availableFielda3, availableFielda4, availableFielda5,
        availableFieldb1, availableFieldb2, availableFieldb3, availableFieldb4, availableFieldb5,
        availableFieldc1, availableFieldc2, availableFieldc3, availableFieldc4, availableFieldc5,
        availableFieldd1, availableFieldd2, availableFieldd3, availableFieldd4, availableFieldd5,
        unavailableField11, unavailableField12, unavailableField13, unavailableField14, unavailableField15,
        unavailableField21, unavailableField22, unavailableField23, unavailableField24, unavailableField25,
        unavailableField31, unavailableField32, unavailableField33, unavailableField34, unavailableField35,
        unavailableField41, unavailableField42, unavailableField43, unavailableField44, unavailableField45,
        unavailableField51, unavailableField52, unavailableField53, unavailableField54, unavailableField55,
        unavailableField61, unavailableField62, unavailableField63, unavailableField64, unavailableField65,
        unavailableField71, unavailableField72, unavailableField73, unavailableField74, unavailableField75,
        unavailableField81, unavailableField82, unavailableField83, unavailableField84, unavailableField85,
        unavailableField91, unavailableField92, unavailableField93, unavailableField94, unavailableField95,
        unavailableFielda1, unavailableFielda2, unavailableFielda3, unavailableFielda4, unavailableFielda5,
        unavailableFieldb1, unavailableFieldb2, unavailableFieldb3, unavailableFieldb4, unavailableFieldb5,
        unavailableFieldc1, unavailableFieldc2, unavailableFieldc3, unavailableFieldc4, unavailableFieldc5,
        unavailableFieldd1, unavailableFieldd2, unavailableFieldd3, unavailableFieldd4, unavailableFieldd5,
        uncertainField11, uncertainField12, uncertainField13, uncertainField14, uncertainField15,
        uncertainField21, uncertainField22, uncertainField23, uncertainField24, uncertainField25,
        uncertainField31, uncertainField32, uncertainField33, uncertainField34, uncertainField35,
        uncertainField41, uncertainField42, uncertainField43, uncertainField44, uncertainField45,
        uncertainField51, uncertainField52, uncertainField53, uncertainField54, uncertainField55,
        uncertainField61, uncertainField62, uncertainField63, uncertainField64, uncertainField65,
        uncertainField71, uncertainField72, uncertainField73, uncertainField74, uncertainField75,
        uncertainField81, uncertainField82, uncertainField83, uncertainField84, uncertainField85,
        uncertainField91, uncertainField92, uncertainField93, uncertainField94, uncertainField95,
        uncertainFielda1, uncertainFielda2, uncertainFielda3, uncertainFielda4, uncertainFielda5,
        uncertainFieldb1, uncertainFieldb2, uncertainFieldb3, uncertainFieldb4, uncertainFieldb5,
        uncertainFieldc1, uncertainFieldc2, uncertainFieldc3, uncertainFieldc4, uncertainFieldc5,
        uncertainFieldd1, uncertainFieldd2, uncertainFieldd3, uncertainFieldd4, uncertainFieldd5,
        notes, final, temporal, name, period, idUser, id, active
    };
}

async function printData(user) {
    let statusField11 = user.statusField11, statusField12 = user.statusField12, statusField13 = user.statusField13, statusField14 = user.statusField14, statusField15 = user.statusField15,
        statusField21 = user.statusField21, statusField22 = user.statusField22, statusField23 = user.statusField23, statusField24 = user.statusField24, statusField25 = user.statusField25,
        statusField31 = user.statusField31, statusField32 = user.statusField32, statusField33 = user.statusField33, statusField34 = user.statusField34, statusField35 = user.statusField35,
        statusField41 = user.statusField41, statusField42 = user.statusField42, statusField43 = user.statusField43, statusField44 = user.statusField44, statusField45 = user.statusField45,
        statusField51 = user.statusField51, statusField52 = user.statusField52, statusField53 = user.statusField53, statusField54 = user.statusField54, statusField55 = user.statusField55,
        statusField61 = user.statusField61, statusField62 = user.statusField62, statusField63 = user.statusField63, statusField64 = user.statusField64, statusField65 = user.statusField65,
        statusField71 = user.statusField71, statusField72 = user.statusField72, statusField73 = user.statusField73, statusField74 = user.statusField74, statusField75 = user.statusField75,
        statusField81 = user.statusField81, statusField82 = user.statusField82, statusField83 = user.statusField83, statusField84 = user.statusField84, statusField85 = user.statusField85,
        statusField91 = user.statusField91, statusField92 = user.statusField92, statusField93 = user.statusField93, statusField94 = user.statusField94, statusField95 = user.statusField95,
        statusFielda1 = user.statusFielda1, statusFielda2 = user.statusFielda2, statusFielda3 = user.statusFielda3, statusFielda4 = user.statusFielda4, statusFielda5 = user.statusFielda5,
        statusFieldb1 = user.statusFieldb1, statusFieldb2 = user.statusFieldb2, statusFieldb3 = user.statusFieldb3, statusFieldb4 = user.statusFieldb4, statusFieldb5 = user.statusFieldb5,
        statusFieldc1 = user.statusFieldc1, statusFieldc2 = user.statusFieldc2, statusFieldc3 = user.statusFieldc3, statusFieldc4 = user.statusFieldc4, statusFieldc5 = user.statusFieldc5,
        statusFieldd1 = user.statusFieldd1, statusFieldd2 = user.statusFieldd2, statusFieldd3 = user.statusFieldd3, statusFieldd4 = user.statusFieldd4, statusFieldd5 = user.statusFieldd5,
        notes = user.notes, name = await getName(user.user), period = user.period;

    let field11, field12, field13, field14, field15, field21, field22, field23, field24, field25,
        field31, field32, field33, field34, field35, field41, field42, field43, field44, field45,
        field51, field52, field53, field54, field55, field61, field62, field63, field64, field65,
        field71, field72, field73, field74, field75, field81, field82, field83, field84, field85,
        field91, field92, field93, field94, field95, fielda1, fielda2, fielda3, fielda4, fielda5,
        fieldb1, fieldb2, fieldb3, fieldb4, fieldb5, fieldc1, fieldc2, fieldc3, fieldc4, fieldc5,
        fieldd1, fieldd2, fieldd3, fieldd4, fieldd5;

    if (statusField11 === 'Available') {
        field11 = '✓';
    } else if (statusField11 === 'Unavailable') {
        field11 = '✗';
    } else if (statusField11 === 'Uncertain') {
        field11 = '?';
    }
    if (statusField12 === 'Available') {
        field12 = '✓';
    } else if (statusField12 === 'Unavailable') {
        field12 = '✗';
    } else if (statusField12 === 'Uncertain') {
        field12 = '?';
    }
    if (statusField13 === 'Available') {
        field13 = '✓';
    } else if (statusField13 === 'Unavailable') {
        field13 = '✗';
    } else if (statusField13 === 'Uncertain') {
        field13 = '?';
    }
    if (statusField14 === 'Available') {
        field14 = '✓';
    } else if (statusField14 === 'Unavailable') {
        field14 = '✗';
    } else if (statusField14 === 'Uncertain') {
        field14 = '?';
    }
    if (statusField15 === 'Available') {
        field15 = '✓';
    } else if (statusField15 === 'Unavailable') {
        field15 = '✗';
    } else if (statusField15 === 'Uncertain') {
        field15 = '?';
    }
    if (statusField21 === 'Available') {
        field21 = '✓';
    } else if (statusField21 === 'Unavailable') {
        field21 = '✗';
    } else if (statusField21 === 'Uncertain') {
        field21 = '?';
    }
    if (statusField22 === 'Available') {
        field22 = '✓';
    } else if (statusField22 === 'Unavailable') {
        field22 = '✗';
    } else if (statusField22 === 'Uncertain') {
        field22 = '?';
    }
    if (statusField23 === 'Available') {
        field23 = '✓';
    } else if (statusField23 === 'Unavailable') {
        field23 = '✗';
    } else if (statusField23 === 'Uncertain') {
        field23 = '?';
    }
    if (statusField24 === 'Available') {
        field24 = '✓';
    } else if (statusField24 === 'Unavailable') {
        field24 = '✗';
    } else if (statusField24 === 'Uncertain') {
        field24 = '?';
    }
    if (statusField25 === 'Available') {
        field25 = '✓';
    } else if (statusField25 === 'Unavailable') {
        field25 = '✗';
    } else if (statusField25 === 'Uncertain') {
        field25 = '?';
    }
    if (statusField31 === 'Available') {
        field31 = '✓';
    } else if (statusField31 === 'Unavailable') {
        field31 = '✗';
    } else if (statusField31 === 'Uncertain') {
        field31 = '?';
    }
    if (statusField32 === 'Available') {
        field32 = '✓';
    } else if (statusField32 === 'Unavailable') {
        field32 = '✗';
    } else if (statusField32 === 'Uncertain') {
        field32 = '?';
    }
    if (statusField33 === 'Available') {
        field33 = '✓';
    } else if (statusField33 === 'Unavailable') {
        field33 = '✗';
    } else if (statusField33 === 'Uncertain') {
        field33 = '?';
    }
    if (statusField34 === 'Available') {
        field34 = '✓';
    } else if (statusField34 === 'Unavailable') {
        field34 = '✗';
    } else if (statusField34 === 'Uncertain') {
        field34 = '?';
    }
    if (statusField35 === 'Available') {
        field35 = '✓';
    } else if (statusField35 === 'Unavailable') {
        field35 = '✗';
    } else if (statusField35 === 'Uncertain') {
        field35 = '?';
    }
    if (statusField41 === 'Available') {
        field41 = '✓';
    } else if (statusField41 === 'Unavailable') {
        field41 = '✗';
    } else if (statusField41 === 'Uncertain') {
        field41 = '?';
    }
    if (statusField42 === 'Available') {
        field42 = '✓';
    } else if (statusField42 === 'Unavailable') {
        field42 = '✗';
    } else if (statusField42 === 'Uncertain') {
        field42 = '?';
    }
    if (statusField43 === 'Available') {
        field43 = '✓';
    } else if (statusField43 === 'Unavailable') {
        field43 = '✗';
    } else if (statusField43 === 'Uncertain') {
        field43 = '?';
    }
    if (statusField44 === 'Available') {
        field44 = '✓';
    } else if (statusField44 === 'Unavailable') {
        field44 = '✗';
    } else if (statusField44 === 'Uncertain') {
        field44 = '?';
    }
    if (statusField45 === 'Available') {
        field45 = '✓';
    } else if (statusField45 === 'Unavailable') {
        field45 = '✗';
    } else if (statusField45 === 'Uncertain') {
        field45 = '?';
    }
    if (statusField51 === 'Available') {
        field51 = '✓';
    } else if (statusField51 === 'Unavailable') {
        field51 = '✗';
    } else if (statusField51 === 'Uncertain') {
        field51 = '?';
    }
    if (statusField52 === 'Available') {
        field52 = '✓';
    } else if (statusField52 === 'Unavailable') {
        field52 = '✗';
    } else if (statusField52 === 'Uncertain') {
        field52 = '?';
    }
    if (statusField53 === 'Available') {
        field53 = '✓';
    } else if (statusField53 === 'Unavailable') {
        field53 = '✗';
    } else if (statusField53 === 'Uncertain') {
        field53 = '?';
    }
    if (statusField54 === 'Available') {
        field54 = '✓';
    } else if (statusField54 === 'Unavailable') {
        field54 = '✗';
    } else if (statusField54 === 'Uncertain') {
        field54 = '?';
    }
    if (statusField55 === 'Available') {
        field55 = '✓';
    } else if (statusField55 === 'Unavailable') {
        field55 = '✗';
    } else if (statusField55 === 'Uncertain') {
        field55 = '?';
    }
    if (statusField61 === 'Available') {
        field61 = '✓';
    } else if (statusField61 === 'Unavailable') {
        field61 = '✗';
    } else if (statusField61 === 'Uncertain') {
        field61 = '?';
    }
    if (statusField62 === 'Available') {
        field62 = '✓';
    } else if (statusField62 === 'Unavailable') {
        field62 = '✗';
    } else if (statusField62 === 'Uncertain') {
        field62 = '?';
    }
    if (statusField63 === 'Available') {
        field63 = '✓';
    } else if (statusField63 === 'Unavailable') {
        field63 = '✗';
    } else if (statusField63 === 'Uncertain') {
        field63 = '?';
    }
    if (statusField64 === 'Available') {
        field64 = '✓';
    } else if (statusField64 === 'Unavailable') {
        field64 = '✗';
    } else if (statusField64 === 'Uncertain') {
        field64 = '?';
    }
    if (statusField65 === 'Available') {
        field65 = '✓';
    } else if (statusField65 === 'Unavailable') {
        field65 = '✗';
    } else if (statusField65 === 'Uncertain') {
        field65 = '?';
    }
    if (statusField71 === 'Available') {
        field71 = '✓';
    } else if (statusField71 === 'Unavailable') {
        field71 = '✗';
    } else if (statusField71 === 'Uncertain') {
        field71 = '?';
    }
    if (statusField72 === 'Available') {
        field72 = '✓';
    } else if (statusField72 === 'Unavailable') {
        field72 = '✗';
    } else if (statusField72 === 'Uncertain') {
        field72 = '?';
    }
    if (statusField73 === 'Available') {
        field73 = '✓';
    } else if (statusField73 === 'Unavailable') {
        field73 = '✗';
    } else if (statusField73 === 'Uncertain') {
        field73 = '?';
    }
    if (statusField74 === 'Available') {
        field74 = '✓';
    } else if (statusField74 === 'Unavailable') {
        field74 = '✗';
    } else if (statusField74 === 'Uncertain') {
        field74 = '?';
    }
    if (statusField75 === 'Available') {
        field75 = '✓';
    } else if (statusField75 === 'Unavailable') {
        field75 = '✗';
    } else if (statusField75 === 'Uncertain') {
        field75 = '?';
    }
    if (statusField81 === 'Available') {
        field81 = '✓';
    } else if (statusField81 === 'Unavailable') {
        field81 = '✗';
    } else if (statusField81 === 'Uncertain') {
        field81 = '?';
    }
    if (statusField82 === 'Available') {
        field82 = '✓';
    } else if (statusField82 === 'Unavailable') {
        field82 = '✗';
    } else if (statusField82 === 'Uncertain') {
        field82 = '?';
    }
    if (statusField83 === 'Available') {
        field83 = '✓';
    } else if (statusField83 === 'Unavailable') {
        field83 = '✗';
    } else if (statusField83 === 'Uncertain') {
        field83 = '?';
    }
    if (statusField84 === 'Available') {
        field84 = '✓';
    } else if (statusField84 === 'Unavailable') {
        field84 = '✗';
    } else if (statusField84 === 'Uncertain') {
        field84 = '?';
    }
    if (statusField85 === 'Available') {
        field85 = '✓';
    } else if (statusField85 === 'Unavailable') {
        field85 = '✗';
    } else if (statusField85 === 'Uncertain') {
        field85 = '?';
    }
    if (statusField91 === 'Available') {
        field91 = '✓';
    } else if (statusField91 === 'Unavailable') {
        field91 = '✗';
    } else if (statusField91 === 'Uncertain') {
        field91 = '?';
    }
    if (statusField92 === 'Available') {
        field92 = '✓';
    } else if (statusField92 === 'Unavailable') {
        field92 = '✗';
    } else if (statusField92 === 'Uncertain') {
        field92 = '?';
    }
    if (statusField93 === 'Available') {
        field93 = '✓';
    } else if (statusField93 === 'Unavailable') {
        field93 = '✗';
    } else if (statusField93 === 'Uncertain') {
        field93 = '?';
    }
    if (statusField94 === 'Available') {
        field94 = '✓';
    } else if (statusField94 === 'Unavailable') {
        field94 = '✗';
    } else if (statusField94 === 'Uncertain') {
        field94 = '?';
    }
    if (statusField95 === 'Available') {
        field95 = '✓';
    } else if (statusField95 === 'Unavailable') {
        field95 = '✗';
    } else if (statusField95 === 'Uncertain') {
        field95 = '?';
    }
    if (statusFielda1 === 'Available') {
        fielda1 = '✓';
    } else if (statusFielda1 === 'Unavailable') {
        fielda1 = '✗';
    } else if (statusFielda1 === 'Uncertain') {
        fielda1 = '?';
    }
    if (statusFielda2 === 'Available') {
        fielda2 = '✓';
    } else if (statusFielda2 === 'Unavailable') {
        fielda2 = '✗';
    } else if (statusFielda2 === 'Uncertain') {
        fielda2 = '?';
    }
    if (statusFielda3 === 'Available') {
        fielda3 = '✓';
    } else if (statusFielda3 === 'Unavailable') {
        fielda3 = '✗';
    } else if (statusFielda3 === 'Uncertain') {
        fielda3 = '?';
    }
    if (statusFielda4 === 'Available') {
        fielda4 = '✓';
    } else if (statusFielda4 === 'Unavailable') {
        fielda4 = '✗';
    } else if (statusFielda4 === 'Uncertain') {
        fielda4 = '?';
    }
    if (statusFielda5 === 'Available') {
        fielda5 = '✓';
    } else if (statusFielda5 === 'Unavailable') {
        fielda5 = '✗';
    } else if (statusFielda5 === 'Uncertain') {
        fielda5 = '?';
    }
    if (statusFieldb1 === 'Available') {
        fieldb1 = '✓';
    } else if (statusFieldb1 === 'Unavailable') {
        fieldb1 = '✗';
    } else if (statusFieldb1 === 'Uncertain') {
        fieldb1 = '?';
    }
    if (statusFieldb2 === 'Available') {
        fieldb2 = '✓';
    } else if (statusFieldb2 === 'Unavailable') {
        fieldb2 = '✗';
    } else if (statusFieldb2 === 'Uncertain') {
        fieldb2 = '?';
    }
    if (statusFieldb3 === 'Available') {
        fieldb3 = '✓';
    } else if (statusFieldb3 === 'Unavailable') {
        fieldb3 = '✗';
    } else if (statusFieldb3 === 'Uncertain') {
        fieldb3 = '?';
    }
    if (statusFieldb4 === 'Available') {
        fieldb4 = '✓';
    } else if (statusFieldb4 === 'Unavailable') {
        fieldb4 = '✗';
    } else if (statusFieldb4 === 'Uncertain') {
        fieldb4 = '?';
    }
    if (statusFieldb5 === 'Available') {
        fieldb5 = '✓';
    } else if (statusFieldb5 === 'Unavailable') {
        fieldb5 = '✗';
    } else if (statusFieldb5 === 'Uncertain') {
        fieldb5 = '?';
    }
    if (statusFieldc1 === 'Available') {
        fieldc1 = '✓';
    } else if (statusFieldc1 === 'Unavailable') {
        fieldc1 = '✗';
    } else if (statusFieldc1 === 'Uncertain') {
        fieldc1 = '?';
    }
    if (statusFieldc2 === 'Available') {
        fieldc2 = '✓';
    } else if (statusFieldc2 === 'Unavailable') {
        fieldc2 = '✗';
    } else if (statusFieldc2 === 'Uncertain') {
        fieldc2 = '?';
    }
    if (statusFieldc3 === 'Available') {
        fieldc3 = '✓';
    } else if (statusFieldc3 === 'Unavailable') {
        fieldc3 = '✗';
    } else if (statusFieldc3 === 'Uncertain') {
        fieldc3 = '?';
    }
    if (statusFieldc4 === 'Available') {
        fieldc4 = '✓';
    } else if (statusFieldc4 === 'Unavailable') {
        fieldc4 = '✗';
    } else if (statusFieldc4 === 'Uncertain') {
        fieldc4 = '?';
    }
    if (statusFieldc5 === 'Available') {
        fieldc5 = '✓';
    } else if (statusFieldc5 === 'Unavailable') {
        fieldc5 = '✗';
    } else if (statusFieldc5 === 'Uncertain') {
        fieldc5 = '?';
    }
    if (statusFieldd1 === 'Available') {
        fieldd1 = '✓';
    } else if (statusFieldd1 === 'Unavailable') {
        fieldd1 = '✗';
    } else if (statusFieldd1 === 'Uncertain') {
        fieldd1 = '?';
    }
    if (statusFieldd2 === 'Available') {
        fieldd2 = '✓';
    } else if (statusFieldd2 === 'Unavailable') {
        fieldd2 = '✗';
    } else if (statusFieldd2 === 'Uncertain') {
        fieldd2 = '?';
    }
    if (statusFieldd3 === 'Available') {
        fieldd3 = '✓';
    } else if (statusFieldd3 === 'Unavailable') {
        fieldd3 = '✗';
    } else if (statusFieldd3 === 'Uncertain') {
        fieldd3 = '?';
    }
    if (statusFieldd4 === 'Available') {
        fieldd4 = '✓';
    } else if (statusFieldd4 === 'Unavailable') {
        fieldd4 = '✗';
    } else if (statusFieldd4 === 'Uncertain') {
        fieldd4 = '?';
    }
    if (statusFieldd5 === 'Available') {
        fieldd5 = '✓';
    } else if (statusFieldd5 === 'Unavailable') {
        fieldd5 = '✗';
    } else if (statusFieldd5 === 'Uncertain') {
        fieldd5 = '?';
    }

    return {
        field11, field12, field13, field14, field15, field21, field22, field23, field24, field25,
        field31, field32, field33, field34, field35, field41, field42, field43, field44, field45,
        field51, field52, field53, field54, field55, field61, field62, field63, field64, field65,
        field71, field72, field73, field74, field75, field81, field82, field83, field84, field85,
        field91, field92, field93, field94, field95, fielda1, fielda2, fielda3, fielda4, fielda5,
        fieldb1, fieldb2, fieldb3, fieldb4, fieldb5, fieldc1, fieldc2, fieldc3, fieldc4, fieldc5,
        fieldd1, fieldd2, fieldd3, fieldd4, fieldd5, notes, name, period
    }
}

/**
 * Revisa si todos los botones se encuentran seleccionados.
 * @param {*} btns...
 * @returns True si todos los botones estan seleccionados. False en caso contrario.
 */
function fullSchedule(check_btn11, check_btn12, check_btn13, check_btn14, check_btn15, check_btn21, check_btn22, check_btn23, check_btn24, check_btn25, check_btn31, check_btn32, check_btn33, check_btn34, check_btn35, check_btn41, check_btn42, check_btn43, check_btn44, check_btn45, check_btn51, check_btn52, check_btn53, check_btn54, check_btn55, check_btn61, check_btn62, check_btn63, check_btn64, check_btn65, check_btn71, check_btn72, check_btn73, check_btn74, check_btn75, check_btn81, check_btn82, check_btn83, check_btn84, check_btn85, check_btn91, check_btn92, check_btn93, check_btn94, check_btn95, check_btna1, check_btna2, check_btna3, check_btna4, check_btna5, check_btnb1, check_btnb2, check_btnb3, check_btnb4, check_btnb5, check_btnc1, check_btnc2, check_btnc3, check_btnc4, check_btnc5, check_btnd1, check_btnd2, check_btnd3, check_btnd4, check_btnd5) {
    var field11 = check_btn11, field12 = check_btn12, field13 = check_btn13, field14 = check_btn14, field15 = check_btn15,
        field21 = check_btn21, field22 = check_btn22, field23 = check_btn23, field24 = check_btn24, field25 = check_btn25,
        field31 = check_btn31, field32 = check_btn32, field33 = check_btn33, field34 = check_btn34, field35 = check_btn35,
        field41 = check_btn41, field42 = check_btn42, field43 = check_btn43, field44 = check_btn44, field45 = check_btn45,
        field51 = check_btn51, field52 = check_btn52, field53 = check_btn53, field54 = check_btn54, field55 = check_btn55,
        field61 = check_btn61, field62 = check_btn62, field63 = check_btn63, field64 = check_btn64, field65 = check_btn65,
        field71 = check_btn71, field72 = check_btn72, field73 = check_btn73, field74 = check_btn74, field75 = check_btn75,
        field81 = check_btn81, field82 = check_btn82, field83 = check_btn83, field84 = check_btn84, field85 = check_btn85,
        field91 = check_btn91, field92 = check_btn92, field93 = check_btn93, field94 = check_btn94, field95 = check_btn95,
        fielda1 = check_btna1, fielda2 = check_btna2, fielda3 = check_btna3, fielda4 = check_btna4, fielda5 = check_btna5,
        fieldb1 = check_btnb1, fieldb2 = check_btnb2, fieldb3 = check_btnb3, fieldb4 = check_btnb4, fieldb5 = check_btnb5,
        fieldc1 = check_btnc1, fieldc2 = check_btnc2, fieldc3 = check_btnc3, fieldc4 = check_btnc4, fieldc5 = check_btnc5,
        fieldd1 = check_btnd1, fieldd2 = check_btnd2, fieldd3 = check_btnd3, fieldd4 = check_btnd4, fieldd5 = check_btnd5;

    return (field11 && field12 && field13 && field14 && field15 && field21 && field22 && field23 && field24 && field25 && field31 && field32 && field33 && field34 && field35 && field41 && field42 && field43 && field44 && field45 && field51 && field52 && field53 && field54 && field55 && field61 && field62 && field63 && field64 && field65 && field71 && field72 && field73 && field74 && field75 && field81 && field82 && field83 && field84 && field85 && field91 && field92 && field93 && field94 && field95 && fielda1 && fielda2 && fielda3 && fielda4 && fielda5 && fieldb1 && fieldb2 && fieldb3 && fieldb4 && fieldb5 && fieldc1 && fieldc2 && fieldc3 && fieldc4 && fieldc5 && fieldd1 && fieldd2 && fieldd3 && fieldd4 && fieldd5);
}

/**
 * scheduleList: Lista de usuarios (id) con un horario.
 * schedules: Arreglo de usuarios con horario definitivo.
 * person: Arreglo compuesto de id del usuario y nombre.
 * schedule: Horario de un usuario.
 * @returns Lista que permite consultar todo usuario con un horario definitivo.
 */
async function Schedules(period) {
    const schedulesList = await Schedule.find();
    const periods = await getPeriods();
    let schedules = [];
    await Promise.all(schedulesList.map(async (element) => {
        if (element.period === period) {
            if (element.final) {
                let person = [];
                person.push(element.id)
                person.push(element.user);
                person.push(await getName(element.user));
                schedules.push(person);
            }
        }
        if (element.active && period == null) {
            if (element.final) {
                let person = [];
                const id = element.user;
                const name = await getName(element.user);
                person.push(element.id);
                person.push(id);
                person.push(name);
                schedules.push(person);
            }
        }
    }));
    if (period == null) {
        period = periods.at(0);
    }
    return { schedules, periods, period };
}

/**
 * Regresa el nombre completo de un usuario
 * @returns Nombre
 */
async function getName(id) {
    const user = await User.findById(id);
    const name = user.name + ' ' + user.last_name + ' ' + user.second_last_name;
    return name;
}

/**
 * Esta función cambia el estado de todas las pretensiones almacenadas a inactivo (activo = false)
 * y genera nuevas pretensiones activas para todos los usuarios que previamente contaban con una.
 * @param {String} period 
 */
async function setPeriod(period) {
    const list = await Schedule.find();
    const periods = await Schedule.distinct('period');

    await Promise.all(list.map(async (element) => {
        const savedPeriod = element.period;
        periods.forEach(async function (aux) {
            if (aux === savedPeriod) {
                let active = false;
                await Schedule.findByIdAndUpdate(element, { active });
            }
        });
    }));

    const schedulesList = await Schedule.distinct('user');
    await Promise.all(schedulesList.map(async (element) => {
        if (!periods.includes(period)) {
            const id = element;
            createSchedule(id, period);
        }
    }));
}

/**
 * Regresa la lista de todos los ciclos escolares.
 * @returns Ciclo Escolar
 */
async function getPeriods() {
    const aux = await Schedule.distinct('period');
    bubbleSort(aux);
    return aux;
}

function bubbleSort(array) {

    for (var i = 0; i <= array.length - 1; i++) {
        for (var j = 0; j < (array.length - i - 1); j++) {
            var a = array[j].split(' ');
            var b = array[j + 1].split(' ');
            if (parseInt(a[2]) < parseInt(b[2])) {
                var temp = array[j]
                array[j] = array[j + 1]
                array[j + 1] = temp
            }
        }
    }
    return array;
}

async function compile(templateName, data) {
    const filePath = path.join(process.cwd(), 'src/views/users/activities/print', templateName);

    const html = await fs.readFile(filePath, 'utf-8');

    return hbs.compile(html)(data);
}
module.exports = router;