import React, { Component } from 'react';
import { Map, fromJS, List } from 'immutable';
import TextInput from '../common/TextInput';
import DateInput from '../common/DateInput';
import RadioInput from '../common/RadioInput';
import Firm from '../common/Firm';
import ApproverFirm from '../common/ApproverFirm';
import Notes from '../common/Notes';
import CheckboxInput from '../common/CheckboxInput';
import NumberInput from '../common/NumberInput';
import NumericTable from '../common/NumericTable';
import TextBoxInput from '../common/TextBoxInput';
import Dropdown from '../common/Dropdown';
import moment from 'moment';

var formApi = require('../../modules/FormApi');
var formApiInstance = new formApi();

const sharepointUrl = _spPageContextInfo.webAbsoluteUrl;
let todayDate = moment();
const eventoTo = [ 'Medicos', 'Publico general', 'Farmacias', 'Medios', 'Fuerza de Ventas'];
const planedExpenses = ['Gatos Planificados', 'Cantidad'];
const booleanOption = [ 'Si', 'No'];
const localidad = [ 'Nacional/Local', 'Internacional'];
const expensesList = List([
    {label: 'Hotel/Alojamiento', id: 'hotel'},
    {label: 'Transporte Aereo', id: 'transporteAereo'},
    {label: 'Transporte Terrestre', id: 'transporteTerrestre'},
    {label: 'Registro/Inscripcion', id: 'registro'},
    {label: 'Speakers', id: 'speakers'},
    {label: 'Otros Servicios del HCP (por ejemplo, Asesoria, Cong Presidente)', id: 'otrosServicios'},
    {label: 'Comidas/Coffee Breaks', id: 'comidas'},
    {label: 'Salones de Reuniones y Conferencias', id: 'salones'},
    {label: 'Equipo de Audio y Video', id: 'equipo'},
    {label: 'Materiales Promocionales', id: 'materiales'},
    {label: 'Otros', id: 'otros'}
]);

const notes = {
    medicManager: [{text: '(Aplica para la validación de programas/agendas científicas de congresos  y eventos regionales o locales organizados por Abbott que impliquen la contratación de un HCP).'}]
};
const form = 'abbott04';
export default class Abbott04 extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount(){
        var formId = this.props.params.id;
        if (formId){
            this.getDataFromList(formId);
        } else {
            formApiInstance.getDataList(sharepointUrl,
                'Approvers',
                form,
                'aprobadores',
                this.props.setField.bind(this)
            );
        }
    }
    getDataFromList(formId) {
        console.log('entered get');
        let keysNames = ['fecha','nombreDelEvento','unidadDeNegocio','localidadDelEvento','racionalDelNegocio','tipoDeEvento','fechaDelEvento','lugar', 'numeroDeAsistentes',
                         'numeroDeHcp', 'empleadosAbbott', 'aMedicos', 'aPublicoGeneral', 'aFarmacias', 'aMedios', 'aFuerzaDeVentas', 'aOtro', 'hotel',
                         'transporteAereo', 'transporteTerrestre', 'registro', 'speakers', 'otrosServicios', 'comidas', 'salones', 'equipo', 'materiales', 'otros',
                         'solicitante', 'fechaFirmaDelSolicitante', 'gerenteDeProducto', 'fechaGerenteDeProducto', 'gerenteDeProductoAprobo', 'gerenteDeDistrito', 'fechaGerenteDeDistrito',
                         'gerenteDeDistritoAprobo', 'gerenteDelPais', 'fechaGerenteDelPais', 'gerenteDelPaisAprobo', 'gerenteMedico', 'fechaGerenteMedico', 'gerenteMedicoAprobo',
                         'gerenteGeneral', 'fechaGerenteGeneral', 'gerenteGeneralAprobo', 'estado', 'eventos', 'producto', 'comentarioRechazo'];
        let data = formApiInstance.getData(sharepointUrl,
            'Abbott04', 
            keysNames, 
            formId, 
            form, 
            this.props.setFormData.bind(this)
            );
    }
    handleSubmit(e){
        e.preventDefault();
        var formApiInstance = new formApi();
        let formState;
        const formId = this.props.params.id;
        if (formId && formId !== undefined && formId !== null && formId !== '' ){
            formState = this.props.abbott04;    
        } else {
            formState = this.props.abbott04.set('solicitante', this.props.user.get('displayName')).set('fechaFirmaDelSolicitante', moment().toISOString()).set('estado', 'Pendiente').set('fecha', moment().toISOString());
        }
        formApiInstance.postData(sharepointUrl,
            'Abbott04',
            'Abbott04',
            formState,
            this.props.params.id
        );
    }
    setGerenteGenetal(){
        console.log('set Gerente General');
        let aprobadores = this.props.abbott04.get('aprobadores').toArray();
        let gerenteGeneral;
        console.log(aprobadores);
        aprobadores.map(function(obj){
            console.log(obj);
            if(obj.Cargo === 'GerenteGeneral'){gerenteGeneral = obj.Title}
        });
        this.props.setField(form, 'gerenteGeneral', gerenteGeneral);
    }
    render() {
        let { abbott04, user } = this.props;
        let fecha = abbott04.get('fecha');
        let today = moment();
        if(abbott04.get('aprobadores').size > 0 && abbott04.get('gerenteGeneral') === ''){ this.setGerenteGenetal(); }
        return (
            <div className='Form MainScreen'>
                <form className='Form-container Abbott04' action="#">
                    <div className='Form-titleContainer'>
                        <span className='Form-text Form-title'>CACMP-DR ABBOTT 004</span>
                        <span className='Form-text Form-state'>Estado: {abbott04.get('estado')}</span>
                        <span className='Form-text Form-state'>Id: {this.props.params.id}</span>
                        <span className='Form-text Form-description'>Racional Del Evento</span>
                    </div>
                    <div className='Form-fieldSet'>
                        <DateInput className='' label='Fecha de Solicitud:' stringDate={(fecha !== undefined && fecha !== null && fecha !== '') ? moment(fecha) : today } form={form} input='fecha' disabled={true}/>
                        <RadioInput 
                            label='Eventos regionales organizados por Abbott' 
                            name='eventos'
                            id='eventos'
                            form={form}
                            selected={abbott04.get('eventos')}
                            options={booleanOption}/>
                        <TextInput label='Nombre del Evento:' value={abbott04.get('nombreDelEvento')} id='nombreDelEvento' form={form} className='Form-textInputBox'/>
                        <TextInput label='Unidad de Negocio:' value={abbott04.get('unidadDeNegocio')} id='unidadDeNegocio' form={form} className='Form-textInputBox'/>
                        <RadioInput 
                            label='Evento Nacional/Local o Internacional:' 
                            name='localidadDelEvento'
                            id='localidadDelEvento'
                            form={form}
                            selected={abbott04.get('localidadDelEvento')}
                            options={localidad}/>
                        <span className='Form-spacer'></span>
                        <span className='Form-label'>Racional del negocio para organizar/patrocinar el evento:</span>
                        <TextBoxInput rows='4' id='racionalDelNegocio' value={abbott04.get('racionalDelNegocio')} form={form}/>
                        <TextInput label='Tipo del Evento:' value={abbott04.get('tipoDeEvento')} id='tipoDeEvento' form={form} className='Form-textInputBox'/>
                        <DateInput className='' label='Fecha de Inicio:' stringDate={abbott04.get('fechaDeInicio')} form={form} input='fechaDeInicio'/>
                        <DateInput className='' label='Fecha de Finalizacion:' stringDate={abbott04.get('fechaDeFinalizacion')} form={form} input='fechaDeFinalizacion'/>
                        <span className='Form-spacer'></span>
                        <span className='Form-label'>Producto o línea de negocio que patrocina:</span>
                        <TextBoxInput rows='3' id='producto' value={abbott04.get('producto')} form={form}/>
                        <TextInput label='Lugar' value={abbott04.get('lugar')} id='lugar' form={form} className='Form-textInputBox'/>
                        <NumberInput label='Número de asistentes si es organizado por Abbott:' id='numeroDeAsistentes' value={abbott04.get('numeroDeAsistentes')} className='Form-textInputBox' form={form}/>
                        <NumberInput label='Número de HCPs patrocinados si es un Congreso:' id='numeroDeHcp' value={abbott04.get('numeroDeHcp')} className='Form-textInputBox' form={form}/>
                        <NumberInput label='Número de Empleados de Abbott asistentes:' id='empleadosAbbott' value={abbott04.get('empleadosAbbott')} className='Form-textInputBox' form={form}/>
                        <span className='Form-label'>Evento dirigido a:</span>
                        <CheckboxInput 
                            className='Checkbox-container--singleOption'
                            label='Medicos'
                            id='aMedicos'
                            value={abbott04.get('aMedicos')} 
                            form={form}/>
                        <CheckboxInput 
                            className='Checkbox-container--singleOption'
                            label='PublicoGeneral'
                            id='aPublicoGeneral'
                            value={abbott04.get('aPublicoGeneral')} 
                            form={form}/>
                        <CheckboxInput 
                            className='Checkbox-container--singleOption'
                            label='Farmacias'
                            id='aFarmacias'
                            value={abbott04.get('aFarmacias')} 
                            form={form}/>
                        <CheckboxInput 
                            className='Checkbox-container--singleOption'
                            label='Medios'
                            id='aMedios'
                            value={abbott04.get('aMedios')} 
                            form={form}/>
                        <CheckboxInput 
                            className='Checkbox-container--singleOption'
                            label='FuerzaDeVentas'
                            id='aFuerzaDeVentas'
                            value={abbott04.get('aFuerzaDeVentas')} 
                            form={form}/>
                        <TextInput label='Otro' value={abbott04.get('aOtro')} id='aOtro' form={form} className='Form-textInputBox'/>
                        <NumericTable className='Form-expensesTable' headerArray={planedExpenses} fields={expensesList} state={abbott04} form={form}/>
                        <Firm label='Nombre del Solicitante' user={user.get('displayName')} solicitante={abbott04.get('solicitante')} stringDate={abbott04.get('fechaFirmaDelSolicitante')} form={form} input='fechaFirmaDelSolicitante' />
                        { (this.props.params.id) ?
                            <ApproverFirm label='Nombre del Gerente de Distrito:' aprobador={abbott04.get('gerenteDeDistrito')} aprobado={abbott04.get('gerenteDeDistritoAprobo')} stringDate={abbott04.get('fechaGerenteDeDistrito')} form={form} dateInput='fechaGerenteDeDistrito' approveInput='gerenteDeDistritoAprobo' user={user.get('displayName')} state={abbott04} />
                            :
                            <Dropdown options={abbott04.get('aprobadores')} label='Seleccione Gerente de Distrito' selected={abbott04.get('gerenteDeDistrito')} input='gerenteDeDistrito' form={form} />
                        }
                        { (this.props.params.id) ?
                            <ApproverFirm label='Nombre del Gerente del Pais:' aprobador={abbott04.get('gerenteDelPais')} aprobado={abbott04.get('gerenteDelPaisAprobo')} stringDate={abbott04.get('fechaGerenteDelPais')} form={form} dateInput='fechaGerenteDelPais' approveInput='gerenteDelPaisAprobo' user={user.get('displayName')} state={abbott04}/>
                            :
                            <Dropdown options={abbott04.get('aprobadores')} label='Seleccione Gerente del Pais' selected={abbott04.get('gerenteDelPais')} input='gerenteDelPais' form={form} />
                        }
                        <span className='Form-label Form-label--under'>Aprobaciones:</span>
                        { (this.props.params.id) ?
                            <ApproverFirm label='Gerente de producto o unidad de Negocio:' aprobador={abbott04.get('gerenteDeProducto')} aprobado={abbott04.get('gerenteDeProductoAprobo')} stringDate={abbott04.get('fechaGerenteDeProducto')} form={form} dateInput='fechaGerenteDeProducto' approveInput='gerenteDeProductoAprobo' user={user.get('displayName')} state={abbott04}/>
                            :
                            <Dropdown options={abbott04.get('aprobadores')} label='Seleccione Gerente de Producto' selected={abbott04.get('gerenteDeProducto')} input='gerenteDeProducto' form={form} />
                        }
                        { (this.props.params.id) ?
                            <ApproverFirm label='Gerente Medico:' aprobador={abbott04.get('gerenteMedico')} aprobado={abbott04.get('gerenteMedicoAprobo')} stringDate={abbott04.get('fechaGerenteMedico')} form={form} dateInput='fechaGerenteMedico' approveInput='gerenteMedicoAprobo' user={user.get('displayName')} state={abbott04}/>
                            :
                            <Dropdown options={abbott04.get('aprobadores')} label='Seleccione Gerente Medico' selected={abbott04.get('gerenteMedico')} input='gerenteMedico' form={form} />
                        }
                        <Notes notes={notes.medicManager} />
                        <ApproverFirm label='Gerente General:' aprobador={abbott04.get('gerenteGeneral')} aprobado={abbott04.get('gerenteGeneralAprobo')} stringDate={abbott04.get('fechaGerenteGeneral')} form={form} dateInput='fechaGerenteGeneral' approveInput='gerenteGeneralAprobo' user={user.get('displayName')} flagGerente={(abbott04.get('gerenteGeneral') === user.get('displayName') && abbott04.get('estado') === 'Pendiente' && abbott04.get('eventos') === 'Si') ? true : false} state={abbott04}/>
                        { (abbott04.get('estado') !== 'Aprobado' && abbott04.get('estado') !== 'Rechazado' ) &&
                            <button className="mui-btn mui-btn--primary" onClick={this.handleSubmit.bind(this)}>Enviar</button>
                        }
                    </div>
                </form>
            </div>
        );
    }
}